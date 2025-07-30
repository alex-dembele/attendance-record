from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services import attendance_service
from app.schemas.dashboard import DashboardData
from app.models.user_management import User

router = APIRouter()


@router.get("/summary-last-7-days")
def get_summary_last_7_days(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Récupère un résumé de la présence sur les 7 derniers jours.
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.get_attendance_summary_last_7_days(db)


@router.get("/status-distribution")
def get_status_distribution(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Récupère la répartition des statuts de présence.
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.get_status_distribution(db)


@router.get("/kpis", response_model=DashboardData)
def get_kpis(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Récupère toutes les données agrégées pour le dashboard (KPIs, etc.).
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    return attendance_service.get_dashboard_data(db)