from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    SUSPENDED = "suspended"

class UserBase(BaseModel):
    """Base schema for user attributes."""
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    avatar: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    languages: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    social_links: Dict[str, str] = Field(default_factory=dict)
    timezone: Optional[str] = None
    preferences: Dict[str, Any] = Field(default_factory=dict)
    
    # Organization fields
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8)
    role: str = "user"

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    avatar: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    languages: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    social_links: Optional[Dict[str, str]] = None
    timezone: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None
    
    # Organization fields for updates
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    """Schema for user response."""
    id: str
    email: EmailStr
    full_name: str
    role: str
    status: UserStatus
    created_at: datetime
    last_login: Optional[datetime] = None
    is_verified: bool = False
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    skills: Optional[List[str]] = None
    languages: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    social_links: Optional[Dict[str, str]] = None
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    specializations: Optional[List[str]] = None
    mentorship_areas: Optional[List[str]] = None
    is_online: bool = False
    last_seen: Optional[datetime] = None
    is_team_lead: bool = False
    permissions: Optional[List[str]] = None
    active_hackathons: Optional[List[str]] = None
    completed_hackathons: Optional[List[str]] = None
    active_teams: Optional[List[str]] = None
    rating: Optional[float] = None
    achievement_count: int = 0
    reputation_score: int = 0
    communication_preferences: Optional[Dict[str, Any]] = None
    notification_settings: Optional[Dict[str, Any]] = None
    availability: Optional[Dict[str, Any]] = None
    phone_verified: bool = False
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True