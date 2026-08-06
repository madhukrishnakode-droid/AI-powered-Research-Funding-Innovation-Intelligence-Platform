from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, LabResource
from app.schemas import LabResource as LabResourceSchema, LabResourceCreate
from app.auth import get_current_user

router = APIRouter()

MOCK_RESOURCES = [
    {
        "name": "Superconducting Dilution Refrigerator (BlueFors LD400)",
        "resource_type": "Equipment",
        "availability_status": "Available",
        "location": "Quantum Physics Lab, Room 402"
    },
    {
        "name": "High-Throughput Genome Sequencer (Illumina NovaSeq)",
        "resource_type": "Equipment",
        "availability_status": "Booked",
        "location": "Bioinformatics Core, Wing B"
    },
    {
        "name": "Standardized Clinical Image Dataset (NICU MRI Scan Bundle)",
        "resource_type": "Dataset",
        "availability_status": "Available",
        "location": "Data Commons Repository (Internal)"
    }
]

@router.get("/", response_model=List[LabResourceSchema])
def list_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all lab and research resources."""
    resources = db.query(LabResource).filter(LabResource.user_id == current_user.id).all()
    if not resources:
        for r in MOCK_RESOURCES:
            new_r = LabResource(
                user_id=current_user.id,
                name=r["name"],
                resource_type=r["resource_type"],
                availability_status=r["availability_status"],
                location=r["location"]
            )
            db.add(new_r)
        db.commit()
        resources = db.query(LabResource).filter(LabResource.user_id == current_user.id).all()
    return resources

@router.post("/", response_model=LabResourceSchema, status_code=status.HTTP_201_CREATED)
def create_resource(
    resource_in: LabResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register a new lab resource/instrument."""
    res = LabResource(**resource_in.model_dump(), user_id=current_user.id)
    db.add(res)
    db.commit()
    db.refresh(res)
    return res

@router.post("/{resource_id}/book", response_model=LabResourceSchema)
def book_resource(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Book/reserve a specific lab asset, toggling availability."""
    res = db.query(LabResource).filter(LabResource.id == resource_id, LabResource.user_id == current_user.id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    if res.availability_status == "Booked":
        res.availability_status = "Available"
    else:
        res.availability_status = "Booked"
    
    db.add(res)
    db.commit()
    db.refresh(res)
    return res
