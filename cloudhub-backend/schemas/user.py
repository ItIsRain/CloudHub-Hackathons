from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

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

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    """Schema for user response."""
    id: str
    role: str
    is_online: bool
    last_seen: Optional[datetime] = None
    is_team_lead: bool
    permissions: List[str]
    active_hackathons: List[str]
    completed_hackathons: List[str]
    active_teams: List[str]
    rating: float
    achievement_count: int
    reputation_score: int
    email_verified: bool
    phone_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 