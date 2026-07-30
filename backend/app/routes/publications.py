from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Publication
from app.schemas import PublicationCreate, PublicationUpdate, Publication as PublicationSchema
from app.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[PublicationSchema])
def list_my_publications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all publications belonging to the current user."""
    return current_user.publications

@router.post("/", response_model=PublicationSchema, status_code=status.HTTP_201_CREATED)
def create_publication(
    pub_in: PublicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new publication entry under current user."""
    pub = Publication(**pub_in.model_dump(), user_id=current_user.id)
    db.add(pub)
    db.commit()
    db.refresh(pub)
    return pub

@router.put("/{pub_id}", response_model=PublicationSchema)
def update_publication(
    pub_id: int,
    pub_in: PublicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modify a specific publication entry."""
    pub = db.query(Publication).filter(
        Publication.publication_id == pub_id,
        Publication.user_id == current_user.id
    ).first()
    if not pub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Publication entry not found or unauthorized."
        )
        
    update_data = pub_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(pub, field, val)
        
    db.add(pub)
    db.commit()
    db.refresh(pub)
    return pub

@router.delete("/{pub_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publication(
    pub_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific publication entry."""
    pub = db.query(Publication).filter(
        Publication.publication_id == pub_id,
        Publication.user_id == current_user.id
    ).first()
    if not pub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Publication entry not found or unauthorized."
        )
    db.delete(pub)
    db.commit()
    return
