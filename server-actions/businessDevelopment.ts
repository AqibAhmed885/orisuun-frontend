'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string

const getAuthHeaders = () => {
  const token = cookies().get('token')?.value;

  return {
    XApiKey: apiKey,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.errors ||
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.message ||
      'An Error Occurred'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An Error Occurred';
};
export async function getRegionListAction() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/Explore/GetRegionList`,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: ' Region List Saved!',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getCityandCountryListAction(regionId: number) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/BusinessOpportunity/GetCountryListByRegionId/${regionId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: ' City country List fetched!',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getSearchLocations(term: string) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/BusinessOpportunity/SearchLocations/${term}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: ' City country List fetched!',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getAllSubIndustires() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/Profile/GetAllSubIndustryList`,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: 'Industry List fetched!',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function createNewBusinessOpportunity(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/CreateBusinessOpportunityV1`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: ' Region List Saved!',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getBusinessOppurtuniyDetailsById(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/GetOverViewOfBdDetails`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: 'BusinessOpportunity Fetched',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getBusinessOpportunitySeekingList(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/GetBDSeekingList`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: 'Data Fetched Successfully!',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getBusinessOpportunityFacilitateList(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/GetBDFacilateList`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      message: 'Data Fetched Successfully!',

      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

// export async function getComplementaryPosts(data: any) {
//   try {
//     const response = await axios.post(
//       `${apiEndpoint}/BusinessOpportunity/GetComplementaryPosts`,
//       data,
//       {
//         headers: {
//           XApiKey: apiKey,
//         },
//       }
//     );
//     return {
//       success: true,
//       message: 'Complementary Posts Fetched',
//       data: response.data.Result,
//     };
//   } catch (error) {
//     console.error('Axios error:', error);
//     return {
//       success: false,
//       message: 'An Error Occured',
//     };
//   }
// }

// export async function getSuggestedUsers(data: any) {
//   try {
//     const response = await axios.post(
//       `${apiEndpoint}/BusinessOpportunity/GetSuggestedUsers`,
//       data,
//       {
//         headers: {
//           XApiKey: apiKey,
//         },
//       }
//     );
//     return {
//       success: true,
//       message: 'Suggested Users Fetched',
//       data: response.data.Result,
//     };
//   } catch (error) {
//     console.error('Axios error:', error);
//     return {
//       success: false,
//       message: 'An Error Occured',
//     };
//   }
// }

export async function getUsersMatchedWithOpportunity(opportunityId: string | number) {
  try {
    const url = `${apiEndpoint}/BusinessOpportunity/GetUsersMatchedWithOpportunity?opportunityId=${encodeURIComponent(String(opportunityId))}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });
    return {
      success: true,
      message: 'Users Matched Fetched',
      data: response.data.Result ?? response.data,
    };
  } catch (error) {
    console.error('getUsersMatchedWithOpportunity error:', error);
    return { success: false, message: 'An Error Occured', data: [] };
  }
}

export async function getRecommendedUsersForOpportunity(opportunityId: string | number) {
  try {
    const url = `${apiEndpoint}/BusinessOpportunity/GetRecommendedUsersForOpportunity?opportunityId=${encodeURIComponent(String(opportunityId))}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });

    return {
      success: true,
      message: 'Recommended Users Fetched',
      data: response.data.Result ?? response.data,
    };
  } catch (error) {
    console.error('getRecommendedUsersForOpportunity error:', error);
    return { success: false, message: 'An Error Occured', data: [] };
  }
}


