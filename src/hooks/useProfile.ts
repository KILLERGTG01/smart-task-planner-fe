'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, ProfileError } from '@/app/lib/types';
import { useAuth } from './useAuth';
import apiClient from '@/lib/api';

interface UseProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: ProfileError | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  lastFetched: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PROFILE_CACHE_KEY = 'user_profile_cache';

interface ProfileCache {
  profile: User;
  timestamp: number;
}

export const useProfile = (): UseProfileReturn => {
  const { isAuthenticated, token, user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ProfileError | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load cached profile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        try {
          const { profile: cachedProfile, timestamp }: ProfileCache = JSON.parse(cached);
          const now = Date.now();
          
          if (now - timestamp < CACHE_DURATION) {
            setProfile(cachedProfile);
            setLastFetched(timestamp);
          } else {
            // Cache expired, remove it
            localStorage.removeItem(PROFILE_CACHE_KEY);
          }
        } catch (error) {
          console.error('Error parsing cached profile:', error);
          localStorage.removeItem(PROFILE_CACHE_KEY);
        }
      }
    }
  }, []);

  // Cache profile data
  const cacheProfile = useCallback((profileData: User) => {
    if (typeof window !== 'undefined') {
      const cacheData: ProfileCache = {
        profile: profileData,
        timestamp: Date.now()
      };
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
    }
  }, []);

  // Clear profile cache
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  }, []);

  // Fetch profile from API
  const fetchProfile = useCallback(async (force = false) => {
    if (!isAuthenticated || !token) {
      setProfile(null);
      setError(null);
      clearCache();
      return;
    }

    // Check if we have recent cached data and not forcing refresh
    if (!force && profile && lastFetched) {
      const now = Date.now();
      if (now - lastFetched < CACHE_DURATION) {
        return; // Use cached data
      }
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const { user: fetchedProfile, error: fetchError } = await apiClient.fetchUserProfile();
      
      if (fetchError) {
        setError(fetchError);
        setProfile(null);
        clearCache();
        
        // Handle authentication errors
        if (fetchError.error === 'unauthenticated') {
          // This will be handled by the API client interceptor
          return;
        }
      } else if (fetchedProfile) {
        setProfile(fetchedProfile);
        setError(null);
        setLastFetched(Date.now());
        cacheProfile(fetchedProfile);
      }
    } catch (error: any) {
      // Handle request cancellation
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('Profile fetch error:', error);
      setError({
        error: 'fetch_failed',
        message: 'Failed to load profile. Please try again.'
      });
      setProfile(null);
      clearCache();
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isAuthenticated, token, profile, lastFetched, cacheProfile, clearCache]);

  // Refetch profile (force refresh)
  const refetch = useCallback(async () => {
    await fetchProfile(true);
  }, [fetchProfile]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch profile when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      // If we have auth user data but no profile, use it as initial data
      if (authUser && !profile) {
        setProfile(authUser);
        cacheProfile(authUser);
        setLastFetched(Date.now());
      }
      
      // Fetch fresh profile data
      fetchProfile();
    } else {
      // Clear profile when not authenticated
      setProfile(null);
      setError(null);
      setLastFetched(null);
      clearCache();
    }
  }, [isAuthenticated, token, authUser, fetchProfile, profile, cacheProfile, clearCache]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle app focus to refresh stale data
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && profile && lastFetched) {
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetched;
        
        // Refresh if data is older than half the cache duration
        if (timeSinceLastFetch > CACHE_DURATION / 2) {
          fetchProfile();
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [isAuthenticated, profile, lastFetched, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch,
    clearError,
    lastFetched
  };
};