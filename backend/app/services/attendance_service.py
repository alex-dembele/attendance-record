# Fichier: backend/app/services/attendance_service.py

import datetime
import uuid
from typing import List

import pandas as pd
import sqlalchemy as sa
from app.models.attendance import AttendanceEntry, WorkSession
from app.models.organization import Department, Employee
from app.models.attendance import AttendanceRawImport
from app.models.attendance import LeaveRequest
from app.models.user_management import User
from app.schemas.leave_request import LeaveRequestCreate
from app.models.attendance import AppParameter
from typing import Dict, Any
from app.schemas.dashboard import KpiData, TopLateEmployee, DashboardData
from sqlalchemy import extract
from sqlalchemy import and_
from sqlalchemy.orm import Session

# Constantes pour la logique métier (seront rendues configurables plus tard)
BREAK_START_TIME = datetime.time(12, 30)
BREAK_END_TIME = datetime.time(14, 30)
BREAK_DURATION_SECONDS = 2 * 3600  # 2 heures
LATE_TOLERANCE_MINUTES = 10  # 10 minutes de tolérance


def upsert_work_sessions(
    db: Session, employee_ids: list[str], start_date: str, end_date: str
):
    """
    Calcule et met à jour les sessions de travail pour une liste d'employés sur une période donnée.
    """
    employees = db.query(Employee).filter(Employee.employee_id.in_(employee_ids)).all()

    for employee in employees:
        schedule_start_time = datetime.time(8, 30)
        date_range = pd.date_range(start=start_date, end=end_date)
        for single_date in date_range:
            entries = (
                db.query(AttendanceEntry)
                .filter(
                    and_(
                        AttendanceEntry.employee_id == employee.id,
                        sa.func.date(AttendanceEntry.timestamp) == single_date.date(),
                    )
                )
                .order_by(AttendanceEntry.timestamp)
                .all()
            )

            check_in_entry = next((e for e in entries if e.entry_type == "IN"), None)
            check_out_entry = next(
                (e for e in reversed(entries) if e.entry_type == "OUT"), None
            )

            status = WorkSession.SessionStatus.ABSENT
            worked_seconds = 0
            break_deduction = 0
            notes = ""

            if check_in_entry:
                tolerance_delta = datetime.timedelta(minutes=LATE_TOLERANCE_MINUTES)
                scheduled_check_in = datetime.datetime.combine(
                    single_date, schedule_start_time
                )

                if check_in_entry.timestamp <= scheduled_check_in + tolerance_delta:
                    status = WorkSession.SessionStatus.ON_TIME
                else:
                    status = WorkSession.SessionStatus.LATE

                if check_out_entry:
                    duration = check_out_entry.timestamp - check_in_entry.timestamp
                    worked_seconds = duration.total_seconds()

                    if (
                        check_in_entry.timestamp.time() < BREAK_START_TIME
                        and check_out_entry.timestamp.time() > BREAK_END_TIME
                    ):
                        break_deduction = BREAK_DURATION_SECONDS

                    worked_seconds -= break_deduction
                else:
                    notes = "Pointage de sortie manquant."

            work_session = (
                db.query(WorkSession)
                .filter_by(employee_id=employee.id, session_date=single_date.date())
                .first()
            )
            if not work_session:
                work_session = WorkSession(
                    employee_id=employee.id, session_date=single_date.date()
                )
                db.add(work_session)

            work_session.status = status
            work_session.check_in = check_in_entry.timestamp if check_in_entry else None
            work_session.check_out = (
                check_out_entry.timestamp if check_out_entry else None
            )
            work_session.worked_hours_seconds = max(0, worked_seconds)
            work_session.break_deduction_seconds = break_deduction
            work_session.notes = notes

    db.commit()


def get_work_sessions(
    db: Session,
    start_date: datetime.date,
    end_date: datetime.date,
    employee_id: str | None = None,
    department_id: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 100,
) -> List[WorkSession]:
    """
    Récupère les sessions de travail avec des filtres et une pagination.
    """
    query = db.query(WorkSession).filter(
        and_(
            WorkSession.session_date >= start_date, WorkSession.session_date <= end_date
        )
    )

    if employee_id:
        query = query.join(Employee).filter(Employee.employee_id == employee_id)

    if department_id:
        query = query.join(Employee).filter(Employee.department_id == department_id)

    return (
        query.order_by(WorkSession.session_date.desc()).offset(skip).limit(limit).all()
    )

def get_import_history(db: Session, skip: int = 0, limit: int = 100) -> List[AttendanceRawImport]:
    """
    Récupère l'historique des fichiers importés.
    """
    return db.query(AttendanceRawImport).order_by(AttendanceRawImport.uploaded_at.desc()).offset(skip).limit(limit).all()

