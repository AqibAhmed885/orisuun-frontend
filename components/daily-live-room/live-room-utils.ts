export const cleanupContainer = (element: HTMLElement | null) => {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const parseBackendDate = (value?: string | null) => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed);
  const normalized = hasTimezone ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value?: string | null) => {
  const date = parseBackendDate(value);
  if (!date) return '-';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTimeUtc = (value?: string | null) => {
  const date = parseBackendDate(value);
  if (!date) return '-';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date);
};

export const formatScheduleRange = (start?: string | null, end?: string | null) => {
  const startLabel = formatDateTime(start);
  const endLabel = formatDateTime(end);
  if (startLabel === '-' && endLabel === '-') return '-';
  return `${startLabel} - ${endLabel}`;
};

export const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(totalSeconds, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(' : ');
};

export const getMeetingWindowState = (
  start?: string | null,
  end?: string | null,
  now: number = Date.now()
) => {
  const startMs = parseBackendDate(start)?.getTime() ?? NaN;
  const endMs = parseBackendDate(end)?.getTime() ?? NaN;

  if (Number.isNaN(startMs)) return null;
  if (now < startMs) return 'upcoming';
  if (!Number.isNaN(endMs) && now > endMs) return 'ended';
  return 'live';
};

export const getInitials = (value?: string | null) => {
  const parts = (value || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
};

export const getAvatarTone = (name: string, isSelf: boolean) => {
  if (isSelf) {
    return 'bg-[#2d5bd1] text-white';
  }

  const tones = [
    'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white',
    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100',
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100',
  ];

  const toneIndex = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0) % tones.length;
  return tones[toneIndex];
};

export const isPdfUrl = (value?: string | null) => Boolean(value && /\.pdf(?:[?#].*)?$/i.test(value));
export const isImageUrl = (value?: string | null) => Boolean(value && /\.(png|jpe?g|gif|webp|bmp|svg)(?:[?#].*)?$/i.test(value));

export const getFileNameFromUrl = (value: string, fallback = 'Document') => {
  try {
    const withoutQuery = value.split('?')[0];
    const lastSegment = withoutQuery.split('/').filter(Boolean).pop();
    if (!lastSegment) return fallback;
    try {
      return decodeURIComponent(lastSegment);
    } catch {
      return lastSegment;
    }
  } catch {
    return fallback;
  }
};

export const getDisplayName = (user: {
  FirstName?: string;
  LastName?: string;
  ChatUserName?: string;
  FullName?: string;
} | null) => {
  if (!user) return '';
  return (
    user.ChatUserName?.trim() ||
    user.FullName?.trim() ||
    `${user.FirstName ?? ''} ${user.LastName ?? ''}`.trim()
  );
};
