import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { CampaignSchema } from '@/utils/schema';
import { CreateSponsorSchema } from '@/utils/schema';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

const azureStorageUrl = 'https://orisuundocumentsdev.blob.core.windows.net';
const azureStorageContainer = 'user-profile';

export const fileUploadService = {
    uploadFile: async (file: File, sasToken: string) => {
        const fileExtension = file?.name?.split('.')?.pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `${azureStorageUrl}/${azureStorageContainer}/${randomName}?${sasToken}`;

        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
            timeout: 30000,
            validateStatus: (status) => status === 201
        };

        const res = await axios.put(blobUrl, file, config);
        if (res.status !== 201) {
            throw new Error('Failed to upload file');
        }

        return res?.config?.url?.split('?')[0];
    },

    uploadVideo: async (file: File, sasToken: string) => {
        const fileExtension = file?.name?.split('.')?.pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `${azureStorageUrl}/${azureStorageContainer}/${randomName}?${sasToken}`;

        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
            timeout: 30000,
            validateStatus: (status) => status === 201
        };

        const res = await axios.put(blobUrl, file, config);
        if (res.status !== 201) {
            throw new Error('Failed to upload video');
        }

        return res?.config?.url?.split('?')[0];
    },
    uploadIndividualImage: async (file: File, sasToken: string) => {
        const fileExtension = file?.name?.split('.')?.pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `${azureStorageUrl}/${azureStorageContainer}/${randomName}?${sasToken}`;

        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
            timeout: 30000,
            validateStatus: (status) => status === 201
        };

        const res = await axios.put(blobUrl, file, config);
        if (res.status !== 201) {
            throw new Error('Failed to upload image');
        }

        return res?.config?.url?.split('?')[0];
    }
};

export const rewardService = {
    getCountryList: async () => {
        try {
            const res = await axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
                headers
            });

            if (res.status === 200) {
                return res.data.Result.map((location) => ({
                    label: location?.CountryName,
                    value: (location?.Id).toString(),
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching country list:', error);
            return [];
        }
    }
};

export const campaignService = {
    createCampaign: async (values: CampaignSchema, userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Campaign/CreateCampaignV1`,
            {
                UserId: userId,
                ...values,
            },
            {
                headers
            }
        );

        if (response.status !== 201) {
            throw new Error('Failed to create campaign');
        }

        return response;
    }
};

export const SponsorService = {
    createSponsor: async (data: CreateSponsorSchema, userId: string, campaignId: string) => {
        const payload = {
            UserId: userId,
            CampaignId: campaignId,
            ...data,
            ProfilePicture: data.Picture,
            SponsorName: data.Name,
            WebsiteUrl: data.Website,
        };

        return axios.post(
            `${apiEndpoint}/Campaign/CreateSponsor`,
            payload,
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                },
            }
        );
    },
};

interface CampaignFilters {
    Purpose: string | null;
    GoalsAlmostReached: boolean;
    MyCamapigns: boolean;
}

export const CampaignService = {
    getFavouriteCampaigns: async (userId: string) => {
        return axios.post(
            `${apiEndpoint}/Campaign/GetFavouriteCampaigns`,
            { UserId: userId },
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                },
            }
        );
    },

    getAllCampaigns: async (userId: string, filters: CampaignFilters) => {
        return axios.post(
            `${apiEndpoint}/Campaign/GetAllCampaigns`,
            {
                UserId: userId,
                ...filters,
            },
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                },
            }
        );
    },
};

interface FavoritePayload {
    CampaignId: number;
    UserId: string;
}

export const CampaignFavoriteService = {
    unfavoriteCampaign: async (payload: FavoritePayload) => {
        return axios.post(
            `${apiEndpoint}/Campaign/UnFavouriteFundraisingCampaign`,
            payload,
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    'Content-Type': 'application/json',
                },
            }
        );
    },

    favoriteCampaign: async (payload: FavoritePayload) => {
        return axios.post(
            `${apiEndpoint}/Campaign/FavouriteFundraisingCampaign`,
            payload,
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    'Content-Type': 'application/json',
                },
            }
        );
    },

    getCountryFlag: async (countryName: string) => {
        try {
            // Try exact match first
            let res = await fetch(
                `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
            );
            let data = await res.json();

            // If exact match not found, fallback to normal search
            if (!data || data.status === 404) {
                res = await fetch(
                    `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
                );
                data = await res.json();
            }
            if (!data || !data[0]) return null;

            // Prefer direct flag from API
            if (data[0].flags?.png) {
                return data[0].flags.png;
            }

            // Otherwise fallback to flagcdn
            const countryCode = data[0].cca2.toLowerCase();
            return `https://flagcdn.com/w320/${countryCode}.png`;

        } catch (error) {
            console.error('Error fetching flag:', error);
            return null;
        }
    }

};

export interface IMyCampaignList {
    Id: number;
    Title: string;
    Purpose: string;
    CampaignCurrentFund: number;
    Duration: Date;
    Goal: number;
    Summary: string;
}

export const MyCampaignsService = {
    getMyCampaigns: async (userId: string) => {
        return axios.get(
            `${apiEndpoint}/Campaign/GetMyCampaigns/${userId}`,
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                },
            }
        );
    },
};

export interface Campaign {
    Id: number;
    FundPurpose: string;
    CampaignTotalAmount: string;
    Duration: string;
    IsActive: boolean;
    CreatedDateTime: string;
}

export const CampaignManagementService = {
    getAllCampaigns: async (token: string, userId: string) => {
        return axios.get(
            `${apiEndpoint}/Campaign/GetAllCampaignList?id=${userId}`,
            {
                headers: {
                    XApiKey: token,
                },
            }
        );
    },

    deleteCampaign: async (campaignId: number, token: string) => {
        return axios.delete(
            `${apiEndpoint}/Campaign/DeleteCampaign?campaignId=${campaignId}`,
            {
                headers: {
                    XApiKey: token,
                },
            }
        );
    },

    toggleCampaignStatus: async (campaignId: number, token: string) => {
        return axios.post(
            `${apiEndpoint}/Campaign/PauseResumeCampaign?campaignId=${campaignId}`,
            {},
            {
                headers: {
                    XApiKey: token,
                },
            }
        );
    },
    RestoreCampaign: async (campaignId: number, token: string) => {
        return axios.post(
            `${apiEndpoint}/Campaign/RestoreCampaign?campaignId=${campaignId}`,
            {},
            {
                headers: {
                    XApiKey: token,
                },
            }
        )
    }
};