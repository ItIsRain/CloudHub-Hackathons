"use client";

import axiosInstance from './axios';
import { User, UserRole } from '@/types/user';
import Cookies from 'js-cookie';

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

export interface Session {
  id: string;
  device_info: {
    user_agent: string;
    ip: string;
    timestamp: string;
  };
  created_at: string;
  expires_at: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  new_password: string;
  confirm_password: string;
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

interface BackendRegisterData {
  email: string;
  password: string;
  name: string;  // Backend expects 'name'
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

interface RefreshTokenResponse {
  access_token: string;
}

const TOKEN_STORAGE = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
};

export class AuthAPI {
  private api: typeof axiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.api = axiosInstance;
    
    // Add response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is not 401 or request has already been retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        // If already refreshing, wait for the new token
        if (this.isRefreshing) {
          return new Promise((resolve) => {
            this.refreshSubscribers.push((token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(this.api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await this.api.post<RefreshTokenResponse>('/auth/refresh', {
            refresh_token: refreshToken
          });

          const { access_token } = response.data;
          
          // Update tokens
          localStorage.setItem('access_token', access_token);
          this.api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          // Retry all queued requests
          this.refreshSubscribers.forEach(callback => callback(access_token));
          this.refreshSubscribers = [];

          return this.api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          this.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  private handleError(error: any): never {
    // Handle specific error cases
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors && Array.isArray(validationErrors)) {
        const errorMessage = validationErrors.map(err => `${err.msg} for ${err.loc[1]}`).join(', ');
        throw new Error(`Validation error: ${errorMessage}`);
      }
    }

    if (error.response?.status === 401) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Not authenticated');
    }
    
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }

  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await this.api.post<TokenResponse>('/auth/login', 
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const { access_token, refresh_token, user } = response.data;

    // Map backend user data to frontend format
    const mappedUser = user ? {
      ...user,
      full_name: user.name,
      // Ensure organization_name is properly mapped from the response
      organization_name: user.organization_name || undefined,
      // Only create full_context if we have an organization name
      full_context: user.organization_name ? {
        id: user.id,
        email: user.email,
        name: user.name,
        organization_name: user.organization_name
      } : undefined
    } : undefined;

    // Store tokens in both localStorage and cookies for better security
    localStorage.setItem(TOKEN_STORAGE.ACCESS_TOKEN, access_token);
    localStorage.setItem(TOKEN_STORAGE.REFRESH_TOKEN, refresh_token);
    if (mappedUser) localStorage.setItem(TOKEN_STORAGE.USER, JSON.stringify(mappedUser));

    // Set cookies with httpOnly flag
    Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, access_token, { secure: true, sameSite: 'strict' });
    Cookies.set(TOKEN_STORAGE.REFRESH_TOKEN, refresh_token, { secure: true, sameSite: 'strict' });

    return {
      ...response.data,
      user: mappedUser
    };
  }

  async refreshTokens(): Promise<TokenResponse> {
    const refresh_token = localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN);
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.api.post<TokenResponse>('/auth/refresh', {
        refresh_token
      });

      const { access_token, refresh_token: new_refresh_token } = response.data;

      // Update tokens in both localStorage and cookies
      localStorage.setItem(TOKEN_STORAGE.ACCESS_TOKEN, access_token);
      localStorage.setItem(TOKEN_STORAGE.REFRESH_TOKEN, new_refresh_token);

      Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, access_token, { secure: true, sameSite: 'strict' });
      Cookies.set(TOKEN_STORAGE.REFRESH_TOKEN, new_refresh_token, { secure: true, sameSite: 'strict' });

      return response.data;
    } catch (error) {
      // If refresh fails, clear all tokens and throw error
      this.clearTokens();
      throw error;
    }
  }

  async register(data: RegisterData): Promise<TokenResponse> {
    try {
      if (!data.name && !data.full_name) {
        throw new Error('Name is required');
      }

      // Map frontend data to backend format
      const backendData: BackendRegisterData = {
        email: data.email,
        password: data.password,
        name: data.name || data.full_name || '', // Ensure we have a non-null value
        role: data.role,
        phone: data.phone,
        country: data.country,
        bio: data.bio,
        social_links: data.social_links,
        accepted_terms: data.accepted_terms,
        accepted_privacy_policy: data.accepted_privacy_policy,
        organization_name: data.organization_name,
        organization_website: data.organization_website,
        organization_size: data.organization_size,
        industry: data.industry
      };

      const response = await this.api.post<TokenResponse>('/auth/register', backendData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    const refresh_token = localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN);
    if (refresh_token) {
      try {
        await this.api.post('/auth/logout', { refresh_token });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    this.clearTokens();
  }

  async logoutAll(): Promise<void> {
    try {
      await this.api.post('/auth/logout-all');
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSessions(): Promise<Session[]> {
    const response = await this.api.get<Session[]>('/auth/sessions');
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.api.post(`/auth/sessions/${sessionId}/revoke`);
  }

  async requestPasswordReset(data: PasswordResetData): Promise<void> {
    await this.api.post('/auth/password-reset', data);
  }

  async resetPassword(data: PasswordResetConfirmData): Promise<void> {
    await this.api.post('/auth/password-reset/confirm', data);
  }

  async verifyEmail(token: string): Promise<void> {
    await this.api.post(`/auth/verify-email/${token}`);
  }

  async updateUser(data: Partial<User>): Promise<User> {
    try {
      const response = await this.api.put<User>('/users/me', data);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        // Token refresh will be handled by the interceptor
        throw new Error('Session expired. Please log in again.');
      }
      throw this.handleError(error);
    }
  }

  clearTokens(): void {
    localStorage.removeItem(TOKEN_STORAGE.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE.USER);
    
    Cookies.remove(TOKEN_STORAGE.ACCESS_TOKEN);
    Cookies.remove(TOKEN_STORAGE.REFRESH_TOKEN);
  }

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN),
      refreshToken: localStorage.getItem(TOKEN_STORAGE.REFRESH_TOKEN)
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN);
  }
}

export const authAPI = new AuthAPI();

export interface ErrorResponse {
  detail?: string;
  errors?: Array<{ msg: string }>;
} 