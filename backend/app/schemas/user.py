# Fichier: backend/app/schemas/user.py
import uuid
from pydantic import BaseModel, EmailStr

# Schéma pour inclure les informations du rôle
class Role(BaseModel):
    name: str
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class User(UserBase):
    id: uuid.UUID
    is_active: bool
    role: Role  # <-- LA LIGNE CRUCIALE QUI A ÉTÉ AJOUTÉE

    class Config:
        from_attributes = True