from datetime import datetime
from typing import Optional
from pydantic import Field
from beanie import Document
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

class TimelineEvent(Document):
    """Timeline event model for hackathon scheduling."""
    
    hackathon_id: str = Field(..., description="ID of the hackathon")
    title: str = Field(..., description="Event title")
    description: str = Field(default="", description="Event description")
    date: datetime = Field(..., description="Event date and time")
    event_type: TimelineEventType = Field(..., description="Type of event")
    status: TimelineEventStatus = Field(default=TimelineEventStatus.UPCOMING, description="Event status")
    
    # Optional fields
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")
    location: Optional[str] = Field(None, description="Event location")
    meeting_url: Optional[str] = Field(None, description="Online meeting URL")
    
    # Notification settings
    notify_participants: bool = Field(default=True, description="Send notifications to participants")
    reminder_sent: bool = Field(default=False, description="Whether reminder was sent")
    reminder_hours: int = Field(default=24, description="Hours before event to send reminder")
    
    # Display settings
    is_public: bool = Field(default=True, description="Whether event is visible to participants")
    display_order: int = Field(default=0, description="Display order for sorting")
    
    # Metadata
    created_by: str = Field(..., description="ID of the user who created this event")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Soft delete
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    
    class Settings:
        name = "timeline_events"
        indexes = [
            [("hackathon_id", 1)],
            [("date", 1)],
            [("event_type", 1)],
            [("status", 1)],
            [("hackathon_id", 1), ("date", 1)],
            [("hackathon_id", 1), ("event_type", 1)],
            [("hackathon_id", 1), ("status", 1)],
        ]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "hackathon_id": self.hackathon_id,
            "title": self.title,
            "description": self.description,
            "date": self.date.isoformat() + 'Z',
            "event_type": self.event_type.value,
            "status": self.status.value,
            "duration": self.duration,
            "location": self.location,
            "meeting_url": self.meeting_url,
            "notify_participants": self.notify_participants,
            "reminder_sent": self.reminder_sent,
            "reminder_hours": self.reminder_hours,
            "is_public": self.is_public,
            "display_order": self.display_order,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() + 'Z',
            "updated_at": self.updated_at.isoformat() + 'Z',
            "is_deleted": self.is_deleted,
            "deleted_at": self.deleted_at.isoformat() + 'Z' if self.deleted_at else None,
        } 