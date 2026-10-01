export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionUser {
  UserProfileTypeId?: number | string;
  UserSubscribedPlanType?: string | null;
  IsSubscribed?: boolean | null;
  isSubscriptionActive?: boolean | null;
}

// Sidebar destinations available to free members. Premium members can access
// these destinations as well as every premium-only destination below.
export const FREE_TIER_MENU_ITEMS = {
  HOME: '/dashboard',
  DISCOUNTS: '/discount-portal',
  COMMUNITIES: '/communities',
  CONNECTIONS: '/connections',
  REVIEWS: '/feedback-and-reviews',
  LEADERBOARD: '/leaderboard',
  SEARCH: {
    PROFILE: '/profile-search',
    POST: '/post-search',
    EXPLORE: '/explore',
  },
  MESSAGES: '/chats',
  SAVED_RESOURCES: '/saved-resources',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// Member features that require a premium subscription. Admin authorization is
// handled separately and always takes precedence over subscription permissions.
export const PREMIUM_ONLY_PATHS = [
  '/business-development',
  '/cofounder',
  '/cofounder-and-board-matcher',
  '/fundraising',
  '/transactions-and-escrow',
  '/verification',
  '/teams',
  '/reward',
] as const;

const ADMIN_PROFILE_TYPE_IDS = new Set([9, 10]);

const pathMatches = (path: string, route: string): boolean =>
  path === route || path.startsWith(`${route}/`);

export const isAdminUser = (user?: SubscriptionUser | null): boolean =>
  ADMIN_PROFILE_TYPE_IDS.has(Number(user?.UserProfileTypeId));

/**
 * Resolve the only two supported member tiers from the API user shape. An
 * explicit Premium plan and the active-subscription fallback both map to the
 * same premium permission set; every inactive or unknown state is free.
 */
export const getSubscriptionTier = (
  user?: SubscriptionUser | null
): SubscriptionTier => {
  const planType = user?.UserSubscribedPlanType?.trim().toLowerCase();
  const subscriptionInactive =
    user?.IsSubscribed === false || user?.isSubscriptionActive === false;

  if (planType === 'premium' && !subscriptionInactive) {
    return 'premium';
  }

  if (planType === 'free' || planType === 'not_selected' || subscriptionInactive) {
    return 'free';
  }

  // Some API responses omit the plan name but still report an active paid
  // subscription. Since there are only two tiers, that subscription is premium.
  if (user?.IsSubscribed === true && user?.isSubscriptionActive !== false) {
    return 'premium';
  }

  return 'free';
};

const getStoredUser = (): SubscriptionUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    return JSON.parse(localStorage.getItem('userData') || 'null');
  } catch (error) {
    console.error('Error reading subscription permissions:', error);
    return null;
  }
};

export const isFreeTierUser = (user?: SubscriptionUser | null): boolean => {
  const resolvedUser = user ?? getStoredUser();

  if (isAdminUser(resolvedUser)) return false;

  return getSubscriptionTier(resolvedUser) === 'free';
};

export const isPremiumOnlyPath = (path: string): boolean =>
  PREMIUM_ONLY_PATHS.some((route) => pathMatches(path, route));

export const canAccessPath = (
  path: string,
  user?: SubscriptionUser | null
): boolean => {
  const resolvedUser = user ?? getStoredUser();

  if (isAdminUser(resolvedUser)) return true;
  if (!isPremiumOnlyPath(path)) return true;

  return getSubscriptionTier(resolvedUser) === 'premium';
};

export const shouldShowMenuItem = (
  path: string,
  user?: SubscriptionUser | null
): boolean => canAccessPath(path, user);

export const isMenuItemRestricted = (
  path: string,
  user?: SubscriptionUser | null
): boolean => !canAccessPath(path, user);
