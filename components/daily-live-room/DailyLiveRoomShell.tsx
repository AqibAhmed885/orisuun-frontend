'use client';

import type { ReactNode } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mic,
  MicOff,
  Plus,
  X,
  UserRound,
  Video,
  VideoOff,
} from 'lucide-react';
import { Slide, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';

import EmojiPicker from '@/components/ui/emoji-picker';
import ThemeToggle from './ThemeToggle';
import ControlButton from './ControlButton';
import ChatBubble from './ChatBubble';
import DetailCard from './DetailCard';
import {
  formatDateTime,
  formatDuration,
  getFileNameFromUrl,
  isImageUrl,
  isPdfUrl,
} from './live-room-utils';
import type { DailyLiveRoomViewModel } from './useDailyLiveRoom';
import DailyParticipantTile from './DailyParticipantTile';

type Props = DailyLiveRoomViewModel & {
  toastContainer?: ReactNode;
};

type BookingSummary = {
  Id?: string | null;
  MeetingType?: string | null;
  MeetingDurationMinutes?: number | null;
  ScheduledStartTime?: string | null;
  ScheduledEndTime?: string | null;
  ActualStartTime?: string | null;
  ActualEndTime?: string | null;
  MeetingPurpose?: string | null;
  Status?: string | null;
  TotalPrice?: number | null;
  Currency?: string | null;
  IsPaid?: boolean | null;
  IsRefunded?: boolean | null;
  RefundAmount?: number | null;
  DailyRoomId?: string | null;
  DailyRoomName?: string | null;
};

function toSafeValue(value: unknown, fallback = '—') {
  if (value === null || value === undefined) return fallback;
  const stringValue = String(value).trim();
  return stringValue || fallback;
}

function toSafeText(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  try {
    const json = JSON.stringify(value);
    return json && json !== '{}' ? json : fallback;
  } catch {
    return fallback;
  }
}

export default function DailyLiveRoomShell(props: Props) {
  const {
    theme,
    toastContainer,
    themeMode,
    setSidebarTab,
    sidebarTab,
    bottomTab,
    setBottomTab,
    isMuted,
    isCameraOff,
    isSharingScreen,
    isChatOpen,
    unreadCount,
    currentUserName,
    isHost,
    dailyParticipants,
    overlayCopy,
    roomStatus,
    isMeetingUpcoming,
    isMeetingEnded,
    bookingTitle,
    bookingScheduleLabel,
    bookingRoomIsReady,
    bookingLoading,
    bookingError,
    toggleMute,
    toggleVideo,
    handleLeave,
    toggleScreenShare,
    toggleChatPanel,
    participants,
    participantActions,
    viewParticipantProfile,
    toggleParticipantMute,
    toggleParticipantVideo,
    remainingSeconds,
    extendMeeting,
    bookingDocumentUrl,
    bookingDocuments,
    selectedDocumentUrl,
    hasPreviousDocument,
    hasNextDocument,
    goToPreviousDocument,
    goToNextDocument,
    openCurrentDocument,
    bookingPurpose,
    dailyRoomName,
    isMeetingEndingSoon,
    openMeetingDetails,
    chatError,
    chatLoading,
    chatMessages,
    chatInputRef,
    fileInputRef,
    participantsLoading,
    participantsError,
    transcriptLoading,
    transcriptError,
    recordingLoading,
    recordingError,
    isRecording,
    mediaPermissionStatus,
    mediaPermissionError,
    incomingRescheduleRequest,
    rescheduleActionLoading,
    rescheduleActionMessage,
    rescheduleActionMessageType,
    handleAttachFile,
    chatInput,
    setChatInput,
    handleChatKeyDown,
    handleSendMessage,
    handleEmojiSelector,
    requestMediaPermissions,
    booking,
    liveTranscript,
    toggleRecording,
    acceptRescheduleRequest,
    rejectRescheduleRequest,
  } = props;


  const documentPreviewUrl = selectedDocumentUrl || bookingDocumentUrl || '';
  const hasDocuments = bookingDocuments.length > 0 && Boolean(documentPreviewUrl);

  const [isEndingSoonPopupDismissed, setIsEndingSoonPopupDismissed] = useState(false);

  useEffect(() => {
    if (!isMeetingEndingSoon) {
      setIsEndingSoonPopupDismissed(false);
    }
  }, [isMeetingEndingSoon]);

  const showEndingSoonPopup = isMeetingEndingSoon && !isEndingSoonPopupDismissed;

  return (
    <section
      className={`min-h-screen w-full transition-colors duration-300 ${theme.page} ${theme.text}`}
    >
      {toastContainer ?? (
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          transition={Slide}
        />
      )}

      <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-6 md:py-8">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.8fr)_420px]">
          <div className="space-y-3">
            <div
              className={`rounded-[18px] border px-6 py-5 transition-colors ${theme.panel} ${theme.border} ${theme.cardShadow}`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xl font-semibold tracking-normal">
                    {bookingTitle}
                  </p>
                  <p className={`mt-1 text-sm ${theme.softText}`}>
                    {bookingScheduleLabel}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ThemeToggle mode={themeMode} onToggle={props.toggleTheme} />
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden rounded-[18px] border transition-colors ${theme.panel} ${theme.border} ${theme.cardShadow}`}
            >
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                {bookingRoomIsReady &&
                !bookingLoading &&
                !bookingError &&
                !isMeetingUpcoming &&
                !isMeetingEnded &&
                (roomStatus === 'idle' ||
                  mediaPermissionStatus === 'requesting' ||
                  mediaPermissionStatus === 'denied') ? (
                  <div className="absolute inset-0 z-30 flex items-center justify-center px-5 py-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
                    <div className="relative z-10 w-full max-w-[480px] rounded-[24px] border border-white/50 bg-white/95 p-6 text-center shadow-2xl">
                      {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5bd1]">
                        Enable camera and microphone
                      </p> */}
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                        {mediaPermissionStatus === 'requesting'
                          ? 'Requesting access...'
                          : 'Allow access to join the meeting'}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Allow access to your camera and microphone to join the meeting.
                      </p>
                      {mediaPermissionError ? (
                        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700">
                          {toSafeText(mediaPermissionError, 'Unable to access your camera and microphone.')}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void requestMediaPermissions()}
                        disabled={mediaPermissionStatus === 'requesting'}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#2d5bd1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244db0] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {mediaPermissionStatus === 'requesting'
                          ? 'Requesting access...'
                          : 'Enable camera and microphone'}
                      </button>
                    </div>
                  </div>
                ) : null}

                {roomStatus === 'joined' && dailyParticipants.length > 0 ? (
                  <div
                    className={`grid h-full gap-2 p-2 pb-24 ${dailyParticipants.length === 1
                        ? 'grid-cols-1'
                        : dailyParticipants.length <= 4
                          ? 'grid-cols-1 md:grid-cols-2'
                          : 'grid-cols-2 lg:grid-cols-3'
                      }`}
                  >
                    {dailyParticipants.map((participant) => (
                      <DailyParticipantTile
                        key={participant.session_id}
                        participant={participant}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex h-full items-center justify-center bg-cover bg-center bg-no-repeat p-6 text-center text-omblue-900"
                    style={{ backgroundImage: "url('/loader-logo.svg')" }}
                  >
                      <div className="rounded-2xl bg-black/55 border border-white/50  px-5 py-6 backdrop-blur-sm">
                      <p className="text-lg font-semibold">
                        {roomStatus === 'error'
                          ? 'Connection error'
                          : isMeetingEnded
                            ? 'Meeting ended'
                            : isMeetingUpcoming
                              ? 'Meeting not started'
                              : roomStatus === 'left'
                                ? 'You left the meeting'
                                : 'Joining meeting...'}
                      </p>
                      {overlayCopy?.body ? (
                        <p className="mt-2 max-w-md text-sm text-gray-600">
                          {toSafeText(overlayCopy.body, '')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                <div
                  className={`absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-4 bg-[#030811D4] px-4 py-1 text-white md:flex-row md:items-center md:justify-between md:px-6 ${theme.videoBar}`}
                >
                  <div className="hidden min-w-[120px] md:block">
                    <p className="text-base font-medium">{currentUserName}</p>
                    <p className="text-xs text-white/70">
                      {isHost ? 'Host' : 'Participant'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <ControlButton
                      label={isMuted ? 'Unmute' : 'Mute'}
                      active={isMuted}
                      onClick={() => void toggleMute()}
                      icon={
                        isMuted ? (
                          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.26137 1.07953C1.93528 0.753439 1.40659 0.753439 1.0805 1.07953C0.754416 1.40561 0.754416 1.93431 1.0805 2.2604L6.68094 7.86083V10.02C6.68094 11.8646 8.17631 13.36 10.0209 13.36C10.64 13.36 11.2203 13.1911 11.7175 12.8974L12.9238 14.1037C12.1049 14.687 11.103 15.03 10.0209 15.03C7.25399 15.03 5.01094 12.7869 5.01094 10.02V8.34996C5.01094 7.8888 4.6371 7.51496 4.17594 7.51496C3.71478 7.51496 3.34094 7.8888 3.34094 8.34996V10.02C3.34094 13.4264 5.89077 16.2374 9.18594 16.6483V17.535H6.68094C6.21978 17.535 5.84594 17.9088 5.84594 18.37C5.84594 18.8311 6.21978 19.205 6.68094 19.205H13.3609C13.8221 19.205 14.1959 18.8311 14.1959 18.37C14.1959 17.9088 13.8221 17.535 13.3609 17.535H10.8559V16.6483C12.0756 16.4962 13.1932 16.0153 14.1172 15.297L17.7805 18.9604C18.1066 19.2865 18.6353 19.2865 18.9614 18.9604C19.2875 18.6343 19.2875 18.1056 18.9614 17.7795L15.298 14.1162C16.1773 12.985 16.7009 11.5636 16.7009 10.02V8.34996C16.7009 7.8888 16.3271 7.51496 15.8659 7.51496C15.4048 7.51496 15.0309 7.8888 15.0309 8.34996V10.02C15.0309 11.102 14.6879 12.1039 14.1047 12.9229L10.1501 8.96808C7.52065 6.33844 4.8912 3.7088 2.26137 1.07953Z" fill="#E24C57" />
                            <path d="M13.3609 9.81736V4.17496C13.3609 2.33033 11.8656 0.834961 10.0209 0.834961C8.49237 0.834961 7.20363 1.86179 6.80688 3.2633L13.3609 9.81736Z" fill="#E24C57" />
                          </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_1256_68432)">
                                <path d="M5.32812 2.90625C5.32812 1.56868 6.41244 0.484375 7.75 0.484375C9.08756 0.484375 10.1719 1.56869 10.1719 2.90625V8.23438C10.1719 9.57194 9.08756 10.6562 7.75 10.6562C6.41244 10.6562 5.32812 9.57194 5.32812 8.23438V2.90625Z" fill="white" />
                                <path d="M3.875 6.78125C4.14251 6.78125 4.35938 6.99811 4.35938 7.26562V8.23438C4.35938 10.107 5.87741 11.625 7.75 11.625C9.62259 11.625 11.1406 10.107 11.1406 8.23438V7.26562C11.1406 6.99811 11.3575 6.78125 11.625 6.78125C11.8925 6.78125 12.1094 6.99811 12.1094 7.26562V8.23438C12.1094 10.4783 10.414 12.3262 8.23438 12.5671V14.0469H10.1719C10.4394 14.0469 10.6562 14.2637 10.6562 14.5312C10.6562 14.7988 10.4394 15.0156 10.1719 15.0156H5.32812C5.06061 15.0156 4.84375 14.7988 4.84375 14.5312C4.84375 14.2637 5.06061 14.0469 5.32812 14.0469H7.26562V12.5671C5.08596 12.3262 3.39062 10.4783 3.39062 8.23438V7.26562C3.39062 6.99811 3.60749 6.78125 3.875 6.78125Z" fill="white" />
                              </g>
                              <defs>
                                <clipPath id="clip0_1256_68432">
                                  <rect width="15.5" height="15.5" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>

                        )
                      }
                    />

                    <ControlButton
                      label={isCameraOff ? 'Start video' : 'Stop video'}
                      active={isCameraOff}
                      onClick={() => void toggleVideo()}
                      icon={
                        isCameraOff ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.1719 6.78125L13.22 3.73313C13.5251 3.42799 14.0469 3.6441 14.0469 4.07563V11.4244C14.0469 11.8559 13.5251 12.072 13.22 11.7669L10.1719 8.71875M7.75 12.1094H2.90625C2.10371 12.1094 1.45312 11.4588 1.45312 10.6562V5.8125M9.74626 11.6838L10.6562 12.5938M9.74626 11.6838C10.0092 11.4208 10.1719 11.0575 10.1719 10.6562V4.84375C10.1719 4.04121 9.52129 3.39062 8.71875 3.39062H2.90625C2.50498 3.39062 2.1417 3.55327 1.87874 3.81624M9.74626 11.6838L1.87874 3.81624M0.96875 2.90625L1.87874 3.81624" stroke="white" stroke-width="0.96875" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        ) : (
                          <Video className="h-3 w-3" />
                        )
                      }
                    />

                    <ControlButton
                      label="Leave"
                      onClick={() => void handleLeave()}
                      danger
                      icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.0938 9.37158L16.751 9.25732C15.2582 8.75979 13.654 8.50146 12.002 8.50146C10.3497 8.50151 8.74719 8.76033 7.24707 9.24658L6.90137 9.35889V12.8228C6.9013 13.0181 6.78348 13.1952 6.62305 13.2729L6.61816 13.2759C5.59299 13.7885 4.66398 14.4459 3.8418 15.2056L3.83398 15.2124L3.82715 15.2192C3.74701 15.2994 3.62684 15.353 3.48047 15.353C3.33466 15.3529 3.2113 15.2967 3.12402 15.2095L0.638672 12.7241L0.579102 12.6528C0.561682 12.6272 0.547079 12.5996 0.535156 12.5708C0.51144 12.5135 0.499127 12.4522 0.5 12.3901V12.3823C0.500045 12.2381 0.555023 12.1159 0.640625 12.0288C3.6016 9.22627 7.59799 7.50159 12.002 7.50146C16.4059 7.50146 20.4023 9.22644 23.3633 12.0288C23.4491 12.116 23.5048 12.2379 23.5049 12.3823C23.5049 12.5281 23.4485 12.6514 23.3613 12.7388L20.8809 15.2192C20.7936 15.3065 20.6702 15.3627 20.5244 15.3628C20.3899 15.3628 20.2601 15.3072 20.167 15.2192L20.165 15.2173L19.8477 14.9321C19.2043 14.3743 18.5022 13.8883 17.7539 13.4819L17.376 13.2847L17.3721 13.2837L17.3115 13.2485C17.254 13.2096 17.2049 13.1585 17.168 13.0991C17.1187 13.0198 17.0933 12.9278 17.0938 12.8345V9.37158Z" stroke="white" />
                      </svg>
}
                    />

                    <ControlButton
                      label={isSharingScreen ? 'Stop share' : 'Share'}
                      active={isSharingScreen}
                      onClick={() => void toggleScreenShare()}
                      icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.8125 11.1406V11.7912C5.8125 12.3051 5.60837 12.7979 5.24502 13.1612L4.84375 13.5625H10.6562L10.255 13.1612C9.89163 12.7979 9.6875 12.3051 9.6875 11.7912V11.1406M13.5625 3.39062V9.6875C13.5625 10.49 12.9119 11.1406 12.1094 11.1406H3.39062C2.58809 11.1406 1.9375 10.49 1.9375 9.6875V3.39062M13.5625 3.39062C13.5625 2.58809 12.9119 1.9375 12.1094 1.9375H3.39062C2.58809 1.9375 1.9375 2.58809 1.9375 3.39062M13.5625 3.39062V7.75C13.5625 8.55254 12.9119 9.20312 12.1094 9.20312H3.39062C2.58809 9.20312 1.9375 8.55254 1.9375 7.75V3.39062" stroke="white" stroke-width="0.96875" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
}
                    />

                    <ControlButton
                      label={isRecording ? 'Stop rec' : 'Record'}
                      active={isRecording}
                      danger={isRecording}
                      disabled={recordingLoading || !isHost}
                      onClick={() => void toggleRecording()}
                      icon={
                        <span className="relative inline-flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_1256_68449)">
                              <path d="M7.75 0C6.2172 0 4.71881 0.45453 3.44433 1.30611C2.16985 2.15769 1.17652 3.36808 0.589937 4.7842C0.00335797 6.20033 -0.150118 7.7586 0.148918 9.26195C0.447953 10.7653 1.18607 12.1462 2.26993 13.2301C3.35378 14.3139 4.7347 15.0521 6.23805 15.3511C7.74141 15.6501 9.29967 15.4966 10.7158 14.9101C12.1319 14.3235 13.3423 13.3302 14.1939 12.0557C15.0455 10.7812 15.5 9.28281 15.5 7.75C15.4978 5.69525 14.6806 3.7253 13.2276 2.27238C11.7747 0.819452 9.80475 0.00222237 7.75 0V0ZM7.75 14.2083C6.47267 14.2083 5.22401 13.8296 4.16195 13.1199C3.09988 12.4103 2.2721 11.4016 1.78328 10.2215C1.29447 9.04139 1.16657 7.74284 1.41577 6.49004C1.66496 5.23725 2.28006 4.08648 3.18327 3.18327C4.08649 2.28005 5.23725 1.66496 6.49005 1.41576C7.74284 1.16657 9.04139 1.29446 10.2215 1.78328C11.4016 2.27209 12.4103 3.09987 13.1199 4.16194C13.8296 5.22401 14.2083 6.47266 14.2083 7.75C14.2065 9.46228 13.5254 11.1039 12.3147 12.3147C11.1039 13.5254 9.46228 14.2065 7.75 14.2083Z" fill="white" />
                              <path d="M7.75065 4.52051C7.11198 4.52051 6.48766 4.7099 5.95662 5.06472C5.42559 5.41955 5.0117 5.92387 4.76729 6.51393C4.52288 7.10398 4.45894 7.75326 4.58353 8.37965C4.70813 9.00605 5.01568 9.58143 5.46729 10.033C5.91889 10.4846 6.49428 10.7922 7.12067 10.9168C7.74707 11.0414 8.39635 10.9774 8.9864 10.733C9.57645 10.4886 10.0808 10.0747 10.4356 9.5437C10.7904 9.01267 10.9798 8.38834 10.9798 7.74967C10.9788 6.89356 10.6382 6.07281 10.0329 5.46744C9.42752 4.86208 8.60677 4.52153 7.75065 4.52051ZM7.75065 9.68717C7.36745 9.68717 6.99286 9.57354 6.67423 9.36065C6.35561 9.14775 6.10728 8.84516 5.96064 8.49112C5.81399 8.13709 5.77562 7.74753 5.85038 7.37169C5.92514 6.99585 6.10967 6.65062 6.38063 6.37966C6.6516 6.10869 6.99683 5.92416 7.37267 5.8494C7.7485 5.77464 8.13807 5.81301 8.4921 5.95966C8.84613 6.1063 9.14873 6.35464 9.36162 6.67326C9.57452 6.99188 9.68815 7.36647 9.68815 7.74967C9.68815 8.26353 9.48402 8.75634 9.12067 9.11969C8.75732 9.48305 8.26451 9.68717 7.75065 9.68717Z" fill="white" />
                              <path d="M7.74935 8.39617C8.10604 8.39617 8.39519 8.10702 8.39519 7.75033C8.39519 7.39364 8.10604 7.10449 7.74935 7.10449C7.39267 7.10449 7.10352 7.39364 7.10352 7.75033C7.10352 8.10702 7.39267 8.39617 7.74935 8.39617Z" fill="white" />
                            </g>
                            <defs>
                              <clipPath id="clip0_1256_68449">
                                <rect width="15.5" height="15.5" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          {isRecording ? (
                            <span className="absolute h-2 w-2 rounded-full bg-red-500" />
                          ) : null}
                        </span>
                      }
                    />

                    
                  </div>

                  <div className="flex min-w-[120px] flex-col items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={openMeetingDetails}
                      className="inline-flex items-center rounded-full bg-[#2d5bd1] p-2 font-medium text-white"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 5.625V7.96875M13.125 7.5C13.125 10.6066 10.6066 13.125 7.5 13.125C4.3934 13.125 1.875 10.6066 1.875 7.5C1.875 4.3934 4.3934 1.875 7.5 1.875C10.6066 1.875 13.125 4.3934 13.125 7.5ZM7.5 9.84375H7.50469V9.84844H7.5V9.84375Z" stroke="white" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>
                    Details
                  </div>
                </div>
              </div>
            </div>

            {recordingError ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {recordingError}
              </p>
            ) : null}

            <div
              className={`grid rounded-[8px] border p-1 transition-colors md:grid-cols-2 ${theme.mutedPanel} ${theme.border}`}
            >
              <button
                type="button"
                onClick={() => setBottomTab('participants')}
                className={`rounded-[8px] px-4 py-1.5 text-sm font-medium transition ${bottomTab === 'participants'
                  ? `${theme.panel} ${theme.text}`
                  : theme.tabIdle
                  }`}
              >
                Participants
              </button>

              <button
                type="button"
                onClick={() => setBottomTab('transcript')}
                className={`rounded-[8px] px-4 py-1.5 text-sm font-medium transition ${bottomTab === 'transcript'
                  ? `${theme.panel} ${theme.text}`
                  : theme.tabIdle
                  }`}
              >
                Live Transcript
              </button>
            </div>

            {bottomTab === 'participants' ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Participants
                  </h2>
                  <p className={`text-xs ${theme.softText}`}>
                    {participants.length} connected
                  </p>
                </div>

                <div
                  className={`mt-6 overflow-hidden rounded-[16px] border ${theme.panel} ${theme.border} ${theme.cardShadow}`}
                >
                  <div
                    className={`grid grid-cols-[1.2fr_1fr_1fr] gap-4 border-b bg-gray-50 px-6 py-4 text-xs font-medium dark:bg-black/20 ${theme.softText} ${theme.border}`}
                  >
                    <p>Participant name</p>
                    <p>Status</p>
                    <p>Action</p>
                  </div>

                  <div className="divide-y divide-inherit">
                    {participantsLoading ? (
                      <div className={`px-6 py-8 text-sm ${theme.softText}`}>
                        Loading live participants...
                      </div>
                    ) : participantsError ? (
                      <div className="px-6 py-8 text-sm text-amber-700">
                        {participantsError}
                      </div>
                    ) : participants.length === 0 ? (
                      <div className={`px-6 py-8 text-sm ${theme.softText}`}>
                        No one has joined this meeting yet.
                      </div>
                    ) : (
                      participants.map((participant) => {
                        const currentParticipantAction = participantActions[
                          participant.id
                        ] || {
                          muted: false,
                          videoOff: false,
                        };

                        return (
                          <div
                            key={participant.id}
                            className={`grid gap-4 px-6 py-5 md:grid-cols-[1.2fr_1fr_1fr] ${theme.border}`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase ${participant.isLocal
                                  ? 'bg-[#2d5bd1] text-white'
                                  : 'bg-slate-200 text-slate-700'
                                  }`}
                                aria-hidden="true"
                              >
                                {participant.avatar}
                              </div>

                              <div>
                                <p className="text-sm font-semibold">
                                  {participant.name}
                                </p>
                                <p className={`text-sm ${theme.softText}`}>
                                  {participant.detail}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              {participant.joined}
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => viewParticipantProfile(participant)}
                                className="inline-flex items-center gap-2 rounded-md bg-[#2d5bd1] px-3 py-1.5 text-sm font-medium text-white"
                              >
                                <UserRound className="h-4 w-4" />
                                View profile
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleParticipantMute(participant.id)}
                                aria-pressed={currentParticipantAction.muted}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FFE3E8] text-[#f44336]"
                              >
                                {currentParticipantAction.muted ? (
                                  <MicOff className="h-4 w-4" />
                                ) : (
                                  <Mic className="h-4 w-4" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleParticipantVideo(participant.id)}
                                aria-pressed={currentParticipantAction.videoOff}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FFE3E8] text-[#f44336]"
                              >
                                {currentParticipantAction.videoOff ? (
                                  <VideoOff className="h-4 w-4" />
                                ) : (
                                  <Video className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-[16px] border p-6 transition-colors ${theme.panel} ${theme.border} ${theme.cardShadow}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xs font-semibold tracking-tight">
                    Live Transcript
                  </h2>
                  <p className={`text-[11px] ${theme.softText}`}>
                    {liveTranscript.length} entries
                  </p>
                </div>

                {transcriptLoading ? (
                  <p className={`mt-4 text-xs leading-6 ${theme.softText}`}>
                    Loading live transcript...
                  </p>
                ) : transcriptError ? (
                  <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                    {transcriptError}
                  </div>
                ) : liveTranscript.length === 0 ? (
                  <p className={`mt-4 text-xs leading-6 ${theme.softText}`}>
                    No live transcript has been received yet.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {liveTranscript.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-[14px] border px-4 py-3 ${theme.mutedPanel} ${theme.border}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d5bd1] text-xs font-semibold text-white">
                            {entry.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{entry.speaker}</p>
                            <p className={`text-[11px] ${theme.softText}`}>
                              {entry.timestamp || 'Live'}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6">{entry.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div
              className={`relative rounded-[18px] border p-4 transition-colors ${theme.panel} ${theme.border} ${theme.cardShadow}`}
            >
              {showEndingSoonPopup ? (
                <div
                  className="fixed  z-[999] top-4 right-4 flex items-center justify-center "
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="ending-soon-title"
                >
                  <div
                    className={`relative w-full max-w-[400px] rounded-[24px] border px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] ${theme.panel} ${theme.border}`}
                  >
                    <button
                      type="button"
                      aria-label="Dismiss ending soon popup"
                      onClick={() => setIsEndingSoonPopupDismissed(true)}
                      className={`absolute right-5 top-5 inline-flex h-5 w-5 items-center justify-center rounded-full `}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                      <h3
                        id="ending-soon-title"
                        className={`mt-4 text-xl font-semibold leading-tight md:text-2xl ${theme.text}`}
                      >
                        Your meeting is about to end
                      </h3>
                      <p className={`mt-2 max-w-[420px] text-sm leading-7 md:text-base ${theme.softText}`}>
                        You have about 5 minutes left. Extend your session if you need more time.
                      </p>

                      <p className="mt-5 text-3xl font-semibold  text-rose-600 md:text-[40px]">
                        {formatDuration(remainingSeconds)}
                      </p>

                      <div className="mt-5 flex w-full flex-col gap-3">
                        <button
                          type="button"
                          onClick={() => void extendMeeting(10)}
                          disabled={rescheduleActionLoading}
                          className="w-full rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-4 py-4 text-base font-medium text-[#101828] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          extend 10 min
                        </button>

                        <button
                          type="button"
                          onClick={() => void extendMeeting(20)}
                          disabled={rescheduleActionLoading}
                          className="w-full rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-4 py-4 text-base font-medium text-[#101828] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          extend 20 min
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className={`py-4 text-2xl font-semibold md:text-[40px] ${theme.text}`}>
                      {formatDuration(remainingSeconds)}
                    </p>

                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => void extendMeeting(10)}
                      disabled={rescheduleActionLoading}
                      className="flex-1 rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-4 py-3 text-sm font-medium text-[#101828] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      extend 10 min
                    </button>

                    <button
                      type="button"
                      onClick={() => void extendMeeting(20)}
                      disabled={rescheduleActionLoading}
                      className="flex-1 rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-4 py-3 text-sm font-medium text-[#101828] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      extend 20 min
                    </button>
                  </div>
                </>
              )}
            </div>

            <div
              className={`rounded-[18px] border p-3 transition-colors ${theme.panel} ${theme.border} ${theme.cardShadow}`}
            >
              <div className={`grid rounded-[8px] border p-1 ${theme.mutedPanel} ${theme.border}`}>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSidebarTab('documents')}
                    className={`rounded-[6px] px-4 py-2 text-sm font-medium ${sidebarTab === 'documents'
                      ? `${theme.panel} ${theme.text}`
                      : theme.tabIdle
                      }`}
                  >
                    Documents
                  </button>

                  <button
                    type="button"
                    onClick={() => setSidebarTab('scope')}
                    className={`rounded-[6px] px-4 py-2 text-sm font-medium ${sidebarTab === 'scope'
                      ? `${theme.panel} ${theme.text}`
                      : theme.tabIdle
                      }`}
                  >
                    Scope
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[12px]">
                {sidebarTab === 'documents' ? (
                  <div>

                    <div className={`overflow-hidden aspect-[320/280] rounded-[12px] border ${theme.border}`}>
                      {hasDocuments ? (
                        <div className="relative ">
                          <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={goToPreviousDocument}
                              disabled={!hasPreviousDocument}
                              aria-label="Previous document"
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${hasPreviousDocument
                                ? 'border-white/40 bg-gray-950/55 text-white hover:bg-gray-950/70'
                                : 'cursor-not-allowed border-white/20 bg-gray-950/25 text-white/40'
                                }`}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={goToNextDocument}
                              disabled={!hasNextDocument}
                              aria-label="Next document"
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${hasNextDocument
                                ? 'border-white/40 bg-gray-950/55 text-white hover:bg-gray-950/70'
                                : 'cursor-not-allowed border-white/20 bg-gray-950/25 text-white/40'
                                }`}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          {isPdfUrl(documentPreviewUrl) ? (
                            <iframe
                              src={documentPreviewUrl}
                              title="Booking document"
                              className="h-full w-full bg-white"
                            />
                          ) : isImageUrl(documentPreviewUrl) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={documentPreviewUrl}
                              alt="Booking document"
                              className="h-full w-full bg-white object-cover"
                            />
                          ) : (
                            <div
                              className={`flex h-full flex-col items-center justify-center px-6 text-center ${theme.mutedPanel}`}
                            >
                              <FileText className="h-8 w-8 text-slate-400" />
                              <p className="mt-3 text-sm font-semibold">
                                {getFileNameFromUrl(documentPreviewUrl) ||
                                  'Document attached'}
                              </p>
                              <p className={`mt-2 break-all text-xs ${theme.softText}`}>
                                {documentPreviewUrl}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`flex h-full flex-col items-center justify-center px-6 text-center ${theme.mutedPanel}`}
                        >
                          <FileText className="h-8 w-8 text-slate-400" />
                          <p className="text-sm font-semibold">
                            No booking document yet
                          </p>
                          <p className={`mt-2 text-xs ${theme.softText}`}>
                            This booking does not include an uploaded image or PDF.
                          </p>
                        </div>
                      )}
                    </div>
                    {/* 
                    {bookingDocuments.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {bookingDocuments.map((doc, index) => {
                          const isSelected = doc.url === documentPreviewUrl;

                          return (
                            <button
                              key={`${doc.url}-${index}`}
                              type="button"
                              onClick={() => setSelectedDocumentUrl(doc.url)}
                              className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition ${isSelected
                                ? 'border-[#2d5bd1] bg-[#EEF4FF]'
                                : `${theme.border} ${theme.panel}`
                                }`}
                            >
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected
                                  ? 'bg-[#2d5bd1] text-white'
                                  : 'bg-[#EEF2F7] text-slate-500'
                                  }`}
                              >
                                {doc.kind === 'image' ? (
                                  <FileImage className="h-5 w-5" />
                                ) : (
                                  <FileText className="h-5 w-5" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                  {doc.name || `Document ${index + 1}`}
                                </p>
                                <p className={`text-xs ${theme.softText}`}>
                                  {doc.kind?.toUpperCase?.() || 'FILE'}
                                </p>
                              </div>

                              <ExternalLink
                                className={`h-4 w-4 ${isSelected ? 'text-[#2d5bd1]' : 'text-slate-400'
                                  }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    ) : null} */}

                    <div className={`py-4 ${theme.panel}`}>
                      <button
                        type="button"
                        onClick={openCurrentDocument}
                        disabled={!hasDocuments}
                        className={`w-full rounded-full px-4 py-4 text-sm font-medium ${hasDocuments
                          ? theme.accent
                          : 'cursor-not-allowed bg-slate-200 text-slate-500'
                          }`}
                      >
                        Open document
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 aspect-[320/280] overflow-y-auto px-4 py-3">
                    <p>{bookingPurpose}</p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`overflow-hidden rounded-[16px] border transition-colors ${theme.panel} ${theme.border} ${theme.cardShadow}`}
            >
              <button
                type="button"
                onClick={toggleChatPanel}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <h2 className={`text-xl font-semibold tracking-tight ${theme.text}`}>Chat</h2>
                </div>

                <div className="flex items-center gap-3">
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-[#f44336] px-2 py-1 text-[10px] font-semibold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  ) : null}

                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${isChatOpen ? 'rotate-180' : ''
                      }`}
                  />
                </div>
              </button>

              {isChatOpen ? (
                <div className="p-5">
                  <div className="max-h-[430px] min-h-[230px] space-y-4 overflow-y-auto pr-1">
                    {chatError ? (
                      <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        {chatError}
                      </div>
                    ) : null}

                    {chatLoading ? (
                      <p className={`text-sm ${theme.softText}`}>
                        Loading booking chat...
                      </p>
                    ) : chatMessages.length === 0 ? (
                      <p className={`text-sm ${theme.softText}`}>
                        No booking messages yet.
                      </p>
                    ) : (
                      chatMessages.map((message) => (
                        <ChatBubble
                          key={message.id}
                          message={message}
                          theme={theme}
                          isSelf={message.isMine}
                        />
                      ))
                    )}
                  </div>

                  <div
                    className={`relative mt-3 flex items-center gap-2 rounded-full px-4 py-3 ${theme.input}`}
                  >
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 dark:bg-white/10"
                    >
                      <Plus className="h-5 w-5" />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleAttachFile}
                    />

                    <input
                      ref={chatInputRef}
                      type="text"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={handleChatKeyDown}
                      placeholder="Type a message..."
                      className="w-full bg-transparent text-xs outline-none"
                    />

                    <div className="relative">
                      <EmojiPicker handleEmojiSelector={handleEmojiSelector} />
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleSendMessage()}
                      disabled={!chatInput.trim()}
                      className="rounded-full bg-[#2d5bd1] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      {incomingRescheduleRequest ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" />

          <div
            className={`relative z-10 w-full max-w-[560px] rounded-[24px] border px-5 py-5 shadow-2xl ${theme.panel} ${theme.border}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5bd1]">
                  Time extension request
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Approve or reject?
                </h3>
                <p className={`mt-2 text-sm ${theme.softText}`}>
                  {incomingRescheduleRequest.RequesterName ||
                    'The other participant'}{' '}
                  asked to extend the meeting.
                </p>
              </div>

              <div className="rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#2d5bd1]">
                {Math.max(
                  0,
                  Math.round(
                    (new Date(
                      incomingRescheduleRequest.ProposedEndTime
                    ).getTime() -
                      new Date(
                        incomingRescheduleRequest.ProposedStartTime
                      ).getTime()) /
                    60000
                  )
                )}{' '}
                min
              </div>
            </div>

            <div
              className={`mt-6 rounded-[18px] border p-4 ${theme.mutedPanel} ${theme.border}`}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailCard
                  label="Requested by"
                  value={
                    incomingRescheduleRequest.RequesterName ||
                    incomingRescheduleRequest.RequestedBy
                  }
                  theme={theme}
                />
                <DetailCard
                  label="Status"
                  value={incomingRescheduleRequest.Status}
                  theme={theme}
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailCard
                  label="New start"
                  value={formatDateTime(
                    incomingRescheduleRequest.ProposedStartTime
                  )}
                  theme={theme}
                />
                <DetailCard
                  label="New end"
                  value={formatDateTime(incomingRescheduleRequest.ProposedEndTime)}
                  theme={theme}
                />
              </div>

              <div className="mt-4">
                <p
                  className={`text-xs font-medium uppercase tracking-[0.18em] ${theme.softText}`}
                >
                  Reason
                </p>
                <p className="mt-2 text-sm leading-6">
                  {incomingRescheduleRequest.Reason || 'No reason provided.'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {rescheduleActionMessage ? (
                <div
                  className={`mb-1 rounded-xl border px-4 py-3 text-sm font-medium ${rescheduleActionMessageType === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                    }`}
                >
                  {rescheduleActionMessage}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => void rejectRescheduleRequest()}
                disabled={rescheduleActionLoading}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => void acceptRescheduleRequest()}
                disabled={rescheduleActionLoading}
                className="rounded-full bg-[#2d5bd1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244db0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {rescheduleActionLoading ? 'Processing…' : 'Accept request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
