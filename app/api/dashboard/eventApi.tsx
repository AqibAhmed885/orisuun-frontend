const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const headers = {
  'XApiKey': apiKey,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const fetchDeleteRequests = async () => {
  const response = await fetch(`${apiEndpoint}/event/GetAllDeleteRequests`, { headers });
  const data = await response.json();
  return data.StatusCode === 200 ? data.Result || [] : [];
};

export const fetchCountries = async () => {
  const response = await fetch(`${apiEndpoint}/event/GetCountryAndCityList`, { headers });
  const data = await response.json();
  return data.StatusCode === 200 && Array.isArray(data.Result.country) ? data.Result.country : [];
};

export const fetchEventTypes = async () => {
  const response = await fetch(`${apiEndpoint}/event/type`, { headers });
  const data = await response.json();
  return data.StatusCode === 200 && Array.isArray(data.Result) ? data.Result : [];
};

export const fetchEventCountsByDate = async (
  userId: string,
  year?: number,
  month?: number
): Promise<Record<string, number>> => {
  let url = `${apiEndpoint}/event/events-count-by-date?userId=${encodeURIComponent(userId)}`;
  if (year !== undefined && month !== undefined) {
    url += `&year=${year}&month=${month}`;
  }
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data.StatusCode === 200 && data.Result ? data.Result : {};
};

export const fetchEvents = async () => {
  const response = await fetch(`${apiEndpoint}/event/GetAllEventsSuperAdmin`, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.Result;
};

export const deleteEvent = async (eventId) => {
  const response = await fetch(`${apiEndpoint}/event/delete-event?id=${eventId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }

  return response.json();
};

export const restoreEvent = async (eventId) => {
  const response = await fetch(`${apiEndpoint}/event/RestoreEvent?eventId=${eventId}`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to restore event');
  }

  return response.json();
};