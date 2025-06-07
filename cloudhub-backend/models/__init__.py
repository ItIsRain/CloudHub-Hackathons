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
from .team_member import TeamMember
from .sponsor import Sponsor
from .timeline_event import TimelineEvent
from .resource import Resource
from .faq import FAQ

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
    Hackathon,
    TeamMember,
    Sponsor,
    TimelineEvent,
    Resource,
    FAQ
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
    'Hackathon',
    'TeamMember',
    'Sponsor',
    'TimelineEvent',
    'Resource',
    'FAQ'
] 