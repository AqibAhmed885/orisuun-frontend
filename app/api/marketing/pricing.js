import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
export async function getUserProfileTypeFeatures() {
    try {
        const response = await axios.get(
            `${apiEndpoint}/Pricing/GetPlanFeatures`,
            { headers }
        );
        console.log('getUserProfileTypeFeatures response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        return [];
    }
}

export async function getSubscriptionPlanBasedOnProfileType(profileType) {
    try {
        const response = await axios.get(
            `${apiEndpoint}/User/SubscriptionPlanBasedOnProfileType`,
            {
                headers,
                params: { profileType },
            }
        );
        return response.data.Result;
    } catch (error) {
        console.error('Axios error:', error);
        return [];
    }
}

export async function getLegacySubscriptionPrice(profileType, planType) {
    try {
        const response = await axios.post(
            `${apiEndpoint}/Marketing/GetSubscriptionPrice`,
            {
                ProfileType: profileType,
                PlanType: planType,
            },
            {
                headers,
            }
        );

        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        throw error;
    }
}

export async function getUserProfileType() {
    try {
        const response = await axios.get(
            `${apiEndpoint}/Profile/UserProfileTypes`,
            { headers }
        );
        return response.data.Result;
    } catch (error) {
        console.error('Axios error:', error);
        return [];
    }
}


// ... existing code ...

export const getSpotsLeftCount = async () => {
    try {
        const response = await fetch(`${apiEndpoint}/Pricing/GetSpotsLeftCount`, {
            method: 'GET',
            headers: {
                'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch spots count');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching spots count:', error);
        return 17; // Fallback value
    }
};

export const sendFreeAccountMessage = async (formData) => {
    const response = await fetch(`${apiEndpoint}/Pricing/SendFreeAccMessage`, {
        method: 'POST',
        body: formData,
        headers: {
            'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
        }
    });

    const responseText = await response.text();
    let result;
    try {
        result = JSON.parse(responseText);
    } catch {
        result = responseText;
    }

    if (!response.ok) {
        throw new Error(typeof result === 'object' ? result.message || 'Request failed' : result || 'Request failed');
    }

    return result;
};