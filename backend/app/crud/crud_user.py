from app.models.user_management import User
from sqlalchemy.orm import Session


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()
