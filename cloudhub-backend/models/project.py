from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from beanie import Document, Link, before_event, Replace, Insert
from models.base import BaseModel as BaseDBModel
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel

class Project(BaseDBModel):
    """Project model for hackathon submissions."""
    
    # Basic information
    title: str
    description: str
    team: Link['Team']
    hackathon: Link['Hackathon']
    
    # Project details
    short_description: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_description: Optional[str] = None
    technical_implementation: Optional[str] = None
    innovation_factor: Optional[str] = None
    impact_potential: Optional[str] = None
    future_plans: Optional[str] = None
    
    # Technical information
    technologies: List[str] = Field(default_factory=list)
    repository_url: Optional[str] = None
    demo_url: Optional[str] = None
    demo_video_url: Optional[str] = None
    presentation_url: Optional[str] = None
    
    # Media
    thumbnail: Optional[str] = None
    screenshots: List[str] = Field(default_factory=list)
    attachments: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Team and collaboration
    contributors: List[str] = Field(default_factory=list)  # List of user IDs
    mentor_feedback: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Submission status
    status: str = "draft"  # draft, submitted, under_review, approved, rejected
    submitted_at: Optional[datetime] = None
    last_updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Evaluation
    evaluation_criteria: Dict[str, Any] = Field(default_factory=dict)
    scores: Dict[str, List[Dict[str, Any]]] = Field(default_factory=dict)
    judge_feedback: List[Dict[str, Any]] = Field(default_factory=list)
    final_score: Optional[float] = None
    ranking: Optional[int] = None
    
    # Additional information
    tags: List[str] = Field(default_factory=list)
    custom_fields: Dict[str, Any] = Field(default_factory=dict)
    analytics: Dict[str, Any] = Field(default_factory=dict)
    
    class Settings:
        name = "projects"
        use_state_management = True
        indexes = [
            # Basic indexes
            IndexModel([("team.id", 1)], name="idx_project_team_id"),
            IndexModel([("hackathon.id", 1)], name="idx_project_hackathon_id"),
            IndexModel([("status", 1)], name="idx_project_status"),
            IndexModel([("submitted_at", -1)], name="idx_project_submitted_at"),
            IndexModel([("final_score", -1)], name="idx_project_final_score"),
            # Text search index
            IndexModel(
                [("title", "text"), ("description", "text")],
                name="idx_project_text_search",
                weights={"title": 10, "description": 5}
            )
        ]
    
    async def submit(self):
        """Submit the project for review."""
        if self.status == 'draft':
            self.status = 'submitted'
            self.submitted_at = datetime.utcnow()
            await self.save()
            return True
        return False
    
    async def update_status(self, status: str, feedback: Optional[str] = None):
        """Update project status with optional feedback."""
        valid_statuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected']
        if status in valid_statuses:
            self.status = status
            self.last_updated_at = datetime.utcnow()
            if feedback:
                self.judge_feedback.append({
                    'feedback': feedback,
                    'status': status,
                    'timestamp': datetime.utcnow().isoformat()
                })
            await self.save()
            return True
        return False
    
    async def add_mentor_feedback(self, mentor_id: str, feedback: str):
        """Add mentor feedback to the project."""
        self.mentor_feedback.append({
            'mentor_id': mentor_id,
            'feedback': feedback,
            'timestamp': datetime.utcnow().isoformat()
        })
        self.last_updated_at = datetime.utcnow()
        await self.save()
    
    async def add_score(self, judge_id: str, criteria: str, score: float, feedback: Optional[str] = None):
        """Add or update score for a specific criteria."""
        if not self.scores:
            self.scores = {}
            
        if criteria not in self.scores:
            self.scores[criteria] = []
            
        self.scores[criteria].append({
            'judge_id': judge_id,
            'score': score,
            'feedback': feedback,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        self.last_updated_at = datetime.utcnow()
        await self.save()
    
    async def calculate_final_score(self):
        """Calculate final score based on judges' scores."""
        if not self.scores:
            return None
            
        total_score = 0
        count = 0
        
        for criteria, scores in self.scores.items():
            criteria_total = sum(s['score'] for s in scores)
            criteria_count = len(scores)
            if criteria_count > 0:
                total_score += criteria_total / criteria_count
                count += 1
                
        if count > 0:
            self.final_score = total_score / count
            await self.save()
            return self.final_score
        return None
    
    async def add_attachment(self, file_url: str, file_type: str, file_name: str):
        """Add an attachment to the project."""
        self.attachments.append({
            'url': file_url,
            'type': file_type,
            'name': file_name,
            'uploaded_at': datetime.utcnow().isoformat()
        })
        self.last_updated_at = datetime.utcnow()
        await self.save()
    
    @classmethod
    async def get_by_hackathon(cls, hackathon_id: str) -> List['Project']:
        """Get all projects for a hackathon."""
        return await cls.find(
            cls.hackathon.id == hackathon_id,
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_by_team(cls, team_id: str) -> Optional['Project']:
        """Get project by team ID."""
        return await cls.find_one(
            cls.team.id == team_id,
            cls.is_deleted == False
        )
    
    @classmethod
    async def get_submitted_projects(cls, hackathon_id: str) -> List['Project']:
        """Get all submitted projects for a hackathon."""
        return await cls.find(
            cls.hackathon.id == hackathon_id,
            cls.status == 'submitted',
            cls.is_deleted == False
        ).to_list() 