# Fichier: backend/app/api/v1/endpoints/settings.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.api import deps
from app.models.user_management import User
from app.services import attendance_service
from app.schemas.parameter import ParameterRead # Nous allons créer ce schéma

router = APIRouter()

@router.get("/", response_model=List[ParameterRead])
def get_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role.name != "ADMIN":
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.get_all_parameters(db)

@router.put("/", response_model=List[ParameterRead])
def update_settings(
    params: Dict[str, Any],
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role.name != "ADMIN":
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.update_parameters(db, params)