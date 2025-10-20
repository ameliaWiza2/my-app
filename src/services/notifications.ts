export type NotificationPayload = {
  type: 'EDD_CHANGED';
  familyId?: string;
  previousEDD?: string | null;
  newEDD?: string | null;
};

class NotificationsServiceClass {
  lastNotification: NotificationPayload | null = null;

  async notify(payload: NotificationPayload): Promise<void> {
    // In a real app, this would call a backend push/notification service
    this.lastNotification = payload;
  }

  reset() {
    this.lastNotification = null;
  }
}

export const NotificationsService = new NotificationsServiceClass();
