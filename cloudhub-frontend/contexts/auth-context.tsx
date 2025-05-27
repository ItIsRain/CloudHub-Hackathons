// @/contexts/auth-context.tsx - Unified auth context

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user?: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  full_name?: string;
  role: UserRole;
  phone?: string;
  country?: string;
  timezone?: string;
  organization_name?: string;
  organization_website?: string;
  organization_size?: string;
  industry?: string;
  bio?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
  };
  accepted_terms: boolean;
  accepted_privacy_policy: boolean;
}

// Constants
const TOKEN_STORAGE = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Auth Context Type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_STORAGE.ACCESS_TOKEN && !e.newValue) {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      const storedUser = localStorage.getItem(TOKEN_STORAGE.USER);
      const accessToken = localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        clearTokens();
        setUser(null);
        setLoading(false);
        return;
      }

      if (storedUser && accessToken) {
        try {
          const freshUser = await getCurrentUser();
          setUser(freshUser);
          localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(freshUser));
        } catch (error) {
          if (error instanceof Error && 
              (error.message.includes('401') || 
               error.message.includes('Unauthorized') ||
               error.message.includes('Invalid authentication credentials'))) {
            
            try {
              await refreshTokens();
              const retryUser = await getCurrentUser();
              setUser(retryUser);
              localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(retryUser));
            } catch (refreshError) {
              clearTokens();
              setUser(null);
              setLoading(false);
              return;
            }
          } else {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (parseError) {
              clearTokens();
              setUser(null);
            }
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await axiosInstance.post<TokenResponse>('/auth/login', 
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const { access_token, refresh_token, user } = response.data;

      const mappedUser = user ? {
        ...user,
        full_name: user.name,
        organization_name: user.organization_name || undefined,
        full_context: user.organization_name ? {
          id: user.id,
          email: user.email,
          name: user.name,
          organization_name: user.organization_name
        } : undefined
      } : undefined;

      localStorage.setItem(TOKEN_STORAGE.ACCESS_TOKEN, access_token);
      localStorage.setItem(TOKEN_STORAGE.REFRESH_TOKEN, refresh_token);
      if (mappedUser) localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(mappedUser));

      Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, access_token, { secure: true, sameSite: 'strict' });
      Cookies.set(TOKEN_STORAGE.REFRESH_TOKEN, refresh_token, { secure: true, sameSite: 'strict' });

      setUser(mappedUser || null);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post<TokenResponse>('/auth/register', data);
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(response.data.user));
      }
      router.push('/dashboard');
    } catch (error) {
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
      const response = await axiosInstance.put<User>('/users/me', data);
      setUser(response.data);
      localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      if (error instanceof Error && 
          (error.message.includes('401') || 
           error.message.includes('Session expired'))) {
        await logout();
      }
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(freshUser));
    } catch (error) {
      if (error instanceof Error && 
          (error.message.includes('401') || 
           error.message.includes('Unauthorized'))) {
        await logout();
      }
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refresh_token = localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN);
      if (refresh_token) {
        await axiosInstance.post('/auth/logout', { refresh_token });
      }
    } catch (error) {
      // Continue with local logout even if API call fails
    } finally {
      clearTokens();
      setUser(null);
      router.push('/login');
      setLoading(false);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_STORAGE.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE.USER);
    
    Cookies.remove(TOKEN_STORAGE.ACCESS_TOKEN);
    Cookies.remove(TOKEN_STORAGE.REFRESH_TOKEN);
  };

  const getCurrentUser = async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  };

  const refreshTokens = async (): Promise<TokenResponse> => {
    const refresh_token = localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN);
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axiosInstance.post<TokenResponse>('/auth/refresh', {
        refresh_token
      });

      const { access_token, refresh_token: new_refresh_token } = response.data;

      localStorage.setItem(TOKEN_STORAGE.ACCESS_TOKEN, access_token);
      localStorage.setItem(TOKEN_STORAGE.REFRESH_TOKEN, new_refresh_token);

      Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, access_token, { secure: true, sameSite: 'strict' });
      Cookies.set(TOKEN_STORAGE.REFRESH_TOKEN, new_refresh_token, { secure: true, sameSite: 'strict' });

      return response.data;
    } catch (error) {
      clearTokens();
      throw error;
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
        isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN) : false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}