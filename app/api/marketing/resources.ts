import axios from 'axios';

/**
 * Fetches country list from Orisuun API and normalizes to string[]
 */
export type CountryItem = { id: string | number; name: string, regionId: number };
export type StateItem = { id: string | number; name: string };
export type CityItem = { id: string | number; name: string };
export type ResourceTypeItem = { id: number; name: string; TotalResourceCount?: number; TotalCitiesResources?: number; CountryBreakdown?: { CountryId: number; CountryName: string; ResourceCount: number }[] };

const header = {
    XApiKey: process.env.NEXT_PUBLIC_API_KEY || '',
    accept: '*/*',
}

const apiBaseUrl = 'https://api.orisuun.com/api';

export const getCountryList = async (): Promise<CountryItem[]> => {
    try {
        const res = await axios.get(`${apiBaseUrl}/MyProfile/GetCountryList`, {
            headers: header,
        });

        const data = res.data;

        let list: any = [];
        list = data.Result;

        const mapped: CountryItem[] = list.map((c: any, idx: number) => {
            const id = c?.Id;
            const regionId = c?.RegionId;
            const name = c?.CountryName;
            return { id, name, regionId };
        });

        return mapped;
    } catch (err) {
        console.error('getCountryList error', err);
        return [];
    }
};

export default getCountryList;

/**
 * Fetch all resource types.
 */
export const getResourceTypes = async (): Promise<ResourceTypeItem[]> => {
    try {
        const res = await axios.get(`${apiBaseUrl}/Resources/GetAllResourceTypes`, {
            headers: header,
        });

        const data = res.data;
        let list: any = [];
        list = data.Result;

        const mapped: ResourceTypeItem[] = list.map((r: any) => ({
            id: r.Id,
            name: r.TypeName,
            TotalResourceCount: r.TotalResourceCount || 0,
            TotalCitiesResources: r.TotalCitiesResources || 0,
            CountryBreakdown: r.CountryBreakdown?.map((c: any) => ({
                CountryId: c.CountryId,
                CountryName: c.CountryName,
                ResourceCount: c.ResourceCount || 0,
            })) || [],
        }));

        return mapped;
    } catch (err) {
        console.error('getResourceTypes error', err);
        return [];
    }
};

/**
 * Fetch cities for a given country id.
 * Example endpoint: GET /api/MyProfile/GetCityList/{countryId}
 */
export const getCityList = async (countryId: number | string): Promise<CityItem[]> => {
    try {
        const url = `${apiBaseUrl}/MyProfile/GetCityList/${countryId}`;
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        let list: any = [];
        list = data.Result;

        const mapped: CityItem[] = list.map((c: any) => {
            if (typeof c === 'string') return { id: c, name: c };
            // label/value shape
            if (c?.label) return { id: c.value ?? c.Value ?? c.label, name: c.label };
            if (c?.value && c?.label === undefined) {
                return { id: c.value ?? c.Value, name: String(c.value ?? c.Value) };
            }
            return { id: String(c), name: String(c) };
        });

        return mapped;
    } catch (err) {
        console.error('getCityList error', err);
        return [];
    }
};

/**
 * Fetch states for a given country id.
 * Example endpoint: GET /api/MyProfile/GetStateList/{countryId}
 */
export const getStateList = async (countryId: number | string): Promise<StateItem[]> => {
    try {
        const url = `${apiBaseUrl}/MyProfile/GetStateListByCountry/${countryId}`;
        const res = await axios.get(url, {
            headers: header ,
            },
        );

        const data = res.data;
        let list: any = [];
        list = data.Result;

        const mapped: StateItem[] = list.map((s: any) => {
            if (typeof s === 'string') return { id: s, name: s };
            if (s?.StateName) return { id: s.Id ?? s.id, name: s.StateName };
            return { id: String(s), name: String(s) };
        });

        return mapped;
    } catch (err) {
        console.error('getStateList error', err);
        return [];
    }
};

/**
 * Create a new resource via POST /Resources/CreateResource
 */
