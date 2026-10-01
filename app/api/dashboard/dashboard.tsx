import { apiClient as axios } from '@/utils/api-client';

const rawApiBase = process.env.NEXT_PUBLIC_APP_BASE_URL || '';
const normalizedApiBase = rawApiBase.replace(/\/+$/g, '');
const isProductionUrl = normalizedApiBase.includes('api.orisuun.com');

// Staging/local mode should use staging backend, production mode uses live backend.
const apiBaseUrl =
  process.env.NEXT_PUBLIC_APP_BASE_URL;

const apiEndpoint = `${apiBaseUrl}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

// interface FeedResponse {
//   success: boolean;
//   data?: any[];
//   message: string;
//   error?: any;
// }

export const getFeeds = async (
  UserId: string,
  Page: number,
  PageSize: number,
  toDate: string,
  fromDate?: string
) => {
  try {
    const payload: {
      UserId: string;
      Page: number;
      PageSize: number;
      ToDayEvent: boolean;
      toDate: string;
      fromDate?: string;
    } = {
      UserId,
      Page,
      PageSize,
      ToDayEvent: true,
      toDate,
    };

    if (fromDate) {
      payload.fromDate = fromDate;
    }

    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetAllFeeds`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.Result,
        message: response.data.Message,
      };
    }

    return {
      success: false,
      message: response.data.Message || 'Failed to fetch feeds',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching feeds',
      error: error,
    };
  }
};

// new helper for events
export const getEvents = async (
  UserId: string,
  Page: number,
  PageSize: number,
  fromDate?: string,
  toDate?: string
) => {
  try {
    const payload: any = {
      UserId,
      Page,
      PageSize,
      ToDayEvent: false
    };

    // If dates are provided, filter by the inclusive ISO date-time range.
    if (fromDate && toDate) {
      payload.fromDate = fromDate;
      payload.toDate = toDate;
      payload.ToDayEvent = false;
    }

    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetEvents`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.Result,
        message: response.data.Message,
      };
    }

    return {
      success: false,
      message: response.data.Message || 'Failed to fetch events',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching events',
      error,
    };
  }
};

export const getNews = async (UserId: string, Page: number, PageSize: number) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetNews`,
      {
        UserId,
        Page,
        PageSize,
      },
      {
        headers: {},
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.Result,
        message: response.data.Message,
      };
    }

    return {
      success: false,
      message: response.data.Message || 'Failed to fetch news',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching news',
      error,
    };
  }
};

export const getSavedEvents = async (UserId: string) => {
  try {
    const response = await axios.get(
      `${apiEndpoint}/event/saved-events`,
      {
        params: {
          userId: UserId,
        },
        headers: {
          accept: 'text/plain',
        },
      }
    );

    const resultData = response?.data?.Result;
    const normalizedData = Array.isArray(resultData)
      ? resultData
      : Array.isArray(resultData?.Items)
        ? resultData.Items
        : Array.isArray(response?.data)
          ? response.data
          : [];

    if (response.status === 200) {
      return {
        success: true,
        data: normalizedData,
        message: response.data.Message,
      };
    }

    return {
      success: false,
      data: [],
      message: response.data.Message || 'Failed to fetch saved events',
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred while fetching saved events',
      error,
    };
  }
};


export const fetchUserProfile = async (username: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Profile/ExploreUserProfileV1`,
      { UserName: username },
      {
        headers: {},
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.Result
      };
    }
    return {
      success: false,
      error: 'Failed to fetch profile'
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return {
      success: false,
      error: 'Error fetching profile data'
    };
  }
};

export const getProfileList = async (userId: string, userProfileDetailId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetProfileList`,
      {
        UserId: userId,
        UserProfileDetailId: userProfileDetailId
      },
      {
        headers: {},
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data?.Result || []
      };
    }
    return {
      success: false,
      data: []
    };
  } catch (error) {
    console.error('Error fetching profile list:', error);
    return {
      success: false,
      data: [],
      error
    };
  }
};

export const unfavouriteProfile = async (favouriteId: string, userId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Favourite/UnFavouriteProfile`,
      {
        Id: favouriteId,
        UserId: userId
      },
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error updating favourite status:', error);
    return false;
  }
};

interface RatingResponse {
  Result: any[];
}

export const getFeedbackList = async (userId: string) => {
  try {
    const response = await axios.post<RatingResponse>(
      `${apiEndpoint}/Feedback/GetFeedbackList`,
      {
        UserId: userId,
      },
      {
        headers: {},
      }
    );

    if (response.status === 200) {
      return response.data.Result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

export const getActiveUserChatList = async (senderId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/chat/GetActiveUserChatList`,
      {
        Name: 'string',
        Sender_UserId: senderId,
        Receiver_UserId: '',
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.Result
      };
    }
    return {
      success: false,
      data: []
    };
  } catch (error) {
    console.error('Error fetching chats:', error);
    return {
      success: false,
      data: [],
      error
    };
  }
};
interface WeeklyGoalsResponse {
  success: boolean;
  data?: any;
  message: string;
  error?: any;
}

