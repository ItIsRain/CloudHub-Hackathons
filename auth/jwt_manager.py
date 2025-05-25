from typing import Optional
from datetime import datetime, timedelta
from fastapi import HTTPException
import jwt

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    try:
        access_token_data = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token_data.update({"exp": expire})
        access_token_data.update({"type": "access"})
        encoded_jwt = jwt.encode(access_token_data, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating access token: {str(e)}")

def create_refresh_token(user_id: str) -> str:
    try:
        refresh_token_data = {
            "sub": str(user_id),
            "type": "refresh",
            "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        }
        return jwt.encode(refresh_token_data, SECRET_KEY, algorithm=ALGORITHM)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating refresh token: {str(e)}") 