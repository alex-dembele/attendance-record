# Fichier: backend/app/core/config.py
from pydantic import EmailStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FIRST_SUPERUSER_EMAIL: EmailStr
    FIRST_SUPERUSER_PASSWORD: str
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    SMTP_HOST: str 
    SMTP_PORT: int =1025
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAILS_FROM_EMAIL: str
    EMAILS_TO_RH: str

    class Config:
        env_file = "../.env"


settings = Settings()