def create_leave_request(db: Session, employee_id: uuid.UUID, request_in: LeaveRequestCreate) -> LeaveRequest:
    db_request = LeaveRequest(
        employee_id=employee_id,
        start_date=request_in.start_date,
        end_date=request_in.end_date,
        reason=request_in.reason,
        status='PENDING'
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_pending_requests(db: Session) -> List[LeaveRequest]:
    return db.query(LeaveRequest).filter(LeaveRequest.status == 'PENDING').all()

def get_request_by_id(db: Session, request_id: uuid.UUID) -> LeaveRequest | None:
    return db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()

def approve_leave_request(db: Session, db_request: LeaveRequest, approver: User) -> LeaveRequest:
    db_request.status = 'APPROVED'
    db_request.approver_user_id = approver.id

    # Logique métier : mettre à jour ou créer les WorkSessions
    date_range = pd.date_range(start=db_request.start_date, end=db_request.end_date)
    for single_date in date_range:
        work_session = db.query(WorkSession).filter_by(
            employee_id=db_request.employee_id, 
            session_date=single_date.date()
        ).first()

        if not work_session:
            work_session = WorkSession(employee_id=db_request.employee_id, session_date=single_date.date())
            db.add(work_session)

        work_session.status = 'ON_LEAVE'
        work_session.worked_hours_seconds = 8 * 3600 # Créditer 8h par défaut
        work_session.notes = f"Permission approuvée. Raison: {db_request.reason}"

    db.commit()
    db.refresh(db_request)
    return db_request

def reject_leave_request(db: Session, db_request: LeaveRequest, approver: User) -> LeaveRequest:
    db_request.status = 'REJECTED'
    db_request.approver_user_id = approver.id
    db.commit()
    db.refresh(db_request)
    return db_request

def get_requests_for_employee(db: Session, employee_id: uuid.UUID) -> List[LeaveRequest]:
    return db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee_id).order_by(LeaveRequest.start_date.desc()).all()

def get_all_parameters(db: Session) -> List[AppParameter]:
    return db.query(AppParameter).all()

def update_parameters(db: Session, params_to_update: Dict[str, Any]):
    for key, value in params_to_update.items():
        param = db.query(AppParameter).filter(AppParameter.key == key).first()
        if param:
            param.value = value
    db.commit()
    return get_all_parameters(db)

def get_all_leave_requests(db: Session, skip: int = 0, limit: int = 100) -> List[LeaveRequest]:
    return db.query(LeaveRequest).order_by(LeaveRequest.created_at.desc()).offset(skip).limit(limit).all()

def get_dashboard_data(db: Session) -> DashboardData:
    today = datetime.date.today()
    start_of_month = today.replace(day=1)
    start_of_week = today - datetime.timedelta(days=today.weekday())

    # KPI 1: Taux de présence (30 derniers jours)
    thirty_days_ago = today - datetime.timedelta(days=30)
    total_sessions = db.query(WorkSession).filter(WorkSession.session_date >= thirty_days_ago).count()
    present_sessions = db.query(WorkSession).filter(WorkSession.session_date >= thirty_days_ago, WorkSession.status != 'ABSENT').count()
    attendance_rate = (present_sessions / total_sessions) * 100 if total_sessions > 0 else 100

    # KPI 2: Heures Supp. (Mois) - Placeholder
    overtime_hours_month = 0 # La logique d'heures supp n'est pas encore implémentée

    # KPI 3: Alertes de Retard (Semaine)
    late_alerts_week = db.query(WorkSession).filter(WorkSession.session_date >= start_of_week, WorkSession.status == 'LATE').count()

    kpis = KpiData(
        attendance_rate=round(attendance_rate, 1),
        overtime_hours_month=overtime_hours_month,
        late_alerts_week=late_alerts_week
    )

    # Top 5 des employés en retard ce mois-ci
    top_late_employees_query = db.query(
        Employee.first_name,
        Employee.last_name,
        func.count(WorkSession.id).label("late_count")
    ).join(Employee).filter(
        WorkSession.status == 'LATE',
        extract('month', WorkSession.session_date) == today.month,
        extract('year', WorkSession.session_date) == today.year
    ).group_by(Employee.id).order_by(func.count(WorkSession.id).desc()).limit(5).all()

    top_late_employees = [TopLateEmployee(first_name=r.first_name, last_name=r.last_name, late_count=r.late_count) for r in top_late_employees_query]

    return DashboardData(kpis=kpis, top_late_employees=top_late_employees)