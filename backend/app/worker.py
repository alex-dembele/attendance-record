# Fichier: backend/app/worker.py
from app.core.config import settings
from celery import Celery

celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.attendance_tasks"],
)

celery_app.conf.update(
    task_track_started=True,
)

# Inclure les tâches que Celery doit connaître
celery_app.autodiscover_tasks(["app.tasks"])
