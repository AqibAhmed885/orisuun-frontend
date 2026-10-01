const AddToCalendarPopup = ({ isOpen, onClose, event, countries }) => {
  if (!isOpen) return null;

  const eventData = event || {};

  const getCountryName = (countryId) => {
    if (!countryId || !countries || !Array.isArray(countries)) return '';
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : '';
  };

  const {
    title = 'Event',
    description = '',
    location = '',
    EventDate,
    EventStartTime,
    EventEndTime,
    country_id: countryId,
    city = ''
  } = eventData;

  const country = getCountryName(countryId);

  const downloadICS = () => {
    // Helper to format date in UTC for ICS
    const formatToUTC = (date) => {
      return [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        String(date.getUTCDate()).padStart(2, '0'),
        'T',
        String(date.getUTCHours()).padStart(2, '0'),
        String(date.getUTCMinutes()).padStart(2, '0'),
        String(date.getUTCSeconds()).padStart(2, '0'),
        'Z'
      ].join('');
    };

    // Parse date and time into local datetime then convert to UTC
    const parseDateTime = (dateStr, timeStr) => {
      if (!dateStr) return new Date();

      const [year, month, day] = dateStr.split('T')[0].split('-');
      const [hours, minutes] = timeStr ? timeStr.split(':') : [0, 0];

      // Create date in local timezone
      const localDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      return localDate;
    };

    // Create dates in local time then convert to UTC for ICS
    const startDateTime = parseDateTime(EventDate, EventStartTime);
    const endDateTime = parseDateTime(EventDate, EventEndTime);

    // Handle case where end time is earlier than start time (crossing midnight)
    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    // Format for display in description
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };

    const startDisplay = startDateTime.toLocaleString('en-US', options);
    const endDisplay = endDateTime.toLocaleString('en-US', options);

    const enhancedDescription = [
      description,
      `\n\nEvent Details:`,
      `Title: ${title}`,
      `Start Time: ${startDisplay}`,
      `End Time: ${endDisplay}`,
      country ? `Country: ${country}` : '',
      city ? `City: ${city}` : '',
    ].filter(Boolean).join('\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Global Black Business Events//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@gbb-events.com`,
      `DTSTAMP:${formatToUTC(new Date())}`,
      `DTSTART:${formatToUTC(startDateTime)}`,
      `DTEND:${formatToUTC(endDateTime)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${enhancedDescription}`,
      `LOCATION:${[location, city, country].filter(Boolean).join(', ')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] max-w-[90%]">
        <h2 className="text-lg font-semibold mb-4">Download Calendar Event</h2>
        <p className="mb-4">Click below to download this event as an ICS file that you can import into your calendar.</p>

        <div className="space-y-2 mb-4">
          <button
            onClick={downloadICS}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium"
          >
            Download ICS File
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className="text-gray-600 hover:text-gray-800 px-4 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCalendarPopup;
