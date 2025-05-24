import os
import sys
import asyncio
import platform

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import test_connection

async def main():
    """Test the database connection."""
    try:
        is_connected = await test_connection()
        if is_connected:
            print("✅ Database connection test successful!")
        else:
            print("❌ Database connection test failed!")
    except Exception as e:
        print(f"❌ Error during connection test: {e}")

if __name__ == "__main__":
    if platform.system() == 'Windows':
        # Set the event loop policy to avoid SSL cleanup issues on Windows
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 