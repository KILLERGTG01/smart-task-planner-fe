import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Plan, HistoryResponse, User } from '@/app/lib/types';

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
    const response: AxiosResponse<User> = await this.client.get('/auth/profile');
    return response.data;
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