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

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface TokenExchangeRequest {
  code: string;
  redirect_uri: string;
}

export interface TokenExchangeResponse {
  access_token: string;
  user: User;
}

export interface AuthError {
  error: string;
  error_description?: string;
  message?: string;
}

// Profile types
export interface ProfileResponse {
  user: User;
}

export interface ProfileError {
  error: string;
  message?: string;
}

export interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  error: ProfileError | null;
  lastFetched: number | null;
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