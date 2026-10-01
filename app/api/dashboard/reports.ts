import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const reports = {
    getProfileTypes: async () => {
        const response = await axios.get(
            `${apiEndpoint}/MyProfile/GetUserProfileTypes`,
            { headers }
        );
        return response.status === 200 ? [
            { UserProfileName: 'All', Id: 0 },
            ...response.data.Result
        ] : [];
    },

    getProfileData: async (profileType: number, userId: string, isExport: boolean) => {
        const response = await axios.post(
            `${apiEndpoint}/Admin/GetProfileReport`,
            {
                Id: profileType,
                UserId: userId,
                IsExport: isExport,
            },
            {
                headers: {
                    XApiKey: typeof window !== 'undefined' && localStorage.getItem('accessToken'),
                },
                responseType: isExport ? 'blob' : 'json',
            }
        );
        return response;
    },
    getFilteredPosts: async (payload) => {
        const response = await axios.post(
            `${apiEndpoint}/Search/GetFilteredOpportunityPost`,
            payload,
            {
               headers
            }
        );
        return response.data.Result;
    },
};