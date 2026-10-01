

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

import axios from 'axios';

export const fetchUserFollowingStatus = async (userId: string | number, profileUserId: string | number) => {
    try {
      const response = await axios.get(`${apiEndpoint}/Follow/IsFollowing?followerId=${userId}&followingId=${profileUserId}`, {
            headers,
      });
      if (response.status === 200) {
          return response.data;
      }
    } catch (error) {
        console.error('Error fetching user following status:', error);
        throw error;
    }
};

export const getFollowingList = async (userId: string | number, pageNumber: number = 1, pageSize: number = 50) => {
    try {
        const response = await axios.get(`${apiEndpoint}/Follow/GetFollowing`, {
            params: {
                userId,
                pageNumber,
                pageSize
            },
            headers
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching following list:', error);
        throw error;
    }
};

export const getFollowersList = async (userId: string | number, pageNumber: number = 1, pageSize: number = 50) => {
    try {
        const response = await axios.get(`${apiEndpoint}/Follow/GetFollowers`, {
            params: {
                userId,
                pageNumber,
                pageSize
            },
            headers
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching followers list:', error);
        throw error;
    }
};

export const unfollowUser = async (followerId: string | number, followingId: string | number) => {
    try {
        const response = await axios.delete(`${apiEndpoint}/Follow/UnfollowUser`, {
            headers,
            data: {
                FollowerId: followerId.toString(),
                FollowingId: followingId.toString()
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
};

export const followUser = async (followerId: string | number, followingId: string | number) => {
    try {
        const response = await axios.post(
            `${apiEndpoint}/Follow/FollowUser`,
            {
                FollowerId: followerId.toString(),
                FollowingId: followingId.toString(),
            },
            {
                headers,
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
};