export interface WeeklyEntryRule {
  Id: number;
  ActionType: string;
  ActionName: string;
  Description: string;
  EntriesAwarded: number;
  MaxPerDay: number | null;
  MaxPerWeek: number | null;
  RequiresContext: boolean;
}

interface WeeklyGiveawayCycle {
  Id: number;
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
  IsCompleted: boolean;
}

interface WeeklyEntryRulesResult {
  EntryRules: WeeklyEntryRule[];
  Cycle: WeeklyGiveawayCycle | null;
  TotalEntriesInCycle: number;
  EntriesByRule: unknown[];
  TotalParticipants: number;
}

interface WeeklyEntryRulesResponse {
  success: boolean;
  data?: WeeklyEntryRulesResult;
  message: string;
  error?: any;
}

interface EnsureCurrentCycleEntryResponse {
  success: boolean;
  data?: any;
  message: string;
  error?: any;
}

export const ensureCurrentCycleEntry = async (
  userId: string
): Promise<EnsureCurrentCycleEntryResponse> => {
  if (!userId) {
    return {
      success: false,
      message: 'A user ID is required to ensure the current giveaway entry',
    };
  }

  try {
    const response = await axios.post(
      `${apiEndpoint}/WeeklyGiveaway/EnsureCurrentCycleEntry?userId=${encodeURIComponent(userId)}`,
      null,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data?.Result,
      message:
        response.data?.Message ||
        'Current weekly giveaway entry ensured successfully',
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.Message ||
        error.response?.data?.message ||
        'Unable to ensure the current weekly giveaway entry',
      error,
    };
  }
};

export const getWeeklyGoals = async (UserId: string): Promise<WeeklyGoalsResponse> => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetWeeklyReminders`,
      {
        UserId,
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.Result,
        message: response.data.Message,
      };
    }

    return {
      success: false,
      message: response.data.Message || 'Failed to fetch feeds',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching feeds',
      error: error,
    };
  }
};

export const getWeeklyEntryRules = async (
  userId: string,
  date: string
): Promise<WeeklyEntryRulesResponse> => {
  try {
    const response = await axios.get(
      `${apiEndpoint}/WeeklyGiveaway/GetEntryRules?userId=${encodeURIComponent(userId)}&date=${encodeURIComponent(date)}`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );


    if (response.status === 200) {
      return {
        success: true,
        data: response.data?.Result as WeeklyEntryRulesResult,
        message: response.data?.Message || 'Entry rules fetched successfully',
      };
    }

    return {
      success: false,
      message: response.data?.Message || 'Failed to fetch weekly entry rules',
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'An error occurred while fetching weekly entry rules',
      error,
    };
  }
};

export const fetchPublicProfile = async (username: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Profile/ExploreUserProfileV1`,
      {
        UserName: username,
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

interface ChatResponse {
  Result: {
    userList: any[];
  };
}


export const getActiveChats = async (senderId: string) => {
  try {
    const response = await axios.post<ChatResponse>(
      `${apiEndpoint}/chat/GetActiveUserChatList`,
      {
        Name: 'string',
        Sender_UserId: senderId,
        Receiver_UserId: '',
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    return response.data.Result.userList;
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
};

export const getFavouriteProfiles = async (userId: string, profileDetailId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Dashboard/GetProfileList`,
      {
        UserId: userId,
        UserProfileDetailId: profileDetailId
      },
      {
        headers: {},
      }
    );

    if (response.status === 200) {
      return response.data?.Result || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching favourite profiles:', error);
    return [];
  }
};
export const getLocationsList = async () => {
  try {
    const response = await axios.get(
      `${apiEndpoint}/Search/GetLocationsListV1`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );

    if (response.status === 200) {
      return response.data.Result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

export const rejectMatchedRequest = async (matchedId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/RejectMatchedRequest`,
      { MatchedId: matchedId },
      {
        headers: {},
      }
    );
    return response.status === 200;
  } catch (error) {
    throw error;
  }
};

export const matchBdConnection = async (matchedId: string, userProfileId: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/BusinessOpportunity/MatcheBdConnection`,
      {
        MatchedId: matchedId,
        UserProfileId: userProfileId,
      },
      {
        headers: {},
      }
    );
    return response.status === 200;
  } catch (error) {
    throw error;
  }

};
