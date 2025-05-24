"""
Database package initialization.
"""

from .db import get_db, close_db

__all__ = ["get_db", "close_db"] 