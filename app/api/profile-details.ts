import axios from 'axios';

import { getOriginalPrivateId } from '@/utils/profile.helpers';

const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL
  ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
  : 'https://api.orisuun.com/api';

interface ProfileViewer {
  Id?: string;
  UserName?: string;
}

interface FetchProfileDetailsOptions {
  username?: string;
  profileId?: string;
  viewer?: ProfileViewer | null;
}

/**
 * Public username routes use ExploreUserProfileV1 and require no user session.
 * Signed-in profile routes retain ViewUserProfileV1 so viewer-specific fields
 * such as favourites continue to work.
 */
export const fetchProfileDetails = async ({
  username,
  profileId,
  viewer,
}: FetchProfileDetailsOptions) => {
  const isPublicProfile = Boolean(username);
  const response = await axios.post(
    `${apiEndpoint}/Profile/${
      isPublicProfile ? 'ExploreUserProfileV1' : 'ViewUserProfileV1'
    }`,
    isPublicProfile
      ? { UserName: username }
      : {
          UserId: viewer?.Id,
          UserProfileDetailId: getOriginalPrivateId(profileId),
          UserName: viewer?.UserName,
        },
    {
      headers: {
        XApiKey: process.env.NEXT_PUBLIC_API_KEY,
      },
    }
  );

  return response.data?.Result;
};
