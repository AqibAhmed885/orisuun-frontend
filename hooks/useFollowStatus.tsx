import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { unfollowUser, followUser } from '@/app/api/dashboard/following';
import { toast } from 'react-toastify';

const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL
  ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
  : 'https://api.orisuun.com/api';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5';

interface UseFollowStatusOptions {
  profileUserId?: string | null;
  profileDetailId?: string | number | null;
  initialFollowerCount?: number;
}

export const useFollowStatus = (options: string | null | undefined | UseFollowStatusOptions) => {
  // Support both old signature (profileUserId) and new signature (options object)
  const profileUserId = typeof options === 'object' ? options?.profileUserId : options;
  const profileDetailId = typeof options === 'object' ? options?.profileDetailId : null;
  const initialFollowerCount = typeof options === 'object' ? options?.initialFollowerCount : undefined;

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [followerCount, setFollowerCount] = useState<number>(initialFollowerCount ?? 3);
  const [error, setError] = useState<any>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      if (!profileUserId || typeof window === 'undefined') return;

      const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
      const teamData = JSON.parse(localStorage.getItem('teamData') || 'null');
      const followerId = teamData?.isActive ? teamData?.teamId : currentUser?.Id;
      if (!followerId) return;

      setLoading(true);
      const res = await axios.get(
        `${apiEndpoint}/Follow/IsFollowing?followerId=${followerId}&followingId=${profileUserId}`,
        {
          headers: {
            accept: '*/*',
            XApiKey: API_KEY,
          },
        }
      );

      if (res.status === 200 && res.data?.Result) {
        setIsFollowing(Boolean(res.data.Result.IsFollowing));
      }
    } catch (err) {
      setError(err);
      console.error('useFollowStatus error:', err);
    } finally {
      setLoading(false);
    }
  }, [profileUserId]);

  const fetchFollowerCount = useCallback(async () => {
    try {
      if (!profileUserId || typeof window === 'undefined') return;

      const res = await axios.get(
        `${apiEndpoint}/Follow/GetFollowers?userId=${profileUserId}&pageNumber=1&pageSize=1`,
        {
          headers: {
            accept: '*/*',
            XApiKey: API_KEY,
          },
        }
      );

      if (res.status === 200 && res.data?.Result) {
        setFollowerCount(Number(res.data.Result.TotalCount ?? 3));
      }
    } catch (err) {
      console.error('Error fetching follower count:', err);
    }
  }, [profileUserId]);

  useEffect(() => {
    fetchStatus();
    fetchFollowerCount();
  }, [fetchStatus, fetchFollowerCount]);

  const follow = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !profileUserId) return null;
      const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
      const teamData = JSON.parse(localStorage.getItem('teamData') || 'null');
      const followerId = teamData?.isActive ? teamData?.teamId : currentUser?.Id;
      if (!followerId) throw new Error('Missing follower id');

      // optimistic update
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);

      const payload: any = {
        FollowerId: followerId.toString(),
        FollowingId: profileUserId.toString(),
      };

      // Add ProfileDetailId if available (required by backend)
      if (profileDetailId) {
        payload.UserProfileDetailId = profileDetailId.toString();
      }

      const res = await axios.post(`${apiEndpoint}/Follow/FollowUser`, payload, {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: API_KEY,
        },
      });

      if (res.status === 200) {
        await fetchStatus();
        await fetchFollowerCount();
        return res.data;
      }

      // revert optimistic on failure
      setIsFollowing(false);
      setFollowerCount(prev => prev - 1);
      return res.data;
    } catch (err) {
      setIsFollowing(false);
      setFollowerCount(prev => prev - 1);
      console.error('follow error', err);
      toast.error('Failed to follow user');
      throw err;
    }
  }, [profileUserId, profileDetailId, fetchStatus, fetchFollowerCount]);

  const unfollow = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !profileUserId) return null;
      const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
      const teamData = JSON.parse(localStorage.getItem('teamData') || 'null');
      const followerId = teamData?.isActive ? teamData?.teamId : currentUser?.Id;
      if (!followerId) throw new Error('Missing follower id');

      // optimistic update
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, prev - 1));

      const payload: any = {
        FollowerId: followerId.toString(),
        FollowingId: profileUserId.toString(),
      };

      // Add ProfileDetailId if available (required by backend)
      if (profileDetailId) {
        payload.UserProfileDetailId = profileDetailId.toString();
      }

      const res = await axios.delete(`${apiEndpoint}/Follow/UnfollowUser`, {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: API_KEY,
        },
        data: payload,
      });

      if (res.status === 200) {
        await fetchStatus();
        await fetchFollowerCount();
        return res.data;
      }

      // revert optimistic on failure
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
      return res.data;
    } catch (err) {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
      console.error('unfollow error', err);
      toast.error('Failed to unfollow user');
      throw err;
    }
  }, [profileUserId, profileDetailId, fetchStatus, fetchFollowerCount]);

  return {
    isFollowing,
    loading,
    error,
    followerCount,
    refresh: () => {
      fetchStatus();
      fetchFollowerCount();
    },
    setIsFollowing,
    setFollowerCount,
    follow,
    unfollow,
  };
};

export default useFollowStatus;
