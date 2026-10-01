const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
export const createBWFSubscription = async (subscriptionData) => {
    const response = await fetch(
        `${apiEndpoint}/Marketing/CreateBwfSubscription`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify({
                FirstName: subscriptionData.firstName,
                LastName: subscriptionData.lastName,
                City: subscriptionData.city,
                Email: subscriptionData.email,
                Amount: Number(subscriptionData.amount)
            })
        }
    );

    const data = await response.json();
    if (!response.ok || response.status !== 200) {
        throw new Error(data.Message || 'Failed to create subscription');
    }
    return data.Result;
};

export const createCustomer = async (customerData) => {
    const response = await fetch(
        `${apiEndpoint}/Marketing/CreateCustomer`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(customerData)
        }
    );

    const data = await response.json();
    if (!response.ok || response.status !== 200) {
        throw new Error(data.Message || 'Failed to create customer');
    }
    return data.Result;
};
export const getFundRaisingData = async () => {
    return axios.get(`${apiEndpoint}/Marketing/GetFundRaisingData`, { headers });
};