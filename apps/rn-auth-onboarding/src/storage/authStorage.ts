import * as Keychain from 'react-native-keychain';
import type {AuthTokens} from '@/types';

const AUTH_SERVICE = 'family-onboarding-auth';

export const saveAuthTokens = async (tokens: AuthTokens): Promise<void> => {
  await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
    service: AUTH_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
  });
};

export const loadAuthTokens = async (): Promise<AuthTokens | null> => {
  const credentials = await Keychain.getGenericPassword({service: AUTH_SERVICE});

  if (!credentials) {
    return null;
  }

  try {
    return JSON.parse(credentials.password) as AuthTokens;
  } catch (error) {
    await Keychain.resetGenericPassword({service: AUTH_SERVICE});
    return null;
  }
};

export const clearAuthTokens = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: AUTH_SERVICE});
};
