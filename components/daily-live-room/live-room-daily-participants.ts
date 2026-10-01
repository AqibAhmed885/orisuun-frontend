import { getInitials } from './live-room-utils';
import type { Participant } from './types';

export type DailyParticipantInfo = {
  user_id?: string;
  user_name?: string;
  session_id?: string;
  local?: boolean;
  owner?: boolean;
  joined_at?: Date | number | string;
};

export type DailyParticipantsObject = Record<string, DailyParticipantInfo>;

export const formatParticipantJoinedTime = (joinedAt?: Date | number | string) => {
  if (!joinedAt) {
    return 'Joined';
  }

  const timestamp =
    joinedAt instanceof Date
      ? joinedAt.getTime()
      : typeof joinedAt === 'number'
        ? joinedAt > 9999999999
          ? joinedAt
          : joinedAt * 1000
        : new Date(joinedAt).getTime();

  if (!Number.isFinite(timestamp)) {
    return 'Joined';
  }

  const diffMs = Date.now() - timestamp;
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 1) {
    return 'Joined just now';
  }

  if (diffMinutes < 60) {
    return `Joined ${diffMinutes} min ago`;
  }

  return `Joined ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))}`;
};

export const mapDailyParticipantsToView = (dailyParticipants: DailyParticipantsObject): Participant[] => {
  return Object.entries(dailyParticipants)
    .map(([participantId, participant]) => {
      const participantName = participant.user_name?.trim() || 'Guest';
      const isLocal = Boolean(participant.local);
      const isOwner = Boolean(participant.owner);

      return {
        id: participant.session_id || participant.user_id || participantId,
        name: participantName,
        detail: isLocal ? 'You' : isOwner ? 'Host' : 'Participant',
        avatar: getInitials(participantName),
        joined: formatParticipantJoinedTime(participant.joined_at),
        isLocal,
        isOwner,
      };
    })
    .filter((participant) => Boolean(participant.id));
};
