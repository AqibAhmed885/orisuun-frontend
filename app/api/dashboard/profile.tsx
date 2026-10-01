import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
import { ProfileBasicFormData, ProfileBusinessFormData, ProfileExpertBasicFormData, ProfileSkillFormData } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

interface tab {
    id: string;
    name: string;
    notification: any;
}

interface PageProps {
    params: { id?: string; username?: string };
    searchParams?: { userProfileTypeId: string };
}
interface ReviewPayload {
    ReviewedProfileId: string;
    UserId: string;
    Service: number;
    Quality: number;
    Cost: number;
    Refer: number;
    Description: string;
}

interface FavoritePayload {
    UserProfileDetailId?: string;
    Id?: string;
    UserId: string;
}

export const profileService = {
    async viewUserProfile(userId: string, profileDetailId: number, userName: string) {
        return axios.post(
            `${apiEndpoint}/Profile/ViewUserProfileV1`,
            {
                UserId: userId,
                UserProfileDetailId: profileDetailId,
                UserName: userName,
            },
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
    },

    async submitReview(reviewData: any) {
        return axios.post(
            `${apiEndpoint}/Profile/SaveProfileReview`,
            reviewData,
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
    },

    async toggleFavorite(payload: any, isFavorite: boolean) {
        const endpoint = !isFavorite
            ? `${apiEndpoint}/Profile/SetFavouriteProfile`
            : `${apiEndpoint}/Favourite/UnFavouriteProfile`;

        return axios.post(endpoint, payload, {
            headers: {
                XApiKey: apiKey,
                'Content-Type': 'application/json',
            },
        });
    },

    async getCountryList() {
        const response = await axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
            headers: {
                XApiKey: apiKey,
            },
        });
        return response.data.Result.map((location: any) => ({
            label: location?.CountryName,
            value: (location?.Id).toString(),
        }));
    }
};
export const advocateService = {
    async uploadPhoto(file: File, blobUrl: string) {
        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        };

        const response = await axios.put(blobUrl, file, config);
        return response;
    },

    async createIndividualPhotos(payload: any) {
        const response = await axios.post(
            `${apiEndpoint}/MyProfile/CreateIndividualPhotos`,
            payload,
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
        return response;
    }
};
export const expertService = {
    async createIndividualProfile(data: ProfileExpertBasicFormData, userId: string) {
        const requestData = {
            UserId: userId,
            Name: data.Name,
            WorkTitle: data.WorkTitle,
            Race: data.Race,
            Nationality: data.Nationality,
            Ethnicity: data.Ethinicity,
            ProfilePicture: data.profilePic || '',
            VideoLink: data.VideoLink,
            AboutYou: data.AboutYou,
            AdditionalAboutYouDetails: data.AdditionalAboutYouDetails,
            Tags: data.Tags,
            ProfileUrl: data.CustomProfileUrl,
        };

        const response = await axios.post(
            `${apiEndpoint}/MyProfile/CreateIndividualProfileDetails`,
            requestData,
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
        return response;
    }
};

export const expertDetailsService = {
    async getCountryList() {
        return axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
            headers: { XApiKey: apiKey },
        });
    },

    async validateProfileUrl(username: string) {
        return axios.get(
            `${apiEndpoint}/Profile/GetProfileDetailsNameWise?UserName=${username}`,
            {
                headers: { XApiKey: apiKey },
            }
        );
    },

    async getCityByRegion(countryId: number) {
        return axios.post(
            `${apiEndpoint}/Profile/GetCityByRegion`,
            { CountryId: countryId },
            {
                headers: { XApiKey: apiKey },
            }
        );
    },

    async uploadProfilePicture(file: File, blobUrl: string) {
        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        };
        return axios.put(blobUrl, file, config);
    }
};
export const basicInformationService = {
    async createBasicInformation(values: ProfileBasicFormData, currentUser: any) {
        const socialMediaLinks = {
            YoutubeUrl: values.Youtubeurl,
            FacebookUrl: values.Facebookurl,
            LinkedinUrl: values.Linkedinurl,
            BlueSkyUrl: values.BlueSkyurl,
            InstagramUrl: values.Instagramurl,
        };

        const basicProfileData = {
            UserId: currentUser.Id,
            UserProfileTypeId: currentUser.UserProfileTypeId,
            UserProfileId: currentUser.UserProfileDetailsId,
            CompanyName: values.CompanyName,
            ProfilePicture: values.profilePic,
            Tagline: values.Tagline,
            CountryOfOrigin: values.CountryOfOrigin,
            City: values.City,
            ProfileUrl: values.CustomProfileUrl,
            AboutCompany: values.AboutCompany,
            SocialMedias: socialMediaLinks,
            Tags: values.Tags,
            CompanyDetails: values.CompanyDetails?.map((detail) => ({
                CompanyDetail: detail,
            })).filter((item) => item.CompanyDetail !== ''),
        };

        if (basicProfileData.AboutCompany === '') {
            throw new Error('About Company is required');
        }

        return axios.post(
            `${apiEndpoint}/Profile/CreateBasicInformationProfile`,
            basicProfileData,
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
    }
};

export const userDetailsService = {
    async uploadProfilePicture(file: File, blobUrl: string) {
        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        };
        const response = await axios.put(blobUrl, file, config);
        return response;
    },

    async getCitiesByCountry(countryId: string) {
        const response = await axios.get(
            `${apiEndpoint}/MyProfile/GetCityList/${countryId}`,
            {
                headers: { XApiKey: apiKey },
            }
        );
        return response;
    },

    async validateProfileUrl(username: string) {
        const response = await axios.get(
            `${apiEndpoint}/Profile/GetProfileDetailsNameWise?UserName=${username}`,
            {
                headers: { XApiKey: apiKey },
            }
        );
        return response;
    }
};
export const businessDetailsService = {
    async getCitiesByCountry(countryId: number) {
        return axios.post(
            `${apiEndpoint}/Profile/GetCityByRegion`,
            {
                CountryId: countryId,
            },
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
    }
};
export const businessPicsService = {
    async uploadFile(file: File, blobUrl: string) {
        return axios.put(blobUrl, file, {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        });
    },

    async uploadMultipleFiles(files: File[], sasToken: string) {
        const uploadedUrls: string[] = [];

        for (const file of files) {
            const fileExtension = file?.name?.split('.')?.pop();
            const randomName = `${uuidv4()}.${fileExtension}`;
            const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;

            try {
                const res = await this.uploadFile(file, blobUrl);
                if (res.status === 201) {
                    uploadedUrls.push(res?.config?.url?.split('??')[0]);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        return uploadedUrls;
    }
};

export const businessInformationService = {
    async createBusinessProfile(values: ProfileBusinessFormData, currentUser: any) {
        const formData = new FormData();

        // User Information
        formData.append('UserId', currentUser.Id.toString());
        formData.append('UserProfileDetailId', currentUser.UserProfileDetailsId.toString());
        formData.append('UserProfileId', currentUser.UserProfileDetailsId?.toString() || '');

        // Address Information
        formData.append('AddressLine1', values.AddressLine1 || '');
        formData.append('AddressLine2', values.AddressLine2 || '');
        formData.append('Country', values.Country || '');
        formData.append('State', values.State || '');
        formData.append('City', values.City || '');
        formData.append('Code', values.Code || '');

        // Business Information
        formData.append('CompanyWebsite', values.Website || '');
        formData.append('NumberofEmployees', values.noOfEmployees?.toString() || '');
        formData.append('EmailIdForQueries', values.emailQueries || '');
        formData.append('EmailIdForBusinessDevelopment', values.emailBusinessDevelopment || '');
        formData.append('BlackOwnershipPercentage', values.blackOwnershipPercentage?.toString() || '');
        formData.append('EthinicityBlackOwnership', values.ethinicityBlackOwnership?.toString() || '');
        formData.append('Language', values?.languages?.join(",") || '');
        formData.append('PhoneNumber', values.phoneNo || '');
        formData.append('Hours', `${values.hoursFrom} - ${values.hoursTo}` || '');
        formData.append('BusinessType', values.businessType || '');
        formData.append('BusinessSince', values.inBusinessSince || '');
        formData.append('PublicCompany', (values.isPrivate || false).toString());

        // Media Files
        if (values.images?.length > 12) {
            throw new Error('Maximum 12 images allowed');
        }

        values.images?.forEach((image: string, index: number) => {
            formData.append(`ProfilePictureList[${index}][OrigionalName]`, image);
        });

        values.videos?.forEach((video: string, index: number) => {
            formData.append(`videoList[${index}][OrigionalName]`, video);
        });

        const response = await axios.post(
            `${apiEndpoint}/Profile/CreateBusinessInformationProfilev1`,
            formData,
            {
                headers: {
                    XApiKey: apiKey,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response;
    }
};

export const locationService = {
    async getCityStateList(countryId: number) {
        const response = await axios.post(
            `${apiEndpoint}/Profile/GetCityStateList`,
            {
                CountryId: countryId,
            },
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );

        if (response.status === 200) {
            return {
                states: response.data.Result?.StateData.map((item: any) => ({
                    value: item.Id.toString(),
                    label: item.StateName,
                })),
                cities: response.data.Result?.CityData?.map((item: any) => ({
                    value: item.Id.toString(),
                    label: item.CityName,
                })),
            };
        }
        throw new Error('Failed to fetch city/state list');
    },

    async getLocationsList() {
        try {
            const response = await axios.get(`${apiEndpoint}/Search/GetLocationsListV1`, {
                headers: {
                    accept: '*/*',
                    XApiKey: apiKey,
                },
            });
            return response.data.Result;
        } catch (error) {
            console.error('Error fetching locations:', error);
            return [];
        }
    }
};

export const chartsService = {
    async getCityStateList(countryId: number) {
        const response = await axios.post(
            `${apiEndpoint}/Profile/GetCityStateList`,
            { CountryId: countryId },
            { headers: { XApiKey: apiKey } }
        );

        if (response.status === 200) {
            return response.data.Result?.CityData?.map((item: any) => ({
                value: item.Id.toString(),
                label: item.CityName,
            }));
        }
        throw new Error('Failed to fetch cities');
    },

    async getIndustriesList() {
        const response = await axios.get(
            `${apiEndpoint}/Search/GetIndustriesList`,
            {
                headers: {
                    accept: '*/*',
                    XApiKey: apiKey,
                },
            }
        );

        if (response.status === 200) {
            return response.data.Result.map((data: any) => ({
                label: data.IndustryName,
                value: data.Id,
            }));
        }
        throw new Error('Failed to fetch industries');
    },

    async createServicesCharts(businessChartData: any) {
        const response = await axios.post(
            `${apiEndpoint}/Profile/CreateServicesChartsInformationProfile`,
            businessChartData,
            { headers: { XApiKey: apiKey } }
        );
        return response;
    }
};

export const industryService = {
    async saveUserIndustrySelection(selectedIndustryData: {
        UserId: number;
        UserProfileTypeId: number;
        UserProfileDetailId: number;
        IndustryList: number[];
    }) {
        try {
            const response = await axios.post(
                `${apiEndpoint}/Profile/SaveUserSelectionInformation`,
                selectedIndustryData,
                {
                    headers: {
                        XApiKey: apiKey,
                    },
                }
            );
            return response;
        } catch (error) {
            console.error('Error saving industry selection:', error);
            throw error;
        }
    },

    async getAllIndustries() {
        try {
            const response = await axios.get(
                `${apiEndpoint}/MyProfile/GetAllIndustries`,
                {
                    headers: {
                        XApiKey: apiKey,
                    },
                }
            );

            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data.Message,
                    data: response.data.Result,
                };
            }

            throw new Error('Failed to fetch industries');
        } catch (error) {
            console.error('Error fetching industries:', error);
            return {
                success: false,
                message: 'An Error Occurred',
            };
        }
    }
};

export interface QualificationsData {
    UserId: number;
    UserProfileDetailId: number;
    AffiliationData: string[];
    certificateModels: {
        CertificateName: string;
        CertificateYear: string;
    }[];
    RecognitionData: {
        RecognitionName: string;
        Year: string;
    }[];
}

export const qualificationsService = {
    async createQualifications(data: QualificationsData) {
        try {
            const response = await axios.post(
                `${apiEndpoint}/Profile/CreateQualificationsInformationProfile`,
                data,
                {
                    headers: {
                        XApiKey: apiKey,
                    },
                }
            );

            return {
                success: true,
                message: response.data.Message,
                data: response.data.Result,
            };
        } catch (error) {
            console.error('Error creating qualifications:', error);
            throw error;
        }
    }
};

interface SkillsData {
    UserId: number;
    UserIndividualProfileId: number;
    Experiences: ProfileSkillFormData['Experiences'];
    Educations: ProfileSkillFormData['Educations'];
    Skills: ProfileSkillFormData['Skills'];
}

export const skillsService = {
    async createSkillsAndCapabilities(data: SkillsData) {
        try {
            const response = await axios.post(
                `${apiEndpoint}/MyProfile/CreateIndividualSkillsAndCapabilities`,
                data,
                {
                    headers: {
                        XApiKey: apiKey,
                    },
                }
            );

            return {
                success: true,
                message: response.data.Message,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            console.error('Error creating skills:', error);
            throw error;
        }
    }
};

export const searchResultService = {
    async getLocationsList() {
        try {
            const response = await axios.get(`${apiEndpoint}/Search/GetLocationsListV1`, {
                headers: {
                    accept: '*/*',
                    XApiKey: apiKey,
                },
            });
            return response.data.Result;
        } catch (error) {
            console.error('Error fetching locations:', error);
            return [];
        }
    },

    async getIndustriesList() {
        try {
            const response = await axios.get(`${apiEndpoint}/Search/GetIndustriesList`, {
                headers: {
                    accept: '*/*',
                    XApiKey: apiKey,
                },
            });
            return response.data.Result;
        } catch (error) {
            console.error('Error fetching industries:', error);
            return [];
        }
    },

    async getFilteredProfiles(payload: any) {
        try {
            const response = await axios.post(
                `${apiEndpoint}/Search/GetFilteredPostProfilesV1`,
                payload,
                {
                    headers: {
                        accept: '*/*',
                        XApiKey: apiKey,
                    },
                }
            );
            return response.data.Result.FilteredProfiles;
        } catch (error) {
            console.error('Error fetching filtered profiles:', error);
            return [];
        }
    }
};
export const searchService = {
    getLocationsList: async () => {
        const response = await axios.get(`${apiEndpoint}/Search/GetLocationsListV1`, {
            headers: {
                accept: '*/*',
                XApiKey: apiKey,
            }
        });
        return response.data.Result;
    },

    getIndustriesList: async () => {
        const response = await axios.get(`${apiEndpoint}/Search/GetIndustriesList`, {
            headers: {
                accept: '*/*',
                XApiKey: apiKey,
            }
        });
        return response.data.Result;
    },

    getFilteredProfiles: async (payload) => {
        const response = await axios.post(
            `${apiEndpoint}/Search/GetFilteredPostProfilesV1`,
            payload,
            {
                headers: {
                    accept: '*/*',
                    XApiKey: apiKey,
                },
            }
        );
        return response.data.Result.FilteredProfiles;
    },
    getCitySuggestions: (cities, searchText) => {
        if (!searchText || typeof searchText !== 'string' || searchText.length === 0) {
            return [];
        }

        const allCities = cities.flatMap((region) => region.CityList);
        return allCities.filter(
            (city) =>
                typeof city.CityName === 'string' &&
                city.CityName.toLowerCase().includes(searchText.toLowerCase())
        );
    }
};