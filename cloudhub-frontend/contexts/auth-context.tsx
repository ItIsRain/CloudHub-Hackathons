"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, TokenResponse, LoginCredentials, RegisterData } from '@/lib/api/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Add retry logic for API calls with exponential backoff
  const retryWithDelay = async <T,>(
    fn: () => Promise<T>,
    retries = 3,
    initialDelay = 1000,
    maxDelay = 30000  // Maximum delay of 30 seconds
  ): Promise<T> => {
    let currentDelay = initialDelay;
    let attempts = 0;

    while (attempts < retries) {
      try {
        return await fn();
      } catch (error: any) {
        attempts++;
        
        // Check if it's a database connection error (503)
        const isDbError = error.response?.status === 503 && 
          (error.response?.data?.detail?.includes('Database') || 
           error.response?.data?.detail?.includes('not connected'));

        // If it's the last attempt or not a DB error, throw
        if (attempts === retries || !isDbError) {
          throw error;
        }

        // Calculate next delay with exponential backoff
        currentDelay = Math.min(currentDelay * 2, maxDelay);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }
    throw new Error('Max retries reached');
  };

  // Format user data to match frontend User type
  const formatUserData = (userData: any): User => {
    return {
      id: userData.id,
      email: userData.email,
      full_name: userData.name,
      role: userData.role,
      status: userData.status,
      avatar: userData.avatar,
      email_verified: userData.email_verified,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      ...userData
    };
  };

  const checkAuth = async (shouldRetry = true) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await retryWithDelay(() => authAPI.getCurrentUser());
        if (userData) {
          setUser(formatUserData(userData));
          // Clear any existing retry timeout
          if (retryTimeout) {
            clearTimeout(retryTimeout);
            setRetryTimeout(null);
          }
        }
      } catch (err: any) {
        // Handle database connection errors specially
        if (err.response?.status === 503 && shouldRetry) {
          const delay = 5000; // Start with 5 seconds
          // Set up a retry with increasing delay
          const timeout = setTimeout(() => {
            checkAuth(true);
          }, delay);
          setRetryTimeout(timeout);
          // Don't clear user data yet
          return;
        }

        // For other errors, try token refresh
        try {
          const refreshed = await retryWithDelay(() => authAPI.refreshTokens());
          if (refreshed.user) {
            setUser(formatUserData(refreshed.user));
            // Clear any existing retry timeout
            if (retryTimeout) {
              clearTimeout(retryTimeout);
              setRetryTimeout(null);
            }
          }
        } catch (refreshErr: any) {
          // Only logout if it's not a database connection error
          if (refreshErr.response?.status !== 503) {
            console.error('Auth refresh failed:', refreshErr);
            authAPI.clearTokens();
            setUser(null);
            router.push('/login');
          } else if (shouldRetry) {
            // For DB errors, retry with backoff
            const delay = 5000; // Start with 5 seconds
            const timeout = setTimeout(() => {
              checkAuth(true);
            }, delay);
            setRetryTimeout(timeout);
            // Don't clear user data yet
            return;
          }
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Cleanup function to clear any pending timeouts
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [router]);

  const login = async (data: LoginCredentials) => {
    try {
      setError(null);
      const response = await retryWithDelay(() => authAPI.login(data));
      if (response.user) {
        setUser(formatUserData(response.user));
      }
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await retryWithDelay(() => authAPI.register(data));
      if (response.user) {
        setUser(formatUserData(response.user));
      }
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to register';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.push('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to logout';
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 