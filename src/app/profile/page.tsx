'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import LogoutButton from '@/components/auth/LogoutButton';
import { User } from '@/app/lib/types';

export default function ProfilePage() {
  const { user, getUserProfile, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !profileData) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profile = await getUserProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {loading ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-48"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          </div>
        ) : profileData ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-4">
                {profileData.picture && (
                  <img
                    src={profileData.picture}
                    alt={profileData.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                )}
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-blue-100">{profileData.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {profileData.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {profileData.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono text-sm">
                    {profileData.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authentication Provider
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                    {profileData.provider}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Created
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formatDate(profileData.created_at)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formatDate(profileData.updated_at)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
                    <p className="text-sm text-gray-500">Manage your account settings</p>
                  </div>
                  <LogoutButton>
                    Sign Out
                  </LogoutButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
            <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
            <button
              onClick={fetchProfile}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}