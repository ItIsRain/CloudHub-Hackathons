import asyncio
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import get_db
from beanie import init_beanie
from models.user import User
from auth.utils import get_password_hash
from config.config import settings

async def create_test_user():
    """Create a test user in the database."""
    try:
        # Initialize database connection
        print("Initializing database connection...")
        client = get_db()
        await init_beanie(
            database=client[settings.DATABASE_NAME],
            document_models=[User]
        )
        print("Database initialized successfully")
        
        # Test user data
        email = "test@example.com"
        password = "testpassword123"
        
        # Check if user already exists
        existing_user = await User.find_one(User.email == email)
        if existing_user:
            print(f"User {email} already exists, updating password...")
            existing_user.password_hash = get_password_hash(password)
            await existing_user.save()
            print("Password updated successfully")
            return
        
        # Create new user
        print(f"Creating new user: {email}")
        password_hash = get_password_hash(password)
        print(f"Generated password hash length: {len(password_hash)}")
        
        user = User(
            email=email,
            password_hash=password_hash,
            name="Test User",
            role="organizer",
            email_verified=True,
            accepted_terms=True,
            accepted_privacy_policy=True
        )
        
        # Save user to database
        print("Saving user to database...")
        await user.save()
        print("Test user created successfully!")
        print(f"Email: {email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error creating test user: {str(e)}")
        raise e

if __name__ == "__main__":
    asyncio.run(create_test_user()) 