from typing import Optional
from pymongo import MongoClient
from fastapi import Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
from .db import get_db

def get_database() -> MongoClient:
    """Database dependency."""
    try:
        client = get_db()
        return client
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not ready"
        )

async def get_database_async() -> AsyncIOMotorClient:
    """Database dependency."""
    db = get_db()
    return db 