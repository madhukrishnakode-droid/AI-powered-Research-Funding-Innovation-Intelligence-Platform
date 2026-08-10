from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from app.database import Base
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        Enum("researcher", "funder", "admin"),
        nullable=False,
        default="researcher"
    )
    created_at = Column(TIMESTAMP)