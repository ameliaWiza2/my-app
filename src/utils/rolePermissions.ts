export type FamilyRole = 'Pregnant' | 'Husband' | 'Other';

export const canEditPregnancy = (role: FamilyRole): boolean => role === 'Pregnant';

export const canCommentOnPregnancy = (role: FamilyRole): boolean => role === 'Pregnant' || role === 'Husband' || role === 'Other';

export const getRoleBadgeColor = (role: FamilyRole): string => {
  switch (role) {
    case 'Pregnant':
      return '#8e44ad';
    case 'Husband':
      return '#2980b9';
    case 'Other':
      return '#7f8c8d';
    default:
      return '#7f8c8d';
  }
};
