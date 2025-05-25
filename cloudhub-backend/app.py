from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging
import traceback
from time import time

from config.config import settings
from utils.error_handlers import APIError, setup_logging
from database import get_db, close_db
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

# Import routes
from routes import auth, user, hackathon, team, project, upload, message

# Import models
from models.user import User
from models.token import RefreshToken
from models.message import Message, GroupMessage, Group
from models.project import Project
from models.team import Team
from models.hackathon import Hackathon

# Configure logging
logger = logging.getLogger(__name__)

# Cache for database connection status
db_status = {
    "last_check": 0,
    "is_connected": False,
    "check_interval": 5  # Check every 5 seconds
}

def register_routes(app: FastAPI):
    """Register all route handlers."""
    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(user.router, prefix="/api/users", tags=["Users"])
    app.include_router(hackathon.router, prefix="/api/hackathons", tags=["Hackathons"])
    app.include_router(team.router, prefix="/api/teams", tags=["Teams"])
    app.include_router(project.router, prefix="/api/projects", tags=["Projects"])
    app.include_router(upload.router, prefix="/api/upload", tags=["File Upload"])
    app.include_router(message.router, prefix="/api/messages", tags=["Messages"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for FastAPI application."""
    # Startup
    try:
        # Initialize database connection
        client = get_db()
        logger.info("MongoDB connection initialized")
        
        # Initialize Beanie with all Document models
        document_models = [
            User,
            RefreshToken,
            Message,
            GroupMessage,
            Group,
            Project,
            Team,
            Hackathon
        ]
        
        try:
            await init_beanie(
                database=client[settings.DATABASE_NAME],
                document_models=document_models,
                allow_index_dropping=True
            )
            logger.info("Beanie ODM initialized with all models")
        except Exception as init_error:
            logger.error(f"Error during Beanie initialization: {str(init_error)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        logger.error(f"Detailed traceback: {traceback.format_exc()}")
        raise
    
    yield
    
    # Shutdown
    close_db()
    logger.info("MongoDB connection closed")

# Middleware to check database connection
async def check_db_connection(request: Request, call_next):
    # Skip checks for non-critical paths
    path = request.url.path
    if (path.startswith("/static") or 
        path.startswith("/_next") or 
        path == "/health" or 
        path == "/favicon.ico" or
        request.method == "OPTIONS"):
        return await call_next(request)

    current_time = time()
    global db_status

    try:
        # Only check connection if enough time has passed since last check
        if current_time - db_status["last_check"] > db_status["check_interval"]:
            client = get_db()
            await client.admin.command('ping')
            db_status["is_connected"] = True
            db_status["last_check"] = current_time
        
        if not db_status["is_connected"]:
            raise ConnectionError("Database is not connected")

        return await call_next(request)

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Database connection error in middleware: {error_msg}")
        db_status["is_connected"] = False
        
        # Create error response with CORS headers
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "error",
                "message": "Database connection not ready. Please try again in a few seconds.",
                "error": error_msg
            },
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Credentials": "true"
            }
        )

# Create FastAPI app
app = FastAPI(
    title="CloudHub API",
    description="API for CloudHub Hackathon Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Register routes
register_routes(app)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add database connection check middleware
app.middleware("http")(check_db_connection)

# Setup logging
setup_logging()

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        errors.append({
            "loc": error.get("loc", []),
            "msg": error.get("msg", ""),
            "type": error.get("type", "")
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Validation error",
            "errors": errors
        }
    )

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.message,
            "error_code": exc.error_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An unexpected error occurred",
            "error": str(exc)
        }
    )

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    try:
        client = get_db()
        await client.admin.command('ping')
        return {"status": "healthy"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "database not ready"}
        )

if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )