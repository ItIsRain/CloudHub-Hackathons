from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field, HttpUrl
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel
from enum import Enum
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel

class TeamRole(str, Enum):
    LEADER = "leader"
    MEMBER = "member"

class TeamMember(Document):
    user_id: str = Field(..., description="ID of the team member")
    role: TeamRole = Field(default=TeamRole.MEMBER)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    skills: List[str] = Field(default_factory=list)
    contributions: List[str] = Field(default_factory=list)

class TeamStatus(str, Enum):
    FORMING = "forming"  # Still accepting members
    COMPLETE = "complete"  # Team is full
    ACTIVE = "active"  # Working on project
    SUBMITTED = "submitted"  # Project submitted
    DISQUALIFIED = "disqualified"

class Team(BaseDBModel):
    """Team model."""
    
    # Basic information
    name: str = Field(..., min_length=3, max_length=50)
    hackathon_id: str = Field(..., description="ID of the hackathon")
    
    # Team details
    description: str = Field(default="", max_length=500)
    logo: Optional[HttpUrl] = None
    looking_for_members: bool = Field(default=True)
    required_skills: List[str] = Field(default_factory=list)
    
    # Members
    leader_id: str = Field(..., description="ID of the team leader")
    members: List[TeamMember] = Field(default_factory=list)
    max_members: int = Field(default=4)
    
    # Project
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    project_repository: Optional[HttpUrl] = None
    project_demo_url: Optional[HttpUrl] = None
    project_submission_url: Optional[HttpUrl] = None
    technologies_used: List[str] = Field(default_factory=list)
    
    # Status
    status: TeamStatus = Field(default=TeamStatus.FORMING)
    is_disqualified: bool = Field(default=False)
    disqualification_reason: Optional[str] = None
    
    # Judging
    total_score: float = Field(default=0)
    judge_scores: List[dict] = Field(default_factory=list)
    judge_feedback: List[dict] = Field(default_factory=list)
    final_rank: Optional[int] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    
    # Team profile
    skills: List[str] = Field(default_factory=list)
    project_idea: Optional[str] = None
    avatar: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    
    # Communication and collaboration
    communication_channel: Optional[str] = None
    repository_url: Optional[str] = None
    project_board: Optional[str] = None
    meeting_schedule: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Team settings
    invitation_code: Optional[str] = None
    social_links: Dict[str, str] = Field(default_factory=dict)
    timezone: Optional[str] = None
    availability: Dict[str, Any] = Field(default_factory=dict)
    
    # Project tracking
    milestones: List[Dict[str, Any]] = Field(default_factory=list)
    resources: List[str] = Field(default_factory=list)
    feedback: List[Dict[str, Any]] = Field(default_factory=list)
    mentors: List[str] = Field(default_factory=list)
    tasks: List[Dict[str, Any]] = Field(default_factory=list)
    meetings: List[Dict[str, Any]] = Field(default_factory=list)
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Analytics
    analytics: Dict[str, Any] = Field(default_factory=dict)
    
    class Settings:
        name = "teams"
        use_state_management = True
        indexes = [
            # Basic indexes
            IndexModel([("hackathon_id", 1)], name="idx_team_hackathon"),
            IndexModel([("leader_id", 1)], name="idx_team_leader"),
            IndexModel([("status", 1)], name="idx_team_status"),
            IndexModel([("final_rank", 1)], name="idx_team_final_rank"),
            # Text search index
            IndexModel(
                [("name", "text"), ("project_name", "text")],
                name="idx_team_text_search",
                weights={"name": 10, "project_name": 5}
            )
        ]
    
    async def add_member(self, user_id: str) -> bool:
        """Add a member to the team."""
        if user_id not in self.members and len(self.members) < self.max_members:
            self.members.append(TeamMember(user_id=user_id))
            await self.save()
            return True
        return False
    
    async def remove_member(self, user_id: str) -> bool:
        """Remove a member from the team."""
        for member in self.members:
            if member.user_id == user_id:
                self.members.remove(member)
                await self.save()
                return True
        return False
    
    async def add_invited_email(self, email: str) -> bool:
        """Add an email to invited list."""
        # This method is not applicable for Team model
        return False
    
    async def remove_invited_email(self, email: str) -> bool:
        """Remove an email from invited list."""
        # This method is not applicable for Team model
        return False
    
    async def update_project_details(self, data: Dict[str, Any]):
        """Update project-related details."""
        allowed_fields = {
            'project_idea', 'repository_url', 'project_board',
            'communication_channel', 'milestones', 'tasks'
        }
        
        for field, value in data.items():
            if field in allowed_fields:
                setattr(self, field, value)
        
        await self.save()
    
    async def add_milestone(self, milestone: Dict[str, Any]):
        """Add a project milestone."""
        self.milestones.append({
            **milestone,
            'created_at': datetime.utcnow().isoformat(),
            'completed': False
        })
        await self.save()
    
    async def complete_milestone(self, milestone_id: str) -> bool:
        """Mark a milestone as completed."""
        for milestone in self.milestones:
            if milestone.get('id') == milestone_id:
                milestone['completed'] = True
                milestone['completed_at'] = datetime.utcnow().isoformat()
                await self.save()
                return True
        return False
    
    @classmethod
    async def get_by_hackathon(cls, hackathon_id: str) -> List['Team']:
        """Get all teams for a hackathon."""
        return await cls.find(
            cls.hackathon_id == hackathon_id,
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_by_member(cls, user_id: str) -> List['Team']:
        """Get all teams that a user is a member of."""
        return await cls.find(
            cls.members.contains(user_id),
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_by_invitation_code(cls, code: str) -> Optional['Team']:
        """Get team by invitation code."""
        return await cls.find_one(
            cls.invitation_code == code,
            cls.is_deleted == False
        ) 