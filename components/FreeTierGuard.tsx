'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import UpgradeModal from '@/components/UpgradeModal';
import { isFreeTierRestricted } from '@/hooks/useFreeTierAccess';
import { isAdminUser, isFreeTierUser } from '@/utils/freeTierSidebar';

interface FreeTierGuardProps {
  children: ReactNode;
}

// Public routes that should always be accessible (no restrictions)
const PUBLIC_ROUTES = [
  '/free/signup',
  '/free/signup-thank-you',
  '/free/weekly-funding',
  '/free/weekly-small-business-funding',
  '/free/weekly-startups-funding',
  '/free',
];

export default function FreeTierGuard({ children }: FreeTierGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isFreeTier, setIsFreeTier] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);

  // Check if current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
      userData = null;
    }

    // Don't show modal for public routes or admin users
    if (isPublicRoute || isAdminUser(userData)) {
      setIsFreeTier(false);
      setIsRestricted(false);
      setShowModal(false);
      return;
    }

    const freeTierStatus = isFreeTierUser(userData);
    const restricted = freeTierStatus && isFreeTierRestricted(pathname);

    setIsFreeTier(freeTierStatus);
    setIsRestricted(restricted);
    setShowModal(restricted);
  }, [pathname, isPublicRoute]);

  const handleCloseModal = () => {
    setShowModal(false);
    router.replace('/dashboard');
  };

  return (
    <>
      {!isRestricted && children}
      {!isPublicRoute && isFreeTier && (
        <UpgradeModal
          isOpen={showModal}
          onClose={handleCloseModal}
          blockedPath={pathname}
        />
      )}
    </>
  );
}
