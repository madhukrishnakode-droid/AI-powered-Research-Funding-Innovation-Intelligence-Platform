from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieves a user by email address."""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, obj_in: UserCreate) -> User:
    """Inserts a new user record utilizing password encryption hash."""
    db_obj = User(
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        full_name=obj_in.full_name,
        role=obj_in.role,
        is_active=obj_in.is_active
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticates user credentials, matching passwords and returning the model user."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
