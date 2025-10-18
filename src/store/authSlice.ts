import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AuthService} from '@/services/authService';
import {clearAuthTokens, loadAuthTokens, saveAuthTokens} from '@/storage/authStorage';
import type {
  AuthTokens,
  LoginPayload,
  PasswordResetPayload,
  SignUpPayload,
  User
} from '@/types';
import type {RootState} from './store';

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  passwordResetStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  passwordResetError: string | null;
  isRestoring: boolean;
  logoutStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  error: null,
  passwordResetStatus: 'idle',
  passwordResetError: null,
  isRestoring: true,
  logoutStatus: 'idle'
};

const parseError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

export const signUp = createAsyncThunk<
  {user: User; tokens: AuthTokens},
  SignUpPayload,
  {rejectValue: string}
>('auth/signUp', async (payload, {rejectWithValue}) => {
  try {
    const response = await AuthService.signUp(payload);
    await saveAuthTokens(response.tokens);
    return response;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const login = createAsyncThunk<
  {user: User; tokens: AuthTokens},
  LoginPayload,
  {rejectValue: string}
>('auth/login', async (payload, {rejectWithValue}) => {
  try {
    const response = await AuthService.login(payload);
    await saveAuthTokens(response.tokens);
    return response;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const requestPasswordReset = createAsyncThunk<
  void,
  PasswordResetPayload,
  {rejectValue: string}
>('auth/resetPassword', async (payload, {rejectWithValue}) => {
  try {
    await AuthService.requestPasswordReset(payload);
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const restoreSession = createAsyncThunk<
  {user: User; tokens: AuthTokens} | null,
  void,
  {rejectValue: string}
>('auth/restoreSession', async (_, {rejectWithValue}) => {
  try {
    const tokens = await loadAuthTokens();

    if (!tokens) {
      return null;
    }

    const user = await AuthService.fetchProfile(tokens.accessToken);
    return {user, tokens};
  } catch (error) {
    await clearAuthTokens();
    return rejectWithValue(parseError(error));
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  {rejectValue: string; state: RootState}
>('auth/logout', async (_, {rejectWithValue, getState}) => {
  try {
    const token = getState().auth.tokens?.accessToken;
    await AuthService.logout(token ?? undefined);
    await clearAuthTokens();
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearPasswordResetState(state) {
      state.passwordResetStatus = 'idle';
      state.passwordResetError = null;
    },
    resetAuthStatus(state) {
      state.status = 'idle';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signUp.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(requestPasswordReset.pending, state => {
        state.passwordResetStatus = 'loading';
        state.passwordResetError = null;
      })
      .addCase(requestPasswordReset.fulfilled, state => {
        state.passwordResetStatus = 'succeeded';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.passwordResetStatus = 'failed';
        state.passwordResetError = action.payload ?? action.error.message ?? null;
      })
      .addCase(restoreSession.pending, state => {
        state.isRestoring = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoring = false;
        state.error = null;
        if (action.payload) {
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
        } else {
          state.user = null;
          state.tokens = null;
        }
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.isRestoring = false;
        state.user = null;
        state.tokens = null;
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(logout.pending, state => {
        state.logoutStatus = 'loading';
      })
      .addCase(logout.fulfilled, state => {
        state.logoutStatus = 'succeeded';
        state.user = null;
        state.tokens = null;
        state.status = 'idle';
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      });
  }
});

export const {clearAuthError, clearPasswordResetState, resetAuthStatus} = authSlice.actions;

export default authSlice.reducer;
