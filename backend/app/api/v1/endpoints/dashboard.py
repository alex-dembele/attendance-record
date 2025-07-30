# Fichier: backend/app/api/v1/endpoints/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.services import attendance_service # Nous y ajouterons la logique

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(deps.get_db)):
    # La logique de récupération des données sera ajoutée ici
    # Exemple de données que nous allons générer :
    daily_presence = [
        {"name": "Lun", "present": 18}, {"name": "Mar", "present": 22},
        {"name": "Mer", "present": 20}, {"name": "Jeu", "present": 25},
        {"name": "Ven", "present": 23}, {"name": "Sam", "present": 5},
        {"name": "Dim", "present": 2},
    ]
    status_distribution = [
        {"name": "A l'heure", "value": 75, "fill": "#4ade80"},
        {"name": "En retard", "value": 15, "fill": "#facc15"},
        {"name": "Absent", "value": 10, "fill": "#f87171"},
    ]
    return {"daily_presence": daily_presence, "status_distribution": status_distribution}