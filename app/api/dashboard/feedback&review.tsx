const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

import axios from 'axios';

export const fetchUserProfile = async (userData: any) => {
    const response = await axios.post(
        `${apiEndpoint}/Profile/ViewUserProfileV1`,
        {
            UserProfileDetailId: userData.UserProfileDetailsId,
            UserId: userData.Id,
            Username: userData.UserName,
        },
        {
            headers
        }
    );

    if (response.status !== 200) {
        throw new Error('Failed to fetch profile data');
    }

    return response.data.Result;
};