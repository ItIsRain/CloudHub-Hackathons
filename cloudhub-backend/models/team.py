from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel

class Team(BaseDBModel):
    """Team model."""
    
    # Basic information
    name: str
    hackathon: Link['Hackathon']
    leader: Link['User']
    
    # Team details
    members: List[str] = Field(default_factory=list)  # List of user IDs
    invited_emails: List[str] = Field(default_factory=list)
    status: str = "forming"  # forming, complete, locked
    max_size: int = 4
    current_size: int = 1
    looking_for_members: bool = True
    
    # Team profile
    skills: List[str] = Field(default_factory=list)
    project_idea: Optional[str] = None
    avatar: Optional[str] = None
    description: Optional[str] = None
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
            "hackathon.id",
            "leader.id",
            "members",
            "invitation_code",
            "status"
        ]
    
    async def add_member(self, user_id: str) -> bool:
        """Add a member to the team."""
        if user_id not in self.members and len(self.members) < self.max_size:
            self.members.append(user_id)
            self.current_size = len(self.members)
            if self.current_size >= self.max_size:
                self.looking_for_members = False
                self.status = 'complete'
            await self.save()
            return True
        return False
    
    async def remove_member(self, user_id: str) -> bool:
        """Remove a member from the team."""
        if user_id in self.members and user_id != str(self.leader.id):
            self.members.remove(user_id)
            self.current_size = len(self.members)
            self.looking_for_members = True
            self.status = 'forming'
            await self.save()
            return True
        return False
    
    async def add_invited_email(self, email: str) -> bool:
        """Add an email to invited list."""
        if email not in self.invited_emails:
            self.invited_emails.append(email)
            await self.save()
            return True
        return False
    
    async def remove_invited_email(self, email: str) -> bool:
        """Remove an email from invited list."""
        if email in self.invited_emails:
            self.invited_emails.remove(email)
            await self.save()
            return True
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
            cls.hackathon.id == hackathon_id,
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