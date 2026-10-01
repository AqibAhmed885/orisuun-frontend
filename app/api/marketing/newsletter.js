import axios from 'axios';
import { profileTypesWithIds } from '@/data/marketing/signupData';

const apiBaseUrl = 'https://api.orisuun.com/api';

const headers = {
  'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
  'Content-Type': 'application/json',
  'accept': '*/*',
};

/**
 * Map profile type name to ID
 * @param {string} profileTypeName
 * @returns {number}
 */
const getProfileTypeId = (profileTypeName) => {
  const match = profileTypesWithIds.find(
    (p) => p.UserProfileName.toLowerCase() === profileTypeName.toLowerCase()
  );
  return match ? match.Id : 1; // default to 1 if not found
};

/**
 * Submit newsletter signup (public)
 * @param {{ name: string; email: string; profileType: string }} payload
 * @returns {Promise<any>}
 */
export const submitNewsletterSignup = async ({ name, email, profileType }) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/Newsletter/Subscribe`,
      {
        ProfileTypeId: getProfileTypeId(profileType),
        Name: name,
        Email: email,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.Message || error?.message || 'Failed to submit newsletter signup');
  }
};
