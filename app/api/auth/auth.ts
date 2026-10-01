import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { setAccessToken, setRefreshToken } from '@/utils/auth-token';

const API_KEY = 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5';

const getCookieValue = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const getOptionalAccessToken = () => {
    if (typeof window === 'undefined') return '';

    const tokenFromStorage = localStorage.getItem('accessToken');
    if (tokenFromStorage) return tokenFromStorage;

    try {
        const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
        const registerToken = registerUser?.Token || registerUser?.user?.Token;
        if (registerToken) return registerToken;
    } catch {
        // ignore
    }

    try {
        const signupAuthData = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
        if (signupAuthData?.Token) return signupAuthData.Token;
    } catch {
        // ignore
    }

    return getCookieValue('token') || '';
};

const persistAuthToken = (token: string, refreshToken = '') => {
    if (typeof window === 'undefined' || !token) return;

    setAccessToken(token);
    if (refreshToken) {
        setRefreshToken(refreshToken);
    }

    try {
        const signupAuthData = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
        localStorage.setItem(
            'signupAuthData',
            JSON.stringify({
                ...signupAuthData,
                Token: token,
            })
        );
    } catch {
        // ignore
    }

    try {
        const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
        localStorage.setItem(
            'registerUser',
            JSON.stringify({
                ...registerUser,
                Token: token,
                user: {
                    ...(registerUser?.user || {}),
                    Token: registerUser?.user?.Token || token,
                },
            })
        );
    } catch {
        // ignore
    }
};

const bootstrapAccessTokenForSignupPayment = async () => {
    if (typeof window === 'undefined') return '';

    const existingToken = getOptionalAccessToken();
    if (existingToken) return existingToken;

    let signupAuthData: any = {};
    let registerUser: any = {};

    try {
        signupAuthData = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
    } catch {
        signupAuthData = {};
    }

    try {
        registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
    } catch {
        registerUser = {};
    }

    const email = signupAuthData?.Email || registerUser?.Email || registerUser?.email || registerUser?.user?.Email || '';
    const password = signupAuthData?.Password || registerUser?.Password || registerUser?.password || '';
    const signedUpWith = signupAuthData?.SignedUpWith || registerUser?.SignedUpWith || 'manual';

    if (!email || !password || signedUpWith !== 'manual') {
        return '';
    }

    try {
        const loginResponse = await axios.post(
            `${apiEndpoint}/User/Login`,
            {
                Username: email,
                Password: password,
                RememberPassword: true,
                SignedUpWith: 'manual',
            },
            {
                headers: {
                    XApiKey: API_KEY,
                },
            }
        );

        const freshToken = loginResponse?.data?.Result?.Token || '';
        const freshRefreshToken = loginResponse?.data?.Result?.RefereshToken || '';
        if (freshToken) {
            persistAuthToken(freshToken, freshRefreshToken);
            return freshToken;
        }
    } catch {
        return '';
    }

    return '';
};

