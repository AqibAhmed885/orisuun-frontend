import axios from 'axios';
import countryData from 'country-list/data.json';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

type CountryDataItem = {
    code: string;
    name: string;
};

const countryAliases: Record<string, string> = {
    "bolivia": "BO",
    "brunei": "BN",
    "burma": "MM",
    "cape verde": "CV",
    "congo": "CG",
    "czech republic": "CZ",
    "democratic republic of congo": "CD",
    "dr congo": "CD",
    "drc": "CD",
    "east timor": "TL",
    "iran": "IR",
    "ivory coast": "CI",
    "cote d ivoire": "CI",
    "cote divoire": "CI",
    "kosovo": "XK",
    "laos": "LA",
    "macedonia": "MK",
    "micronesia": "FM",
    "moldova": "MD",
    "north korea": "KP",
    "palestine": "PS",
    "russia": "RU",
    "south korea": "KR",
    "swaziland": "SZ",
    "syria": "SY",
    "taiwan": "TW",
    "tanzania": "TZ",
    "turkey": "TR",
    "united kingdom": "GB",
    "uk": "GB",
    "united states": "US",
    "usa": "US",
    "vatican city": "VA",
    "venezuela": "VE",
    "vietnam": "VN",
};

const normalizeCountryName = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const getCountryCode = (countryName: string) => {
    const normalizedCountryName = normalizeCountryName(countryName);

    if (countryAliases[normalizedCountryName]) {
        return countryAliases[normalizedCountryName];
    }

    const matchedCountry = (countryData as CountryDataItem[]).find(
        (country) => normalizeCountryName(country.name) === normalizedCountryName
    );

    return matchedCountry?.code;
};

export const leaderboard = {
    getProfileTypes: async () => {
        const response = await axios.get(`${apiEndpoint}/MyProfile/GetUserProfileTypes`, { headers });
        return response.data.Result;
    },

    getLocationsByProfileType: async (profileTypeId: number, userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Leaderboard/GetLocationsListByProfileType`,
            { ProfileTypeId: profileTypeId, UserId: userId },
            { headers }
        );
        return response.data.Result;
    },

    getIndustriesByProfileType: async (profileTypeId: number, userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Leaderboard/GetIndustriesListByProfileType`,
            { ProfileTypeId: profileTypeId, UserId: userId },
            { headers }
        );
        return response.data.Result;
    },

    setFavouriteProfile: async (profile: any, isFavourite: boolean, userId: string) => {
        const endpoint = !isFavourite
            ? `${apiEndpoint}/Profile/SetFavouriteProfile`
            : `${apiEndpoint}/Favourite/UnFavouriteProfile`;

        const payload = {
            [!isFavourite ? 'UserProfileDetailId' : 'Id']: isFavourite
                ? profile?.FavouriteProfileId
                : profile.ProfileDetailId,
            UserId: userId,
        };

        const response = await axios.post(endpoint, payload, { headers });
        return response.data.Result;
    },

    getFilteredProfiles: async (filters: any) => {
        const response = await axios.post(`${apiEndpoint}/Leaderboard/Profiles`, filters, { headers });
        return response.data.Result;
    },

    fetchCountryFlag: async (countryName: string) => {
        const countryCode = getCountryCode(countryName);

        if (!countryCode) {
            console.warn(`Flag country code not found for: ${countryName}`);
            return null;
        }

        return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
    }
};
