from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Collaboration
from app.schemas import Collaboration as CollaborationSchema, CollaborationCreate
from app.auth import get_current_user

router = APIRouter()

MOCK_PARTNERS = [
    {
        "researcher_name": "Dr. Aris Thorne",
        "institution": "MIT CSAIL",
        "overlap_topics": "Quantum Processing, Superconducting Cubits",
        "collaboration_score": 93
    },
    {
        "researcher_name": "Sarah Jenkins",
        "institution": "Stanford University",
        "overlap_topics": "AI Diagnostics, Neural Image Analysis",
        "collaboration_score": 89
    },
    {
        "researcher_name": "Prof. Kenji Sato",
        "institution": "University of Tokyo",
        "overlap_topics": "Materials Science, Non-equilibrium Kinetics",
        "collaboration_score": 85
    }
]

@router.get("/", response_model=List[CollaborationSchema])
def list_collaborations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve collaborating network partners."""
    partners = db.query(Collaboration).filter(Collaboration.user_id == current_user.id).all()
    if not partners:
        for p in MOCK_PARTNERS:
            new_p = Collaboration(
                user_id=current_user.id,
                researcher_name=p["researcher_name"],
                institution=p["institution"],
                overlap_topics=p["overlap_topics"],
                collaboration_score=p["collaboration_score"]
            )
            db.add(new_p)
        db.commit()
        partners = db.query(Collaboration).filter(Collaboration.user_id == current_user.id).all()
    return partners

@router.post("/", response_model=CollaborationSchema, status_code=status.HTTP_201_CREATED)
def create_collaboration(
    collab_in: CollaborationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register a new research partner connection."""
    collab = Collaboration(**collab_in.model_dump(), user_id=current_user.id)
    db.add(collab)
    db.commit()
    db.refresh(collab)
    return collab
