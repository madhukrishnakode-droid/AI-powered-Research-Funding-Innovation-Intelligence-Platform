from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="researcher")
    login_type = Column(String(50), nullable=False, default="email")
    created_at = Column(DateTime, server_default=func.now())

    # Child relationships (cascade delete handled by database layer or ORM context)
    profile = relationship("ResearchProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    publications = relationship("Publication", back_populates="user", cascade="all, delete-orphan")
    patents = relationship("Patent", back_populates="user", cascade="all, delete-orphan")

class ResearchProfile(Base):
    __tablename__ = "Research_Profile"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), unique=True, nullable=False)
    organization = Column(String(255), nullable=False, index=True)
    designation = Column(String(255), nullable=False)
    research_domain = Column(String(255), nullable=False, index=True)
    technology_area = Column(String(255), nullable=False, index=True)
    research_interests = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")

class Publication(Base):
    __tablename__ = "Publications"

    publication_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    authors = Column(Text, nullable=False)
    journal = Column(String(255), nullable=False)
    publication_year = Column(Integer, nullable=False, index=True)
    doi = Column(String(100), nullable=True, index=True)

    user = relationship("User", back_populates="publications")

class Patent(Base):
    __tablename__ = "Patents"

    patent_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    inventor = Column(String(255), nullable=False)
    assignee = Column(String(255), nullable=False)
    technology_domain = Column(String(255), nullable=False, index=True)
    filing_date = Column(Date, nullable=False, index=True)

    user = relationship("User", back_populates="patents")
