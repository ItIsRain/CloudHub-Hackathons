from datetime import datetime
from typing import Optional
from pydantic import Field
from beanie import Document

class FAQ(Document):
    """FAQ model for hackathon frequently asked questions."""
    
    hackathon_id: str = Field(..., description="ID of the hackathon")
    question: str = Field(..., description="The question")
    answer: str = Field(..., description="The answer")
    category: str = Field(..., description="FAQ category")
    
    # Analytics
    views: int = Field(default=0, description="Number of times viewed")
    helpful: int = Field(default=0, description="Number of helpful votes")
    not_helpful: int = Field(default=0, description="Number of not helpful votes")
    
    # Display settings
    order: int = Field(default=0, description="Display order")
    published: bool = Field(default=True, description="Whether FAQ is published")
    featured: bool = Field(default=False, description="Whether FAQ is featured")
    
    # Metadata
    created_by: str = Field(..., description="ID of the user who created this FAQ")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    # Soft delete
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    
    class Settings:
        name = "faqs"
        indexes = [
            [("hackathon_id", 1)],
            [("category", 1)],
            [("published", 1)],
            [("featured", 1)],
            [("order", 1)],
            [("hackathon_id", 1), ("category", 1)],
            [("hackathon_id", 1), ("published", 1)],
            [("hackathon_id", 1), ("featured", 1)],
        ]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "hackathon_id": self.hackathon_id,
            "question": self.question,
            "answer": self.answer,
            "category": self.category,
            "views": self.views,
            "helpful": self.helpful,
            "not_helpful": self.not_helpful,
            "order": self.order,
            "published": self.published,
            "featured": self.featured,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() + 'Z',
            "updated_at": self.updated_at.isoformat() + 'Z',
            "last_updated": self.last_updated.isoformat() + 'Z',
            "is_deleted": self.is_deleted,
            "deleted_at": self.deleted_at.isoformat() + 'Z' if self.deleted_at else None,
        } 