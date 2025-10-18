import {baseApi} from './baseApi';
import {UserProfile} from '../slices/userSlice';

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<UserProfile, void>({
      query: () => ({
        url: '/user/profile',
        method: 'get',
      }),
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: body => ({
        url: '/user/profile',
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {useGetCurrentUserQuery, useLazyGetCurrentUserQuery, useUpdateUserProfileMutation} = userApi;
