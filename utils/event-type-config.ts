export const SAVED_EVENTS_CHANGED_EVENT = 'orisuun:saved-events-changed';

const eventTypeConfig = {
  Conferences: {
    color: '#193E8D',
    bgColor: '#DDE7F8',
    iconColor: '#193E8D',
    accentColor: '#2357C6',
  },
  'Grand Openings & Launches': {
    color: '#C84430',
    bgColor: '#FFE8E5',
    iconColor: '#E85C47',
    accentColor: '#FF6B57',
  },
  'Trade Show / Expo': {
    color: '#0891B2',
    bgColor: '#D9F2F7',
    iconColor: '#0891B2',
    accentColor: '#06B6D4',
  },
  Webinars: {
    color: '#16A34A',
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    accentColor: '#22C55E',
  },
  Meetups: {
    color: '#193E8D',
    bgColor: '#DDE7F8',
    iconColor: '#193E8D',
    accentColor: '#2357C6',
  },
  Workshops: {
    color: '#C84430',
    bgColor: '#FFE8E5',
    iconColor: '#E85C47',
    accentColor: '#FF6B57',
  },
  Seminars: {
    color: '#193E8D',
    bgColor: '#DDE7F8',
    iconColor: '#193E8D',
    accentColor: '#2357C6',
  },
  default: {
    color: '#193E8D',
    bgColor: '#DDE7F8',
    iconColor: '#193E8D',
    accentColor: '#2357C6',
  },
};

export type EventTypeName = Exclude<keyof typeof eventTypeConfig, 'default'>;

const eventTypeNames = Object.keys(eventTypeConfig).filter(
  (name) => name !== 'default'
) as EventTypeName[];

export const getEventTypeName = (feed: any): string => {
  const event = feed?.Event || feed;
  const candidates = [
    event?.EventTypeName,
    event?.EventType,
    event?.EventsType,
    feed?.EventTypeName,
    feed?.EventType,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value && typeof value === 'object') {
      const name = value.Title || value.Name;
      if (typeof name === 'string' && name.trim()) return name.trim();
    }
  }

  return 'Other';
};

export const getEventTypeConfig = (eventType: string) => {
  const normalizedType = eventType.trim().toLowerCase();
  const matchedType = eventTypeNames.find(
    (name) => name.toLowerCase() === normalizedType
  );

  return matchedType ? eventTypeConfig[matchedType] : eventTypeConfig.default;
};
