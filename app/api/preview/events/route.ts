import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const headers = {
  XApiKey: apiKey,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Preview API route for events - filters events on the server side before returning to PDF preview
 * Supports filtering by city, eventType, country, date ranges, and future events
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters from query string
    const cityFilter = searchParams.get('city');
    const eventTypeFilter = searchParams.get('eventType');
    const countryFilter = searchParams.get('country');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const allFutureEvents = searchParams.get('allFuture') === 'true';
    const selectedDatesParam = searchParams.get('dates');

    // Fetch all events from the backend API
    const response = await fetch(`${apiEndpoint}/event/list`, { headers });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.StatusCode !== 200 || !Array.isArray(data.Result)) {
      throw new Error('Invalid API response format');
    }

    let events = data.Result;

    // Apply server-side filtering
    const now = new Date();
    const selectedDates = selectedDatesParam
      ? selectedDatesParam.split(',').map(d => new Date(decodeURIComponent(d)))
      : [];
    const startDate = startDateParam ? new Date(decodeURIComponent(startDateParam)) : null;
    const endDate = endDateParam ? new Date(decodeURIComponent(endDateParam)) : null;

    events = events.filter((event: any) => {
      const eventDate = new Date(event.EventDate);

      // Filter by city (case-insensitive)
      if (cityFilter && event.CityName?.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }

      // Filter by country (case-insensitive)
      if (countryFilter && event.CountryName?.toLowerCase() !== countryFilter.toLowerCase()) {
        return false;
      }

      // Filter by event type - need to get event type name from EventsTypeId
      // For now, we'll skip this filter as we need the eventTypeMapping from client
      // This will be handled on the client side
      if (eventTypeFilter) {
        // We can't filter by event type here without the mapping
        // This would require fetching event types first or storing them
        // For now, we'll let the client handle this
      }

      // Filter by all future events
      if (allFutureEvents) {
        return eventDate >= now;
      }

      // Filter by date range
      if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return eventDate >= start && eventDate <= end;
      }

      // Filter by multiple selected dates
      if (selectedDates.length > 0) {
        return selectedDates.some(selectedDate => {
          const selected = new Date(selectedDate);
          selected.setHours(0, 0, 0, 0);
          const eventDateNormalized = new Date(eventDate);
          eventDateNormalized.setHours(0, 0, 0, 0);

          // Check for exact date match
          if (eventDateNormalized.getTime() === selected.getTime()) {
            return true;
          }

          // For certain event types, check 5-day range
          // Note: This requires event type name which we don't have server-side
          // This filtering will be handled on the client side

          return false;
        });
      }

      return true;
    });

    return NextResponse.json({
      ok: true,
      StatusCode: 200,
      Result: events
    });
  } catch (err: any) {
    console.error('preview/events route error', err);
    return NextResponse.json({
      ok: false,
      Result: [],
      StatusCode: 500,
      error: err?.message || 'Failed to fetch events'
    }, { status: 500 });
  }
}
