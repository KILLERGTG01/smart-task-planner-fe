'use client';

import { useState } from 'react';
import PlanCard from './PlanCard';
import { Plan } from '@/app/lib/types';

// Sample data for demonstration
const samplePlans: Plan[] = [
  {
    id: '1',
    title: 'Launch Product MVP',
    goal: 'Launch a minimum viable product in 4 weeks',
    createdAt: '2024-01-15T10:30:00Z',
    plan: [
      {
        task: 'Define Product Scope and MVP',
        duration_days: 2,
        depends_on: []
      },
      {
        task: 'Design User Interface',
        duration_days: 3,
        depends_on: ['Define Product Scope and MVP']
      },
      {
        task: 'Develop Core Features',
        duration_days: 10,
        depends_on: ['Design User Interface']
      },
      {
        task: 'Testing and QA',
        duration_days: 5,
        depends_on: ['Develop Core Features']
      },
      {
        task: 'Deploy to Production',
        duration_days: 2,
        depends_on: ['Testing and QA']
      }
    ]
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    goal: 'Create and execute a comprehensive marketing campaign',
    createdAt: '2024-01-10T14:20:00Z',
    plan: [
      {
        task: 'Market Research',
        duration_days: 3,
        depends_on: []
      },
      {
        task: 'Create Marketing Materials',
        duration_days: 5,
        depends_on: ['Market Research']
      },
      {
        task: 'Launch Social Media Campaign',
        duration_days: 7,
        depends_on: ['Create Marketing Materials']
      }
    ]
  },
  {
    id: '3',
    title: 'Team Onboarding',
    goal: 'Onboard 5 new team members effectively',
    createdAt: '2024-01-05T09:15:00Z',
    plan: [
      {
        task: 'Prepare Onboarding Materials',
        duration_days: 2,
        depends_on: []
      },
      {
        task: 'Schedule Welcome Sessions',
        duration_days: 1,
        depends_on: ['Prepare Onboarding Materials']
      },
      {
        task: 'Conduct Individual Meetings',
        duration_days: 3,
        depends_on: ['Schedule Welcome Sessions']
      },
      {
        task: 'Follow-up and Feedback',
        duration_days: 2,
        depends_on: ['Conduct Individual Meetings']
      }
    ]
  }
];

export default function HistoryDemo() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">History Page Demo</h1>
        <p className="text-gray-600">This is how your history page will look with saved plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {samplePlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan?.id === plan.id}
            onClick={() => setSelectedPlan(plan)}
            onDelete={(planId) => console.log('Delete plan:', planId)}
            showActions={true}
          />
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Selected Plan: {selectedPlan.title}</h2>
          <p className="text-gray-600 mb-4">{selectedPlan.goal}</p>
          <div className="text-sm text-gray-500">
            Created: {new Date(selectedPlan.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}