from datetime import datetime
from typing import Optional, List, Dict, Any
from beanie import Document, Link, before_event, Replace, Insert
from pydantic import Field
from models.base import BaseModel
from models.user import User
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel

class Message(BaseModel):
    """Message model for direct messages between users."""
    
    # Basic information
    sender: Link[User]
    receiver: Link[User]
    content: str
    
    # Message metadata
    message_type: str = "text"  # text, image, file, etc.
    attachments: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Message status
    is_read: bool = False
    read_at: Optional[datetime] = None
    is_edited: bool = False
    edited_at: Optional[datetime] = None
    
    class Settings:
        name = "messages"
        use_state_management = True
        indexes = [
            IndexModel([("sender.id", 1)], name="idx_message_sender_id"),
            IndexModel([("receiver.id", 1)], name="idx_message_receiver_id"),
            IndexModel([("created_at", -1)], name="idx_message_created_at"),
            IndexModel([("is_read", 1)], name="idx_message_read_status")
        ]
    
    def to_dict(self) -> dict:
        """Convert message instance to dictionary."""
        base_dict = super().to_dict()
        return {
            **base_dict,
            'sender_id': str(self.sender.id) if self.sender else None,
            'receiver_id': str(self.receiver.id) if self.receiver else None,
            'content': self.content,
            'message_type': self.message_type,
            'attachments': self.attachments,
            'is_read': self.is_read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'is_edited': self.is_edited,
            'edited_at': self.edited_at.isoformat() if self.edited_at else None,
            'sender': self.sender.to_dict() if self.sender else None,
            'receiver': self.receiver.to_dict() if self.receiver else None
        }

class GroupMessage(BaseModel):
    """Message model for group chats."""
    
    # Basic information
    sender: Link[User]
    group: Link['Group']
    content: str
    
    # Message metadata
    message_type: str = "text"
    attachments: List[Dict[str, Any]] = Field(default_factory=list)
    mentions: List[str] = Field(default_factory=list)  # List of user IDs
    
    # Message status
    read_by: List[Dict[str, Any]] = Field(default_factory=list)  # List of {user_id, read_at}
    is_edited: bool = False
    edited_at: Optional[datetime] = None
    is_pinned: bool = False
    pinned_at: Optional[datetime] = None
    pinned_by: Optional[str] = None
    
    class Settings:
        name = "group_messages"
        use_state_management = True
        indexes = [
            IndexModel([("sender.id", 1)], name="idx_group_message_sender_id"),
            IndexModel([("group.id", 1)], name="idx_group_message_group_id"),
            IndexModel([("created_at", -1)], name="idx_group_message_created_at"),
            IndexModel([("is_pinned", 1)], name="idx_group_message_pinned")
        ]
    
    def to_dict(self) -> dict:
        """Convert group message instance to dictionary."""
        base_dict = super().to_dict()
        return {
            **base_dict,
            'sender_id': str(self.sender.id) if self.sender else None,
            'group_id': str(self.group.id) if self.group else None,
            'content': self.content,
            'message_type': self.message_type,
            'attachments': self.attachments,
            'mentions': self.mentions,
            'read_by': self.read_by,
            'is_edited': self.is_edited,
            'edited_at': self.edited_at.isoformat() if self.edited_at else None,
            'is_pinned': self.is_pinned,
            'pinned_at': self.pinned_at.isoformat() if self.pinned_at else None,
            'pinned_by': self.pinned_by,
            'sender': self.sender.to_dict() if self.sender else None,
            'group': self.group.to_dict() if self.group else None
        }

class Group(BaseModel):
    """Group model for group chats."""
    
    # Basic information
    name: str
    description: Optional[str] = None
    avatar: Optional[str] = None
    
    # Group settings
    is_private: bool = False
    max_members: int = 100
    
    # Group metadata
    members: List[Dict[str, Any]] = Field(default_factory=list)  # List of {user_id, role, joined_at}
    admins: List[str] = Field(default_factory=list)  # List of user IDs
    banned_users: List[str] = Field(default_factory=list)  # List of user IDs
    
    # Group features
    allow_member_invites: bool = True
    allow_message_editing: bool = True
    allow_message_deletion: bool = True
    allow_file_sharing: bool = True
    
    class Settings:
        name = "groups"
        use_state_management = True
        indexes = [
            IndexModel([("name", ASCENDING)], name="idx_group_name"),
            IndexModel([("members", ASCENDING)], name="idx_group_members"),
            IndexModel([("admins", ASCENDING)], name="idx_group_admins")
        ]
    
    def to_dict(self) -> dict:
        """Convert group instance to dictionary."""
        base_dict = super().to_dict()
        return {
            **base_dict,
            'name': self.name,
            'description': self.description,
            'avatar': self.avatar,
            'is_private': self.is_private,
            'max_members': self.max_members,
            'members': self.members,
            'admins': self.admins,
            'banned_users': self.banned_users,
            'allow_member_invites': self.allow_member_invites,
            'allow_message_editing': self.allow_message_editing,
            'allow_message_deletion': self.allow_message_deletion,
            'allow_file_sharing': self.allow_file_sharing
        } 