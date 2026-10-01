import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const userService = {
  async registerUser(data: any, token: string) {
    const response = await axios.post(
      `${apiEndpoint}/User/RegisterV1`,
      {
        FirstName: data?.firstName,
        LastName: data?.lastName,
        Email: data?.email,
        Password: data?.password,
        PrivacyCheck: true,
        UserProfileTypeId: Number(data?.userProfileTypeId),
        BillingFrequency: data.billingFrequency,
        BillingPlanId: data.billingPlanId,
        SignedUpWith: 'manual',
      },
      {
        headers: {
          XApiKey: token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async getUserProfileTypes() {
    const response = await axios.get(`${apiEndpoint}/Profile/UserProfileTypes`, {
      headers: {
        XApiKey: apiKey,
        'Content-Type': 'application/json',
      },
    });
    return response.data.Result;
  },

  async getSubscriptionPlans(profileType: string, planType: string) {
    const response = await axios.post(
      `${apiEndpoint}/Marketing/GetSubscriptionPlanBasedOnProfilePlan`,
      {
        ProfileType: profileType,
        PlanType: planType === 'Visibility and collaboration' ? '1' : '2',
      },
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.Result;
  }
};
