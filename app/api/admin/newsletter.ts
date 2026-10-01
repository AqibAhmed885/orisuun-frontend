import axios from 'axios';

const apiBaseUrl = 'https://api.orisuun.com/api';

const header = {
  accept: '*/*',
};

/**
 * Get newsletter subscription stats (admin)
 */
export const getNewsletterStats = async (token: string) => {
  try {
    const res = await axios.get(`${apiBaseUrl}/Newsletter/GetSubscriptionStats`, {
      headers: {
        ...header,
        XApiKey: token,
      },
    });
    return res.data?.Result ?? res.data ?? [];
  } catch (err) {
    console.error('getNewsletterStats error', err);
    return [];
  }
};
