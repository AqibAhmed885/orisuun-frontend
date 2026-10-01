'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DailyCall, DailyParticipant } from '@daily-co/daily-js';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';
import {
  fetchBookingById,
  fetchBookingRescheduleRequests,
  requestBookingReschedule,
  respondToBookingReschedule,
  type BookingRecord,
  type BookingRescheduleRequestRecord,
} from '@/lib/booking';
import {
  startDailyRecording,
  stopDailyRecording,
} from '@/lib/daily-room-api';
import {
  createBookingChatConnection,
  getBookingChatMessages,
  getBookingUnreadCount,
  joinBookingChat,
  leaveBookingChat,
  markBookingChatAsRead,
  sendBookingChatMessage,
  type BookingChatMessage,
} from '@/lib/booking-chat';
import {
  formatDateTime,
  formatScheduleRange,
  getDisplayName,
  getFileNameFromUrl,
  getInitials,
  getMeetingWindowState,
  isImageUrl,
  isPdfUrl,
} from './live-room-utils';
import {
  mapDailyParticipantsToView,
  type DailyParticipantsObject,
} from './live-room-daily-participants';
import { themeClasses, type ThemeMode } from './live-room-theme';
import type {
  BottomTab,
  BookingDocumentItem,
  ChatMessage,
  DailyLiveRoomProps,
  LiveTranscriptEntry,
  Participant,
  ParticipantActionState,
  RoomStatus,
  SidebarTab,
} from './types';

export type DailyLiveRoomViewModel = {
  booking: BookingRecord | null;
  bookingLoading: boolean;
  bookingError: string;
  roomStatus: RoomStatus;
  roomError: string;
  themeMode: ThemeMode;
  theme: (typeof themeClasses)['light'];
  sidebarTab: SidebarTab;
  setSidebarTab: React.Dispatch<React.SetStateAction<SidebarTab>>;
  bottomTab: BottomTab;
  setBottomTab: React.Dispatch<React.SetStateAction<BottomTab>>;
  isMuted: boolean;
  isCameraOff: boolean;
  isSharingScreen: boolean;
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  chatLoading: boolean;
  chatError: string;
  participantsLoading: boolean;
  participantsError: string;
  transcriptLoading: boolean;
  transcriptError: string;
  recordingLoading: boolean;
  recordingError: string;
  isRecording: boolean;
  mediaPermissionStatus: 'idle' | 'requesting' | 'granted' | 'denied';
  mediaPermissionError: string;
  manualExtensionSeconds: number;
  incomingRescheduleRequest: BookingRescheduleRequestRecord | null;
  rescheduleActionLoading: boolean;
  rescheduleActionError: string;
  rescheduleActionMessage: string;
  rescheduleActionMessageType: 'success' | 'error' | '';
  participantActions: Record<string, ParticipantActionState>;
  unreadCount: number;
  currentUserId: string;
  currentUserName: string;
  isHost: boolean;
  participants: Participant[];
  activeEndTime: string | null;
  remainingSeconds: number;
  bookingScheduleLabel: string;
  bookingDocumentUrl: string;
  bookingDocuments: BookingDocumentItem[];
  selectedDocumentUrl: string;
  setSelectedDocumentUrl: React.Dispatch<React.SetStateAction<string>>;
  hasPreviousDocument: boolean;
  hasNextDocument: boolean;
  goToPreviousDocument: () => void;
  goToNextDocument: () => void;
  bookingPurpose: string;
  bookingTitle: string;
  bookingStatusLabel: string;
  paymentStatusLabel: string;
  dailyRoomName: string;
  bookingRoomIsReady: boolean;
  isMeetingUpcoming: boolean;
  isMeetingEnded: boolean;
  isMeetingEndingSoon: boolean;
  overlayCopy: { title: string; body: string } | null;
  dailyParticipants: DailyParticipant[];
  chatInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  toggleMute: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  handleLeave: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  toggleChatPanel: () => void;
  extendMeeting: (minutes: number) => Promise<void>;
  acceptRescheduleRequest: () => Promise<void>;
  rejectRescheduleRequest: () => Promise<void>;
  clearRescheduleActionMessage: () => void;
  openMeetingDetails: () => void;
  openCurrentDocument: () => void;
  viewParticipantProfile: (participant: Participant) => void;
  toggleParticipantMute: (participantId: string) => void;
  toggleParticipantVideo: (participantId: string) => void;
  toggleRecording: () => Promise<void>;
  handleSendMessage: () => Promise<void>;
  handleChatKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAttachFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleTheme: () => void;
  handleEmojiSelector: (emoji: string) => void;
  requestMediaPermissions: () => Promise<void>;
  liveTranscript: LiveTranscriptEntry[];
};

