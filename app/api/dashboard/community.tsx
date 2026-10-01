'use client';
import { uploadImageToAzure } from '@/server-actions/community';
import axios from 'axios';
import { get } from 'lodash';
import { toast } from 'react-toastify';
// adjust the import path to where your upload helper lives

const apiBase = process.env.NEXT_PUBLIC_APP_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'XApiKey': apiKey,
  'ngrok-skip-browser-warning': 'true'
};

export type Community = {
  id: string;
  name: string;
  avatar: string;
  lastSender?: string;
  lastMessage?: string;
  time?: string;
  isVerified?: boolean;
  members?: any[];
  createdByVerified?: boolean;
};

export type CommentType = {
  Id: string;
  Message: string;
  CreatedAt: string;
  CreatedBy: string;
  CreatedByName: string;
  CreatedByProfilePicture?: string;
  CreatedByUserType?: string;
  CreatedByCountry?: string;
  LikeCount: number;
  IsOnline: boolean;
  Reactions?: {
    Type: string;
    Count: number;
  }[];
};


interface Country {
  Id: number;
  CountryName: string;
  RegionId: number;
}

interface City {
  Id: number;
  CityName: string;
  StateId: number;
  CountryId: number;
}

export const communityApi = {
  // New: fetch user communities from backend and map to local Community[]
  getUserCommunities: async (userId: string): Promise<Community[]> => {
    if (!apiBase) {
      console.error('NEXT_PUBLIC_APP_BASE_URL is not defined');
      return [];
    }

    try {
      const fullUrl = `${apiBase}/api/Chat/GetUserCommunities`;

      const res = await axios.get(fullUrl, {
        params: { userId },
        headers,
        timeout: 30000
      });

      const result = res?.data?.Result || [];

      const mapped: Community[] = (result || []).map((c: any) => ({
        id: c.Id,
        name: c.Name,
        avatar: c.ProfilePhotoUrl || 'https://placehold.co/600x400/000000/FFFFFF.png',
        lastSender: Array.isArray(c.Members) && c.Members.length ? c.Members[0].UserName : '',
        lastMessage: c.Description || '',
        time: c.CreatedAt ? new Date(c.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        isVerified: false,
        members: c.Members || [],
        createdByVerified: c.CreatedByVerified
      }));

      return mapped;
    } catch (err) {
      console.error('getUserCommunities error', err);
      return [];
    }
  },

  // Create a new community (uploads image if provided)
  createCommunity: async (data: {
    Name: string;
    Description?: string;
    CreatedBy: string;
    City?: string;
    Country?: string;
    InitialMemberIds?: string[];
    imageFile?: File | null;
  }) => {


    try {
      let profilePhotoUrl = '';
      let profilePhotoId = '';
      let profilePhotoSize = 0;

      // Upload image if provided
      if (data.imageFile) {
        
        const uploadResult = await uploadImageToAzure(data.imageFile);
        if (!uploadResult.success) {
          console.error('Image upload failed:', uploadResult.error);
          return { success: false, message: uploadResult.error || 'Failed to upload image' };
        }
        profilePhotoUrl = uploadResult.url || '';
        profilePhotoId = uploadResult.photoId || '';
        profilePhotoSize = uploadResult.size || 0;
       
      } else {
        
      }

      const payload = {
        Name: data.Name,
        Description: data.Description,
        CreatedBy: data.CreatedBy,
        City: data.City,
        Country: data.Country,
        ProfilePhotoUrl: profilePhotoUrl,
        ProfilePhotoId: profilePhotoId,
        ProfilePhotoSize: profilePhotoSize,
        InitialMemberIds: data.InitialMemberIds || []
      };

      
      const url = `${apiBase}/api/Chat/Createcommunity`;
      

      const response = await axios.post(url, payload, {
        headers,
        timeout: 30000
      });

      
      return { success: true, message: response.data.Message || 'Community created successfully', data: response.data.Result };
    } catch (error: any) {
      
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to create community', data: error.response?.data?.Result };
    }
  },

  getCommunityMessages: async (communityId: string, page: number = 1, pageSize: number = 50) => {
    try {
     
      const url = `${apiBase}/api/Chat/GetCommunityMessages`;
      const response = await axios.get(url, {
        params: { communityId, page, pageSize },
        headers,
        timeout: 30000
      });

      
      return { success: true, message: response.data.Message || 'Messages fetched successfully', data: response.data.Result };
    } catch (error: any) {
     
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to fetch community messages', data: error.response?.data?.Result };
    }
  },

  getCommunityDetails: async (communityId: string) => {
    try {
      
      const url = `${apiBase}/api/Chat/GetCommunityDetails`;
      const response = await axios.get(url, {
        params: { communityId },
        headers,
        timeout: 30000
      });

     
      return { success: true, message: response.data.Message || 'Community details fetched successfully', data: response.data.Result };
    } catch (error: any) {
      
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to fetch community details', data: error.response?.data?.Result };
    }
  },

  getTopComments: async (
    communityId: string,
    reactionType: 'like' | 'love' | 'approved' | 'funny',
    page: number = 1,
    pageSize: number = 50
  ) => {
    try {
      const url = `${apiBase}/api/Chat/GetCommunityChatsByMostReactions`;
      const response = await axios.get(url, {
        params: {
          communityId,
          reactionType,
          page,
          pageSize
        },
        headers,
        timeout: 30000
      });

      

      const comments: CommentType[] = response.data.Result

      return {
        success: true,
        data: comments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((response.data.TotalCount || 0) / pageSize),
          totalItems: response.data.TotalCount || 0
        }
      };
    } catch (error: any) {
      console.error('Get top comments error:', error);
      return {
        success: false,
        message: error.response?.data?.Message || error.message || 'Failed to fetch comments',
        data: []
      };
    }
  },

  getUserStatsByCommunityId: async (communityId: string, userId: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/GetUserStatsByCommunityId`;
      const response = await axios.get(url, {
        params: { communityId, userId },
        headers,
        timeout: 30000
      });
      return response.data.Result; // { CommunityId, TotalComments, TotalReactions }
    } catch (error) {
      console.error('Get user stats error:', error);
      return null;
    }
  },

  getUniversalChatMembers: async (communityId: string, page: number = 1, pageSize: number = 50) => {
    try {
      const url = `${apiBase}/api/Chat/GetUniversalChatMembers`;
      const response = await axios.get(url, {
        params: { communityId, page, pageSize },
        headers,
        timeout: 30000
      });

      return {
        success: true,
        data: response.data.Result || [],
        pagination: {
          currentPage: page,
          totalItems: response.data.TotalCount || 0,
          totalPages: Math.ceil((response.data.TotalCount || 0) / pageSize)
        }
      };
    } catch (error) {
      console.error('Get universal chat members error:', error);
      return {
        success: false,
        data: [],
        pagination: {
          currentPage: page,
          totalItems: 0,
          totalPages: 0
        }
      };
    }
  },

  getCountries: async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/MyProfile/GetCountryList`,
        {
          headers
        }
      );
    
      return response.data.Result as Country[];
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  getCities: async (countryId?: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/MyProfile/GetCityList`,
        {
          headers
        }
      );
      const cities = response.data.Result as City[];
     
      return countryId ? cities.filter(city => city.CountryId === countryId) : cities;
    } catch (error) {
      
      return [];
    }
  },

  // leave community can be added here
  leaveCommunity: async (CommunityId: string, userId: string) => {
    if (!CommunityId || !userId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/RemoveCommunityMember`,
        {
          headers,
          data: {
            CommunityId,
            UserId: userId,
            BlockUser: false,
          }
        }
      );
      // Remove the community from the local list after successful leave
      // setCommunities(prev => prev.filter(c => c.id !== community.id));
      toast.success(`You have left the community successfully.` );
    } catch (err) {
      console.error('Failed to leave community', err);
    }
  }, 
  deleteCommunityMessage: async (messageId: string) => {
    try {
     
      const url = `${apiBase}/api/Chat/DeleteCommunityMessage`;
      const response = await axios.delete(url, {
        params: { messageId },
        headers,
        timeout: 30000
      });

     
      return { success: true, message: response.data.Message || 'Message deleted successfully', data: response.data.Result };
    } catch (error: any) {
      console.error('Delete community message error:', error);
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to delete message', data: error.response?.data?.Result };
    }
  },

  /// get trending
  getTrendingCommunities: async (page: number = 1, pageSize: number = 100) => {
    try {
      const url = `${apiBase}/api/Chat/GetTrendingCommunities`;
      const response = await axios.get(url, {
        params: { page, pageSize },
        headers,
        timeout: 30000
      });
  
      
      return { success: true, message: response.data.Message || 'Trending communities fetched successfully', data: response.data.Result };
    } catch (error: any) {
      
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to fetch trending communities', data: error.response?.data?.Result };
    }
  },

  /// /api/Chat/RemoveCommunityMember 
  removeCommunityMember: async (communityId: string, userId: string, isBlocked: boolean = false) => {
    try {
      const url = `${apiBase}/api/Chat/RemoveCommunityMember`;
      const response = await axios.delete(url, {
        data: { CommunityId: communityId, UserId: userId , BlockUser: isBlocked},
        headers,
        timeout: 30000
      });
      
      return { success: true, message: response.data.Message || 'Community member removed successfully', data: response.data.Result };
    } catch (error: any) {
      console.error('Remove community member error:', error);
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to remove community member', data: error.response?.data?.Result };
    }
  },

  /// add community member
  /// [in universal chat if we add memeber it mean member is blocked]
  addCommunityMember: async (communityId: string, userIds: string[], isAdmin: boolean = false) => {
    try {
      const url = `${apiBase}/api/Chat/AddCommunityMembers`;
      const response = await axios.post(url, { 
        CommunityId: communityId, 
        UserIds: userIds, 
        IsAdmin: isAdmin 
      }, { headers, timeout: 30000 });
      return { success: true, message: response.data || 'Community member added successfully', data: response.data.Result };
    } catch (error: any) {
      console.error('Add community member error:', error);
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to add community member', data: error.response?.data?.Result };
    }
  },

  /// [Check if user is joined the specific community]
  /// /api/Chat/IsCommunityJoined
  isCommunityJoined: async (communityId: string, userId: string) => {
    try {
      const url = `${apiBase}/api/Chat/IsCommunityJoined`;
      const response = await axios.get(url, { params: { communityId, userId }, headers, timeout: 30000 });
      
      return { success: true, message: response.data.Message || 'Community joined successfully', data: response.data.Result };
    } catch (error: any) {
      console.error('Is community joined error:', error);
      return { success: false, message: error.response?.data?.Message || error.message || 'Failed to check if community is joined', data: error.response?.data?.Result };
    }
  },
};
