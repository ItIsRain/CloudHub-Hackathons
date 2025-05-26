from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import ValidationError
import re
import logging
import json
from utils.code_generator import generate_access_code

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
    PricingTier,
    JudgingCriterion as ModelJudgingCriterion,  # Import from models
    Challenge as ModelChallenge  # Import from models
)
from models.user import User
from database.dependencies import get_db
from auth.jwt_manager import get_current_user
from schemas.hackathon import (
    HackathonCreate,
    HackathonUpdate,
    HackathonResponse,
    JudgingCriterion as SchemaJudgingCriterion,  # Import from schemas with alias
    Challenge as SchemaChallenge  # Import from schemas with alias
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
        
        # Create judging criteria list - USE MODEL CLASS, NOT SCHEMA CLASS
        logger.debug("Creating judging criteria list")
        try:
            judging_criteria = [
                ModelJudgingCriterion(  # Changed from JudgingCriterion to ModelJudgingCriterion
                    name=criteria.name,
                    description=criteria.description,
                    weight=float(criteria.weight)
                )
                for criteria in (data.judging_criteria or [])
            ]
            logger.debug(f"Created {len(judging_criteria)} judging criteria")
        except Exception as e:
            logger.error(f"Error creating judging criteria: {str(e)}")
            logger.error(f"Judging criteria data received: {data.judging_criteria}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid judging criteria data: {str(e)}"
            )
        
        # Create challenges list - USE MODEL CLASS, NOT SCHEMA CLASS
        logger.debug("Creating challenges list")
        try:
            challenges = [
                ModelChallenge(  # Changed from Challenge to ModelChallenge
                    title=challenge.title,
                    description=challenge.description
                )
                for challenge in (data.challenges or [])
            ]
            logger.debug(f"Created {len(challenges)} challenges")
        except Exception as e:
            logger.error(f"Error creating challenges: {str(e)}")
            logger.error(f"Challenges data received: {data.challenges}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid challenge data: {str(e)}"
            )
        
        # Create prizes list
        logger.debug("Creating prizes list")
        try:
            prizes = [
                Prize(
                    position=prize.position,
                    amount=float(prize.amount),
                    description=prize.description,
                    currency=prize.currency
                )
                for prize in (data.prizes or [])
            ]
            logger.debug(f"Created {len(prizes)} prizes")
            
            # Calculate total prize pool
            total_prize_pool = sum(prize.amount for prize in prizes)
            logger.debug(f"Total prize pool: {total_prize_pool}")
            
        except Exception as e:
            logger.error(f"Error creating prizes: {str(e)}")
            logger.error(f"Prize data received: {data.prizes}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid prize data: {str(e)}"
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
            logger.error(f"Technology data received: {data.technologies}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid technology data: {str(e)}"
            )
        
        # Convert organizer_id to ObjectId
        try:
            organizer_id = str(current_user.id)
            logger.debug(f"Organizer ID after conversion: {organizer_id}")
        except Exception as e:
            logger.error(f"Error converting organizer ID: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid organizer ID: {str(e)}"
            )
        
        # Get organization name from user data if not provided
        organization_name = data.organization_name
        if not organization_name or organization_name == "Default Organization":
            # Try to get organization name from current user
            organization_name = getattr(current_user, 'organization_name', None) or \
                               getattr(current_user, 'company', None) or \
                               getattr(current_user, 'organization', None) or \
                               f"{current_user.first_name} {current_user.last_name}".strip() or \
                               "Your Organization"
        logger.debug(f"Organization name resolved to: {organization_name}")
        
        # Generate initial access code
        initial_access_code = generate_access_code()
        logger.debug(f"Generated initial access code: {initial_access_code}")

        # Create hackathon object
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
                organization_name=organization_name,
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
                rules=data.rules or "",
                judging_criteria=judging_criteria,
                challenges=challenges,
                resources=data.resources or [],
                submission_template=data.submission_template,
                billing=billing,
                tags=data.tags or [],
                is_featured=False,
                is_private=data.is_private or False,
                access_code=initial_access_code  # Set initial access code
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

@router.post("/admin/fix-access-codes")
async def fix_access_codes(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Fix missing access codes for all hackathons."""
    # Check if user is admin
    if not current_user.role == 'admin':
        raise HTTPException(
            status_code=403,
            detail="Only administrators can perform this operation"
        )
    
    # Find all hackathons without access codes
    hackathons = await Hackathon.find(
        {"access_code": None}
    ).to_list()
    
    updated_count = 0
    for hackathon in hackathons:
        hackathon.generate_access_code_if_needed()
        await hackathon.save()
        updated_count += 1
    
    return {
        "message": f"Updated {updated_count} hackathons with new access codes",
        "updated_count": updated_count
    }