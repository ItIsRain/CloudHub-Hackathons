"""
Models package initialization.
"""

from .user import User
from .token import RefreshToken
from .auth import (
    UserRole,
    UserStatus,
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    SecurityEvent
)
from .message import Message, GroupMessage, Group
from .project import Project
from .team import Team
from .hackathon import Hackathon

# List of all models for Beanie initialization
__all__ = [
    'User',
    'RefreshToken',
    'UserRole',
    'UserStatus',
    'UserCreate',
    'UserLogin',
    'UserResponse',
    'TokenResponse',
    'SecurityEvent',
    Message,
    GroupMessage,
    Group,
    Project,
    Team,
    Hackathon
]

# Export model classes for type hints
__model_exports__ = [
    'User',
    'RefreshToken',
    'UserRole',
    'UserStatus',
    'UserCreate',
    'UserLogin',
    'UserResponse',
    'TokenResponse',
    'SecurityEvent',
    'Message',
    'GroupMessage',
    'Group',
    'Project',
    'Team',
    'Hackathon'
] 