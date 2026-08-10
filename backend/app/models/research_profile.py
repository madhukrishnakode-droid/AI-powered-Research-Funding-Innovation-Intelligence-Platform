from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from app.database import Base
class ResearchProfile(Base):
    __tablename__ = "research_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, nullable=False)
    research_area = Column(String(255))
    affiliation = Column(String(255))
    designation = Column(String(150))
    bio = Column(Text)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)