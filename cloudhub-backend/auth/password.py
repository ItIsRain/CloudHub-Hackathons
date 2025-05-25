import bcrypt

def get_password_hash(password: str) -> str:
    """Generate a password hash using bcrypt."""
    try:
        # Convert password to bytes if it's a string
        if isinstance(password, str):
            password = password.encode('utf-8')
            
        # Generate salt and hash
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password, salt)
        
        # Return as string
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"Error in get_password_hash: {str(e)}")
        raise Exception(f"Failed to hash password: {str(e)}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash using bcrypt."""
    try:
        # Convert inputs to bytes if they're strings
        if isinstance(plain_password, str):
            plain_password = plain_password.encode('utf-8')
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
            
        print(f"Verifying password - plain length: {len(plain_password)}, hash length: {len(hashed_password)}")
        
        # Verify the password
        return bcrypt.checkpw(plain_password, hashed_password)
    except Exception as e:
        print(f"Error in verify_password: {str(e)}")
        raise Exception(f"Failed to verify password: {str(e)}") 