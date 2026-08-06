from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, func, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="researcher")
    login_type = Column(String(50), nullable=False, default="email")
    google_id = Column(String(255), unique=True, nullable=True)
    profile_picture = Column(String(500), nullable=True)
    auth_provider = Column(String(50), nullable=False, default="email")
    created_at = Column(DateTime, server_default=func.now())

    # Child relationships (cascade delete handled by database layer or ORM context)
    profile = relationship("ResearchProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    publications = relationship("Publication", back_populates="user", cascade="all, delete-orphan")
    patents = relationship("Patent", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    collaborations = relationship("Collaboration", back_populates="user", cascade="all, delete-orphan")
    lab_resources = relationship("LabResource", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")

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

class FundingOpportunity(Base):
    __tablename__ = "Funding_Opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    funder = Column(String(255), index=True, nullable=False)
    amount_range = Column(String(100), nullable=False)
    deadline = Column(Date, nullable=False)
    semantic_fit = Column(Integer, default=90)
    match_badges = Column(String(255), default="Topic match,Methodology match")

class Report(Base):
    __tablename__ = "Reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    report_type = Column(String(50), nullable=False)
    generated_date = Column(DateTime, server_default=func.now())
    file_size = Column(String(50), nullable=False)
    preview_snippet = Column(Text, nullable=True)

    user = relationship("User", back_populates="reports")

class Collaboration(Base):
    __tablename__ = "Collaborations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    researcher_name = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    overlap_topics = Column(String(500), nullable=False)
    collaboration_score = Column(Integer, nullable=False)

    user = relationship("User", back_populates="collaborations")

class LabResource(Base):
    __tablename__ = "Lab_Resources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    resource_type = Column(String(100), nullable=False)
    availability_status = Column(String(50), nullable=False, default="Available")
    location = Column(String(255), nullable=False)

    user = relationship("User", back_populates="lab_resources")

class Alert(Base):
    __tablename__ = "Alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    alert_type = Column(String(50), nullable=False)
    message = Column(String(500), nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    is_read = Column(Boolean, default=False)

    user = relationship("User", back_populates="alerts")

class UserSetting(Base):
    __tablename__ = "User_Settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), unique=True, nullable=False)
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    profile_visibility = Column(String(50), default="public")

    user = relationship("User", back_populates="settings")

