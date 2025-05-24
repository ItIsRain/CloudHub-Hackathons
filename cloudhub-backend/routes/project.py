from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Dict, Any
from datetime import datetime

from models.project import Project
from models.team import Team
from models.hackathon import Hackathon
from models.user import User
from auth.jwt_manager import get_current_user
from database.dependencies import get_db

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: dict,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project submission."""
    # Validate required fields
    required_fields = ['title', 'description', 'team_id', 'hackathon_id']
    for field in required_fields:
        if field not in project_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required field: {field}"
            )
    
    # Check if team exists and user is a member
    team = await Team.find_one(Team.id == project_data['team_id'], Team.is_deleted == False)
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    if str(current_user.id) not in team.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be a team member to create a project"
        )
    
    # Check if hackathon exists and is active
    hackathon = await Hackathon.find_one(Hackathon.id == project_data['hackathon_id'])
    
    if not hackathon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    if hackathon.status not in ['active', 'submission_open']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hackathon is not accepting submissions"
        )
    
    # Check if team already has a project
    existing_project = await Project.find_one(Project.team_id == project_data['team_id'])
    if existing_project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team already has a project submission"
        )
    
    # Create new project
    project = Project(
        title=project_data['title'],
        description=project_data['description'],
        team_id=project_data['team_id'],
        hackathon_id=project_data['hackathon_id'],
        short_description=project_data.get('short_description'),
        problem_statement=project_data.get('problem_statement'),
        solution_description=project_data.get('solution_description'),
        technical_implementation=project_data.get('technical_implementation'),
        innovation_factor=project_data.get('innovation_factor'),
        impact_potential=project_data.get('impact_potential'),
        future_plans=project_data.get('future_plans'),
        technologies=project_data.get('technologies', []),
        repository_url=project_data.get('repository_url'),
        demo_url=project_data.get('demo_url'),
        demo_video_url=project_data.get('demo_video_url'),
        presentation_url=project_data.get('presentation_url'),
        thumbnail=project_data.get('thumbnail'),
        screenshots=project_data.get('screenshots', []),
        contributors=team.members,
        tags=project_data.get('tags', []),
        custom_fields=project_data.get('custom_fields', {})
    )
    
    await project.save()
    
    return {
        'message': 'Project created successfully',
        'project': project.to_dict()
    }

@router.get("/", response_model=Dict[str, List[Dict[str, Any]]])
async def get_projects(
    hackathon_id: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get all projects with optional filters."""
    query = {"is_deleted": False}
    
    if hackathon_id:
        query["hackathon_id"] = hackathon_id
    if status:
        query["status"] = status
    
    projects = await Project.find(query).to_list()
    
    return {
        'projects': [project.to_dict() for project in projects]
    }

@router.get("/{project_id}", response_model=Dict[str, Any])
async def get_project(
    project_id: str,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get project details."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project.to_dict()

@router.put("/{project_id}", response_model=Dict[str, Any])
async def update_project(
    project_id: str,
    project_data: dict,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update project details."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is team member
    team = await Team.find_one(Team.id == project.team_id)
    
    if str(current_user.id) not in team.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can update the project"
        )
    
    # Check if project can be updated
    if project.status not in ['draft', 'submitted']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project cannot be updated in current status"
        )
    
    # Update allowed fields
    allowed_fields = {
        'title', 'description', 'short_description',
        'problem_statement', 'solution_description',
        'technical_implementation', 'innovation_factor',
        'impact_potential', 'future_plans', 'technologies',
        'repository_url', 'demo_url', 'demo_video_url',
        'presentation_url', 'thumbnail', 'screenshots',
        'tags', 'custom_fields'
    }
    
    for field, value in project_data.items():
        if field in allowed_fields:
            setattr(project, field, value)
    
    project.last_updated_at = datetime.utcnow()
    await project.save()
    
    return {
        'message': 'Project updated successfully',
        'project': project.to_dict()
    }

@router.delete("/{project_id}", response_model=Dict[str, str])
async def delete_project(
    project_id: str,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is team member
    team = await Team.find_one(Team.id == project.team_id)
    
    if str(current_user.id) not in team.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can delete the project"
        )
    
    project.is_deleted = True
    project.deleted_at = datetime.utcnow()
    await project.save()
    
    return {
        'message': 'Project deleted successfully'
    }

@router.post("/{project_id}/submit", response_model=Dict[str, Any])
async def submit_project(
    project_id: str,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a project for review."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is team member
    team = await Team.find_one(Team.id == project.team_id)
    
    if str(current_user.id) not in team.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can submit the project"
        )
    
    # Check if hackathon is accepting submissions
    hackathon = await Hackathon.find_one(Hackathon.id == project.hackathon_id)
    
    if hackathon.status not in ['active', 'submission_open']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hackathon is not accepting submissions"
        )
    
    project.status = 'submitted'
    project.submitted_at = datetime.utcnow()
    await project.save()
    
    return {
        'message': 'Project submitted successfully',
        'project': project.to_dict()
    }

@router.post("/{project_id}/mentor-feedback", response_model=Dict[str, Any])
async def add_mentor_feedback(
    project_id: str,
    feedback_data: dict,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add mentor feedback to a project."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is a mentor
    hackathon = await Hackathon.find_one(Hackathon.id == project.hackathon_id)
    
    if str(current_user.id) not in hackathon.mentors:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only mentors can provide feedback"
        )
    
    feedback = {
        'mentor_id': str(current_user.id),
        'feedback': feedback_data.get('feedback'),
        'created_at': datetime.utcnow()
    }
    
    if not project.mentor_feedback:
        project.mentor_feedback = []
    
    project.mentor_feedback.append(feedback)
    await project.save()
    
    return {
        'message': 'Mentor feedback added successfully',
        'project': project.to_dict()
    }

@router.post("/{project_id}/score", response_model=Dict[str, Any])
async def add_score(
    project_id: str,
    score_data: dict,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add judge's score to a project."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is a judge
    hackathon = await Hackathon.find_one(Hackathon.id == project.hackathon_id)
    
    if str(current_user.id) not in hackathon.judges:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only judges can score projects"
        )
    
    score = {
        'judge_id': str(current_user.id),
        'scores': score_data.get('scores', {}),
        'comments': score_data.get('comments'),
        'created_at': datetime.utcnow()
    }
    
    if not project.scores:
        project.scores = []
    
    project.scores.append(score)
    await project.save()
    
    return {
        'message': 'Project score added successfully',
        'project': project.to_dict()
    }

@router.put("/{project_id}/status", response_model=Dict[str, Any])
async def update_project_status(
    project_id: str,
    status_data: dict,
    db: AsyncIOMotorClient = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update project status."""
    project = await Project.find_one(Project.id == project_id, Project.is_deleted == False)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is an admin or organizer
    hackathon = await Hackathon.find_one(Hackathon.id == project.hackathon_id)
    
    if str(current_user.id) not in hackathon.organizers and current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizers and admins can update project status"
        )
    
    new_status = status_data.get('status')
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status is required"
        )
    
    project.status = new_status
    project.last_updated_at = datetime.utcnow()
    await project.save()
    
    return {
        'message': 'Project status updated successfully',
        'project': project.to_dict()
    } 