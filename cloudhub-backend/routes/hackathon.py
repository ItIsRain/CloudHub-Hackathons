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
    
    # Create hackathon
    hackathon = Hackathon(
        title=hackathon_data['title'],
        description=hackathon_data['description'],
        organizer=str(current_user.id),
        start_date=hackathon_data['start_date'],
        end_date=hackathon_data['end_date'],
        registration_deadline=hackathon_data['registration_deadline'],
        submission_deadline=hackathon_data['submission_deadline'],
        organizer_logo=hackathon_data.get('organizer_logo'),
        prize_pool=hackathon_data.get('prize_pool'),
        location=hackathon_data.get('location'),
        venue=hackathon_data.get('venue'),
        categories=hackathon_data.get('categories', []),
        requirements=hackathon_data.get('requirements', []),
        rules=hackathon_data.get('rules', []),
        eligibility=hackathon_data.get('eligibility', []),
        image=hackathon_data.get('image'),
        cover_image=hackathon_data.get('cover_image'),
        short_description=hackathon_data.get('short_description'),
        max_participants=hackathon_data.get('max_participants'),
        difficulty=hackathon_data.get('difficulty'),
        mode=hackathon_data.get('mode'),
        timezone=hackathon_data.get('timezone'),
        resources=hackathon_data.get('resources', []),
        mentors=hackathon_data.get('mentors', []),
        judges=hackathon_data.get('judges', []),
        sponsors=hackathon_data.get('sponsors', []),
        timeline=hackathon_data.get('timeline', []),
        budget=hackathon_data.get('budget', {}),
        sponsorship_tiers=hackathon_data.get('sponsorship_tiers', []),
        application_questions=hackathon_data.get('application_questions', [])
    )
    
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