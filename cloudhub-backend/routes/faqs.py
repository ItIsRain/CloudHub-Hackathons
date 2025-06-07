from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status

from models.faq import FAQ
from models.hackathon import Hackathon
from models.user import User
from auth.jwt_manager import get_current_user
from schemas.faq import FAQCreate, FAQUpdate, FAQResponse, FAQVoteRequest
from datetime import datetime

router = APIRouter()

@router.get("/{hackathon_id}/faqs", response_model=List[FAQResponse])
async def get_faqs(
    hackathon_id: str,
    category: Optional[str] = Query(None),
    published: Optional[bool] = Query(None),
    featured: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """Get all FAQs for a hackathon."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    query = {"hackathon_id": hackathon_id, "is_deleted": False}
    if category: query["category"] = category
    if published is not None: query["published"] = published
    if featured is not None: query["featured"] = featured
    
    faqs = await FAQ.find(query).sort("order", "featured").to_list()
    return [FAQResponse(**faq.to_dict()) for faq in faqs]

@router.post("/{hackathon_id}/faqs", response_model=FAQResponse)
async def create_faq(
    hackathon_id: str,
    faq_data: FAQCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new FAQ."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    faq = FAQ(
        hackathon_id=hackathon_id,
        **faq_data.dict(),
        created_by=str(current_user.id)
    )
    await faq.save()
    return FAQResponse(**faq.to_dict())

@router.put("/{hackathon_id}/faqs/{faq_id}", response_model=FAQResponse)
async def update_faq(
    hackathon_id: str,
    faq_id: str,
    faq_data: FAQUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update an FAQ."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    faq = await FAQ.get(faq_id)
    if not faq or faq.hackathon_id != hackathon_id or faq.is_deleted:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = faq_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faq, field, value)
    
    faq.updated_at = datetime.utcnow()
    await faq.save()
    return FAQResponse(**faq.to_dict())

@router.delete("/{hackathon_id}/faqs/{faq_id}")
async def delete_faq(
    hackathon_id: str,
    faq_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an FAQ."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    faq = await FAQ.get(faq_id)
    if not faq or faq.hackathon_id != hackathon_id or faq.is_deleted:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    faq.is_deleted = True
    faq.deleted_at = datetime.utcnow()
    faq.deleted_by = str(current_user.id)
    await faq.save()
    return {"message": "FAQ deleted successfully"}

@router.post("/{hackathon_id}/faqs/{faq_id}/vote")
async def vote_faq(
    hackathon_id: str,
    faq_id: str,
    vote_data: FAQVoteRequest,
    current_user: User = Depends(get_current_user)
):
    """Vote on FAQ helpfulness."""
    faq = await FAQ.get(faq_id)
    if not faq or faq.hackathon_id != hackathon_id or faq.is_deleted:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    if vote_data.helpful:
        faq.helpful += 1
    else:
        faq.not_helpful += 1
    
    await faq.save()
    return {"message": "Vote recorded"}

@router.post("/{hackathon_id}/faqs/{faq_id}/view")
async def track_view(
    hackathon_id: str,
    faq_id: str,
    current_user: User = Depends(get_current_user)
):
    """Track FAQ view."""
    faq = await FAQ.get(faq_id)
    if not faq or faq.hackathon_id != hackathon_id or faq.is_deleted:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    faq.views += 1
    await faq.save()
    return {"message": "View tracked"}

@router.get("/{hackathon_id}/faqs/stats")
async def get_faq_stats(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get FAQ statistics."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    faqs = await FAQ.find(FAQ.hackathon_id == hackathon_id, FAQ.is_deleted == False).to_list()
    
    return {
        "total_faqs": len(faqs),
        "total_views": sum(faq.views for faq in faqs),
        "total_helpful_votes": sum(faq.helpful for faq in faqs),
        "resolution_rate": round((sum(faq.helpful for faq in faqs) / max(sum(faq.helpful + faq.not_helpful for faq in faqs), 1)) * 100, 1),
        "published_faqs": len([faq for faq in faqs if faq.published]),
        "featured_faqs": len([faq for faq in faqs if faq.featured])
    } 