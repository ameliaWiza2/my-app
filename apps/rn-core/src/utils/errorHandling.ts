import {AxiosError} from 'axios';

type ErrorData = {
  message?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  status?: number;
  data?: ErrorData | unknown;

  constructor(message: string, status?: number, data?: ErrorData | unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError<ErrorData>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const message = data?.message ?? axiosError.message ?? 'Network error';
    return new ApiError(message, status, data);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('Unknown error');
};
