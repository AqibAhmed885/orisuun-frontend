'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { fetchProfileDetails } from '@/app/api/profile-details';
import Bob from '../../../Bob/Bob';
import Investor from '../../../Investor/Investor';
import Mentor from '../../../Mentor/Mentor';
import Partner from '../../../Partner/Partner';
import Advocate from '../../../Advocate/Advocate';
import StrategyConsultant from '../../../StrategyConsultant/StrategyConsultant';
import Expert from '../../../Expert/Expert'
import Professional from '../../../Professional/Professional';
import Other from '../Other';

interface PageProps {
  params: { id?: string; username?: string };
  searchParams?: { userProfileTypeId: string };
}

const UserProfile = ({ params, searchParams }: PageProps) => {
  const [userProfileType, setUserProfileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

        const profile = await fetchProfileDetails({
          username: params.username,
          profileId: params.id,
          viewer: currentUser,
        });

        const type = profile?.UserProfileType;
        setUserProfileType(type || null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUserProfileType(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id, params.username]);


  return (
    <>
      {loading && <Loader />}

      {!loading && userProfileType == 'Black-owned Business' && (
        <Bob params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Mentor' && (
        <Mentor params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Investor' && (
        <Investor params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Partner' && (
        <Partner params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Advocate' && (
        <Advocate params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Strategy Consultants' && (
        <StrategyConsultant params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Expert' && (
        <Expert params={params} searchParams={searchParams} />
      )}

      {!loading && userProfileType == 'Professional' && (
        <Professional params={params} searchParams={searchParams} />
      )}

      {!loading &&
        userProfileType &&
        ![
          'Black-owned Business',
          'Mentor',
          'Investor',
          'Partner',
          'Advocate',
          'Strategy Consultants',
          'Expert',
          'Professional',
        ].includes(userProfileType) && (
          <Other params={params} searchParams={searchParams} />
        )}
    </>
  );
};

export default UserProfile;
