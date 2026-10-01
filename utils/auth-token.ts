import axios from 'axios';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'RefereshToken';
const TOKEN_COOKIE_KEY = 'token';
const USER_DATA_COOKIE_KEY = 'userData';
const TEAM_DATA_COOKIE_KEY = 'teamData';
const apiBaseUrl = (process.env.NEXT_PUBLIC_APP_BASE_URL || '').replace(/\/+$/g, '');
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const refreshClient = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  timeout: 30000,
});

const isBrowser = () => typeof window !== 'undefined';

let refreshInFlight: Promise<string | null> | null = null;

const clearStoredSessionData = () => {
  window.localStorage.removeItem('userData');
  window.localStorage.removeItem('teamData');
  Cookies.remove(USER_DATA_COOKIE_KEY, { path: '/' });
  Cookies.remove(TEAM_DATA_COOKIE_KEY, { path: '/' });
};

const redirectToSignIn = () => {
  if (!isBrowser()) return;

  window.dispatchEvent(new Event('auth:unauthorized'));

  if (window.location.pathname !== '/signin') {
    window.location.replace('/signin');
  }
};

export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;

  const tokenFromStorage = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (tokenFromStorage) return tokenFromStorage;

  const tokenFromCookie = Cookies.get(TOKEN_COOKIE_KEY);
  return tokenFromCookie ?? null;
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  if (!isBrowser() || !token) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  Cookies.set(TOKEN_COOKIE_KEY, token, { path: '/' });
};

export const setRefreshToken = (refreshToken: string) => {
  if (!isBrowser() || !refreshToken) return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAuthTokens = () => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  Cookies.remove(TOKEN_COOKIE_KEY, { path: '/' });
  clearStoredSessionData();
};

export const isJwtExpired = (token?: string | null): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload?.exp;
    if (!exp) return false;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return exp <= nowInSeconds;
  } catch {
    return true;
  }
};

export const forceSignOut = () => {
  clearAuthTokens();
  redirectToSignIn();
};

export const refreshAuthToken = async (): Promise<string | null> => {
  if (!isBrowser()) return null;

  const currentAccessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!currentAccessToken || !refreshToken) {
    return null;
  }

  if (isJwtExpired(refreshToken)) {
    forceSignOut();
    return null;
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = refreshClient
    .post(
      '/User/RefreshToken',
      {
        Token: currentAccessToken,
        RefreshToken: refreshToken,
      },
      {
        headers: {
          XApiKey: apiKey ?? '',
        },
      }
    )
    .then((response) => {
      const refreshedToken = response?.data?.Result?.Token;
      const refreshedRefreshToken =
        response?.data?.Result?.RefreshToken || response?.data?.Result?.RefereshToken;

      if (!refreshedToken || !refreshedRefreshToken) {
        throw new Error('Invalid refresh token response');
      }

      setAccessToken(refreshedToken);
      setRefreshToken(refreshedRefreshToken);

      return refreshedToken;
    })
    .catch(() => {
      forceSignOut();
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = getAccessToken();

  if (accessToken && !isJwtExpired(accessToken)) {
    return accessToken;
  }

  return refreshAuthToken();
};
