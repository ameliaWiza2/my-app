import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export type AuthTokens = {
  token: string;
  refreshToken?: string | null;
};

export type AuthState = {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
};

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  onboardingComplete: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<AuthTokens>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.isAuthenticated = true;
    },
    signOut: state => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    completeOnboarding: state => {
      state.onboardingComplete = true;
    },
    resetAuthState: () => initialState,
  },
});

export const {signIn, signOut, completeOnboarding, resetAuthState} = authSlice.actions;
export default authSlice.reducer;
