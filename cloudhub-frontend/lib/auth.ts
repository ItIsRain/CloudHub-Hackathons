import { useRouter } from 'next/navigation';
import { UserRole } from './api/auth';
import { useState, useEffect } from 'react';

// Type for user data stored in localStorage
export interface StoredUserData {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar?: string;
}

// Function to get stored tokens
export const getStoredTokens = () => {
    if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
    
    return {
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token')
    };
};

// Function to get stored user data
export const getStoredUser = (): StoredUserData | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
    }
};

// Function to handle logout
export const handleLogout = async () => {
    try {
        const { refreshToken } = getStoredTokens();
        
        if (refreshToken) {
            // Call the logout API endpoint if available
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
            } catch (error) {
                console.error('Logout API call failed:', error);
            }
        }
    } finally {
        // Always clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login';
    }
};

// Hook for handling auth-related actions
export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState<StoredUserData | null>(null);
    
    useEffect(() => {
        setUser(getStoredUser());
    }, []);
    
    const logout = async () => {
        await handleLogout();
    };
    
    const { accessToken } = getStoredTokens();
    
    return {
        user,
        logout,
        isAuthenticated: !!accessToken
    };
}; 