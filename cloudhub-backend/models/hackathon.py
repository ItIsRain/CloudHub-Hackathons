from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel

class Hackathon(BaseDBModel):
    """Hackathon model."""
    
    # Basic information
    title: str
    description: str
    organizer: Link['User']
    organizer_logo: Optional[str] = None
    
    # Event details
    prize_pool: Optional[str] = None
    location: Optional[str] = None
    venue: Optional[str] = None
    start_date: datetime
    end_date: datetime
    status: str = "Upcoming"
    progress: float = 0.0
    
    # Categories and requirements
    categories: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    rules: List[str] = Field(default_factory=list)
    eligibility: List[str] = Field(default_factory=list)
    
    # Media and presentation
    image: Optional[str] = None
    cover_image: Optional[str] = None
    short_description: Optional[str] = None
    
    # Participation limits
    max_participants: Optional[int] = None
    participant_count: int = 0
    team_count: int = 0
    submission_count: int = 0
    mentor_count: int = 0
    judge_count: int = 0
    
    # Timeline and deadlines
    registration_deadline: Optional[datetime] = None
    submission_deadline: Optional[datetime] = None
    judging_deadline: Optional[datetime] = None
    current_phase: str = "registration"
    
    # Features and settings
    featured: bool = False
    registration_status: str = "open"
    difficulty: Optional[str] = None
    mode: Optional[str] = None
    timezone: Optional[str] = None
    
    # Resources and participants
    resources: List[str] = Field(default_factory=list)
    mentors: List[str] = Field(default_factory=list)
    judges: List[str] = Field(default_factory=list)
    sponsors: List[str] = Field(default_factory=list)
    
    # Additional information
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    budget: Dict[str, Any] = Field(default_factory=dict)
    sponsorship_tiers: List[Dict[str, Any]] = Field(default_factory=list)
    application_questions: List[Dict[str, Any]] = Field(default_factory=list)
    custom_fields: Dict[str, Any] = Field(default_factory=dict)
    
    # Analytics and feedback
    analytics: Dict[str, Any] = Field(default_factory=dict)
    feedback: List[Dict[str, Any]] = Field(default_factory=list)
    
    class Settings:
        name = "hackathons"
        use_state_management = True
        indexes = [
            "organizer.id",
            "status",
            "start_date",
            "end_date",
            "featured"
        ]
    
    async def update_counts(self):
        """Update participant counts."""
        from models.user import User
        from models.team import Team
        from models.project import Project
        
        # Update participant count
        self.participant_count = await User.find(
            User.active_hackathons.contains(str(self.id))
        ).count()
        
        # Update team count
        self.team_count = await Team.find(
            Team.hackathon.id == str(self.id),
            Team.is_deleted == False
        ).count()
        
        # Update submission count
        self.submission_count = await Project.find(
            Project.hackathon.id == str(self.id),
            Project.is_deleted == False
        ).count()
        
        await self.save()
    
    def update_progress(self):
        """Update hackathon progress based on timeline."""
        now = datetime.utcnow()
        
        if now < self.start_date:
            self.progress = 0
            self.status = 'Upcoming'
        elif now > self.end_date:
            self.progress = 100
            self.status = 'Completed'
        else:
            total_duration = (self.end_date - self.start_date).total_seconds()
            elapsed = (now - self.start_date).total_seconds()
            self.progress = min(100, (elapsed / total_duration) * 100)
            self.status = 'Active'
    
    @classmethod
    async def get_active_hackathons(cls) -> List['Hackathon']:
        """Get all active hackathons."""
        return await cls.find(
            cls.status == 'Active',
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_upcoming_hackathons(cls) -> List['Hackathon']:
        """Get all upcoming hackathons."""
        return await cls.find(
            cls.status == 'Upcoming',
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_completed_hackathons(cls) -> List['Hackathon']:
        """Get all completed hackathons."""
        return await cls.find(
            cls.status == 'Completed',
            cls.is_deleted == False
        ).to_list() 