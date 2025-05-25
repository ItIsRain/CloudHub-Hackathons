from datetime import datetime, timedelta
from typing import Optional, Dict
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

from models.user import User
from models.token import RefreshToken
from database.dependencies import get_db
from config.config import settings

security = HTTPBearer()

class TokenManager:
    SECRET_KEY = settings.JWT_SECRET_KEY.get_secret_value()
    ALGORITHM = settings.JWT_ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    REFRESH_TOKEN_EXPIRE_DAYS = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS

    @classmethod
    def create_access_token(cls, data: dict) -> str:
        """Create a new access token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        try:
            return jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
        except Exception as e:
            print(f"Error creating access token: {str(e)}")
            raise

    @classmethod
    def decode_token(cls, token: str) -> dict:
        """Decode and validate a token."""
        try:
            payload = jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            return payload
        except JWTError as e:
            raise HTTPException(
                status_code=401,
                detail=f"Could not validate credentials: {str(e)}"
            )

    @classmethod
    async def create_tokens(cls, user: User, request: Request) -> Dict[str, str]:
        """Create both access and refresh tokens for a user."""
        try:
            # Create access token
            access_token_data = {
                "sub": str(user.id),
                "email": user.email,
                "role": user.role,
                "type": "access"
            }
            print("Creating access token with data:", access_token_data)
            access_token = cls.create_access_token(access_token_data)
            print("Access token created successfully")

            # Get device info
            device_info = {
                "user_agent": request.headers.get("user-agent"),
                "ip": request.client.host,
                "timestamp": datetime.utcnow().isoformat()
            }

            # Create refresh token
            print("Creating refresh token...")
            raw_refresh_token, token_doc = await RefreshToken.create_token(
                user=user,
                device_info=device_info,
                expires_in_days=cls.REFRESH_TOKEN_EXPIRE_DAYS
            )
            print("Refresh token created successfully")

            return {
                "access_token": access_token,
                "refresh_token": raw_refresh_token,
                "token_type": "bearer",
                "expires_in": cls.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        except Exception as e:
            print(f"Error in create_tokens: {str(e)}")
            raise

    @classmethod
    async def refresh_tokens(cls, refresh_token: str, request: Request) -> Dict[str, str]:
        """Validate refresh token and create new access and refresh tokens."""
        # Validate refresh token
        token_doc = await RefreshToken.validate_token(refresh_token)
        if not token_doc:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token"
            )

        # Get device info
        device_info = {
            "user_agent": request.headers.get("user-agent"),
            "ip": request.client.host,
            "timestamp": datetime.utcnow().isoformat()
        }

        # Rotate refresh token
        new_refresh_token, new_token_doc = await token_doc.rotate(device_info)

        # Create new access token
        access_token_data = {
            "sub": str(token_doc.user.id),
            "email": token_doc.user.email,
            "role": token_doc.user.role,
            "type": "access"
        }
        new_access_token = cls.create_access_token(access_token_data)

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "expires_in": cls.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }

    @classmethod
    async def revoke_token(cls, refresh_token: str, revoke_family: bool = False):
        """Revoke a refresh token and optionally its entire family."""
        token_doc = await RefreshToken.validate_token(refresh_token)
        if token_doc:
            await token_doc.revoke(revoke_family=revoke_family)

    @classmethod
    async def revoke_all_user_tokens(cls, user_id: str):
        """Revoke all refresh tokens for a user."""
        await RefreshToken.revoke_all_for_user(uuid.UUID(user_id))

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Dependency to get the current authenticated user."""
    try:
        token = credentials.credentials
        payload = TokenManager.decode_token(token)
        
        # Verify this is an access token
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload"
            )
        
        user = await User.find_one(User.id == uuid.UUID(user_id))
        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )
        
        return user
        
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Could not validate credentials: {str(e)}"
        )

# Optional dependency to get current user, returns None if not authenticated
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[User]:
    """Dependency to get the current user if authenticated, None otherwise."""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

async def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current user and verify they are an admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can perform this action"
        )
    return current_user

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a new JWT refresh token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_REFRESH_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt 