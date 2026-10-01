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
      'An Error Occured'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An Error Occured';
};

export async function createConnectAccount(userId: string) {
  try {
    let userData = {
      UserId: userId,
    };
    const response = await axios.post(
      `${apiEndpoint}/Escrow/CreateConnectAccount`,
      userData,
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      message: ' Data Fetched  !',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', getErrorMessage(error));
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}

export async function createContract(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Escrow/CreateContractOffer`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      message: ' Contract Created   !',
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', getErrorMessage(error));
    return {
      success: false,
      message: 'An Error Occured',
      data: error,
    };
  }
}

export async function getAllContractsbyUser(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Escrow/GetAllContractByUser`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      message: response.data.Message,
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', getErrorMessage(error));
    return {
      success: false,
      message: 'An Error Occured',
      data: error,
    };
  }
}

export async function getAllDisputeContractsbyUser(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Escrow/GetAllDisputes`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      message: response.data.Message,
      data: response.data.Result,
    };
  } catch (error) {
    console.error('Axios error:', getErrorMessage(error));
    return {
      success: false,
      message: 'An Error Occured',
      data: error,
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
    console.error('Axios error:', getErrorMessage(error));
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
    console.error('Axios error:', getErrorMessage(error));
    return {
      success: false,
      message: 'An Error Occured',
    };
  }
}
