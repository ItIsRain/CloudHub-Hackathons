from datetime import datetime
from typing import Dict, Any, Optional
from beanie import Document
from pydantic import Field

class PendingHackathon(Document):
    """Model for storing pending hackathon data before payment confirmation."""
    
    # Unique ID from the checkout session
    checkout_id: str = Field(..., description="Unique ID for the pending hackathon")
    
    # The actual hackathon data
    hackathon_data: Dict[str, Any] = Field(..., description="The hackathon data to be stored")
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(..., description="When this pending data should expire")
    is_processed: bool = Field(default=False, description="Whether this pending data has been processed")
    processed_at: Optional[datetime] = None
    
    class Settings:
        name = "pending_hackathons"
        indexes = [
            "checkout_id",
            "created_at",
            "expires_at",
            "is_processed"
        ] 