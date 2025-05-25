from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from beanie import Document, Link
from uuid import UUID

class UserRole(str, Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    PARTICIPANT = "participant"
    JUDGE = "judge"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    BANNED = "banned"

class UserCreate(BaseModel):
    """User creation model."""
    email: EmailStr
    password: str
    name: str
    role: UserRole = UserRole.PARTICIPANT
    accepted_terms: bool = False
    accepted_privacy_policy: bool = False

class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response model."""
    id: str
    email: EmailStr
    name: str
    role: str
    status: str
    email_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Token response model."""
    access_token: str
    refresh_token: str
    expires_in: int
    user: Optional[Dict[str, Any]] = None

class PasswordReset(BaseModel):
    """Password reset request model."""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Password reset confirmation model."""
    token: str
    new_password: str

class SecurityEvent(Document):
    """Security event model for logging security-related events."""
    user: Link['User']
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