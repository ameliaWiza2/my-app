import { v4 as uuid } from 'uuid';
import { NotificationType, TaskNotification } from '../types/notification';

type NotificationListener = (notification: TaskNotification) => void;

export interface NotificationPublisherPayload {
  taskId: string;
  message: string;
  type: NotificationType;
  timestamp?: string;
}

export class NotificationService {
  private listeners = new Set<NotificationListener>();
  private history: TaskNotification[] = [];

  publish(payload: NotificationPublisherPayload): TaskNotification {
    const notification: TaskNotification = {
      id: uuid(),
      timestamp: payload.timestamp ?? new Date().toISOString(),
      ...payload
    };
    this.history.push(notification);
    this.listeners.forEach((listener) => listener(notification));
    return notification;
  }

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getHistory(): TaskNotification[] {
    return [...this.history];
  }
}

export const notificationService = new NotificationService();
