from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field, HttpUrl
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel
from enum import Enum
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel

class HackathonStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ACTIVE = "active"
    JUDGING = "judging"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class PricingTier(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class Technology(BaseDBModel):
    name: str
    description: str
    icon_url: Optional[HttpUrl] = None

class Prize(BaseDBModel):
    position: int = Field(description="Prize position (1st, 2nd, 3rd, etc)")
    amount: float = Field(description="Prize amount")
    currency: str = Field(default="AED", description="Prize currency")
    description: str = Field(description="Prize description")
    sponsor: Optional[str] = None

class Timeline(BaseDBModel):
    registration_start: datetime
    registration_end: datetime
    event_start: datetime
    event_end: datetime
    judging_start: datetime
    judging_end: datetime
    winners_announcement: datetime

class BillingInfo(BaseDBModel):
    pricing_tier: PricingTier
    base_price: float
    participant_price: float = Field(description="Price per participant")
    total_amount: float
    currency: str = "AED"
    is_paid: bool = False
    payment_date: Optional[datetime] = None
    invoice_id: Optional[str] = None

class Hackathon(Document):
    """Hackathon model."""
    
    # Basic information
    title: str = Field(..., min_length=3, max_length=100)
    slug: str = Field(..., unique=True)
    description: str = Field(..., min_length=10)
    short_description: str = Field(..., max_length=200)
    cover_image: Optional[HttpUrl] = None
    banner_image: Optional[HttpUrl] = None
    
    # Organization
    organizer_id: str = Field(..., description="ID of the organizing user")
    organization_name: str = Field(..., description="Name of the organizing entity")
    organization_logo: Optional[HttpUrl] = None
    
    # Configuration
    status: HackathonStatus = Field(default=HackathonStatus.DRAFT)
    max_participants: int = Field(default=100)
    min_team_size: int = Field(default=1)
    max_team_size: int = Field(default=4)
    is_team_required: bool = Field(default=True)
    
    # Features
    technologies: List[Technology] = Field(default_factory=list)
    prizes: List[Prize] = Field(default_factory=list)
    total_prize_pool: float = Field(default=0)
    timeline: Timeline
    
    # Requirements
    requirements: List[str] = Field(default_factory=list)
    rules: List[str] = Field(default_factory=list)
    judging_criteria: List[str] = Field(default_factory=list)
    
    # Resources
    resources: List[HttpUrl] = Field(default_factory=list)
    submission_template: Optional[str] = None
    
    # Statistics
    registered_participants: int = Field(default=0)
    active_participants: int = Field(default=0)
    submitted_projects: int = Field(default=0)
    total_teams: int = Field(default=0)
    
    # Billing
    billing: BillingInfo
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    
    # Metadata
    tags: List[str] = Field(default_factory=list)
    is_featured: bool = Field(default=False)
    is_private: bool = Field(default=False)
    access_code: Optional[str] = None
    
    class Settings:
        name = "hackathons"
        use_state_management = True
        indexes = [
            # Basic indexes
            IndexModel([("slug", 1)], unique=True, name="idx_hackathon_slug_unique"),
            IndexModel([("organizer_id", 1)], name="idx_hackathon_organizer"),
            IndexModel([("status", 1)], name="idx_hackathon_status"),
            IndexModel([("is_featured", 1)], name="idx_hackathon_featured"),
            # Text search index
            IndexModel(
                [("title", "text"), ("description", "text")],
                name="idx_hackathon_text_search",
                weights={"title": 10, "description": 5}
            )
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