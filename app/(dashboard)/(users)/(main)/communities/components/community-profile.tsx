'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MembersCard from './members-card';
import AdminCard from './admin-card';
import TopComments from './top-comments';
import StatsCard from './stats-card';
import { communityApi } from '@/app/api/dashboard/community';

export interface CommunityProfileProps {
  community?: {
    id?: string;
    name?: string;
    membersCount?: number;
    description?: string;
    bannerUrl?: string;
  } | null;
  isMobile?: boolean;
  onBack?: () => void;
  userData?: any;
}

const CommunityProfile: React.FC<CommunityProfileProps> = ({ community, isMobile = false, onBack, userData }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!community?.id) {
      setDetails(null);
      return;
    }
    setLoading(true);
    communityApi.getCommunityDetails(community.id)
      .then(res => {
        setDetails(res.data || null);
      })
      .catch(() => setDetails(null))
      .finally(() => setLoading(false));
  }, [community?.id]);

  useEffect(() => {
      if (!community?.id || !userData?.UserId) return;
      setLoading(true);
      communityApi.getUserStatsByCommunityId(community.id, userData.UserId).then(data => {
        setStats(data);
        setLoading(false);
      });
    }, [community?.id, userData?.UserId]);


  // Use details if available, fallback to passed community
  const profile = details || community;
  
  return (
    <aside className="w-full md:w-80 lg:w-96 space-y-4">
        <>
          <MembersCard
            members={profile?.Members}
            count={profile?.Members?.length || community?.membersCount || 0}
          onView={() => { }}
            loading={loading}
          />
          
          <AdminCard
            admin={{
              id: profile?.CreatorProfile?.Id || 'u1',
              name: profile?.CreatorProfile?.CompanyName || 'Yaamin Mans',
              avatar: profile?.CreatorProfile?.ProfilePicture || '/chat/user-avatar.png',
              role: profile?.CreatorProfile?.Role || 'Creator',
                badge: userData?.UserProfileType || 'Investor',
                location: profile?.CreatorProfile?.Location || 'Atlanta, GA',
                locationBadge: profile?.CreatorProfile?.Country || 'United States',
              country: profile?.CreatorProfile?.Country || 'United States',
              createdByCity: profile.CreatedByCity || "N/A" 
              }}
            loading={loading}
          />

          <TopComments communityId={community.id} />

          <StatsCard
            stats={{
                likes: stats?.Statistics?.UserReactions || 0,
                comments: stats?.Statistics?.TotalCommunityComments || 0
            }}
            admin={{
              name: stats?.UserData?.Name || 'Unknown User',
              avatar: stats?.UserData?.ProfilePicture || null,
              badge: stats?.UserData?.ProfileType || null,
              location: stats?.UserData?.Location?.cityName,
              locationBadge: stats?.UserData?.Location?.Country,
          }}
            loading={loading}
          />
        </>
    </aside>
  );
};

export default CommunityProfile;