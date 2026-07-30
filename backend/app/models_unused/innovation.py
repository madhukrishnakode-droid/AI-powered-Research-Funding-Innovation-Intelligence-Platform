from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class InnovationProject(Base):
    __tablename__ = "innovation_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=False)
    field = Column(String(100), index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
