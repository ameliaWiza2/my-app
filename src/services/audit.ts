export type AuditEvent =
  | { type: 'MEMBER_INVITED'; familyId: string; memberEmail: string; inviterId: string }
  | { type: 'INVITATION_ACCEPTED'; familyId: string; memberId: string }
  | { type: 'MEMBER_ROLE_UPDATED'; familyId: string; memberId: string; previousRole: string; newRole: string }
  | { type: 'MEMBER_REMOVED'; familyId: string; memberId: string; removedById?: string };

class AuditServiceClass {
  private events: AuditEvent[] = [];

  async record(event: AuditEvent): Promise<void> {
    // In a real app this would POST to an audit log service
    this.events.push(event);
    // eslint-disable-next-line no-console
    console.log('[audit]', event.type, event);
  }

  getEvents(): AuditEvent[] {
    return [...this.events];
  }

  reset() {
    this.events = [];
  }
}

export const AuditService = new AuditServiceClass();
