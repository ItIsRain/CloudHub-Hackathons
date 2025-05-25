import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import PyJWTError
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr

from models.auth import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    PasswordReset, PasswordResetConfirm, UserStatus
)
from models.user import User
from models.token import RefreshToken
from services.auth_service import AuthService
from database.dependencies import get_database
from config.config import settings
from auth.jwt_manager import TokenManager, get_current_user
from auth.password import get_password_hash, verify_password

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize AuthService
def get_auth_service(db: AsyncIOMotorClient = Depends(get_database)) -> AuthService:
    return AuthService(db)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> UserResponse:
    """Get current user from JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY.get_secret_value(),
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload["sub"]
    except (PyJWTError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserResponse(**user)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    user = await auth_service.create_user(user_data.dict())
    
    # Log security event
    await auth_service.log_security_event(
        user_id=str(user["_id"]),
        event_type="user_registration",
        event_data={"email": user["email"]},
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    
    # Map the user document to UserResponse fields
    user_response = {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["name"],
        "role": user["role"],
        "status": UserStatus.ACTIVE,  # Default status for new users
        "created_at": user["created_at"],
        "last_login": user.get("last_login"),
        "is_verified": user["email_verified"],
        "phone": user.get("phone"),
        "country": user.get("timezone"),  # Using timezone as country for now
        "timezone": user.get("timezone"),
        "bio": user.get("bio"),
        "avatar": user.get("avatar"),
        "skills": user.get("skills", []),
        "languages": user.get("languages", []),
        "certifications": user.get("certifications", []),
        "social_links": user.get("social_links", {}),
        "organization_name": user.get("organization_name"),
        "organization_website": user.get("organization_website"),
        "organization_size": user.get("organization_size"),
        "industry": user.get("industry"),
        "specializations": user.get("specializations", []),
        "mentorship_areas": user.get("mentorship_areas", []),
        "is_online": user.get("is_online", False),
        "last_seen": user.get("last_seen"),
        "is_team_lead": user.get("is_team_lead", False),
        "permissions": user.get("permissions", []),
        "active_hackathons": user.get("active_hackathons", []),
        "completed_hackathons": user.get("completed_hackathons", []),
        "active_teams": user.get("active_teams", []),
        "rating": user.get("rating", 0.0),
        "achievement_count": user.get("achievement_count", 0),
        "reputation_score": user.get("reputation_score", 0),
        "communication_preferences": user.get("communication_preferences", {}),
        "notification_settings": user.get("notification_settings", {}),
        "availability": user.get("availability", {}),
        "email_verified": user.get("email_verified", False),
        "phone_verified": user.get("phone_verified", False)
    }
    
    return UserResponse(**user_response)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    user: dict

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/login", response_model=TokenResponse)
async def login(
    username: str = Form(...),
    password: str = Form(...),
    request: Request = None
):
    """Login user and return tokens."""
    try:
        print(f"Login attempt for user: {username}")
        
        # Find user by email
        user = await User.find_one(User.email == username)
        if not user:
            print(f"User not found: {username}")
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )
        
        print(f"User found: {user.email}, verifying password...")
        
        # Verify password
        try:
            is_valid = verify_password(password, user.password_hash)
            print(f"Password verification result: {is_valid}")
            if not is_valid:
                raise HTTPException(
                    status_code=401,
                    detail="Incorrect email or password"
                )
        except Exception as e:
            print(f"Password verification error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error verifying password: {str(e)}"
            )
        
        print("Creating tokens...")
        # Create tokens
        tokens = await TokenManager.create_tokens(user, request)
        
        print("Preparing response...")
        # Return response with user data
        return {
            **tokens,
            "user": user.dict(exclude={"password_hash"})
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during login: {str(e)}"
        )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_request: RefreshRequest,
    request: Request
):
    """Refresh access token using refresh token."""
    try:
        tokens = await TokenManager.refresh_tokens(refresh_request.refresh_token, request)
        return tokens
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Error refreshing token: {str(e)}"
        )

@router.post("/logout")
async def logout(
    refresh_request: RefreshRequest,
    current_user: User = Depends(get_current_user)
):
    """Logout user and revoke refresh token."""
    await TokenManager.revoke_token(refresh_request.refresh_token)
    return {"message": "Successfully logged out"}

@router.post("/logout-all")
async def logout_all_devices(
    current_user: User = Depends(get_current_user)
):
    """Logout from all devices by revoking all refresh tokens."""
    await TokenManager.revoke_all_user_tokens(str(current_user.id))
    return {"message": "Successfully logged out from all devices"}

@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information."""
    return current_user.dict(exclude={"hashed_password"})

@router.get("/sessions")
async def get_active_sessions(
    current_user: User = Depends(get_current_user)
):
    """Get all active sessions for the current user."""
    active_tokens = await RefreshToken.find({
        "user": current_user.id,
        "revoked": False,
        "expires_at": {"$gt": datetime.utcnow()}
    }).to_list()
    
    return [{
        "id": str(token.id),
        "device_info": token.device_info,
        "created_at": token.created_at,
        "expires_at": token.expires_at
    } for token in active_tokens]

@router.post("/sessions/{session_id}/revoke")
async def revoke_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """Revoke a specific session."""
    token = await RefreshToken.find_one({
        "id": session_id,
        "user": current_user.id
    })
    
    if token:
        await token.revoke()
        return {"message": "Session revoked successfully"}
    
    raise HTTPException(
        status_code=404,
        detail="Session not found"
    )

@router.post("/verify-email/{token}")
async def verify_email(
    token: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Verify user's email address."""
    await auth_service.verify_email(token)
    return {"message": "Email verified successfully"}

@router.post("/forgot-password")
async def forgot_password(
    email_data: PasswordReset,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Initiate password reset process."""
    await auth_service.initiate_password_reset(email_data.email)
    return {"message": "If the email exists, a password reset link has been sent"}

@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordResetConfirm,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Reset user's password using reset token."""
    await auth_service.reset_password(reset_data.token, reset_data.new_password)
    return {"message": "Password reset successfully"}

@router.post("/2fa/setup", response_model=dict)
async def setup_2fa(
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Set up 2FA for user."""
    secret = await auth_service.setup_2fa(str(current_user.id))
    return {
        "secret": secret,
        "qr_code": f"otpauth://totp/CloudHub:{current_user.email}?secret={secret}&issuer=CloudHub"
    }

@router.post("/2fa/verify")
async def verify_2fa(
    token: str,
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Verify 2FA token."""
    is_valid = await auth_service.verify_2fa(str(current_user.id), token)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 2FA token"
        )
    return {"message": "2FA token verified successfully"}

@router.post("/2fa/disable")
async def disable_2fa(
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Disable 2FA for user."""
    await auth_service.disable_2fa(str(current_user.id))
    return {"message": "2FA disabled successfully"} 