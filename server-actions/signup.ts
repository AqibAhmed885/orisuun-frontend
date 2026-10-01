import { SignupFormData, signupSchema } from '@/utils/schema';
import axios from 'axios';
 
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey=process.env.NEXT_PUBLIC_API_KEY as string;
export async function signupAction(formData: SignupFormData) {
  const result = signupSchema.safeParse(formData);
 
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
 
  let signupdata = {
    FirstName: result.data.firstName,
    LastName: result.data.lastName,
    Email: result.data.email,
    Password: result.data.password,
    PrivacyCheck: result.data.agreeTerms,
    UserSubscriptionPlanId: result.data.billingFrequency,
  };
 
  try {
    const response: any = await axios.post(
      `${apiEndpoint}/User/RegisterUser`,
      signupdata,
      {
        headers: {
          XApiKey:apiKey,
        },
      }
    );
    return {
      success: response.data.Message === 'User created successfully',
      message: response.data.Message,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: error,
    };
  }
}
 
export async function getUserProfileType() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/Profile/UserProfileTypes`,
      {
        headers: {
          XApiKey:apiKey,
        },
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('Axios error:', error);
    return [];
  }
}
 
export async function getUserProfileTypeFeatures() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/Pricing/GetPlanFeatures`,
      {
        headers: {
          XApiKey:apiKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    return [];
  }
}
 
export async function getSubscriptionPlanBasedOnProfileType(
  profileType: number
) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/User/SubscriptionPlanBasedOnProfileType`,
      {
        headers: {
          XApiKey:apiKey,
        },
        params: {
          profileType: profileType, // Add your query parameter here
        },
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('Axios error:', error);
    return [];
  }
}