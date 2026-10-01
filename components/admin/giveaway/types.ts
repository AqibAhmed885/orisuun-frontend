export type MemberStatus = 'Active' | 'Disqualified';
export type ProgramTab = 'members' | 'history' | 'analytics' | 'audit';
export type CycleTab = 'current' | 'pending' | 'previous';
export type AdminRole = 'superadmin' | 'admin';
export type SelectionMethod = 'Auto' | 'Manual' | 'Manual-Rerun';
export type SelectionState = 'Finalized' | 'Not Finalized';
export type ConfirmAction = 'rerun-selection' | 'confirm-winner';

export interface WeekStats {
  weekLabel: string;
  rank: number;
  entries: number;
  activities: number;
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  status: MemberStatus;
  previouslyDisqualified: boolean;
  current: WeekStats;
  previousWeeks: WeekStats[];
}

export interface SelectionRecord {
  id: string;
  weekLabel: string;
  selectionDate: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string | null;
  totalEntries: number;
  winnerName: string;
  winnerEntries: number;
  winnerActivities: number;
  winnerOdds: string;
  firstTimeWinner: boolean;
  method: SelectionMethod;
  status: SelectionState;
}

export interface FeedCardAnnouncement {
  id: string;
  weekLabel: string;
  winnerName: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
}

export interface CycleApiResponse {
  StatusCode: number;
  Message: string | null;
  Result: {
    Cycle?: {
      Id?: number;
      StartDate?: string;
      EndDate?: string;
      IsCompleted?: boolean;
      IsActive?: boolean;
    };
    Stats?: {
      TotalEntries?: number;
    };
    Participants?: Array<Record<string, unknown>>;
  };
}

export interface AllCyclesApiResponse {
  StatusCode: number;
  Message: string | null;
  Result: {
    Cycles?: Array<{
      Id?: number;
      StartDate?: string;
      EndDate?: string;
      IsActive?: boolean;
      IsCompleted?: boolean;
      CompletedAt?: string | null;
      CreatedAt?: string;
    }>;
    TotalCount?: number;
    Page?: number;
    PageSize?: number;
  };
}

export interface ConfirmState {
  open: boolean;
  action: ConfirmAction | null;
  title: string;
  message: string;
  confirmLabel: string;
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://api.orisuun.com';
export const adminRole: AdminRole = 'superadmin';
export const adminName = 'Superadmin A. Carter';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

export const formatDateForApi = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

export const formatCycleLabel = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return 'Current Week';

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Current Week';
  }

  const normalizedEnd = new Date(Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate()
  ));
  const normalizedStart = new Date(normalizedEnd);
  normalizedStart.setUTCDate(normalizedEnd.getUTCDate() - 6);

  const startLabel = normalizedStart.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  });
  const endLabel = normalizedEnd.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  });

  return `${startLabel} - ${endLabel}`;
};

export const getWeekOfYear = (dateValue?: string | Date | null): number => {
  const sourceDate = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(sourceDate.getTime())) {
    return 1;
  }

  // Use UTC to keep week calculation stable across timezones.
  const utcDate = new Date(Date.UTC(
    sourceDate.getFullYear(),
    sourceDate.getMonth(),
    sourceDate.getDate()
  ));
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1;

  return Math.ceil(dayOfYear / 7);
};

export const getNextMonday = (dateValue: string): Date => {
  const date = new Date(dateValue);
  const day = date.getDay();
  if (day === 0) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay;
  }
  return date;
};

export const formatSelectionDate = (dateValue?: string | null): string => {
  if (!dateValue) return '-';
  const date = getNextMonday(dateValue);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

export const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return fallback;
};

export const asBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
};

export const createEmptyPendingSelection = (): SelectionRecord => ({
  id: 'pending-selection',
  weekLabel: 'Current Week',
  selectionDate: '',
  startDate: null,
  endDate: null,
  isActive: false,
  isCompleted: false,
  completedAt: null,
  createdAt: null,
  totalEntries: 0,
  winnerName: 'TBD',
  winnerEntries: 0,
  winnerActivities: 0,
  winnerOdds: '0.00%',
  firstTimeWinner: false,
  method: 'Auto',
  status: 'Not Finalized',
});
