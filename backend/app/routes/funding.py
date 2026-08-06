from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, FundingOpportunity
from app.schemas import FundingOpportunity as FundingOpportunitySchema, FundingOpportunityCreate
from app.auth import get_current_user
from datetime import date

router = APIRouter()

# Default Seed Data if DB is empty
MOCK_OPPORTUNITIES = [
    {
        "id": 1,
        "title": "Quantum Computing & Information Science Grant Initiative",
        "funder": "National Science Foundation (NSF)",
        "amount_range": "$150,000 - $500,000",
        "deadline": date(2026, 12, 1),
        "semantic_fit": 96,
        "match_badges": "Topic match,Methodology match,PI overlap"
    },
    {
        "id": 2,
        "title": "Decarbonization Technologies & Clean Energy Innovation",
        "funder": "U.S. Department of Energy (DOE)",
        "amount_range": "$500,000 - $1,200,000",
        "deadline": date(2026, 10, 15),
        "semantic_fit": 88,
        "match_badges": "Methodology match,Equipment overlap"
    },
    {
        "id": 3,
        "title": "AI in Translational Medicine & Deep Pathology Diagnostics",
        "funder": "National Institutes of Health (NIH)",
        "amount_range": "$250,000 - $600,000",
        "deadline": date(2026, 11, 30),
        "semantic_fit": 94,
        "match_badges": "Topic match,Co-author match"
    },
    {
        "id": 4,
        "title": "Advanced Materials Research & Nanotechnology Grants",
        "funder": "Defense Advanced Research Projects Agency (DARPA)",
        "amount_range": "$300,000 - $800,000",
        "deadline": date(2026, 9, 20),
        "semantic_fit": 75,
        "match_badges": "Topic match"
    }
]

@router.get("/", response_model=List[FundingOpportunitySchema])
def list_funding_opportunities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List funding opportunities recommended for the current user."""
    # Try fetching from DB first
    db_items = db.query(FundingOpportunity).all()
    if not db_items:
        # Seed in DB for convenience
        for op in MOCK_OPPORTUNITIES:
            db_op = FundingOpportunity(
                title=op["title"],
                funder=op["funder"],
                amount_range=op["amount_range"],
                deadline=op["deadline"],
                semantic_fit=op["semantic_fit"],
                match_badges=op["match_badges"]
            )
            db.add(db_op)
        db.commit()
        db_items = db.query(FundingOpportunity).all()

    # Dynamic adaptation based on user interests if available
    results = []
    interests = ""
    if current_user.profile and current_user.profile.research_interests:
        interests = current_user.profile.research_interests.lower()
    
    for item in db_items:
        fit_score = item.semantic_fit
        badges = item.match_badges.split(",")
        
        # If user has profile details matching the title/funder, boost fit score
        if interests:
            matches = [word for word in interests.split() if len(word) > 4 and word in item.title.lower()]
            if matches:
                fit_score = min(99, fit_score + 5)
                if "Topic match" not in badges:
                    badges.append("Topic match")

        results.append({
            "id": item.id,
            "title": item.title,
            "funder": item.funder,
            "amount_range": item.amount_range,
            "deadline": item.deadline,
            "semantic_fit": fit_score,
            "match_badges": ",".join(badges)
        })

    # Sort by semantic fit in descending order
    results.sort(key=lambda x: x["semantic_fit"], reverse=True)
    return results

@router.post("/", response_model=FundingOpportunitySchema, status_code=status.HTTP_201_CREATED)
def create_funding_opportunity(
    opportunity_in: FundingOpportunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new funding opportunity."""
    op = FundingOpportunity(**opportunity_in.model_dump())
    db.add(op)
    db.commit()
    db.refresh(op)
    return op
