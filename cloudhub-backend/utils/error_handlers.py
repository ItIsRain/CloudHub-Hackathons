import logging
import traceback
from functools import wraps
from flask import jsonify, current_app
from werkzeug.exceptions import HTTPException
import sys
import os
from logging.handlers import RotatingFileHandler
from typing import Dict, Any
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from datetime import datetime

def setup_logging():
    """Configure logging settings."""
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
        
    # Generate log filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_file = f'logs/app_{timestamp}.log'
    
    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG,  # Set to DEBUG to capture all log levels
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()  # Also log to console
        ]
    )
    
    # Set specific loggers to appropriate levels
    logging.getLogger('uvicorn').setLevel(logging.INFO)
    logging.getLogger('fastapi').setLevel(logging.INFO)
    logging.getLogger('beanie').setLevel(logging.INFO)
    
    # Our application loggers should stay at DEBUG
    logging.getLogger('database.db').setLevel(logging.DEBUG)
    logging.getLogger('app').setLevel(logging.DEBUG)

def handle_error(error):
    """Generic error handler."""
    if isinstance(error, HTTPException):
        response = {
            'error': error.name,
            'message': error.description,
            'status_code': error.code
        }
        status_code = error.code
    else:
        response = {
            'error': 'Internal Server Error',
            'message': str(error),
            'status_code': 500
        }
        status_code = 500
        
    # Log the error
    current_app.logger.error(f"Error: {str(error)}")
    current_app.logger.error(f"Traceback: {traceback.format_exc()}")
    
    return jsonify(response), status_code

def setup_error_handlers(app):
    """Register error handlers with the Flask app."""
    
    @app.errorhandler(400)
    def bad_request_error(error):
        return handle_error(error)
    
    @app.errorhandler(401)
    def unauthorized_error(error):
        return handle_error(error)
    
    @app.errorhandler(403)
    def forbidden_error(error):
        return handle_error(error)
    
    @app.errorhandler(404)
    def not_found_error(error):
        return handle_error(error)
    
    @app.errorhandler(500)
    def internal_error(error):
        return handle_error(error)
    
    @app.errorhandler(Exception)
    def unhandled_exception(error):
        return handle_error(error)

def error_handler(f):
    """Decorator to handle errors in routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return handle_error(e)
    return decorated_function

class APIError(Exception):
    """Custom API error class."""
    def __init__(self, message: str, status_code: int = 400, error_code: str = None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "UNKNOWN_ERROR"

def log_error(error: Exception, context: Dict[str, Any] = None):
    """Log an error with optional context."""
    error_message = f"Error: {str(error)}"
    if context:
        error_message += f"\nContext: {context}"
    error_message += f"\nTraceback: {traceback.format_exc()}"
    logging.error(error_message)

def validate_request_data(data: Dict[str, Any], required_fields: list):
    """
    Validate request data against required fields.
    
    Args:
        data (dict): Request data
        required_fields (list): List of required field names
        
    Raises:
        APIError: If validation fails
    """
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise APIError(
            f"Missing required fields: {', '.join(missing_fields)}",
            status_code=400,
            error_code="MISSING_FIELDS"
        ) 