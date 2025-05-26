# models/auth.py - Complete auth models with all imports and fixes

from datetime import datetime
from typing import Optional, Dict, Any, List
from enum import Enum
from pydantic import BaseModel, EmailStr, validator, Field
from beanie import Document, Link

class UserRole(str, Enum):
    PARTICIPANT = "participant"
    ORGANIZER = "organizer"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    BANNED = "banned"

class UserCreate(BaseModel):
    # Required fields
    email: EmailStr
    password: str
    name: Optional[str] = None
    full_name: Optional[str] = None  # Keep for backward compatibility
    role: UserRole
    country: str  # Make country required
    
    # Basic profile fields
    avatar: Optional[str] = None
    phone: Optional[str] = None
    timezone: Optional[str] = None
    bio: Optional[str] = None
    
    # Profile information
    skills: Optional[List[str]] = Field(default_factory=list)
    languages: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    certifications: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    social_links: Optional[Dict[str, str]] = Field(default_factory=dict)
    
    # Role-specific fields
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    specializations: Optional[List[str]] = Field(default_factory=list)
    mentorship_areas: Optional[List[str]] = Field(default_factory=list)
    
    # Preferences
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict)
    permissions: Optional[List[str]] = Field(default_factory=list)
    communication_preferences: Optional[Dict[str, Any]] = Field(default_factory=dict)
    notification_settings: Optional[Dict[str, Any]] = Field(default_factory=dict)
    availability: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    # Terms acceptance (required)
    accepted_terms: bool = False
    accepted_privacy_policy: bool = False
    
    @validator('name', always=True)
    def validate_name(cls, v, values):
        """Ensure we have either name or full_name."""
        if not v and not values.get('full_name'):
            raise ValueError('Either name or full_name is required')
        return v or values.get('full_name')
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('accepted_terms')
    def validate_terms(cls, v):
        """Ensure terms are accepted."""
        if not v:
            raise ValueError('Terms and conditions must be accepted')
        return v
    
    @validator('accepted_privacy_policy')
    def validate_privacy(cls, v):
        """Ensure privacy policy is accepted."""
        if not v:
            raise ValueError('Privacy policy must be accepted')
        return v
    
    @validator('organization_name')
    def validate_organization_name(cls, v, values):
        """Validate organization name for organizers."""
        if values.get('role') == UserRole.ORGANIZER and not v:
            raise ValueError('Organization name is required for organizers')
        return v
    
    @validator('organization_website')
    def validate_organization_website(cls, v, values):
        """Validate organization website for organizers."""
        if values.get('role') == UserRole.ORGANIZER and not v:
            raise ValueError('Organization website is required for organizers')
        return v
    
    class Config:
        use_enum_values = True

class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response model."""
    id: str
    email: EmailStr
    full_name: str  # Changed from 'name' to match frontend expectations
    role: str
    status: str
    created_at: datetime
    last_login: Optional[datetime] = None
    is_verified: bool
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    languages: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    social_links: Dict[str, str] = Field(default_factory=dict)
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    specializations: List[str] = Field(default_factory=list)
    mentorship_areas: List[str] = Field(default_factory=list)
    is_online: bool = False
    last_seen: Optional[datetime] = None
    is_team_lead: bool = False
    permissions: List[str] = Field(default_factory=list)
    active_hackathons: List[str] = Field(default_factory=list)
    completed_hackathons: List[str] = Field(default_factory=list)
    active_teams: List[str] = Field(default_factory=list)
    rating: float = 0.0
    achievement_count: int = 0
    reputation_score: int = 0
    communication_preferences: Dict[str, Any] = Field(default_factory=dict)
    notification_settings: Dict[str, Any] = Field(default_factory=dict)
    availability: Dict[str, Any] = Field(default_factory=dict)
    phone_verified: bool = False

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Token response model."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Optional[Dict[str, Any]] = None

class PasswordReset(BaseModel):
    """Password reset request model."""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Password reset confirmation model."""
    token: str
    new_password: str

# Forward reference for User model (assuming it's imported elsewhere)
class SecurityEvent(Document):
    """Security event model for logging security-related events."""
    user: Link['User']  # This should reference your actual User model
    event_type: str
    description: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "security_events"
        indexes = [
            "user",
            "event_type", 
            "created_at"
        ]