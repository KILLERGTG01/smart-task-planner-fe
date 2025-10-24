'use client';

import { useAuth } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';

interface UserProfileProps {
  showLogout?: boolean;
  className?: string;
}

export default function UserProfile({ showLogout = true, className = '' }: UserProfileProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{user.name}</span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
      {showLogout && (
        <LogoutButton className="ml-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </LogoutButton>
      )}
    </div>
  );
}