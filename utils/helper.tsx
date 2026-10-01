import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import moment from 'moment';
export const TypeIcons = {
  'Black-owned Business': (
    <BlackOwnedBusinessIcon className="text-omblue-500 w-3.5 h-3.5" />
  ),
  Expert: <ExpertsIcon className="text-omblue-500 w-3.5 h-3.5" />,
  Mentor: <MentorsIcon className="text-omblue-500 w-3.5 h-3.5" />,

  Professional: <ProfessionalsIcon className="text-omblue-500 w-3.5 h-3.5" />,
  'Strategy Consultants': <ConsultantIcon className="text-omblue-500 w-3.5 h-3.5" />,
  Investor: <InvestorsIcon className="text-omblue-500 w-3.5 h-3.5" />,
  Advocate: <AdvocatesIcon className="text-omblue-500 w-3.5 h-3.5" />,
  Partner: <AdvocatesIcon className="text-omblue-500 w-3.5 h-3.5" />,
  Admin: <AdvocatesIcon className="text-omblue-500 w-3.5 h-3.5" />,
  SystemAdmin: <AdvocatesIcon className="text-omblue-500 w-3.5 h-3.5" />,
};
export const checkOnlineStatus = (utcTime) => {
  if (!utcTime) {
    return 'Offline';
  }
  // Convert UTC time to local time
  const localTime = moment.utc(utcTime).local();

  // Get the current local time
  const currentTime = moment();

  // Calculate the difference in minutes
  const diffInMinutes = currentTime.diff(localTime, 'minutes');
  // If the difference is less than or equal to 10 minutes, return 'online'
  if (diffInMinutes <= 60) {
    return 'online';
  }

  // If offline, calculate larger time units (hours, days, weeks)
  if (diffInMinutes > 60) {
    const diffInHours = currentTime.diff(localTime, 'hours');
    if (diffInHours >= 24) {
      const diffInDays = currentTime.diff(localTime, 'days');
      if (diffInDays >= 7) {
        const diffInWeeks = currentTime.diff(localTime, 'weeks');
        return `Last Seen ${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
      }
      return `Last Seen ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    return `Last Seen ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  // Otherwise, return time in minutes if it's over 10 minutes but under 60 minutes
  return `Last Seen ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
};

export const showTimeStatus = (utcTime) => {
  if (!utcTime) return 'Offline';

  const normalizedUtcTime = String(utcTime).split('.')[0] + 'Z';
  const localTime = moment.utc(normalizedUtcTime).local();
  const now = moment();

  const diffSeconds = now.diff(localTime, 'seconds');

  if (diffSeconds < 10) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;

  const diffMinutes = now.diff(localTime, 'minutes');
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;

  const diffHours = now.diff(localTime, 'hours');
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

  if (diffHours < 48) return `Yesterday ${localTime.format('h:mm A')}`;

  return localTime.format('MMMM D, YYYY h:mm A');
};



export const processTimeZoneInfo = (selectedUserTimezone: string) => {
  const now = moment();
  const clientOffset = now.utcOffset();
  const userTime = now.clone().tz(selectedUserTimezone);
  const userOffset = userTime.utcOffset();
  const differenceInHours = (userOffset - clientOffset) / 60;

  const formattedTime = userTime.format('hh:mm A').toUpperCase();
  const formattedOffset = `UTC${userTime.format('Z').split(':')[0]}`;

  const aheadOrBehind =
    differenceInHours > 0
      ? `(${Math.abs(differenceInHours)}h ahead)`.toLowerCase()
      : differenceInHours < 0
        ? `(${Math.abs(differenceInHours)}h behind)`.toLowerCase()
        : '';

  return `${formattedTime} ${formattedOffset} ${aheadOrBehind}`;
};

const roleToTitle = {
  advocates: 'advocate',
  mentors: 'mentor',
  investors: 'investor',
  partners: 'partner',
  experts: 'expert',
  professionals: 'professional',
  'strategy-consultants': 'Strategy Consultants',
  'black-owned-businesses': 'Black-Owned Business',
};

export const getSingularRole = (title) => roleToTitle[title] || title;

export const getPluralTitleFromRole = (role) =>
  Object.entries(roleToTitle).reduce((acc, [plural, singular]) => {
    acc[singular] = plural;
    return acc;
  }, {})[role] || role;
