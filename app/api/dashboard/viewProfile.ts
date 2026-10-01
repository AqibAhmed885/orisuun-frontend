import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
export const getProfileTypes = async (token) => {
    const response = await axios.get(`${apiEndpoint}/Profile/UserProfileTypes`, {
        headers: {
            XApiKey: token,
        },
    });
    return response;
};

export const getAllProfileDetails = async (token) => {
    const response = await axios.get(
        `${apiEndpoint}/UserVerification/GetAllProfileDetails`,
        {
            headers: {
                XApiKey: token,
            },
        }
    );
    return response;
};

export const deleteProfile = async (profileData, token) => {
    const formData = new FormData();
    formData.append('UserProfileDetailId', profileData?.Id);
    formData.append('UserId', profileData?.UserId);

    const response = await axios.post(
        `${apiEndpoint}/Profile/DeleteProfile`,
        formData,
        {
            headers: {
                XApiKey: token,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response;
};

export const verifyUser = async (userId, token) => {
    const response = await axios.post(
        `${apiEndpoint}/UserVerification/VerifyUser`,
        { UserId: userId },
        {
            headers: {
                XApiKey: token,
            },
        }
    );
    return response;
};

export const permanentDeleteProfile = async (profileData, token) => {
    const formData = new FormData();
    formData.append('UserProfileDetailId', profileData?.Id);
    formData.append('UserId', profileData?.UserId);

    const response = await axios.post(
        `${apiEndpoint}/Profile/DeleteProfile`,
        formData,
        {
            headers: {
                XApiKey: token,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response;
};

export const restoreProfile = async (profileId, userId, token) => {
    try {
        const formData = new FormData();
        formData.append('UserProfileDetailId', profileId);
        formData.append('UserId', userId);

        const response = await axios.post(
            `${apiEndpoint}/Profile/RestoreProfile`,
            formData,
            {
                headers: {
                    XApiKey: token,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response;
    } catch (error) {
        console.error('Error restoring profile:', error);
        throw error;
    }
};