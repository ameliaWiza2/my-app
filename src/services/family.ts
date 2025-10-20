import ApiClient from './ApiClient';
import { NotificationsService } from './notifications';
import { AuditService } from './audit';

export type FamilyRole = 'viewer' | 'editor' | 'admin';

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: FamilyRole;
}

export interface Family {
  id: string;
  name: string;
  members: FamilyMember[];
}

export interface Invitation {
  code: string;
  link: string;
}

export const FamilyService = {
  async getFamily(): Promise<Family> {
    return await ApiClient.get<Family>('/family');
  },

  async listMembers(): Promise<FamilyMember[]> {
    return await ApiClient.get<FamilyMember[]>('/family/members');
  },

  async inviteMember(familyId: string, email: string): Promise<Invitation> {
    const invitation = await ApiClient.post<Invitation>(`/family/${familyId}/invitations`, { email });
    await NotificationsService.notify({
      type: 'MEMBER_INVITED',
      familyId,
      memberEmail: email,
      invitationCode: invitation.code,
      link: invitation.link,
    });
    await AuditService.record({ type: 'MEMBER_INVITED', familyId, memberEmail: email, inviterId: 'self' });
    return invitation;
  },

  async acceptInvitation(code: string): Promise<Family> {
    const family = await ApiClient.post<Family>('/family/invitations/accept', { code });
    await NotificationsService.notify({ type: 'INVITATION_ACCEPTED', familyId: family.id, memberId: 'self' });
    await AuditService.record({ type: 'INVITATION_ACCEPTED', familyId: family.id, memberId: 'self' });
    return family;
  },

  async updateMemberRole(familyId: string, memberId: string, role: FamilyRole): Promise<FamilyMember> {
    const updated = await ApiClient.put<FamilyMember>(`/family/${familyId}/members/${memberId}`, { role });
    await NotificationsService.notify({ type: 'MEMBER_ROLE_UPDATED', familyId, memberId, newRole: role });
    await AuditService.record({ type: 'MEMBER_ROLE_UPDATED', familyId, memberId, previousRole: 'unknown', newRole: role });
    return updated;
  },

  async removeMember(familyId: string, memberId: string): Promise<void> {
    await ApiClient.delete(`/family/${familyId}/members/${memberId}`);
    await NotificationsService.notify({ type: 'MEMBER_REMOVED', familyId, memberId });
    await AuditService.record({ type: 'MEMBER_REMOVED', familyId, memberId });
  },
};
