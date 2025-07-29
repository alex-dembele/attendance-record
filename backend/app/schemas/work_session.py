# Fichier: backend/app/schemas/work_session.py
import datetime
import uuid

from app.models.attendance import WorkSession
from pydantic import BaseModel, Field


class EmployeeForReport(BaseModel):
    first_name: str
    last_name: str
    employee_id: str

    class Config:
        from_attributes = True


class WorkSessionReport(BaseModel):
    session_date: datetime.date
    status: WorkSession.SessionStatus
    check_in: datetime.datetime | None = None
    check_out: datetime.datetime | None = None
    worked_hours_seconds: int = Field(0, description="Durée du travail en secondes")
    notes: str | None = None
    employee: EmployeeForReport

    class Config:
        from_attributes = True
