# Fichier: backend/app/crud/crud_user.py

import uuid
import datetime
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user_management import User, Role
from app.models.organization import Employee
from app.schemas.user import UserCreate


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Récupère un utilisateur par son adresse e-mail.
    """
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    """
    Récupère une liste paginée de tous les utilisateurs.
    """
    return db.query(User).order_by(User.email).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    """
    Crée un nouvel utilisateur.
    Si le rôle est 'EMPLOYEE', crée et lie une fiche employé correspondante.
    """
    # 1. Vérifier si l'email existe déjà
    db_user_check = get_user_by_email(db, email=user.email)
    if db_user_check:
        raise ValueError("Email already registered")

    # 2. Trouver l'ID du rôle à partir de son nom
    role = db.query(Role).filter(Role.name == user.role_name.upper()).first()
    if not role:
        raise ValueError(f"Le rôle '{user.role_name}' n'existe pas.")

    # 3. Créer l'utilisateur avec un mot de passe haché
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role_id=role.id
    )
    db.add(db_user)
    
    # 4. Si le rôle est EMPLOYEE, créer la fiche employé associée
    if user.role_name.upper() == 'EMPLOYEE':
        # Génère un ID matricule simple et relativement unique
        employee_id_num = int(datetime.datetime.now().timestamp())
        db_employee = Employee(
            # Lier directement via la relation SQLAlchemy pour que la session le sache
            user=db_user,
            employee_id=str(employee_id_num),
            first_name=user.first_name or user.email.split('@')[0],
            last_name=user.last_name or ''
        )
        db.add(db_employee)
    
    # 5. Valider la transaction
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: uuid.UUID) -> User | None:
    """
    Supprime un utilisateur par son ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user