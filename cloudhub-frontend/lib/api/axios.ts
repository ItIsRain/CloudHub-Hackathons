// @/lib/api/axios.ts - Axios instance configuration

import axios from 'axios';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                 sessionStorage.getItem('access_token') ||
                 document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
    
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

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 401 Unauthorized from Axios - Auto logout triggered');
      
      // Clear tokens immediately
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
      
      // Clear cookies
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 