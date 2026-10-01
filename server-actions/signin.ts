import { SigninFormData, signinSchema } from '@/utils/schema';
import axios from 'axios';
import { setAccessToken, setRefreshToken } from '@/utils/auth-token';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5'
const loginRequestTimeout = 20000;

const getLoginErrorResponse = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const isTimeout = error.code === 'ECONNABORTED';

    return {
      success: false as const,
      message: isTimeout
        ? 'The sign-in request timed out. Please try again.'
        : error.response?.data?.Message || error.message || 'Sign in failed.',
      data: error.response?.data,
    };
  }

  return {
    success: false as const,
    message: error instanceof Error ? error.message : 'Sign in failed.',
    data: undefined,
  };
};

export const signinAction = async (formData: SigninFormData) => {
  try {
    const result = signinSchema.safeParse(formData);

    if (!result.success) {
      return {
        success: false as const,
        message: 'Please check your email and password.',
        data: undefined,
        errors: result.error.flatten().fieldErrors,
      };
    }
    let signindata = {
      Username: result.data.email,
      Password: result.data.password,
      RememberPassword: true,
      SignedUpWith: 'manual',
    };
    const response = await axios.post(`${apiEndpoint}/User/Login`, signindata, {
      headers: {
        XApiKey: apiKey,
      },
      timeout: loginRequestTimeout,
    });

    setAccessToken(response.data.Result.Token);
    setRefreshToken(response.data.Result.RefereshToken);
    return {
      success: true as const,
      message: 'Signup successful!',
      data: response.data,
    };
  } catch (error) {
    console.error('Login error:', error);
    return getLoginErrorResponse(error);
  }
};

export const signInWithSocials = async (data: SignInWithSocials) => {
  try {
    const response = await axios.post(`${apiEndpoint}/User/Login`, data, {
      headers: {
        XApiKey: apiKey,
      },
      timeout: loginRequestTimeout,
    });

    setAccessToken(response.data.Result.Token);
    setRefreshToken(response.data.Result.RefereshToken);
    return {
      success: true as const,
      message: 'Signup successful!',
      data: response.data,
    };
  } catch (error) {
    console.error('Login error:', error);
    return getLoginErrorResponse(error);
  }
};
