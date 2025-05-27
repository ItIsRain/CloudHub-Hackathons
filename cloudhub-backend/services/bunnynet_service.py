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
        self._storage_password = None
        
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
                response.raise_for_status()  # Raises exception for 4xx/5xx status codes
                
                zones = response.json()
                for zone in zones:
                    if zone.get('Name') == self.storage_zone:
                        self._storage_password = zone.get('Password')
                        break
                        
                if not self._storage_password:
                    raise ValueError(f"Storage zone '{self.storage_zone}' not found")
                    
            except requests.RequestException as e:
                current_app.logger.error(f"Failed to get storage password: {str(e)}")
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
        allowed_extensions = current_app.config.get('ALLOWED_EXTENSIONS', set())
        return ext in allowed_extensions
    
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
    
    def upload_file(self, file, folder_path=""):
        """
        Upload a file to BunnyNet storage.
        
        Args:
            file: FileStorage object from Flask request
            folder_path: Optional path within storage zone (no leading slash)
            
        Returns:
            dict: Upload result with CDN URL and file info
        """
        try:
            if not file or not file.filename:
                raise ValueError("No file provided or filename is empty")
            
            # Validate file
            filename = file.filename
            if not self._is_allowed_file(filename):
                allowed = current_app.config.get('ALLOWED_EXTENSIONS', set())
                raise ValueError(f"File type not allowed. Allowed types: {', '.join(allowed)}")
            
            # Generate safe filename and full path
            safe_filename = self._generate_safe_filename(filename)
            
            # Clean up folder path (remove leading/trailing slashes)
            if folder_path:
                folder_path = folder_path.strip('/').replace('\\', '/')
                upload_path = f"{folder_path}/{safe_filename}"
            else:
                upload_path = safe_filename
            
            # Read file data and get hash
            file_data = file.read()
            if not file_data:
                raise ValueError("File is empty")
                
            file_hash = self._get_file_hash(file_data)
            
            # Get file size and type
            file_size = len(file_data)
            content_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            
            # Prepare upload URL and headers
            upload_url = f"{self.base_url}{upload_path}"
            headers = self._get_headers(use_storage_password=True)
            headers['Content-Type'] = content_type
            
            # Upload to BunnyNet with timeout
            response = requests.put(
                upload_url,
                data=file_data,
                headers=headers,
                timeout=60  # 60 second timeout for uploads
            )
            
            if response.status_code not in (200, 201):
                error_msg = f"Upload failed with status {response.status_code}: {response.text}"
                current_app.logger.error(error_msg)
                raise Exception(error_msg)
            
            # Construct CDN URL (ensure no double slashes)
            cdn_url = f"{self.cdn_url.rstrip('/')}/{upload_path}"
            
            current_app.logger.info(f"File uploaded successfully: {safe_filename} ({file_size} bytes)")
            
            return {
                'success': True,
                'url': cdn_url,
                'filename': safe_filename,
                'original_filename': filename,
                'path': upload_path,
                'size': file_size,
                'content_type': content_type,
                'hash': file_hash,
                'uploaded_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            error_msg = f"File upload error: {str(e)}"
            current_app.logger.error(error_msg)
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
                current_app.logger.info(f"File deleted successfully: {file_path}")
            else:
                current_app.logger.warning(f"File deletion failed: {file_path} (status: {response.status_code})")
            
            return {
                'success': success,
                'status_code': response.status_code,
                'message': 'File deleted successfully' if success else f'Deletion failed: {response.text}'
            }
            
        except Exception as e:
            error_msg = f"File deletion error: {str(e)}"
            current_app.logger.error(error_msg)
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
            current_app.logger.error(error_msg)
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_file_info(self, file_path):
        """
        Get information about a file in BunnyNet storage.
        Note: This might not work as expected since BunnyNet storage API 
        doesn't provide detailed file info via GET requests.
        
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
            
            response = requests.head(  # Use HEAD instead of GET for file info
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
            current_app.logger.error(error_msg)
            return {
                'success': False,
                'error': str(e)
            }