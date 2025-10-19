import { v4 as uuid } from 'uuid';
import { Member } from '../types/member';
import {
  Task,
  TaskCreateRequest,
  TaskMutation,
  TaskStatus,
  TaskUpdateRequest,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS
} from '../types/task';
import {
  NotificationService,
  notificationService,
  NotificationPublisherPayload
} from './notificationService';

export class TaskConflictError extends Error {
  constructor(public readonly task: Task, message = 'Task update conflict') {
    super(message);
    this.name = 'TaskConflictError';
  }
}

type TaskListener = (tasks: Task[]) => void;

export interface TaskServiceOptions {
  notifier?: NotificationService;
  latency?: number;
  seed?: {
    tasks?: Task[];
    members?: Member[];
  };
}

const DEFAULT_MEMBERS: Member[] = [
  { id: 'member-self', name: 'You', avatarColor: '#5667ff' },
  { id: 'member-1', name: 'Alex', avatarColor: '#ff9f43' },
  { id: 'member-2', name: 'Taylor', avatarColor: '#10b981' },
  { id: 'member-3', name: 'Morgan', avatarColor: '#f43f5e' }
];

const nowISO = () => new Date().toISOString();

const createDefaultTasks = (members: Member[]): Task[] => {
  const findMember = (index: number) => members[index]?.id ?? null;
  const base = new Date();
  const isoFromOffset = (days: number, hours = 0) => {
    const next = new Date(base);
    next.setDate(base.getDate() + days);
    next.setHours(9 + hours, 0, 0, 0);
    return next.toISOString();
  };
  return [
    {
      id: uuid(),
      title: 'Grocery shopping',
      description: 'Pick up fresh produce and staples for the week.',
      status: 'todo',
      assigneeId: findMember(1),
      dueDate: isoFromOffset(2),
      reminder: isoFromOffset(1, 18),
      priority: 'medium',
      createdAt: nowISO(),
      updatedAt: nowISO(),
      version: 1
    },
    {
      id: uuid(),
      title: 'Laundry rotation',
      description: 'Wash and fold shared linens and towels.',
      status: 'in_progress',
      assigneeId: findMember(2),
      dueDate: isoFromOffset(1),
      reminder: null,
      priority: 'high',
      createdAt: nowISO(),
      updatedAt: nowISO(),
      version: 2
    },
    {
      id: uuid(),
      title: 'Homework review',
      description: 'Help younger siblings with math homework review.',
      status: 'todo',
      assigneeId: null,
      dueDate: isoFromOffset(3, 17),
      reminder: isoFromOffset(2, 18),
      priority: 'medium',
      createdAt: nowISO(),
      updatedAt: nowISO(),
      version: 1
    },
    {
      id: uuid(),
      title: 'Meal prep Sunday',
      description: 'Prepare meals for the week; focus on healthy options.',
      status: 'completed',
      assigneeId: findMember(3),
      dueDate: isoFromOffset(-1),
      reminder: null,
      priority: 'low',
      createdAt: nowISO(),
      updatedAt: nowISO(),
      version: 3
    }
  ];
};

export class TaskService {
  private readonly notifier: NotificationService;
  private readonly latency: number;
  private tasks: Task[];
  private members: Member[];
  private listeners = new Set<TaskListener>();

  constructor(options?: TaskServiceOptions) {
    this.notifier = options?.notifier ?? notificationService;
    this.latency = options?.latency ?? 160;
    this.members = options?.seed?.members
      ? options.seed.members.map((member) => ({ ...member }))
      : DEFAULT_MEMBERS.map((member) => ({ ...member }));
    this.tasks = options?.seed?.tasks
      ? options.seed.tasks.map((task) => ({ ...task }))
      : createDefaultTasks(this.members);
  }

  async fetchTasks(): Promise<Task[]> {
    return this.delayed(this.cloneTasks());
  }

  async fetchMembers(): Promise<Member[]> {
    return this.delayed(this.members.map((member) => ({ ...member })));
  }

  async createTask(request: TaskCreateRequest): Promise<Task> {
    const created = this.convertDraftToTask(request);
    this.tasks = [...this.tasks, created];
    this.emitTasks();
    this.publishChange(created, {
      taskId: created.id,
      type: 'created',
      message: `Task "${created.title}" created with priority ${
        TASK_PRIORITY_LABELS[created.priority]
      }`
    });
    return this.delayed({ ...created });
  }

  async updateTask(request: TaskUpdateRequest): Promise<Task> {
    const index = this.tasks.findIndex((task) => task.id === request.taskId);
    if (index < 0) {
      throw new Error('Task not found');
    }
    const current = this.tasks[index];
    if (request.expectedVersion < current.version) {
      throw new TaskConflictError({ ...current });
    }

    const updated = this.mergeTask(current, request.updates);
    this.tasks[index] = updated;
    this.emitTasks();
    this.publishChange(updated, this.buildNotificationPayload(current, updated));
    return this.delayed({ ...updated });
  }

  subscribe(listener: TaskListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getMembersSnapshot(): Member[] {
    return this.members.map((member) => ({ ...member }));
  }

  getTasksSnapshot(): Task[] {
    return this.cloneTasks();
  }

  private convertDraftToTask(request: TaskCreateRequest): Task {
    const now = nowISO();
    const status: TaskStatus = request.draft.status ?? 'todo';
    return {
      id: request.id,
      title: request.draft.title,
      description: request.draft.description,
      status,
      assigneeId: request.draft.assigneeId,
      dueDate: request.draft.dueDate,
      reminder: request.draft.reminder,
      priority: request.draft.priority,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
  }

  private mergeTask(current: Task, updates: TaskMutation): Task {
    const now = nowISO();
    return {
      ...current,
      ...updates,
      updatedAt: now,
      version: current.version + 1
    };
  }

  private publishChange(task: Task, payload: NotificationPublisherPayload) {
    this.notifier.publish({ ...payload, taskId: task.id });
  }

  private buildNotificationPayload(oldTask: Task, newTask: Task): NotificationPublisherPayload {
    if (oldTask.status !== newTask.status) {
      return {
        taskId: newTask.id,
        type: 'status_changed',
        message: `Task "${newTask.title}" moved to ${
          TASK_STATUS_LABELS[newTask.status]
        }`
      };
    }

    if (oldTask.assigneeId !== newTask.assigneeId) {
      const memberName = this.resolveMemberName(newTask.assigneeId);
      return {
        taskId: newTask.id,
        type: newTask.assigneeId ? 'claimed' : 'unclaimed',
        message: newTask.assigneeId
          ? `Task "${newTask.title}" claimed by ${memberName}`
          : `Task "${newTask.title}" is now unassigned`
      };
    }

    return {
      taskId: newTask.id,
      type: 'updated',
      message: `Task "${newTask.title}" updated`
    };
  }

  private resolveMemberName(memberId: string | null): string {
    if (!memberId) {
      return 'Unassigned';
    }
    return (
      this.members.find((member) => member.id === memberId)?.name ?? 'Unknown member'
    );
  }

  private cloneTasks(): Task[] {
    return this.tasks.map((task) => ({ ...task }));
  }

  private emitTasks() {
    const snapshot = this.cloneTasks();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private delayed<T>(value: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), this.latency);
    });
  }
}

export const taskService = new TaskService();
