import axios from "axios";
import { refreshToken, getStoredToken } from "./customAuth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 60000,
});

api.interceptors.request.use(async (cfg) => {
  if (!cfg) return cfg;
  try {
    const token = typeof window !== "undefined" ? getStoredToken() : null;
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return cfg;
});

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login will be handled by refreshToken function
        console.error("Token refresh failed:", refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
