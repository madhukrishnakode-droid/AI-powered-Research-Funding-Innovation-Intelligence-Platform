from typing import Optional
from pydantic import BaseModel

class InnovationProjectBase(BaseModel):
    title: str
    description: str
    field: str

class InnovationProjectCreate(InnovationProjectBase):
    pass

class InnovationProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    field: Optional[str] = None

class InnovationProjectInDBBase(InnovationProjectBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class InnovationProject(InnovationProjectInDBBase):
    pass
