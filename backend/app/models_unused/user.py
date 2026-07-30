from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="researcher") # researcher, funder, admin
    is_active = Column(Boolean, default=True)

    # Relationships can be defined here, e.g.:
    # proposals = relationship("FundingProposal", back_populates="owner")
