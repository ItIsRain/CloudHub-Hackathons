"use client";

import axiosInstance from './axios';

export type UserRole = 'organizer' | 'participant' | 'judge' | 'mentor' | 'media' | 'admin';

export interface RegisterData {
  // Basic Information
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  country?: string;
  timezone?: string;
  
  // Profile Information
  bio?: string;
  avatar?: string;
  skills?: string[];
  languages?: Array<{ language: string; level: string }>;
  certifications?: Array<{ name: string; issuer: string; date: string }>;
  social_links?: { [key: string]: string };
  
  // Role-specific Information
  organization_name?: string;
  organization_website?: string;
  organization_size?: string;
  industry?: string;
  specializations?: string[];
  mentorship_areas?: string[];
  
  // Organization-specific Information (for organizers)
  organization_description?: string;
  organization_focus_areas?: string[];
  organization_social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  
  // Preferences
  communication_preferences?: { [key: string]: boolean };
  notification_settings?: { [key: string]: boolean };
  availability?: { days: string[]; hours: string[] };
  
  // Terms and Conditions
  accepted_terms: boolean;
  accepted_privacy_policy: boolean;
}

export interface LoginData {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    // ... other user fields
  };
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  new_password: string;
  confirm_password: string;
}

class AuthAPI {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
      if (data.remember_me !== undefined) {
        formData.append('remember_me', data.remember_me.toString());
      }

      const response = await axiosInstance.post<AuthResponse>('/auth/login', 
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async requestPasswordReset(data: PasswordResetData): Promise<void> {
    try {
      await axiosInstance.post('/auth/password-reset', data);
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async resetPassword(data: PasswordResetConfirmData): Promise<void> {
    try {
      await axiosInstance.post('/auth/password-reset/confirm', data);
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await axiosInstance.post(`/auth/verify-email/${token}`);
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }
}

export const authAPI = new AuthAPI(); 