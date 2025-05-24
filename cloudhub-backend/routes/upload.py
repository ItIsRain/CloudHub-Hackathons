from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional, Dict, Any
from services.bunnynet_service import BunnyNetService
from models.user import User
from auth.jwt_manager import get_current_user

router = APIRouter(
    prefix="/upload",
    tags=["File Upload"]
)

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form(""),
    current_user: User = Depends(get_current_user)
):
    """Upload a file to BunnyNet CDN."""
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Initialize BunnyNet service
    bunnynet = BunnyNetService()
    
    # Upload file
    result = bunnynet.upload_file(file.file, folder)
    
    if not result['success']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File upload failed: {result['error']}"
        )
    
    return {
        'message': 'File uploaded successfully',
        'file': result
    }

@router.delete("/{file_path:path}", response_model=Dict[str, str])
async def delete_file(
    file_path: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a file from BunnyNet CDN."""
    bunnynet = BunnyNetService()
    
    # Delete file
    success = bunnynet.delete_file(file_path)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File deletion failed"
        )
    
    return {
        'message': 'File deleted successfully'
    }

@router.get("/{file_path:path}", response_model=Dict[str, Any])
async def get_file_info(
    file_path: str,
    current_user: User = Depends(get_current_user)
):
    """Get information about a file in BunnyNet CDN."""
    bunnynet = BunnyNetService()
    
    # Get file info
    file_info = bunnynet.get_file_info(file_path)
    
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return file_info

@router.post("/batch", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def batch_upload(
    files: List[UploadFile] = File(...),
    folder: str = Form(""),
    current_user: User = Depends(get_current_user)
):
    """Upload multiple files to BunnyNet CDN."""
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided"
        )
    
    # Initialize BunnyNet service
    bunnynet = BunnyNetService()
    
    # Upload files
    results = []
    for file in files:
        if file.filename:
            result = bunnynet.upload_file(file.file, folder)
            results.append({
                'filename': file.filename,
                'success': result['success'],
                'data': result
            })
    
    # Check if any uploads were successful
    if not any(r['success'] for r in results):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All file uploads failed"
        )
    
    return {
        'message': 'Files uploaded successfully',
        'results': results
    } 