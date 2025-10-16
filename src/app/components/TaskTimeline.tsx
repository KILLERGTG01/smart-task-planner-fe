// components/TaskTimeline.tsx
"use client";
import { Task } from "@/app/lib/types";
import { useMemo } from "react";

interface ScheduledTask extends Task {
  startDate: Date;
  endDate: Date;
  color: string;
  level: number;
}

interface TaskTimelineProps {
  tasks: Task[];
}

const getColorValue = (colorClass: string): string => {
  const colorMap: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#10b981',
    'bg-purple-500': '#8b5cf6',
    'bg-pink-500': '#ec4899',
    'bg-indigo-500': '#6366f1',
    'bg-red-500': '#ef4444',
    'bg-yellow-500': '#eab308',
    'bg-teal-500': '#14b8a6',
    'bg-orange-500': '#f97316',
    'bg-cyan-500': '#06b6d4',
    'bg-lime-500': '#84cc16',
    'bg-rose-500': '#f43f5e'
  };
  return colorMap[colorClass] || '#6b7280';
};

export default function TaskTimeline({ tasks }: TaskTimelineProps) {
  const scheduledTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    // Create a map to track task completion dates
    const taskCompletionMap = new Map<string, Date>();
    const scheduled: ScheduledTask[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Color palette for tasks
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", 
      "bg-indigo-500", "bg-red-500", "bg-yellow-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-rose-500"
    ];

    // Sort tasks by dependencies (topological sort)
    const sortedTasks = [...tasks].sort((a, b) => {
      const aDeps = a.depends_on?.length || 0;
      const bDeps = b.depends_on?.length || 0;
      return aDeps - bDeps;
    });

    sortedTasks.forEach((task, index) => {
      let startDate = new Date(today);
      
      // Calculate start date based on dependencies
      if (task.depends_on && task.depends_on.length > 0) {
        let latestEndDate = new Date(today);
        
        task.depends_on.forEach(depName => {
          const depEndDate = taskCompletionMap.get(depName);
          if (depEndDate && depEndDate > latestEndDate) {
            latestEndDate = new Date(depEndDate);
          }
        });
        
        startDate = new Date(latestEndDate);
        startDate.setDate(startDate.getDate() + 1); // Start next day after dependency
      }

      const duration = task.duration_days || task.duration || 1;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration - 1);

      // Store completion date for this task
      taskCompletionMap.set(task.task, endDate);

      scheduled.push({
        ...task,
        startDate,
        endDate,
        color: colors[index % colors.length],
        level: task.depends_on?.length || 0
      });
    });

    return scheduled;
  }, [tasks]);

  const totalDays = useMemo(() => {
    if (scheduledTasks.length === 0) return 0;
    const lastTask = scheduledTasks.reduce((latest, task) => 
      task.endDate > latest.endDate ? task : latest
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((lastTask.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [scheduledTasks]);

  const projectEndDate = useMemo(() => {
    if (scheduledTasks.length === 0) return null;
    const lastTask = scheduledTasks.reduce((latest, task) => 
      task.endDate > latest.endDate ? task : latest
    );
    return lastTask.endDate;
  }, [scheduledTasks]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-600">No tasks generated yet. Create a plan to see your timeline!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Project Timeline</h2>
            <p className="text-blue-100 mt-1">{tasks.length} tasks scheduled</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalDays}</div>
            <div className="text-blue-100 text-sm">Total Days</div>
            {projectEndDate && (
              <div className="text-blue-100 text-sm mt-1">
                Completion: {projectEndDate.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="space-y-4">
          {scheduledTasks.map((task, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < scheduledTasks.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-200"></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className={`w-12 h-12 ${task.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                  {index + 1}
                </div>
                
                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50 rounded-lg p-4 border-l-4" style={{borderLeftColor: getColorValue(task.color)}}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                          {task.task}
                        </h3>
                        
                        {/* Dependencies */}
                        {task.depends_on && task.depends_on.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-slate-500 font-medium">Depends on:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.depends_on.map((dep, depIndex) => (
                                <span key={depIndex} className="inline-block bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded">
                                  {dep}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Task details */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-medium text-slate-900">
                          {task.duration_days || task.duration || 1} day{(task.duration_days || task.duration || 1) > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-medium">
                          Starts in {Math.max(0, Math.ceil((task.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar placeholder */}
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-slate-300 h-2 rounded-full" style={{width: '0%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Project Summary</h3>
              <p className="text-slate-600 text-sm">
                Complete all {tasks.length} tasks in {totalDays} days
                {projectEndDate && (
                  <span className="font-medium"> • Estimated completion: {projectEndDate.toLocaleDateString()}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}