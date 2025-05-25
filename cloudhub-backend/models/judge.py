from datetime import datetime
from typing import List, Optional, Dict
from beanie import Document
from pydantic import Field, HttpUrl
from enum import Enum

class JudgeStatus(str, Enum):
    INVITED = "invited"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    ACTIVE = "active"
    COMPLETED = "completed"

class JudgeExpertise(str, Enum):
    AI_ML = "ai_ml"
    WEB_DEVELOPMENT = "web_development"
    MOBILE_DEVELOPMENT = "mobile_development"
    BLOCKCHAIN = "blockchain"
    CLOUD_COMPUTING = "cloud_computing"
    UI_UX = "ui_ux"
    DATA_SCIENCE = "data_science"
    CYBERSECURITY = "cybersecurity"
    IOT = "iot"
    AR_VR = "ar_vr"

class Judge(Document):
    # Basic Info
    user_id: str = Field(..., description="ID of the user assigned as judge")
    hackathon_id: str = Field(..., description="ID of the hackathon")
    
    # Profile
    expertise: List[JudgeExpertise] = Field(default_factory=list)
    bio: Optional[str] = None
    organization: Optional[str] = None
    position: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    avatar_url: Optional[HttpUrl] = None
    
    # Status
    status: JudgeStatus = Field(default=JudgeStatus.INVITED)
    is_lead_judge: bool = Field(default=False)
    
    # Assignment
    assigned_teams: List[str] = Field(default_factory=list, description="List of team IDs")
    completed_reviews: List[str] = Field(default_factory=list, description="List of submission IDs")
    remaining_reviews: List[str] = Field(default_factory=list, description="List of submission IDs")
    
    # Scoring Stats
    total_reviews_completed: int = Field(default=0)
    average_score_given: float = Field(default=0)
    review_completion_percentage: float = Field(default=0)
    
    # Time Tracking
    total_time_spent: float = Field(default=0, description="Total time spent judging in minutes")
    last_active: Optional[datetime] = None
    
    # Notifications
    email_notifications: bool = Field(default=True)
    pending_reviews_reminder: bool = Field(default=True)
    
    # Timestamps
    invited_at: datetime = Field(default_factory=datetime.utcnow)
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Metadata
    notes: Optional[str] = None
    feedback_provided: List[Dict[str, str]] = Field(default_factory=list)
    
    class Settings:
        name = "judges"
        indexes = [
            "hackathon_id",
            "user_id",
            "status",
            "is_lead_judge",
            "expertise"
        ]
        
    async def assign_submissions(self, submission_ids: List[str]):
        """Assign submissions to the judge."""
        self.remaining_reviews.extend(submission_ids)
        await self.save()
        
    async def complete_review(self, submission_id: str):
        """Mark a submission review as completed."""
        if submission_id in self.remaining_reviews:
            self.remaining_reviews.remove(submission_id)
            self.completed_reviews.append(submission_id)
            self.total_reviews_completed += 1
            self.review_completion_percentage = (
                len(self.completed_reviews) / 
                (len(self.completed_reviews) + len(self.remaining_reviews))
            ) * 100
            self.last_active = datetime.utcnow()
            await self.save()
            
    async def update_status(self, new_status: JudgeStatus):
        """Update judge status and relevant timestamps."""
        self.status = new_status
        if new_status == JudgeStatus.ACCEPTED:
            self.accepted_at = datetime.utcnow()
        elif new_status == JudgeStatus.COMPLETED:
            self.completed_at = datetime.utcnow()
        await self.save()
        
    async def add_time_spent(self, minutes: float):
        """Add time spent judging."""
        self.total_time_spent += minutes
        self.last_active = datetime.utcnow()
        await self.save() 