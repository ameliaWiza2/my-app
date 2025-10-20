import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import familyReducer from './familySlice';
import onboardingReducer from './onboardingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    family: familyReducer,
    onboarding: onboardingReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
