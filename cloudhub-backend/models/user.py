from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from beanie import Document, Link, before_event, Replace, Insert
from pydantic import Field, EmailStr
from uuid import UUID
from pymongo import ASCENDING, DESCENDING, IndexModel
from pymongo import TEXT

class User(Document):
    """User model."""
    
    # Basic information
    email: EmailStr = Field(unique=True)
    password_hash: str
    name: str
    avatar: Optional[str] = None
    role: str
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    
    # Profile information
    skills: List[str] = Field(default_factory=list)
    bio: Optional[str] = None
    languages: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    social_links: Dict[str, str] = Field(default_factory=dict)
    
    # Role-specific information
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    specializations: List[str] = Field(default_factory=list)
    mentorship_areas: List[str] = Field(default_factory=list)
    
    # Status and preferences
    is_online: bool = False
    last_seen: datetime = Field(default_factory=datetime.utcnow)
    preferences: Dict[str, Any] = Field(default_factory=dict)
    
    # Participation
    is_team_lead: bool = False
    permissions: List[str] = Field(default_factory=list)
    active_hackathons: List[str] = Field(default_factory=list)
    completed_hackathons: List[str] = Field(default_factory=list)
    active_teams: List[str] = Field(default_factory=list)
    
    # Metrics
    rating: float = 0.0
    achievement_count: int = 0
    reputation_score: int = 0
    
    # Preferences
    communication_preferences: Dict[str, Any] = Field(default_factory=dict)
    notification_settings: Dict[str, Any] = Field(default_factory=dict)
    availability: Dict[str, Any] = Field(default_factory=dict)
    
    # Security and verification
    email_verified: bool = False
    phone_verified: bool = False
    verification_token: Optional[str] = None
    verification_expires: Optional[datetime] = None
    reset_token: Optional[str] = None
    reset_token_expires: Optional[datetime] = None
    totp_secret: Optional[str] = None
    account_locked: bool = False
    account_locked_until: Optional[datetime] = None
    failed_login_attempts: int = 0
    last_login: Optional[datetime] = None
    password_changed_at: Optional[datetime] = None
    
    # Terms and conditions
    accepted_terms: bool = False
    accepted_privacy_policy: bool = False
    
    # Soft delete
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "users"
        use_state_management = True
        indexes = [
            # Basic indexes
            IndexModel([("email", 1)], unique=True, name="idx_user_email_unique"),
            IndexModel([("role", 1)], name="idx_user_role"),
            IndexModel([("organization_name", 1)], name="idx_user_org_name"),
            IndexModel([("skills", 1)], name="idx_user_skills"),
            IndexModel([("active_hackathons", 1)], name="idx_user_active_hackathons"),
            IndexModel([("active_teams", 1)], name="idx_user_active_teams"),
            # Text search index
            IndexModel(
                [("name", "text"), ("bio", "text")],
                name="idx_user_text_search",
                weights={"name": 10, "bio": 5}
            )
        ]
    
    @before_event([Replace, Insert])
    def update_timestamps(self):
        """Update timestamps before saving."""
        if not self.created_at:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def to_dict(self) -> dict:
        """Convert user instance to dictionary."""
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'avatar': self.avatar,
            'role': self.role,
            'phone': self.phone,
            'country': self.country,
            'timezone': self.timezone,
            'skills': self.skills,
            'bio': self.bio,
            'languages': self.languages,
            'certifications': self.certifications,
            'social_links': self.social_links,
            'organization_name': self.organization_name,
            'organization_website': self.organization_website,
            'organization_size': self.organization_size,
            'industry': self.industry,
            'specializations': self.specializations,
            'mentorship_areas': self.mentorship_areas,
            'is_online': self.is_online,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'is_team_lead': self.is_team_lead,
            'permissions': self.permissions,
            'active_hackathons': self.active_hackathons,
            'completed_hackathons': self.completed_hackathons,
            'active_teams': self.active_teams,
            'rating': self.rating,
            'achievement_count': self.achievement_count,
            'reputation_score': self.reputation_score,
            'communication_preferences': self.communication_preferences,
            'notification_settings': self.notification_settings,
            'availability': self.availability,
            'email_verified': self.email_verified,
            'phone_verified': self.phone_verified,
            'accepted_terms': self.accepted_terms,
            'accepted_privacy_policy': self.accepted_privacy_policy,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    async def update_last_seen(self):
        """Update user's last seen timestamp."""
        self.last_seen = datetime.utcnow()
        await self.save()
    
    async def increment_failed_login(self):
        """Increment failed login attempts and lock account if threshold reached."""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:  # Threshold for account locking
            self.account_locked = True
            self.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
        await self.save()
    
    async def reset_failed_login(self):
        """Reset failed login attempts counter."""
        self.failed_login_attempts = 0
        self.account_locked = False
        self.account_locked_until = None
        await self.save()
    
    async def verify_email(self):
        """Mark email as verified."""
        self.email_verified = True
        self.verification_token = None
        self.verification_expires = None
        await self.save()
    
    async def verify_phone(self):
        """Mark phone as verified."""
        self.phone_verified = True
        await self.save()
    
    async def update_profile(self, data: dict):
        """Update user profile with provided data."""
        allowed_fields = {
            'name', 'avatar', 'bio', 'skills', 'languages',
            'certifications', 'social_links', 'timezone', 'preferences'
        }
        
        for field, value in data.items():
            if field in allowed_fields:
                setattr(self, field, value)
        
        await self.save()
    
    @classmethod
    async def get_by_email(cls, email: str) -> Optional['User']:
        """Get user by email."""
        return await cls.find_one(
            cls.email == email,
            cls.is_deleted == False
        )
    
    @classmethod
    async def get_active_users(cls) -> List['User']:
        """Get all active users."""
        return await cls.find(
            cls.is_deleted == False,
            cls.account_locked == False
        ).to_list() 