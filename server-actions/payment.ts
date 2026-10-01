'use server';

import { PaymentSchemaFormData, paymentSchema } from '@/utils/schema';

import axios from 'axios';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5'
export async function paymentAction(formData: PaymentSchemaFormData) {
  // Validate the form data
  const result = paymentSchema.safeParse(formData);

  if (!result.success) {
    // If validation fails, return the errors
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // Simulate API call or database operation, remove after api is handled
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return success response
  return {
    success: true,
    message: 'Payment successful!',
    data: result.data,
  };
}

export async function fetchUserDetails(userId: string) {
  try {
    const response = await axios.get(
      `${apiEndpoint}/User/GetCurrentUserDetails?userId=${userId}`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return {
      success: true,
      message: 'Payment  Fetch successful!',
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

export async function verifyPaypalPayment(data: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/User/VerifyPaypalPayments`,
      data,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return {
      success: true,
      message: 'Payment Verified!',
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
