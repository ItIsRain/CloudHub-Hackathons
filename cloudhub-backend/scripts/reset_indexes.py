import asyncio
import sys
import os
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from database.db import get_db
from models.user import User
from models.team import Team
from models.hackathon import Hackathon
from models.project import Project
from models.message import Message, GroupMessage, Group

async def reset_indexes():
    """Drop all indexes and recreate them with explicit names."""
    print("Initializing database connection...")
    client = get_db()
    db = client[os.getenv("DATABASE_NAME", "CloudHub")]
    
    # Define model to collection mapping
    model_collections = {
        User: "users",
        Team: "teams",
        Hackathon: "hackathons",
        Project: "projects",
        Message: "messages",
        GroupMessage: "group_messages",
        Group: "groups"
    }
    
    # Drop all indexes except _id
    for model, collection_name in model_collections.items():
        print(f"Processing {model.__name__}...")
        collection = db[collection_name]
        
        try:
            print(f"Dropping indexes for {collection_name}...")
            await collection.drop_indexes()
            print(f"Successfully dropped indexes for {collection_name}")
            
            # Get indexes from model settings
            if hasattr(model, 'Settings') and hasattr(model.Settings, 'indexes'):
                print(f"Creating indexes for {model.__name__}...")
                indexes = model.Settings.indexes
                await collection.create_indexes(indexes)
                print(f"Successfully created indexes for {model.__name__}")
            else:
                print(f"No indexes defined for {model.__name__}")
                
        except Exception as e:
            print(f"Error processing {model.__name__}: {str(e)}")
    
    print("\nIndex reset completed!")

if __name__ == "__main__":
    asyncio.run(reset_indexes()) 