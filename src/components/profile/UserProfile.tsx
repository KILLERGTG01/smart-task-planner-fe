'use client';

import { useProfile } from '@/hooks/useProfile';
import ProfileCard from './ProfileCard';
import ProfileSkeleton from './ProfileSkeleton';
import { ProfileError } from '@/app/lib/types';

interface UserProfileProps {
  variant?: 'card' | 'compact' | 'detailed';
  showActions?: boolean;
  onError?: (error: ProfileError) => void;
}

interface ErrorMessageProps {
  error: ProfileError;
  onRetry: () => void;
  onClear: () => void;
}

function ErrorMessage({ error, onRetry, onClear }: ErrorMessageProps) {
  const getErrorIcon = () => {
    switch (error.error) {
      case 'unauthenticated':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'user_not_found':
        return (
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'network_error':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  const getErrorTitle = () => {
    switch (error.error) {
      case 'unauthenticated':
        return 'Authentication Required';
      case 'user_not_found':
        return 'Profile Not Found';
      case 'network_error':
        return 'Connection Error';
      default:
        return 'Profile Error';
    }
  };

  const canRetry = !['unauthenticated', 'user_not_found'].includes(error.error);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        {getErrorIcon()}
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{getErrorTitle()}</h3>
      <p className="text-red-700 mb-4">{error.message}</p>
      <div className="flex items-center justify-center space-x-3">
        {canRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
        <button
          onClick={onClear}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function UserProfile({ 
  variant = 'card', 
  showActions = true,
  onError 
}: UserProfileProps) {
  const { profile, isLoading, error, refetch, clearError } = useProfile();

  // Notify parent of errors
  if (error && onError) {
    onError(error);
  }

  if (isLoading && !profile) {
    return <ProfileSkeleton variant={variant} />;
  }

  if (error) {
    return (
      <ErrorMessage 
        error={error} 
        onRetry={refetch} 
        onClear={clearError}
      />
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Data</h3>
        <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
        <button
          onClick={refetch}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Load Profile
        </button>
      </div>
    );
  }

  return (
    <ProfileCard
      user={profile}
      onRefresh={showActions ? refetch : undefined}
      isRefreshing={isLoading}
      showActions={showActions}
      variant={variant}
    />
  );
}