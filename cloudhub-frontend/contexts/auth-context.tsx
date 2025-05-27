// @/lib/auth.tsx - Fixed auth context with proper token handling

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/user';
import { authAPI, LoginCredentials, RegisterData } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen for storage changes (token removal)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        // Token was removed, logout user
        console.log('Access token removed, logging out user');
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Debug auth state changes
  useEffect(() => {
    console.log('Auth state changed:', { 
      user: !!user, 
      loading, 
      hasToken: !!localStorage.getItem('access_token') 
    });
  }, [user, loading]);

  const initializeAuth = async () => {
    try {
      setLoading(true); // Ensure loading is true during init
      
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      console.log('Initializing auth with tokens:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        hasStoredUser: !!storedUser 
      });

      // If no tokens at all, immediately set as logged out
      if (!accessToken || !refreshToken) {
        console.log('No tokens found, user not authenticated');
        authAPI.clearTokens();
        setUser(null);
        setLoading(false);
        return;
      }

      if (storedUser && accessToken) {
        try {
          console.log('Attempting to get fresh user data...');
          const freshUser = await authAPI.getCurrentUser();
          console.log('Fresh user data retrieved successfully');
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          console.error('Failed to get current user:', error);
          
          // Better error handling for auth failures
          if (error instanceof Error && 
              (error.message.includes('401') || 
               error.message.includes('Unauthorized') ||
               error.message.includes('Invalid authentication credentials') ||
               error.message.includes('Not authenticated'))) {
            
            console.warn('Authentication failed (401), attempting token refresh...');
            
            // Try to refresh tokens before giving up
            try {
              console.log('Attempting to refresh tokens...');
              await authAPI.refreshTokens();
              console.log('Token refresh successful, retrying user fetch...');
              
              // Retry getting fresh user data
              const retryUser = await authAPI.getCurrentUser();
              console.log('User data retrieved after token refresh');
              setUser(retryUser);
              localStorage.setItem('user', JSON.stringify(retryUser));
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              
              // 🚨 FIXED: If refresh fails, definitely log out
              console.warn('Both access token and refresh token are invalid, logging out user');
              authAPI.clearTokens();
              setUser(null);
              setLoading(false); // 🚨 CRITICAL: Set loading to false here
              return; // Exit early, don't continue to finally block
            }
          } else {
            // For network errors, use cached data but don't refresh tokens
            console.warn('Network or other error, using cached user data:', error);
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error('Failed to parse stored user data:', parseError);
              authAPI.clearTokens();
              setUser(null);
            }
          }
        }
      } else {
        // No stored user data
        console.log('No stored user data found');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear everything on initialization error
      authAPI.clearTokens();
      setUser(null);
    } finally {
      setLoading(false); // Always set loading to false (unless we returned early)
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      console.log('Attempting login...');
      const response = await authAPI.login(credentials);
      if (response.user) {
        console.log('Login successful, setting user data');
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Updating user with data:', data);
      
      // Call the API to update user
      const updatedUser = await authAPI.updateUser(data);
      
      console.log('User updated successfully:', updatedUser);
      
      // Update local state and storage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      
      // If update fails due to auth, logout
      if (error instanceof Error && 
          (error.message.includes('401') || 
           error.message.includes('Session expired'))) {
        console.warn('Session expired during user update, logging out');
        await logout();
      }
      
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const freshUser = await authAPI.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      
      // If refresh user fails due to auth, logout
      if (error instanceof Error && 
          (error.message.includes('401') || 
           error.message.includes('Unauthorized'))) {
        console.warn('Session expired during user refresh, logging out');
        await logout();
      }
      
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('Logging out user...');
      await authAPI.logout();
      setUser(null);
      console.log('Logout successful, redirecting to login');
      router.push('/login');
    } catch (error) {
      console.error('Logout API failed:', error);
      // Even if logout API fails, clear local state
      setUser(null);
      authAPI.clearTokens();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}