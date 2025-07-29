# Fichier: backend/app/schemas/user.py
import uuid

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class User(UserBase):
    id: uuid.UUID
    is_active: bool

    class Config:
        from_attributes = True  # anciennement orm_mode
