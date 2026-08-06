from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# ==========================================
# RESEARCH PROFILE SCHEMAS
# ==========================================
class ResearchProfileBase(BaseModel):
    organization: str
    designation: str
    research_domain: str
    technology_area: str
    research_interests: Optional[str] = None
    keywords: Optional[str] = None
    bio: Optional[str] = None

class ResearchProfileCreate(ResearchProfileBase):
    pass

class ResearchProfileUpdate(BaseModel):
    organization: Optional[str] = None
    designation: Optional[str] = None
    research_domain: Optional[str] = None
    technology_area: Optional[str] = None
    research_interests: Optional[str] = None
    keywords: Optional[str] = None
    bio: Optional[str] = None

class ResearchProfile(ResearchProfileBase):
    profile_id: int
    user_id: int

    class Config:
        from_attributes = True

# ==========================================
# PUBLICATION SCHEMAS
# ==========================================
class PublicationBase(BaseModel):
    title: str
    authors: str
    journal: str
    publication_year: int
    doi: Optional[str] = None

class PublicationCreate(PublicationBase):
    pass

class PublicationUpdate(BaseModel):
    title: Optional[str] = None
    authors: Optional[str] = None
    journal: Optional[str] = None
    publication_year: Optional[int] = None
    doi: Optional[str] = None

class Publication(PublicationBase):
    publication_id: int
    user_id: int

    class Config:
        from_attributes = True

# ==========================================
# PATENT SCHEMAS
# ==========================================
class PatentBase(BaseModel):
    title: str
    inventor: str
    assignee: str
    technology_domain: str
    filing_date: date

class PatentCreate(PatentBase):
    pass

class PatentUpdate(BaseModel):
    title: Optional[str] = None
    inventor: Optional[str] = None
    assignee: Optional[str] = None
    technology_domain: Optional[str] = None
    filing_date: Optional[date] = None

class Patent(PatentBase):
    patent_id: int
    user_id: int

    class Config:
        from_attributes = True

# ==========================================
# USER SCHEMAS
# ==========================================
class UserBase(BaseModel):
    full_name: str
    email: str
    role: str = "researcher"
    login_type: str = "email"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    login_type: Optional[str] = None

# ==========================================
# REPORT SCHEMAS
# ==========================================
class ReportBase(BaseModel):
    title: str
    report_type: str
    file_size: str
    preview_snippet: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    user_id: int
    generated_date: datetime

    class Config:
        from_attributes = True

# ==========================================
# COLLABORATION SCHEMAS
# ==========================================
class CollaborationBase(BaseModel):
    researcher_name: str
    institution: str
    overlap_topics: str
    collaboration_score: int

class CollaborationCreate(CollaborationBase):
    pass

class Collaboration(CollaborationBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# ==========================================
# LAB RESOURCE SCHEMAS
# ==========================================
class LabResourceBase(BaseModel):
    name: str
    resource_type: str
    availability_status: str
    location: str

class LabResourceCreate(LabResourceBase):
    pass

class LabResource(LabResourceBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# ==========================================
# ALERT SCHEMAS
# ==========================================
class AlertBase(BaseModel):
    alert_type: str
    message: str
    is_read: bool = False

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# ==========================================
# USER SETTINGS SCHEMAS
# ==========================================
class UserSettingBase(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    profile_visibility: str = "public"

class UserSetting(UserSettingBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# ==========================================
# FUNDING SCHEMAS
# ==========================================
class FundingOpportunityBase(BaseModel):
    title: str
    funder: str
    amount_range: str
    deadline: date
    semantic_fit: int = 90
    match_badges: str = "Topic match,Methodology match"

class FundingOpportunityCreate(FundingOpportunityBase):
    pass

class FundingOpportunity(FundingOpportunityBase):
    id: int

    class Config:
        from_attributes = True

# ==========================================
# USER SCHEMAS
# ==========================================
class User(UserBase):
    id: int
    created_at: datetime
    
    # Nested relations (optional for response representation)
    profile: Optional[ResearchProfile] = None
    publications: List[Publication] = []
    patents: List[Patent] = []
    reports: List[Report] = []
    collaborations: List[Collaboration] = []
    lab_resources: List[LabResource] = []
    alerts: List[Alert] = []
    settings: Optional[UserSetting] = None

    class Config:
        from_attributes = True

# ==========================================
# TOKEN SCHEMAS
# ==========================================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str


