import axios from 'axios';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const fetchPublicProfile = async (username: string) => {
    const response = await axios.post(
        `${apiEndpoint}/Profile/ExploreUserProfileV1`,
        {
            UserName: username,
        },
        {
            headers: {
                XApiKey: apiKey,
            },
        }
    );
    return response.data.Result;
};