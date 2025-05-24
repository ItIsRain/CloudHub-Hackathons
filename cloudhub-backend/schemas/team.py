from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class TeamBase(BaseModel):
    """Base team schema."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    project_idea: Optional[str] = None
    skills: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    max_size: Optional[int] = Field(default=4, ge=2, le=10)
    looking_for_members: Optional[bool] = True
    communication_channel: Optional[str] = None
    repository_url: Optional[str] = None
    project_board: Optional[str] = None
    timezone: Optional[str] = None

class TeamCreate(TeamBase):
    """Team creation schema."""
    hackathon_id: str

class TeamUpdate(TeamBase):
    """Team update schema."""
    pass

class TeamResponse(TeamBase):
    """Team response schema."""
    id: str
    hackathon_id: str
    leader_id: str
    members: List[str]
    invited_emails: List[str]
    status: str
    current_size: int
    invitation_code: str
    social_links: Dict[str, Any]
    availability: Dict[str, Any]
    milestones: List[Dict[str, Any]]
    resources: List[str]
    feedback: List[Dict[str, Any]]
    mentors: List[str]
    tasks: List[Dict[str, Any]]
    meetings: List[Dict[str, Any]]
    documents: List[Dict[str, Any]]
    analytics: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    class Config:
        from_attributes = True

class TeamJoin(BaseModel):
    """Team join schema."""
    invitation_code: str

class TeamInvite(BaseModel):
    """Team invite schema."""
    emails: List[str]

class MilestoneCreate(BaseModel):
    """Milestone creation schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str
    due_date: Optional[datetime] = None
    priority: str = Field(default="medium", pattern="^(low|medium|high)$") 