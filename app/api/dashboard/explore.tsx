import axios from 'axios';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const headers = {
    XApiKey: apiKey,
};

export interface CountryCityPayload {
    CountryId: number;
}

export interface GeographyProfilePayload {
    UserId: string;
    CountryCities: string[];
    RegionName: string;
    Locations: string[];
    boTypes: string[];
    IsVerified: boolean;
    IsBlackedOwned: boolean;
    country: string;
    ProfileTypes: string[];
    Industries: any[];
    PageSize: number;
    PageNo: number;
    ParentId: number;
    SortPrimary: string;
    SortSecondary: string;
    SortTertiary: string;
    SortQuaternary: string;
    MatchesType: number[];
}

export const geographyApi = {
    getCityStateList: async (payload: CountryCityPayload) => {
        const response = await axios.post(
            `${apiEndpoint}/Profile/GetCityStateList`,
            payload,
            { headers }
        );
        return response.data.Result;
    },

    getCountryByRegion: async (regionId: number) => {
        const response = await axios.post(
            `${apiEndpoint}/Profile/GetCountryByRegion`,
            { RegionId: regionId },
            { headers }
        );
        return response.data.Result;
    },

    getLocationsListV1: async () => {
        const response = await axios.get(
            `${apiEndpoint}/Search/GetLocationsListV1`,
            { headers }
        );
        return response.data.Result;
    },

    getUserProfileTypes: async () => {
        const response = await axios.get(
            `${apiEndpoint}/MyProfile/GetUserProfileTypes`,
            { headers }
        );
        return response.data.Result;
    },

    getGeographyProfilesV1: async (payload: GeographyProfilePayload) => {
        const response = await axios.post(
            `${apiEndpoint}/Explore/GeoGraphyProfilesV1`,
            payload,
            { headers }
        );
        return response.data.Result;
    }
};

export interface IndustryProfilePayload {
    UserId: string;
    CountryCities: string[];
    Locations: string[];
    boTypes: string[];
    IsVerified: boolean;
    IsBlackedOwned: boolean;
    ProfileTypes: string[];
    Industries: any[];
    PageSize: number;
    PageNo: number;
    ParentId: number;
    SortPrimary: string;
    SortSecondary: string;
    SortTertiary: string;
    SortQuaternary: string;
    MatchesType: number[];
}

export const industryApi = {
    getCountryByRegion: async (regionId: number) => {
        const response = await axios.post(
            `${apiEndpoint}/Profile/GetCountryByRegion`,
            { RegionId: regionId },
            { headers }
        );
        return response.data.Result;
    },

    getLocationsListV1: async () => {
        const response = await axios.get(
            `${apiEndpoint}/Search/GetLocationsListV1`,
            { headers }
        );
        return response.data.Result;
    },

    getUserProfileTypes: async () => {
        const response = await axios.get(
            `${apiEndpoint}/MyProfile/GetUserProfileTypes`,
            { headers }
        );
        return response.data.Result;
    },

    getIndustriesIdWise: async (id: string, userId: string) => {
        const response = await axios.get(
            `${apiEndpoint}/Profile/GetIndustriesIdWise?Id=${id}&UserId=${userId}`,
            { headers }
        );
        return response.data.Result;
    },

    getIndustryProfiles: async (payload: IndustryProfilePayload) => {
        const response = await axios.post(
            `${apiEndpoint}/Explore/IndustryProfilesV1`,
            payload,
            { headers }
        );
        return response.data.Result;
    }
};