# CloudHub Backend

A secure, well-structured Flask application for the CloudHub platform, integrating with Neon PostgreSQL and BunnyNet CDN.

## Project Structure

```
cloudhub-backend/
├── config/
│   └── config.py         # Configuration management
├── models/
│   └── base.py          # Database models
├── routes/
│   ├── auth.py          # Authentication routes
│   ├── user.py          # User management routes
│   ├── hackathon.py     # Hackathon management routes
│   ├── team.py          # Team management routes
│   ├── project.py       # Project management routes
│   └── upload.py        # File upload routes
├── auth/
│   └── jwt_manager.py   # JWT authentication management
├── services/
│   └── bunnynet_service.py  # BunnyNet CDN integration
├── utils/
│   └── error_handlers.py    # Error handling and logging
├── logs/                # Application logs
├── tests/              # Test files
├── .env.example        # Environment variables template
├── app.py             # Main application file
├── requirements.txt    # Project dependencies
└── README.md          # Project documentation
```

## Features

- Secure authentication with JWT
- PostgreSQL integration with connection pooling
- BunnyNet CDN integration for file uploads
- Rate limiting
- CORS protection
- Comprehensive error handling and logging
- Request validation
- SQL injection prevention
- Modular project structure

## Prerequisites

- Python 3.8+
- PostgreSQL
- Redis (optional, for rate limiting)
- BunnyNet account

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cloudhub-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the environment template and update with your values:
   ```bash
   cp .env.example .env
   ```

5. Set up the database:
   ```bash
   flask db upgrade
   ```

## Configuration

Update the `.env` file with your configuration:

```env
# Database Configuration
NEON_DB_URL=your_neon_db_url

# BunnyNet Configuration
BUNNYNET_API_KEY=your_api_key
BUNNYNET_STORAGE_ZONE=your_storage_zone
BUNNYNET_CDN_URL=your_cdn_url

# Other configurations...
```

## Running the Application

Development:
```bash
flask run
```

Production:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## API Documentation

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Logout user

### Users

- GET `/api/users/me` - Get current user
- PUT `/api/users/me` - Update current user
- GET `/api/users/{id}` - Get user by ID

### File Upload

- POST `/api/upload` - Upload file to BunnyNet CDN
- DELETE `/api/upload/{file_id}` - Delete file from CDN

## Security Measures

1. **Authentication**
   - JWT-based authentication
   - Token refresh mechanism
   - Secure password hashing

2. **Database Security**
   - Parameterized queries
   - Connection pooling
   - SSL connection

3. **File Upload Security**
   - File type validation
   - Size limits
   - Secure file naming

4. **API Security**
   - Rate limiting
   - CORS protection
   - Request validation

## Testing

Run tests:
```bash
pytest
```

## Deployment

1. Set environment to production:
   ```env
   FLASK_ENV=production
   ```

2. Use a production-grade server:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app('production')"
   ```

3. Set up SSL/TLS

4. Configure proper logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE) 