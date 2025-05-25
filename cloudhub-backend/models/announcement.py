from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import Field, HttpUrl
from enum import Enum

class AnnouncementType(str, Enum):
    GENERAL = "general"
    IMPORTANT = "important"
    DEADLINE = "deadline"
    EVENT = "event"
    RESOURCE = "resource"
    WINNER = "winner"

class AnnouncementPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class AnnouncementTarget(str, Enum):
    ALL = "all"
    PARTICIPANTS = "participants"
    TEAMS = "teams"
    JUDGES = "judges"
    MENTORS = "mentors"

class Announcement(Document):
    # Basic Info
    title: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10)
    hackathon_id: str = Field(..., description="ID of the hackathon")
    author_id: str = Field(..., description="ID of the announcement author")
    
    # Classification
    type: AnnouncementType = Field(default=AnnouncementType.GENERAL)
    priority: AnnouncementPriority = Field(default=AnnouncementPriority.MEDIUM)
    target_audience: AnnouncementTarget = Field(default=AnnouncementTarget.ALL)
    
    # Visibility
    is_published: bool = Field(default=True)
    is_pinned: bool = Field(default=False)
    is_featured: bool = Field(default=False)
    
    # Media
    image_url: Optional[HttpUrl] = None
    attachment_urls: List[HttpUrl] = Field(default_factory=list)
    
    # Scheduling
    scheduled_for: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    # Notification Settings
    send_email: bool = Field(default=False)
    send_push: bool = Field(default=True)
    
    # Engagement Tracking
    views: int = Field(default=0)
    likes: int = Field(default=0)
    comments: List[dict] = Field(default_factory=list)
    viewed_by: List[str] = Field(default_factory=list, description="List of user IDs")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    
    class Settings:
        name = "announcements"
        indexes = [
            "hackathon_id",
            "author_id",
            "type",
            "priority",
            "target_audience",
            "is_published",
            "is_pinned",
            "scheduled_for",
            ("title", "text"),
            ("content", "text")
        ]
        
    async def increment_views(self, user_id: str):
        """Increment view count and add user to viewed_by list."""
        if user_id not in self.viewed_by:
            self.views += 1
            self.viewed_by.append(user_id)
            await self.save()
            
    async def toggle_like(self, user_id: str) -> bool:
        """Toggle like status for a user."""
        if user_id in self.likes:
            self.likes.remove(user_id)
            liked = False
        else:
            self.likes.append(user_id)
            liked = True
        await self.save()
        return liked
        
    async def add_comment(self, user_id: str, content: str):
        """Add a comment to the announcement."""
        comment = {
            "user_id": user_id,
            "content": content,
            "created_at": datetime.utcnow()
        }
        self.comments.append(comment)
        await self.save()
        
    async def publish(self):
        """Publish the announcement."""
        self.is_published = True
        self.published_at = datetime.utcnow()
        await self.save()
        
    async def schedule(self, scheduled_time: datetime):
        """Schedule the announcement for future publication."""
        self.is_published = False
        self.scheduled_for = scheduled_time
        await self.save() 