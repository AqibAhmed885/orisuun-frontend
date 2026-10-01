import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
    'Content-Type': 'application/json',
};

interface FavouriteBDListParams {
    BdType: string;
    MatchType: number;
    UserId: string | number;
}

interface UnFavouriteParams {
    FavBdPostId: string | number;
    UserId: string | number;
}
interface ProfileTypeResponse {
    Id: number;
    UserProfileName: string;
}

interface LocationsByProfileTypeParams {
    ProfileTypeId: number;
    UserId: string | number;
}

interface GetProfileListParams {
    UserProfileDetailId: number;
    Locations: string;
    UserId: string | number;
}

export const favouriteService = {
    getFavouriteBDList: async (params: FavouriteBDListParams) => {
        const response = await axios.post(
            `${apiEndpoint}/Favourite/GetFavouriteBDListV1`,
            params,
            { headers }
        );
        return response.data.Result;
    },

    unFavouriteBdPost: async (params: UnFavouriteParams) => {
        const response = await axios.post(
            `${apiEndpoint}/Favourite/UnFavouriteBdPost`,
            params,
            { headers }
        );
        return response.status === 200;
    }
    ,

    getProfileTypes: async (): Promise<ProfileTypeResponse[]> => {
        const response = await axios.get(`${apiEndpoint}/MyProfile/GetUserProfileTypes`, { headers });
        return response.data.Result;
    },

    getLocationsByProfileType: async (params: LocationsByProfileTypeParams) => {
        const response = await axios.post(
            `${apiEndpoint}/Leaderboard/GetLocationsListByProfileType`,
            params,
            { headers }
        );
        return response.data.Result;
    },

    getProfileList: async (params: GetProfileListParams) => {
        const response = await axios.post(
            `${apiEndpoint}/Favourite/GetFavouriteProfile`,
            params,
            { headers }
        );
        return response.data.Result;
    },

    getTeamList: async ({ userId, isTeam }: { userId: string; isTeam: boolean }) => {
        const response = await axios.get(
            `${apiEndpoint}/Favourite/GetFavoriteTeams?userId=${userId}&isTeam=${isTeam}`,
            { headers }
        );
        return response.data;
    },

    unFavouriteProfile: async (params: { Id: number; UserId: string | number }) => {
        const response = await axios.post(
            `${apiEndpoint}/Favourite/UnFavouriteProfile`,
            params,
            { headers }
        );
        return response.status === 200;
    }
};
interface FavouriteBDListParams {
    BdType: string;
    MatchType: number;
    UserId: string | number;
}

export interface DiscountResponse {
    Code: string;
    RemainingDiscount: string;
}

export interface SimilarDiscountItem {
    Id: number;
    CompanyName?: string;
    CompanySlogan?: string;
    CompanyLogo?: string;
    DiscountDescription?: string;
    ExpiryDate?: string;
    IsFavourite?: boolean;
    DiscountCreateWebsite?: string;
}

export const discountApi = {
    getCompanyWiseCouponCode: async (id: number, userId: string): Promise<DiscountResponse> => {
        const response = await axios.get(
            `${apiEndpoint}/DiscountPortal/GetCompanyWiseCouponCodeV1?Id=${id}&UserId=${userId}`,
            { headers }
        );
        return response.data.Result;
    },

    setFavouriteDiscount: async (id: number, userId: string, isFavourite: boolean) => {
        const response = await axios.get(
            `${apiEndpoint}/DiscountPortal/SetFavouriteDiscount?Id=${id}&UserId=${userId}&IsFavourite=${isFavourite}`,
            { headers }
        );
        return response.data;
    },

    getSimilarDiscounts: async (discountId: number): Promise<SimilarDiscountItem[]> => {
        const response = await axios.get(
            `${apiEndpoint}/DiscountPortal/GetSimilarDiscounts?discountId=${discountId}`,
            { headers }
        );
        return response.data?.Result || [];
    }
};

export interface DiscountResponse {
    Code: string;
    RemainingDiscount: string;
}

export interface DiscountDetails {
    Result: any[];
}

export const favouriteCardApi = {
    getCompanyWiseCouponCode: async (id: number, userId: string): Promise<DiscountResponse> => {
        const response = await axios.get(
            `${apiEndpoint}/DiscountPortal/GetCompanyWiseCouponCodeV1?Id=${id}&UserId=${userId}`,
            { headers }
        );
        return response.data.Result;
    },

    getDiscountDetails: async (userId: string): Promise<DiscountDetails> => {
        const response = await axios.get(
            `${apiEndpoint}/DiscountPortal/GetDiscountDetails?UserId=${userId}`,
            { headers }
        );
        return response.data;
    },

    setFavouriteDiscount: async (id: number, userId: string, isFavourite: boolean) => {
        const response = await axios.post(
            `${apiEndpoint}/DiscountPortal/ToggleFavoriteDiscount`,
            {
                Id: id,
                UserId: userId,
                IsFavourite: isFavourite,
            },
            { headers }
        );
        return response.data;
    }
};

