import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {EddSource, OnboardingProfile, PregnancyStatus, Role} from '@/types';
import {loadOnboardingProfile, saveOnboardingProfile, clearOnboardingProfile} from '@/storage/onboardingStorage';
import type {RootState} from './store';
import {ProfileService} from '@/services/profileService';
import {logout} from './authSlice';

export interface OnboardingState extends OnboardingProfile {
  hydrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  persistStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OnboardingState = {
  role: null,
  pregnancyStatus: null,
  lmpDate: null,
  eddDate: null,
  eddSource: null,
  partnerLink: null,
  hydrationStatus: 'idle',
  persistStatus: 'idle',
  error: null
};

export const hydrateOnboarding = createAsyncThunk<OnboardingProfile | null, void, {rejectValue: string}>(
  'onboarding/hydrate',
  async (_, {rejectWithValue}) => {
    try {
      const profile = await loadOnboardingProfile();
      return profile;
    } catch (e) {
      return rejectWithValue('Failed to load onboarding profile.');
    }
  }
);

export const persistOnboarding = createAsyncThunk<OnboardingProfile, void, {state: RootState; rejectValue: string}>(
  'onboarding/persist',
  async (_, {getState, rejectWithValue}) => {
    try {
      const state = getState().onboarding;
      const profile: OnboardingProfile = {
        role: state.role,
        pregnancyStatus: state.pregnancyStatus,
        lmpDate: state.lmpDate,
        eddDate: state.eddDate,
        eddSource: state.eddSource,
        partnerLink: state.partnerLink ?? null
      };
      await saveOnboardingProfile(profile);

      const user = getState().auth.user;
      if (user) {
        // Best-effort profile sync; if backend pending, this is a no-op stub.
        await ProfileService.updateProfile(user, profile);
      }

      return profile;
    } catch (e) {
      return rejectWithValue('Failed to persist onboarding profile.');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
    },
    setPregnancyStatus(state, action: PayloadAction<PregnancyStatus>) {
      state.pregnancyStatus = action.payload;
    },
    setLmpDate(state, action: PayloadAction<string | null>) {
      state.lmpDate = action.payload;
    },
    setEddDate(state, action: PayloadAction<{date: string | null; source: EddSource | null}>) {
      state.eddDate = action.payload.date;
      state.eddSource = action.payload.source;
    },
    setPartnerLink(state, action: PayloadAction<string | null>) {
      state.partnerLink = action.payload;
    },
    resetOnboarding(state) {
      state.role = null;
      state.pregnancyStatus = null;
      state.lmpDate = null;
      state.eddDate = null;
      state.eddSource = null;
      state.partnerLink = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateOnboarding.pending, state => {
        state.hydrationStatus = 'loading';
        state.error = null;
      })
      .addCase(hydrateOnboarding.fulfilled, (state, action) => {
        state.hydrationStatus = 'succeeded';
        if (action.payload) {
          state.role = action.payload.role;
          state.pregnancyStatus = action.payload.pregnancyStatus;
          state.lmpDate = action.payload.lmpDate;
          state.eddDate = action.payload.eddDate;
          state.eddSource = action.payload.eddSource;
          state.partnerLink = action.payload.partnerLink ?? null;
        }
      })
      .addCase(hydrateOnboarding.rejected, (state, action) => {
        state.hydrationStatus = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(persistOnboarding.pending, state => {
        state.persistStatus = 'loading';
        state.error = null;
      })
      .addCase(persistOnboarding.fulfilled, state => {
        state.persistStatus = 'succeeded';
      })
      .addCase(persistOnboarding.rejected, (state, action) => {
        state.persistStatus = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(logout.fulfilled, state => {
        state.role = null;
        state.pregnancyStatus = null;
        state.lmpDate = null;
        state.eddDate = null;
        state.eddSource = null;
        state.partnerLink = null;
        state.hydrationStatus = 'idle';
        state.persistStatus = 'idle';
        state.error = null;
      });
  }
});

export const { setRole, setPregnancyStatus, setLmpDate, setEddDate, setPartnerLink, resetOnboarding } = onboardingSlice.actions;

export default onboardingSlice.reducer;
