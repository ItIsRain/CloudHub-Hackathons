from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field, HttpUrl
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel
from enum import Enum
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from bson import ObjectId
from utils.code_generator import generate_access_code

class HackathonStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ACTIVE = "active"
    JUDGING = "judging"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class PricingTier(str, Enum):
    STARTER = "starter"
    GROWTH = "growth"
    SCALE = "scale"

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
    pricing_tier: PricingTier = Field(..., description="Pricing tier (starter, growth, scale)")
    base_price: float = Field(..., description="Base price for the package")
    participant_price: float = Field(default=0, description="Price per participant")
    total_amount: float = Field(..., description="Total amount including base price and participant fees")
    currency: str = Field(default="AED", description="Currency for pricing")
    is_paid: bool = Field(default=False, description="Payment status")
    payment_date: Optional[datetime] = None
    invoice_id: Optional[str] = None

class JudgingCriterion(BaseDBModel):
    """Judging criterion schema."""
    name: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    weight: float = Field(..., ge=0, le=100)

class Challenge(BaseDBModel):
    """Challenge schema."""
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)

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
    management_team: List[str] = Field(default_factory=list, description="List of management team member IDs")
    collaborators: List[str] = Field(default_factory=list, description="List of collaborator IDs")
    co_organizers: List[str] = Field(default_factory=list, description="List of co-organizer IDs")
    
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
    rules: str = Field(default="")
    judging_criteria: List[JudgingCriterion] = Field(default_factory=list)
    challenges: List[Challenge] = Field(default_factory=list)
    
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
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    
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
    
    def to_dict(self) -> dict:
        """Convert hackathon instance to dictionary formatted for API response."""
        # Format timeline dates as ISO strings
        timeline_dict = None
        if self.timeline:
            timeline_dict = {
                'registration_start': self.timeline.registration_start.isoformat() + 'Z' if self.timeline.registration_start else None,
                'registration_end': self.timeline.registration_end.isoformat() + 'Z' if self.timeline.registration_end else None,
                'event_start': self.timeline.event_start.isoformat() + 'Z' if self.timeline.event_start else None,
                'event_end': self.timeline.event_end.isoformat() + 'Z' if self.timeline.event_end else None,
                'judging_start': self.timeline.judging_start.isoformat() + 'Z' if self.timeline.judging_start else None,
                'judging_end': self.timeline.judging_end.isoformat() + 'Z' if self.timeline.judging_end else None,
                'winners_announcement': self.timeline.winners_announcement.isoformat() + 'Z' if self.timeline.winners_announcement else None,
            }
        
        # Format billing info to match expected API response
        billing_dict = None
        if self.billing:
            billing_dict = {
                'package': self.billing.pricing_tier.value,  # Convert enum to string
                'amount': self.billing.total_amount,  # Use total_amount as the main amount
                'currency': self.billing.currency,
                'pricing_tier': self.billing.pricing_tier.value,
                'base_price': self.billing.base_price,
                'participant_price': self.billing.participant_price,
                'total_amount': self.billing.total_amount,
                'is_paid': self.billing.is_paid,
                'payment_date': self.billing.payment_date.isoformat() + 'Z' if self.billing.payment_date else None,
                'invoice_id': self.billing.invoice_id,
            }
        
        base_dict = {
            'id': str(self.id) if self.id else None,  # Convert ObjectId to string
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'short_description': self.short_description,
            'cover_image': str(self.cover_image) if self.cover_image else None,
            'banner_image': str(self.banner_image) if self.banner_image else None,
            'organizer_id': str(self.organizer_id) if self.organizer_id else None,  # Convert ObjectId to string
            'organization_name': self.organization_name,
            'organization_logo': str(self.organization_logo) if self.organization_logo else None,
            'management_team': [str(id) for id in self.management_team] if self.management_team else [],
            'collaborators': [str(id) for id in self.collaborators] if self.collaborators else [],
            'co_organizers': [str(id) for id in self.co_organizers] if self.co_organizers else [],
            'status': self.status,
            'max_participants': self.max_participants,
            'min_team_size': self.min_team_size,
            'max_team_size': self.max_team_size,
            'is_team_required': self.is_team_required,
            'technologies': [tech.dict() for tech in self.technologies] if self.technologies else [],
            'prizes': [prize.dict() for prize in self.prizes] if self.prizes else [],
            'total_prize_pool': float(self.total_prize_pool),
            'timeline': timeline_dict,
            'requirements': self.requirements,
            'rules': self.rules,
            'judging_criteria': [criterion.dict() for criterion in self.judging_criteria] if self.judging_criteria else [],
            'challenges': [challenge.dict() for challenge in self.challenges] if self.challenges else [],
            'resources': [str(resource) for resource in self.resources] if self.resources else [],
            'submission_template': self.submission_template,
            'registered_participants': self.registered_participants,
            'active_participants': self.active_participants,
            'submitted_projects': self.submitted_projects,
            'total_teams': self.total_teams,
            'billing': billing_dict,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updated_at': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
            'published_at': self.published_at.isoformat() + 'Z' if self.published_at else None,
            'tags': self.tags,
            'is_featured': self.is_featured,
            'is_private': self.is_private,
            'access_code': self.access_code,
            'is_deleted': self.is_deleted,
            'deleted_at': self.deleted_at.isoformat() + 'Z' if self.deleted_at else None,
        }
        return base_dict

    def generate_access_code_if_needed(self):
        """Generate access code if not already set."""
        if not self.access_code:
            self.access_code = generate_access_code()

    @before_event([Replace, Insert])
    def update_timestamps(self):
        """Update timestamps and ensure access code before saving."""
        if not self.created_at:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
        # Always ensure there is an access code
        self.generate_access_code_if_needed()

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
        
        if now < self.timeline.event_start:
            self.progress = 0
            self.status = HackathonStatus.DRAFT
        elif now > self.timeline.event_end:
            self.progress = 100
            self.status = HackathonStatus.COMPLETED
        else:
            total_duration = (self.timeline.event_end - self.timeline.event_start).total_seconds()
            elapsed = (now - self.timeline.event_start).total_seconds()
            self.progress = min(100, (elapsed / total_duration) * 100)
            self.status = HackathonStatus.ACTIVE
    
    @classmethod
    async def get_active_hackathons(cls) -> List['Hackathon']:
        """Get all active hackathons."""
        return await cls.find(
            cls.status == HackathonStatus.ACTIVE,
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_upcoming_hackathons(cls) -> List['Hackathon']:
        """Get all upcoming hackathons."""
        return await cls.find(
            cls.status == HackathonStatus.PUBLISHED,
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_completed_hackathons(cls) -> List['Hackathon']:
        """Get all completed hackathons."""
        return await cls.find(
            cls.status == HackathonStatus.COMPLETED,
            cls.is_deleted == False
        ).to_list()