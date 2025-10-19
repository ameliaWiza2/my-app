import {BaseQueryFn} from '@reduxjs/toolkit/query';
import {AxiosRequestConfig} from 'axios';
import {getConfig} from '../../config/env';
import {ApiError, toApiError} from '../../utils/errorHandling';
import apiClient from './apiClient';
import {resolveMock} from './mockData';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type AxiosBaseQueryArgs = {
  url: string;
  method?: HttpMethod;
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};

const {USE_MOCKS} = getConfig();

export const axiosBaseQuery: BaseQueryFn<AxiosBaseQueryArgs, unknown, ApiError> = async ({
  url,
  method = 'get',
  data,
  params,
  headers,
}) => {
  if (USE_MOCKS) {
    const mock = resolveMock(method, url, data);
    if (mock !== undefined) {
      return {data: mock};
    }
  }

  try {
    const result = await apiClient.request({
      url,
      method,
      data,
      params,
      headers,
    });
    return {data: result.data};
  } catch (error) {
    return {error: toApiError(error)};
  }
};
