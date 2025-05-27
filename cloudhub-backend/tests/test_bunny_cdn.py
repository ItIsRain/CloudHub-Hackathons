import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Bunny CDN configuration
BUNNYNET_API_KEY = os.getenv("BUNNYNET_API_KEY")  # For API calls
BUNNYNET_STORAGE_ZONE = os.getenv("BUNNYNET_STORAGE_ZONE")
BUNNYNET_STORAGE_URL = os.getenv("BUNNYNET_STORAGE_URL")
BUNNYNET_PULL_ZONE = os.getenv("BUNNYNET_PULL_ZONE")

def get_storage_zone_password():
    """Get the storage zone password needed for file operations."""
    api_url = "https://api.bunny.net/storagezone"
    headers = {
        "AccessKey": BUNNYNET_API_KEY,
        "Accept": "application/json"
    }
    
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        zones = response.json()
        for zone in zones:
            if zone.get('Name') == BUNNYNET_STORAGE_ZONE:
                return zone.get('Password')
    return None

def test_bunny_cdn_upload():
    """Test uploading a file to Bunny CDN storage."""
    # Get the storage zone password
    storage_password = get_storage_zone_password()
    
    if not storage_password:
        pytest.fail("Could not retrieve storage zone password")
    
    print(f"\nStorage Zone: {BUNNYNET_STORAGE_ZONE}")
    print(f"Storage URL: {BUNNYNET_STORAGE_URL}")
    print(f"Pull Zone: {BUNNYNET_PULL_ZONE}")
    print(f"Storage Password found: {'Yes' if storage_password else 'No'}")
    print(f"Storage Password first 10 chars: {storage_password[:10] if storage_password else 'None'}")
    
    # Create a test file
    test_file_path = Path("test_upload.txt")
    test_content = "This is a test file for Bunny CDN upload verification."
    
    try:
        # Create test file
        with open(test_file_path, "w") as f:
            f.write(test_content)
        
        # Prepare the upload URL
        upload_url = f"https://{BUNNYNET_STORAGE_URL}/{BUNNYNET_STORAGE_ZONE}/test_upload.txt"
        print(f"\nUpload URL: {upload_url}")
        
        # Upload the file - Use storage zone password for file operations
        headers = {
            "AccessKey": storage_password,  # Use storage password, not API key
            "Content-Type": "text/plain"
        }
        
        print("\nRequest Headers:")
        for key, value in headers.items():
            if key == "AccessKey":
                print(f"{key}: {value[:10]}...")
            else:
                print(f"{key}: {value}")
        
        with open(test_file_path, "rb") as f:
            response = requests.put(upload_url, headers=headers, data=f)
        
        # Debug: Print response details
        print(f"\nUpload Response Status: {response.status_code}")
        print(f"Upload Response Headers: {dict(response.headers)}")
        print(f"Upload Response Body: {response.text}")
        
        # Check if upload was successful
        assert response.status_code == 201, f"Upload failed with status code {response.status_code}"
        print("✅ File uploaded successfully!")
        
        # Verify the file exists by trying to download it via CDN
        verify_url = f"https://{BUNNYNET_PULL_ZONE}/test_upload.txt"
        print(f"\nVerifying file at: {verify_url}")
        
        # Note: CDN might have some propagation delay, so we'll retry a few times
        import time
        for attempt in range(3):
            verify_response = requests.get(verify_url)
            if verify_response.status_code == 200:
                break
            print(f"Attempt {attempt + 1}: CDN response {verify_response.status_code}, waiting...")
            time.sleep(2)
        
        assert verify_response.status_code == 200, f"File verification failed with status {verify_response.status_code}"
        assert verify_response.text == test_content, "File content doesn't match"
        print("✅ File verified via CDN!")
        
        # Clean up - delete the test file from Bunny CDN
        delete_url = f"https://{BUNNYNET_STORAGE_URL}/{BUNNYNET_STORAGE_ZONE}/test_upload.txt"
        delete_headers = {"AccessKey": storage_password}
        delete_response = requests.delete(delete_url, headers=delete_headers)
        
        print(f"\nDelete Response Status: {delete_response.status_code}")
        assert delete_response.status_code in [200, 204], f"File deletion failed with status {delete_response.status_code}"
        print("✅ File deleted successfully!")
        
    finally:
        # Clean up local test file
        if test_file_path.exists():
            test_file_path.unlink()

def test_bunny_cdn_list_files():
    """Test listing files in the storage zone."""
    storage_password = get_storage_zone_password()
    
    if not storage_password:
        pytest.fail("Could not retrieve storage zone password")
    
    # List files in the root of the storage zone
    list_url = f"https://{BUNNYNET_STORAGE_URL}/{BUNNYNET_STORAGE_ZONE}/"
    headers = {"AccessKey": storage_password}
    
    response = requests.get(list_url, headers=headers)
    print(f"\nList Response Status: {response.status_code}")
    print(f"List Response Body: {response.text}")
    
    assert response.status_code == 200, f"List operation failed with status {response.status_code}"
    print("✅ File listing successful!")

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])