# Fichier: backend/app/api/deps.py
from typing import Generator

from app.core import security
from app.core.config import settings
from app.crud import crud_user
from app.db.base import SessionLocal
from app.models.user_management import User
from app.schemas.token import TokenData
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/token")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenData(email=payload.get("sub"))
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud_user.get_user_by_email(db, email=token_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
