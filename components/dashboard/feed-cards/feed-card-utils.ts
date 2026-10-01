import moment from 'moment';

export const formatPostedLabel = (dateValue?: string | null): string => {
  if (!dateValue) return 'recently';
  const duration = moment.duration(moment().diff(moment(dateValue)));
  const minutes = Math.floor(duration.asMinutes());
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes} m`;
  const hours = Math.floor(duration.asHours());
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(duration.asDays());
  if (days < 7) return `${days} d`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} w`;
  const months = Math.floor(days / 30);
  return `${months} mo`;
};

export const getRangeLabel = (type?: string): string => {
  if (!type) return 'Last 7 Days';
  if (type.includes('Week')) return 'Last 7 Days';
  if (type.includes('Month')) return 'Last 30 Days';
  if (type.includes('Year')) return 'Last 365 Days';
  if (type.includes('Day')) return 'Last 24 Hours';
  return 'Last 7 Days';
};

export const isUrl = (value?: string | null): boolean =>
  Boolean(value && /^https?:\/\//i.test(value));
