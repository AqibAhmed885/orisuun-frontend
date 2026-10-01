'use client';

import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrentUser } from '@/data/slices/user-slice';
import { RootState } from '@/data/store';
import { getLoggedInUserDataAction } from '@/server-actions/createProfile';
import { cn } from '@/utils/utils';
import Hamburger from '@/icons/sidebar/hamburger';
import { setOpenSidebar } from '@/data/slices/common-slice';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useParams, usePathname, useRouter } from 'next/navigation';
import OnBoarding from '@/components/onBoardingUsers/OnBoarding'
import FreeTierGuard from '@/components/FreeTierGuard';
import Loader from '@/components/ui/loader';
import { getValidAccessToken } from '@/utils/auth-token';

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const pathname = usePathname()
  const params = useParams();
  const router = useRouter();

  const isUsernameRoute = !!params.username;
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMobileMediaQuery("1024px");
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { openSidebar } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch();
  const [isSessionReady, setIsSessionReady] = useState(false);

  const currentUserData =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const [filledOnboarding, setFilledOnboarding] = useState(false)

  const handleGetUserData = useCallback(async (accessToken: string) => {
    try {
      const result = await getLoggedInUserDataAction(accessToken);
      if (result.success) {
        dispatch(addCurrentUser(result.data));
        return true;
      }

      if (result.status === 401) {
        router.replace('/signin');
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [dispatch, router]);

  const useOutsideClick = (callback) => {
    const ref = React.useRef();

    React.useEffect(() => {
      const handleClick = (event) => {
        callback();
      };

      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, []);

    return ref;
  };
  const handleClickOutside = () => {

    if (isMobile) {
      dispatch(setOpenSidebar());
      return;
    }
  };
  // const ref = useOutsideClick(handleClickOutside);
  // useOutsideClick(ref, () =>  dispatch(setOpenSidebar()));
  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      const accessToken = await getValidAccessToken();

      if (cancelled) {
        return;
      }

      if (!accessToken) {
        router.replace('/signin');
        setIsSessionReady(true);
        return;
      }

      if (!currentUser) {
        await handleGetUserData(accessToken);
      }

      if (!cancelled) {
        setIsSessionReady(true);
      }
    };

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [currentUser, handleGetUserData, router]);

  useEffect(() => {
    const updateScaleFactor = () => {
      const scaleFactor = Math.min(
        window.innerWidth / 1440,
        window.innerHeight / 900
      );
      document.documentElement.style.setProperty(
        '--scale-factor',
        scaleFactor.toString()
      );

      // Calculate and set the sidebar width
      const sidebarWidth = 250 * scaleFactor;
      document.documentElement.style.setProperty(
        '--sidebar-width',
        `${sidebarWidth}px`
      );
    };

    updateScaleFactor();
    window.addEventListener('resize', updateScaleFactor);
    return () => window.removeEventListener('resize', updateScaleFactor);
  }, []);

  if (!isSessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  const isNestedRoute = pathname.split('/').filter(Boolean).length > 1;
  return (
    <div className="">

      {(!filledOnboarding && currentUserData && !currentUserData?.isSubmittedOnboardingForm && !currentUserData?.isBasicProfileDetailExist) && (
        <div className="fixed z-[100] bg-gray-500 bg-opacity-50 backdrop-blur-sm h-full w-full overflow-hidden flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl m-auto max-h-[95vh] rounded-xl shadow-2xl overflow-auto">
            <OnBoarding
              userId={currentUserData?.Id}
              accountType={currentUserData?.UserProfileTypeId || 1}
              isPremium={currentUserData?.UserSubscribedPlanType === "Premium"}
              setFilledOnboarding={setFilledOnboarding}
            />
          </div>
        </div>
      )}

      {!isUsernameRoute && <Sidebar key="sidebar-main" expanded={expanded} setExpanded={setExpanded} />}
      <div className='w-full bg-white h-[60px] lg:hidden'>
        {!isUsernameRoute && <Hamburger className='hamburger-icon' onClick={() => {
          if (isMobile) {
            dispatch(setOpenSidebar());
            return;
          }
        }} />}
      </div>
      <main
        className={cn(
          `overflow-auto transition-all duration-300 min-h-screen`,
          !isUsernameRoute ?
            expanded
              ? 'lg:ml-[264px] 2xl:ml-[calc(264px*var(--scale-factor))]'
              : 'lg:ml-[72px] 2xl:ml-[calc(72px*var(--scale-factor))]'
            : 'w-full mx-20')}
      // ref={ref}
      >
        <FreeTierGuard>
          <div className="h-full max-w-[100rem] px-2 md:px-0 4xl:container mx-auto">
            {children}
          </div>
        </FreeTierGuard>
      </main>
    </div>
  );
};

export default Layout;
