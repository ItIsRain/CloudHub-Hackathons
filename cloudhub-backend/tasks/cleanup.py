from datetime import datetime
import logging
from models.pending_hackathon import PendingHackathon

logger = logging.getLogger(__name__)

async def cleanup_expired_pending_hackathons():
    """Clean up expired pending hackathon data."""
    try:
        # Find and delete all expired pending hackathons
        current_time = datetime.utcnow()
        result = await PendingHackathon.find(
            PendingHackathon.expires_at < current_time,
            PendingHackathon.is_processed == False
        ).delete()
        
        if result and result.deleted_count > 0:
            logger.info(f"Cleaned up {result.deleted_count} expired pending hackathons")
            
    except Exception as e:
        logger.error(f"Error cleaning up expired pending hackathons: {str(e)}") 