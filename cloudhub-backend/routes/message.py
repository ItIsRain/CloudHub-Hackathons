from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, constr

from models.message import Message, GroupMessage, Group
from models.user import User
from auth.jwt_manager import get_current_user
from database.dependencies import get_db

router = APIRouter()

# Pydantic models
class MessageCreate(BaseModel):
    content: constr(min_length=1)
    message_type: str = "text"
    attachments: Optional[List[dict]] = []

class GroupMessageCreate(MessageCreate):
    mentions: Optional[List[str]] = []

class MessageUpdate(BaseModel):
    content: constr(min_length=1)

class GroupCreate(BaseModel):
    name: constr(min_length=1, max_length=255)
    description: Optional[str] = None
    avatar: Optional[str] = None
    is_private: bool = False
    max_members: int = 100
    allow_member_invites: bool = True
    allow_message_editing: bool = True
    allow_message_deletion: bool = True
    allow_file_sharing: bool = True

# Direct Messages
@router.post("/direct/{receiver_id}", response_model=dict)
async def send_direct_message(
    receiver_id: str,
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Send a direct message to a user."""
    # Check if receiver exists
    receiver = await User.find_one(User.id == receiver_id, User.is_deleted == False)
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )
    
    # Create message
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=message.content,
        message_type=message.message_type,
        attachments=message.attachments
    )
    
    await new_message.save()
    
    return new_message.to_dict()

@router.get("/direct/{user_id}", response_model=List[dict])
async def get_direct_messages(
    user_id: str,
    limit: int = Query(50, gt=0, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get direct messages with a specific user."""
    messages = await Message.find(
        {
            "$or": [
                {
                    "sender_id": current_user.id,
                    "receiver_id": user_id
                },
                {
                    "sender_id": user_id,
                    "receiver_id": current_user.id
                }
            ],
            "is_deleted": False
        }
    ).sort("-created_at").skip(offset).limit(limit).to_list()
    
    return [msg.to_dict() for msg in messages]

@router.put("/direct/{message_id}", response_model=dict)
async def update_direct_message(
    message_id: str,
    message_update: MessageUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Update a direct message."""
    message = await Message.find_one(Message.id == message_id, Message.is_deleted == False)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit message sent by another user"
        )
    
    message.content = message_update.content
    message.is_edited = True
    message.edited_at = datetime.utcnow()
    await message.save()
    
    return message.to_dict()

@router.delete("/direct/{message_id}")
async def delete_direct_message(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Delete a direct message."""
    message = await Message.find_one(Message.id == message_id, Message.is_deleted == False)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete message sent by another user"
        )
    
    message.is_deleted = True
    message.deleted_at = datetime.utcnow()
    await message.save()
    
    return {"message": "Message deleted successfully"}

# Group Messages
@router.post("/groups", response_model=dict)
async def create_group(
    group_data: GroupCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Create a new group."""
    group = Group(
        name=group_data.name,
        description=group_data.description,
        avatar=group_data.avatar,
        is_private=group_data.is_private,
        max_members=group_data.max_members,
        members=[{
            "user_id": current_user.id,
            "role": "admin",
            "joined_at": datetime.utcnow()
        }],
        admins=[current_user.id],
        allow_member_invites=group_data.allow_member_invites,
        allow_message_editing=group_data.allow_message_editing,
        allow_message_deletion=group_data.allow_message_deletion,
        allow_file_sharing=group_data.allow_file_sharing
    )
    
    await group.save()
    
    return group.to_dict()

@router.post("/groups/{group_id}/messages", response_model=dict)
async def send_group_message(
    group_id: str,
    message: GroupMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Send a message to a group."""
    group = await Group.find_one(Group.id == group_id, Group.is_deleted == False)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if user is member of the group
    if not any(member["user_id"] == current_user.id for member in group.members):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )
    
    # Create message
    new_message = GroupMessage(
        sender_id=current_user.id,
        group_id=group_id,
        content=message.content,
        message_type=message.message_type,
        attachments=message.attachments,
        mentions=message.mentions
    )
    
    await new_message.save()
    
    return new_message.to_dict()

@router.get("/groups/{group_id}/messages", response_model=List[dict])
async def get_group_messages(
    group_id: str,
    limit: int = Query(50, gt=0, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Get messages from a group."""
    group = await Group.find_one(Group.id == group_id, Group.is_deleted == False)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if user is member of the group
    if not any(member["user_id"] == current_user.id for member in group.members):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )
    
    messages = await GroupMessage.find(
        {
            "group_id": group_id,
            "is_deleted": False
        }
    ).sort("-created_at").skip(offset).limit(limit).to_list()
    
    return [msg.to_dict() for msg in messages]

@router.put("/groups/{group_id}/messages/{message_id}", response_model=dict)
async def update_group_message(
    group_id: str,
    message_id: str,
    message_update: MessageUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Update a group message."""
    group = await Group.find_one(Group.id == group_id, Group.is_deleted == False)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    message = await GroupMessage.find_one(
        GroupMessage.id == message_id,
        GroupMessage.group_id == group_id,
        GroupMessage.is_deleted == False
    )
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check if user can edit the message
    if message.sender_id != current_user.id and current_user.id not in group.admins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit message sent by another user"
        )
    
    if not group.allow_message_editing:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Message editing is not allowed in this group"
        )
    
    message.content = message_update.content
    message.is_edited = True
    message.edited_at = datetime.utcnow()
    await message.save()
    
    return message.to_dict()

@router.delete("/groups/{group_id}/messages/{message_id}")
async def delete_group_message(
    group_id: str,
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Delete a group message."""
    group = await Group.find_one(Group.id == group_id, Group.is_deleted == False)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    message = await GroupMessage.find_one(
        GroupMessage.id == message_id,
        GroupMessage.group_id == group_id,
        GroupMessage.is_deleted == False
    )
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check if user can delete the message
    if message.sender_id != current_user.id and current_user.id not in group.admins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete message sent by another user"
        )
    
    if not group.allow_message_deletion:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Message deletion is not allowed in this group"
        )
    
    message.is_deleted = True
    message.deleted_at = datetime.utcnow()
    await message.save()
    
    return {"message": "Message deleted successfully"}

@router.post("/groups/{group_id}/pin/{message_id}")
async def pin_group_message(
    group_id: str,
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Pin a message in a group."""
    group = await Group.find_one(Group.id == group_id, Group.is_deleted == False)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    message = await GroupMessage.find_one(
        GroupMessage.id == message_id,
        GroupMessage.group_id == group_id,
        GroupMessage.is_deleted == False
    )
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check if user is admin
    if current_user.id not in group.admins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can pin messages"
        )
    
    message.is_pinned = True
    message.pinned_at = datetime.utcnow()
    message.pinned_by = current_user.id
    await message.save()
    
    return {"message": "Message pinned successfully"}

@router.post("/groups/{group_id}/members/{user_id}")
async def add_group_member(
    group_id: str,
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_db)
):
    """Add a member to a group."""
    group = await Group.find_one(Group.id == group_id, Group.is_deleted == False)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if user has permission to add members
    if current_user.id not in group.admins and not group.allow_member_invites:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to add members"
        )
    
    # Check if user exists
    user = await User.find_one(User.id == user_id, User.is_deleted == False)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is already a member
    if any(member["user_id"] == user_id for member in group.members):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this group"
        )
    
    # Check if group is full
    if len(group.members) >= group.max_members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group has reached maximum members"
        )
    
    # Add member
    group.members.append({
        "user_id": user_id,
        "role": "member",
        "joined_at": datetime.utcnow()
    })
    await group.save()
    
    return {"message": "Member added successfully"} 