import axios from 'axios';
import { group } from 'console';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const headers = {
  XApiKey: apiKey,
  'Content-Type': 'application/json',
    // For ngrok compatibility
};

export interface ChatDocument {
  Document: string;
  FileName: string;
  size: number;
}

export interface MessageData {
  Sender_UserId: string;
  Receiver_UserId: string;
  IsRead: boolean;
  Message: string;
  ChatDocument?: ChatDocument;
}

export const chatApi = {
  getActiveUserChatList: async (senderId: string, receiverId: string = '') => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/chat/GetActiveUserChatList`,
        {
          Name: 'string', // Confirm if this is correct
          Sender_UserId: senderId,
          Receiver_UserId: receiverId,
        },
        { headers }
      );
      return response.data.Result;
    } catch (error: any) {
      console.error('Error fetching active user chat list:', error.response?.data || error.message);
      throw error;
    }
  },


  getUserChatDetails: async (senderId: string, receiverId: string) => {
    const response = await axios.post(
      `${apiEndpoint}/chat/GetUserChatDetails`,
      {
        Name: 'string',
        Sender_UserId: senderId,
        Receiver_UserId: receiverId,
      },
      { headers }
    );
    return response.data.Result;
  },

  getUserChatData: async (senderId: string, receiverId: string) => {
    const response = await axios.post(
      `${apiEndpoint}/chat/GetUserChatData`,
      {
        Name: 'string',
        Sender_UserId: senderId,
        Receiver_UserId: receiverId,
      },
      { headers }
    );
    return response.data.Result;
  },

  markAsReadMessage: async (senderId: string, receiverId: string) => {
    const response = await axios.post(
      `${apiEndpoint}/chat/MarkAsReadMessage`,
      {
        Sender_UserId: senderId,
        Receiver_UserId: receiverId,
      },
      { headers }
    );
    return response.data;
  },
  markAsReadMessageFroGroup: async (groupId: string, senderId: string) => {
    const response = await axios.post(
      `${apiEndpoint}/chat/UpdateGroupLastReadMsg?groupId=${groupId}&userId=${senderId}`,
      {}, // empty body
      { headers } // ✅ headers correctly passed in config
    );
    return response.data;
  },



  searchUserByNameList: async (name: string) => {
    const response = await axios.post(
      `${apiEndpoint}/chat/SearchUserByNameList`,
      { Name: name },
      { headers }
    );
    return response.data.Result;
  },

  saveMessage: async (messageData: MessageData) => {
    const response = await axios.post(
      `${apiEndpoint}/Chat/SaveMessage`,
      messageData,
      { headers }
    );
    return response.data.Result;
  },
  getGroupMembers: async (groupId: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/GetGroupMembers?groupId=${groupId}`,
      {
        headers: {
          'XApiKey': process.env.NEXT_PUBLIC_API_KEY
        }
      }
    );
    return response.data;
  },

  getGroupMessages: async (groupId: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/GetGroupMessages?groupId=${groupId}`,
      {
        headers: {
          'XApiKey': process.env.NEXT_PUBLIC_API_KEY
        }
      }
    );
    return response.data;
  },

  saveGroupMessage: async (messageData: any) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/SaveGroupMessage`,
      messageData,
      {
        headers: {
          'Content-Type': 'application/json',
          'XApiKey': process.env.NEXT_PUBLIC_API_KEY
        }
      }
    );
    return response.data;
  },
  getGroupChatDetails: async (groupId: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/GetGroupChatDetails?groupId=${groupId}`,
      {
        headers: {
          'XApiKey': process.env.NEXT_PUBLIC_API_KEY
        }
      }
    );
    return response.data;
  },
  // Add this to the chatApi object
  addUserIntoGroup: async (groupData: any) => {
    const response = await axios.post(
      `${apiEndpoint}/Chat/AddUserIntoGroup`,
      groupData,
      { headers }
    );
    return response.data;
  },
  removeUserFromGroup: async (groupId: string, userId: string) => {
    const response = await fetch(
      `${apiEndpoint}/Chat/RemoveUserFromGroup?GroupId=${groupId}&UserId=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'XApiKey': process.env.NEXT_PUBLIC_API_KEY
        }
      }
    );
    return await response.json();
  },
  deleteGroupChat: async (groupId: string) => {
    const response = await axios.delete(
      `${apiEndpoint}/Chat/DeleteGroupChat?GroupId=${groupId}`,
      { headers }
    );
    return response.data;
  },
  clearGroupChatHistory: async (groupId: string) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/Chat/ClearGroupChatHistory?GroupId=${groupId}`,
        {}, // empty body
        {
          headers: {
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw error;
    }
  },

  // Community Chat APIs
  getCommunityMessages: async (communityId: string, page: number = 1, pageSize: number = 50) => {
    try {
      
      const response = await axios.get(
        `${apiEndpoint}/Chat/GetCommunityMessages?communityId=${communityId}&page=${page}&pageSize=${pageSize}`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching community messages:', error.response?.data || error.message);
      throw error;
    }
  },

  sendCommunityMessage: async (messageData: {
    CommunityId: string;
    TopicId?: string;
    SenderId: string;
    Message: string;
    AttachmentUrl?: string;
    ChatDocument?: {
      Id?: string;
      ChatId?: string;
      Document: string;
      FileName: string;
      Size: number;
      CreatedDate?: string;
    };
  }) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/Chat/SendCommunityMessage`,
        messageData,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending community message:', error.response?.data || error.message);
      throw error;
    }
  },

  // Chat Restriction Settings APIs
  getChatRestrictionSettings: async (userId: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}/User/GetMessageRestrictions?userId=${userId}`,
        { headers }
      );
      return response.data.Result;
    } catch (error: any) {
      console.error('Error fetching chat restriction settings:', error.response?.data || error.message);
      throw error;
    }
  },

  saveChatRestrictionSettings: async (settingsData: {
    UserId: string;
    AllowFavoritedUsers: boolean;
    AllowMatchedUsers: boolean;
    AllowUsersYouFollow: boolean;
    AllowYourFollowers: boolean;
    RestrictByAccountType: boolean;
    AccountTypeIds: number[];
  }) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/User/SetMessageRestrictions`,
        settingsData,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error saving chat restriction settings:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check if user can send message to another user based on restrictions
  canSendMessage: async (senderId: string, receiverId: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}/User/CanUserMessage`,
        {
          params: { senderId, receiverId },
          headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error checking message permissions:', error.response?.data || error.message);
      throw error;
    }
  }

};
