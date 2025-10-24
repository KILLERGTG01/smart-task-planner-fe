"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import PlanCard from '@/components/history/PlanCard';
import PlanFilters from '@/components/history/PlanFilters';
import EmptyState from '@/components/history/EmptyState';
import LoadingSkeleton from '@/components/history/LoadingSkeleton';
import ErrorBoundary from '@/components/history/ErrorBoundary';
import TaskTimeline from '@/app/components/TaskTimeline';
import { Plan } from '@/app/lib/types';
import api from '@/app/lib/axios';

interface HistoryError {
  message: string;
  type: 'network' | 'auth' | 'server' | 'unknown';
  canRetry: boolean;
}

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HistoryError | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'tasks'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/history');
      setPlans(response.data.plans || []);
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
      
      let errorInfo: HistoryError;
      
      if (err.response?.status === 401) {
        errorInfo = {
          message: 'Your session has expired. Please sign in again.',
          type: 'auth',
          canRetry: false
        };
      } else if (err.response?.status >= 500) {
        errorInfo = {
          message: 'Server error. Please try again later.',
          type: 'server',
          canRetry: true
        };
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorInfo = {
          message: 'Network error. Please check your connection and try again.',
          type: 'network',
          canRetry: true
        };
      } else {
        errorInfo = {
          message: err.response?.data?.message || 'Failed to load plans. Please try again.',
          type: 'unknown',
          canRetry: true
        };
      }
      
      setError(errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      // Note: This assumes you have a delete endpoint. If not, remove this functionality
      // await api.delete(`/api/plans/${planId}`);
      
      // For now, just remove from local state
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      
      // Clear selection if deleted plan was selected
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Failed to delete plan:', error);
      // You could show a toast notification here
    }
  };

  // Filter and sort plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = plans;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = plans.filter(plan => 
        (plan.title?.toLowerCase().includes(query)) ||
        plan.goal.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          const titleA = (a.title || a.goal).toLowerCase();
          const titleB = (b.title || b.goal).toLowerCase();
          comparison = titleA.localeCompare(titleB);
          break;
        case 'tasks':
          comparison = a.plan.length - b.plan.length;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [plans, searchQuery, sortBy, sortOrder]);

  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Plans</h3>
      <p className="text-red-700 mb-4">{error?.message}</p>
      <div className="flex items-center justify-center space-x-3">
        {error?.canRetry && (
          <button
            onClick={fetchHistory}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );

  const renderPlansGrid = () => (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {filteredAndSortedPlans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan?.id === plan.id}
          onClick={() => setSelectedPlan(plan)}
          onDelete={handleDeletePlan}
          showActions={true}
        />
      ))}
    </div>
  );

  const renderSelectedPlanDetails = () => (
    <div className="lg:col-span-1">
      <div className="sticky top-6">
        {selectedPlan ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Plan Details</h2>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TaskTimeline tasks={selectedPlan.plan} />
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-gray-500">Select a plan to view its timeline</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Link href="/" className="hover:text-gray-700 transition-colors">
                  Home
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">Plan History</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Plan History</h1>
              <p className="text-gray-600 mt-1">View and manage your previously generated plans</p>
            </div>
            
            {plans.length > 0 && (
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {viewMode === 'grid' ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      List View
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Grid View
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : error ? (
            renderError()
          ) : plans.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Filters */}
              <PlanFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                totalPlans={plans.length}
                filteredPlans={filteredAndSortedPlans.length}
              />

              {/* Plans Grid/List */}
              {filteredAndSortedPlans.length === 0 ? (
                <EmptyState
                  title="No Plans Found"
                  description="No plans match your current search criteria. Try adjusting your filters or search terms."
                  actionText="Clear Filters"
                  actionHref="#"
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {renderPlansGrid()}
                  </div>
                  {renderSelectedPlanDetails()}
                </div>
              )}
            </>
          )}
        </div>
      </ErrorBoundary>
    </AuthGuard>
  );
}
