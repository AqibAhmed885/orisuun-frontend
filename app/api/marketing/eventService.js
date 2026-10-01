const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const fetchCountries = async () => {
    const response = await fetch(`${apiEndpoint}/event/GetCountryAndCityList`, { headers });
    const data = await response.json();
    if (data.StatusCode === 200 && Array.isArray(data.Result.country)) {
        return data.Result.country;
    }
    throw new Error('Failed to fetch countries');
};

export const fetchEventTypes = async () => {
    const response = await fetch(`${apiEndpoint}/event/type`, { headers });
    const data = await response.json();
    if (data.StatusCode === 200 && Array.isArray(data.Result)) {
        return data.Result;
    }
    throw new Error('Failed to fetch event types');
};

export const fetchEvents = async () => {
    const response = await fetch(`${apiEndpoint}/event/list`, { headers });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return data.Result;
};


export const submitEvent = async (eventData, captchaToken) => {
    const response = await fetch(
        `${apiEndpoint}/event/insert-update?ReCAPTCHAToken=${encodeURIComponent(captchaToken)}`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(eventData)
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.Message || 'Failed to submit event');
    }
    return data.Result;
};

export const getCountryAndCityList = async () => {
    const response = await fetch(`${apiEndpoint}/event/GetCountryAndCityList`, { headers });
    const data = await response.json();
    if (data.StatusCode === 200) {
        return {
            countries: data.Result.country || [],
            cities: data.Result.city || []
        };
    }
    throw new Error('Failed to fetch country and city list');
};

export const requestEventDelete = async (eventId, reason) => {
    const response = await fetch(
        `${apiEndpoint}/event/RequestEventDelete?eventId=${eventId}&reason=${reason}`,
        {
            method: 'POST',
            headers
        }
    );

    const data = await response.json();
    if (!response.ok || data.StatusCode !== 200) {
        throw new Error(data.Message || 'Failed to delete event');
    }
    return data;
};

export const updateEvent = async (eventData, captchaToken) => {
    const response = await fetch(
        `${apiEndpoint}/event/insert-update?ReCAPTCHAToken=${encodeURIComponent(captchaToken)}`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(eventData)
        }
    );

    const data = await response.json();
    if (!response.ok || data.StatusCode !== 200) {
        throw new Error(data.Message || 'Failed to update event');
    }
    return data;
};

export const formatTimeToISO = (dateStr, timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(dateStr);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toISOString();
};

export const fetchCitiesList = async () => {
    const response = await fetch(
        `${apiEndpoint}/event/GetCountryAndCityList`,
        { headers }
    );
    const data = await response.json();
    if (data.Result) {
        return data.Result.city || [];
    }
    throw new Error('Failed to fetch cities');
};

export const downloadEventsPdf = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.date) params.append('date', filters.date);
    if (filters.city) params.append('city', filters.city);
    if (filters.country) params.append('country', filters.country);
    if (filters.eventType) params.append('eventType', filters.eventType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.allFuture !== undefined) params.append('allFuture', filters.allFuture);

    const queryString = params.toString();
    const url = `${apiEndpoint}/event/GetEventPdf${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        headers: {
            ...headers,
            accept: '*/*'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to download PDF');
    }

    return response.blob();
};

export const checkEventExists = async (title, eventTypeId) => {
    const url = `${apiEndpoint}/event/check-event-exists?title=${encodeURIComponent(title)}&eventTypeId=${eventTypeId}`;
    const response = await fetch(url, { headers });
    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        // Non-JSON response; treat as not existing unless status / message indicate otherwise
    }

    // Some API responses use 404 with Message "Event already exists" and Result true (non-standard)
    if (response.status === 404) {
        if (data && (data.Result === true || /event already exists/i.test(data.Message || ''))) {
            return true; // Treat this special 404 as a positive duplicate indication
        }
        return false; // Normal 404 => not found
    }

    if (response.ok && data && data.StatusCode === 200) {
        return data.Result === true; // ensure boolean
    }

    // Any other status we throw so caller can decide; return false fallback if desired
    throw new Error(data?.Message || 'Failed to check event existence');
};