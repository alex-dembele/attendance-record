# Fichier: backend/app/crud/crud_user.py

from sqlalchemy.orm import Session, joinedload # <-- Importer joinedload
import uuid
import datetime

from app.models.user_management import User, Role
from app.models.organization import Employee
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    # Charger les rôles en même temps pour éviter le même problème sur la liste
    return db.query(User).options(joinedload(User.role)).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    role = db.query(Role).filter(Role.name == user.role_name.upper()).first()
    if not role:
        raise ValueError(f"Le rôle '{user.role_name}' n'existe pas.")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role_id=role.id
    )
    db.add(db_user)

    if user.role_name.upper() == 'EMPLOYEE':
        employee_id_num = int(datetime.datetime.now().timestamp())
        db_employee = Employee(
            user_id=db_user.id,
            employee_id=str(employee_id_num),
            first_name=user.first_name or user.email.split('@')[0],
            last_name=user.last_name or ''
        )
        # SQLAlchemy est assez intelligent pour gérer la relation inverse,
        # mais lier directement est plus explicite.
        db_user.employee = db_employee
        db.add(db_employee)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: uuid.UUID) -> User | None:
    # --- LA CORRECTION EST ICI ---
    # On utilise options(joinedload(User.role)) pour charger le rôle immédiatement
    user = db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()

    if user:
        db.delete(user)
        db.commit()

    return user