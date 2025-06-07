from datetime import datetime
from typing import Optional, List
from pydantic import Field, EmailStr
from beanie import Document
from enum import Enum
from models.base import BaseModel as BaseDBModel

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

class TeamMember(Document):
    """Team member model for hackathon management."""
    
    hackathon_id: str = Field(..., description="ID of the hackathon")
    user_id: str = Field(..., description="ID of the user")
    name: str = Field(..., description="Full name of the team member")
    email: EmailStr = Field(..., description="Email address")
    role: TeamMemberRole = Field(..., description="Role in the hackathon")
    permissions: List[Permission] = Field(default_factory=list, description="List of permissions")
    status: TeamMemberStatus = Field(default=TeamMemberStatus.PENDING, description="Status of the member")
    
    # Metadata
    added_by: str = Field(..., description="ID of the user who added this member")
    date_added: datetime = Field(default_factory=datetime.utcnow)
    date_invited: Optional[datetime] = None
    date_joined: Optional[datetime] = None
    last_activity: Optional[datetime] = None
    
    # Settings
    auto_approve: bool = Field(default=False, description="Auto-approve for this role")
    notifications_enabled: bool = Field(default=True, description="Enable notifications")
    
    # Soft delete
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    
    class Settings:
        name = "team_members"
        indexes = [
            [("hackathon_id", 1)],
            [("user_id", 1)],
            [("email", 1)],
            [("role", 1)],
            [("status", 1)],
            [("hackathon_id", 1), ("user_id", 1)],  # Composite index
            [("hackathon_id", 1), ("role", 1)],     # Role-based queries
        ]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "hackathon_id": self.hackathon_id,
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "permissions": [perm.value for perm in self.permissions],
            "status": self.status.value,
            "added_by": self.added_by,
            "date_added": self.date_added.isoformat() + 'Z' if self.date_added else None,
            "date_invited": self.date_invited.isoformat() + 'Z' if self.date_invited else None,
            "date_joined": self.date_joined.isoformat() + 'Z' if self.date_joined else None,
            "last_activity": self.last_activity.isoformat() + 'Z' if self.last_activity else None,
            "auto_approve": self.auto_approve,
            "notifications_enabled": self.notifications_enabled,
            "is_deleted": self.is_deleted,
            "deleted_at": self.deleted_at.isoformat() + 'Z' if self.deleted_at else None,
        } 