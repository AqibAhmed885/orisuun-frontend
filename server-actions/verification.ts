import axios from 'axios';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string
export const checkUserVerificationStatus = async (data: any) => {
  try {
    let userData = {
      UserId: data.Id,
    };

    const response = await axios.post(
      `${apiEndpoint}/UserVerification/CheckUserVerificationProcess`,
      userData,
      {
        headers: {
          XApiKey: apiKey
        },
      }
    );
    return {
      success: true,
      message: response.data.Message,
      data: response,
    };
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error.response.data.Message,
      data: error.response.data.Result,
    };
  }
};

export const getVerificationPaymentIntent = async (data: any) => {
  try {
    let userData = {
      UserId: data.Id,
    };
    const response = await axios.post(
      `${apiEndpoint}/UserVerification/GetVerificationPaymentIntent`,
      userData,
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
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error.response.data.Message,
      data: error.response.data.Result,
    };
  }
};


export async function generateUploadFileSasTokenData() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/UserVerification/GenerateUploadFileSasToken`,
      {
        headers: {
          XApiKey: apiKey,
        },
        timeout: 30000, // 30 second timeout
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('Axios error:', error);
    return [];
  }
}

export async function generateUploadFileSasTokenDataForChat() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/UserVerification/GenerateUploadFileSasTokenForChatDocuments`,
      {
        headers: {
          XApiKey: apiKey,
        },
        timeout: 30000,
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('Axios error:', error);
    return [];
  }
}


export const addVerificationDocuments = async (data: any) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/UserVerification/AddVerificationDocuments`,
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
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error.response.data.Message,
      data: error.response.data.Result,
    };
  }
};


export const addVerificationDetails = async (data: any) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/UserVerification/AddVerificationDetails`,
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
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error.response.data.Message,
      data: error.response.data.Result,
    };
  }
};

export async function GenerateUploadFileSasTokenForVerificationDocuments() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/UserVerification/GenerateUploadFileSasTokenForVerificationDocuments`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('Axios error:', error);
    return [];
  }
}