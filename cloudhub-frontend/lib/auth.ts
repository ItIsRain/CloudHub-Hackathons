import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types/user';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api/auth';

// Type for user data stored in localStorage
export type StoredUserData = User;

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
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
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

    const updateUser = async (data: Partial<User>) => {
        try {
            const response = await authAPI.updateUser(data);
            if (response) {
                setUser(response);
                localStorage.setItem('user', JSON.stringify(response));
            }
            return response;
        } catch (error: any) {
            console.error('Update user error:', error);
            throw error;
        }
    };
    
    const { accessToken } = getStoredTokens();
    
    return {
        user,
        logout,
        updateUser,
        isAuthenticated: !!accessToken
    };
}; 