export const sendForgotPasswordMail = async (email) => {
    const response = await axios.post(
        `${apiEndpoint}/User/SendForgotPasswordMail?EmailId=${email}`,
        {},
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};

export const resetPasswordConfirm = async (userId, password) => {
    const response = await axios.post(
        `${apiEndpoint}/User/ResetPasswordConfirm`,
        {
            UserId: userId,
            Password: password,
        },
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};


export const createPaymentIntent = async (userId: string, planId: string, paymentMethodId: string, paymentMethodType: string, countryCode?: string, applyTrial?: boolean) => {
    const optionalToken = await bootstrapAccessTokenForSignupPayment();

    const response = await axios.post(
        `${apiEndpoint}/UserVerification/GetVerificationPaymentIntent`,
        {
            UserId: userId,
            PlanId: planId,
            PaymentMethod: paymentMethodId,
            PaymentMethodType: paymentMethodType,
            CountryCode: countryCode || 'US',
            applyTrial: applyTrial,
        },
        {
            headers: {
                XApiKey: API_KEY,
                ...(optionalToken ? { Authorization: `Bearer ${optionalToken}` } : {}),
            },
        }
    );
    return response;
};

/**
 * @deprecated Verification fee not required during signup
 * This function is kept for future use when users submit profiles for verification.
 * Currently not used in the signup flow - users only start 14-day trial.
 */
export const payAccountPayment = async (payload: any) => {
    const response = await axios.post(
        `${apiEndpoint}/User/PayAccountPayment`,
        payload,
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};

export const createBankAccountPayment = async (payload: any) => {
    const response = await axios.post(
        `${apiEndpoint}/Marketing/CreateBankAccountPayment`,
        payload,
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};

export const payBankAccountACHPayment = async (payload: any) => {
    const response = await axios.post(
        `${apiEndpoint}/User/PayBankAccountACHPayment`,
        payload,
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};

export const getPaySubscription = async (customerId: string, planId: string, token: string, countryCode?: string) => {
    const optionalToken = getOptionalAccessToken();
    const response = await axios.post(
        `${apiEndpoint}/UserVerification/GetPaySubscription`,
        {
            CustomerId: customerId,
            PlanId: planId,
            Token: token,
            CountryCode: countryCode || 'US',
        },
        {
            headers: {
                XApiKey: API_KEY,
                ...(optionalToken ? { Authorization: `Bearer ${optionalToken}` } : {}),
            },
        }
    );
    return response;
};
export const getPaySubscriptionV1 = async (payload: {
    CustomerId: string;
    PlanId: string;
    Token: string;
    CountryCode?: string;
}) => {
    const optionalToken = getOptionalAccessToken();
    const response = await axios.post(
        `${apiEndpoint}/UserVerification/GetPaySubscription`,
        payload,
        {
            headers: {
                XApiKey: API_KEY,
                ...(optionalToken ? { Authorization: `Bearer ${optionalToken}` } : {}),
            },
        }
    );
    return response;
};

export const updatePaymentDetails = async (payload: {
    UserId: string;
    Id: string;
    PaymentMethod: string;
    Name: string;
}) => {
    const response = await axios.post(
        `${apiEndpoint}/UserVerification/UpdateSuccessPaymentDetails`,
        payload,
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};

export const createBankAccountPaymentV1 = async (payload: any) => {
    const response = await axios.post(
        `${apiEndpoint}/Marketing/CreateBankAccountPaymentV1`,
        payload,
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
    return response;
};

export const registerUserAPI = async (userData) => {
    return axios.post(
        `${apiEndpoint}/User/RegisterUser`,
        userData,
        {
            headers: {
                XApiKey: API_KEY,
            },
        }
    );
};

export const getSubscriptionPlanAPI = async (profileType, planType, countryCode?) => {
    const optionalToken = getOptionalAccessToken();

    return axios.post(
        `${apiEndpoint}/Marketing/GetSubscriptionPlanBasedOnProfilePlan`,
        {
            ProfileType: profileType?.toString(),
            PlanType: planType == 'Standard' ? '1' : '2',
            CountryCode: countryCode
        },
        {
            headers: {
                XApiKey: API_KEY,
                ...(optionalToken ? { Authorization: `Bearer ${optionalToken}` } : {}),
            },
        }
    );
};
export interface BWFSubscriptionRequest {
    FirstName: string;
    LastName: string;
    City: string;
    Email: string;
    Amount: number;
}

export interface CustomerRequest {
    FirstName: string;
    LastName: string;
    CityName: string;
    Email: string;
    StripeCustomerId: string;
    StripeSubscriptionId: string;
}
export const bwfService = {
    createSubscription: async (data: BWFSubscriptionRequest) => {
        return axios.post(`${apiEndpoint}/Marketing/CreateBwfSubscription`, data, {
            headers: {
                XApiKey: API_KEY,
            },
        });
    },

    createCustomer: async (data: CustomerRequest) => {
        return axios.post(`${apiEndpoint}/Marketing/CreateCustomer`, data, {
            headers: {
                XApiKey: API_KEY,
            },
        });
    },
};