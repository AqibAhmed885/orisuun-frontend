type ProviderProfileData = Record<string, any> | null | undefined;

const PROFILE_TYPE_IDS: Record<string, number> = {
  business: 1,
  'black-owned business': 1,
  consultant: 2,
  expert: 3,
  advocate: 4,
  partner: 5,
  professional: 6,
  investor: 7,
  mentor: 8,
};

function resolveProfileTypeId(profileData: ProviderProfileData) {
  const explicitId = Number(
    profileData?.UserProfileTypeId ??
    profileData?.ProfileTypeId ??
    profileData?.userProfileTypeId
  );

  if (Number.isFinite(explicitId) && explicitId > 0) return explicitId;

  const profileTypeName = String(
    profileData?.UserProfileType ??
    profileData?.UserProfileName ??
    profileData?.ProfileType ??
    ''
  ).toLowerCase();

  const matchingType = Object.entries(PROFILE_TYPE_IDS).find(([name]) =>
    profileTypeName.includes(name)
  );

  return matchingType?.[1] ?? 6;
}

export function resolveBookingProvider(profileData: ProviderProfileData) {
  return {
    providerName:
      profileData?.CompanyName ||
      profileData?.ChatUserName ||
      profileData?.FullName ||
      profileData?.UserFullName ||
      profileData?.UserName ||
      profileData?.fullName ||
      profileData?.name ||
      'Provider',
    providerAvatar:
      profileData?.ProfilePicture ||
      profileData?.ProfileImage ||
      profileData?.ProfilePic ||
      profileData?.profilePicture ||
      profileData?.profileImage ||
      '',
    providerProfileTypeId: resolveProfileTypeId(profileData),
    providerIsVerified: Boolean(
      profileData?.ProfileVerified ??
      profileData?.IsVerified ??
      profileData?.isVerified
    ),
  };
}
