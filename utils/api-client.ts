import axios, { AxiosError, AxiosHeaders } from 'axios';
import { forceSignOut, getValidAccessToken, refreshAuthToken } from '@/utils/auth-token';

const baseURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

let onUnauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedHandler = handler;
};

const runUnauthorizedHandler = () => {
  if (onUnauthorizedHandler) {
    onUnauthorizedHandler();
    return;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
};

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();
  const headers = AxiosHeaders.from(config.headers);

  if (apiKey && !headers.has('XApiKey')) {
    headers.set('XApiKey', apiKey);
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  config.headers = headers;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshedToken = await refreshAuthToken();

      if (refreshedToken) {
        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set('Authorization', `Bearer ${refreshedToken}`);
        originalRequest.headers = headers;

        return apiClient.request(originalRequest);
      }

      runUnauthorizedHandler();
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      forceSignOut();
    }

    return Promise.reject(error);
  }
);
