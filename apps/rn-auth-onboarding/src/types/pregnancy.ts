export type Role = 'Pregnant' | 'Husband' | 'Other';

export type PregnancyStatus = 'TryingToConceive' | 'AlreadyPregnant';

export type EddSource = 'calculated' | 'manual';

export interface OnboardingProfile {
  role: Role | null;
  pregnancyStatus: PregnancyStatus | null;
  lmpDate: string | null; // YYYY-MM-DD in UTC
  eddDate: string | null; // YYYY-MM-DD in UTC
  eddSource: EddSource | null;
  partnerLink?: string | null; // optional invite code or partner identifier
}
