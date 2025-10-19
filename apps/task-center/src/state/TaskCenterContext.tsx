import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';
import type { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import { Task, TaskDraft, TaskMutation, TaskStatus, TASK_STATUS_ORDER } from '../types/task';
import { Member } from '../types/member';
import { TaskNotification } from '../types/notification';
import { taskReducer, initialTaskState, TaskState } from './taskReducer';
import { TaskService, TaskConflictError, taskService } from '../services/taskService';
import { NotificationService, notificationService } from '../services/notificationService';

export interface TaskCenterServices {
  taskService?: TaskService;
  notificationService?: NotificationService;
}

export interface TaskCenterContextValue {
  state: TaskState;
  members: Member[];
  tasksByStatus: Record<TaskStatus, Task[]>;
  notifications: TaskNotification[];
  currentUserId: string;
  createTask(draft: TaskDraft): Promise<void>;
  editTask(taskId: string, draft: TaskDraft): Promise<void>;
  transitionTask(taskId: string, status: TaskStatus): Promise<void>;
  claimTask(taskId: string, memberId: string): Promise<void>;
  unclaimTask(taskId: string): Promise<void>;
  refresh(): Promise<void>;
  clearConflict(): void;
}

const TaskCenterContext = createContext<TaskCenterContextValue | undefined>(undefined);

export const CURRENT_USER_ID = 'member-self';

interface TaskCenterProviderProps {
  children: ReactNode;
  services?: TaskCenterServices;
}

export const TaskCenterProvider = ({ children, services }: TaskCenterProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const stateRef = useRef(state);
  const service = services?.taskService ?? taskService;
  const notifier = services?.notificationService ?? notificationService;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const refresh = useCallback(async () => {
    dispatch({ type: 'tasks/load-start' });
    try {
      const [tasks, members] = await Promise.all([
        service.fetchTasks(),
        service.fetchMembers()
      ]);
      dispatch({
        type: 'tasks/load-success',
        payload: { tasks, members }
      });
    } catch (error) {
      dispatch({
        type: 'tasks/load-error',
        payload: (error as Error).message
      });
    }
  }, [service]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = service.subscribe((tasks) => {
      dispatch({ type: 'tasks/sync', payload: tasks });
    });

    const pollInterval = setInterval(() => {
      dispatch({ type: 'tasks/set-syncing', payload: true });
      service
        .fetchTasks()
        .then((tasks) => dispatch({ type: 'tasks/sync', payload: tasks }))
        .catch((error: unknown) =>
          dispatch({ type: 'tasks/load-error', payload: (error as Error).message })
        );
    }, 20000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [service]);

  useEffect(() => {
    const history = notifier.getHistory();
    history.forEach((notification) =>
      dispatch({ type: 'tasks/add-notification', payload: notification })
    );
    const unsubscribe = notifier.subscribe((notification) =>
      dispatch({ type: 'tasks/add-notification', payload: notification })
    );
    return unsubscribe;
  }, [notifier]);

  const createTask = useCallback(
    async (draft: TaskDraft) => {
      const id = uuid();
      const now = new Date().toISOString();
      const optimisticTask: Task = {
        id,
        title: draft.title,
        description: draft.description,
        status: draft.status ?? 'todo',
        assigneeId: draft.assigneeId,
        dueDate: draft.dueDate,
        reminder: draft.reminder,
        priority: draft.priority,
        createdAt: now,
        updatedAt: now,
        version: 0
      };
      dispatch({
        type: 'tasks/optimistic-upsert',
        payload: { task: optimisticTask }
      });
      try {
        const saved = await service.createTask({ id, draft });
        dispatch({ type: 'tasks/mutation-commit', payload: saved });
      } catch (error) {
        dispatch({
          type: 'tasks/mutation-rollback',
          payload: {
            taskId: id,
            previous: null,
            message: (error as Error).message
          }
        });
      }
    },
    [service]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: TaskMutation) => {
      const current = stateRef.current.tasks.find((task) => task.id === taskId);
      if (!current) {
        return;
      }
      const optimisticTask: Task = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
        version: current.version + 1
      };
      dispatch({
        type: 'tasks/optimistic-upsert',
        payload: { task: optimisticTask, previous: current }
      });
      try {
        const saved = await service.updateTask({
          taskId,
          updates,
          expectedVersion: current.version
        });
        dispatch({ type: 'tasks/mutation-commit', payload: saved });
      } catch (error) {
        if (error instanceof TaskConflictError) {
          dispatch({
            type: 'tasks/conflict-detected',
            payload: {
              task: error.task,
              message: error.message
            }
          });
        } else {
          dispatch({
            type: 'tasks/mutation-rollback',
            payload: {
              taskId,
              previous: current,
              message: (error as Error).message
            }
          });
        }
      }
    },
    [service]
  );

  const editTask = useCallback(
    async (taskId: string, draft: TaskDraft) => {
      await updateTask(taskId, {
        title: draft.title,
        description: draft.description,
        assigneeId: draft.assigneeId,
        dueDate: draft.dueDate,
        reminder: draft.reminder,
        priority: draft.priority,
        status: draft.status ?? stateRef.current.tasks.find((t) => t.id === taskId)?.status
      });
    },
    [updateTask]
  );

  const transitionTask = useCallback(
    async (taskId: string, status: TaskStatus) => {
      await updateTask(taskId, { status });
    },
    [updateTask]
  );

  const claimTask = useCallback(
    async (taskId: string, memberId: string) => {
      await updateTask(taskId, { assigneeId: memberId });
    },
    [updateTask]
  );

  const unclaimTask = useCallback(
    async (taskId: string) => {
      await updateTask(taskId, { assigneeId: null });
    },
    [updateTask]
  );

  const clearConflict = useCallback(() => {
    dispatch({ type: 'tasks/clear-conflict' });
  }, []);

  const tasksByStatus = useMemo(() => {
    return TASK_STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>((acc, status) => {
      acc[status] = state.tasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.title.localeCompare(b.title));
      return acc;
    }, {
      todo: [],
      in_progress: [],
      completed: []
    });
  }, [state.tasks]);

  const contextValue = useMemo<TaskCenterContextValue>(
    () => ({
      state,
      members: state.members,
      tasksByStatus,
      notifications: state.notifications,
      currentUserId: CURRENT_USER_ID,
      createTask,
      editTask,
      transitionTask,
      claimTask,
      unclaimTask,
      refresh,
      clearConflict
    }),
    [
      state,
      tasksByStatus,
      createTask,
      editTask,
      transitionTask,
      claimTask,
      unclaimTask,
      refresh,
      clearConflict
    ]
  );

  return (
    <TaskCenterContext.Provider value={contextValue}>
      {children}
    </TaskCenterContext.Provider>
  );
};

export const useTaskCenter = (): TaskCenterContextValue => {
  const context = useContext(TaskCenterContext);
  if (!context) {
    throw new Error('useTaskCenter must be used within a TaskCenterProvider');
  }
  return context;
};
