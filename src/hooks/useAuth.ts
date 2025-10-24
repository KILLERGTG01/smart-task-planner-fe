'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState, TokenExchangeRequest, TokenExchangeResponse } from '@/app/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Exchange Auth0 code for JWT token
  const exchangeCodeForToken = useCallback(async (code: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const response = await fetch(`${API_BASE_URL}/auth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: redirectUri,
        } as TokenExchangeRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token exchange failed');
      }

      const data: TokenExchangeResponse = await response.json();
      
      // Store token and user data
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        token: data.access_token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Token exchange error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  // Login with Google (redirect to Auth0)
  const loginWithGoogle = useCallback(() => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const audience = encodeURIComponent(process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!);
    
    const url = `https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid email profile&audience=${audience}&connection=google-oauth2`;
    
    window.location.href = url;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
    
    // Redirect to home
    window.location.href = '/';
  }, []);

  // Get user profile from backend
  const getUserProfile = useCallback(async (): Promise<User | null> => {
    if (!authState.token) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          logout();
          return null;
        }
        throw new Error('Failed to fetch user profile');
      }

      const user: User = await response.json();
      
      // Update stored user data
      localStorage.setItem('auth_user', JSON.stringify(user));
      setAuthState(prev => ({ ...prev, user }));
      
      return user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [authState.token, logout]);

  // Check if token is valid
  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!authState.token) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return false;
        }
      }

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, [authState.token, logout]);

  return {
    ...authState,
    loginWithGoogle,
    logout,
    exchangeCodeForToken,
    getUserProfile,
    validateToken,
  };
};