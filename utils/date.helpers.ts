import { DateTime } from 'luxon';

export const convertToLocalTime = (isoDateString: string) => {
  // Parse the ISO string and convert to local time
  const dateTime = DateTime.fromISO(isoDateString, { zone: 'utc' }).toLocal();

  return {
    formatted: dateTime.toFormat('yyyy-MM-dd HH:mm:ss'),
    dateTime: dateTime,
    // Add more format options as needed
    time: dateTime.toFormat('HH:mm'),
    date: dateTime.toFormat('yyyy-MM-dd'),
    relative: dateTime.toRelative(),
  };
};

export const getDaysDifference = (date1: string | Date) => {
  const date2 = new Date();
  // Convert to Luxon DateTime and strip time component
  const dt1 = DateTime.fromJSDate(
    date1 instanceof Date ? date1 : new Date(date1)
  ).startOf('day');
  const dt2 = DateTime.fromJSDate(
    date2 instanceof Date ? date2 : new Date(date2)
  ).startOf('day');

  // Get difference in days
  const diff = dt1.diff(dt2, 'days').days;

  // Return rounded integer
  return Math.floor(diff);
};
