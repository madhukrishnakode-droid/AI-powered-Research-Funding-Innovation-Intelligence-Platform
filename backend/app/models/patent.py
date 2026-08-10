from sqlalchemy import Column, Integer, String, Date, TIMESTAMP
from app.database import Base
class Patent(Base):
    __tablename__ = "patents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    patent_number = Column(String(100))
    filing_date = Column(Date)
    status = Column(String(100))
    created_at = Column(TIMESTAMP)