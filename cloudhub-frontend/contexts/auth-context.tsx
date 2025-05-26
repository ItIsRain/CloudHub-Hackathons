// @/lib/auth.tsx - Complete useAuth hook implementation

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

  const initializeAuth = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('access_token');

      if (storedUser && accessToken) {
        // Try to get fresh user data
        try {
          const freshUser = await authAPI.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          // If getting fresh data fails, use stored data
          console.warn('Failed to fetch fresh user data, using cached:', error);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // If it's a network error, try to refresh the token
          if (error instanceof Error && error.message.includes('aborted')) {
            try {
              await authAPI.refreshTokens();
              // Retry getting fresh user data
              const retryUser = await authAPI.getCurrentUser();
              setUser(retryUser);
              localStorage.setItem('user', JSON.stringify(retryUser));
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid data
      authAPI.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      if (response.user) {
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
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
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