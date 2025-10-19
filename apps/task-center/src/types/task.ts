export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  dueDate: string | null;
  reminder: string | null;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface TaskDraft {
  title: string;
  description: string;
  assigneeId: string | null;
  dueDate: string | null;
  reminder: string | null;
  priority: TaskPriority;
  status?: TaskStatus;
}

export type TaskMutation = Partial<
  Omit<Task, 'id' | 'createdAt' | 'version'>
> & {
  status?: TaskStatus;
  assigneeId?: string | null;
  dueDate?: string | null;
  reminder?: string | null;
  priority?: TaskPriority;
};

export interface TaskUpdateRequest {
  taskId: string;
  updates: TaskMutation;
  expectedVersion: number;
}

export interface TaskCreateRequest {
  id: string;
  draft: TaskDraft;
}

export const TASK_STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'completed'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed'
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};