export const saveResource = async (payload: any, captchaToken: string): Promise<any> => {
    try {
        const res = await axios.post(`${apiBaseUrl}/Resources/CreateResource?ReCAPTCHAToken=${encodeURIComponent(captchaToken)}`, payload, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (err) {
        console.error('saveResource error', err);
        throw err;
    }
};

/**
 * Save a resource for later for a signed-in user.
 * POST /Resources/SaveResource
 */
export const saveResourceForLater = async (
    userId: string,
    resourceId: string,
    resourceStatus: string = 'saved'
): Promise<any> => {
    try {
        const res = await axios.post(
            `${apiBaseUrl}/Resources/SaveResource`,
            {
                UserId: userId,
                ResourceId: resourceId,
                ResourceStatus: resourceStatus,
            },
            {
                headers: {
                    ...header,
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data;
    } catch (err) {
        console.error('saveResourceForLater error', err);
        throw err;
    }
};

/**
 * Fetch all resources with optional filters.
 * GET /api/Resources/GetAllResources?resourceTypeId={id}&includeExpired={bool}&page={num}&pageSize={num}
 * Assuming it also accepts regionId, countryId, cityId
 */
export const getAllResources = async (params: {
    resourceTypeId?: number;
    regionId?: number;
    countryId?: number;
    cityId?: number;
    includeExpired?: boolean;
    page?: number;
    pageSize?: number;
}): Promise<any[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.resourceTypeId !== undefined) queryParams.append('resourceTypeId', params.resourceTypeId.toString());
        if (params.regionId !== undefined) queryParams.append('regionId', params.regionId.toString());
        if (params.countryId !== undefined) queryParams.append('countryId', params.countryId.toString());
        if (params.cityId !== undefined) queryParams.append('cityId', params.cityId.toString());
        if (params.includeExpired !== undefined) queryParams.append('includeExpired', params.includeExpired.toString());
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());

        const url = `${apiBaseUrl}/Resources/GetAllResources?${queryParams.toString()}`;
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        return data.Result?.Resources  || []; // Assuming the response has a Result array
    } catch (err) {
        console.error('getAllResources error', err);
        return [];
    }
};

export const getRegionsWithResourceCounts = async (): Promise<{ id: number; name: string; resourceCount: number, countryBreakdown: { countryId: number; countryName: string; resourceCount: number }[] }[]> => {
    try {
        const res = await axios.get(`${apiBaseUrl}/Resources/GetAllRegionsWithResourceCounts`, {
            headers: header,
        });

        const data = res.data;
        let list: any = [];
        list = data.Result;

        const mapped = list.map((r: any) => ({
            id: r.Id,
            name: r.RegionName,
            resourceCount: r.TotalResourceCount || 0,
            countryBreakdown: r.CountryBreakdown?.map((c: any) => ({
                countryId: c.CountryId,
                countryName: c.CountryName,
                resourceCount: c.ResourceCount || 0,
            })) || [],
        }));

        return mapped;
    } catch (err) {
        console.error('getRegionsWithResourceCounts error', err);
        return [];
    }
};


/**
 * Fetch all countries with resource counts for a given region.
 * GET /Resources/GetAllCountriesWithResourceCounts?regionId={id}
 */
export const getCountriesWithResourceCounts = async (regionId: number): Promise<{
    id: number;
    name: string;
    resourceCount: number;
}[]> => {
    try {
        const url = `${apiBaseUrl}/Resources/GetAllCountriesWithResourceCounts?regionId=${regionId}`;
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        let list: any = [];
        list = data.Result;
        const mapped = list.map((c: any) => ({
            id: c.Id,
            name: c.CountryName,
            resourceCount: c.ResourceCount || 0,
        }));

        return mapped;
    } catch (err) {
        console.error('getCountriesWithResourceCounts error', err);
        return [];
    }
};

/**
 * Fetch all states with resource counts for a specific country.
 * GET /Resources/GetAllStatesWithResourceCounts?countryId={id}
 */
export const getStatesWithResourceCounts = async (countryId: number): Promise<{
    id: number;
    name: string;
    resourceCount: number;
}[]> => {
    try {
        const url = `${apiBaseUrl}/Resources/GetAllStatesWithResourceCounts?countryId=${countryId}`;
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        let list: any = [];
        list = data.Result;

        const mapped = list.map((s: any) => ({
            id: s.Id,
            name: s.StateName,
            resourceCount: s.ResourceCount || 0,
        }));
        return mapped;
    } catch (err) {
        console.error('getStatesWithResourceCounts error', err);
        return [];
    }
};

/**
 * Fetch all cities with resource counts, optionally filtered by country or state.
 * GET /Resources/GetAllCitiesWithResourceCounts?countryId={id}&stateId={stateId}
 */
export const getCitiesWithResourceCounts = async (countryId?: number, stateId?: number): Promise<{
    id: number;
    name: string;
    resourceCount: number;
}[]> => {
    try {
        let url = `${apiBaseUrl}/Resources/GetAllCitiesWithResourceCounts`;
        const params = [];
        if (countryId !== undefined) {
            params.push(`countryId=${countryId}`);
        }
        if (stateId !== undefined) {
            params.push(`stateId=${stateId}`);
        }
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        let list: any = [];
        list = data.Result;


        const mapped = list.map((c: any) => ({
            id: c.Id,
            name: c.CityName,
            resourceCount: c.ResourceCount || 0,
        }));
        return mapped;
    } catch (err) {
        console.error('getCitiesWithResourceCounts error', err);
        return [];
    }
};

/**
 * Search resources by term
 * GET /Resources/SearchResources?searchTerm={term}&page={page}&pageSize={pageSize}
 */
export const searchResources = async (searchTerm: string, page: number = 1, pageSize: number = 20): Promise<any[]> => {
    try {
        const url = `${apiBaseUrl}/Resources/SearchResources?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`;
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        return data.Result?.Resources || [];
    } catch (err) {
        console.error('searchResources error', err);
        return [];
    }
};

/**
 * Fetch resources stats data.
 * GET /Resources/GetResourcesData
 */
export const getResourcesStats = async (): Promise<{
    TotalAccelerators: number;
    TotalGrantsAmount: number;
    TotalPrizeAmount: number;
    TotalCountries: number;
    TotalResources: number;
}> => {
    try {
        const url = `${apiBaseUrl}/Resources/GetResourcesData`;
        const res = await axios.get(url, {
            headers: header,
        });

        const data = res.data;
        return data.Result;
    } catch (err) {
        console.error('getResourcesStats error', err);
        return {
            TotalAccelerators: 0,
            TotalGrantsAmount: 0,
            TotalPrizeAmount: 0,
            TotalCountries: 0,
            TotalResources: 0,
        };
    }
};

/**
 * Check if a resource already exists
 * GET /api/Resources/CheckIfResourceExists?name={name}&resourceTypeId={id}
 * Note: API may return 404 with a body indicating existence; handle both 200 and special 404.
 */
export const checkResourceExists = async (name: string, resourceTypeId: number | string): Promise<boolean> => {
    const params = new URLSearchParams({ name: name.trim(), resourceTypeId: String(resourceTypeId) });
    const url = `${apiBaseUrl}/Resources/CheckIfResourceExists?${params.toString()}`;
    try {
        const res = await axios.get(url, { headers: header });
        const data = res.data;
        if (res.status === 200 && data?.StatusCode === 200) {
            return data.Result === true;
        }
        return false;
    } catch (err: any) {
        // Some backends use 404 + message to signal existence
        const status = err?.response?.status;
        const data = err?.response?.data;
        if (status === 404 && (data?.Result === true || /already exists/i.test(String(data?.Message || '')))) {
            return true;
        }
        return false;
    }
};

/**
 * Download resources as PDF with various filter options.
 * GET /Resources/GetResourcePdf
 * 
 * Six variations supported:
 * 1. By Resource Type: ?resourceTypeId={id}
 * 2. By City: ?cityId={id}
 * 3. By Country: ?countryId={id}
 * 4. By State: ?countryId={id}&stateId={id}
 * 5. Search Results: ?searchTerm={term}
 * 6. Filtered View: ?regionId={id}&includeBlackFocused={bool}&includeAllCountry={bool}
 */
export const downloadResourcesPdf = async (params: {
    resourceTypeId?: number;
    cityId?: number;
    countryId?: number;
    stateId?: number;
    regionId?: number;
    searchTerm?: string;
    includeBlackFocused?: boolean;
    includeAllCountry?: boolean;
}): Promise<Blob> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.resourceTypeId !== undefined) queryParams.append('resourceTypeId', params.resourceTypeId.toString());
        if (params.cityId !== undefined) queryParams.append('cityId', params.cityId.toString());
        if (params.countryId !== undefined) queryParams.append('countryId', params.countryId.toString());
        if (params.stateId !== undefined) queryParams.append('stateId', params.stateId.toString());
        if (params.regionId !== undefined) queryParams.append('regionId', params.regionId.toString());
        if (params.searchTerm) queryParams.append('searchTerm', encodeURIComponent(params.searchTerm));
        if (params.includeBlackFocused !== undefined) queryParams.append('includeBlackFocused', params.includeBlackFocused.toString());
        if (params.includeAllCountry !== undefined) queryParams.append('includeAllCountry', params.includeAllCountry.toString());

        const url = `${apiBaseUrl}/Resources/GetResourcePdf?${queryParams.toString()}`;
        const res = await axios.get(url, {
            headers: {
                ...header,
                accept: '*/*',
            },
            responseType: 'blob',
        });

        return res.data;
    } catch (err) {
        console.error('downloadResourcesPdf error', err);
        throw new Error('Failed to download resources PDF');
    }
};

