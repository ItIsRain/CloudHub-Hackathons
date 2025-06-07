from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status

from models.timeline_event import TimelineEvent, TimelineEventType, TimelineEventStatus
from models.hackathon import Hackathon
from models.user import User
from auth.jwt_manager import get_current_user
from schemas.timeline_event import (
    TimelineEventCreate,
    TimelineEventUpdate,
    TimelineEventResponse
)
from datetime import datetime

router = APIRouter()

@router.get("/{hackathon_id}/timeline-events", response_model=List[TimelineEventResponse])
async def get_timeline_events(
    hackathon_id: str,
    event_type: Optional[TimelineEventType] = Query(None, description="Filter by event type"),
    status: Optional[TimelineEventStatus] = Query(None, description="Filter by status"),
    is_public: Optional[bool] = Query(None, description="Filter by public visibility"),
    current_user: User = Depends(get_current_user)
):
    """Get all timeline events for a hackathon."""
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
    
    if event_type:
        query["event_type"] = event_type
    if status:
        query["status"] = status
    if is_public is not None:
        query["is_public"] = is_public
    
    events = await TimelineEvent.find(query).sort("date").to_list()
    return [TimelineEventResponse(**event.to_dict()) for event in events]

@router.post("/{hackathon_id}/timeline-events", response_model=TimelineEventResponse)
async def create_timeline_event(
    hackathon_id: str,
    event_data: TimelineEventCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new timeline event."""
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
            detail="Only organizers can create timeline events"
        )
    
    # Create timeline event
    event = TimelineEvent(
        hackathon_id=hackathon_id,
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        event_type=event_data.event_type,
        status=event_data.status,
        duration=event_data.duration,
        location=event_data.location,
        meeting_url=event_data.meeting_url,
        notify_participants=event_data.notify_participants,
        reminder_hours=event_data.reminder_hours,
        is_public=event_data.is_public,
        display_order=event_data.display_order,
        created_by=str(current_user.id)
    )
    
    await event.save()
    return TimelineEventResponse(**event.to_dict())

@router.put("/{hackathon_id}/timeline-events/{event_id}", response_model=TimelineEventResponse)
async def update_timeline_event(
    hackathon_id: str,
    event_id: str,
    event_data: TimelineEventUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a timeline event."""
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
            detail="Only organizers can update timeline events"
        )
    
    # Find and update event
    event = await TimelineEvent.get(event_id)
    if not event or event.hackathon_id != hackathon_id or event.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found"
        )
    
    # Update fields
    update_data = event_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    event.updated_at = datetime.utcnow()
    await event.save()
    
    return TimelineEventResponse(**event.to_dict())

@router.delete("/{hackathon_id}/timeline-events/{event_id}")
async def delete_timeline_event(
    hackathon_id: str,
    event_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a timeline event."""
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
            detail="Only organizers can delete timeline events"
        )
    
    # Find and soft delete event
    event = await TimelineEvent.get(event_id)
    if not event or event.hackathon_id != hackathon_id or event.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found"
        )
    
    event.is_deleted = True
    event.deleted_at = datetime.utcnow()
    event.deleted_by = str(current_user.id)
    await event.save()
    
    return {"message": "Timeline event deleted successfully"}

@router.get("/{hackathon_id}/timeline-events/upcoming")
async def get_upcoming_events(
    hackathon_id: str,
    limit: int = Query(5, ge=1, le=20, description="Maximum number of events to return"),
    current_user: User = Depends(get_current_user)
):
    """Get upcoming timeline events."""
    # Check if hackathon exists
    hackathon = await Hackathon.get(hackathon_id)
    if not hackathon:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Hackathon not found"
        )
    
    # Get upcoming events
    now = datetime.utcnow()
    events = await TimelineEvent.find(
        TimelineEvent.hackathon_id == hackathon_id,
        TimelineEvent.date >= now,
        TimelineEvent.is_public == True,
        TimelineEvent.is_deleted == False
    ).sort("date").limit(limit).to_list()
    
    return [TimelineEventResponse(**event.to_dict()) for event in events]

@router.patch("/{hackathon_id}/timeline-events/{event_id}/status")
async def update_event_status(
    hackathon_id: str,
    event_id: str,
    status: TimelineEventStatus,
    current_user: User = Depends(get_current_user)
):
    """Update the status of a timeline event."""
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
            detail="Only organizers can update event status"
        )
    
    # Find and update event
    event = await TimelineEvent.get(event_id)
    if not event or event.hackathon_id != hackathon_id or event.is_deleted:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found"
        )
    
    event.status = status
    event.updated_at = datetime.utcnow()
    await event.save()
    
    return {"message": f"Event status updated to {status.value}"}

@router.get("/{hackathon_id}/timeline-events/stats")
async def get_timeline_stats(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get timeline event statistics."""
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
            detail="Only organizers can view timeline stats"
        )
    
    # Get all events
    events = await TimelineEvent.find(
        TimelineEvent.hackathon_id == hackathon_id,
        TimelineEvent.is_deleted == False
    ).to_list()
    
    # Calculate stats
    total_events = len(events)
    now = datetime.utcnow()
    
    upcoming_events = len([e for e in events if e.date > now])
    completed_events = len([e for e in events if e.status == TimelineEventStatus.COMPLETED])
    ongoing_events = len([e for e in events if e.status == TimelineEventStatus.ONGOING])
    
    # Type breakdown
    type_breakdown = {}
    for event_type in TimelineEventType:
        type_events = [e for e in events if e.event_type == event_type]
        type_breakdown[event_type.value] = len(type_events)
    
    return {
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "completed_events": completed_events,
        "ongoing_events": ongoing_events,
        "type_breakdown": type_breakdown
    } 