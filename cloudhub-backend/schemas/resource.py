from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, HttpUrl, Field, field_validator
from enum import Enum

class ResourceType(str, Enum):
    DATASET = "dataset"
    API = "api"
    DOCUMENTATION = "documentation"
    TOOL = "tool"

class AccessLevel(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class ResourceBase(BaseModel):
    """Base resource schema."""
    title: str = Field(..., description="Resource title")
    description: str = Field(..., description="Resource description")
    resource_type: ResourceType = Field(..., description="Type of resource")
    format: Optional[str] = Field(None, description="File format (e.g., CSV, JSON, ZIP)")
    size: Optional[str] = Field(None, description="File size")
    url: str = Field(..., description="Resource URL")
    access_level: AccessLevel = Field(default=AccessLevel.PUBLIC, description="Access level")
    category: str = Field(..., description="Resource category")
    tags: List[str] = Field(default_factory=list, description="Tags for categorization")
    featured: bool = Field(default=False, description="Whether to feature this resource")
    display_order: int = Field(default=0, description="Display order for sorting")
    api_key: Optional[str] = Field(None, description="API key for access")
    api_endpoint: Optional[str] = Field(None, description="API endpoint URL")
    documentation_url: Optional[str] = Field(None, description="Documentation URL")

    @field_validator('api_endpoint', 'documentation_url')
    @classmethod
    def validate_optional_urls(cls, v):
        if v == "" or v is None:
            return None
        return v

    class Config:
        from_attributes = True

class ResourceCreate(ResourceBase):
    """Schema for creating a new resource."""
    pass

class ResourceUpdate(BaseModel):
    """Schema for updating resource information."""
    title: Optional[str] = None
    description: Optional[str] = None
    resource_type: Optional[ResourceType] = None
    format: Optional[str] = None
    size: Optional[str] = None
    url: Optional[str] = None
    access_level: Optional[AccessLevel] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    display_order: Optional[int] = None
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    documentation_url: Optional[str] = None

    @field_validator('api_endpoint', 'documentation_url')
    @classmethod
    def validate_optional_urls(cls, v):
        if v == "" or v is None:
            return None
        return v

    class Config:
        from_attributes = True

class ResourceResponse(ResourceBase):
    """Schema for resource response."""
    id: str
    hackathon_id: str
    downloads: int
    last_downloaded: Optional[datetime] = None
    created_by: str
    created_at: datetime
    updated_at: datetime
    last_updated: datetime

    class Config:
        from_attributes = True 