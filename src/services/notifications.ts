export type NotificationPayload =
  | {
      type: 'EDD_CHANGED';
      familyId?: string;
      previousEDD?: string | null;
      newEDD?: string | null;
    }
  | {
      type: 'MEMBER_INVITED';
      familyId: string;
      memberEmail: string;
      invitationCode: string;
      link: string;
    }
  | { type: 'INVITATION_ACCEPTED'; familyId: string; memberId: string }
  | {
      type: 'MEMBER_ROLE_UPDATED';
      familyId: string;
      memberId: string;
      newRole: 'viewer' | 'editor' | 'admin';
    }
  | { type: 'MEMBER_REMOVED'; familyId: string; memberId: string };

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
