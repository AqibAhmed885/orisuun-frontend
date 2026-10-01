import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const searchService = {
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

    getCitySuggestions(cities: any[], searchText: string) {
        const findCities = cities.flatMap((region) => region.CityList);
        return searchText.length > 0
            ? findCities.filter(
                (city) =>
                    typeof city.CityName === 'string' &&
                    city.CityName.toLowerCase().includes(searchText.toLowerCase())
            )
            : [];
    }
};

export const postSearchService = {
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

    getCitySuggestions(cities: any[], searchText: string) {
        const findCities = cities.flatMap((region) => region.CityList);
        return searchText.length > 0
            ? findCities.filter(
                (city) =>
                    typeof city.CityName === 'string' &&
                    city.CityName?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
            : [];
    }
};

interface Country {
    id: string;
    CountryName: string;
    RegionId: number;
}

export const fetchCountryList = async (): Promise<Country[]> => {
    try {
        const response = await axios.get(`${apiEndpoint}/Profile/GetCountryList`, {
            headers: {
                accept: '*/*',
                XApiKey: apiKey,
            },
        });
        
        return response.data.Result.map((country: any) => ({
            id: country.Id.toString(), 
            CountryName: country.CountryName,
            RegionId: country.RegionId
        }));
    } catch (error) {
        console.error('Error fetching country list:', error);
        return [];
    }
};

interface Country {
    id: string;
    IndustryName: string;
}
export const fetchIndustryList = async (): Promise<Country[]> => {
    try {
        const response = await axios.get(`${apiEndpoint}/Search/GetIndustriesList`, {
            headers: {
                accept: '*/*',
                XApiKey: apiKey,
            },
        });
        return response.data.Result.map((industry: any) => ({
            id: industry.Id.toString(), 
            IndustryName: industry.IndustryName
        }));
    } catch (error) {
        console.error('Error fetching country list:', error);
        return [];
    }
};