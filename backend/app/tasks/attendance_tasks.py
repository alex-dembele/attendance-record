# Fichier: backend/app/tasks/attendance_tasks.py

import pandas as pd
import logging
import datetime
from jinja2 import Environment, FileSystemLoader
from sqlalchemy.orm import Session
from sqlalchemy import func, case # <-- VÉRIFIEZ CET IMPORT

from app.worker import celery_app
from app.db.base import SessionLocal
from app.models.organization import Employee
from app.models.attendance import AttendanceEntry, AttendanceRawImport, WorkSession
from app.services.attendance_service import upsert_work_sessions
from app.core.email import send_email
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_db_session() -> Session:
    return SessionLocal()

@celery_app.task(bind=True)
def process_attendance_file(self, import_id: str, file_path: str):
    # ... (code de la fonction inchangé) ...
    db = get_db_session()
    raw_import = db.query(AttendanceRawImport).filter(AttendanceRawImport.id == import_id).first()
    if not raw_import:
        db.close()
        return f"Import ID {import_id} not found."

    try:
        raw_import.status = "PROCESSING"
        db.commit()

        df = pd.read_excel(file_path, na_values=['-'])
        df.rename(columns={'Person ID': 'employee_id','Date': 'date','Entry Time': 'entry_time','Exit Time': 'exit_time'}, inplace=True)
        df['employee_id'] = df['employee_id'].astype(str).str.strip("'").str.strip()
        df['date_only'] = pd.to_datetime(df['date'], errors='coerce').dt.date

        entries_created = 0
        for index, row in df.iterrows():
            if pd.isna(row['date_only']):
                logger.warning(f"Ligne {index}: Date invalide, ligne ignorée.")
                continue

            employee = db.query(Employee).filter(Employee.employee_id == row['employee_id']).first()
            if not employee:
                logger.warning(f"Ligne {index}: Employé avec l'ID {row['employee_id']} non trouvé. Ligne ignorée.")
                continue

            if pd.notna(row['entry_time']):
                try:
                    datetime_str = f"{row['date_only']} {row['entry_time']}"
                    entry_timestamp = pd.to_datetime(datetime_str, errors='raise')
                    entry = AttendanceEntry(employee_id=employee.id, timestamp=entry_timestamp, entry_type='IN', raw_import_id=raw_import.id)
                    db.add(entry)
                    entries_created += 1
                except Exception as e:
                    logger.warning(f"Ligne {index}: Impossible de traiter l'heure d'entrée '{row['entry_time']}'. Erreur: {e}")

            if pd.notna(row['exit_time']):
                try:
                    datetime_str = f"{row['date_only']} {row['exit_time']}"
                    exit_timestamp = pd.to_datetime(datetime_str, errors='raise')
                    entry = AttendanceEntry(employee_id=employee.id, timestamp=exit_timestamp, entry_type='OUT', raw_import_id=raw_import.id)
                    db.add(entry)
                    entries_created += 1
                except Exception as e:
                    logger.warning(f"Ligne {index}: Impossible de traiter l'heure de sortie '{row['exit_time']}'. Erreur: {e}")
        
        db.commit()
        raw_import.status = "COMPLETED"
        raw_import.processing_log = f"Successfully processed {len(df)} rows and created {entries_created} entries."
        db.commit()

        if entries_created > 0:
            affected_employee_ids = df['employee_id'].dropna().unique().tolist()
            start_date_str = df['date_only'].dropna().min().strftime('%Y-%m-%d')
            end_date_str = df['date_only'].dropna().max().strftime('%Y-%m-%d')
            calculate_work_sessions_task.delay(affected_employee_ids, start_date_str, end_date_str)
        
        return raw_import.processing_log

    except Exception as e:
        db.rollback()
        raw_import.status = "FAILED"
        raw_import.processing_log = str(e)
        db.commit()
        logger.error(f"Echec du traitement du fichier {file_path}: {e}", exc_info=True)
        raise self.retry(exc=e, countdown=60)
    finally:
        db.close()

@celery_app.task
def calculate_work_sessions_task(employee_ids: list[str], start_date: str, end_date: str):
    logger.info(f"Début du calcul des sessions de travail pour {len(employee_ids)} employés, du {start_date} au {end_date}.")
    db = get_db_session()
    try:
        upsert_work_sessions(db, employee_ids, start_date, end_date)
        logger.info("Calcul des sessions de travail terminé avec succès.")
    except Exception as e:
        logger.error(f"Erreur lors du calcul des sessions de travail : {e}", exc_info=True)
    finally:
        db.close()

@celery_app.task
def send_weekly_attendance_report():
    logger.info("Génération du rapport hebdomadaire...")
    db = get_db_session()
    try:
        today = datetime.date.today()
        start_of_week = today - datetime.timedelta(days=today.weekday() + 7)
        end_of_week = start_of_week + datetime.timedelta(days=6)

        summary_data = db.query(
            func.count(func.distinct(WorkSession.employee_id)).label("present_employees"),
            func.sum(case((WorkSession.status == 'LATE', 1), else_=0)).label("total_lates"),
            func.sum(case((WorkSession.status == 'ABSENT', 1), else_=0)).label("total_absents")
        ).filter(WorkSession.session_date.between(start_of_week, end_of_week)).one()
        
        env = Environment(loader=FileSystemLoader('app/templates/'))
        template = env.get_template('email/weekly_report.html')
        html_content = template.render(
            start_date=start_of_week.strftime('%d/%m/%Y'),
            end_date=end_of_week.strftime('%d/%m/%Y'),
            summary=summary_data
        )
        
        send_email(to=settings.EMAILS_TO_RH, subject="Rapport Hebdomadaire des Présences", html_content=html_content)
        logger.info(f"Rapport hebdomadaire envoyé à {settings.EMAILS_TO_RH}")
    finally:
        db.close()