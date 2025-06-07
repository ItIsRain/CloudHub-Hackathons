from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class FAQBase(BaseModel):
    """Base FAQ schema."""
    question: str = Field(..., description="The question")
    answer: str = Field(..., description="The answer")
    category: str = Field(..., description="FAQ category")
    order: int = Field(default=0, description="Display order")
    published: bool = Field(default=True, description="Whether FAQ is published")
    featured: bool = Field(default=False, description="Whether FAQ is featured")

    class Config:
        from_attributes = True

class FAQCreate(FAQBase):
    """Schema for creating a new FAQ."""
    pass

class FAQUpdate(BaseModel):
    """Schema for updating FAQ information."""
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    published: Optional[bool] = None
    featured: Optional[bool] = None

    class Config:
        from_attributes = True

class FAQResponse(FAQBase):
    """Schema for FAQ response."""
    id: str
    hackathon_id: str
    views: int
    helpful: int
    not_helpful: int
    created_by: str
    created_at: datetime
    updated_at: datetime
    last_updated: datetime

    class Config:
        from_attributes = True

class FAQVoteRequest(BaseModel):
    """Schema for FAQ voting."""
    helpful: bool = Field(..., description="Whether the vote is helpful (True) or not helpful (False)")

    class Config:
        from_attributes = True 