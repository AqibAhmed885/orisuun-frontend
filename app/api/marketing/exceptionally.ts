import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
export const getSubscriptionPrice = async (profileType: string, planType: string) => {
    const type = profileType == "Management Consultants" ? 'Strategy Consultants'
        : profileType;

    try {
        const response = await axios.post(
            `${apiEndpoint}/Marketing/GetSubscriptionPrice`,
            {
                ProfileType: type,
                PlanType: planType,
            },
            {
                headers
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};