export default function useDailyLiveRoom({
  bookingId,
  preferredUserName,
  preferredIsHost = false,
  debugRemainingSeconds,
}: DailyLiveRoomProps): DailyLiveRoomViewModel {
  const callObjectRef = useRef<DailyCall | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bookingChatConnectionRef = useRef<signalR.HubConnection | null>(null);
  const currentUserIdRef = useRef<string>('');

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [bookingError, setBookingError] = useState('');
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('idle');
  const [roomError, setRoomError] = useState('');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('documents');
  const [bottomTab, setBottomTab] = useState<BottomTab>('participants');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState('');
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [participantsError, setParticipantsError] = useState('');
  const [transcriptLoading, setTranscriptLoading] = useState(true);
  const [transcriptError, setTranscriptError] = useState('');
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaPermissionStatus, setMediaPermissionStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [mediaPermissionError, setMediaPermissionError] = useState('');
  const [manualExtensionSeconds, setManualExtensionSeconds] = useState(0);
  const [extendedEndTime, setExtendedEndTime] = useState<string | null>(null);
  const [incomingRescheduleRequest, setIncomingRescheduleRequest] = useState<BookingRescheduleRequestRecord | null>(null);
  const [rescheduleActionLoading, setRescheduleActionLoading] = useState(false);
  const [rescheduleActionError, setRescheduleActionError] = useState('');
  const [rescheduleActionMessage, setRescheduleActionMessage] = useState('');
  const [rescheduleActionMessageType, setRescheduleActionMessageType] = useState<'success' | 'error' | ''>('');
  const [participantActions, setParticipantActions] = useState<Record<string, ParticipantActionState>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState(preferredUserName?.trim() || 'Guest');
  const [now, setNow] = useState(() => Date.now());
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [dailyParticipants, setDailyParticipants] = useState<DailyParticipant[]>([]);
  const [liveTranscript, setLiveTranscript] = useState<LiveTranscriptEntry[]>([]);
  const appliedRescheduleRequestIdsRef = useRef<Set<string>>(new Set());
  const isInitializingCallObjectRef = useRef(false);
  const isJoiningRoomRef = useRef(false);
  const isRequestingMediaRef = useRef(false);
  const isCleaningUpRef = useRef(false);

  const theme = themeClasses[themeMode];

  const isCameraMicPermissionError = useCallback((message: string) => {
    const normalized = message.trim().toLowerCase();
    return (
      normalized.includes('permission') ||
      normalized.includes('notallowederror') ||
      normalized.includes('not allowed') ||
      normalized.includes('camera') ||
      normalized.includes('microphone') ||
      normalized.includes('media devices') ||
      normalized.includes('getusermedia')
    );
  }, []);

  const extractDailyErrorMessage = useCallback(
    (event: unknown, fallback: string) => {
      const permissionMessage =
        'Camera and microphone access was blocked. Please allow permissions in your browser and try again.';

      if (typeof event === 'string') {
        const normalized = event.trim().toLowerCase();
        if (
          normalized === 'not allowed' ||
          normalized.includes('not allowed') ||
          normalized.includes('permission denied') ||
          normalized.includes('denied')
        ) {
          return permissionMessage;
        }

        return event;
      }
      if (!event || typeof event !== 'object') return fallback;

      const payload = event as {
        errorMsg?: unknown;
        error?: { msg?: unknown; message?: unknown };
        message?: unknown;
        msg?: unknown;
      };

      const tryExtract = (value: unknown): string | null => {
        if (typeof value === 'string' && value.trim()) return value;
        if (!value || typeof value !== 'object') return null;

        const nested = value as {
          errorMsg?: unknown;
          error?: { msg?: unknown; message?: unknown };
          message?: unknown;
          msg?: unknown;
        };

        return (
          tryExtract(nested.errorMsg) ||
          tryExtract(nested.error?.msg) ||
          tryExtract(nested.error?.message) ||
          tryExtract(nested.message) ||
          tryExtract(nested.msg)
        );
      };

      const candidates = [
        payload.errorMsg,
        payload.error?.msg,
        payload.error?.message,
        payload.message,
        payload.msg,
      ];

      for (const candidate of candidates) {
        const extracted = tryExtract(candidate);
        if (extracted) {
          const normalized = extracted.trim().toLowerCase();
          if (
            normalized === 'not allowed' ||
            normalized.includes('not allowed') ||
            normalized.includes('permission denied') ||
            normalized.includes('denied')
          ) {
            return permissionMessage;
          }

          return extracted;
        }
      }

      return fallback;
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUserRaw = window.localStorage.getItem('userData');
    if (!storedUserRaw) {
      setCurrentUserName((current) => current || preferredUserName?.trim() || 'Guest');
      return;
    }

    try {
      const storedUser = JSON.parse(storedUserRaw) as {
        Id?: string;
        FirstName?: string;
        LastName?: string;
        ChatUserName?: string;
        FullName?: string;
      };

      const resolvedName = getDisplayName(storedUser) || preferredUserName?.trim() || 'Guest';
      setCurrentUserId(storedUser?.Id || '');
      currentUserIdRef.current = storedUser?.Id || '';
      setCurrentUserName(resolvedName);
    } catch {
      setCurrentUserName(preferredUserName?.trim() || 'Guest');
    }
  }, [preferredUserName]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const normalizeIncomingRescheduleRequest = useCallback((payload: unknown): BookingRescheduleRequestRecord | null => {
    try {
      const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (!parsed || typeof parsed !== 'object') return null;

      const record = parsed as Record<string, unknown>;
      const requestId =
        (typeof record.RescheduleRequestId === 'string' && record.RescheduleRequestId) ||
        (typeof record.Id === 'string' && record.Id) ||
        '';
      const bookingIdValue =
        (typeof record.BookingId === 'string' && record.BookingId) ||
        (booking?.Id ?? '');
      const requestedBy =
        (typeof record.RequestedBy === 'string' && record.RequestedBy) ||
        '';
      const requestedByName =
        (typeof record.RequestedByName === 'string' && record.RequestedByName) || '';
      const proposedStartTime =
        (typeof record.ProposedStartTime === 'string' && record.ProposedStartTime) || '';
      const proposedEndTime =
        (typeof record.ProposedEndTime === 'string' && record.ProposedEndTime) || '';

      if (!requestId || !bookingIdValue || !proposedStartTime || !proposedEndTime) {
        return null;
      }

      return {
        Id: requestId,
        BookingId: bookingIdValue,
        RequestedBy: requestedBy,
        RequesterName: requestedByName,
        ProposedStartTime: proposedStartTime,
        ProposedEndTime: proposedEndTime,
        Reason: typeof record.Reason === 'string' ? record.Reason : null,
        Status: typeof record.Status === 'string' ? record.Status : 'pending',
        RespondedBy: typeof record.RespondedBy === 'string' ? record.RespondedBy : null,
        RespondedAt: typeof record.RespondedAt === 'string' ? record.RespondedAt : null,
        ResponseNote: typeof record.ResponseNote === 'string' ? record.ResponseNote : null,
        CreatedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }, [booking?.Id]);

  const isCurrentUserRequest = useCallback(
    (requestedBy?: string | null) => {
      const normalizedRequestedBy = requestedBy?.trim().toLowerCase();
      const normalizedCurrentUserId = currentUserIdRef.current?.trim().toLowerCase();

      if (!normalizedRequestedBy || !normalizedCurrentUserId) {
        return false;
      }

      return normalizedRequestedBy === normalizedCurrentUserId;
    },
    []
  );

  const syncLocalMediaState = useCallback((callObject: DailyCall) => {
    try {
      const localParticipant = callObject.participants().local;
      const localAudioState = localParticipant?.tracks?.audio?.state;
      const localVideoState = localParticipant?.tracks?.video?.state;
      const localScreenState = localParticipant?.tracks?.screenVideo?.state;

      setIsMuted(
        localAudioState === 'off' ? true : !callObject.localAudio()
      );
      setIsCameraOff(
        localVideoState === 'off' ? true : !callObject.localVideo()
      );
      setIsSharingScreen(
        localScreenState !== undefined
          ? localScreenState !== 'off'
          : callObject.localScreenVideo()
      );
      setMediaPermissionStatus((current) =>
        current === 'denied' ? current : 'granted'
      );
      setMediaPermissionError('');
    } catch {
      // Ignore state sync failures and keep the last known UI state.
    }
  }, []);

  const syncDailyParticipants = useCallback((callObject: DailyCall) => {
    try {
      const liveParticipants = callObject.participants();
      const rawParticipants = Object.values(liveParticipants);

      setDailyParticipants(rawParticipants);

      const mappedParticipants = mapDailyParticipantsToView(
        liveParticipants as unknown as DailyParticipantsObject
      );
      setParticipants(mappedParticipants);
      setParticipantActions((current) => {
        const nextActions: Record<string, ParticipantActionState> = {};
        for (const participant of mappedParticipants) {
          nextActions[participant.id] = current[participant.id] || {
            muted: false,
            videoOff: false,
          };
        }
        return nextActions;
      });
      setParticipantsError('');
    } catch {
      setDailyParticipants([]);
      setParticipants([]);
      setParticipantsError('Unable to load live participants.');
    } finally {
      setParticipantsLoading(false);
      syncLocalMediaState(callObject);
    }
  }, [syncLocalMediaState]);

  const attachCallObjectListeners = useCallback((callObject: DailyCall) => {
    const syncParticipants = () => syncDailyParticipants(callObject);

    callObject.on('started-camera', () => {
      syncLocalMediaState(callObject);
      setMediaPermissionStatus('granted');
      setMediaPermissionError('');
    });

    callObject.on('camera-error', (event) => {
      const message = extractDailyErrorMessage(
        event,
        'Unable to access your camera and microphone.'
      );
      setMediaPermissionStatus('denied');
      setMediaPermissionError(message);
      setRoomError(message);
      toast.error(message, { position: 'top-right', autoClose: 4500 });
    });

    callObject.on('joined-meeting', () => {
      setRoomStatus('joined');
      setParticipantsLoading(false);
      syncParticipants();
    });

    callObject.on('left-meeting', () => {
      setRoomStatus('left');
      setParticipants([]);
      setDailyParticipants([]);
      setParticipantsError('');
      setParticipantsLoading(false);
      setIsSharingScreen(false);
      setMediaPermissionStatus('idle');
      setMediaPermissionError('');
      if (callObjectRef.current === callObject) {
        callObjectRef.current = null;
      }
      isJoiningRoomRef.current = false;
      isRequestingMediaRef.current = false;
    });

    callObject.on('participant-joined', syncParticipants);
    callObject.on('participant-updated', syncParticipants);
    callObject.on('participant-left', syncParticipants);
    callObject.on('track-started', syncParticipants);
    callObject.on('track-stopped', syncParticipants);

    callObject.on('local-screen-share-started', () => {
      setIsSharingScreen(true);
      syncLocalMediaState(callObject);
    });

    callObject.on('local-screen-share-stopped', () => {
      setIsSharingScreen(false);
      syncLocalMediaState(callObject);
    });

    callObject.on('local-screen-share-canceled', () => {
      setIsSharingScreen(false);
      syncLocalMediaState(callObject);
    });

    callObject.on('error', (event) => {
      const message = extractDailyErrorMessage(
        event,
        'Daily reported an error while joining the room.'
      );

      setRoomStatus('error');
      setRoomError(message);

      toast.error(message, {
        position: 'top-right',
        autoClose: 4500,
      });
    });
  }, [extractDailyErrorMessage, syncDailyParticipants, syncLocalMediaState]);

  const createCallObjectIfNeeded = useCallback(async () => {
    if (callObjectRef.current) {
      return callObjectRef.current;
    }

    if (isInitializingCallObjectRef.current) {
      return null;
    }

    isInitializingCallObjectRef.current = true;

    try {
      const dailyModule = await import('@daily-co/daily-js');
      const callObject = dailyModule.default.createCallObject({
        subscribeToTracksAutomatically: true,
      });

      callObjectRef.current = callObject;
      attachCallObjectListeners(callObject);

      return callObject;
    } finally {
      isInitializingCallObjectRef.current = false;
    }
  }, [attachCallObjectListeners]);

  const joinRoom = useCallback(
    async (callObject: DailyCall) => {
      if (!booking) return;
      if (isJoiningRoomRef.current || roomStatus === 'joined') return;

      const resolvedUserName =
        currentUserName || preferredUserName?.trim() || 'Guest';
      const isHostUser = currentUserId
        ? booking.ProviderUserId === currentUserId
        : preferredIsHost;
      const roomUrl =
        booking.DailyRoomUrl ||
        (booking.DailyRoomName
          ? `https://orisuun.daily.co/${booking.DailyRoomName.trim()}`
          : '');
      const token = isHostUser
        ? booking.ProviderMeetingToken
        : booking.BookerMeetingToken;

      if (!roomUrl) {
        throw new Error(
          'Unable to determine the Daily room URL for this booking.'
        );
      }

      isJoiningRoomRef.current = true;
      setRoomStatus('joining');

      try {
        await callObject.join({
          url: roomUrl,
          ...(token ? { token } : {}),
          userName: resolvedUserName,
        });
      } finally {
        isJoiningRoomRef.current = false;
      }
    },
    [booking, currentUserId, currentUserName, preferredIsHost, preferredUserName, roomStatus]
  );

  useEffect(() => {
    let cancelled = false;

    const loadBooking = async () => {
      try {
        setBookingLoading(true);
        setBookingError('');
        setExtendedEndTime(null);
        setManualExtensionSeconds(0);
        setIncomingRescheduleRequest(null);
        const result = await fetchBookingById(bookingId);
        if (cancelled) return;
        setBooking(result);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Failed to load booking details.';
        setBooking(null);
        setBookingError(message);
        toast.error(message, { position: 'top-right', autoClose: 4500 });
      } finally {
        if (!cancelled) setBookingLoading(false);
      }
    };

    if (!bookingId.trim()) {
      setBookingLoading(false);
      const message = 'Booking ID is missing from the live page route.';
      setBookingError(message);
      toast.error(message, { position: 'top-right', autoClose: 4500 });
      return;
    }

    void loadBooking();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const bookingRoomIsReady = Boolean(
    booking?.DailyRoomUrl || booking?.DailyRoomName
  );

  const isHost = useMemo(() => {
    if (!booking) return preferredIsHost;
    if (currentUserId) return booking.ProviderUserId === currentUserId;
    return preferredIsHost;
  }, [booking, currentUserId, preferredIsHost]);

  const effectiveEndTime = useMemo(() => {
    const bookingEndTime = booking?.ActualEndTime || booking?.ScheduledEndTime || null;
    if (!extendedEndTime) return bookingEndTime;
    if (!bookingEndTime) return extendedEndTime;

    const bookingEndMs = new Date(bookingEndTime).getTime();
    const extendedEndMs = new Date(extendedEndTime).getTime();
    if (Number.isNaN(bookingEndMs)) return extendedEndTime;
    if (Number.isNaN(extendedEndMs)) return bookingEndTime;
    return extendedEndMs > bookingEndMs ? extendedEndTime : bookingEndTime;
  }, [booking?.ActualEndTime, booking?.ScheduledEndTime, extendedEndTime]);

  const activeEndTime = effectiveEndTime;

  const meetingWindowState = useMemo(
    () =>
      getMeetingWindowState(
        booking?.ScheduledStartTime,
        effectiveEndTime,
        now
      ),
    [booking?.ScheduledStartTime, effectiveEndTime, now]
  );
  const isMeetingUpcoming = meetingWindowState === 'upcoming';
  const isMeetingEnded = meetingWindowState === 'ended';

  const remainingSeconds = useMemo(() => {
    if (!activeEndTime) return 0;
    const endMs = new Date(activeEndTime).getTime();
    if (Number.isNaN(endMs)) return 0;
    if (endMs <= now) return 0;
    return Math.max(Math.floor((endMs - now) / 1000) + manualExtensionSeconds, 0);
  }, [activeEndTime, manualExtensionSeconds, now]);
  const displayedRemainingSeconds =
    typeof debugRemainingSeconds === 'number' && Number.isFinite(debugRemainingSeconds)
      ? Math.max(0, Math.floor(debugRemainingSeconds))
      : remainingSeconds;
  const isMeetingEndingSoon = displayedRemainingSeconds > 0 && displayedRemainingSeconds <= 300;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!booking || bookingLoading || bookingError) {
      return;
    }

    if (isMeetingUpcoming) {
      setRoomStatus('idle');
      setRoomError('');
      setParticipantsLoading(false);
      setDailyParticipants([]);
      setParticipants([]);
      return;
    }

    if (isMeetingEnded) {
      setRoomStatus('left');
      setRoomError('');
      setParticipantsLoading(false);
      setDailyParticipants([]);
      setParticipants([]);
      return;
    }

    if (!bookingRoomIsReady) {
      setRoomStatus('error');
      const message =
        'This booking is missing the Daily room information needed to start video.';
      setRoomError(message);
      toast.error(message, { position: 'top-right', autoClose: 4000 });
      return;
    }

    if (!callObjectRef.current && !isRequestingMediaRef.current) {
      setRoomStatus('idle');
      setRoomError('');
    }
  }, [
    booking,
    bookingError,
    bookingLoading,
    bookingRoomIsReady,
    isMeetingEnded,
    isMeetingUpcoming,
  ]);

  useEffect(() => {
    return () => {
      isCleaningUpRef.current = true;
      const callObject = callObjectRef.current;
      callObjectRef.current = null;
      isJoiningRoomRef.current = false;
      isRequestingMediaRef.current = false;

      if (!callObject) return;

      void (async () => {
        try {
          await callObject.leave();
        } catch {
          // The call may already have been left.
        }

        try {
          await callObject.destroy();
        } catch {
          // Ignore cleanup failures.
        }
      })();
    };
  }, [bookingId]);

  useEffect(() => {
    if (!booking || !currentUserId || bookingLoading || bookingError) {
      return;
    }

    let cancelled = false;

    const connectBookingChat = async () => {
      try {
        setChatLoading(true);
        if (bookingChatConnectionRef.current) {
          try {
            await leaveBookingChat(bookingChatConnectionRef.current, booking.Id);
          } catch {
            // Ignore stale leave attempts.
          }
          try {
            await bookingChatConnectionRef.current.stop();
          } catch {
            // Ignore stale stop attempts.
          }
        }

        const connection = createBookingChatConnection();
        bookingChatConnectionRef.current = connection;

        const applyMessage = (incoming: BookingChatMessage) => {
          setChatMessages((current) => {
            const mapped = mapBookingChatMessage(incoming, currentUserIdRef.current, currentUserName);
            const existingIndex = current.findIndex((message) => message.id === mapped.id);
            if (existingIndex >= 0) {
              const next = [...current];
              next[existingIndex] = mapped;
              return next;
            }
            return [...current, mapped].sort((a, b) => new Date(a.raw.CreatedAt).getTime() - new Date(b.raw.CreatedAt).getTime());
          });
        };

        const applyEdit = (payload: { Id?: string; MessageId?: string; Message?: string }) => {
          const messageId = payload.Id || payload.MessageId;
          if (!messageId) return;
          setChatMessages((current) =>
            current.map((message) =>
              message.id === messageId
                ? {
                  ...message,
                  body: payload.Message ?? message.body,
                  raw: {
                    ...message.raw,
                    Message: payload.Message ?? message.raw.Message,
                    IsEdited: true,
                    EditedAt: new Date().toISOString(),
                  },
                }
                : message
            )
          );
        };

        const applyDelete = (payload: { MessageId?: string; Id?: string }) => {
          const messageId = payload.MessageId || payload.Id;
          if (!messageId) return;
          setChatMessages((current) => current.filter((message) => message.id !== messageId));
        };

        connection.on('ReceiveBookingMessage', (payload) => {
          try {
            const parsed = parseBookingPayload(payload);
            if (!parsed) return;
            applyMessage(parsed);
            if (parsed.SenderUserId && parsed.SenderUserId !== currentUserIdRef.current) {
              setUnreadCount((current) => current + 1);
            }
            if (parsed.SenderUserId !== currentUserIdRef.current) {
              setIsChatOpen(true);
            }
          } catch {
            // Ignore malformed message payloads.
          }
        });

        connection.on('BookingMessageEdited', (payload) => {
          try {
            const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
            applyEdit(parsed);
          } catch {
            // Ignore malformed edit payloads.
          }
        });

        connection.on('BookingMessageDeleted', (payload) => {
          try {
            const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
            applyDelete(parsed);
          } catch {
            // Ignore malformed delete payloads.
          }
        });

        connection.on('BookingMessagesRead', () => {
          if (!cancelled) {
            setUnreadCount(0);
          }
        });

        connection.on('ReceiveBookingRescheduleRequest', (payload) => {
          const request = normalizeIncomingRescheduleRequest(payload);
          if (!request || cancelled) return;

          const isFromCurrentUser = isCurrentUserRequest(request.RequestedBy);
          if (isFromCurrentUser) {
            setIncomingRescheduleRequest(null);
            return;
          }

          setIncomingRescheduleRequest(request);
          setRescheduleActionError('');
        });

        await connection.start();
        if (cancelled) return;
        await joinBookingChat(connection, booking.Id);
        if (cancelled) return;
        const initialMessages = await getBookingChatMessages(booking.Id, 0, 100);
        if (cancelled) return;

        setChatMessages(
          initialMessages.map((message) =>
            mapBookingChatMessage(message, currentUserIdRef.current, currentUserName)
          )
        );
        setChatError('');

        try {
          const unread = await getBookingUnreadCount(booking.Id, currentUserId);
          if (!cancelled) {
            setUnreadCount(unread);
          }
        } catch {
          if (!cancelled) {
            setUnreadCount(0);
          }
        }

        await markBookingChatAsRead(booking.Id, currentUserId);
      } catch (error) {
        if (!cancelled) {
          setChatMessages([]);
          setUnreadCount(0);
          setChatError(error instanceof Error ? error.message : 'Unable to connect booking chat.');
        }
      } finally {
        if (!cancelled) {
          setChatLoading(false);
        }
      }
    };

    void connectBookingChat();

    return () => {
      cancelled = true;
      const connection = bookingChatConnectionRef.current;
      bookingChatConnectionRef.current = null;

      if (connection) {
        void (async () => {
          try {
            await leaveBookingChat(connection, booking.Id);
          } catch {
            // Ignore cleanup errors.
          }

          try {
            await connection.stop();
          } catch {
            // Ignore cleanup errors.
          }
        })();
      }
    };
  }, [booking, bookingError, bookingLoading, currentUserId, currentUserName, isCurrentUserRequest, normalizeIncomingRescheduleRequest]);

  const bookingTitle = booking?.MeetingType || 'Loading meeting...';
  const bookingPurpose = booking?.MeetingPurpose || 'No purpose provided.';
  const bookingStatusLabel = booking?.Status || '-';
  const paymentStatusLabel = booking ? (booking.IsPaid ? 'Paid' : 'Unpaid') : '-';
  const dailyRoomName = booking?.DailyRoomName || '-';
  const bookingDocuments = useMemo<BookingDocumentItem[]>(() => {
    const uniqueUrls = [...new Set((booking?.ReferralDocumentUrls ?? []).filter((url): url is string => Boolean(url)))];
    return uniqueUrls.map((url, index) => {
      const name = getFileNameFromUrl(url, `Document ${index + 1}`);
      return {
        url,
        name,
        kind: isImageUrl(url) ? 'image' : isPdfUrl(url) ? 'pdf' : 'file',
      };
    });
  }, [booking?.ReferralDocumentUrls]);

  const bookingDocumentUrl = selectedDocumentUrl || bookingDocuments[0]?.url || '';
  const selectedDocumentIndex = bookingDocuments.findIndex((doc) => doc.url === bookingDocumentUrl);
  const hasPreviousDocument = selectedDocumentIndex > 0;
  const hasNextDocument = selectedDocumentIndex >= 0 && selectedDocumentIndex < bookingDocuments.length - 1;
  const bookingScheduleLabel = formatScheduleRange(booking?.ScheduledStartTime, booking?.ScheduledEndTime);

  useEffect(() => {
    if (!bookingDocuments.length) {
      if (selectedDocumentUrl) setSelectedDocumentUrl('');
      return;
    }

    const selectedStillExists = bookingDocuments.some((doc) => doc.url === selectedDocumentUrl);
    if (!selectedStillExists) {
      setSelectedDocumentUrl(bookingDocuments[0].url);
    }
  }, [bookingDocuments, selectedDocumentUrl]);

  useEffect(() => {
    setParticipantsLoading(false);
    setTranscriptLoading(false);
    setParticipantsError('');
    setTranscriptError('');
    setParticipants([]);
    setDailyParticipants([]);
    setLiveTranscript([]);
  }, [booking?.DailyRoomName, bookingError, bookingLoading, isMeetingEnded, isMeetingUpcoming]);

  useEffect(() => {
    if (!booking?.Id || bookingLoading || bookingError || isMeetingUpcoming || isMeetingEnded) {
      setIncomingRescheduleRequest(null);
      return;
    }

    let cancelled = false;

    const syncRequests = async () => {
      try {
        const requests = await fetchBookingRescheduleRequests(booking.Id);
        if (cancelled) return;

        const latestRequest = requests[0] || null;
        if (!latestRequest) {
          setIncomingRescheduleRequest(null);
          setRescheduleActionMessage('');
          setRescheduleActionMessageType('');
          return;
        }

        const isFromCurrentUser = isCurrentUserRequest(latestRequest.RequestedBy);
        if (latestRequest.Status === 'pending' && !isFromCurrentUser) {
          setIncomingRescheduleRequest(latestRequest);
          setRescheduleActionError('');
          setRescheduleActionMessage('');
          setRescheduleActionMessageType('');
          return;
        }

        if (latestRequest.Status === 'accepted') {
          setIncomingRescheduleRequest(null);
          setRescheduleActionMessage('');
          setRescheduleActionMessageType('');
          setExtendedEndTime(latestRequest.ProposedEndTime);
          if (!appliedRescheduleRequestIdsRef.current.has(latestRequest.Id)) {
            const startMs = new Date(latestRequest.ProposedStartTime).getTime();
            const endMs = new Date(latestRequest.ProposedEndTime).getTime();
            const extraSeconds = Number.isNaN(startMs) || Number.isNaN(endMs) ? 0 : Math.max(Math.floor((endMs - startMs) / 1000), 0);
            if (extraSeconds > 0) {
              setManualExtensionSeconds((current) => current + extraSeconds);
            }
            appliedRescheduleRequestIdsRef.current.add(latestRequest.Id);
          }
          return;
        }

        if (latestRequest.Status === 'rejected') {
          setIncomingRescheduleRequest(null);
          setRescheduleActionMessage('');
          setRescheduleActionMessageType('');
          return;
        }

        if (!isFromCurrentUser) {
          setIncomingRescheduleRequest(latestRequest);
          setRescheduleActionMessage('');
          setRescheduleActionMessageType('');
        }
      } catch {
        if (!cancelled) {
          // Ignore polling errors; the popup will still work from realtime events.
        }
      }
    };

    void syncRequests();
    const timer = window.setInterval(() => {
      void syncRequests();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [booking?.Id, bookingError, bookingLoading, isCurrentUserRequest, isMeetingEnded, isMeetingUpcoming]);

  const openMeetingDetails = () => {
    if (!booking) return;
    // window.alert(meetingDetailsForAlert);
  };

  const extendMeeting = async (minutes: number) => {
    if (!booking) return;

    const requesterUserId =
      currentUserIdRef.current ||
      currentUserId ||
      (isHost ? booking.ProviderUserId : booking.BookerUserId);

    if (!requesterUserId) {
      const message = 'Please sign in before requesting a time extension.';
      setRescheduleActionError(message);
      toast.error(message, { position: 'top-right', autoClose: 4000 });
      return;
    }

    const proposedStartTime = new Date();
    const proposedEndTime = new Date(Date.now() + minutes * 60 * 1000);

    setRescheduleActionLoading(true);
    setRescheduleActionError('');

    try {
      const request = await requestBookingReschedule({
        BookingId: booking.Id,
        RequestedBy: requesterUserId,
        ProposedStartTime: proposedStartTime.toISOString(),
        ProposedEndTime: proposedEndTime.toISOString(),
        Reason: `Requested a ${minutes}-minute extension`,
      });

      toast.success(`Extension request for ${minutes} minutes sent.`, {
        position: 'top-right',
        autoClose: 3500,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send the extension request.';
      setRescheduleActionError(message);
      toast.error(message, { position: 'top-right', autoClose: 4000 });
    } finally {
      setRescheduleActionLoading(false);
    }
  };

  const respondToRescheduleRequest = async (status: 'accepted' | 'rejected') => {
    if (!booking || !incomingRescheduleRequest) return;

    const responderUserId =
      currentUserIdRef.current ||
      currentUserId ||
      (isHost ? booking.ProviderUserId : booking.BookerUserId);

    if (!responderUserId) {
      const message = 'Please sign in before responding to a request.';
      setRescheduleActionError(message);
      toast.error(message, { position: 'top-right', autoClose: 4000 });
      return;
    }

    setRescheduleActionLoading(true);
    setRescheduleActionError('');

    try {
      const result = await respondToBookingReschedule({
        RescheduleRequestId: incomingRescheduleRequest.Id,
        RespondedBy: responderUserId,
        Status: status,
        ResponseNote: status === 'accepted' ? 'Accepted from live room' : 'Rejected from live room',
      });

      if (status === 'accepted' && result.updatedBooking) {
        setBooking(result.updatedBooking);
        setExtendedEndTime(result.updatedBooking.ActualEndTime || result.updatedBooking.ScheduledEndTime);
      }

      if (status === 'accepted') {
        appliedRescheduleRequestIdsRef.current.add(result.rescheduleRequest.Id);
        if (!result.updatedBooking) {
          setExtendedEndTime(result.rescheduleRequest.ProposedEndTime);
        }
        setRescheduleActionMessage('Time extension accepted.');
        setRescheduleActionMessageType('success');
        toast.success('Time extension accepted.', { position: 'top-right', autoClose: 3500 });
      } else {
        setRescheduleActionMessage('Time extension rejected.');
        setRescheduleActionMessageType('error');
        toast.info('Time extension rejected.', { position: 'top-right', autoClose: 3500 });
      }

      window.setTimeout(() => {
        setIncomingRescheduleRequest(null);
        setRescheduleActionMessage('');
        setRescheduleActionMessageType('');
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update the reschedule request.';
      setRescheduleActionError(message);
      setRescheduleActionMessage(message);
      setRescheduleActionMessageType('error');
      toast.error(message, { position: 'top-right', autoClose: 4000 });
    } finally {
      setRescheduleActionLoading(false);
    }
  };

  const openCurrentDocument = () => {
    if (sidebarTab === 'documents' && bookingDocumentUrl) {
      window.open(bookingDocumentUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (sidebarTab === 'scope') {
      openMeetingDetails();
      return;
    }
    window.alert('No booking document is available yet.');
  };

  const goToPreviousDocument = () => {
    if (!bookingDocuments.length || selectedDocumentIndex <= 0) return;
    setSelectedDocumentUrl(bookingDocuments[selectedDocumentIndex - 1].url);
  };

  const goToNextDocument = () => {
    if (!bookingDocuments.length || selectedDocumentIndex < 0 || selectedDocumentIndex >= bookingDocuments.length - 1) return;
    setSelectedDocumentUrl(bookingDocuments[selectedDocumentIndex + 1].url);
  };

  const viewParticipantProfile = (participant: Participant) => {
    window.alert([participant.name, '', `Role: ${participant.detail}`, `Status: ${participant.joined}`].join('\n'));
  };

  const toggleParticipantMute = (participantId: string) => {
    setParticipantActions((current) => {
      const currentState = current[participantId] || { muted: false, videoOff: false };
      return { ...current, [participantId]: { ...currentState, muted: !currentState.muted } };
    });
  };

  const toggleParticipantVideo = (participantId: string) => {
    setParticipantActions((current) => {
      const currentState = current[participantId] || { muted: false, videoOff: false };
      return { ...current, [participantId]: { ...currentState, videoOff: !currentState.videoOff } };
    });
  };

  const toggleRecording = async () => {
    const roomName = booking?.DailyRoomName?.trim() || '';
    if (!roomName) {
      const message = 'This booking does not include a Daily room name for recording.';
      setRecordingError(message);
      toast.error(message, { position: 'top-right', autoClose: 4000 });
      return;
    }

    const nextRecordingState = !isRecording;
    setRecordingLoading(true);
    setRecordingError('');
    setIsRecording(nextRecordingState);

    try {
      if (nextRecordingState) {
        await startDailyRecording(roomName);
      } else {
        await stopDailyRecording(roomName);
      }
    } catch (error) {
      setIsRecording(!nextRecordingState);
      const message = error instanceof Error ? error.message : 'Unable to update the recording state.';
      setRecordingError(message);
      toast.error(message, { position: 'top-right', autoClose: 4000 });
    } finally {
      setRecordingLoading(false);
    }
  };

  const appendMessageToState = (message: BookingChatMessage) => {
    const mapped = mapBookingChatMessage(message, currentUserId, currentUserName);
    setChatMessages((current) => {
      const exists = current.some((item) => item.id === mapped.id);
      if (exists) {
        return current.map((item) => (item.id === mapped.id ? mapped : item));
      }
      return [...current, mapped];
    });
  };

  const handleSendMessage = async () => {
    const cleanBody = chatInput.trim();
    if (!booking || !cleanBody) return;

    try {
      const sent = await sendBookingChatMessage({
        BookingId: booking.Id,
        SenderUserId: currentUserId,
        GuestName: currentUserName,
        Message: cleanBody,
      });
      appendMessageToState(sent);
      setChatInput('');
      setUnreadCount(0);
      await markBookingChatAsRead(booking.Id, currentUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send the message.';
      toast.error(message, { position: 'top-right', autoClose: 4000 });
    }
  };

  const handleChatKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setChatInput((current) => `${current}${current ? ' ' : ''}📎 ${file.name}`);
    event.target.value = '';
  };

  const handleEmojiSelector = (emoji: string) => {
    const actualEmoji = String.fromCodePoint(parseInt(emoji, 16));
    setChatInput((current) => `${current}${actualEmoji}`);
  };

  const requestMediaPermissions = async () => {
    if (!booking || bookingLoading || bookingError || isMeetingEnded) {
      return;
    }

    if (isRequestingMediaRef.current) {
      return;
    }

    isRequestingMediaRef.current = true;
    setMediaPermissionStatus('requesting');
    setMediaPermissionError('');
    setRoomError('');
    let cameraGranted = false;

    try {
      let callObject = await createCallObjectIfNeeded();
      if (!callObject) {
        throw new Error('Unable to initialize the Daily call object.');
      }

      const meetingState = callObject.meetingState();
      if (meetingState === 'left-meeting' || meetingState === 'error') {
        callObjectRef.current = null;

        try {
          await callObject.leave();
        } catch {
          // Ignore cleanup errors from stale Daily instances.
        }

        try {
          await callObject.destroy();
        } catch {
          // Ignore cleanup errors from stale Daily instances.
        }

        callObject = await createCallObjectIfNeeded();
        if (!callObject) {
          throw new Error('Unable to initialize the Daily call object.');
        }
      }

      const isAlreadyActive =
        meetingState === 'joining-meeting' ||
        meetingState === 'joined-meeting';

      if (!isAlreadyActive) {
        await callObject.startCamera({
          startVideoOff: false,
          startAudioOff: false,
        });
        cameraGranted = true;
        syncLocalMediaState(callObject);
        setMediaPermissionStatus('granted');
        await joinRoom(callObject);
      } else {
        callObject.setLocalAudio(true);
        callObject.setLocalVideo(true);
        cameraGranted = true;
        syncLocalMediaState(callObject);
        setMediaPermissionStatus('granted');
      }
    } catch (error) {
      const callObject = callObjectRef.current;
      callObjectRef.current = null;

      if (callObject) {
        try {
          await callObject.leave();
        } catch {
          // Ignore cleanup errors after permission failures.
        }

        try {
          await callObject.destroy();
        } catch {
          // Ignore cleanup errors after permission failures.
        }
      }

      const message = error instanceof Error ? error.message : 'Unable to access your camera and microphone.';
      setMediaPermissionStatus(
        cameraGranted
          ? 'granted'
          : message.toLowerCase().includes('permission') ||
            message.toLowerCase().includes('camera') ||
            message.toLowerCase().includes('microphone') ||
            message.toLowerCase().includes('media devices') ||
            message.toLowerCase().includes('not allowed')
            ? 'denied'
            : 'denied'
      );
      setMediaPermissionError(message);
      setRoomError(message);
      toast.error(message, { position: 'top-right', autoClose: 4500 });
    } finally {
      isRequestingMediaRef.current = false;
    }
  };

  const toggleMute = async () => {
    const callObject = callObjectRef.current;
    if (!callObject) return;

    const nextMutedState = !callObject.localAudio();

    try {
      await Promise.resolve(callObject.setLocalAudio(nextMutedState));
      syncDailyParticipants(callObject);
    } catch (error) {
      syncLocalMediaState(callObject);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to update the microphone.'
      );
    }
  };

  const toggleVideo = async () => {
    const callObject = callObjectRef.current;
    if (!callObject) return;

    const nextCameraState = !callObject.localVideo();

    try {
      await Promise.resolve(callObject.setLocalVideo(nextCameraState));
      syncDailyParticipants(callObject);
    } catch (error) {
      syncLocalMediaState(callObject);
      toast.error(
        error instanceof Error ? error.message : 'Unable to update the camera.'
      );
    }
  };

  const handleLeave = async () => {
    const callObject = callObjectRef.current;
    callObjectRef.current = null;

    try {
      await callObject?.leave();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to leave the meeting.'
      );
    } finally {
      try {
        await callObject?.destroy();
      } catch {
        // Ignore destroy failures during leave.
      }
      isJoiningRoomRef.current = false;
      isRequestingMediaRef.current = false;
      setRoomStatus('left');
      setIsSharingScreen(false);
      setParticipants([]);
      setDailyParticipants([]);
      setParticipantsError('');
      setParticipantsLoading(false);
      setMediaPermissionStatus('idle');
      setMediaPermissionError('');
    }
  };

  const toggleScreenShare = async () => {
    const callObject = callObjectRef.current;
    if (!callObject) return;

    try {
      if (isSharingScreen) {
        await callObject.stopScreenShare();
      } else {
        await callObject.startScreenShare();
      }
    } catch (error) {
      setIsSharingScreen(false);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to update screen sharing.'
      );
    }
  };

  const toggleChatPanel = () => {
    setIsChatOpen((current) => {
      const next = !current;
      if (next) {
        window.setTimeout(() => {
          chatInputRef.current?.focus();
        }, 0);
      }
      return next;
    });
  };

  const overlayCopy = (() => {
    if (bookingLoading) return { title: 'Loading booking', body: 'Fetching the booking details and Daily room information...' };
    if (bookingError) return { title: 'Booking unavailable', body: bookingError };
    if (isMeetingUpcoming) return { title: 'Meeting not started yet', body: `This meeting is scheduled for ${bookingScheduleLabel}. Please come back at the scheduled start time.` };
    if (isMeetingEnded) return { title: 'Meeting ended', body: `This meeting ended at ${formatDateTime(effectiveEndTime)}. If you need another session, please reschedule it.` };
    if (!bookingRoomIsReady) return { title: 'Room unavailable', body: 'This booking does not include the Daily room information needed to open video.' };
    if (mediaPermissionStatus === 'requesting') {
      return {
        title: 'Requesting access',
        body: 'Please allow camera and microphone access in your browser prompt.',
      };
    }
    if (mediaPermissionStatus === 'denied') {
      return {
        title: 'Enable camera and microphone',
        body:
          mediaPermissionError ||
          'Allow access to your camera and microphone to join the meeting.',
      };
    }
    if (mediaPermissionStatus !== 'granted') {
      return {
        title: 'Enable camera and microphone',
        body: 'Allow access to your camera and microphone to join the meeting.',
      };
    }
    if (roomStatus === 'error') {
      if (roomError && isCameraMicPermissionError(roomError)) {
        return {
          title: 'Unblock your camera and mic',
          body:
            'Your browser needs camera and microphone access. Click the camera icon in the address bar, choose Always allow, then reload the page.',
        };
      }

      return { title: 'Connection error', body: roomError || 'Unable to connect to the live room.' };
    }
    if (roomStatus === 'left') return { title: 'Meeting closed', body: 'You have left the meeting. Rejoin only if the session is still within its scheduled time window.' };
    if (roomStatus === 'joined' || roomStatus === 'idle') return null;
    return { title: 'Live session', body: 'Your Daily room is being prepared. It should be ready in a few seconds.' };
  })();

  const toggleTheme = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return {
    booking,
    bookingLoading,
    bookingError,
    roomStatus,
    roomError,
    themeMode,
    theme,
    sidebarTab,
    setSidebarTab,
    bottomTab,
    setBottomTab,
    isMuted,
    isCameraOff,
    isSharingScreen,
    isChatOpen,
    chatMessages,
    chatInput,
    setChatInput,
    chatLoading,
    chatError,
    participantsLoading,
    participantsError,
    transcriptLoading,
    transcriptError,
    recordingLoading,
    recordingError,
    isRecording,
    mediaPermissionStatus,
    mediaPermissionError,
    manualExtensionSeconds,
    incomingRescheduleRequest,
    rescheduleActionLoading,
    rescheduleActionError,
    rescheduleActionMessage,
    rescheduleActionMessageType,
    participantActions,
    unreadCount,
    currentUserId,
    currentUserName,
    isHost,
    participants,
    dailyParticipants,
    activeEndTime,
    remainingSeconds: displayedRemainingSeconds,
    bookingScheduleLabel,
    bookingDocumentUrl,
    bookingDocuments,
    selectedDocumentUrl,
    setSelectedDocumentUrl,
    hasPreviousDocument,
    hasNextDocument,
    goToPreviousDocument,
    goToNextDocument,
    bookingPurpose,
    bookingTitle,
    bookingStatusLabel,
    paymentStatusLabel,
    dailyRoomName,
    bookingRoomIsReady,
    isMeetingUpcoming,
    isMeetingEnded,
    isMeetingEndingSoon,
    overlayCopy,
    chatInputRef,
    fileInputRef,
    toggleMute,
    toggleVideo,
    handleLeave,
    toggleScreenShare,
    toggleChatPanel,
    extendMeeting,
    openMeetingDetails,
    openCurrentDocument,
    viewParticipantProfile,
    toggleParticipantMute,
    toggleParticipantVideo,
    toggleRecording,
    handleSendMessage,
    handleChatKeyDown,
    handleAttachFile,
    toggleTheme,
    handleEmojiSelector,
    requestMediaPermissions,
    liveTranscript,
    acceptRescheduleRequest: () => respondToRescheduleRequest('accepted'),
    rejectRescheduleRequest: () => respondToRescheduleRequest('rejected'),
    clearRescheduleActionMessage: () => {
      setRescheduleActionMessage('');
      setRescheduleActionMessageType('');
    },
  };
}

function mapBookingChatMessage(
  message: BookingChatMessage,
  currentUserId: string,
  currentUserName: string
): ChatMessage {
  const isMine = Boolean(currentUserId && message.SenderUserId && message.SenderUserId === currentUserId);
  const author = isMine
    ? currentUserName || message.SenderName || message.GuestName || 'You'
    : message.SenderName || message.GuestName || 'Participant';

  return {
    id: message.Id,
    author,
    target: 'to Everyone',
    time: message.TimeStatus || formatDateTime(message.CreatedAt),
    body: message.Message,
    avatar: getInitials(author),
    isMine,
    raw: message,
  };
}

function parseBookingPayload(payload: unknown): BookingChatMessage | null {
  const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!data || typeof data !== 'object') return null;

  const candidate = data as Partial<BookingChatMessage> & {
    id?: string;
    message?: string;
    senderName?: string;
    senderUserId?: string;
    bookingId?: string;
    createdAt?: string;
    timeStatus?: string;
  };

  const id = candidate.Id || candidate.id;
  const bookingId = candidate.BookingId || candidate.bookingId;
  const message = candidate.Message || candidate.message;

  if (!id || !bookingId || !message) {
    return null;
  }

  return {
    Id: id,
    BookingId: bookingId,
    SenderUserId: candidate.SenderUserId || candidate.senderUserId || null,
    SenderName: candidate.SenderName || candidate.senderName || null,
    GuestName: candidate.GuestName || null,
    GuestEmail: candidate.GuestEmail || null,
    Message: message,
    MessageType: candidate.MessageType || 'text',
    AttachmentUrl: candidate.AttachmentUrl || null,
    IsRead: Boolean(candidate.IsRead),
    ReadAt: candidate.ReadAt || null,
    IsEdited: Boolean(candidate.IsEdited),
    EditedAt: candidate.EditedAt || null,
    IsDeleted: Boolean(candidate.IsDeleted),
    CreatedAt: candidate.CreatedAt || candidate.createdAt || new Date().toISOString(),
    TimeStatus: candidate.TimeStatus || candidate.timeStatus,
  };
}
