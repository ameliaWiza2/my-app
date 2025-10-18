import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {getConfig} from '../../config/env';
import {analytics, logger} from '../../instrumentation';
import {ApiError, toApiError} from '../../utils/errorHandling';

const config = getConfig();

const client: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  logger.log('network', 'Outgoing request', {
    method: request.method,
    url: request.url,
    params: request.params,
  });
  analytics.trackEvent('http_request', {
    method: request.method,
    url: request.url,
  });
  return request;
});

client.interceptors.response.use(
  response => {
    logger.log('network', 'Request success', {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  error => {
    const apiError: ApiError = toApiError(error);
    logger.error('network', 'Request failed', apiError);
    analytics.trackEvent('http_error', {
      message: apiError.message,
      status: apiError.status,
    });
    return Promise.reject(apiError);
  },
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export default client;
