from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database import Base
class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    journal = Column(String(255))
    publication_year = Column(Integer)
    doi = Column(String(255))
    created_at = Column(TIMESTAMP)