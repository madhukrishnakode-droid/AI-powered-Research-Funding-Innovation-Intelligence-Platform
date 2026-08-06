from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserSetting
from app.schemas import UserSetting as UserSettingSchema, UserSettingBase
from app.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=UserSettingSchema)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve settings configuration for the logged-in user."""
    settings = current_user.settings
    if not settings:
        settings = UserSetting(
            user_id=current_user.id,
            email_notifications=True,
            push_notifications=True,
            profile_visibility="public"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/", response_model=UserSettingSchema)
def update_user_settings(
    settings_in: UserSettingBase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modify user notification, account preferences, or profile visibility rules."""
    settings = current_user.settings
    if not settings:
        settings = UserSetting(user_id=current_user.id)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(settings, field, val)
        
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings
