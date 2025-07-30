# Fichier: backend/app/crud/crud_user.py
from sqlalchemy.orm import Session
from app.models.user_management import User, Role
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
import uuid


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    # 1. Trouver l'ID du rôle à partir de son nom
    role = db.query(Role).filter(Role.name == user.role_name.upper()).first()
    if not role:
        raise ValueError(f"Le rôle '{user.role_name}' n'existe pas.")

    # 2. Créer l'utilisateur
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role_id=role.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def delete_user(db: Session, user_to_delete: User) -> None:
    db.delete(user_to_delete)
    db.commit()