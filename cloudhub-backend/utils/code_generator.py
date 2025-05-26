import secrets
import string

def generate_access_code(length: int = 8) -> str:
    """
    Generate a secure random access code.
    
    Args:
        length (int): Length of the access code. Defaults to 8.
        
    Returns:
        str: A secure random access code
    """
    # Use a mix of uppercase letters and numbers for better readability
    alphabet = string.ascii_uppercase + string.digits
    
    # Generate a random code
    code = ''.join(secrets.choice(alphabet) for _ in range(length))
    
    # Insert a hyphen in the middle for better readability if length >= 6
    if length >= 6:
        mid = len(code) // 2
        code = f"{code[:mid]}-{code[mid:]}"
    
    return code 