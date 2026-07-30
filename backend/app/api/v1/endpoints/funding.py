from typing import List
from fastapi import APIRouter
from app.schemas.funding import FundingOpportunity, FundingOpportunityCreate

router = APIRouter()

@router.get("/", response_model=List[FundingOpportunity])
def list_funding():
    """Retrieve all funding opportunities."""
    return []

@router.post("/", response_model=FundingOpportunity)
def create_funding(opportunity: FundingOpportunityCreate):
    """Instantiate a new funding opportunity."""
    return {
        "id": 1,
        "title": opportunity.title,
        "description": opportunity.description,
        "amount": opportunity.amount,
        "deadline": opportunity.deadline,
        "institution": opportunity.institution
    }
