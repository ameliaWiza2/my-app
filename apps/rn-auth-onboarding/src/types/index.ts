export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PasswordResetPayload {
  email: string;
}

export interface Family {
  id: string;
  name: string;
  members: string[];
  invitationCode: string;
}

export interface InvitationPreview {
  code: string;
  familyName: string;
  memberCount: number;
}
