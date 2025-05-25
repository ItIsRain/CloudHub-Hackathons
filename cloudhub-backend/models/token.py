from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple
from uuid import UUID, uuid4
from beanie import Document, Link, before_event, Replace, Insert
from pydantic import Field
from models.user import User
import hashlib
import secrets
from beanie.odm.fields import IndexModel

class RefreshToken(Document):
    id: UUID = Field(default_factory=uuid4)
    user: Link[User]
    token_hash: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked: bool = False
    revoked_at: Optional[datetime] = None
    device_info: Dict = Field(default_factory=dict)
    token_family: UUID = Field(default_factory=uuid4)  # For tracking token lineage
    previous_token: Optional[UUID] = None  # For token rotation tracking
    
    class Settings:
        name = "refresh_tokens"
        indexes = [
            IndexModel([("user", 1)], name="idx_refresh_token_user"),
            IndexModel([("token_hash", 1)], name="idx_refresh_token_hash"),
            IndexModel([("token_family", 1)], name="idx_refresh_token_family"),
            IndexModel([("user", 1), ("token_family", 1)], name="idx_refresh_token_user_family"),
            IndexModel([("token_hash", 1), ("revoked", 1)], unique=True, name="idx_refresh_token_hash_revoked")
        ]
    
    @classmethod
    async def create_token(cls, user: User, device_info: Dict, expires_in_days: int = 30) -> Tuple[str, "RefreshToken"]:
        """Create a new refresh token for a user."""
        try:
            # Generate a secure random token
            raw_token = secrets.token_urlsafe(64)
            
            # Hash the token for storage
            token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
            
            # Create token document
            token = cls(
                user=user,
                token_hash=token_hash,
                expires_at=datetime.utcnow() + timedelta(days=expires_in_days),
                device_info=device_info
            )
            
            # Save to database
            await token.save()
            
            return raw_token, token
        except Exception as e:
            print(f"Error creating refresh token: {str(e)}")
            raise
    
    @classmethod
    async def validate_token(cls, token: str) -> Optional["RefreshToken"]:
        """Validate a refresh token and return the token document if valid."""
        # Hash the token for comparison
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        # Find the token in database
        token_doc = await cls.find_one({
            "token_hash": token_hash,
            "revoked": False,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        return token_doc
    
    async def revoke(self, revoke_family: bool = False):
        """Revoke this refresh token and optionally its entire family."""
        self.revoked = True
        self.revoked_at = datetime.utcnow()
        await self.save()
        
        if revoke_family:
            # Revoke all tokens in the same family
            await RefreshToken.find({"token_family": self.token_family}).update({
                "$set": {
                    "revoked": True,
                    "revoked_at": datetime.utcnow()
                }
            })
    
    @classmethod
    async def revoke_all_for_user(cls, user_id: UUID):
        """Revoke all refresh tokens for a specific user."""
        await cls.find({"user": user_id}).update({
            "$set": {
                "revoked": True,
                "revoked_at": datetime.utcnow()
            }
        })
    
    async def rotate(self, device_info: Dict) -> Tuple[str, "RefreshToken"]:
        """Create a new token that replaces this one in the same family."""
        # Generate new token
        raw_token = secrets.token_urlsafe(64)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        
        # Create new token document with same family
        new_token = RefreshToken(
            user=self.user,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(days=30),
            device_info=device_info,
            token_family=self.token_family,
            previous_token=self.id
        )
        
        # Save new token
        await new_token.save()
        
        # Revoke current token
        await self.revoke()
        
        return raw_token, new_token
    
    @classmethod
    async def cleanup_expired(cls):
        """Remove expired and revoked tokens older than 30 days."""
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        await cls.find({
            "$or": [
                {"expires_at": {"$lt": datetime.utcnow()}},
                {"revoked": True, "revoked_at": {"$lt": thirty_days_ago}}
            ]
        }).delete() 