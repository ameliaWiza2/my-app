import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

type UserState = {
  profile: UserProfile | null;
};

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = {...state.profile, ...action.payload};
      }
    },
    clearUserProfile: state => {
      state.profile = null;
    },
  },
});

export const {setUserProfile, updateUserProfile, clearUserProfile} = userSlice.actions;
export default userSlice.reducer;
