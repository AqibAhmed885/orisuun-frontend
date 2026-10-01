import { forceSignOut, getValidAccessToken, refreshAuthToken } from '@/utils/auth-token';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

type AuthFetchOptions = {
  onUnauthorized?: () => void;
  withAuth?: boolean;
};

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

const triggerUnauthorized = (handler?: () => void) => {
  if (handler) {
    handler();
    return;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
};

export const buildAuthHeaders = (
  initialHeaders: HeadersInit = {},
  withAuth = true
): Headers => {
  const headers = new Headers(initialHeaders);

  if (apiKey && !headers.has('XApiKey')) {
    headers.set('XApiKey', apiKey);
  }

  if (withAuth) {
    // Authorization is attached by apiFetch after the token is refreshed if needed.
  }

  return headers;
};

export const apiFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: AuthFetchOptions = {}
): Promise<Response> => {
  const withAuth = options.withAuth ?? true;
  const headers = buildAuthHeaders(init.headers, false);

  if (withAuth) {
    const token = await getValidAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    if (withAuth) {
      const refreshedToken = await refreshAuthToken();

      if (refreshedToken) {
        const retryHeaders = buildAuthHeaders(init.headers, false);
        retryHeaders.set('Authorization', `Bearer ${refreshedToken}`);

        const retryResponse = await fetch(input, {
          ...init,
          headers: retryHeaders,
        });

        if (retryResponse.status !== 401) {
          return retryResponse;
        }
      }

      forceSignOut();
    } else {
      triggerUnauthorized(options.onUnauthorized);
    }

    throw new UnauthorizedError('Your session has expired. Please sign in again.');
  }

  return response;
};
