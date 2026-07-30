from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ResearchProfile
from app.schemas import User as UserSchema, ResearchProfileCreate, ResearchProfileUpdate, ResearchProfile as ProfileSchema
from app.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_current_user(current_user: User = Depends(get_current_user)):
    """Fetch current logged-in User detail including profile, publications, and patents."""
    return current_user

@router.post("/me/profile", response_model=ProfileSchema, status_code=status.HTTP_201_CREATED)
def create_my_profile(
    profile_in: ResearchProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Instantiate a new Research Profile linked to active User."""
    if current_user.profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Profile already exists. Use PUT /me/profile to edit."
        )
    profile = ResearchProfile(**profile_in.model_dump(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.put("/me/profile", response_model=ProfileSchema)
def update_my_profile(
    profile_in: ResearchProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modify research designation, org, domains, keywords, and bios."""
    profile = current_user.profile
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Profile not found. Create one first utilizing POST /me/profile."
        )
    
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)
        
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/me/profile", response_model=ProfileSchema)
def read_my_profile(current_user: User = Depends(get_current_user)):
    """Fetch current logged-in user profile, raising 404 if not found."""
    if not current_user.profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research Profile has not been created yet."
        )
    return current_user.profile

@router.delete("/me/profile", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete current logged-in user profile, raising 404 if not found."""
    profile = current_user.profile
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research Profile not found."
        )
    db.delete(profile)
    db.commit()
    return

