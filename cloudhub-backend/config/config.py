from typing import List
from pydantic_settings import BaseSettings
from pydantic import SecretStr, AnyHttpUrl, validator
from functools import lru_cache

class Settings(BaseSettings):
    # Application settings
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    PROJECT_NAME: str = "CloudHub"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database settings
    DATABASE_URL: str
    DATABASE_NAME: str = "CloudHub"
    MONGODB_MIN_POOL_SIZE: int = 10
    MONGODB_MAX_POOL_SIZE: int = 100
    MONGODB_MAX_IDLE_TIME_MS: int = 10000
    
    @validator("DATABASE_URL")
    def validate_database_url(cls, v: str) -> str:
        if not v.startswith("mongodb"):
            raise ValueError("DATABASE_URL must be a MongoDB connection string")
        return v
    
    # JWT settings
    JWT_SECRET_KEY: SecretStr
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    
    # BunnyNet settings
    BUNNYNET_API_KEY: SecretStr
    BUNNYNET_STORAGE_ZONE: str
    BUNNYNET_STORAGE_URL: AnyHttpUrl
    BUNNYNET_PULL_ZONE: AnyHttpUrl
    
    # Rate limiting
    RATE_LIMIT_DEFAULT: str = "100/minute"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_FILE: str = "logs/app.log"
    
    # Security
    BCRYPT_ROUNDS: int = 12
    MAX_LOGIN_ATTEMPTS: int = 5
    PASSWORD_RESET_EXPIRE_HOURS: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings() 