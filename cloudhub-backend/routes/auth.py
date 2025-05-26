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
from auth.utils import get_password_hash, verify_password

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize AuthService
def get_auth_service(db: AsyncIOMotorClient = Depends(get_database)) -> AuthService:
    return AuthService(db)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
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

    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    try:
        # Convert Pydantic model to dict
        user_dict = user_data.dict()
        
        # Create the user
        user_doc = await auth_service.create_user(user_dict)
        
        # Log security event
        await auth_service.log_security_event(
            user_id=str(user_doc["id"]),
            event_type="user_registration",
            event_data={"email": user_doc["email"]},
            ip_address=request.client.host if request.client else "unknown",
            user_agent=request.headers.get("user-agent", "")
        )
        
        # Get the created user from database
        user_obj = await User.get(user_doc["id"])
        if not user_obj:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created user"
            )
        
        # Create tokens for immediate login
        tokens = await TokenManager.create_tokens(user_obj, request)
        
        # Map user data to response format (matching UserResponse model)
        user_response_data = {
            "id": str(user_obj.id),
            "email": user_obj.email,
            "name": user_obj.name,  # Keep name as is
            "full_name": user_obj.name,  # Add full_name as a copy of name
            "role": user_obj.role,
            "status": UserStatus.ACTIVE.value,
            "created_at": user_obj.created_at,
            "last_login": user_obj.last_login,
            "is_verified": user_obj.email_verified,
            "phone": user_obj.phone,
            "country": user_obj.country,
            "timezone": user_obj.timezone,
            "bio": user_obj.bio,
            "avatar": user_obj.avatar,
            "skills": user_obj.skills,
            "languages": user_obj.languages,
            "certifications": user_obj.certifications,
            "social_links": user_obj.social_links,
            "organization_name": user_obj.organization_name,
            "organization_website": user_obj.organization_website,
            "organization_size": user_obj.organization_size,
            "industry": user_obj.industry,
            "specializations": user_obj.specializations,
            "mentorship_areas": user_obj.mentorship_areas,
            "is_online": user_obj.is_online,
            "last_seen": user_obj.last_seen,
            "is_team_lead": user_obj.is_team_lead,
            "permissions": user_obj.permissions,
            "active_hackathons": [str(h) for h in user_obj.active_hackathons],
            "completed_hackathons": [str(h) for h in user_obj.completed_hackathons],
            "active_teams": [str(t) for t in user_obj.active_teams],
            "rating": user_obj.rating,
            "achievement_count": user_obj.achievement_count,
            "reputation_score": user_obj.reputation_score,
            "communication_preferences": user_obj.communication_preferences,
            "notification_settings": user_obj.notification_settings,
            "availability": user_obj.availability,
            "phone_verified": user_obj.phone_verified,
            # Add full_context for frontend
            "full_context": {
                "id": str(user_obj.id),
                "email": user_obj.email,
                "name": user_obj.name,
                "organization_name": user_obj.organization_name or ""
            }
        }
        
        # Return response with tokens and complete user data
        return TokenResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            expires_in=tokens["expires_in"],
            user=user_response_data
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Log the full error for debugging
        import traceback
        print(f"Registration error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
    
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
        # Find user by email
        user = await User.find_one(User.email == username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        try:
            is_valid = verify_password(password, user.password_hash)
            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"Password verification error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        await user.save()
        
        # Create tokens
        tokens = await TokenManager.create_tokens(user, request)
        
        # Convert user data to response format with ALL fields
        user_data = {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,  # Keep name as is
            "full_name": user.name,  # Add full_name as a copy of name
            "role": user.role,
            "status": UserStatus.ACTIVE.value if not user.is_deleted else UserStatus.INACTIVE.value,
            "created_at": user.created_at,
            "last_login": user.last_login,
            "is_verified": user.email_verified,
            "phone": user.phone,
            "country": user.country,
            "timezone": user.timezone,
            "bio": user.bio,
            "avatar": user.avatar,
            "skills": user.skills,
            "languages": user.languages,
            "certifications": user.certifications,
            "social_links": user.social_links,
            "organization_name": user.organization_name,
            "organization_website": user.organization_website,
            "organization_size": user.organization_size,
            "industry": user.industry,
            "specializations": user.specializations,
            "mentorship_areas": user.mentorship_areas,
            "is_online": user.is_online,
            "last_seen": user.last_seen,
            "is_team_lead": user.is_team_lead,
            "permissions": user.permissions,
            "active_hackathons": [str(h) for h in user.active_hackathons],
            "completed_hackathons": [str(h) for h in user.completed_hackathons],
            "active_teams": [str(t) for t in user.active_teams],
            "rating": user.rating,
            "achievement_count": user.achievement_count,
            "reputation_score": user.reputation_score,
            "communication_preferences": user.communication_preferences,
            "notification_settings": user.notification_settings,
            "availability": user.availability,
            "phone_verified": user.phone_verified,
            # Add full_context for frontend
            "full_context": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "organization_name": user.organization_name or ""
            }
        }
        
        # Return response with formatted user data
        return {
            **tokens,
            "user": user_data
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
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

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current user information."""
    # Get fresh user data from database to ensure we have the latest status
    user = await User.get(current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Convert user data to UserResponse format with ALL fields
    user_response_data = {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.name,  # Map 'name' to 'full_name'
        "role": user.role,
        "status": UserStatus.ACTIVE.value if not user.is_deleted else UserStatus.INACTIVE.value,
        "created_at": user.created_at,
        "last_login": user.last_login,
        "is_verified": user.email_verified,
        "phone": user.phone,
        "country": user.country,
        "timezone": user.timezone,
        "bio": user.bio,
        "avatar": user.avatar,
        "skills": user.skills,
        "languages": user.languages,
        "certifications": user.certifications,
        "social_links": user.social_links,
        "organization_name": user.organization_name,
        "organization_website": user.organization_website,
        "organization_size": user.organization_size,
        "industry": user.industry,
        "specializations": user.specializations,
        "mentorship_areas": user.mentorship_areas,
        "is_online": user.is_online,
        "last_seen": user.last_seen,
        "is_team_lead": user.is_team_lead,
        "permissions": user.permissions,
        "active_hackathons": [str(h) for h in user.active_hackathons],
        "completed_hackathons": [str(h) for h in user.completed_hackathons],
        "active_teams": [str(t) for t in user.active_teams],
        "rating": user.rating,
        "achievement_count": user.achievement_count,
        "reputation_score": user.reputation_score,
        "communication_preferences": user.communication_preferences,
        "notification_settings": user.notification_settings,
        "availability": user.availability,
        "phone_verified": user.phone_verified
    }
    
    return UserResponse(**user_response_data)

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