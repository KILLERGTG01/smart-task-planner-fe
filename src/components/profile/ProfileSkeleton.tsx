'use client';

interface ProfileSkeletonProps {
  variant?: 'card' | 'inline' | 'detailed' | 'compact';
}

export default function ProfileSkeleton({ variant = 'card' }: ProfileSkeletonProps) {
  if (variant === 'inline' || variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex flex-col space-y-1">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-white bg-opacity-30 rounded w-32"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-48"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}