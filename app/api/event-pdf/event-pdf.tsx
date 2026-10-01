const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const headers = {
    XApiKey: apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const eventApi = {
    getCountryAndCityList: async () => {
        const response = await fetch(`${apiEndpoint}/event/GetCountryAndCityList`, {
            headers
        });
        return response;
    },

    getEventTypes: async () => {
        const response = await fetch(`${apiEndpoint}/event/type`, {
            headers
        });
        return response;
    },

    getEventList: async (queryString = '') => {
        const url = `${apiEndpoint}/event/list${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url, {
            headers
        });
        return response;
    }
};