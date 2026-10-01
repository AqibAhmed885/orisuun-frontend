export const planType = [
  'Standard',
  'Premium',
];

export const planTypes = [
  { 1: 'Visibility and collaboration' },
  { 2: 'Growth, visibility and collaboration' },
];

export const billingFrequency = [
  {
    type: 'Monthly',
    rate: '$11.99/month',
    free: '',
  },
  {
    type: 'Quarterly',
    rate: '$18/quarter',
    free: '1 month free',
  },
  {
    type: 'Annually',
    rate: '$100/year',
    free: '5 months free',
  },
];

export const accountType = ['Checking', 'Savings'];

export const bankAccountTypes = ['Individual', 'Company'];

export const profileTypes = [
  'Black-Owned Businesses',
  'Mentors',
  'Experts',
  'Investors',
  'Professionals',
  'Partners',
  'Strategy Consultants',
  'Advocates',
];

export const profileTypesWithIds = [
  {
    Id: 1,
    UserProfileName: 'Black-owned Businesses',
    slug: 'black-owned-businesses',
  },
  {
    Id: 3,
    UserProfileName: 'Experts',
    slug: 'experts',
  },
  {
    Id: 7,
    UserProfileName: 'Investors',
    slug: 'investors',
  },
  {
    Id: 2,
    UserProfileName: 'Strategy Consultants',
    slug: 'strategy-consultants',
  },

  {
    Id: 6,
    UserProfileName: 'Professionals',
    slug: 'professionals',
  },
  // {
  //   Id: 5,
  //   UserProfileName: 'Partners',
  //   slug: 'partners',
  // },
  {
    Id: 8,
    UserProfileName: 'Mentors',
    slug: 'mentors',
  },
  {
    Id: 4,
    UserProfileName: 'Advocates',
    slug: 'advocates',
  },
];

// Helper function to convert profile name to URL-friendly slug
export const getProfileSlug = (profileName) => {
  if (!profileName) return null;
  return profileName.toLowerCase().replace(/\s+/g, '-');
};

// Helper function to get profile ID from slug
export const getProfileIdFromSlug = (slug) => {
  if (!slug) return null;
  const profile = profileTypesWithIds.find(
    (p) => getProfileSlug(p.UserProfileName) === slug.toLowerCase()
  );
  return profile ? profile.Id : null;
};

// Helper function to get profile name from slug
export const getProfileNameFromSlug = (slug) => {
  if (!slug) return null;
  const profile = profileTypesWithIds.find(
    (p) => getProfileSlug(p.UserProfileName) === slug.toLowerCase()
  );
  return profile ? profile.UserProfileName : null;
};

// Get the display name used throughout signup and checkout from a profile type ID.
export const getProfileNameFromId = (profileTypeId) => {
  const normalizedId = Number(profileTypeId);
  if (!normalizedId) return null;

  const profile = profileTypesWithIds.find(
    (item) => Number(item.Id) === normalizedId
  );

  return profile?.UserProfileName || null;
};
