'use server';

import axios from 'axios';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string
export async function addBasicDetailsAction(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateBusinessBasicProfileDetails`,
      data,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    return {
      success: true,
      message: 'Basic Details Saved!',
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

export async function addIndividualBasicDetailsAction(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateIndividualProfileDetails`,
      data,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    return {
      success: true,
      message: 'Basic Details Saved!',
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

export async function addBusinessDetailsAction(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateBusinessAddtionalProfileDetails`,
      data,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return {
      success: true,
      message: 'Business Details Saved!',
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

export async function addQualificationsDetailsAction(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateUserBusinessIndividualQualification`,
      data,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return {
      success: true,
      message: 'Business Details Saved!',
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

export async function addChartsDetailsAction(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateUserBusinessIndividualCharts`, // add charts api
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
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function addSkillsDetailsAction(data: any) {
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

export async function createBusinessIndividualIndustriesAssociated(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateBusinessIndividualIndustriesAssociated`,
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
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function addIndustryDetailsAction(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/MyProfile/CreateQualificationsInformationProfile`, // add industry
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
    console.error('Axios error:', error);
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function getLoggedInUserDataAction(accessToken: any) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/User/GetLoggedInUserDetails`,
      {
        headers: {
          XApiKey: apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.Message,
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const apiMessage = axios.isAxiosError(error)
      ? ((error.response?.data as { Message?: string } | undefined)?.Message || '')
      : '';

    return {
      success: false,
      message: status === 401 ? apiMessage || 'Invalid token. Please sign in again.' : 'An Error Occured',
      status,
    };
  }
}

export async function getAllProfilesListOfUser(userId: string) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/MyProfile/GetAllProfilesListOfUser/${userId}`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return {
      success: true,
      message: 'Profiles Fetched!',
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

export async function getLoggedInUserData(accessToken: any) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/User/GetLoggedInUserData`,
      {
        headers: {
          XApiKey: apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    return {
      success: true,
      message: response.data.Message,
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', error);
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const apiMessage = axios.isAxiosError(error)
      ? ((error.response?.data as { Message?: string } | undefined)?.Message || '')
      : '';

    return {
      success: false,
      message: status === 401 ? apiMessage || 'Invalid token. Please sign in again.' : 'An Error Occured',
      status,
    };
  }
}
