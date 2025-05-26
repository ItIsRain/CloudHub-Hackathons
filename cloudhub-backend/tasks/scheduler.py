import asyncio
import logging
from datetime import datetime, timedelta
from .cleanup import cleanup_expired_pending_hackathons

logger = logging.getLogger(__name__)

async def run_periodic_tasks():
    """Run periodic background tasks."""
    while True:
        try:
            # Run cleanup tasks
            await cleanup_expired_pending_hackathons()
            
            # Wait for 5 minutes before next run
            await asyncio.sleep(300)  # 5 minutes
            
        except Exception as e:
            logger.error(f"Error in periodic tasks: {str(e)}")
            await asyncio.sleep(60)  # Wait 1 minute on error before retrying 