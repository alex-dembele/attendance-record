# Fichier: backend/app/schemas/import_history.py
import uuid
import datetime
from pydantic import BaseModel, EmailStr

class UploaderInfo(BaseModel):
    email: EmailStr

    class Config:
        from_attributes = True

class ImportHistoryItem(BaseModel):
    id: uuid.UUID
    file_name: str
    status: str
    uploaded_at: datetime.datetime
    processing_log: str | None = None
    uploaded_by: UploaderInfo

    class Config:
        from_attributes = True