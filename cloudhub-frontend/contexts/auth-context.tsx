"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, AuthResponse, LoginData, RegisterData } from '@/lib/api/auth';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      // TODO: Validate token and get user data
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    try {
      setError(null);
      const response = await authAPI.login(data);
      setUser(response.user);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authAPI.register(data);
      setUser(response.user);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
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
      setError(err.message || 'Failed to logout');
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