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

celery_app.conf.beat_schedule = {
    'send-weekly-report': {
        'task': 'app.tasks.attendance_tasks.send_weekly_attendance_report',
        'schedule': 300.0, # crontab(hour=8, minute=0, day_of_week=1), # Tous les lundis à 8h
    },
}

# Inclure les tâches que Celery doit connaître
celery_app.autodiscover_tasks(["app.tasks"])
