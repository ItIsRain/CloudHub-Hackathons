from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional, Dict, Any
from services.bunnynet_service import BunnyNetService
from models.user import User
from auth.jwt_manager import get_current_user
from config.config import Settings, get_settings

router = APIRouter(
    tags=["File Upload"]
)

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form(""),
    current_user: User = Depends(get_current_user),
    settings: Settings = Depends(get_settings)
):
    """Upload a file to BunnyNet CDN."""
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided or filename is missing"
        )
    
    # Initialize BunnyNet service with settings
    bunnynet = BunnyNetService(settings)
    
    # Upload file - pass both the file stream AND the filename
    result = bunnynet.upload_file(file.file, filename=file.filename, folder_path=folder)
    
    if not result['success']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File upload failed: {result['error']}"
        )
    
    return {
        'message': 'File uploaded successfully',
        'file': result
    }

@router.delete("/{file_path:path}", response_model=Dict[str, Any])
async def delete_file(
    file_path: str,
    current_user: User = Depends(get_current_user),
    settings: Settings = Depends(get_settings)
):
    """Delete a file from BunnyNet CDN."""
    bunnynet = BunnyNetService(settings)
    
    # Delete file
    result = bunnynet.delete_file(file_path)
    
    if not result['success']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get('message', 'File deletion failed')
        )
    
    return {
        'message': 'File deleted successfully'
    }

@router.get("/{file_path:path}", response_model=Dict[str, Any])
async def get_file_info(
    file_path: str,
    current_user: User = Depends(get_current_user),
    settings: Settings = Depends(get_settings)
):
    """Get information about a file in BunnyNet CDN."""
    bunnynet = BunnyNetService(settings)
    
    # Get file info
    file_info = bunnynet.get_file_info(file_path)
    
    if not file_info or not file_info.get('success'):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return file_info

@router.get("/list/{folder_path:path}", response_model=Dict[str, Any])
async def list_files(
    folder_path: str = "",
    current_user: User = Depends(get_current_user),
    settings: Settings = Depends(get_settings)
):
    """List files in a BunnyNet storage folder."""
    bunnynet = BunnyNetService(settings)
    
    result = bunnynet.list_files(folder_path)
    
    if not result['success']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get('error', 'Failed to list files')
        )
    
    return result

@router.post("/batch", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def batch_upload(
    files: List[UploadFile] = File(...),
    folder: str = Form(""),
    current_user: User = Depends(get_current_user),
    settings: Settings = Depends(get_settings)
):
    """Upload multiple files to BunnyNet CDN."""
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided"
        )
    
    # Initialize BunnyNet service
    bunnynet = BunnyNetService(settings)
    
    # Upload files
    results = []
    for file in files:
        if file.filename:
            # Pass both file stream and filename
            result = bunnynet.upload_file(file.file, filename=file.filename, folder_path=folder)
            results.append({
                'filename': file.filename,
                'success': result['success'],
                'data': result
            })
    
    # Check if any uploads were successful
    successful_uploads = [r for r in results if r['success']]
    
    if not successful_uploads:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All file uploads failed"
        )
    
    return {
        'message': f'{len(successful_uploads)} of {len(results)} files uploaded successfully',
        'results': results,
        'successful_count': len(successful_uploads),
        'total_count': len(results)
    }