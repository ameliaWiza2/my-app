import type { FamilyRole } from '../../services/family';

export const canView = (_role: FamilyRole) => true;
export const canEdit = (role: FamilyRole) => role === 'editor' || role === 'admin';
export const canManage = (role: FamilyRole) => role === 'admin';

export const roleLabel = (role: FamilyRole): string => {
  switch (role) {
    case 'viewer':
      return 'Viewer';
    case 'editor':
      return 'Editor';
    case 'admin':
      return 'Admin';
  }
};
