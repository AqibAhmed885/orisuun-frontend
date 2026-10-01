import { useEffect, useState, useCallback } from 'react';
import { communityApi } from '@/app/api/dashboard/community';

export const useCommunityAdmin = (communityId?: string | null, userId?: string | null) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!communityId) {
      setMembers([]);
      setIsAdmin(false);
      return;
    }
    setLoading(true);
    try {
      const resp = await communityApi.getCommunityDetails(communityId);
      const membersArr = Array.isArray(resp?.data?.Members)
        ? resp.data.Members
        : Array.isArray(resp)
        ? resp
        : [];
      setMembers(membersArr);
      const amIAdmin = membersArr.some((m: any) =>
        (m.IsAdmin === true || m.isAdmin === true) &&
        (m.UserId === userId || m.Id === userId || m.userId === userId)
      );
      setIsAdmin(!!amIAdmin);
    } catch (err) {
      console.error('useCommunityAdmin fetch error', err);
      setMembers([]);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [communityId, userId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { isAdmin, members, loading, refresh: fetchMembers };
};