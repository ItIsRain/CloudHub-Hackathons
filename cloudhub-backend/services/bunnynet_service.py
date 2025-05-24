import os
import requests
from werkzeug.utils import secure_filename
from flask import current_app
import hashlib
import mimetypes
from datetime import datetime
import uuid

class BunnyNetService:
    def __init__(self):
        self.api_key = current_app.config['BUNNYNET_API_KEY']
        self.storage_zone = current_app.config['BUNNYNET_STORAGE_ZONE']
        self.cdn_url = current_app.config['BUNNYNET_CDN_URL']
        self.base_url = f"https://storage.bunnycdn.com/{self.storage_zone}/"
        
    def _get_headers(self):
        """Get headers for BunnyNet API requests."""
        return {
            'AccessKey': self.api_key,
            'Accept': 'application/json'
        }
    
    def _is_allowed_file(self, filename):
        """Check if the file extension is allowed."""
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
    
    def _generate_safe_filename(self, original_filename):
        """Generate a safe, unique filename."""
        # Get the file extension
        ext = os.path.splitext(original_filename)[1]
        
        # Generate a unique filename using UUID and timestamp
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        safe_name = secure_filename(f"{timestamp}_{unique_id}{ext}")
        
        return safe_name
    
    def _get_file_hash(self, file_data):
        """Calculate SHA-256 hash of file data."""
        return hashlib.sha256(file_data).hexdigest()
    
    def upload_file(self, file, folder_path=""):
        """
        Upload a file to BunnyNet storage.
        
        Args:
            file: FileStorage object from Flask request
            folder_path: Optional path within storage zone
            
        Returns:
            dict: Upload result with CDN URL and file info
        """
        try:
            if not file:
                raise ValueError("No file provided")
            
            # Validate file
            filename = file.filename
            if not self._is_allowed_file(filename):
                raise ValueError("File type not allowed")
            
            # Generate safe filename and full path
            safe_filename = self._generate_safe_filename(filename)
            upload_path = os.path.join(folder_path, safe_filename).replace("\\", "/")
            
            # Read file data and get hash
            file_data = file.read()
            file_hash = self._get_file_hash(file_data)
            
            # Get file size and type
            file_size = len(file_data)
            content_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            
            # Prepare upload URL and headers
            upload_url = f"{self.base_url}{upload_path}"
            headers = self._get_headers()
            headers['Content-Type'] = content_type
            
            # Upload to BunnyNet
            response = requests.put(
                upload_url,
                data=file_data,
                headers=headers
            )
            
            if response.status_code not in (200, 201):
                raise Exception(f"Upload failed: {response.text}")
            
            # Construct CDN URL
            cdn_url = f"{self.cdn_url}/{upload_path}"
            
            return {
                'success': True,
                'url': cdn_url,
                'filename': safe_filename,
                'original_filename': filename,
                'size': file_size,
                'content_type': content_type,
                'hash': file_hash
            }
            
        except Exception as e:
            current_app.logger.error(f"File upload error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def delete_file(self, file_path):
        """
        Delete a file from BunnyNet storage.
        
        Args:
            file_path: Path to file within storage zone
            
        Returns:
            bool: Deletion success status
        """
        try:
            delete_url = f"{self.base_url}{file_path}"
            response = requests.delete(
                delete_url,
                headers=self._get_headers()
            )
            
            return response.status_code in (200, 204)
            
        except Exception as e:
            current_app.logger.error(f"File deletion error: {str(e)}")
            return False
    
    def get_file_info(self, file_path):
        """
        Get information about a file in BunnyNet storage.
        
        Args:
            file_path: Path to file within storage zone
            
        Returns:
            dict: File information or None if not found
        """
        try:
            info_url = f"{self.base_url}{file_path}"
            response = requests.get(
                info_url,
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                return response.json()
            return None
            
        except Exception as e:
            current_app.logger.error(f"File info error: {str(e)}")
            return None 