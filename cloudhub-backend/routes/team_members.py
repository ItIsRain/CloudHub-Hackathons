from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status

from models.team_member import TeamMember, TeamMemberRole, TeamMemberStatus, Permission
from models.hackathon import Hackathon
from models.user import User
from auth.jwt_manager import get_current_user
from schemas.team_member import (
    TeamMemberCreate,
    TeamMemberUpdate,
    TeamMemberResponse,
    RoleConfigRequest
)
from datetime import datetime

router = APIRouter()

@router.get("/{hackathon_id}/team-members", response_model=List[TeamMemberResponse])
async def get_team_members(
    hackathon_id: str,
    role: Optional[TeamMemberRole] = Query(None, description="Filter by role"),
    status: Optional[TeamMemberStatus] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user)
):
    """Get all team members for a hackathon."""
    # Check if user has permission to view team members
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    # Check if user is organizer or team member
    if hackathon.organizer_id != str(current_user.id):
        # Check if user is a team member with permissions
        member = await TeamMember.find_one(
            TeamMember.hackathon_id == hackathon_id,
            TeamMember.user_id == str(current_user.id),
            TeamMember.is_deleted == False
        )
        if not member or Permission.ADMIN not in member.permissions:
            raise HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view team members"
            )
    
    # Build query
    query = {
        "hackathon_id": hackathon_id,
        "is_deleted": False
    }
    
    if role:
        query["role"] = role
    if status:
        query["status"] = status
    
    members = await TeamMember.find(query).to_list()
    return [TeamMemberResponse(**member.to_dict()) for member in members]

@router.post("/{hackathon_id}/team-members", response_model=TeamMemberResponse)
async def add_team_member(
    hackathon_id: str,
    member_data: TeamMemberCreate,
    current_user: User = Depends(get_current_user)
):
    """Add a new team member to the hackathon."""
    # Check if hackathon exists and user has permission
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    if hackathon.organizer_id != str(current_user.id):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Only organizers can add team members"
        )
    
    # Check if user already exists as a team member
    existing_member = await TeamMember.find_one(
        TeamMember.hackathon_id == hackathon_id,
        TeamMember.email == member_data.email,
        TeamMember.is_deleted == False
    )
    
    if existing_member:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="User is already a team member"
        )
    
    # Try to find existing user by email
    existing_user = await User.find_one(User.email == member_data.email)
    user_id = str(existing_user.id) if existing_user else ""
    
    # Create team member
    member = TeamMember(
        hackathon_id=hackathon_id,
        user_id=user_id,
        name=member_data.name,
        email=member_data.email,
        role=member_data.role,
        permissions=member_data.permissions,
        status=TeamMemberStatus.PENDING if not existing_user else TeamMemberStatus.ACTIVE,
        added_by=str(current_user.id),
        auto_approve=member_data.auto_approve,
        notifications_enabled=member_data.notifications_enabled,
        date_invited=datetime.utcnow()
    )
    
    if existing_user:
        member.date_joined = datetime.utcnow()
        member.status = TeamMemberStatus.ACTIVE
    
    await member.save()
    
    # TODO: Send invitation email if user doesn't exist
    
    return TeamMemberResponse(**member.to_dict())

@router.put("/{hackathon_id}/team-members/{member_id}", response_model=TeamMemberResponse)
async def update_team_member(
    hackathon_id: str,
    member_id: str,
    member_data: TeamMemberUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a team member."""
    # Check permissions
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    if hackathon.organizer_id != str(current_user.id):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Only organizers can update team members"
        )
    
    # Find and update member
    member = await TeamMember.get(member_id)
    if not member or member.hackathon_id != hackathon_id or member.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Team member not found"
        )
    
    # Update fields
    update_data = member_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)
    
    member.updated_at = datetime.utcnow()
    await member.save()
    
    return TeamMemberResponse(**member.to_dict())

@router.delete("/{hackathon_id}/team-members/{member_id}")
async def remove_team_member(
    hackathon_id: str,
    member_id: str,
    current_user: User = Depends(get_current_user)
):
    """Remove a team member."""
    # Check permissions
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    if hackathon.organizer_id != str(current_user.id):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Only organizers can remove team members"
        )
    
    # Find and soft delete member
    member = await TeamMember.get(member_id)
    if not member or member.hackathon_id != hackathon_id or member.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Team member not found"
        )
    
    member.is_deleted = True
    member.deleted_at = datetime.utcnow()
    member.deleted_by = str(current_user.id)
    await member.save()
    
    return {"message": "Team member removed successfully"}

@router.get("/{hackathon_id}/roles")
async def get_role_summary(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get role summary with member counts."""
    # Check permissions
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    # Get role counts
    role_counts = {}
    for role in TeamMemberRole:
        count = await TeamMember.find(
            TeamMember.hackathon_id == hackathon_id,
            TeamMember.role == role,
            TeamMember.is_deleted == False
        ).count()
        role_counts[role.value] = count
    
    roles = [
        {
            "name": "organizer",
            "count": role_counts.get("organizer", 0),
            "description": "Full access to manage the hackathon"
        },
        {
            "name": "judge",
            "count": role_counts.get("judge", 0),
            "description": "Access to review and score submissions"
        },
        {
            "name": "mentor",
            "count": role_counts.get("mentor", 0),
            "description": "Can provide guidance to participants"
        },
        {
            "name": "media",
            "count": role_counts.get("media", 0),
            "description": "Media coverage and documentation access"
        }
    ]
    
    return {"roles": roles}

@router.post("/{hackathon_id}/roles/{role}/configure")
async def configure_role(
    hackathon_id: str,
    role: TeamMemberRole,
    config_data: RoleConfigRequest,
    current_user: User = Depends(get_current_user)
):
    """Configure role settings."""
    # Check permissions
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    if hackathon.organizer_id != str(current_user.id):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Only organizers can configure roles"
        )
    
    # Update all members with this role
    members = await TeamMember.find(
        TeamMember.hackathon_id == hackathon_id,
        TeamMember.role == role,
        TeamMember.is_deleted == False
    ).to_list()
    
    for member in members:
        if config_data.permissions is not None:
            member.permissions = config_data.permissions
        if config_data.auto_approve is not None:
            member.auto_approve = config_data.auto_approve
        if config_data.notifications_enabled is not None:
            member.notifications_enabled = config_data.notifications_enabled
        
        member.updated_at = datetime.utcnow()
        await member.save()
    
    return {"message": f"Role {role.value} configured successfully", "updated_members": len(members)} 