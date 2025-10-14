// Core task/plan types
export interface Task {
  task: string;
  duration_days?: number;
  duration?: number;
  depends_on?: string[];
}

export interface Plan {
  id: string;
  title?: string;
  goal: string;
  plan: Task[];
  createdAt: string;
}

export interface HistoryResponse {
  plans: Plan[];
}

// Auth0 types
export interface Auth0AppState {
  returnTo?: string;
}

// Gantt chart types
export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
}

export interface GanttCallbacks {
  on_click: (task: GanttTask) => void;
  on_date_change: (task: GanttTask, start: Date, end: Date) => void;
}