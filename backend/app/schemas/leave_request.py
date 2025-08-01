# Fichier: backend/app/schemas/leave_request.py
import uuid
import datetime
from pydantic import BaseModel
from app.models.attendance import LeaveRequest

class LeaveRequestBase(BaseModel):
    start_date: datetime.date
    end_date: datetime.date
    reason: str | None = None

class LeaveRequestCreate(LeaveRequestBase):
    pass

# --- DÉFINITION MANQUANTE À AJOUTER ICI ---
class EmployeeInfo(BaseModel):
    first_name: str
    last_name: str

    class Config:
        from_attributes = True
# -----------------------------------------

class LeaveRequestRead(LeaveRequestBase):
    id: uuid.UUID
    status: LeaveRequest.LeaveStatus
    employee: EmployeeInfo # Utilise la classe définie ci-dessus

    class Config:
        from_attributes = True