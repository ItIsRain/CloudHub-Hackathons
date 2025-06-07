// @/contexts/auth-context.tsx - Fixed auth context with better redirect handling

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized]);

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
      console.log('🔄 Initializing auth...');
      setLoading(true);
      
      const storedUser = localStorage.getItem(TOKEN_STORAGE.USER);
      const accessToken = localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN);

      console.log('📊 Auth tokens check:', {
        hasStoredUser: !!storedUser,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });

      if (!accessToken || !refreshToken) {
        console.log('❌ No tokens found, clearing auth state');
        clearTokens();
        setUser(null);
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      // Try to use stored user first, then validate with server
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('👤 Found stored user:', parsedUser.email);
          setUser(parsedUser);
          
          // UPDATED: Ensure user data is also in cookies
          Cookies.set(TOKEN_STORAGE.USER, storedUser, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          
          // Validate in background - don't await this
          validateUserInBackground();
        } catch (parseError) {
          console.error('❌ Error parsing stored user:', parseError);
          clearTokens();
          setUser(null);
        }
      } else {
        // No stored user, try to fetch from server
        try {
          const freshUser = await getCurrentUser();
          console.log('✅ Fetched fresh user:', freshUser.email);
          setUser(freshUser);
          localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(freshUser));
          // ADDED: Store in cookies too
          Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(freshUser), {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        } catch (error) {
          console.log('❌ Failed to fetch user, trying token refresh');
          if (await tryRefreshTokens()) {
            try {
              const retryUser = await getCurrentUser();
              console.log('✅ Got user after token refresh:', retryUser.email);
              setUser(retryUser);
              localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(retryUser));
              // ADDED: Store in cookies too
              Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(retryUser), {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
              });
            } catch (retryError) {
              console.log('❌ Failed to get user after refresh, clearing tokens');
              clearTokens();
              setUser(null);
            }
          } else {
            clearTokens();
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const validateUserInBackground = async () => {
    try {
      const freshUser = await getCurrentUser();
      // Only update if there are differences
      const currentUserStr = JSON.stringify(user);
      const freshUserStr = JSON.stringify(freshUser);
      
      if (currentUserStr !== freshUserStr) {
        console.log('🔄 Updating user data from server');
        setUser(freshUser);
        localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(freshUser));
        // Update cookies too
        Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(freshUser), {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }
    } catch (error: any) {
      console.log('⚠️ Background user validation failed:', error);
      
      // Check if error is due to invalid token (401)
      if (error?.response?.status === 401) {
        console.log('🔄 Token expired, attempting refresh...');
        try {
          // Try to refresh the token
          await tryRefreshTokens();
          
          // Retry getting user info with new token
          const retryUser = await getCurrentUser();
          console.log('✅ Got user after token refresh');
          setUser(retryUser);
          localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(retryUser));
          // Update cookies too
          Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(retryUser), {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        } catch (refreshError) {
          console.log('❌ Token refresh failed, logging out:', refreshError);
          // If refresh fails, log the user out
          await logout();
        }
      }
      // Don't throw error for background validation
    }
  };

  const tryRefreshTokens = async (): Promise<boolean> => {
    try {
      await refreshTokens();
      console.log('✅ Tokens refreshed successfully');
      return true;
    } catch (error) {
      console.log('❌ Token refresh failed:', error);
      return false;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      console.log('🔐 Attempting login for:', credentials.username);
      
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

      // Store tokens
      localStorage.setItem(TOKEN_STORAGE.ACCESS_TOKEN, access_token);
      localStorage.setItem(TOKEN_STORAGE.REFRESH_TOKEN, refresh_token);
      if (mappedUser) localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(mappedUser));

      // Also store in cookies as backup/for middleware
      Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, access_token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Keep 'lax' for better compatibility
        httpOnly: false // Access token needs to be readable by JS for API calls
      });
      Cookies.set(TOKEN_STORAGE.REFRESH_TOKEN, refresh_token, { 
        expires: 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Keep 'lax' for better compatibility
        httpOnly: false // Keep accessible for frontend token refresh logic
      });

      // Store user data in cookies for middleware access (secure but not httpOnly)
      if (mappedUser) {
        Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(mappedUser), {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' // Keep 'lax' for better compatibility
        });
      }

      setUser(mappedUser || null);
      console.log('✅ Login successful:', mappedUser?.email);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Login failed:', error);
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
        // Store in cookies too
        Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(response.data.user), {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
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
      // Update cookies too
      Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(response.data), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
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
      // Update cookies too
      Cookies.set(TOKEN_STORAGE.USER, JSON.stringify(freshUser), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
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
      console.log('⚠️ Server logout failed, continuing with local logout');
    } finally {
      console.log('👋 Logging out user');
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
    // ADDED: Also remove user data from cookies
    Cookies.remove(TOKEN_STORAGE.USER);
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

      Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, access_token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: false
      });
      Cookies.set(TOKEN_STORAGE.REFRESH_TOKEN, new_refresh_token, { 
        expires: 30,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: false // Keep accessible for frontend token refresh logic
      });

      // Preserve user data in cookies if it exists
      const existingUserData = localStorage.getItem(TOKEN_STORAGE.USER);
      if (existingUserData) {
        Cookies.set(TOKEN_STORAGE.USER, existingUserData, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

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
        isAuthenticated: !!user && !!localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN),
        isLoading: loading
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