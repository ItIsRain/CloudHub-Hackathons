from datetime import datetime
from typing import Optional
from beanie import Document, before_event, Replace, Insert
from pydantic import Field

class BaseModel(Document):
    """Base model with common fields."""
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    
    class Settings:
        use_state_management = True
        validate_on_save = True
    
    @before_event([Replace, Insert])
    def update_timestamps(self):
        """Update timestamps before saving."""
        if not self.created_at:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    async def soft_delete(self):
        """Soft delete the document."""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()
        await self.save()
    
    def to_dict(self) -> dict:
        """Convert model instance to dictionary."""
        return {
            'id': str(self.id),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_deleted': self.is_deleted,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None
        } 