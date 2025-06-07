from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

class TimelineEventType(str, Enum):
    MILESTONE = "milestone"
    DEADLINE = "deadline"
    WORKSHOP = "workshop"
    ANNOUNCEMENT = "announcement"

class TimelineEventStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"

class TimelineEventBase(BaseModel):
    """Base timeline event schema."""
    title: str = Field(..., description="Event title")
    description: str = Field(default="", description="Event description")
    date: datetime = Field(..., description="Event date and time")
    event_type: TimelineEventType = Field(..., description="Type of event")
    status: TimelineEventStatus = Field(default=TimelineEventStatus.UPCOMING, description="Event status")
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")
    location: Optional[str] = Field(None, description="Event location")
    meeting_url: Optional[str] = Field(None, description="Online meeting URL")
    notify_participants: bool = Field(default=True, description="Send notifications to participants")
    reminder_hours: int = Field(default=24, description="Hours before event to send reminder")
    is_public: bool = Field(default=True, description="Whether event is visible to participants")
    display_order: int = Field(default=0, description="Display order for sorting")

    class Config:
        from_attributes = True

class TimelineEventCreate(TimelineEventBase):
    """Schema for creating a new timeline event."""
    pass

class TimelineEventUpdate(BaseModel):
    """Schema for updating timeline event information."""
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    event_type: Optional[TimelineEventType] = None
    status: Optional[TimelineEventStatus] = None
    duration: Optional[int] = Field(None, ge=0)
    location: Optional[str] = None
    meeting_url: Optional[str] = None
    notify_participants: Optional[bool] = None
    reminder_hours: Optional[int] = None
    is_public: Optional[bool] = None
    display_order: Optional[int] = None

    class Config:
        from_attributes = True

class TimelineEventResponse(TimelineEventBase):
    """Schema for timeline event response."""
    id: str
    hackathon_id: str
    reminder_sent: bool
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 