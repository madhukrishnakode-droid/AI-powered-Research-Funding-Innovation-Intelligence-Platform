from typing import List
from fastapi import APIRouter
from app.schemas.innovation import InnovationProject, InnovationProjectCreate

router = APIRouter()

@router.get("/", response_model=List[InnovationProject])
def list_innovations():
    """Retrieve list of innovation projects."""
    return []

@router.post("/", response_model=InnovationProject)
def create_innovation(project: InnovationProjectCreate):
    """Publish a new innovation initiative."""
    return {
        "id": 1,
        "title": project.title,
        "description": project.description,
        "field": project.field,
        "owner_id": 1
    }
