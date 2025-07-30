# Fichier: backend/app/schemas/user.py
import uuid
from pydantic import BaseModel, EmailStr

class Role(BaseModel):
    name: str
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

# Schéma pour la création d'un utilisateur
class UserCreate(UserBase):
    password: str
    role_name: str
    first_name: str | None = None 
    last_name: str | None = None  

# Schéma pour lire les informations d'un utilisateur
class UserRead(UserBase):
    id: uuid.UUID
    is_active: bool
    role: Role
    class Config:
        from_attributes = True