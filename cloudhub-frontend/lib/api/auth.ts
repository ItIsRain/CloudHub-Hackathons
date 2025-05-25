"use client";

import axiosInstance from './axios';
import { User, UserRole } from '@/types/user';
import Cookies from 'js-cookie';
import type { AxiosInstance } from 'axios';

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
  full_name: string;
  role: UserRole;
  phone?: string;
  country?: string;
  timezone?: string;
  organization_name?: string;
  accepted_terms: boolean;
  accepted_privacy_policy: boolean;
}

const TOKEN_STORAGE = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
};

export class AuthAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  private handleError(error: any): never {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
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
    const response = await this.api.post<TokenResponse>('/auth/register', data);
    return response.data;
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

// Export a single instance of the AuthAPI
export const authAPI = new AuthAPI();

export interface ErrorResponse {
  detail?: string;
  errors?: Array<{ msg: string }>;
} 