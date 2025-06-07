from datetime import datetime
from typing import Optional
from pydantic import Field, HttpUrl
from beanie import Document
from enum import Enum

class ResourceType(str, Enum):
    DATASET = "dataset"
    API = "api"
    DOCUMENTATION = "documentation"
    TOOL = "tool"

class AccessLevel(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class Resource(Document):
    """Resource model for hackathon resources management."""
    
    hackathon_id: str = Field(..., description="ID of the hackathon")
    title: str = Field(..., description="Resource title")
    description: str = Field(..., description="Resource description")
    resource_type: ResourceType = Field(..., description="Type of resource")
    format: Optional[str] = Field(None, description="File format (e.g., CSV, JSON, ZIP)")
    size: Optional[str] = Field(None, description="File size")
    url: HttpUrl = Field(..., description="Resource URL")
    access_level: AccessLevel = Field(default=AccessLevel.PUBLIC, description="Access level")
    category: str = Field(..., description="Resource category")
    
    # Download tracking
    downloads: int = Field(default=0, description="Number of downloads")
    last_downloaded: Optional[datetime] = None
    
    # Content metadata
    tags: list[str] = Field(default_factory=list, description="Tags for categorization")
    featured: bool = Field(default=False, description="Whether to feature this resource")
    display_order: int = Field(default=0, description="Display order for sorting")
    
    # API specific fields
    api_key: Optional[str] = Field(None, description="API key for access")
    api_endpoint: Optional[HttpUrl] = Field(None, description="API endpoint URL")
    documentation_url: Optional[HttpUrl] = Field(None, description="Documentation URL")
    
    # Metadata
    created_by: str = Field(..., description="ID of the user who created this resource")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    # Soft delete
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    
    class Settings:
        name = "resources"
        indexes = [
            [("hackathon_id", 1)],
            [("resource_type", 1)],
            [("category", 1)],
            [("access_level", 1)],
            [("featured", 1)],
            [("hackathon_id", 1), ("resource_type", 1)],
            [("hackathon_id", 1), ("category", 1)],
            [("hackathon_id", 1), ("featured", 1)],
        ]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "hackathon_id": self.hackathon_id,
            "title": self.title,
            "description": self.description,
            "type": self.resource_type.value,
            "format": self.format,
            "size": self.size,
            "url": str(self.url),
            "access_level": self.access_level.value,
            "category": self.category,
            "downloads": self.downloads,
            "last_downloaded": self.last_downloaded.isoformat() + 'Z' if self.last_downloaded else None,
            "tags": self.tags,
            "featured": self.featured,
            "display_order": self.display_order,
            "api_key": self.api_key,
            "api_endpoint": str(self.api_endpoint) if self.api_endpoint else None,
            "documentation_url": str(self.documentation_url) if self.documentation_url else None,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() + 'Z',
            "updated_at": self.updated_at.isoformat() + 'Z',
            "last_updated": self.last_updated.isoformat() + 'Z',
            "is_deleted": self.is_deleted,
            "deleted_at": self.deleted_at.isoformat() + 'Z' if self.deleted_at else None,
        } 