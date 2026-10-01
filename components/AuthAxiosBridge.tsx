'use client';

import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { forceSignOut, getValidAccessToken, refreshAuthToken } from '@/utils/auth-token';

const apiBaseUrl = (process.env.NEXT_PUBLIC_APP_BASE_URL || '').replace(/\/+$/g, '');
const apiHost = apiBaseUrl ? new URL(apiBaseUrl).host : '';
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const PUBLIC_ENDPOINTS_WITHOUT_AUTH = [
  '/api/marketing/getsubscriptionplanbasedonprofileplan',
];

const resolveRequestUrl = (requestUrl: string, baseUrl?: string) => {
  if (!requestUrl) return null;

  try {
    return new URL(requestUrl, baseUrl || apiBaseUrl || window.location.origin);
  } catch {
    return null;
  }
};

const shouldSendAuthorization = (resolvedUrl: URL) => {
  const normalizedPath = resolvedUrl.pathname.toLowerCase();
  return !PUBLIC_ENDPOINTS_WITHOUT_AUTH.includes(normalizedPath);
};

const shouldAttachAuthHeaders = (config: InternalAxiosRequestConfig) => {
  const requestUrl = config.url || '';

  if (!requestUrl) return false;

  if (requestUrl.startsWith('/')) {
    return true;
  }

  const resolvedUrl = resolveRequestUrl(requestUrl, config.baseURL);
  if (!resolvedUrl) return false;

  return resolvedUrl.host === apiHost;
};

const notifyUnauthorized = () => {
  forceSignOut();
};

export default function AuthAxiosBridge() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const requestInterceptorId = axios.interceptors.request.use(async (config) => {
      if (!shouldAttachAuthHeaders(config)) {
        return config;
      }

      const headers = AxiosHeaders.from(config.headers);
      const requestUrl = config.url || '';
      const resolvedUrl = resolveRequestUrl(requestUrl, config.baseURL);
      const withAuth = resolvedUrl ? shouldSendAuthorization(resolvedUrl) : true;
      const token = withAuth ? await getValidAccessToken() : null;

      if (apiKey && !headers.has('XApiKey')) {
        headers.set('XApiKey', apiKey);
      }

      if (withAuth && token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (!withAuth && headers.has('Authorization')) {
        headers.delete('Authorization');
      }

      (config as any).__withAuth = withAuth;

      config.headers = headers;
      return config;
    });

    const responseInterceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config as (typeof error.config & { _retry?: boolean }) | undefined;

        if (error?.response?.status === 401 && originalRequest && !originalRequest._retry && (originalRequest as any).__withAuth) {
          originalRequest._retry = true;

          const refreshedToken = await refreshAuthToken();

          if (refreshedToken) {
            const retryHeaders = AxiosHeaders.from(originalRequest.headers);
            retryHeaders.set('Authorization', `Bearer ${refreshedToken}`);
            originalRequest.headers = retryHeaders;

            return axios.request(originalRequest);
          }
        }

        if (error?.response?.status === 401 && (error?.config as any)?.__withAuth) {
          notifyUnauthorized();
        }

        return Promise.reject(error);
      }
    );

    window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const requestUrl =
        typeof input === 'string' || input instanceof URL
          ? input.toString()
          : input.url;

      const shouldAttachHeaders = (() => {
        if (!requestUrl) return false;

        if (requestUrl.startsWith('/')) {
          return true;
        }

        const resolvedUrl = resolveRequestUrl(requestUrl, window.location.origin);
        if (!resolvedUrl) return false;
        return resolvedUrl.host === apiHost;
      })();

      if (!shouldAttachHeaders) {
        return originalFetch(input, init);
      }

      const headers = new Headers(
        typeof input === 'string' || input instanceof URL ? init.headers : input.headers
      );

      if (apiKey && !headers.has('XApiKey')) {
        headers.set('XApiKey', apiKey);
      }

      const resolvedUrl = resolveRequestUrl(requestUrl, window.location.origin);
      const withAuth = resolvedUrl ? shouldSendAuthorization(resolvedUrl) : true;
      const token = withAuth ? await getValidAccessToken() : null;

      if (withAuth && token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else if (!withAuth && headers.has('Authorization')) {
        headers.delete('Authorization');
      }

      const response = await originalFetch(input, {
        ...init,
        headers,
      });

      if (withAuth && response.status === 401) {
        const refreshedToken = await refreshAuthToken();

        if (refreshedToken) {
          const retryHeaders = new Headers(
            typeof input === 'string' || input instanceof URL ? init.headers : input.headers
          );

          if (apiKey && !retryHeaders.has('XApiKey')) {
            retryHeaders.set('XApiKey', apiKey);
          }

          retryHeaders.set('Authorization', `Bearer ${refreshedToken}`);

          const retryResponse = await originalFetch(input, {
            ...init,
            headers: retryHeaders,
          });

          if (retryResponse.status !== 401) {
            return retryResponse;
          }
        }

        notifyUnauthorized();
      }

      return response;
    };

    return () => {
      axios.interceptors.request.eject(requestInterceptorId);
      axios.interceptors.response.eject(responseInterceptorId);
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
