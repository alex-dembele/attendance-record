# Fichier: backend/app/api/v1/endpoints/attendance.py

import datetime
import shutil
import uuid
from pathlib import Path
from typing import List

from app.api import deps
from app.models.attendance import AttendanceRawImport
from app.models.user_management import User
from app.schemas.work_session import WorkSessionReport
from app.services import attendance_service
from app.tasks.attendance_tasks import process_attendance_file
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
def upload_attendance_file(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Téléverse un fichier de présence Excel/CSV pour un traitement asynchrone.
    Accessible uniquement au rôle ADMIN.
    """
    if current_user.role.name != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour effectuer cette action.",
        )

    # Sauvegarder le fichier localement
    file_id = uuid.uuid4()
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Créer une entrée dans la base de données
    raw_import = AttendanceRawImport(
        id=file_id,
        file_name=file.filename,
        storage_path=str(file_path),
        uploaded_by_id=current_user.id,
    )
    db.add(raw_import)
    db.commit()

    # Lancer la tâche de fond
    process_attendance_file.delay(str(raw_import.id), str(file_path))

    return {
        "message": "Le fichier a été reçu et est en cours de traitement.",
        "import_id": raw_import.id,
    }


@router.get("/reports", response_model=List[WorkSessionReport])
def get_attendance_reports(
    start_date: datetime.date,
    end_date: datetime.date,
    employee_id: str | None = None,
    department_id: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Récupère les rapports de sessions de travail avec filtres.
    Accessible aux rôles ADMIN et RH.
    """
    if current_user.role.name not in ["ADMIN", "RH"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Accès non autorisé."
        )

    sessions = attendance_service.get_work_sessions(
        db=db,
        start_date=start_date,
        end_date=end_date,
        employee_id=employee_id,
        department_id=department_id,
        skip=skip,
        limit=limit,
    )
    return sessions
