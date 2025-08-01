# Fichier: backend/app/api/v1/endpoints/users.py

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.models.user_management import User as UserModel
from app.schemas.user import UserRead, UserCreate
from app.crud import crud_user

router = APIRouter()

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: UserModel = Depends(deps.get_current_user)):
    """Get current user."""
    return current_user

@router.get("/", response_model=List[UserRead])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
):
    """Retrieve users (Admin only)."""
    if current_user.role.name != "ADMIN":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    users = crud_user.get_users(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=UserRead)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
):
    """Create new user (Admin only)."""
    if current_user.role.name != "ADMIN":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud_user.create_user(db=db, user=user_in)

@router.delete("/{user_id}", response_model=UserRead)
def delete_user(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
):
    """Delete a user (Admin only)."""
    if current_user.role.name != "ADMIN":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Admins cannot delete themselves")

    # --- LA CORRECTION EST ICI ---
    # On appelle directement la fonction delete_user du CRUD
    user = crud_user.delete_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user