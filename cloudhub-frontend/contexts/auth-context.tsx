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
  const router = useRouter();

  // Add retry logic for API calls
  const retryWithDelay = async <T,>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2);
    }
  };

  // Format user data to match frontend User type
  const formatUserData = (userData: any): User => {
    return {
      id: userData.id,
      email: userData.email,
      full_name: userData.name,  // Map name to full_name
      role: userData.role,
      status: userData.status,
      avatar: userData.avatar,
      email_verified: userData.email_verified,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      ...userData  // Include other fields
    };
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Fetch current user data with retries
          try {
            const userData = await retryWithDelay(() => authAPI.getCurrentUser());
            if (userData) {
              setUser(formatUserData(userData));
            }
          } catch (err) {
            // If user data fetch fails, try to refresh token
            try {
              const refreshed = await retryWithDelay(() => authAPI.refreshTokens());
              if (refreshed.user) {
                setUser(formatUserData(refreshed.user));
              } else {
                // If refresh succeeds but no user, try getting user data again
                const userData = await retryWithDelay(() => authAPI.getCurrentUser());
                if (userData) {
                  setUser(formatUserData(userData));
                }
              }
            } catch (refreshErr) {
              // If refresh fails, clear everything and redirect
              console.error('Auth refresh failed:', refreshErr);
              authAPI.clearTokens();
              setUser(null);
              router.push('/login');
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        authAPI.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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