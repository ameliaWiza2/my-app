import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SecurityConfig, validateURL } from '../config/security';
import SecureStorage from './SecureStorage';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string) {
    if (!validateURL(baseURL)) {
      throw new Error('Invalid or insecure API base URL');
    }

    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: SecurityConfig.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async config => {
        const token = await SecureStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.url && !validateURL(`${this.baseURL}${config.url}`)) {
          throw new Error('Request to insecure or unauthorized URL blocked');
        }

        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleUnauthorized(): Promise<void> {
    await SecureStorage.removeItem('authToken');
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export default new ApiClient('https://api.example.com');
