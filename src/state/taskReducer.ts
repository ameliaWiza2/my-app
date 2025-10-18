import { Task } from '../types/task';
import { Member } from '../types/member';
import { TaskNotification } from '../types/notification';

export interface ConflictState {
  taskId: string;
  message: string;
  serverTask: Task;
}

export interface TaskState {
  tasks: Task[];
  members: Member[];
  notifications: TaskNotification[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  conflict: ConflictState | null;
  pendingTaskIds: string[];
}

export const initialTaskState: TaskState = {
  tasks: [],
  members: [],
  notifications: [],
  isLoading: false,
  isSyncing: false,
  error: null,
  conflict: null,
  pendingTaskIds: []
};

interface LoadStartAction {
  type: 'tasks/load-start';
}

interface LoadSuccessAction {
  type: 'tasks/load-success';
  payload: {
    tasks: Task[];
    members: Member[];
  };
}

interface LoadErrorAction {
  type: 'tasks/load-error';
  payload: string;
}

interface SyncTasksAction {
  type: 'tasks/sync';
  payload: Task[];
}

interface OptimisticUpsertAction {
  type: 'tasks/optimistic-upsert';
  payload: {
    task: Task;
    previous?: Task | null;
  };
}

interface MutationCommitAction {
  type: 'tasks/mutation-commit';
  payload: Task;
}

interface MutationRollbackAction {
  type: 'tasks/mutation-rollback';
  payload: {
    taskId: string;
    previous: Task | null;
    message: string;
  };
}

interface ConflictDetectedAction {
  type: 'tasks/conflict-detected';
  payload: {
    task: Task;
    message: string;
  };
}

interface AddNotificationAction {
  type: 'tasks/add-notification';
  payload: TaskNotification;
}

interface ClearConflictAction {
  type: 'tasks/clear-conflict';
}

interface SetSyncingAction {
  type: 'tasks/set-syncing';
  payload: boolean;
}

export type TaskAction =
  | LoadStartAction
  | LoadSuccessAction
  | LoadErrorAction
  | SyncTasksAction
  | OptimisticUpsertAction
  | MutationCommitAction
  | MutationRollbackAction
  | ConflictDetectedAction
  | AddNotificationAction
  | ClearConflictAction
  | SetSyncingAction;

const upsert = (tasks: Task[], task: Task): Task[] => {
  const index = tasks.findIndex((item) => item.id === task.id);
  if (index === -1) {
    return [...tasks, task];
  }
  const next = [...tasks];
  next[index] = task;
  return next;
};

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'tasks/load-start':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'tasks/load-success':
      return {
        ...state,
        tasks: action.payload.tasks,
        members: action.payload.members,
        isLoading: false,
        error: null
      };
    case 'tasks/load-error':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'tasks/sync':
      return {
        ...state,
        tasks: action.payload,
        isSyncing: false
      };
    case 'tasks/set-syncing':
      return {
        ...state,
        isSyncing: action.payload
      };
    case 'tasks/optimistic-upsert': {
      const pendingTaskIds = state.pendingTaskIds.includes(action.payload.task.id)
        ? state.pendingTaskIds
        : [...state.pendingTaskIds, action.payload.task.id];
      return {
        ...state,
        tasks: upsert(state.tasks, action.payload.task),
        pendingTaskIds,
        error: null
      };
    }
    case 'tasks/mutation-commit':
      return {
        ...state,
        tasks: upsert(state.tasks, action.payload),
        pendingTaskIds: state.pendingTaskIds.filter((id) => id !== action.payload.id),
        error: null,
        conflict: state.conflict?.taskId === action.payload.id ? null : state.conflict
      };
    case 'tasks/mutation-rollback':
      return {
        ...state,
        tasks: action.payload.previous
          ? upsert(state.tasks, action.payload.previous)
          : state.tasks.filter((task) => task.id !== action.payload.taskId),
        pendingTaskIds: state.pendingTaskIds.filter((id) => id !== action.payload.taskId),
        error: action.payload.message
      };
    case 'tasks/conflict-detected':
      return {
        ...state,
        tasks: upsert(state.tasks, action.payload.task),
        pendingTaskIds: state.pendingTaskIds.filter((id) => id !== action.payload.task.id),
        conflict: {
          taskId: action.payload.task.id,
          serverTask: action.payload.task,
          message: action.payload.message
        }
      };
    case 'tasks/add-notification': {
      const nextNotifications = [...state.notifications, action.payload];
      const limited = nextNotifications.slice(-15);
      return {
        ...state,
        notifications: limited
      };
    }
    case 'tasks/clear-conflict':
      return {
        ...state,
        conflict: null
      };
    default:
      return state;
  }
};
