// Custom authentication functions for backend API integration

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
}

// 1. Login with Google
export const loginWithGoogle = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?provider=google`);
    const { auth_url } = await response.json();
    window.location.href = auth_url;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// 2. Login with GitHub  
export const loginWithGitHub = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?provider=github`);
    const { auth_url } = await response.json();
    window.location.href = auth_url;
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
};

// 3. Handle success callback (on /auth/success page)
export const handleAuthSuccess = (): { token: string; user: User } | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (!token || !userParam) {
      throw new Error('Missing token or user data');
    }
    
    const user: User = JSON.parse(decodeURIComponent(userParam));
    
    // Store token and user data
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.error('Auth success handling error:', error);
    return null;
  }
};

// 4. Make authenticated requests
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Handle token expiration
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry the request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${refreshed}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  return response;
};

// 5. Refresh token when expired
export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    if (response.ok) {
      const { access_token } = await response.json();
      localStorage.setItem('access_token', access_token);
      return access_token;
    }
    
    throw new Error('Token refresh failed');
  } catch (error) {
    console.error('Token refresh error:', error);
    // Refresh failed, redirect to login
    logout();
    return null;
  }
};

// 6. Logout
export const logout = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`);
    const { logout_url } = await response.json();
    
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to logout URL or login page
    if (logout_url) {
      window.location.href = logout_url;
    } else {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Clear storage even if logout request fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
};

// Utility functions
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!getStoredToken();
};