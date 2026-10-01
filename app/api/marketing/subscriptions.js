import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
export const getSubscriptionPrice = async (profileType, planType) => {
    try {
        const response = await axios.post(
            `${apiEndpoint}/Marketing/GetSubscriptionPrice`,
            {
                ProfileType: profileType,
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


