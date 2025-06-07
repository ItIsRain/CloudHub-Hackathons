from datetime import datetime
from typing import Optional, List
from pydantic import Field, HttpUrl, EmailStr
from beanie import Document
from enum import Enum
from models.base import BaseModel as BaseDBModel

class SponsorshipTier(str, Enum):
    PLATINUM = "platinum"
    GOLD = "gold"
    SILVER = "silver"
    BRONZE = "bronze"

class SponsorContact(BaseDBModel):
    """Contact information for sponsor."""
    name: str = Field(..., description="Contact person name")
    role: str = Field(..., description="Role/position")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")

class SponsorBenefit(str, Enum):
    KEYNOTE_SPEAKING = "keynote_speaking"
    WORKSHOP_SESSION = "workshop_session"
    PREMIUM_BOOTH = "premium_booth"
    LOGO_PLACEMENT = "logo_placement"
    RECRUITMENT_ACCESS = "recruitment_access"
    NETWORKING_ACCESS = "networking_access"
    SOCIAL_MEDIA_PROMOTION = "social_media_promotion"
    WEBSITE_LISTING = "website_listing"

class Sponsor(Document):
    """Sponsor model for hackathon sponsorship management."""
    
    hackathon_id: str = Field(..., description="ID of the hackathon")
    name: str = Field(..., description="Company/organization name")
    tier: SponsorshipTier = Field(..., description="Sponsorship tier")
    logo: Optional[HttpUrl] = Field(None, description="Sponsor logo URL")
    website: Optional[HttpUrl] = Field(None, description="Sponsor website URL")
    description: str = Field(default="", description="Brief description of the sponsor")
    
    # Contact information
    contacts: List[SponsorContact] = Field(default_factory=list, description="List of contacts")
    
    # Benefits and contribution
    benefits: List[SponsorBenefit] = Field(default_factory=list, description="List of sponsor benefits")
    contribution: float = Field(..., ge=0, description="Sponsorship contribution amount")
    currency: str = Field(default="AED", description="Currency of contribution")
    
    # Contract details
    contract_signed: bool = Field(default=False, description="Whether contract is signed")
    contract_date: Optional[datetime] = None
    contract_url: Optional[HttpUrl] = None
    
    # Display settings
    featured: bool = Field(default=False, description="Whether to feature this sponsor")
    display_order: int = Field(default=0, description="Display order for sorting")
    
    # Metadata
    added_by: str = Field(..., description="ID of the user who added this sponsor")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Soft delete
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    
    class Settings:
        name = "sponsors"
        indexes = [
            [("hackathon_id", 1)],
            [("tier", 1)],
            [("name", 1)],
            [("featured", 1)],
            [("hackathon_id", 1), ("tier", 1)],
            [("hackathon_id", 1), ("display_order", 1)],
        ]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "hackathon_id": self.hackathon_id,
            "name": self.name,
            "tier": self.tier.value,
            "logo": str(self.logo) if self.logo else None,
            "website": str(self.website) if self.website else None,
            "description": self.description,
            "contacts": [contact.dict() for contact in self.contacts],
            "benefits": [benefit.value for benefit in self.benefits],
            "contribution": self.contribution,
            "currency": self.currency,
            "contract_signed": self.contract_signed,
            "contract_date": self.contract_date.isoformat() + 'Z' if self.contract_date else None,
            "contract_url": str(self.contract_url) if self.contract_url else None,
            "featured": self.featured,
            "display_order": self.display_order,
            "added_by": self.added_by,
            "created_at": self.created_at.isoformat() + 'Z',
            "updated_at": self.updated_at.isoformat() + 'Z',
            "is_deleted": self.is_deleted,
            "deleted_at": self.deleted_at.isoformat() + 'Z' if self.deleted_at else None,
        } 