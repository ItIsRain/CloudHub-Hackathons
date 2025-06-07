from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status

from models.sponsor import Sponsor, SponsorshipTier
from models.hackathon import Hackathon
from models.user import User
from auth.jwt_manager import get_current_user
from schemas.sponsor import (
    SponsorCreate,
    SponsorUpdate,
    SponsorResponse
)
from datetime import datetime

router = APIRouter()

@router.get("/{hackathon_id}/sponsors", response_model=List[SponsorResponse])
async def get_sponsors(
    hackathon_id: str,
    tier: Optional[SponsorshipTier] = Query(None, description="Filter by sponsorship tier"),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    current_user: User = Depends(get_current_user)
):
    """Get all sponsors for a hackathon."""
    # Check if hackathon exists
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    # Build query
    query = {
        "hackathon_id": hackathon_id,
        "is_deleted": False
    }
    
    if tier:
        query["tier"] = tier
    if featured is not None:
        query["featured"] = featured
    
    sponsors = await Sponsor.find(query).sort("display_order", "tier").to_list()
    return [SponsorResponse(**sponsor.to_dict()) for sponsor in sponsors]

@router.post("/{hackathon_id}/sponsors", response_model=SponsorResponse)
async def add_sponsor(
    hackathon_id: str,
    sponsor_data: SponsorCreate,
    current_user: User = Depends(get_current_user)
):
    """Add a new sponsor to the hackathon."""
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
            detail="Only organizers can add sponsors"
        )
    
    # Check if sponsor already exists
    existing_sponsor = await Sponsor.find_one(
        Sponsor.hackathon_id == hackathon_id,
        Sponsor.name == sponsor_data.name,
        Sponsor.is_deleted == False
    )
    
    if existing_sponsor:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Sponsor with this name already exists"
        )
    
    # Create sponsor
    sponsor = Sponsor(
        hackathon_id=hackathon_id,
        name=sponsor_data.name,
        tier=sponsor_data.tier,
        logo=sponsor_data.logo,
        website=sponsor_data.website,
        description=sponsor_data.description,
        contacts=sponsor_data.contacts,
        benefits=sponsor_data.benefits,
        contribution=sponsor_data.contribution,
        currency=sponsor_data.currency,
        featured=sponsor_data.featured,
        display_order=sponsor_data.display_order,
        added_by=str(current_user.id)
    )
    
    await sponsor.save()
    return SponsorResponse(**sponsor.to_dict())

@router.put("/{hackathon_id}/sponsors/{sponsor_id}", response_model=SponsorResponse)
async def update_sponsor(
    hackathon_id: str,
    sponsor_id: str,
    sponsor_data: SponsorUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a sponsor."""
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
            detail="Only organizers can update sponsors"
        )
    
    # Find and update sponsor
    sponsor = await Sponsor.get(sponsor_id)
    if not sponsor or sponsor.hackathon_id != hackathon_id or sponsor.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Sponsor not found"
        )
    
    # Update fields
    update_data = sponsor_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sponsor, field, value)
    
    sponsor.updated_at = datetime.utcnow()
    await sponsor.save()
    
    return SponsorResponse(**sponsor.to_dict())

@router.delete("/{hackathon_id}/sponsors/{sponsor_id}")
async def remove_sponsor(
    hackathon_id: str,
    sponsor_id: str,
    current_user: User = Depends(get_current_user)
):
    """Remove a sponsor."""
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
            detail="Only organizers can remove sponsors"
        )
    
    # Find and soft delete sponsor
    sponsor = await Sponsor.get(sponsor_id)
    if not sponsor or sponsor.hackathon_id != hackathon_id or sponsor.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Sponsor not found"
        )
    
    sponsor.is_deleted = True
    sponsor.deleted_at = datetime.utcnow()
    sponsor.deleted_by = str(current_user.id)
    await sponsor.save()
    
    return {"message": "Sponsor removed successfully"}

@router.get("/{hackathon_id}/sponsorship-tiers")
async def get_sponsorship_tiers(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get sponsorship tiers with information."""
    # Check if hackathon exists
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    # Get sponsor counts by tier
    tier_counts = {}
    for tier in SponsorshipTier:
        count = await Sponsor.find(
            Sponsor.hackathon_id == hackathon_id,
            Sponsor.tier == tier,
            Sponsor.is_deleted == False
        ).count()
        tier_counts[tier.value] = count
    
    tiers = [
        {
            "name": "platinum",
            "count": tier_counts.get("platinum", 0),
            "description": "Premium partnership with maximum visibility",
            "min_contribution": 25000,
            "currency": "AED"
        },
        {
            "name": "gold",
            "count": tier_counts.get("gold", 0),
            "description": "Enhanced visibility with premium placement",
            "min_contribution": 15000,
            "currency": "AED"
        },
        {
            "name": "silver",
            "count": tier_counts.get("silver", 0),
            "description": "Standard sponsorship package",
            "min_contribution": 10000,
            "currency": "AED"
        },
        {
            "name": "bronze",
            "count": tier_counts.get("bronze", 0),
            "description": "Basic sponsorship package",
            "min_contribution": 5000,
            "currency": "AED"
        }
    ]
    
    return {"tiers": tiers}

@router.get("/{hackathon_id}/sponsors/stats")
async def get_sponsor_stats(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get sponsor statistics."""
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
            detail="Only organizers can view sponsor stats"
        )
    
    # Get all sponsors
    sponsors = await Sponsor.find(
        Sponsor.hackathon_id == hackathon_id,
        Sponsor.is_deleted == False
    ).to_list()
    
    # Calculate stats
    total_sponsors = len(sponsors)
    total_contribution = sum(sponsor.contribution for sponsor in sponsors)
    contracts_signed = sum(1 for sponsor in sponsors if sponsor.contract_signed)
    featured_sponsors = sum(1 for sponsor in sponsors if sponsor.featured)
    
    # Tier breakdown
    tier_breakdown = {}
    for tier in SponsorshipTier:
        tier_sponsors = [s for s in sponsors if s.tier == tier]
        tier_breakdown[tier.value] = {
            "count": len(tier_sponsors),
            "total_contribution": sum(s.contribution for s in tier_sponsors)
        }
    
    return {
        "total_sponsors": total_sponsors,
        "total_contribution": total_contribution,
        "contracts_signed": contracts_signed,
        "featured_sponsors": featured_sponsors,
        "tier_breakdown": tier_breakdown,
        "currency": "AED"
    } 