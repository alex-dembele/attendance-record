# Fichier: backend/app/api/v1/endpoints/users.py
from app.api import deps
from app.models.user_management import User as UserModel
from app.schemas.user import User as UserSchema
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: UserModel = Depends(deps.get_current_user)):
    """
    Get current user.
    """
    return current_user
