'use client';

import { Task } from '@/app/lib/types';

interface TaskListProps {
  tasks: Task[];
  isExpanded: boolean;
  maxPreviewTasks?: number;
}

export default function TaskList({ tasks, isExpanded, maxPreviewTasks = 3 }: TaskListProps) {
  const displayTasks = isExpanded ? tasks : tasks.slice(0, maxPreviewTasks);
  const hasMoreTasks = tasks.length > maxPreviewTasks;

  const getTotalDuration = () => {
    return tasks.reduce((total, task) => total + (task.duration_days || task.duration || 0), 0);
  };

  const getTaskColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-red-100 text-red-800 border-red-200',
    ];
    return colors[index % colors.length];
  };

  if (!isExpanded) {
    return (
      <div className="space-y-2">
        {displayTasks.map((task, index) => (
          <div key={index} className="flex items-center space-x-3 text-sm">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getTaskColor(index).split(' ')[0]}`}></div>
            <span className="text-gray-700 truncate">{task.task}</span>
            <span className="text-gray-500 text-xs flex-shrink-0">
              {task.duration_days || task.duration || 0}d
            </span>
          </div>
        ))}
        {hasMoreTasks && (
          <div className="text-xs text-gray-500 pl-5">
            +{tasks.length - maxPreviewTasks} more tasks
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 pb-2 border-b border-gray-200">
        <span>{tasks.length} tasks total</span>
        <span>{getTotalDuration()} days estimated</span>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {displayTasks.map((task, index) => (
          <div key={index} className={`border rounded-lg p-3 ${getTaskColor(index)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium px-2 py-1 bg-white bg-opacity-50 rounded">
                    Task {index + 1}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-white bg-opacity-50 rounded">
                    {task.duration_days || task.duration || 0} days
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-2">{task.task}</h4>
                
                {/* Dependencies */}
                {task.depends_on && task.depends_on.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium">Depends on:</span>
                    <div className="mt-1 space-y-1">
                      {task.depends_on.map((dep, depIndex) => (
                        <div key={depIndex} className="flex items-center space-x-2">
                          <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="opacity-80">{dep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}