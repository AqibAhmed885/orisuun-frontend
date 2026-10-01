const DAILY_API_BASE_URL = 'https://api.daily.co/v1';

function getDailyApiToken() {
  const token = process.env.DAILY_API_TOKEN?.trim();
  if (!token) {
    throw new Error('Missing DAILY_API_TOKEN environment variable.');
  }
  return token;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as
      | { message?: string; Message?: string; error?: string; title?: string }
      | undefined;
    return (
      payload?.message ||
      payload?.Message ||
      payload?.error ||
      payload?.title ||
      `Daily API request failed with status ${response.status}`
    );
  } catch {
    return `Daily API request failed with status ${response.status}`;
  }
}

async function dailyFetch(path: string, init?: RequestInit) {
  const response = await fetch(`${DAILY_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getDailyApiToken()}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response;
}

export async function fetchDailyParticipantsFromApi(roomName: string) {
  return dailyFetch(`/meetings/${encodeURIComponent(roomName)}/participants`);
}

export async function fetchDailyTranscriptFromApi(roomName: string) {
  void roomName;
  return dailyFetch('/transcript');
}

export async function startDailyRecordingFromApi(roomName: string, body?: unknown) {
  return dailyFetch(`/rooms/${encodeURIComponent(roomName)}/recordings/start`, {
    method: 'POST',
    body: JSON.stringify(body ?? { type: 'cloud' }),
  });
}

export async function stopDailyRecordingFromApi(roomName: string) {
  return dailyFetch(`/rooms/${encodeURIComponent(roomName)}/recordings/stop`, {
    method: 'POST',
  });
}
