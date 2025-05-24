from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

from models.team import Team
from models.user import User
from models.hackathon import Hackathon
from database.dependencies import get_db
from auth.jwt_manager import get_current_user, get_admin_user
from schemas.team import TeamCreate, TeamUpdate, TeamResponse, TeamInvite, MilestoneCreate

router = APIRouter(prefix="/teams", tags=["teams"])

@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Create a new team."""
    # Check if hackathon exists and is active
    hackathon = await Hackathon.find_one(
        Hackathon.id == team_data.hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    if hackathon.status not in ['active', 'registration_open']:
        raise HTTPException(status_code=400, detail="Hackathon is not accepting registrations")
    
    # Check if user is already in a team for this hackathon
    existing_team = await Team.find_one(
        Team.hackathon_id == team_data.hackathon_id,
        Team.members.contains([str(current_user.id)]),
        Team.is_deleted == False
    )
    
    if existing_team:
        raise HTTPException(
            status_code=400,
            detail="You are already part of a team in this hackathon"
        )
    
    # Create new team
    team = Team(
        name=team_data.name,
        hackathon_id=team_data.hackathon_id,
        leader_id=str(current_user.id),
        members=[str(current_user.id)],
        invitation_code=str(uuid.uuid4())[:8],
        skills=team_data.skills or [],
        description=team_data.description or "",
        max_size=team_data.max_size or 4,
        project_idea=team_data.project_idea or "",
        tags=team_data.tags or []
    )
    
    await team.save()
    
    return team

@router.get("/", response_model=List[TeamResponse])
async def get_teams(
    hackathon_id: Optional[str] = None,
    looking_for_members: Optional[bool] = None,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get all teams with optional filters."""
    query = {"is_deleted": False}
    
    if hackathon_id:
        query["hackathon_id"] = hackathon_id
    if looking_for_members is not None:
        query["looking_for_members"] = looking_for_members
    
    teams = await Team.find(query).to_list()
    return teams

@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(
    team_id: str,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get team details."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return team

@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: str,
    team_data: TeamUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Update team details."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if str(current_user.id) != team.leader_id:
        raise HTTPException(
            status_code=403,
            detail="Only team leader can update team details"
        )
    
    # Update allowed fields
    for field, value in team_data.dict(exclude_unset=True).items():
        setattr(team, field, value)
    
    team.last_updated_at = datetime.utcnow()
    await team.save()
    
    return team

@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Delete a team."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if str(current_user.id) != team.leader_id:
        raise HTTPException(
            status_code=403,
            detail="Only team leader can delete the team"
        )
    
    team.is_deleted = True
    team.deleted_at = datetime.utcnow()
    await team.save()

@router.post("/{team_id}/join", response_model=TeamResponse)
async def join_team(
    team_id: str,
    invitation_code: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Join a team using invitation code."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if team.invitation_code != invitation_code:
        raise HTTPException(status_code=400, detail="Invalid invitation code")
    
    if not team.looking_for_members:
        raise HTTPException(status_code=400, detail="Team is not looking for members")
    
    if str(current_user.id) in team.members:
        raise HTTPException(status_code=400, detail="You are already a member of this team")
    
    # Check if user is already in another team for this hackathon
    existing_team = await Team.find_one(
        Team.hackathon_id == team.hackathon_id,
        Team.members.contains([str(current_user.id)]),
        Team.is_deleted == False
    )
    
    if existing_team:
        raise HTTPException(
            status_code=400,
            detail="You are already part of a team in this hackathon"
        )
    
    # Check team size limit
    if len(team.members) >= team.max_size:
        raise HTTPException(status_code=400, detail="Team is already full")
    
    team.members.append(str(current_user.id))
    team.last_updated_at = datetime.utcnow()
    await team.save()
    
    return team

@router.post("/{team_id}/leave", status_code=status.HTTP_200_OK)
async def leave_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Leave a team."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if str(current_user.id) not in team.members:
        raise HTTPException(status_code=400, detail="You are not a member of this team")
    
    if str(current_user.id) == team.leader_id:
        raise HTTPException(status_code=400, detail="Team leader cannot leave the team")
    
    team.members.remove(str(current_user.id))
    team.last_updated_at = datetime.utcnow()
    await team.save()
    
    return {"message": "Successfully left the team"}

@router.post("/{team_id}/invite", response_model=TeamResponse)
async def invite_to_team(
    team_id: str,
    invite_data: TeamInvite,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Invite users to join the team."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if str(current_user.id) != team.leader_id:
        raise HTTPException(
            status_code=403,
            detail="Only team leader can send invitations"
        )
    
    if not team.looking_for_members:
        raise HTTPException(status_code=400, detail="Team is not looking for members")
    
    # Generate new invitation code
    team.invitation_code = str(uuid.uuid4())[:8]
    team.last_updated_at = datetime.utcnow()
    await team.save()
    
    return team

@router.post("/{team_id}/milestones", response_model=TeamResponse)
async def add_milestone(
    team_id: str,
    milestone_data: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Add a milestone to the team's project."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if str(current_user.id) not in team.members:
        raise HTTPException(
            status_code=403,
            detail="Only team members can add milestones"
        )
    
    milestone = {
        "id": str(uuid.uuid4()),
        "title": milestone_data.title,
        "description": milestone_data.description,
        "due_date": milestone_data.due_date,
        "status": "pending",
        "created_by": str(current_user.id),
        "created_at": datetime.utcnow(),
        "completed_at": None
    }
    
    if not team.milestones:
        team.milestones = []
    
    team.milestones.append(milestone)
    team.last_updated_at = datetime.utcnow()
    await team.save()
    
    return team

@router.post("/{team_id}/milestones/{milestone_id}/complete", response_model=TeamResponse)
async def complete_milestone(
    team_id: str,
    milestone_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Mark a milestone as completed."""
    team = await Team.find_one(
        Team.id == team_id,
        Team.is_deleted == False
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if str(current_user.id) not in team.members:
        raise HTTPException(
            status_code=403,
            detail="Only team members can complete milestones"
        )
    
    milestone = next((m for m in team.milestones if m["id"] == milestone_id), None)
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    if milestone["status"] == "completed":
        raise HTTPException(status_code=400, detail="Milestone is already completed")
    
    milestone["status"] = "completed"
    milestone["completed_at"] = datetime.utcnow()
    team.last_updated_at = datetime.utcnow()
    await team.save()
    
    return team 