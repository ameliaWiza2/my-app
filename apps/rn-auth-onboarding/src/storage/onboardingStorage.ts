import * as Keychain from 'react-native-keychain';
import type {OnboardingProfile} from '@/types';

const ONBOARDING_SERVICE = 'family-onboarding-profile';

export const saveOnboardingProfile = async (
  profile: OnboardingProfile
): Promise<void> => {
  await Keychain.setGenericPassword('onboarding', JSON.stringify(profile), {
    service: ONBOARDING_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
  });
};

export const loadOnboardingProfile = async (): Promise<OnboardingProfile | null> => {
  const credentials = await Keychain.getGenericPassword({service: ONBOARDING_SERVICE});
  if (!credentials) return null;
  try {
    return JSON.parse(credentials.password) as OnboardingProfile;
  } catch (e) {
    await Keychain.resetGenericPassword({service: ONBOARDING_SERVICE});
    return null;
  }
};

export const clearOnboardingProfile = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: ONBOARDING_SERVICE});
};
