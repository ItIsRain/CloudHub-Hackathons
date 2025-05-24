from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from datetime import datetime

from models.user import User
from schemas.user import UserResponse, UserUpdate, UserCreate
from auth.jwt_manager import get_current_user, get_admin_user
from database.dependencies import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user's profile."""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Update current user's profile."""
    # Update allowed fields
    for field, value in data.dict(exclude_unset=True).items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    current_user.last_updated_at = datetime.utcnow()
    await current_user.save()
    
    return current_user

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