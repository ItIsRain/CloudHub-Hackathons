"""
Models package initialization.
"""

from .base import BaseModel
from .user import User
from .message import Message, GroupMessage, Group
from .auth import RefreshToken, SecurityEvent
from .project import Project
from .team import Team
from .hackathon import Hackathon

# List of all models for Beanie initialization
__all__ = [
    User,
    Message,
    GroupMessage,
    Group,
    RefreshToken,
    SecurityEvent,
    Project,
    Team,
    Hackathon
]

# Export model classes for type hints
__model_exports__ = [
    'BaseModel',
    'User',
    'Message',
    'GroupMessage',
    'Group',
    'RefreshToken',
    'SecurityEvent',
    'Project',
    'Team',
    'Hackathon'
] 