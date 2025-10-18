import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '../../services/api/baseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: ['User'],
  endpoints: () => ({}),
});
