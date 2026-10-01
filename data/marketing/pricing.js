export async function getUserProfileTypeFeatures() {
    try {
        const response = await axios.get(
            `${apiEndpoint}/Pricing/GetPlanFeatures`,
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        return [];
    }
}