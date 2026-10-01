import UserProfile from "./components/UserProfile";
import axios from "axios";
import { apiEndpoint } from "@/utils/utils";
import { getOriginalPrivateId } from "@/utils/profile.helpers";
import { cookies } from 'next/headers';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('userData')?.value || null;
    const authToken = cookieStore.get('token')?.value || null;

    let currentUser = null;

    if (userCookie) {
      try {
        currentUser = JSON.parse(userCookie);
      } catch {
        currentUser = null;
      }
    }

    const response = await axios.post(
      `${apiEndpoint}/Profile/ViewUserProfileV1`,
      {
        UserId: currentUser?.Id ?? null,
        UserProfileDetailId: getOriginalPrivateId(resolvedParams.id),
        UserName: currentUser?.UserName ?? null,
      },
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

    // ✅ Handle array OR object safely
    const rawResult = response.data?.Result;
    const result = Array.isArray(rawResult) ? rawResult[0] : rawResult;

    const memberTypeIds = [1, 2, 3, 4, 5, 6, 7, 8];

    const typeId = result?.UserProfileTypeId;
    const isMember = memberTypeIds.includes(typeId);

    const companyName =
      result?.CompanyName || result?.Name || 'Orisuun';

    const title = isMember
      ? `${companyName} – Orisuun Members Profile`
      : `${companyName} – Orisuun Profile`;

    const description = `View profile and details.`;

    return {
      title,
      description,
    };
  } catch (e) {
    console.log('Profile Metadata Error:', e);

    return {
      title: 'Orisuun | Profile',
      description: 'View user profile and details.',
    };
  }
}

interface PageProps {
  params: { id?: string; username?: string };
  searchParams?: { userProfileTypeId: string };
}

const Profile = ({ params, searchParams }: PageProps) => {
  return (
    <>
      <UserProfile params={params} searchParams={searchParams} />
    </>
  );
};

export default Profile;
