from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, HttpUrl, EmailStr, Field
from enum import Enum

class SponsorshipTier(str, Enum):
    PLATINUM = "platinum"
    GOLD = "gold"
    SILVER = "silver"
    BRONZE = "bronze"

class SponsorBenefit(str, Enum):
    KEYNOTE_SPEAKING = "keynote_speaking"
    WORKSHOP_SESSION = "workshop_session"
    PREMIUM_BOOTH = "premium_booth"
    LOGO_PLACEMENT = "logo_placement"
    RECRUITMENT_ACCESS = "recruitment_access"
    NETWORKING_ACCESS = "networking_access"
    SOCIAL_MEDIA_PROMOTION = "social_media_promotion"
    WEBSITE_LISTING = "website_listing"

class SponsorContact(BaseModel):
    """Contact information for sponsor."""
    name: str = Field(..., description="Contact person name")
    role: str = Field(..., description="Role/position")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")

    class Config:
        from_attributes = True

class SponsorBase(BaseModel):
    """Base sponsor schema."""
    name: str = Field(..., description="Company/organization name")
    tier: SponsorshipTier = Field(..., description="Sponsorship tier")
    logo: Optional[HttpUrl] = Field(None, description="Sponsor logo URL")
    website: Optional[HttpUrl] = Field(None, description="Sponsor website URL")
    description: str = Field(default="", description="Brief description of the sponsor")
    contacts: List[SponsorContact] = Field(default_factory=list, description="List of contacts")
    benefits: List[SponsorBenefit] = Field(default_factory=list, description="List of sponsor benefits")
    contribution: float = Field(..., ge=0, description="Sponsorship contribution amount")
    currency: str = Field(default="AED", description="Currency of contribution")
    featured: bool = Field(default=False, description="Whether to feature this sponsor")
    display_order: int = Field(default=0, description="Display order for sorting")

    class Config:
        from_attributes = True

class SponsorCreate(SponsorBase):
    """Schema for creating a new sponsor."""
    pass

class SponsorUpdate(BaseModel):
    """Schema for updating sponsor information."""
    name: Optional[str] = None
    tier: Optional[SponsorshipTier] = None
    logo: Optional[HttpUrl] = None
    website: Optional[HttpUrl] = None
    description: Optional[str] = None
    contacts: Optional[List[SponsorContact]] = None
    benefits: Optional[List[SponsorBenefit]] = None
    contribution: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    contract_signed: Optional[bool] = None
    contract_date: Optional[datetime] = None
    contract_url: Optional[HttpUrl] = None
    featured: Optional[bool] = None
    display_order: Optional[int] = None

    class Config:
        from_attributes = True

class SponsorResponse(SponsorBase):
    """Schema for sponsor response."""
    id: str
    hackathon_id: str
    contract_signed: bool
    contract_date: Optional[datetime] = None
    contract_url: Optional[HttpUrl] = None
    added_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 