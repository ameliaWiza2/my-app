import type {
  AuthTokens,
  LoginPayload,
  PasswordResetPayload,
  SignUpPayload,
  User
} from '@/types';

const usersByEmail = new Map<
  string,
  {
    id: string;
    name: string;
    email: string;
    password: string;
  }
>();

const accessTokenDirectory = new Map<string, string>();
const refreshTokenDirectory = new Map<string, string>();

const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

const buildUserView = (record: {
  id: string;
  name: string;
  email: string;
}): User => ({
  id: record.id,
  name: record.name,
  email: record.email
});

const randomString = () => Math.random().toString(36).slice(2, 10);

const mintTokens = (email: string): AuthTokens => {
  const accessToken = `access-${randomString()}-${Date.now()}`;
  const refreshToken = `refresh-${randomString()}-${Date.now()}`;

  accessTokenDirectory.set(accessToken, email);
  refreshTokenDirectory.set(refreshToken, email);

  return {accessToken, refreshToken};
};

export interface SignUpResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const AuthService = {
  async signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    await delay();

    const normalizedEmail = payload.email.trim().toLowerCase();

    if (usersByEmail.has(normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const id = `user-${randomString()}`;
    const userRecord = {
      id,
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password
    };

    usersByEmail.set(normalizedEmail, userRecord);

    const tokens = mintTokens(normalizedEmail);

    return {
      user: buildUserView(userRecord),
      tokens
    };
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    await delay();

    const normalizedEmail = payload.email.trim().toLowerCase();
    const userRecord = usersByEmail.get(normalizedEmail);

    if (!userRecord || userRecord.password !== payload.password) {
      throw new Error('Invalid email or password.');
    }

    const tokens = mintTokens(normalizedEmail);

    return {
      user: buildUserView(userRecord),
      tokens
    };
  },

  async requestPasswordReset({email}: PasswordResetPayload): Promise<void> {
    await delay();

    const normalizedEmail = email.trim().toLowerCase();
    if (!usersByEmail.has(normalizedEmail)) {
      // Silently succeed to avoid account enumeration.
      return;
    }

    return;
  },

  async fetchProfile(accessToken: string): Promise<User> {
    await delay();

    const email = accessTokenDirectory.get(accessToken);

    if (!email) {
      throw new Error('Session expired.');
    }

    const record = usersByEmail.get(email);

    if (!record) {
      throw new Error('Account not found.');
    }

    return buildUserView(record);
  },

  async logout(accessToken?: string): Promise<void> {
    await delay(200);

    if (accessToken) {
      accessTokenDirectory.delete(accessToken);
    }
  },

  /**
   * Utilities exposed for tests to reset the in-memory records.
   */
  __dangerous__reset() {
    usersByEmail.clear();
    accessTokenDirectory.clear();
    refreshTokenDirectory.clear();
  }
};

export type AuthServiceType = typeof AuthService;
