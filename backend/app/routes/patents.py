from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Patent
from app.schemas import PatentCreate, PatentUpdate, Patent as PatentSchema
from app.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[PatentSchema])
def list_my_patents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all patents belonging to the current user."""
    return current_user.patents

@router.post("/", response_model=PatentSchema, status_code=status.HTTP_201_CREATED)
def create_patent(
    patent_in: PatentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new patent record under current user."""
    patent = Patent(**patent_in.model_dump(), user_id=current_user.id)
    db.add(patent)
    db.commit()
    db.refresh(patent)
    return patent

@router.put("/{patent_id}", response_model=PatentSchema)
def update_patent(
    patent_id: int,
    patent_in: PatentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modify a specific patent record."""
    patent = db.query(Patent).filter(
        Patent.patent_id == patent_id,
        Patent.user_id == current_user.id
    ).first()
    if not patent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Patent record not found or unauthorized."
        )
        
    update_data = patent_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(patent, field, val)
        
    db.add(patent)
    db.commit()
    db.refresh(patent)
    return patent

@router.delete("/{patent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patent(
    patent_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific patent record."""
    patent = db.query(Patent).filter(
        Patent.patent_id == patent_id,
        Patent.user_id == current_user.id
    ).first()
    if not patent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Patent record not found or unauthorized."
        )
    db.delete(patent)
    db.commit()
    return
