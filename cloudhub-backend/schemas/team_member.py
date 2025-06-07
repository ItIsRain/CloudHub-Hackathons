from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class TeamMemberRole(str, Enum):
    ORGANIZER = "organizer"
    JUDGE = "judge"
    MENTOR = "mentor"
    MEDIA = "media"

class TeamMemberStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    INACTIVE = "inactive"

class Permission(str, Enum):
    ADMIN = "admin"
    MANAGE_TEAMS = "manage_teams"
    MANAGE_SUBMISSIONS = "manage_submissions"
    SEND_COMMUNICATIONS = "send_communications"
    MANAGE_RESOURCES = "manage_resources"
    SCORE_SUBMISSIONS = "score_submissions"

class TeamMemberBase(BaseModel):
    """Base team member schema."""
    name: str = Field(..., description="Full name of the team member")
    email: EmailStr = Field(..., description="Email address")
    role: TeamMemberRole = Field(..., description="Role in the hackathon")
    permissions: List[Permission] = Field(default_factory=list, description="List of permissions")
    auto_approve: bool = Field(default=False, description="Auto-approve for this role")
    notifications_enabled: bool = Field(default=True, description="Enable notifications")

    class Config:
        from_attributes = True

class TeamMemberCreate(TeamMemberBase):
    """Schema for creating a new team member."""
    pass

class TeamMemberUpdate(BaseModel):
    """Schema for updating team member information."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[TeamMemberRole] = None
    permissions: Optional[List[Permission]] = None
    status: Optional[TeamMemberStatus] = None
    auto_approve: Optional[bool] = None
    notifications_enabled: Optional[bool] = None

    class Config:
        from_attributes = True

class TeamMemberResponse(TeamMemberBase):
    """Schema for team member response."""
    id: str
    hackathon_id: str
    user_id: str
    status: TeamMemberStatus
    added_by: str
    date_added: datetime
    date_invited: Optional[datetime] = None
    date_joined: Optional[datetime] = None
    last_activity: Optional[datetime] = None

    class Config:
        from_attributes = True

class RoleConfigRequest(BaseModel):
    """Schema for configuring role settings."""
    description: Optional[str] = None
    permissions: List[Permission] = Field(default_factory=list)
    auto_approve: bool = Field(default=False)
    notifications_enabled: bool = Field(default=True)

    class Config:
        from_attributes = True 