from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.core.database import Base

class FundingOpportunity(Base):
    __tablename__ = "funding_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    deadline = Column(DateTime, nullable=True)
    institution = Column(String(255), index=True, nullable=False)
