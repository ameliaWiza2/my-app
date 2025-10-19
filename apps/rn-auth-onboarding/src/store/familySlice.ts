import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {FamilyService} from '@/services/familyService';
import type {Family, InvitationPreview} from '@/types';
import type {RootState} from './store';
import {logout} from './authSlice';

export interface FamilyState {
  family: Family | null;
  invitationPreview: InvitationPreview | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  joinStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  previewStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  hydrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  joinError: string | null;
  previewError: string | null;
  hydrationError: string | null;
  onboardingComplete: boolean;
}

const initialState: FamilyState = {
  family: null,
  invitationPreview: null,
  createStatus: 'idle',
  joinStatus: 'idle',
  previewStatus: 'idle',
  hydrationStatus: 'idle',
  error: null,
  joinError: null,
  previewError: null,
  hydrationError: null,
  onboardingComplete: false
};

const parseError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unable to complete the request. Please try again.';
};

export const createFamily = createAsyncThunk<
  Family,
  {name: string},
  {rejectValue: string; state: RootState}
>('family/create', async ({name}, {getState, rejectWithValue}) => {
  try {
    const user = getState().auth.user;

    if (!user) {
      return rejectWithValue('You need to be signed in to create a family.');
    }

    const family = await FamilyService.createFamily({name, ownerId: user.id});
    return family;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const previewInvitation = createAsyncThunk<
  InvitationPreview,
  {code: string},
  {rejectValue: string}
>('family/previewInvitation', async ({code}, {rejectWithValue}) => {
  try {
    const preview = await FamilyService.previewInvitation(code);
    return preview;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const confirmJoinFamily = createAsyncThunk<
  Family,
  {code: string},
  {rejectValue: string; state: RootState}
>('family/confirmJoin', async ({code}, {getState, rejectWithValue}) => {
  try {
    const user = getState().auth.user;

    if (!user) {
      return rejectWithValue('You need to be signed in to join a family.');
    }

    const family = await FamilyService.joinFamily({code, userId: user.id});
    return family;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const hydrateFamily = createAsyncThunk<
  Family | null,
  {userId: string},
  {rejectValue: string}
>('family/hydrate', async ({userId}, {rejectWithValue}) => {
  try {
    const family = await FamilyService.getFamilyForUser(userId);
    return family;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    resetFamilyFlow(state) {
      state.invitationPreview = null;
      state.previewStatus = 'idle';
      state.joinStatus = 'idle';
      state.createStatus = 'idle';
      state.hydrationStatus = 'idle';
      state.error = null;
      state.joinError = null;
      state.previewError = null;
      state.hydrationError = null;
      state.onboardingComplete = false;
    },
    clearCreateState(state) {
      state.createStatus = 'idle';
      state.error = null;
    },
    clearJoinState(state) {
      state.joinStatus = 'idle';
      state.previewStatus = 'idle';
      state.joinError = null;
      state.previewError = null;
      state.invitationPreview = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateFamily.pending, state => {
        state.hydrationStatus = 'loading';
        state.hydrationError = null;
      })
      .addCase(hydrateFamily.fulfilled, (state, action) => {
        state.hydrationStatus = 'succeeded';
        state.family = action.payload;
        state.onboardingComplete = Boolean(action.payload);
      })
      .addCase(hydrateFamily.rejected, (state, action) => {
        state.hydrationStatus = 'failed';
        state.hydrationError = action.payload ?? action.error.message ?? null;
      })
      .addCase(createFamily.pending, state => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createFamily.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.family = action.payload;
        state.onboardingComplete = true;
      })
      .addCase(createFamily.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(previewInvitation.pending, state => {
        state.previewStatus = 'loading';
        state.invitationPreview = null;
        state.previewError = null;
      })
      .addCase(previewInvitation.fulfilled, (state, action) => {
        state.previewStatus = 'succeeded';
        state.invitationPreview = action.payload;
      })
      .addCase(previewInvitation.rejected, (state, action) => {
        state.previewStatus = 'failed';
        state.invitationPreview = null;
        state.previewError = action.payload ?? action.error.message ?? null;
      })
      .addCase(confirmJoinFamily.pending, state => {
        state.joinStatus = 'loading';
        state.joinError = null;
      })
      .addCase(confirmJoinFamily.fulfilled, (state, action) => {
        state.joinStatus = 'succeeded';
        state.family = action.payload;
        state.onboardingComplete = true;
      })
      .addCase(confirmJoinFamily.rejected, (state, action) => {
        state.joinStatus = 'failed';
        state.joinError = action.payload ?? action.error.message ?? null;
      })
      .addCase(logout.fulfilled, state => {
        state.family = null;
        state.invitationPreview = null;
        state.onboardingComplete = false;
        state.createStatus = 'idle';
        state.joinStatus = 'idle';
        state.previewStatus = 'idle';
        state.hydrationStatus = 'idle';
        state.error = null;
        state.joinError = null;
        state.previewError = null;
        state.hydrationError = null;
      });
  }
});

export const {resetFamilyFlow, clearCreateState, clearJoinState} = familySlice.actions;

export default familySlice.reducer;
