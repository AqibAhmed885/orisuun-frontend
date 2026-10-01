import type { Dispatch, SetStateAction } from 'react';
import type { BookingRecord, BookingRescheduleRequestRecord } from '@/lib/booking';
import type { BookingChatMessage } from '@/lib/booking-chat';

export type DailyLiveRoomProps = {
  bookingId: string;
  preferredUserName?: string;
  preferredIsHost?: boolean;
  debugRemainingSeconds?: number;
};

export type RoomStatus = 'idle' | 'loading' | 'joining' | 'joined' | 'left' | 'error';
export type SidebarTab = 'documents' | 'scope';
export type BottomTab = 'participants' | 'transcript';
export type MeetingWindowState = 'upcoming' | 'live' | 'ended';

export type Participant = {
  id: string;
  name: string;
  avatar: string;
  joined: string;
  detail: string;
  isLocal: boolean;
  isOwner: boolean;
};

export type ParticipantActionState = {
  muted: boolean;
  videoOff: boolean;
};

export type BookingDocumentItem = {
  url: string;
  name: string;
  kind: 'image' | 'pdf' | 'file';
};

export type ChatMessage = {
  id: string;
  author: string;
  target: string;
  time: string;
  body: string;
  avatar: string;
  isMine: boolean;
  raw: BookingChatMessage;
};

export type LiveTranscriptEntry = {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  avatar: string;
};

export type BookingRoomState = {
  booking: BookingRecord | null;
  bookingLoading: boolean;
  bookingError: string;
  roomStatus: RoomStatus;
  roomError: string;
  themeMode: 'light' | 'dark';
  sidebarTab: SidebarTab;
  bottomTab: BottomTab;
  isMuted: boolean;
  isCameraOff: boolean;
  isSharingScreen: boolean;
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  chatInput: string;
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
  unreadCount: number;
  currentUserName: string;
  currentUserId: string;
  participants: Participant[];
  activeEndTime: string | null;
  remainingSeconds: number;
  meetingScheduleLabel: string;
  bookingDocumentUrl: string;
  bookingDocuments: BookingDocumentItem[];
  selectedDocumentUrl: string;
  setSelectedDocumentUrl: Dispatch<SetStateAction<string>>;
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
  containerRef: React.RefObject<HTMLDivElement | null>;
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
