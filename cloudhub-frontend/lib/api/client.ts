// @/lib/api/client.ts - Centralized API client with automatic 401 handling

interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private onUnauthorized: (() => void) | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || 'http://localhost:8000/api';
    this.timeout = options.timeout || 10000;
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private getAuthToken(): string | null {
    // Try multiple storage locations
    return localStorage.getItem('access_token') || 
           sessionStorage.getItem('access_token') ||
           document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] ||
           null;
  }

  private async makeRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      credentials: options.credentials || 'include',
    };

    if (options.body && options.method !== 'GET') {
      config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      console.log(`🌐 API ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.warn('🔒 401 Unauthorized - Auto logout triggered');
        
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
        
        // Call the unauthorized handler if set (auth context will handle redirect)
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        
        throw new Error('Session expired. Please log in again.');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}: ${errorText}`);
        throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        return (text || null) as T;
      }

      const data = await response.json();
      console.log(`✅ API ${options.method || 'GET'} ${endpoint} - Success`);
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances if needed
export default ApiClient; 