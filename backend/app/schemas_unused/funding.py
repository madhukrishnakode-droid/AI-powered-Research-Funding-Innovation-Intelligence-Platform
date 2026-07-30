from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class FundingOpportunityBase(BaseModel):
    title: str
    description: str
    amount: float
    deadline: Optional[datetime] = None
    institution: str

class FundingOpportunityCreate(FundingOpportunityBase):
    pass

class FundingOpportunityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    deadline: Optional[datetime] = None
    institution: Optional[str] = None

class FundingOpportunityInDBBase(FundingOpportunityBase):
    id: int

    class Config:
        from_attributes = True

class FundingOpportunity(FundingOpportunityInDBBase):
    pass
