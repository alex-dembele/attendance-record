# Fichier: backend/app/api/v1/endpoints/leaves.py

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user_management import User
from app.schemas.leave_request import LeaveRequestCreate, LeaveRequestRead
from app.services import attendance_service

router = APIRouter()

@router.post("/", response_model=LeaveRequestRead, status_code=status.HTTP_201_CREATED)
def create_leave_request(
    request_in: LeaveRequestCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Crée une nouvelle demande de permission pour l'employé connecté.
    """
    if not current_user.employee:
        raise HTTPException(status_code=403, detail="Cet utilisateur n'est pas un employé.")
    
    return attendance_service.create_leave_request(db, employee_id=current_user.employee.id, request_in=request_in)

@router.get("/my-requests", response_model=List[LeaveRequestRead])
def get_my_requests(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Récupère toutes les demandes de l'employé connecté.
    """
    if not current_user.employee:
        raise HTTPException(status_code=403, detail="Cet utilisateur n'est pas un employé.")
    
    return attendance_service.get_requests_for_employee(db, employee_id=current_user.employee.id)

@router.get("/pending", response_model=List[LeaveRequestRead])
def get_pending_requests(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Récupère toutes les demandes en attente (pour les RH/Managers).
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.get_pending_requests(db)

@router.post("/{request_id}/approve", response_model=LeaveRequestRead)
def approve_request(
    request_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Approuve une demande de permission.
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    
    db_request = attendance_service.get_request_by_id(db, request_id)
    if not db_request or db_request.status != 'PENDING':
        raise HTTPException(status_code=404, detail="Demande non trouvée ou déjà traitée.")
    
    return attendance_service.approve_leave_request(db, db_request, current_user)

@router.post("/{request_id}/reject", response_model=LeaveRequestRead)
def reject_request(
    request_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Refuse une demande de permission.
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")

    db_request = attendance_service.get_request_by_id(db, request_id)
    if not db_request or db_request.status != 'PENDING':
        raise HTTPException(status_code=404, detail="Demande non trouvée ou déjà traitée.")
    
    return attendance_service.reject_leave_request(db, db_request, current_user)

@router.get("/all", response_model=List[LeaveRequestRead])
def get_all_requests(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.get_all_leave_requests(db)