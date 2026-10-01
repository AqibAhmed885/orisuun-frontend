import { getAccessToken } from '@/utils/auth-token';

export type CreateDailyLiveSessionPayload = {
  streamId: string;
  userName: string;
  isHost?: boolean;
};

export type DailyLiveSessionResponse = {
  roomUrl: string;
  token: string;
  roomName: string;
};

type DailyLiveSessionApiEnvelope =
  | DailyLiveSessionResponse
  | {
      result?: Partial<DailyLiveSessionResponse> | null;
      Result?: Partial<DailyLiveSessionResponse> | null;
      data?: Partial<DailyLiveSessionResponse> | null;
      Data?: Partial<DailyLiveSessionResponse> | null;
      message?: string;
      Message?: string;
    };

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
  'https://api.orisuun.com'
).replace(/\/+$/g, '');

const DAILY_LIVE_SESSION_ENDPOINT = `${API_BASE_URL}/api/daily/live-session`;

const normalizeDailySessionResponse = (
  payload: DailyLiveSessionApiEnvelope
): DailyLiveSessionResponse | null => {
  const source =
    'roomUrl' in payload
      ? payload
      : payload.result || payload.Result || payload.data || payload.Data || null;

  if (!source) {
    return null;
  }

  const roomUrl = source.roomUrl;
  const token = source.token;
  const roomName = source.roomName;

  if (!roomUrl || !token || !roomName) {
    return null;
  }

  return {
    roomUrl,
    token,
    roomName,
  };
};

const getApiErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as
      | { message?: string; Message?: string; error?: string; title?: string }
      | undefined;

    return (
      payload?.message ||
      payload?.Message ||
      payload?.error ||
      payload?.title ||
      `Request failed with status ${response.status}`
    );
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

export async function createDailyLiveSession(
  payload: CreateDailyLiveSessionPayload
): Promise<DailyLiveSessionResponse> {
  if (!payload.streamId.trim()) {
    throw new Error('A stream ID is required to create a live session.');
  }

  if (!payload.userName.trim()) {
    throw new Error('A user name is required to join the live session.');
  }

  const accessToken =
    typeof window !== 'undefined' ? getAccessToken() || window.localStorage.getItem('token') : null;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const response = await fetch(DAILY_LIVE_SESSION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(apiKey ? { XApiKey: apiKey } : {}),
    },
    body: JSON.stringify({
      streamId: payload.streamId,
      userName: payload.userName,
      isHost: Boolean(payload.isHost),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  const responsePayload = (await response.json()) as DailyLiveSessionApiEnvelope;
  const session = normalizeDailySessionResponse(responsePayload);

  if (!session) {
    throw new Error('The live session response did not include roomUrl, token, and roomName.');
  }

  return session;
}
