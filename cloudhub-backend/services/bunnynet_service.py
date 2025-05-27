import os
import requests
from werkzeug.utils import secure_filename
import hashlib
import mimetypes
from datetime import datetime
import uuid
import logging
from config.config import Settings

# Set up logger for this module
logger = logging.getLogger(__name__)

class BunnyNetService:
    def __init__(self, settings: Settings):
        self.api_key = settings.BUNNYNET_API_KEY
        self.storage_zone = settings.BUNNYNET_STORAGE_ZONE
        self.cdn_url = settings.BUNNYNET_CDN_URL.rstrip('/')
        
        # Ensure storage URL has https:// scheme
        storage_url = settings.BUNNYNET_STORAGE_URL.rstrip('/')
        if not storage_url.startswith(('http://', 'https://')):
            storage_url = f"https://{storage_url}"
        
        self.base_url = f"{storage_url}/{self.storage_zone}/"
        self._storage_password = None
        self.allowed_extensions = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt'}
        
    def _get_storage_password(self):
        """Get the storage zone password needed for file operations."""
        if self._storage_password is None:
            api_url = "https://api.bunny.net/storagezone"
            headers = {
                "AccessKey": self.api_key,
                "Accept": "application/json"
            }
            
            try:
                response = requests.get(api_url, headers=headers, timeout=30)
                response.raise_for_status()
                
                zones = response.json()
                for zone in zones:
                    if zone.get('Name') == self.storage_zone:
                        self._storage_password = zone.get('Password')
                        break
                        
                if not self._storage_password:
                    raise ValueError(f"Storage zone '{self.storage_zone}' not found")
                    
            except requests.RequestException as e:
                logger.error(f"Failed to get storage password: {str(e)}")
                raise ValueError("Could not retrieve storage zone password")
                
        return self._storage_password
    
    def _get_headers(self, use_storage_password=False):
        """Get headers for BunnyNet API requests."""
        if use_storage_password:
            password = self._get_storage_password()
            return {
                'AccessKey': password,
                'Accept': 'application/json'
            }
        return {
            'AccessKey': self.api_key,
            'Accept': 'application/json'
        }
    
    def _is_allowed_file(self, filename):
        """Check if the file extension is allowed."""
        if not filename or '.' not in filename:
            return False
        
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in self.allowed_extensions
    
    def _generate_safe_filename(self, original_filename):
        """Generate a safe, unique filename."""
        # Get the file extension
        ext = os.path.splitext(original_filename)[1].lower()
        
        # Generate a unique filename using UUID and timestamp
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        safe_name = secure_filename(f"{timestamp}_{unique_id}{ext}")
        
        return safe_name
    
    def _get_file_hash(self, file_data):
        """Calculate SHA-256 hash of file data."""
        return hashlib.sha256(file_data).hexdigest()
    
    def upload_file(self, file, filename=None, folder_path=""):
        """
        Upload a file to BunnyNet storage.
        
        Args:
            file: File-like object (FastAPI UploadFile.file or similar)
            filename: Original filename (required when using file stream)
            folder_path: Optional path within storage zone (no leading slash)
            
        Returns:
            dict: Upload result with CDN URL and file info
        """
        try:
            # Determine filename
            if filename:
                # Use provided filename (from FastAPI UploadFile.filename)
                original_filename = filename
            elif hasattr(file, 'filename') and file.filename:
                # Handle case where file object has filename attribute
                original_filename = file.filename
            elif hasattr(file, 'name') and file.name:
                # Handle case where file object has name attribute
                original_filename = os.path.basename(file.name)
            else:
                raise ValueError("No filename provided. Please provide filename parameter.")
            
            if not original_filename:
                raise ValueError("Filename cannot be empty")
            
            # Validate file extension
            if not self._is_allowed_file(original_filename):
                raise ValueError(f"File type not allowed. Allowed types: {', '.join(self.allowed_extensions)}")
            
            # Generate safe filename and full path
            safe_filename = self._generate_safe_filename(original_filename)
            
            # Clean up folder path (remove leading/trailing slashes)
            if folder_path:
                folder_path = folder_path.strip('/').replace('\\', '/')
                upload_path = f"{folder_path}/{safe_filename}"
            else:
                upload_path = safe_filename
            
            # Read file data and get hash
            # Reset file pointer to beginning if possible
            if hasattr(file, 'seek'):
                file.seek(0)
            
            file_data = file.read()
            if not file_data:
                raise ValueError("File is empty")
                
            file_hash = self._get_file_hash(file_data)
            
            # Get file size and type
            file_size = len(file_data)
            content_type = mimetypes.guess_type(original_filename)[0] or 'application/octet-stream'
            
            # Prepare upload URL and headers
            upload_url = f"{self.base_url}{upload_path}"
            headers = self._get_headers(use_storage_password=True)
            headers['Content-Type'] = content_type
            
            # Debug logging
            logger.info(f"Upload URL: {upload_url}")
            logger.info(f"Base URL: {self.base_url}")
            logger.info(f"Upload path: {upload_path}")
            
            # Upload to BunnyNet with timeout
            response = requests.put(
                upload_url,
                data=file_data,
                headers=headers,
                timeout=60
            )
            
            if response.status_code not in (200, 201):
                error_msg = f"Upload failed with status {response.status_code}: {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
            
            # Construct CDN URL
            cdn_url = f"{self.cdn_url}/{upload_path}"
            
            logger.info(f"File uploaded successfully: {safe_filename} ({file_size} bytes)")
            
            return {
                'success': True,
                'url': cdn_url,
                'filename': safe_filename,
                'original_filename': original_filename,
                'path': upload_path,
                'size': file_size,
                'content_type': content_type,
                'hash': file_hash,
                'uploaded_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            error_msg = f"File upload error: {str(e)}"
            logger.error(error_msg)
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
            dict: Deletion result with success status
        """
        try:
            if not file_path:
                raise ValueError("File path is required")
                
            # Clean up file path
            file_path = file_path.strip('/').replace('\\', '/')
            delete_url = f"{self.base_url}{file_path}"
            
            response = requests.delete(
                delete_url,
                headers=self._get_headers(use_storage_password=True),
                timeout=30
            )
            
            success = response.status_code in (200, 204)
            
            if success:
                logger.info(f"File deleted successfully: {file_path}")
            else:
                logger.warning(f"File deletion failed: {file_path} (status: {response.status_code})")
            
            return {
                'success': success,
                'status_code': response.status_code,
                'message': 'File deleted successfully' if success else f'Deletion failed: {response.text}'
            }
            
        except Exception as e:
            error_msg = f"File deletion error: {str(e)}"
            logger.error(error_msg)
            return {
                'success': False,
                'error': str(e)
            }
    
    def list_files(self, folder_path=""):
        """
        List files in a BunnyNet storage folder.
        
        Args:
            folder_path: Optional folder path to list (empty for root)
            
        Returns:
            dict: List result with files array
        """
        try:
            # Clean up folder path
            if folder_path:
                folder_path = folder_path.strip('/').replace('\\', '/') + '/'
            
            list_url = f"{self.base_url}{folder_path}"
            response = requests.get(
                list_url,
                headers=self._get_headers(use_storage_password=True),
                timeout=30
            )
            
            if response.status_code == 200:
                files = response.json()
                return {
                    'success': True,
                    'files': files,
                    'count': len(files) if isinstance(files, list) else 0
                }
            else:
                return {
                    'success': False,
                    'error': f'List failed with status {response.status_code}: {response.text}'
                }
                
        except Exception as e:
            error_msg = f"File listing error: {str(e)}"
            logger.error(error_msg)
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_file_info(self, file_path):
        """
        Get information about a file in BunnyNet storage.
        
        Args:
            file_path: Path to file within storage zone
            
        Returns:
            dict: File information or error
        """
        try:
            if not file_path:
                raise ValueError("File path is required")
                
            # Clean up file path
            file_path = file_path.strip('/').replace('\\', '/')
            info_url = f"{self.base_url}{file_path}"
            
            response = requests.head(
                info_url,
                headers=self._get_headers(use_storage_password=True),
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'exists': True,
                    'content_length': response.headers.get('content-length'),
                    'content_type': response.headers.get('content-type'),
                    'last_modified': response.headers.get('last-modified'),
                    'etag': response.headers.get('etag')
                }
            elif response.status_code == 404:
                return {
                    'success': True,
                    'exists': False,
                    'message': 'File not found'
                }
            else:
                return {
                    'success': False,
                    'error': f'Request failed with status {response.status_code}'
                }
                
        except Exception as e:
            error_msg = f"File info error: {str(e)}"
            logger.error(error_msg)
            return {
                'success': False,
                'error': str(e)
            }