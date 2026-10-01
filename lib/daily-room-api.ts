'use client';

export type DailyParticipant = {
  id: string;
  name: string;
  detail: string;
  joined: string;
  avatar: string;
  muted: boolean;
  videoOff: boolean;
  source: unknown;
};

export type DailyTranscriptEntry = {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  avatar: string;
  source: unknown;
};

export type DailyRecordingResponse = {
  ok: boolean;
  message?: string;
  recording?: unknown;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
  ''
).replace(/\/+$/g, '');

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
      `Request failed with status ${response.status}`
    );
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

function buildUrl(path: string, query?: Record<string, string | undefined>) {
  if (!API_BASE_URL) {
    return path;
  }

  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value?.trim()) {
      url.searchParams.set(key, value.trim());
    }
  });
  return url.toString();
}

function getAuthHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window !== 'undefined') {
    const accessToken = window.localStorage.getItem('accessToken') || window.localStorage.getItem('token');
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  if (process.env.NEXT_PUBLIC_API_KEY) {
    headers.XApiKey = process.env.NEXT_PUBLIC_API_KEY;
  }

  return headers;
}

function safeString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getInitials(value?: string | null) {
  const parts = (value || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return [];
}

function normalizeParticipantsPayload(payload: unknown): DailyParticipant[] {
  const source =
    (Array.isArray(payload) && payload) ||
    asArray((payload as { participants?: unknown[] } | null)?.participants) ||
    asArray((payload as { Participants?: unknown[] } | null)?.Participants) ||
    asArray((payload as { data?: unknown[] } | null)?.data) ||
    asArray((payload as { Data?: unknown[] } | null)?.Data) ||
    asArray((payload as { result?: unknown[] } | null)?.result) ||
    asArray((payload as { Result?: unknown[] } | null)?.Result);

  return source.map((participant, index) => {
    const record = participant as Record<string, unknown>;
    const name =
      safeString(record.user_name) ||
      safeString(record.userName) ||
      safeString(record.name) ||
      safeString(record.full_name) ||
      safeString(record.fullName) ||
      safeString(record.display_name) ||
      safeString(record.displayName) ||
      `Participant ${index + 1}`;

    const joinedAt =
      safeString(record.joined_at) ||
      safeString(record.joinedAt) ||
      safeString(record.session_started_at) ||
      safeString(record.start_time) ||
      safeString(record.startedAt);

    const muted =
      Boolean(record.audio_muted) ||
      Boolean(record.is_muted) ||
      Boolean(record.muted) ||
      Boolean(record.audioMuted);

    const videoOff =
      Boolean(record.video_muted) ||
      Boolean(record.video_off) ||
      Boolean(record.is_video_off) ||
      Boolean(record.videoOff);

    return {
      id:
        safeString(record.id) ||
        safeString(record.participant_id) ||
        safeString(record.participantId) ||
        `${name}-${index + 1}`,
      name,
      detail:
        safeString(record.role) ||
        safeString(record.user_role) ||
        safeString(record.type) ||
        (index === 0 ? 'Speaker' : 'Participant'),
      joined: joinedAt ? `Joined ${joinedAt}` : 'Joined live meeting',
      avatar: getInitials(name),
      muted,
      videoOff,
      source: participant,
    };
  });
}

function normalizeTranscriptPayload(payload: unknown): DailyTranscriptEntry[] {
  const source =
    (Array.isArray(payload) && payload) ||
    asArray((payload as { transcript?: unknown[] } | null)?.transcript) ||
    asArray((payload as { Transcript?: unknown[] } | null)?.Transcript) ||
    asArray((payload as { entries?: unknown[] } | null)?.entries) ||
    asArray((payload as { Entries?: unknown[] } | null)?.Entries) ||
    asArray((payload as { data?: unknown[] } | null)?.data) ||
    asArray((payload as { Data?: unknown[] } | null)?.Data) ||
    asArray((payload as { result?: unknown[] } | null)?.result) ||
    asArray((payload as { Result?: unknown[] } | null)?.Result);

  return source.map((entry, index) => {
    const record = entry as Record<string, unknown>;
    const speaker =
      safeString(record.speaker) ||
      safeString(record.user_name) ||
      safeString(record.userName) ||
      safeString(record.name) ||
      safeString(record.full_name) ||
      `Speaker ${index + 1}`;

    const text =
      safeString(record.text) ||
      safeString(record.transcript) ||
      safeString(record.message) ||
      safeString(record.content) ||
      safeString(record.caption) ||
      '';

    const timestamp =
      safeString(record.timestamp) ||
      safeString(record.created_at) ||
      safeString(record.createdAt) ||
      safeString(record.time) ||
      safeString(record.started_at);

    return {
      id:
        safeString(record.id) ||
        safeString(record.transcript_id) ||
        safeString(record.entry_id) ||
        `${speaker}-${index + 1}`,
      speaker,
      text,
      timestamp,
      avatar: getInitials(speaker),
      source: entry,
    };
  }).filter((entry) => entry.text || entry.timestamp || entry.speaker);
}

export async function fetchDailyParticipants(roomName: string): Promise<DailyParticipant[]> {
  if (!roomName.trim()) return [];

  const response = await fetch(buildUrl(`/api/daily/rooms/${encodeURIComponent(roomName)}/participants`), {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as unknown;
  return normalizeParticipantsPayload(payload);
}

export async function fetchDailyTranscript(roomName: string): Promise<DailyTranscriptEntry[]> {
  if (!roomName.trim()) return [];

  const response = await fetch(buildUrl('/api/daily/transcript', { roomName }), {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as unknown;
  return normalizeTranscriptPayload(payload);
}

export async function startDailyRecording(roomName: string): Promise<DailyRecordingResponse> {
  if (!roomName.trim()) {
    throw new Error('A room name is required to start recording.');
  }

  const response = await fetch(buildUrl(`/api/daily/rooms/${encodeURIComponent(roomName)}/recordings/start`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as DailyRecordingResponse;
}

export async function stopDailyRecording(roomName: string): Promise<DailyRecordingResponse> {
  if (!roomName.trim()) {
    throw new Error('A room name is required to stop recording.');
  }

  const response = await fetch(buildUrl(`/api/daily/rooms/${encodeURIComponent(roomName)}/recordings/stop`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as DailyRecordingResponse;
}
