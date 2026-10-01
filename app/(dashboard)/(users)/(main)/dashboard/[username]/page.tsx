import axios from 'axios';
import { notFound } from 'next/navigation';

import UserProfile from '../../profile/[id]/components/UserProfile';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

interface PageProps {
  params: { username: string };
    searchParams?: { userProfileTypeId?: string };
}

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const resolvePrivateRouteId = async (username: string): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${apiEndpoint}/Profile/ExploreUserProfileV1`,
            { UserName: username },
            {
          headers: {
              XApiKey: apiKey,
          },
        }
    );

      const result = response.data?.Result;
      const rawProfileDetailId =
          result?.UserProfileDetailId ?? result?.UserProfileDetailsId ?? result?.Id;

      const profileDetailId = Number(rawProfileDetailId);
      if (!Number.isFinite(profileDetailId) || profileDetailId <= 0) {
          return null;
    }

      return String(add2040ToProfileDetailsId(profileDetailId));
  } catch {
      return null;
  }
};

const PublicProfilePage = async ({ params, searchParams }: PageProps) => {
    const privateRouteId = await resolvePrivateRouteId(params.username);

    if (!privateRouteId) {
        notFound();
    }

    return (
      <UserProfile
          params={{ id: privateRouteId, username: params.username }}
          searchParams={{
              userProfileTypeId: searchParams?.userProfileTypeId || '',
          }}
      />
  );
};

export default PublicProfilePage;
