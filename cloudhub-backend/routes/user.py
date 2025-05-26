from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict, Any, List
from datetime import datetime

from models.user import User
from schemas.user import UserResponse, UserStatus
from auth.jwt_manager import get_current_user, get_admin_user
from database.dependencies import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

router = APIRouter()

class UserUpdateRequest(BaseModel):
    """User update request model."""
    name: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    skills: Optional[List[str]] = None
    languages: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    social_links: Optional[Dict[str, str]] = None
    organization_name: Optional[str] = None
    organization_website: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    specializations: Optional[List[str]] = None
    mentorship_areas: Optional[List[str]] = None
    communication_preferences: Optional[Dict[str, Any]] = None
    notification_settings: Optional[Dict[str, Any]] = None
    availability: Optional[Dict[str, Any]] = None

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        phone=current_user.phone,
        country=current_user.country,
        timezone=current_user.timezone,
        bio=current_user.bio,
        avatar=current_user.avatar,
        social_links=current_user.social_links,
        organization_name=current_user.organization_name,
        organization_website=current_user.organization_website,
        organization_size=current_user.organization_size,
        industry=current_user.industry,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_user)
):
    """Update current user's profile."""
    # Update user fields
    update_dict = update_data.dict(exclude_unset=True)
    
    # Handle organization fields
    if "organization_name" in update_dict:
        current_user.organization_name = update_dict["organization_name"]
    if "organization_website" in update_dict:
        current_user.organization_website = update_dict["organization_website"]
    if "organization_size" in update_dict:
        current_user.organization_size = update_dict["organization_size"]
    if "industry" in update_dict:
        current_user.industry = update_dict["industry"]
    
    # Update other fields
    for field, value in update_dict.items():
        if field not in ["organization_name", "organization_website", "organization_size", "industry"]:
            setattr(current_user, field, value)
    
    await current_user.save()
    
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.name,
        role=current_user.role,
        status="active" if not current_user.is_deleted else "inactive",
        phone=current_user.phone,
        country=current_user.country,
        timezone=current_user.timezone,
        bio=current_user.bio,
        avatar=current_user.avatar,
        skills=current_user.skills,
        languages=current_user.languages,
        certifications=current_user.certifications,
        social_links=current_user.social_links,
        organization_name=current_user.organization_name,
        organization_website=current_user.organization_website,
        organization_size=current_user.organization_size,
        industry=current_user.industry,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get user by ID."""
    user = await User.find_one(User.id == user_id, User.is_deleted == False)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/", response_model=List[UserResponse])
async def get_users(
    db: AsyncIOMotorClient = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None
):
    """Get list of users with optional search."""
    query = {"is_deleted": False}
    
    if search:
        query["$or"] = [
            {"username": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}}
        ]
    
    users = await User.find(query).skip(skip).limit(limit).to_list()
    return users

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: AsyncIOMotorClient = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete user (admin only)."""
    user = await User.find_one(User.id == user_id, User.is_deleted == False)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_deleted = True
    user.deleted_at = datetime.utcnow()
    await user.save() 