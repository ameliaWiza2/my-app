export type NotificationType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'claimed'
  | 'unclaimed'
  | 'reminder';

export interface TaskNotification {
  id: string;
  taskId: string;
  message: string;
  type: NotificationType;
  timestamp: string;
}
