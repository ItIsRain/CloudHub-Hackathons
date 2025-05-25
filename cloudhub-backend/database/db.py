from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config.config import settings
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
client: Optional[AsyncIOMotorClient] = None

def get_db():
    """Get database client."""
    global client
    
    if client is None:
        try:
            logger.info("Initializing new database connection...")
            # Create MongoDB client with optimized connection settings
            client = AsyncIOMotorClient(
                settings.DATABASE_URL,
                minPoolSize=settings.MONGODB_MIN_POOL_SIZE,
                maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
                maxIdleTimeMS=settings.MONGODB_MAX_IDLE_TIME_MS,
                serverSelectionTimeoutMS=30000,  # Increased to 30 seconds
                connectTimeoutMS=30000,          # Increased to 30 seconds
                socketTimeoutMS=45000,           # Increased to 45 seconds
                retryWrites=True,
                retryReads=True,
                appname="CloudHub",
                waitQueueTimeoutMS=10000,        # Increased wait queue timeout
                heartbeatFrequencyMS=10000,      # Keep heartbeat frequency
                maxConnecting=2,                 # Keep max concurrent connections
                localThresholdMS=15,             # Keep local threshold
                w="majority",                    # Added write concern
                readPreference="primaryPreferred" # Added read preference
            )
            
            try:
                # Test connection
                client.admin.command('ping')
                logger.info(f"Successfully connected to MongoDB database: {settings.DATABASE_NAME}")
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                logger.error(f"Failed to connect to MongoDB: {str(e)}")
                if client:
                    client.close()
                    client = None
                raise ConnectionError(f"Could not connect to MongoDB: {str(e)}. Please check if MongoDB is running and accessible.") from e
            
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB client: {str(e)}\n{traceback.format_exc()}")
            if client:
                client.close()
                client = None
            raise ConnectionError(f"Database initialization failed: {str(e)}") from e
    
    return client

def close_db():
    """Close database connection."""
    global client
    if client:
        client.close()
        client = None
        logger.info("Database connection closed")

async def test_connection() -> bool:
    """Test database connection."""
    try:
        db = get_db()
        await db.admin.command('ping')
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return False 