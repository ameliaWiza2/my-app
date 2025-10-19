import type {OnboardingProfile, User} from '@/types';

/**
 * Profile service stub to mimic backend API.
 * TODO: Replace with real API integration when backend is available.
 */

type ProfileRecord = OnboardingProfile & { userId: string };

const profilesByUserId = new Map<string, ProfileRecord>();
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export interface UpdateProfilePayload extends OnboardingProfile {}

export interface ProfileResponse {
  userId: string;
  profile: OnboardingProfile;
}

export const ProfileService = {
  async updateProfile(user: User, payload: UpdateProfilePayload): Promise<ProfileResponse> {
    await delay();
    const record: ProfileRecord = {
      userId: user.id,
      role: payload.role ?? null,
      pregnancyStatus: payload.pregnancyStatus ?? null,
      lmpDate: payload.lmpDate ?? null,
      eddDate: payload.eddDate ?? null,
      eddSource: payload.eddSource ?? null,
      partnerLink: payload.partnerLink ?? null
    };
    profilesByUserId.set(user.id, record);
    return { userId: user.id, profile: record };
  },

  async getProfile(user: User): Promise<ProfileResponse | null> {
    await delay(150);
    const existing = profilesByUserId.get(user.id);
    if (!existing) return null;
    return { userId: user.id, profile: existing };
  },

  __dangerous__reset() {
    profilesByUserId.clear();
  }
};

export type ProfileServiceType = typeof ProfileService;
