import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Plan, HistoryResponse, User, ProfileResponse, ProfileError } from '@/app/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          
          // Redirect to home page
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Public endpoints (no auth required)
  async generatePlan(goal: string): Promise<Plan> {
    const response = await this.client.post('/api/generate', { goal });
    return response.data;
  }

  // Protected endpoints (auth required)
  async getUserHistory(): Promise<Plan[]> {
    const response: AxiosResponse<HistoryResponse> = await this.client.get('/api/history');
    return response.data.plans;
  }

  async getUserProfile(): Promise<User> {
    const response: AxiosResponse<ProfileResponse> = await this.client.get('/auth/profile');
    return response.data.user;
  }

  // Profile-specific method with enhanced error handling
  async fetchUserProfile(): Promise<{ user: User | null; error: ProfileError | null }> {
    try {
      const response: AxiosResponse<ProfileResponse> = await this.client.get('/auth/profile');
      return { user: response.data.user, error: null };
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      
      let profileError: ProfileError;
      
      if (error.response?.status === 401) {
        profileError = {
          error: 'unauthenticated',
          message: 'Your session has expired. Please sign in again.'
        };
      } else if (error.response?.status === 404) {
        profileError = {
          error: 'user_not_found',
          message: 'User profile not found. Please contact support.'
        };
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        profileError = {
          error: 'network_error',
          message: 'Network error. Please check your connection and try again.'
        };
      } else {
        profileError = {
          error: 'unknown_error',
          message: error.response?.data?.error || 'Failed to load profile. Please try again.'
        };
      }
      
      return { user: null, error: profileError };
    }
  }

  // Auth endpoints
  async exchangeCodeForToken(code: string, redirectUri: string) {
    const response = await this.client.post('/auth/exchange', {
      code,
      redirect_uri: redirectUri,
    });
    return response.data;
  }

  // Generic method for custom requests
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;