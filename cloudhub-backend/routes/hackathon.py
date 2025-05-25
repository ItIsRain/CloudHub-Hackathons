from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import ValidationError
import re
import logging
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

from models.hackathon import (
    Hackathon, 
    HackathonStatus, 
    Timeline,
    BillingInfo,
    Technology,
    Prize,
    PricingTier
)
from models.user import User
from database.dependencies import get_db
from auth.jwt_manager import get_current_user
from schemas.hackathon import (
    HackathonCreate,
    HackathonUpdate,
    HackathonResponse
)

router = APIRouter()

def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from the title."""
    # Convert to lowercase and remove special characters
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'[-\s]+', '-', slug)
    # Add timestamp for uniqueness
    timestamp = datetime.utcnow().strftime('%Y%m%d-%H%M%S')
    return f"{slug}-{timestamp}"

def validate_and_convert_datetime(date_str: str) -> datetime:
    """Validate and convert ISO date string to datetime object."""
    try:
        # Handle Z suffix by replacing with +00:00
        if date_str.endswith('Z'):
            date_str = date_str.replace('Z', '+00:00')
        return datetime.fromisoformat(date_str)
    except (ValueError, AttributeError) as e:
        logger.error(f"Invalid date format: {date_str}, error: {str(e)}")
        raise ValueError(f"Invalid date format: {date_str}")

@router.post("/", response_model=HackathonResponse)
@router.post("", response_model=HackathonResponse)
async def create_hackathon(
    request: Request,
    data: HackathonCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
) -> dict:
    """Create a new hackathon."""
    try:
        # Log raw request body for debugging
        raw_body = await request.body()
        try:
            body_json = json.loads(raw_body)
            logger.debug(f"Raw request body: {json.dumps(body_json, indent=2)}")
        except json.JSONDecodeError as e:
            logger.error(f"Could not parse request body as JSON: {str(e)}")
            logger.debug(f"Raw request body: {raw_body}")

        # Log parsed data
        logger.debug("Parsed request data:")
        logger.debug(f"Title: {data.title}")
        logger.debug(f"Description: {data.description}")
        logger.debug(f"Short Description: {data.short_description}")
        logger.debug(f"Organization Name: {data.organization_name}")
        
        # Log timeline data
        if data.timeline:
            logger.debug("Timeline data:")
            timeline_dict = data.timeline.dict()
            for key, value in timeline_dict.items():
                logger.debug(f"  {key}: {value}")
        else:
            logger.error("Timeline data is missing")
            
        # Log billing data
        if data.billing:
            logger.debug("Billing data:")
            billing_dict = data.billing.dict()
            for key, value in billing_dict.items():
                logger.debug(f"  {key}: {value}")
        else:
            logger.error("Billing data is missing")
        
        # Generate slug from title
        slug = generate_slug(data.title)
        logger.debug(f"Generated slug: {slug}")
        
        # Create timeline - convert strings to datetime objects directly
        try:
            logger.debug("Creating timeline with datetime objects")
            
            # Convert string dates to datetime objects
            registration_start = validate_and_convert_datetime(str(data.timeline.registration_start))
            registration_end = validate_and_convert_datetime(str(data.timeline.registration_end))
            event_start = validate_and_convert_datetime(str(data.timeline.event_start))
            event_end = validate_and_convert_datetime(str(data.timeline.event_end))
            judging_start = validate_and_convert_datetime(str(data.timeline.judging_start))
            judging_end = validate_and_convert_datetime(str(data.timeline.judging_end))
            winners_announcement = validate_and_convert_datetime(str(data.timeline.winners_announcement))
            
            timeline = Timeline(
                registration_start=registration_start,
                registration_end=registration_end,
                event_start=event_start,
                event_end=event_end,
                judging_start=judging_start,
                judging_end=judging_end,
                winners_announcement=winners_announcement
            )
            logger.debug(f"Timeline created successfully")
            
        except (ValueError, AttributeError) as e:
            logger.error(f"Error with timeline dates: {str(e)}")
            logger.error(f"Timeline data received: {data.timeline}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid date format in timeline: {str(e)}"
            )
        
        try:
            # Create billing info
            logger.debug(f"Creating billing info with package: {data.billing.package}")
            billing = BillingInfo(
                pricing_tier=PricingTier(data.billing.package),
                base_price=float(data.billing.amount),
                participant_price=0.0,  # Default to 0
                total_amount=float(data.billing.amount),  # Initially same as base price
                currency=data.billing.currency,
                is_paid=False,  # Default to unpaid
                payment_date=None,
                invoice_id=None
            )
            logger.debug(f"Billing info created successfully: {billing.dict()}")
        except (ValueError, AttributeError) as e:
            logger.error(f"Error creating billing info: {str(e)}")
            logger.error(f"Billing data received: {data.billing}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid billing data: {str(e)}"
            )
        
        # Create technologies list
        logger.debug("Creating technologies list")
        try:
            technologies = [
                Technology(
                    name=tech.name,
                    description=tech.description,
                    icon_url=tech.icon_url if hasattr(tech, 'icon_url') else None
                )
                for tech in (data.technologies or [])
            ]
            logger.debug(f"Created {len(technologies)} technologies")
        except Exception as e:
            logger.error(f"Error creating technologies: {str(e)}")
            logger.error(f"Technologies data received: {data.technologies}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid technology data: {str(e)}"
            )
        
        # Create prizes list
        logger.debug("Creating prizes list")
        try:
            prizes = [
                Prize(
                    position=prize.position,
                    amount=float(prize.amount),
                    currency=prize.currency,
                    description=prize.description,
                    sponsor=prize.sponsor if hasattr(prize, 'sponsor') else None
                )
                for prize in (data.prizes or [])
            ]
            logger.debug(f"Created {len(prizes)} prizes")
        except Exception as e:
            logger.error(f"Error creating prizes: {str(e)}")
            logger.error(f"Prizes data received: {data.prizes}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid prize data: {str(e)}"
            )
        
        # Calculate total prize pool
        total_prize_pool = sum(prize.amount for prize in prizes)
        logger.debug(f"Total prize pool: {total_prize_pool}")
        
        # Ensure organizer_id is properly converted to string
        organizer_id = str(current_user.id)
        if isinstance(current_user.id, ObjectId):
            organizer_id = str(current_user.id)
        logger.debug(f"Organizer ID after conversion: {organizer_id}")
        
        # Create hackathon
        logger.debug("Creating hackathon object")
        try:
            hackathon = Hackathon(
                title=data.title,
                slug=slug,
                description=data.description,
                short_description=data.short_description,
                cover_image=data.cover_image,
                banner_image=data.banner_image,
                organizer_id=organizer_id,
                organization_name=data.organization_name,
                organization_logo=data.organization_logo,
                status=HackathonStatus.DRAFT,
                max_participants=data.max_participants,
                min_team_size=data.min_team_size or 1,
                max_team_size=data.max_team_size or 4,
                is_team_required=data.is_team_required if hasattr(data, 'is_team_required') else True,
                technologies=technologies,
                prizes=prizes,
                total_prize_pool=total_prize_pool,
                timeline=timeline,
                requirements=data.requirements or [],
                rules=data.rules or [],
                judging_criteria=data.judging_criteria or [],
                resources=data.resources or [],
                submission_template=data.submission_template,
                billing=billing,
                tags=data.tags or [],
                is_featured=False,
                is_private=data.is_private or False,
                access_code=data.access_code if (hasattr(data, 'access_code') and data.is_private) else None
            )
            logger.debug("Hackathon object created successfully")
        except ValidationError as e:
            logger.error(f"Validation error creating hackathon object: {str(e)}")
            logger.error(f"Validation error details: {e.errors()}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"message": "Validation error", "errors": e.errors()}
            )
        except Exception as e:
            logger.error(f"Error creating hackathon object: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error creating hackathon object: {str(e)}"
            )
        
        # Save to database
        try:
            logger.debug("Attempting to save hackathon to database")
            await hackathon.save()
            logger.debug("Hackathon saved successfully")
        except Exception as e:
            logger.error(f"Database error while saving hackathon: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
        
        # Convert to dict and return
        try:
            logger.debug("Converting hackathon to dictionary")
            result = hackathon.to_dict()
            logger.debug("Successfully converted to dictionary")
            return result
        except Exception as e:
            logger.error(f"Error converting hackathon to dictionary: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error converting response: {str(e)}"
            )
        
    except ValidationError as e:
        logger.error(f"Validation error in create_hackathon: {str(e)}")
        logger.error(f"Validation error details: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"message": "Validation error", "errors": e.errors()}
        )
    except Exception as e:
        logger.error(f"Unexpected error in create_hackathon: {str(e)}")
        logger.error(f"Full error traceback:", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create hackathon: {str(e)}"
        )

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