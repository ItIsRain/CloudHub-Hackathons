from datetime import datetime, timedelta
import uuid
import bcrypt
import jwt
import pyotp
from typing import Optional, Tuple, Dict, Any
from fastapi import HTTPException, status
from pydantic import EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from config.config import settings
from models.auth import (
    UserRole, UserStatus, UserCreate, UserResponse,
    SecurityEvent
)
from models.token import RefreshToken
from models.user import User

class AuthService:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db[settings.DATABASE_NAME]
        self.ACCESS_TOKEN_EXPIRE_MINUTES = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        self.REFRESH_TOKEN_EXPIRE_DAYS = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
        self.JWT_SECRET_KEY = settings.JWT_SECRET_KEY.get_secret_value()
        self.JWT_ALGORITHM = settings.JWT_ALGORITHM
        self.MAX_LOGIN_ATTEMPTS = settings.MAX_LOGIN_ATTEMPTS

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user with proper password hashing and validation."""
        # Check if email already exists
        existing_user = await self.db.users.find_one({"email": user_data["email"]})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash password
        password_hash = bcrypt.hashpw(
            user_data["password"].encode(),
            bcrypt.gensalt(rounds=settings.BCRYPT_ROUNDS)
        ).decode()

        # Generate verification token
        verification_token = str(uuid.uuid4())
        verification_expires = datetime.utcnow() + timedelta(hours=24)

        # Create user document
        user = {
            # Basic Information
            "email": user_data["email"],
            "password_hash": password_hash,
            "name": user_data["full_name"],
            "role": user_data["role"],
            "phone": user_data.get("phone"),
            "timezone": user_data.get("timezone"),
            
            # Profile Information
            "bio": user_data.get("bio"),
            "avatar": user_data.get("avatar"),
            "skills": user_data.get("skills", []),
            "languages": user_data.get("languages", []),
            "certifications": user_data.get("certifications", []),
            "social_links": user_data.get("social_links", {}),
            
            # Role-specific Information
            "organization_name": user_data.get("organization_name"),
            "organization_website": user_data.get("organization_website"),
            "organization_size": user_data.get("organization_size"),
            "industry": user_data.get("industry"),
            "specializations": user_data.get("specializations", []),
            "mentorship_areas": user_data.get("mentorship_areas", []),
            
            # Preferences
            "communication_preferences": user_data.get("communication_preferences", {}),
            "notification_settings": user_data.get("notification_settings", {}),
            "availability": user_data.get("availability", {}),
            
            # Security and Verification
            "verification_token": verification_token,
            "verification_expires": verification_expires,
            "email_verified": False,
            "phone_verified": False,
            
            # Terms and Conditions
            "accepted_terms": user_data.get("accepted_terms", False),
            "accepted_privacy_policy": user_data.get("accepted_privacy_policy", False),
            
            # Additional fields with default values
            "is_online": False,
            "last_seen": datetime.utcnow(),
            "is_team_lead": False,
            "permissions": [],
            "active_hackathons": [],
            "completed_hackathons": [],
            "active_teams": [],
            "rating": 0.0,
            "achievement_count": 0,
            "reputation_score": 0,
            "failed_login_attempts": 0,
            "account_locked": False,
            "account_locked_until": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.db.users.insert_one(user)
        user["_id"] = result.inserted_id
        
        # TODO: Send verification email
        
        return user

    async def verify_email(self, token: str) -> bool:
        """Verify user's email address."""
        user = await self.db.users.find_one_and_update(
            {
                "verification_token": token,
                "verification_expires": {"$gt": datetime.utcnow()},
                "email_verified": False
            },
            {
                "$set": {
                    "email_verified": True,
                    "verification_token": None,
                    "verification_expires": None,
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=True
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token"
            )
        
        return True

    async def authenticate_user(self, username: str, password: str) -> Tuple[Dict[str, Any], str, str]:
        """Authenticate user and return tokens."""
        # Try to find user by email first
        user = await self.db.users.find_one({"email": username})
        
        # If not found by email, try phone number
        if not user:
            user = await self.db.users.find_one({"phone": username})

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Check if account is locked
        if user.get("account_locked_until") and user["account_locked_until"] > datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Account locked until {user['account_locked_until']}"
            )

        # Verify password
        if not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
            # Increment failed login attempts
            await self.db.users.update_one(
                {"_id": user["_id"]},
                {
                    "$inc": {"failed_login_attempts": 1},
                    "$set": {
                        "account_locked": True,
                        "account_locked_until": datetime.utcnow() + timedelta(minutes=30)
                    } if user["failed_login_attempts"] + 1 >= self.MAX_LOGIN_ATTEMPTS else {}
                }
            )
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Reset failed login attempts and update last login
        await self.db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "failed_login_attempts": 0,
                    "account_locked": False,
                    "account_locked_until": None,
                    "last_login": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Generate tokens
        access_token = self._create_access_token(str(user["_id"]))
        refresh_token = await self._create_refresh_token(str(user["_id"]))

        return user, access_token, refresh_token

    async def refresh_token(self, token: str) -> Tuple[str, str]:
        """Create new access and refresh tokens."""
        token_record = await RefreshToken.find_one(
            RefreshToken.token == token,
            RefreshToken.revoked == False,
            RefreshToken.expires_at > datetime.utcnow()
        )

        if not token_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )

        # Revoke old refresh token
        token_record.revoked = True
        token_record.revoked_at = datetime.utcnow()
        await token_record.save()

        # Generate new tokens
        new_access_token = self._create_access_token(str(token_record.user.id))
        new_refresh_token = await self._create_refresh_token(str(token_record.user.id))

        return new_access_token, new_refresh_token

    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        try:
            return await self.db.users.find_one({"_id": ObjectId(user_id)})
        except:
            return None

    async def initiate_password_reset(self, email: EmailStr) -> None:
        """Initiate password reset process."""
        user = await User.find_one(User.email == email)
        if not user:
            # Return silently to prevent email enumeration
            return

        # Generate reset token
        reset_token = uuid.uuid4()
        reset_expires = datetime.utcnow() + timedelta(hours=settings.PASSWORD_RESET_EXPIRE_HOURS)

        user.password_reset_token = reset_token
        user.password_reset_expires = reset_expires
        await user.save()

        # TODO: Send password reset email

    async def reset_password(self, token: str, new_password: str) -> bool:
        """Reset user's password."""
        user = await User.find_one(
            User.password_reset_token == uuid.UUID(token),
            User.password_reset_expires > datetime.utcnow()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )

        # Hash new password
        password_hash = bcrypt.hashpw(
            new_password.encode(),
            bcrypt.gensalt(rounds=settings.BCRYPT_ROUNDS)
        ).decode()

        user.password_hash = password_hash
        user.password_reset_token = None
        user.password_reset_expires = None
        user.last_password_change = datetime.utcnow()
        await user.save()

        return True

    def _create_access_token(self, user_id: str) -> str:
        """Create JWT access token."""
        expires_delta = timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        expires_at = datetime.utcnow() + expires_delta

        to_encode = {
            "sub": str(user_id),
            "exp": expires_at
        }
        return jwt.encode(to_encode, self.JWT_SECRET_KEY, algorithm=self.JWT_ALGORITHM)

    async def _create_refresh_token(self, user_id: str) -> str:
        """Create refresh token."""
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)

        refresh_token = RefreshToken(
            token=token,
            user=await User.get(user_id),
            expires_at=expires_at
        )
        await refresh_token.save()

        return token

    async def revoke_refresh_token(self, token: str) -> None:
        """Revoke a refresh token."""
        token_record = await RefreshToken.find_one(RefreshToken.token == token)
        if token_record:
            token_record.revoked = True
            token_record.revoked_at = datetime.utcnow()
            await token_record.save()

    async def setup_2fa(self, user_id: str) -> str:
        """Set up 2FA for a user."""
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        secret = pyotp.random_base32()
        user.two_factor_secret = secret
        await user.save()

        return secret

    async def verify_2fa(self, user_id: str, token: str) -> bool:
        """Verify 2FA token."""
        user = await User.get(user_id)
        if not user or not user.two_factor_secret:
            return False

        totp = pyotp.TOTP(user.two_factor_secret)
        return totp.verify(token)

    async def disable_2fa(self, user_id: str) -> None:
        """Disable 2FA for a user."""
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        user.two_factor_secret = None
        user.two_factor_enabled = False
        await user.save()

    async def log_security_event(
        self,
        user_id: Optional[str],
        event_type: str,
        event_data: dict,
        ip_address: str,
        user_agent: str
    ) -> None:
        """Log security event."""
        event = {
            "user_id": ObjectId(user_id) if user_id else None,
            "event_type": event_type,
            "event_data": event_data,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "timestamp": datetime.utcnow()
        }
        
        await self.db.security_events.insert_one(event) 