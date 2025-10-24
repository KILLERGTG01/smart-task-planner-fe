'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginButton from '@/components/auth/LoginButton';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const error = searchParams.get('error') || 'unknown_error';
  const description = searchParams.get('description') || 'An unknown error occurred during authentication.';

  const getErrorMessage = (error: string, description: string) => {
    switch (error) {
      case 'access_denied':
        return {
          title: 'Access Denied',
          message: 'You denied access to the application. Please try again if you want to sign in.',
        };
      case 'no_code':
        return {
          title: 'Authentication Failed',
          message: 'No authorization code was received from the authentication provider.',
        };
      case 'exchange_failed':
        return {
          title: 'Token Exchange Failed',
          message: description || 'Failed to exchange authorization code for access token.',
        };
      case 'invalid_request':
        return {
          title: 'Invalid Request',
          message: 'The authentication request was invalid or malformed.',
        };
      case 'server_error':
        return {
          title: 'Server Error',
          message: 'The authentication server encountered an error. Please try again later.',
        };
      default:
        return {
          title: 'Authentication Error',
          message: description || 'An error occurred during authentication. Please try again.',
        };
    }
  };

  const { title, message } = getErrorMessage(error, description);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">{message}</p>
          
          <div className="mt-8 space-y-4">
            <LoginButton className="w-full">
              Try Again
            </LoginButton>
            
            <button
              onClick={() => router.push('/')}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return Home
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
                Debug Information
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                <div>Error: {error}</div>
                <div>Description: {description}</div>
                <div>URL: {window.location.href}</div>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}