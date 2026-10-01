import { apiClient as axios } from '@/utils/api-client';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
export async function getBDMatchingList(userId: string, selected?: any) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetBDMatchingList`,
      { UserId: userId, MatchType: selected },
      {
        headers: {},
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

export async function escrowTransactionHistoryList(userId: string) {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Dashboard/EscrowTransactionHistoryList`,
      { UserId: userId },
      {
        headers: {},
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
