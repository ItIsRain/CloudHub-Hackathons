from datetime import datetime
import uuid
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr, constr, validator, root_validator, Field, model_validator
from enum import Enum
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel

class UserRole(str, Enum):
    ORGANIZER = "organizer"
    PARTICIPANT = "participant"
    JUDGE = "judge"
    MENTOR = "mentor"
    MEDIA = "media"
    ADMIN = "admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    SUSPENDED = "suspended"
    BANNED = "banned"

class SecuritySettings(BaseModel):
    two_factor_enabled: bool = False
    last_password_change: datetime
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    failed_login_attempts: int = 0
    account_locked_until: Optional[datetime] = None
    security_questions: dict = {}

class UserCreate(BaseModel):
    # Basic Information
    email: EmailStr
    password: constr(min_length=8)
    full_name: str
    role: UserRole
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    
    # Profile Information
    bio: Optional[str] = None
    avatar: Optional[str] = None
    skills: Optional[list[str]] = Field(default_factory=list)
    languages: Optional[list[Dict[str, str]]] = Field(default_factory=list)  # [{language: string, level: string}]
    certifications: Optional[list[Dict[str, str]]] = Field(default_factory=list)  # [{name: string, issuer: string, date: string}]
    social_links: Optional[Dict[str, str]] = Field(default_factory=dict)  # {github: string, linkedin: string, portfolio: string}
    
    # Role-specific Information
    organization_name: Optional[str] = None  # For organizers
    organization_website: Optional[str] = None  # For organizers
    organization_size: Optional[str] = None  # For organizers
    industry: Optional[str] = None  # For organizers
    specializations: Optional[list[str]] = Field(default_factory=list)  # For both
    mentorship_areas: Optional[list[str]] = Field(default_factory=list)  # For both
    
    # Preferences
    communication_preferences: Optional[Dict[str, bool]] = Field(default_factory=dict)  # {email: bool, push: bool, desktop: bool}
    notification_settings: Optional[Dict[str, bool]] = Field(default_factory=dict)  # {email: bool, push: bool, desktop: bool}
    availability: Optional[Dict[str, list[str]]] = Field(default_factory=dict)  # {days: string[], hours: string[]}
    
    # Terms and Conditions
    accepted_terms: bool = False
    accepted_privacy_policy: bool = False
    
    @validator('password')
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        if not any(c in '!@#$%^&*(),.?":{}|<>' for c in v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @model_validator(mode='after')
    def validate_organization_fields(self) -> 'UserCreate':
        if self.role == UserRole.ORGANIZER:
            if not self.organization_name:
                raise ValueError('Organization name is required for organizers')
            if not self.organization_website:
                raise ValueError('Organization website is required for organizers')
            if not self.industry:
                raise ValueError('Industry is required for organizers')
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    last_login: Optional[datetime]
    is_verified: bool
    
    # Basic Information
    phone: Optional[str]
    country: Optional[str]
    timezone: Optional[str]
    
    # Profile Information
    bio: Optional[str]
    avatar: Optional[str]
    skills: list[str] = Field(default_factory=list)
    languages: list[Dict[str, str]] = Field(default_factory=list)
    certifications: list[Dict[str, str]] = Field(default_factory=list)
    social_links: Dict[str, str] = Field(default_factory=dict)
    
    # Role-specific Information
    organization_name: Optional[str]
    organization_website: Optional[str]
    organization_size: Optional[str]
    industry: Optional[str]
    specializations: list[str] = Field(default_factory=list)
    mentorship_areas: list[str] = Field(default_factory=list)
    
    # Status and Activity
    is_online: bool = False
    last_seen: Optional[datetime]
    is_team_lead: bool = False
    permissions: list[str] = Field(default_factory=list)
    active_hackathons: list[str] = Field(default_factory=list)
    completed_hackathons: list[str] = Field(default_factory=list)
    active_teams: list[str] = Field(default_factory=list)
    
    # Metrics
    rating: float = 0.0
    achievement_count: int = 0
    reputation_score: int = 0
    
    # Preferences
    communication_preferences: Dict[str, bool] = Field(default_factory=dict)
    notification_settings: Dict[str, bool] = Field(default_factory=dict)
    availability: Dict[str, list[str]] = Field(default_factory=dict)
    
    # Verification
    email_verified: bool = False
    phone_verified: bool = False
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Token response model."""
    access_token: str
    refresh_token: str
    expires_in: int
    user: Optional[Dict[str, Any]] = None

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: constr(min_length=8)
    confirm_password: str

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

class RefreshToken(BaseDBModel):
    """Model for refresh tokens."""
    
    token: str = Field(unique=True, index=True)
    user: Link['User']
    expires_at: datetime
    revoked: bool = False
    revoked_at: Optional[datetime] = None
    
    class Settings:
        name = "refresh_tokens"
        use_state_management = True
        indexes = [
            "token",
            "user.id",
            "expires_at"
        ]

class SecurityEvent(BaseDBModel):
    """Model for security audit events."""
    
    user: Optional[Link['User']] = None
    event_type: str
    event_data: Dict[str, Any] = Field(default_factory=dict)
    ip_address: str
    user_agent: str
    
    class Settings:
        name = "security_events"
        use_state_management = True
        indexes = [
            "user.id",
            "event_type",
            "created_at"
        ] 