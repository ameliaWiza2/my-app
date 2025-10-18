import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import familyReducer from './familySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    family: familyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
