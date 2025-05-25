from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl
from enum import Enum

class HackathonStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ACTIVE = "active"
    JUDGING = "judging"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class Technology(BaseModel):
    """Technology schema."""
    name: str
    description: str
    icon_url: Optional[HttpUrl] = None

class Prize(BaseModel):
    """Prize schema."""
    position: int = Field(..., ge=1)
    amount: float = Field(..., ge=0)
    currency: str = Field(default="AED")
    description: str
    sponsor: Optional[str] = None

class Timeline(BaseModel):
    """Timeline schema."""
    registration_start: str  # ISO format date string
    registration_end: str    # ISO format date string
    event_start: str        # ISO format date string
    event_end: str          # ISO format date string
    judging_start: str      # ISO format date string
    judging_end: str        # ISO format date string
    winners_announcement: str # ISO format date string

class PricingTier(BaseModel):
    """Pricing tier schema."""
    name: str
    price: float
    features: List[str]
    is_recommended: bool = False

class BillingInfo(BaseModel):
    """Billing information schema."""
    package: str = Field(..., pattern="^(starter|growth|scale)$")
    amount: float = Field(..., ge=0)
    currency: str = Field(default="AED")
    pricing_tiers: Optional[List[PricingTier]] = None

class HackathonBase(BaseModel):
    """Base hackathon schema."""
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10)
    short_description: str = Field(..., max_length=200)
    cover_image: Optional[HttpUrl] = None
    banner_image: Optional[HttpUrl] = None
    organization_name: str
    organization_logo: Optional[HttpUrl] = None
    max_participants: int = Field(default=100, ge=1)
    min_team_size: int = Field(default=1, ge=1)
    max_team_size: int = Field(default=4, ge=1)
    is_team_required: bool = Field(default=True)
    technologies: Optional[List[Technology]] = None
    prizes: Optional[List[Prize]] = None
    total_prize_pool: float = Field(default=0, ge=0)
    timeline: Timeline
    requirements: List[str] = Field(default_factory=list)
    rules: List[str] = Field(default_factory=list)
    judging_criteria: List[str] = Field(default_factory=list)
    resources: List[HttpUrl] = Field(default_factory=list)
    submission_template: Optional[str] = None
    billing: BillingInfo
    tags: List[str] = Field(default_factory=list)
    is_featured: bool = Field(default=False)
    is_private: bool = Field(default=False)
    access_code: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "AI Innovation Hackathon",
                "description": "Join us for an exciting hackathon focused on AI innovation!",
                "short_description": "AI Innovation Hackathon 2024",
                "organization_name": "CloudHub",
                "timeline": {
                    "registration_start": "2024-01-01T00:00:00Z",
                    "registration_end": "2024-01-15T23:59:59Z",
                    "event_start": "2024-01-20T00:00:00Z",
                    "event_end": "2024-01-22T23:59:59Z",
                    "judging_start": "2024-01-23T00:00:00Z",
                    "judging_end": "2024-01-24T23:59:59Z",
                    "winners_announcement": "2024-01-25T18:00:00Z"
                },
                "billing": {
                    "package": "starter",
                    "amount": 1000,
                    "currency": "AED"
                }
            }
        }

class HackathonCreate(HackathonBase):
    """Schema for creating a new hackathon."""
    pass

class HackathonUpdate(BaseModel):
    """Schema for updating hackathon information."""
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    short_description: Optional[str] = Field(None, max_length=200)
    cover_image: Optional[HttpUrl] = None
    banner_image: Optional[HttpUrl] = None
    organization_name: Optional[str] = None
    organization_logo: Optional[HttpUrl] = None
    max_participants: Optional[int] = Field(None, ge=1)
    min_team_size: Optional[int] = Field(None, ge=1)
    max_team_size: Optional[int] = Field(None, ge=1)
    is_team_required: Optional[bool] = None
    technologies: Optional[List[Technology]] = None
    prizes: Optional[List[Prize]] = None
    total_prize_pool: Optional[float] = Field(None, ge=0)
    timeline: Optional[Timeline] = None
    requirements: Optional[List[str]] = None
    rules: Optional[List[str]] = None
    judging_criteria: Optional[List[str]] = None
    resources: Optional[List[HttpUrl]] = None
    submission_template: Optional[str] = None
    billing: Optional[BillingInfo] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_private: Optional[bool] = None
    access_code: Optional[str] = None
    status: Optional[HackathonStatus] = None

    class Config:
        from_attributes = True

class HackathonResponse(HackathonBase):
    """Schema for hackathon response."""
    id: str
    organizer_id: str
    status: HackathonStatus
    registered_participants: int
    active_participants: int
    submitted_projects: int
    total_teams: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True 