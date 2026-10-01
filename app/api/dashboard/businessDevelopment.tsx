import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
import { BusinessOpportunitiesData } from '@/utils/schema';

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const getMatchedListBasedonBdId = async (BDId: string, UserId: string) => {
  try {

    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/GetMatchedListBasedonBdId`,
      { BDId, UserId },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};


// ...existing code...
export const getOpportunityVisitors = async (opportunityId: string) => {
  try {
    const url = `${apiEndpoint}/BusinessOpportunity/GetOpportunityVisitors?opportunityId=${encodeURIComponent(opportunityId)}`;
    const response = await axios.get(url, {
      headers: { XApiKey: apiKey },
    });
    // adjust return shape depending on your API (response.data or response.data.Result)
    return response.data;
  } catch (error) {
    console.error('getOpportunityVisitors error', error);
    throw error;
  }
};

export const trackOpportunityVisit = async (opportunityId: string | number, visitByUserId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/TrackOpportunityVisit`,
      {
        OpportunityId: opportunityId,
        VisitByUserId: visitByUserId,
      },
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error tracking visit:', error);
    return { success: false, error: error.message };
  }
};

interface LocationPayload {
  CityIds: { CityId: number }[];
  CountryIds: { CountryId: number }[];
  StateIds: { StateId: number }[];
  BDId: string | number;
}


export const locationService = {
  searchLocations: async (term: string, regionId: Number) => {
    const response = await axios.get(
      `${apiEndpoint}/BusinessOpportunity/SearchLocations?searchString=${term}&RegionId=${regionId}`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data.Result;
  },

  saveBDLocations: async (payload: LocationPayload, apiKey: string) => {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/SaveBDCountryAndCity`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data;
  },
};

export const continentsService = {
  getCityAndCountryList: async (regionId: number, BDId: string | number) => {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/GetCityAndCountryList`,
      {
        RegionId: regionId,
        BDId: BDId
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data;
  }
};

interface SaveUserBdTypePayload {
  BDType: string;
  BDId: number;
  userId: string | number;
}

export const businessOpportunityService = {
  saveUserBdType: async (payload: SaveUserBdTypePayload) => {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/SaveUserBdType`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data;
  }
};

interface SaveIndustryPayload {
  BdId: number | string;
  IndustryList: number[];
  IndustryType: string;
}

export const industryService = {
  getIndustriesList: async () => {
    const response = await axios.get(
      `${apiEndpoint}/Explore/GetIndustriesList`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data;
  },

  saveBDIndustryList: async (payload: SaveIndustryPayload) => {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/SaveBDIndustryList`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data;
  },
};

interface SaveDescriptionPayload {
  StrategyName: string;
  Name: string;
  RepresentativeName: string;
  PhoneNumber: string;
  Email: string;
  OpportunityStructure: string;
  timeLine: string;
  Description: string;
  TagsInput: string;
  BDId: string | number;
  TacticsNames: { TacticsName: string }[];
  IsFilled: boolean;
}

export const businessDevelopmentStepsService = {
  saveBdDescriptionData: async (data: BusinessOpportunitiesData, BdId: string | number, apiKey: string) => {
    const payload: SaveDescriptionPayload = {
      StrategyName: data?.strategy,
      Name: data?.jobTitle,
      RepresentativeName: data?.representativeName,
      PhoneNumber: data?.phone,
      Email: data?.email,
      OpportunityStructure: data?.structure,
      timeLine: data?.timeline,
      Description: data?.description,
      TagsInput: (data?.tags)?.join(", "),
      BDId: BdId,
      TacticsNames: data?.tactics?.map((t) => ({ TacticsName: t })),
      IsFilled: true
    };

    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/SaveBdDescriptionData`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data;
  }
};

interface SaveDescriptionPayload {
  StrategyName: string;
  Name: string;
  RepresentativeName: string;
  PhoneNumber: string;
  Email: string;
  OpportunityStructure: string;
  timeLine: string;
  Description: string;
  TagsInput: string;
  BDId: string | number;
  TacticsNames: { TacticsName: string }[];
  IsFilled: boolean;
}

export const businessDevelopmentService = {
  saveBdDescriptionData: async (data: BusinessOpportunitiesData, id: string | number, apiKey: string) => {
    const payload = {
      StrategyName: data?.strategy,
      Name: data?.jobTitle,
      RepresentativeName: data?.representativeName,
      PhoneNumber: data?.phone,
      Email: data?.email,
      OpportunityStructure: data?.structure,
      timeLine: data?.timeline,
      Description: data?.description,
      TagsInput: (data?.tags)?.join(", "),
      BDId: id,
      TacticsNames: data?.tactics?.map((t) => ({ TacticsName: t })),
      IsFilled: true
    };

    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/SaveBdDescriptionData`,
      payload,
      {
        headers: { XApiKey: apiKey },
      }
    );
    return response.data;
  },

  getBDEditDetails: async (id: string | number, apiKey: string) => {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/GetBDEditDetails`,
      { BDId: id },
      {
        headers: { XApiKey: apiKey },
      }
    );
    return response.data;
  }
};