import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import PyJWTError
from motor.motor_asyncio import AsyncIOMotorClient

from models.auth import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    PasswordReset, PasswordResetConfirm, UserStatus
)
from services.auth_service import AuthService
from database.dependencies import get_database
from config.config import settings

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

@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login user and return tokens."""
    user, access_token, refresh_token = await auth_service.authenticate_user(
        form_data.username,
        form_data.password
    )
    
    # Log security event
    await auth_service.log_security_event(
        user_id=str(user["_id"]),
        event_type="user_login",
        event_data={"identifier": form_data.username},  # Use generic identifier instead of email
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    
    # Create user response data
    user_data = {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["name"],
        "role": user["role"],
        "phone": user.get("phone"),
        "avatar": user.get("avatar"),
        "email_verified": user["email_verified"],
        "phone_verified": user.get("phone_verified", False)
    }
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_data
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Refresh access token using refresh token."""
    access_token, new_refresh_token = await auth_service.refresh_token(refresh_token)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/logout")
async def logout(
    refresh_token: str,
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Logout user by revoking refresh token."""
    await auth_service.revoke_refresh_token(refresh_token)
    return {"message": "Successfully logged out"}

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

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information."""
    return current_user 