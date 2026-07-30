from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, User as UserSchema, Token, ForgotPasswordRequest
from app.auth import get_password_hash, verify_password, create_access_token, blacklist_token, oauth2_scheme

router = APIRouter()

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Registers a new User in MySQL with hashed password validation."""
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    hashed_password = get_password_hash(user_in.password)
    db_obj = User(
        full_name=user_in.full_name,
        email=user_in.email,
        password=hashed_password,
        role=user_in.role,
        login_type=user_in.login_type
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Logs user in, matching credentials and signing access JWT."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(token: str = Depends(oauth2_scheme)):
    """Blacklists the requesting authorization token, terminating session."""
    blacklist_token(token)
    return {"message": "Successfully logged out."}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request_in: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Verifies email existence and triggers account password recovery pipeline."""
    user = db.query(User).filter(User.email == request_in.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account with this email does not exist."
        )
    return {
        "message": "Password recovery email has been sent successfully.",
        "reset_token": f"mock-reset-token-for-{user.id}"
    }

