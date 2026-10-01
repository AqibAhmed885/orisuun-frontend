import axios from 'axios';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;

export async function getAllProfilesListOfUser(userId: any) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/MyProfile/GetAllProfilesListOfUser/${userId}`,
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
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

export async function getBusinessProfileDetailsByUserId(
  businessProfileDetailId: any
) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/MyProfile/GetBusinessProfileDetailsByUserId/${businessProfileDetailId}`,
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
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

export async function getIndividualProfileDetailsByUserId(
  individualProfileDetailId: any
) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/MyProfile/GetIndividualProfileDetailsByUserId/${individualProfileDetailId}`,
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
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

export async function getUserProfileTypes() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/Profile/UserProfileTypes`,
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
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


export async function getAllIndustries() {

  try {
    const response = await axios.get(
      `${apiEndpoint}/MyProfile/GetAllIndustries`,
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
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