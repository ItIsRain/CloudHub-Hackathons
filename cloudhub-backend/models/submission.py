from datetime import datetime
from typing import List, Optional, Dict
from beanie import Document
from pydantic import Field, HttpUrl
from enum import Enum

class SubmissionStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    REVIEWED = "reviewed"
    WINNER = "winner"
    DISQUALIFIED = "disqualified"

class JudgingCriteria(str, Enum):
    INNOVATION = "innovation"
    TECHNICAL_COMPLEXITY = "technical_complexity"
    IMPACT = "impact"
    PRESENTATION = "presentation"
    USER_EXPERIENCE = "user_experience"
    COMPLETENESS = "completeness"

class JudgeScore(Document):
    judge_id: str = Field(..., description="ID of the judge")
    criteria: JudgingCriteria
    score: float = Field(..., ge=0, le=10)
    feedback: str = Field(default="")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

class Submission(Document):
    # Basic Info
    title: str = Field(..., min_length=3, max_length=100)
    hackathon_id: str = Field(..., description="ID of the hackathon")
    team_id: str = Field(..., description="ID of the team")
    
    # Project Details
    description: str = Field(..., min_length=10)
    problem_statement: str = Field(..., description="Problem being solved")
    solution_description: str = Field(..., description="How the solution works")
    technical_implementation: str = Field(..., description="Technical details")
    future_plans: Optional[str] = None
    
    # Media
    cover_image: Optional[HttpUrl] = None
    demo_video_url: Optional[HttpUrl] = None
    presentation_url: Optional[HttpUrl] = None
    
    # Technical
    repository_url: Optional[HttpUrl] = None
    live_demo_url: Optional[HttpUrl] = None
    technologies_used: List[str] = Field(default_factory=list)
    architecture_diagram: Optional[HttpUrl] = None
    
    # Additional Materials
    screenshots: List[HttpUrl] = Field(default_factory=list)
    additional_resources: List[Dict[str, HttpUrl]] = Field(default_factory=list)
    
    # Judging
    status: SubmissionStatus = Field(default=SubmissionStatus.DRAFT)
    scores: List[JudgeScore] = Field(default_factory=list)
    total_score: float = Field(default=0)
    average_score: float = Field(default=0)
    final_rank: Optional[int] = None
    winning_category: Optional[str] = None
    
    # Feedback
    judge_feedback: List[Dict[str, str]] = Field(default_factory=list)
    public_feedback: List[Dict[str, str]] = Field(default_factory=list)
    
    # Flags
    is_disqualified: bool = Field(default=False)
    disqualification_reason: Optional[str] = None
    is_featured: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    last_reviewed_at: Optional[datetime] = None
    
    class Settings:
        name = "submissions"
        indexes = [
            "hackathon_id",
            "team_id",
            "status",
            "final_rank",
            "is_featured",
            ("title", "text"),
            ("description", "text")
        ]
        
    async def calculate_scores(self):
        """Calculate total and average scores from judge scores."""
        if not self.scores:
            return
            
        self.total_score = sum(score.score for score in self.scores)
        self.average_score = self.total_score / len(self.scores)
        await self.save()
        
    async def add_judge_score(self, judge_score: JudgeScore):
        """Add a judge's score and recalculate totals."""
        self.scores.append(judge_score)
        await self.calculate_scores()
        
    async def update_status(self, new_status: SubmissionStatus):
        """Update submission status and relevant timestamps."""
        self.status = new_status
        if new_status == SubmissionStatus.SUBMITTED:
            self.submitted_at = datetime.utcnow()
        elif new_status == SubmissionStatus.REVIEWED:
            self.last_reviewed_at = datetime.utcnow()
        await self.save() 