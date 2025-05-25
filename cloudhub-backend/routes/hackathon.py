from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient

from models.hackathon import Hackathon
from models.user import User
from database.dependencies import get_db
from auth.jwt_manager import get_current_user

router = APIRouter()

@router.post("/", status_code=201)
async def create_hackathon(
    hackathon_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Create a new hackathon."""
    # Check permissions
    if current_user.role not in ['organizer', 'admin']:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized to create hackathon"
        )
    
    # Validate required fields
    required_fields = ['title', 'description', 'dateRange', 'registrationDeadline', 'maxParticipants']
    for field in required_fields:
        if field not in hackathon_data:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required field: {field}"
            )
    
    # Create timeline object
    timeline = {
        "registration_start": datetime.utcnow(),
        "registration_end": hackathon_data['registrationDeadline'],
        "event_start": hackathon_data['dateRange']['from'],
        "event_end": hackathon_data['dateRange']['to'],
        "judging_start": hackathon_data['dateRange']['to'],  # Default to end date
        "judging_end": datetime.fromtimestamp(datetime.timestamp(hackathon_data['dateRange']['to']) + 86400),  # End date + 1 day
        "winners_announcement": datetime.fromtimestamp(datetime.timestamp(hackathon_data['dateRange']['to']) + 172800),  # End date + 2 days
    }
    
    # Create billing info based on package
    billing_info = {
        "pricing_tier": hackathon_data.get('package', 'starter').upper(),
        "base_price": {
            "STARTER": 2500,
            "GROWTH": 7500,
            "SCALE": 20000
        }.get(hackathon_data.get('package', 'starter').upper(), 2500),
        "participant_price": 0,  # Calculated based on max participants if needed
        "total_amount": hackathon_data.get('totalAmount', 2500),
        "currency": "AED",
        "is_paid": False
    }
    
    # Process judging criteria
    judging_criteria = []
    for criterion in hackathon_data.get('judgingCriteria', []):
        judging_criteria.append({
            "name": criterion['name'],
            "weight": criterion['weight'],
            "description": criterion['description']
        })
    
    # Process prizes
    prizes = []
    for prize in hackathon_data.get('prizes', []):
        prizes.append({
            "position": int(prize['place'].split()[0]),  # Extract number from "1st Place"
            "amount": float(prize['amount']),
            "currency": "AED",
            "description": prize['place']
        })
    
    # Create hackathon object
    hackathon = Hackathon(
        title=hackathon_data['title'],
        slug=hackathon_data['title'].lower().replace(' ', '-'),
        description=hackathon_data['description'],
        short_description=hackathon_data['description'][:200],
        organizer_id=str(current_user.id),
        organization_name=current_user.organization_name or "Independent Organizer",
        status=HackathonStatus.DRAFT,
        max_participants=hackathon_data['maxParticipants'],
        min_team_size=1,
        max_team_size=4,
        is_team_required=True,
        prizes=prizes,
        total_prize_pool=float(hackathon_data.get('prizePool', 0)),
        timeline=timeline,
        requirements=hackathon_data.get('requirements', []),
        rules=hackathon_data.get('rules', []).split('\n'),
        judging_criteria=judging_criteria,
        billing=billing_info,
        tags=hackathon_data.get('tags', []),
        is_featured=False,
        is_private=hackathon_data.get('isPrivate', False)
    )
    
    # Add challenges if provided
    if 'challenges' in hackathon_data:
        hackathon.challenges = [
            {
                "title": challenge['title'],
                "description": challenge['description']
            }
            for challenge in hackathon_data['challenges']
        ]
    
    await hackathon.save()
    
    return {
        'message': 'Hackathon created successfully',
        'hackathon': hackathon.to_dict()
    }

@router.get("/")
async def get_hackathons(
    status: Optional[str] = None,
    category: Optional[str] = None,
    featured: bool = Query(default=False),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get all hackathons with optional filters."""
    query = {"is_deleted": False}
    
    if status:
        query["status"] = status
    if category:
        query["categories"] = {"$in": [category]}
    if featured:
        query["featured"] = True
    
    hackathons = await Hackathon.find(query).to_list()
    
    return [h.to_dict() for h in hackathons]

@router.get("/{hackathon_id}")
async def get_hackathon(
    hackathon_id: str,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get hackathon details."""
    hackathon = await Hackathon.find_one(
        Hackathon.id == hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )
    
    return hackathon.to_dict()

@router.put("/{hackathon_id}")
async def update_hackathon(
    hackathon_id: str,
    hackathon_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Update hackathon details."""
    hackathon = await Hackathon.find_one(
        Hackathon.id == hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )
    
    # Check permissions
    if str(hackathon.organizer) != str(current_user.id) and current_user.role != 'admin':
        raise HTTPException(
            status_code=403,
            detail="Unauthorized to update hackathon"
        )
    
    # Update fields
    non_updatable = {'id', 'created_at', 'organizer'}
    for key, value in hackathon_data.items():
        if key not in non_updatable and hasattr(hackathon, key):
            setattr(hackathon, key, value)
    
    hackathon.last_updated_at = datetime.utcnow()
    await hackathon.save()
    
    return {
        'message': 'Hackathon updated successfully',
        'hackathon': hackathon.to_dict()
    }

@router.delete("/{hackathon_id}")
async def delete_hackathon(
    hackathon_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Delete a hackathon."""
    hackathon = await Hackathon.find_one(
        Hackathon.id == hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )
    
    # Check permissions
    if str(hackathon.organizer) != str(current_user.id) and current_user.role != 'admin':
        raise HTTPException(
            status_code=403,
            detail="Unauthorized to delete hackathon"
        )
    
    hackathon.is_deleted = True
    hackathon.deleted_at = datetime.utcnow()
    await hackathon.save()
    
    return {
        'message': 'Hackathon deleted successfully'
    }

@router.post("/{hackathon_id}/register")
async def register_for_hackathon(
    hackathon_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Register current user for a hackathon."""
    hackathon = await Hackathon.find_one(
        Hackathon.id == hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )
    
    # Check if registration is open
    if hackathon.status not in ['active', 'registration_open']:
        raise HTTPException(
            status_code=400,
            detail="Hackathon registration is not open"
        )
    
    # Check if user is already registered
    if str(current_user.id) in hackathon.participants:
        raise HTTPException(
            status_code=400,
            detail="You are already registered for this hackathon"
        )
    
    # Check if hackathon is full
    if hackathon.max_participants and len(hackathon.participants) >= hackathon.max_participants:
        raise HTTPException(
            status_code=400,
            detail="Hackathon has reached maximum participants"
        )
    
    # Add user to participants
    if not hackathon.participants:
        hackathon.participants = []
    
    hackathon.participants.append(str(current_user.id))
    hackathon.last_updated_at = datetime.utcnow()
    await hackathon.save()
    
    return {
        'message': 'Successfully registered for hackathon',
        'hackathon': hackathon.to_dict()
    }

@router.post("/{hackathon_id}/unregister")
async def unregister_from_hackathon(
    hackathon_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Unregister current user from a hackathon."""
    hackathon = await Hackathon.find_one(
        Hackathon.id == hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )
    
    # Check if user is registered
    if str(current_user.id) not in hackathon.participants:
        raise HTTPException(
            status_code=400,
            detail="You are not registered for this hackathon"
        )
    
    # Remove user from participants
    hackathon.participants.remove(str(current_user.id))
    hackathon.last_updated_at = datetime.utcnow()
    await hackathon.save()
    
    return {
        'message': 'Successfully unregistered from hackathon',
        'hackathon': hackathon.to_dict()
    }

@router.get("/{hackathon_id}/participants")
async def get_hackathon_participants(
    hackathon_id: str,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get all participants of a hackathon."""
    hackathon = await Hackathon.find_one(
        Hackathon.id == hackathon_id,
        Hackathon.is_deleted == False
    )
    
    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )
    
    # Get user details for all participants
    participants = []
    for user_id in hackathon.participants:
        user = await User.find_one(User.id == user_id)
        if user:
            participants.append(user.to_dict())
    
    return {
        'participants': participants
    } 