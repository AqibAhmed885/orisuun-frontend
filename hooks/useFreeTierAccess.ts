'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FREE_TIER_MENU_ITEMS,
  isAdminUser,
  isFreeTierUser,
  isPremiumOnlyPath,
} from '@/utils/freeTierSidebar';

const PUBLIC_ROUTES = [
  '/free/signup',
  '/free/signup-thank-you',
  '/free/weekly-funding',
  '/free/weekly-small-business-funding',
  '/free/weekly-startups-funding',
  '/free',
];

const isPublicPath = (path: string) =>
  PUBLIC_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));

const readCurrentUser = () => {
  if (typeof window === 'undefined') return null;

  try {
    return JSON.parse(localStorage.getItem('userData') || 'null');
  } catch {
    return null;
  }
};

export const useFreeTierAccess = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isFreeTier, setIsFreeTier] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [blockedPath, setBlockedPath] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = readCurrentUser();
    const freeTier = !isAdminUser(currentUser) && isFreeTierUser(currentUser);
    const blocked =
      !isPublicPath(pathname) && freeTier && isPremiumOnlyPath(pathname);

    setIsFreeTier(freeTier);
    setShowUpgradeModal(blocked);
    setBlockedPath(blocked ? pathname : null);
  }, [pathname]);

  const handleUpgrade = () => {
    router.push('/subscription-plan?upgrade=true');
    setShowUpgradeModal(false);
  };

  const handleDismiss = () => {
    router.replace('/dashboard');
    setShowUpgradeModal(false);
  };

  return {
    isFreeTier,
    showUpgradeModal,
    blockedPath,
    handleUpgrade,
    handleDismiss,
  };
};

export const isFreeTierRestricted = (path: string): boolean =>
  !isPublicPath(path) && isPremiumOnlyPath(path);

export const getFreeTierAllowedFeatures = (): string[] => [
  FREE_TIER_MENU_ITEMS.HOME,
  FREE_TIER_MENU_ITEMS.DISCOUNTS,
  FREE_TIER_MENU_ITEMS.COMMUNITIES,
  FREE_TIER_MENU_ITEMS.CONNECTIONS,
  FREE_TIER_MENU_ITEMS.REVIEWS,
  FREE_TIER_MENU_ITEMS.LEADERBOARD,
  FREE_TIER_MENU_ITEMS.SEARCH.PROFILE,
  FREE_TIER_MENU_ITEMS.SEARCH.POST,
  FREE_TIER_MENU_ITEMS.SEARCH.EXPLORE,
  FREE_TIER_MENU_ITEMS.MESSAGES,
  FREE_TIER_MENU_ITEMS.SAVED_RESOURCES,
  FREE_TIER_MENU_ITEMS.SETTINGS,
  FREE_TIER_MENU_ITEMS.PROFILE,
];
