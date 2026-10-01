const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const submitFeedback = async (feedbackData) => {
    const response = await fetch(
        `${apiEndpoint}/Marketing/SaveFeedBack`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(feedbackData)
        }
    );

    const data = await response.json();
    if (!response.ok || response.status !== 200) {
        throw new Error(data.Message || 'Failed to submit feedback');
    }
    return data.Result;
};

// ... existing code ...

export const saveFeedbackInput = async (feedbackData) => {
    const response = await fetch(
        `${apiEndpoint}/Marketing/SaveFeedBack`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(feedbackData)
        }
    );

    const data = await response.json();
    if (!response.ok || response.status !== 200) {
        throw new Error(data.Message || 'Failed to save feedback');
    }
    return data.Result;
};