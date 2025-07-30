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

class LeaveRequestRead(LeaveRequestBase):
    id: uuid.UUID
    status: LeaveRequest.LeaveStatus
    employee_id: uuid.UUID

    class Config:
        from_attributes = True