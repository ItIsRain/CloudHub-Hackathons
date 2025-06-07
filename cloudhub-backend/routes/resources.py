from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status

from models.resource import Resource, ResourceType, AccessLevel
from models.hackathon import Hackathon
from models.user import User
from auth.jwt_manager import get_current_user
from schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse
from datetime import datetime

router = APIRouter()

@router.get("/{hackathon_id}/resources", response_model=List[ResourceResponse])
async def get_resources(
    hackathon_id: str,
    resource_type: Optional[ResourceType] = Query(None),
    category: Optional[str] = Query(None),
    access_level: Optional[AccessLevel] = Query(None),
    featured: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """Get all resources for a hackathon."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    query = {"hackathon_id": hackathon_id, "is_deleted": False}
    if resource_type: query["resource_type"] = resource_type
    if category: query["category"] = category
    if access_level: query["access_level"] = access_level
    if featured is not None: query["featured"] = featured
    
    resources = await Resource.find(query).sort("display_order", "featured").to_list()
    return [ResourceResponse(**resource.to_dict()) for resource in resources]

@router.post("/{hackathon_id}/resources", response_model=ResourceResponse)
async def create_resource(
    hackathon_id: str,
    resource_data: ResourceCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new resource."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    resource = Resource(
        hackathon_id=hackathon_id,
        **resource_data.dict(),
        created_by=str(current_user.id)
    )
    await resource.save()
    return ResourceResponse(**resource.to_dict())

@router.put("/{hackathon_id}/resources/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    hackathon_id: str,
    resource_id: str,
    resource_data: ResourceUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a resource."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    resource = await Resource.get(resource_id)
    if not resource or resource.hackathon_id != hackathon_id or resource.is_deleted:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    update_data = resource_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resource, field, value)
    
    resource.updated_at = datetime.utcnow()
    await resource.save()
    return ResourceResponse(**resource.to_dict())

@router.delete("/{hackathon_id}/resources/{resource_id}")
async def delete_resource(
    hackathon_id: str,
    resource_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a resource."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    resource = await Resource.get(resource_id)
    if not resource or resource.hackathon_id != hackathon_id or resource.is_deleted:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    resource.is_deleted = True
    resource.deleted_at = datetime.utcnow()
    resource.deleted_by = str(current_user.id)
    await resource.save()
    return {"message": "Resource deleted successfully"}

@router.post("/{hackathon_id}/resources/{resource_id}/download")
async def track_download(
    hackathon_id: str,
    resource_id: str,
    current_user: User = Depends(get_current_user)
):
    """Track resource download."""
    resource = await Resource.get(resource_id)
    if not resource or resource.hackathon_id != hackathon_id or resource.is_deleted:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    resource.downloads += 1
    resource.last_downloaded = datetime.utcnow()
    await resource.save()
    return {"message": "Download tracked"}

@router.get("/{hackathon_id}/resources/stats")
async def get_resource_stats(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get resource statistics."""
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon or hackathon.organizer_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    resources = await Resource.find(
        Resource.hackathon_id == hackathon_id,
        Resource.is_deleted == False
    ).to_list()
    
    type_counts = {}
    for resource_type in ResourceType:
        type_resources = [r for r in resources if r.resource_type == resource_type]
        type_counts[resource_type.value] = len(type_resources)
    
    return {
        "total_resources": len(resources),
        "total_downloads": sum(r.downloads for r in resources),
        "type_breakdown": type_counts,
        "featured_resources": len([r for r in resources if r.featured])
    } 