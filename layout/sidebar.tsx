'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { getProfileType, resetUserState, setTeamDataLocal } from '@/data/slices/user-slice';
import { resetAuthState } from '@/data/slices/auth-slice';
import { apiEndpoint, cn } from '@/utils/utils';
import useOutsideClick from '@/hooks/useOutsideClick';
import BusinessDevelopmentIcon from '@/icons/sidebar/business-development-icon';
import ChatsIcon from '@/icons/sidebar/chats-icon';
import CofounderIcon from '@/icons/sidebar/cofounder-icon';
import Collapse from '@/icons/sidebar/collapse';
import DashboardIcon from '@/icons/sidebar/dashboard-icon';
import DiscountPortalIcon from '@/icons/sidebar/discount-portal-icon';
import LeaderboardIcon from '@/icons/sidebar/leaderboard-icon';
import LogoBW from '@/icons/logo-b&w';
import LogoSM from '@/icons/logo-sm';
import User from '@/icons/user';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import { setOpenSidebar } from '@/data/slices/common-slice';
import { getUserProfileTypes } from '@/server-actions/profile';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import FundRaisingIcon from '@/icons/sidebar/fund-raising-icon';
import EscrowIcon from '@/icons/sidebar/escrow-icon';
import axios from 'axios';
import FavouritesIcon from '@/icons/sidebar/favourites-icon';
import Discount from '@/icons/sidebar/discount';
import FeedBackIcon from '@/icons/sidebar/feedback';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import ProfileSearchModal from '@/app/(dashboard)/(users)/(main)/profile-search/components/profile-modal';
import PostSearchModal from '@/app/(dashboard)/(users)/(main)/post-search/components/post-modal';
import ChevronDown from '@/icons/chevron-down';
import NotificationBadge from '@/components/ui/notification-badge';
import NotificationPanel from '@/components/ui/NotificationPanel';
import SidebarTooltip from '@/components/ui/sidebar-tooltip';
import SidebarDropdownPanel from '@/components/ui/sidebar-dropdown-panel';
import ProfileCompletionModal from '@/components/dashboard/ProfileCompletionModal';
import UpgradeModal from '@/components/UpgradeModal';
import OpportunityPostsIcon from '@/icons/sidebar/OpportunityPostsIcon';
import {
  getSubscriptionTier,
  isMenuItemRestricted,
} from '@/utils/freeTierSidebar';
import Expand from '@/icons/sidebar/Expand';
import { getUserPermissions, hasPermission as hasAdminPermission } from '@/utils/middleware-permissions';
import getRolesIcon from '@/icons/chats/role-icons';
import AddUser from '@/app/(dashboard)/(users)/(admin)/add-user/page';
import { Icon, LucideHamburger, Menu, User2, UserIcon } from 'lucide-react';
import VerifyIcon from '@/icons/verification/verify-icon';

import { signalRService } from '@/app/(dashboard)/(users)/(main)/chats/components/signalRService';
import { respondToBookingReschedule } from '@/lib/booking';
import useCurrentUser from '@/hooks/useCurrentUser';

interface IProps {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

interface INotifcationsCOunt {
  AllNotificationsCount: number;
  ChatsNotificationCount: number;
  FeedNotifications: number;
  OpptertunityNotifications: number;
  COFounderNotifications: number;
}

const Sidebar: React.FC<IProps> = ({ expanded, setExpanded }) => {
  type SwitchTeamData = {
    isActive: boolean;
    teamId: number | string;
    teamName: string;
    teamMembers: [];
    isBusiness: boolean;
    isPremium: boolean;
    isVerified: boolean;
  };
  const { openSidebar } = useSelector((state: RootState) => state.common);
  const pathname = usePathname();
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const isMobile = useMobileMediaQuery('1024px');
  const [notificationList, setNotificationList] = useState([]);
  const [notificationCount, setNotificationCount] = useState<INotifcationsCOunt>({
    AllNotificationsCount: 0,
    ChatsNotificationCount: 0,
    FeedNotifications: 0,
    OpptertunityNotifications: 0,
    COFounderNotifications: 0,
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const boxRef = useRef(null);
  const [showProfileSearchModal, setShowProfileSearchModal] = useState(false);
  const [showPostSearchModal, setShowPostSearchModal] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [profileCompletionFirstName, setProfileCompletionFirstName] = useState('there');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [blockedPath, setBlockedPath] = useState<string | null>(null);

  // Refs + hover state for portal tooltips (used when sidebar is collapsed)
  const profileSearchRef = useRef<HTMLButtonElement | null>(null);
  const [profileSearchHovered, setProfileSearchHovered] = useState(false);

  const postSearchRef = useRef<HTMLButtonElement | null>(null);
  const [postSearchHovered, setPostSearchHovered] = useState(false);

  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const [notificationsHovered, setNotificationsHovered] = useState(false);

  const userRef = useRef<HTMLDivElement | null>(null);
  const [userHovered, setUserHovered] = useState(false);
  const [isDiscountMenuOpen, setIsDiscountMenuOpen] = useState(false);
  const [isFundraisingMenuOpen, setIsFundraisingMenuOpen] = useState(false);
  const [isDiscountMenuPinned, setIsDiscountMenuPinned] = useState(false);
  const [isFundraisingMenuPinned, setIsFundraisingMenuPinned] = useState(false);
  const discountTriggerRef = useRef<HTMLButtonElement | null>(null);
  const fundraisingTriggerRef = useRef<HTMLButtonElement | null>(null);
  const discountCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fundraisingCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [switchTeamData, setSwitchTeamData] = useState<SwitchTeamData | null>(null);
  const [isTeamUser, setIsTeamUser] = useState(false);
  const prevSwitchDetails = useSelector((state: RootState) => state.user.teamData);

  useEffect(() => {
    setSwitchTeamData(prevSwitchDetails);
  }, [prevSwitchDetails]);

  useEffect(() => {
    dispatch(setTeamDataLocal());
  }, [dispatch]);

  useEffect(() => {
    if (switchTeamData != null && switchTeamData.isActive == true) {
      setIsTeamUser(true);
    } else {
      setIsTeamUser(false);
    }
  }, [switchTeamData]);

  // Toggle the notification list
  const toggleNotificationBox = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Function to handle clicks outside the notification box
  const handleClickOutside = (event) => {
    // If the click is outside the box, close it
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks on the entire document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const { user: currentUser } = useCurrentUser();
  const userPermissions = getUserPermissions(currentUser);
  const isAdminUser = currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9;
  const isPremiumMember = getSubscriptionTier(currentUser) === 'premium';
  const canAccessAdmin = (permissionId: string) =>
    isAdminUser && hasAdminPermission(userPermissions, permissionId);

  const { profileData } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const response = await axios.post(
          `${apiEndpoint}/Dashboard/GetNotificationList`,
          {
            UserId: currentUser?.Id,
            UserProfileDetailId: currentUser?.UserProfileDetailsId,
            UserName: currentUser?.UserName,
          },
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );

        setNotificationList(response.data.Result);
        setLoader(false);
      } catch (error) {
        setLoader(false);
      }
    };
    isNotificationOpen || fetchData();
  }, [isNotificationOpen, currentUser?.Id]);

  const handleNotificationClick = async (NotificationId) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/Dashboard/ReadNotificationData`,
        {
          UserId: currentUser?.Id,
          NotificationId: NotificationId,
        },
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200) {
        setNotificationList((prevList) =>
          prevList.map((notification) =>
            notification.NotificationId === NotificationId
              ? { ...notification, IsRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch users. Please try again.');
    }
  };
  const handleSubmit = async (data, Status) => {
    try {
      if (data.NotificationType === 'Booking Reschedule Request') {
        const rescheduleRequestId =
          data.RequestId ||
          data.RescheduleRequestId ||
          data.BookingRescheduleRequestId ||
          data.InviteId ||
          data.NotificationId;

        if (!rescheduleRequestId || !currentUser?.Id) {
          throw new Error('Missing reschedule request or responding user ID.');
        }

        await respondToBookingReschedule({
          RescheduleRequestId: String(rescheduleRequestId),
          RespondedBy: String(currentUser.Id),
          Status: Status === 'Accepted' ? 'accepted' : 'rejected',
        });

        setNotificationList((prevList) =>
          prevList.map((notification) =>
            notification.NotificationId === data.NotificationId
              ? { ...notification, InviteStatus: Status, RescheduleStatus: Status }
              : notification
          )
        );
        toast.success(`Reschedule request ${Status === 'Accepted' ? 'accepted' : 'rejected'}.`);
        return;
      }

      const response = await axios.post(
        `${apiEndpoint}/Dashboard/AcceptOrRejectInvitation`,
        {
          UserId: currentUser?.Id,
          Status: Status,
          InviteId: data.InviteId,
          ...(data.NotificationType === 'ContractInvitation'
            ? { ContractId: data.ContractId }
            : {}),
        },
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200) {
        setNotificationList((prevList) =>
          prevList.map((notification) =>
            notification.NotificationId === data.NotificationId
              ? { ...notification, InviteStatus: Status }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error searching users:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to respond to the reschedule request.';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const response = await axios.post(
          `${apiEndpoint}/Dashboard/GetNotificationCount`,
          {
            UserId: currentUser?.Id,
            // UserProfileDetailId: currentUser?.UserProfileDetailsId,
            // UserName: currentUser?.UserName,
          },
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );
        if (response.status === 200) {
          setNotificationCount(response?.data?.Result);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchNotificationsCount();
    }, 5000);

    return () => {
      clearInterval(intervalId); // Cleanup the interval on component unmount
    };
  }, []);

  // SignalR notification update listener
  useEffect(() => {
    if (!currentUser?.Id) return;

    // Initialize SignalR connection
    const initSignalR = async () => {
      try {
        await signalRService.startConnection(currentUser.Id);

        // Listen for notification updates
        signalRService.onNotificationUpdate((payload) => {
          const type = payload.notificationType;

          // Update notification count based on type
          setNotificationCount((prev) => {
            const updated = { ...prev };

            switch (type) {
              case 'Chat Message':
                updated.ChatsNotificationCount = (prev.ChatsNotificationCount || 0) + 1;
                updated.AllNotificationsCount = (prev.AllNotificationsCount || 0) + 1;
                break;
              case 'Feed':
                updated.FeedNotifications = (prev.FeedNotifications || 0) + 1;
                updated.AllNotificationsCount = (prev.AllNotificationsCount || 0) + 1;
                break;
              case 'New co-founder & board of director':
                updated.COFounderNotifications = (prev.COFounderNotifications || 0) + 1;
                updated.AllNotificationsCount = (prev.AllNotificationsCount || 0) + 1;
                break;
              default:
                updated.AllNotificationsCount = (prev.AllNotificationsCount || 0) + 1;
                break;
            }

            return updated;
          });
        });
      } catch (error) {
        console.error('Error initializing SignalR for notifications:', error);
      }
    };

    initSignalR();

    // Cleanup on unmount
    return () => {
      signalRService.offNotificationUpdate();
      if (currentUser?.Id) {
        signalRService.stopConnection(currentUser.Id);
      }
    };
  }, [currentUser?.Id]);

  useOutsideClick(ref, () => {
    setShowOptions(false);
  });

  const fetchProfileType = useCallback(async () => {
    try {
      const response = await getUserProfileTypes();

      if (response.success) {
        dispatch(getProfileType(response.data));
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching profile type:', error);

      toast('Failed to fetch user data', {
        toastId: 'api-error',
        type: 'error',
      });
    }
  }, [dispatch, router]);

  useEffect(() => {
    fetchProfileType();
  }, [fetchProfileType]);

  useEffect(() => {
    setShowOptions(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobile) {
      dispatch(setOpenSidebar());
    }
  }, [dispatch, isMobile]);

  const CustomLink = ({
    url,
    icon,
    text,
    expanded = false,
    onClick,
  }: {
    url: string;
    icon: React.ReactNode;
    text: string;
    expanded: boolean;
    onClick?: () => void;
  }) => {
    const handleOnClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setShowOptions(false);

      // Platform items stay visible for every member. Check the subscription
      // before profile completion so Free members consistently see the upgrade
      // popup when they select a Premium feature.
      if (!isAdminUser && isMenuItemRestricted(url, currentUser)) {
        handleMenuNavigation(url);
        return;
      }

      const isValid = await validateBeforeNavigation();
      if (isValid) {
        handleMenuNavigation(url);
      } else {
        const firstName =
          currentUser?.FirstName ||
          currentUser?.Firstname ||
          currentUser?.UserName?.split(' ')?.[0] ||
          'there';
        setProfileCompletionFirstName(firstName);
        setShowProfileCompletionModal(true);
      }
    };

    const validateBeforeNavigation = async () => {
      let user = localStorage.getItem('userData') as string;
      if (!user) return false;
      const UserDetails = JSON.parse(user);
      if (
        (!UserDetails?.isProfileComplete ||
          !UserDetails?.isBasicProfileDetailExist) &&
        UserDetails.UserProfileTypeId != 10 &&
        UserDetails.UserProfileTypeId != 9
      ) {
        return false;
      }
      return true;
    };

    const triggerRef = useRef<HTMLAnchorElement | null>(null);
    const [hovered, setHovered] = useState(false);

    return (
      <div className="group relative flex w-full rounded-lg">
        <a
          ref={triggerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          title={text}
          className={cn(
            'w-full flex flex-nowrap items-center gap-3 px-3 py-3 min-h-11 text-h8 2xl:text-scaled-h8 font-medium hover:bg-olblue-50 transition-colors text-[#5B657B] hover:text-omblue-700 relative',
            expanded ? 'border-l-2 border-transparent' : 'rounded relative',
            pathname === url
              ? expanded
                ? 'text-omblue-700 bg-olblue-50 rounded-md font-semibold '
                : 'bg-omblue-50 text-omblue-700 w-11 mx-auto'
              : !expanded
                ? 'w-11 mx-auto'
                : '',
            expanded ? '' : 'justify-center'
          )}
          href={url}
          onClick={handleOnClick}
        >
          <div className=''>{icon}</div>
          {expanded && (
            <div className="flex items-center gap-1">
              <p className="text-h8 2xl:text-scaled-h8">{text}</p>
              {expanded
                ? ((text === 'Chats' &&
                  notificationCount?.ChatsNotificationCount > 0) ||
                  (text === 'Home' &&
                    notificationCount?.FeedNotifications > 0)) && (
                  <NotificationBadge
                    number={
                      text === 'Chats'
                        ? notificationCount?.ChatsNotificationCount
                        : text === 'Home'
                          ? notificationCount?.FeedNotifications
                          : text === 'Co-Founder & Board Matches'
                            ? notificationCount.COFounderNotifications
                            : 0
                    }
                    expanded={expanded}
                  />
                )
                : ((text === 'Chats' &&
                  notificationCount?.ChatsNotificationCount > 0) ||
                  (text === 'Co-Founder & Board Matches' &&
                    notificationCount?.COFounderNotifications > 0) ||
                  (text === 'Business Development' &&
                    notificationCount?.OpptertunityNotifications > 0) ||
                  (text === 'Home' &&
                    notificationCount?.FeedNotifications > 0)) && (
                  <NotificationBadge
                    number={
                      text === 'Chats'
                        ? notificationCount?.ChatsNotificationCount
                        : text === 'Business Development'
                          ? notificationCount?.OpptertunityNotifications
                          : text === 'Home'
                            ? notificationCount?.FeedNotifications
                            : 0
                    }
                    expanded={expanded}
                  />
                )}
            </div>
          )}
        </a>

        {/* Portal tooltip for collapsed sidebar (avoids z-index/overflow issues) */}
        <SidebarTooltip anchor={triggerRef.current} visible={!expanded && hovered} text={text} />
      </div>
    );
  };

  const handleLogout = () => {
    dispatch(resetUserState());
    dispatch(resetAuthState());
    localStorage.clear();
    // Clear the 'token' cookie
    Cookies.remove('token', { path: '/' });

    // Clear the 'userData' cookie
    Cookies.remove('userData', { path: '/' });
    router.push('/signin');
  };

  const wrapperRef = useRef(null);
  const wrapperRef2 = useRef(null);

  useEffect(() => {
    // Close menus based on the current pathname
    if (!pathname.includes('/discount-portal')) {
      setIsDiscountMenuOpen(false);
      setIsDiscountMenuPinned(false);
    }
    if (!pathname.includes('/fundraising')) {
      setIsFundraisingMenuOpen(false);
      setIsFundraisingMenuPinned(false);
    }

    // Handle clicks outside dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      // Close Discount Portal menu if click is outside its wrapper
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !pathname.includes('/discount-portal')
      ) {
        setIsDiscountMenuOpen(false);
      }

      // Close Fundraising menu if click is outside its wrapper
      if (
        wrapperRef2.current &&
        !wrapperRef2.current.contains(event.target) &&
        !pathname.includes('/fundraising')
      ) {
        setIsFundraisingMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname]);

  const setDiscountMenuOpenSafe = (open: boolean) => {
    if (discountCloseTimer.current) {
      clearTimeout(discountCloseTimer.current);
      discountCloseTimer.current = null;
    }
    if (open) {
      setIsDiscountMenuOpen(true);
      return;
    }
    discountCloseTimer.current = setTimeout(() => setIsDiscountMenuOpen(false), 120);
  };

  const setFundraisingMenuOpenSafe = (open: boolean) => {
    if (fundraisingCloseTimer.current) {
      clearTimeout(fundraisingCloseTimer.current);
      fundraisingCloseTimer.current = null;
    }
    if (open) {
      setIsFundraisingMenuOpen(true);
      return;
    }
    fundraisingCloseTimer.current = setTimeout(() => setIsFundraisingMenuOpen(false), 120);
  };

  const handleMenuNavigation = (url: string) => {
    if (isAdminUser) {
      setBlockedPath(null);
      setShowUpgradeModal(false);
      setIsDiscountMenuOpen(false);
      setIsFundraisingMenuOpen(false);
      setIsDiscountMenuPinned(false);
      setIsFundraisingMenuPinned(false);
      router.push(url);
      return;
    }

    if (isMenuItemRestricted(url, currentUser)) {
      setBlockedPath(url);
      setShowUpgradeModal(true);
      return;
    }

    setBlockedPath(null);
    setShowUpgradeModal(false);
    setIsDiscountMenuOpen(false);
    setIsFundraisingMenuOpen(false);
    setIsDiscountMenuPinned(false);
    setIsFundraisingMenuPinned(false);
    router.push(url);
  };

  const renderDiscountPortal = () => {
    const handleDiscountHover = (open: boolean) => {
      if (!expanded) {
        if (isDiscountMenuPinned) return;
        setDiscountMenuOpenSafe(open);
      }
    };

    if (currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9 || isTeamUser) {
      return null;
    }

    if (isPremiumMember && currentUser?.UserProfileTypeId === 1) {
      return (
      <div
        ref={wrapperRef}
          className={expanded ? 'w-full' : 'w-11 mx-auto'}
        onMouseEnter={() => handleDiscountHover(true)}
        onMouseLeave={() => handleDiscountHover(false)}
      >
        <div
            className={` ${isDiscountMenuOpen && '!py-0  rounded-md'
              } relative overflow-visible menu-container flex flex-col items-start text-h8 2xl:text-scaled-h8 font-medium border-l-2 border-transparent transition-colors hover:bg-olblue-50 hover:text-omblue-700 rounded-md ${expanded ? 'w-full px-3 py-3' : 'w-11 h-11 px-0 py-0 mx-auto items-center justify-center'}`}
        >
          <button
            ref={discountTriggerRef}
            onClick={() => {
              if (!expanded) {
                setIsDiscountMenuPinned((prev) => {
                  const next = !prev;
                  setDiscountMenuOpenSafe(next);
                  return next;
                });
                return;
              }
              setIsDiscountMenuOpen(!isDiscountMenuOpen);
            }}
              className={`flex items-center ${expanded ? 'gap-2 justify-between w-full text-left' : 'justify-center w-11 h-11 mx-auto'} 2xl:text-scaled-h8 font-medium 
              ${isDiscountMenuOpen ||
              (pathname.includes('/discount-portal') &&
                '  ')
              } ${expanded && isDiscountMenuOpen ? 'py-3 ' : ''}`}
          >
              <span className={`flex ${expanded ? 'gap-3' : 'gap-0'}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M14.9999 9.00303L8.99995 15.003M8.99995 9.00303H9.00995M14.9999 15.003H15.0099M3.84995 8.62303C3.70399 7.96555 3.7264 7.28187 3.91511 6.63537C4.10381 5.98886 4.4527 5.40047 4.92942 4.92475C5.40614 4.44903 5.99526 4.10137 6.64216 3.91402C7.28905 3.72667 7.97278 3.70569 8.62995 3.85303C8.99166 3.28733 9.48995 2.82179 10.0789 2.49931C10.6678 2.17684 11.3285 2.00781 11.9999 2.00781C12.6714 2.00781 13.332 2.17684 13.921 2.49931C14.5099 2.82179 15.0082 3.28733 15.3699 3.85303C16.0281 3.70505 16.713 3.72594 17.3609 3.91374C18.0089 4.10155 18.5988 4.45017 19.0758 4.92718C19.5528 5.40419 19.9014 5.9941 20.0892 6.64203C20.277 7.28996 20.2979 7.97486 20.1499 8.63303C20.7156 8.99474 21.1812 9.49303 21.5037 10.082C21.8261 10.6709 21.9952 11.3316 21.9952 12.003C21.9952 12.6745 21.8261 13.3351 21.5037 13.9241C21.1812 14.513 20.7156 15.0113 20.1499 15.373C20.2973 16.0302 20.2763 16.7139 20.089 17.3608C19.9016 18.0077 19.554 18.5968 19.0782 19.0736C18.6025 19.5503 18.0141 19.8992 17.3676 20.0879C16.7211 20.2766 16.0374 20.299 15.3799 20.153C15.0187 20.7209 14.52 21.1884 13.9301 21.5123C13.3401 21.8363 12.678 22.0061 12.0049 22.0061C11.3319 22.0061 10.6698 21.8363 10.0798 21.5123C9.48987 21.1884 8.99119 20.7209 8.62995 20.153C7.97278 20.3004 7.28905 20.2794 6.64216 20.092C5.99526 19.9047 5.40614 19.557 4.92942 19.0813C4.4527 18.6056 4.10381 18.0172 3.91511 17.3707C3.7264 16.7242 3.70399 16.0405 3.84995 15.383C3.27991 15.0223 2.81036 14.5232 2.485 13.9322C2.15963 13.3413 1.98901 12.6776 1.98901 12.003C1.98901 11.3284 2.15963 10.6648 2.485 10.0738C2.81036 9.48285 3.27991 8.98378 3.84995 8.62303Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
                
              <span
                className={` flex items-center ${!expanded && 'hidden'} ${isDiscountMenuOpen ||
                  (pathname.includes('/discount-portal') &&
                    ' ')
                  } `}
              >
                Discounts
              </span>
            </span>
            <span className={`flex items-center gap-2 ${expanded ? 'justify-between' : 'hidden'}`}>
              {isDiscountMenuOpen ?
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.1665 10H15.8332" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                :
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.1665 9.9974H15.8332M9.99984 4.16406V15.8307" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
            </span>

          </button>
        </div>

        {expanded ? (
          <div className={`relative w-full ml-6 border-l !border-omblue-700 ${isDiscountMenuOpen ? 'max-h-screen' : 'hidden'}`}>
            <div className="transition-all w-full flex flex-col">
              <button
                type="button"
                onClick={() => handleMenuNavigation('/discount-portal')}
                className={cn(
                  ' flex items-center gap-3 rounded pl-4 mx-2  pr-5 py-2 text-base   hover:text-omblue-700 hover:bg-olblue-50',
                  pathname === '/discount-portal'
                    ? 'text-omblue-700  bg-olblue-50 border-omblue-700'
                    : ''
                )}
              >
                View Discounts
              </button>
              {currentUser.isVerified ? (
                <button
                  type="button"
                  onClick={() => handleMenuNavigation('/discount-portal/create')}
                  className={cn(
                    ' flex items-center gap-3 rounded pl-4 mx-2 pr-5 py-2 text-base hover:text-omblue-700 hover:bg-olblue-50',
                    pathname === '/discount-portal/create'
                      ? 'text-omblue-700 bg-olblue-50 border-omblue-700'
                      : ''
                  )}
                >
                  Create Discount
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <SidebarDropdownPanel
            anchor={discountTriggerRef.current}
            visible={isDiscountMenuOpen}
            onMouseEnter={() => handleDiscountHover(true)}
            onMouseLeave={() => handleDiscountHover(false)}
          >
            <div className="w-full flex flex-col">
              <button
                type="button"
                onClick={() => handleMenuNavigation('/discount-portal')}
                className={cn(
                  'w-full flex items-center gap-3 rounded px-2 py-2  font-medium hover:bg-olblue-50 hover:text-omblue-700',
                  pathname === '/discount-portal'
                    ? 'text-omblue-700 bg-lightBlueBg border-omblue-700'
                    : ''
                )}
              >
                View Discount
              </button>
              {currentUser.isVerified ? (
                <button
                  type="button"
                  onClick={() => handleMenuNavigation('/discount-portal/create')}
                  className={cn(
                    'w-full flex items-center gap-3 rounded px-2 py-2  font-medium hover:bg-olblue-50 hover:text-omblue-700',
                    pathname === '/discount-portal/create'
                      ? 'text-omblue-700 bg-lightBlueBg  border-omblue-700'
                      : ''
                  )}
                >
                  Create Discount
                </button>
              ) : null}
            </div>
          </SidebarDropdownPanel>
        )}
      </div>
      );
    }

    if (currentUser?.UserProfileTypeId === 5) {
      return (
      <CustomLink
        url={'/discount-portal/create'}
        text="Discounts"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M14.9999 9.00303L8.99995 15.003M8.99995 9.00303H9.00995M14.9999 15.003H15.0099M3.84995 8.62303C3.70399 7.96555 3.7264 7.28187 3.91511 6.63537C4.10381 5.98886 4.4527 5.40047 4.92942 4.92475C5.40614 4.44903 5.99526 4.10137 6.64216 3.91402C7.28905 3.72667 7.97278 3.70569 8.62995 3.85303C8.99166 3.28733 9.48995 2.82179 10.0789 2.49931C10.6678 2.17684 11.3285 2.00781 11.9999 2.00781C12.6714 2.00781 13.332 2.17684 13.921 2.49931C14.5099 2.82179 15.0082 3.28733 15.3699 3.85303C16.0281 3.70505 16.713 3.72594 17.3609 3.91374C18.0089 4.10155 18.5988 4.45017 19.0758 4.92718C19.5528 5.40419 19.9014 5.9941 20.0892 6.64203C20.277 7.28996 20.2979 7.97486 20.1499 8.63303C20.7156 8.99474 21.1812 9.49303 21.5037 10.082C21.8261 10.6709 21.9952 11.3316 21.9952 12.003C21.9952 12.6745 21.8261 13.3351 21.5037 13.9241C21.1812 14.513 20.7156 15.0113 20.1499 15.373C20.2973 16.0302 20.2763 16.7139 20.089 17.3608C19.9016 18.0077 19.554 18.5968 19.0782 19.0736C18.6025 19.5503 18.0141 19.8992 17.3676 20.0879C16.7211 20.2766 16.0374 20.299 15.3799 20.153C15.0187 20.7209 14.52 21.1884 13.9301 21.5123C13.3401 21.8363 12.678 22.0061 12.0049 22.0061C11.3319 22.0061 10.6698 21.8363 10.0798 21.5123C9.48987 21.1884 8.99119 20.7209 8.62995 20.153C7.97278 20.3004 7.28905 20.2794 6.64216 20.092C5.99526 19.9047 5.40614 19.557 4.92942 19.0813C4.4527 18.6056 4.10381 18.0172 3.91511 17.3707C3.7264 16.7242 3.70399 16.0405 3.84995 15.383C3.27991 15.0223 2.81036 14.5232 2.485 13.9322C2.15963 13.3413 1.98901 12.6776 1.98901 12.003C1.98901 11.3284 2.15963 10.6648 2.485 10.0738C2.81036 9.48285 3.27991 8.98378 3.84995 8.62303Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        }
        expanded={expanded}
      />
      );
    }

    return (
      <CustomLink
        url={'/discount-portal'}
        text="Discounts"
        icon={
          <DiscountPortalIcon
            
          />
        }
        expanded={expanded}
      />
    );
  };

  const renderFundraising = () => {
    const handleFundraisingHover = (open: boolean) => {
      if (!expanded) {
        if (isFundraisingMenuPinned) return;
        setFundraisingMenuOpenSafe(open);
      }
    };

    const menuItems = (
      <div className={cn(expanded ? 'border-l text-base !border-omblue-700 ml-6' : '')}>
        {currentUser?.UserProfileTypeId === 1 && isPremiumMember && currentUser?.isVerified === 1 ? (
          <button
            type="button"
            onClick={() => handleMenuNavigation('/fundraising/create-campaign')}
            className={cn(
              'w-full flex items-center text-base gap-3 hover:bg-olblue-50 hover:text-omblue-700 rounded py-2 font-medium',
              expanded ? 'pl-4 pr-5 ml-2 ' : 'px-2   hover:text-omblue-700 ',
              pathname === '/fundraising/create-campaign'
                ? 'text-omblue-700 bg-olblue-50 border-omblue-700'
                : ''
            )}
          >
            Create Campaign
          </button>
        ) : null}
        {currentUser?.UserProfileTypeId === 1 && isPremiumMember && currentUser?.isVerified === 1 ? (
          <button
            type="button"
            onClick={() => handleMenuNavigation('/fundraising/view-my-campaigns')}
            className={cn(
              'w-full flex items-center text-base hover:text-omblue-700 hover:bg-olblue-50 gap-3 rounded py-2 font-medium',
              expanded ? 'pl-4 pr-5 mx-2 ' : 'px-2  hover:text-omblue-700',
              pathname === '/fundraising/view-my-campaigns'
                ? 'text-omblue-700 bg-olblue-50 border-omblue-700'
                : ''
            )}
          >
            View My Campaigns
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => handleMenuNavigation('/fundraising/view-all-campaigns')}
          className={cn(
            'w-full flex items-center gap-3 hover:bg-olblue-50 hover:text-omblue-700 rounded py-2 font-medium text-base',
            expanded ? 'pl-4 pr-5 mx-2 ' : 'px-2 hover:text-omblue-700',
            pathname === '/fundraising/view-all-campaigns'
              ? 'text-omblue-700 bg-olblue-50  border-omblue-700'
              : ''
          )}
        >
          View All Campaigns
        </button>
      </div>
    );

    return (
      currentUser?.UserProfileTypeId !== 10 && currentUser?.UserProfileTypeId !== 9 && !isTeamUser && (
        <div
          ref={wrapperRef2}
          className={expanded ? 'w-full' : 'w-11 mx-auto'}
          onMouseEnter={() => handleFundraisingHover(true)}
          onMouseLeave={() => handleFundraisingHover(false)}
        >
          <div
            className={` ${isFundraisingMenuOpen && '!py-0  rounded-md'
              } relative overflow-visible menu-container flex flex-col items-start 2xl:text-scaled-h8 font-medium border-l-2 border-transparent group transition-colors hover:bg-olblue-50 hover:text-omblue-700 rounded-md ${expanded ? 'w-full px-3 py-3' : 'w-11 h-11 px-0 py-0 mx-auto items-center justify-center'}`}
          >
            <button
              ref={fundraisingTriggerRef}
              onClick={() => {
                if (!expanded) {
                  setIsFundraisingMenuPinned((prev) => {
                    const next = !prev;
                    setFundraisingMenuOpenSafe(next);
                    return next;
                  });
                  return;
                }
                setIsFundraisingMenuOpen(!isFundraisingMenuOpen);
              }}
              className={`flex items-center ${expanded ? 'gap-2 justify-between w-full text-left' : 'justify-center w-11 h-11 mx-auto'} 2xl:text-scaled-h8 font-medium 
              ${(isFundraisingMenuOpen || pathname.includes('/fundraising')) &&
                '0  !border-omblue-700'
                } ${expanded && isFundraisingMenuOpen ? 'py-3' : ''}`}
            >
              <span className={`flex ${expanded ? 'gap-3' : 'gap-0'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M6 12H6.01M18 12H18.01M4 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span className={`flex items-center ${!expanded && 'hidden'}`}>Fundraising</span>
              </span>
              <span className={`flex items-center gap-2 ${expanded ? 'justify-between' : 'hidden'}`}>
                {isFundraisingMenuOpen ?
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.1665 10H15.8332" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  :
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.1665 9.9974H15.8332M9.99984 4.16406V15.8307" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
              </span>
            </button>
          </div>

          {expanded ? (
            <div className={`relative w- ${isFundraisingMenuOpen ? 'max-h-screen' : 'hidden'}`}>
              <div className="transition-all w-full flex flex-col">
                {menuItems}
              </div>
            </div>
          ) : (
            <SidebarDropdownPanel
              anchor={fundraisingTriggerRef.current}
              visible={isFundraisingMenuOpen}
              onMouseEnter={() => handleFundraisingHover(true)}
              onMouseLeave={() => handleFundraisingHover(false)}
            >
              <div className="w-full flex flex-col">
                {menuItems}
              </div>
            </SidebarDropdownPanel>
          )}
        </div>
      )
    );
  };

  return (
    !pathname.includes('company-profile') && (
      <>
        <aside
          className={cn(
            'fixed z-[9999] shadow-2xl font-sf-400  h-full block transition-all duration-300 bg-white rounded-r-lg ',
            openSidebar && isMobile ? '-translate-x-full' : 'translate-x-0',
            expanded && !isMobile
              ? 'md:w-[248px] 2xl:w-[calc(264px*var(--scale-factor))]'
              : !expanded && !isMobile
                ? 'md:w-[72px] 2xl:w-[calc(72px*var(--scale-factor))]'
                : ''
          )}
        >
          <div className="flex flex-col w-full h-full">
            <div
              onClick={() => {
                if (isMobile) {
                  dispatch(setOpenSidebar());
                  return;
                }
                setExpanded(!expanded);
              }}
              className={`cursor-pointer w-full flex justify-between items-center ${expanded ? 'px-6 py-[18px]' : 'mt-4 relative'}`}
            >
              {!expanded ? (
                <>
                  <div className="flex items-center border-b pb-4 justify-center w-full">
                    <LogoSM className="w-8 h-8 mx-auto " />
                    <div className="absolute left-8 rounded-full bg-white p-2  transform translate-x-1/2">
                      <Expand className='w-6 h-6 mt-2' />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <LogoBW className="w-28 h-8" />
                  <Collapse className="w-7 h-7 md:mt-2" />
                </>
              )}
            </div>
            {/* <hr className={`my-2 ${expanded ? 'mt-2 mb-4' : 'mt-4 mb-4'} `} /> */}

            <div
              className={cn(
                'w-full flex flex-grow-1 flex-col font-medium transition-all text-blue-300 overflow-y-auto overflow-x-visible',
                expanded ? 'items-start px-2' : 'pt-4'
              )}
            >
              {currentUser?.UserProfileTypeId != 10 && currentUser?.UserProfileTypeId != 9 && (
                <>
                  <CustomLink
                    url="/dashboard"
                    icon={
                      <DashboardIcon  />
                    }
                    text="Home"
                    expanded={expanded}
                  />


                  <hr className="w-full my-2 md:my-4" />


                  {/* Growth */}
                  {!isAdminUser && (
                    <CustomLink
                      url={'/business-development'}
                      icon={
                        <BusinessDevelopmentIcon  />
                      }
                      text="Growth"
                      expanded={expanded}
                    />
                  )}

                  {/* Team */}
                  {!isAdminUser && (
                    <CustomLink
                      url={'/cofounder-and-board-matcher'}
                      icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          >
                          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M16 3.128C16.8578 3.35037 17.6174 3.85126 18.1597 4.55206C18.702 5.25286 18.9962 6.11389 18.9962 7C18.9962 7.88611 18.702 8.74714 18.1597 9.44794C17.6174 10.1487 16.8578 10.6496 16 10.872M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      }
                      text="Team"
                      expanded={expanded}
                    />
                  )}

                  {/* {!isAdminUser && (
                    <CustomLink
                      url={'cofounder'}
                      icon={
                        <CofounderIcon  />
                      }
                      text={'Co-Founder'}
                      expanded={expanded}
                    />
                  )} */}
                  {renderDiscountPortal()}
                  {/* Fundraising */}
                  {currentUser?.UserProfileTypeId !== 10 && currentUser?.UserProfileTypeId !== 9 && renderFundraising()}

                  {/* Transactions & Escrow */}
                  {!isAdminUser &&
                    currentUser?.UserProfileTypeId !== 4 &&
                    currentUser?.UserProfileTypeId !== 9 &&
                    currentUser?.UserProfileTypeId !== 10 &&
                    !isTeamUser && (
                      <CustomLink
                        url={'/transactions-and-escrow'}
                        icon={
                          <EscrowIcon  />
                        }
                        text="Transactions"
                        expanded={expanded}
                      />
                    )}
                  {!isTeamUser && currentUser?.UserProfileTypeId !== 9 && currentUser?.UserProfileTypeId !== 10 && (
                    <CustomLink
                      url={'/communities'}
                      icon={
                        <ChatsIcon  />
                      }
                      text="Communities"
                      expanded={expanded}
                    />
                  )}
                  {currentUser?.UserProfileTypeId !== 9 && currentUser?.UserProfileTypeId !== 10 && (
                    <CustomLink
                      url={'/connections'}
                      icon={
                        <FavouritesIcon  />
                      }
                      text="Connections"
                      expanded={expanded}
                    />
                  )}
                  {currentUser?.UserProfileTypeId !== 9 && currentUser?.UserProfileTypeId !== 10 && (
                    <CustomLink
                      url={'/feedback-and-reviews'}
                      icon={
                        <FeedBackIcon  />
                      }
                      text="Reviews"
                      expanded={expanded}
                    />
                  )}
                  {currentUser?.UserProfileTypeId !== 9 && currentUser?.UserProfileTypeId !== 10 && (
                    <CustomLink
                      url={'/leaderboard'}
                      icon={
                        <LeaderboardIcon  />
                      }
                      text="Leaderboard"
                      expanded={expanded}
                    />
                  )}

                  {/* {currentUser?.isVerified == 1 && ( */}

                  {/* )} */}
                </>
              )}
             

              {canAccessAdmin('reports_disputes') && (
                <CustomLink
                  url={'/dispute-page'}
                  icon={
                    <EscrowIcon  />
                  }
                  text="Dispute"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('add_users') && (
                <>
                  <CustomLink
                    url={'/add-user'}
                    icon={
                      <UserIcon  />
                    }
                    text="Add User"
                    expanded={expanded}
                  />

                </>
              )}
              {canAccessAdmin('profile-verification') && (
                <CustomLink
                  url={'/profile-verification'}
                  icon={
                    <VerifyIcon  />
                  }
                  text="User Verification"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('view-profiles') && (


                <CustomLink
                  url={'/view-profiles'}
                  icon={
                    <Menu />
                  }
                  text="User List"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('marketing_feedback') && (
                <CustomLink
                  url={'/marketing-feedback'}
                  icon={
                    <DiscountPortalIcon  />
                  }
                  text="Feedback"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('reports') && (
                <CustomLink
                  url={'/reports'}
                  icon={
                    <BusinessDevelopmentIcon  />
                  }
                  text="Reports"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('calendar_events') && (
                <CustomLink
                  url={'/calendar-events'}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 32 32"
                      fill="none"
                      
                    >
                      <path
                        d="M6.66667 29.3337C5.93333 29.3337 5.30578 29.0728 4.784 28.551C4.26222 28.0292 4.00089 27.4012 4 26.667V8.00033C4 7.26699 4.26133 6.63944 4.784 6.11766C5.30667 5.59588 5.93422 5.33455 6.66667 5.33366H8V2.66699H10.6667V5.33366H21.3333V2.66699H24V5.33366H25.3333C26.0667 5.33366 26.6947 5.59499 27.2173 6.11766C27.74 6.64033 28.0009 7.26788 28 8.00033V14.667H25.3333V13.3337H6.66667V26.667H16V29.3337H6.66667ZM18.6667 29.3337V25.2337L26.0333 17.9003C26.2333 17.7003 26.4556 17.5559 26.7 17.467C26.9444 17.3781 27.1889 17.3337 27.4333 17.3337C27.7 17.3337 27.9556 17.3839 28.2 17.4843C28.4444 17.5848 28.6667 17.7345 28.8667 17.9337L30.1 19.167C30.2778 19.367 30.4169 19.5892 30.5173 19.8337C30.6178 20.0781 30.6676 20.3225 30.6667 20.567C30.6658 20.8114 30.6213 21.0617 30.5333 21.3177C30.4453 21.5737 30.3009 21.8012 30.1 22.0003L22.7667 29.3337H18.6667ZM27.4333 21.867L28.6667 20.567L27.4333 19.3337L26.1667 20.6003L27.4333 21.867Z"
                        fill="#2357c6"
                      ></path>
                    </svg>
                  }
                  text="Calendar"
                  expanded={expanded}
                />
              )}
              {canAccessAdmin('weekly_goals') && (
                <CustomLink
                  url={'/giveaway'}
                  icon={
                    <Menu  />
                  }
                  text="Weekly Giveaway"
                  expanded={expanded}
                />
              )}
              {canAccessAdmin('opportunity_posts') && (
                <CustomLink
                  url={'/opportunity-posts'}
                  icon={
                    <OpportunityPostsIcon  />
                  }
                  text="Opportunities"
                  expanded={expanded}
                />
              )}
              {canAccessAdmin('fundraising_admin') && (
                <CustomLink
                  url={'/fundraising/view-all-fundraisings'}
                  icon={
                    <FundRaisingIcon
                      className={`2xl:w-scaled-4 2xl:h-scaled-4 xs:w-5 xs:h-5`}
                    />
                  }
                  text="Fundraising"
                  expanded={expanded}
                />
              )}
              {canAccessAdmin('resources_management') && (
                <CustomLink
                  url={'/resources-management'}
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.99219 7.78762V17.0091C1.99219 18.3348 2.44778 19.6063 3.25875 20.5437C4.06972 21.4812 5.16963 22.0078 6.31651 22.0078H17.6679C18.8147 22.0078 19.9147 21.4812 20.7256 20.5437C21.5366 19.6063 21.9922 18.3348 21.9922 17.0091V9.89834C21.9922 8.57259 21.5366 7.30114 20.7256 6.36369C19.9147 5.42624 18.8147 4.89959 17.6679 4.89959H11.9922M1.99219 7.78762V5.75688C1.99219 4.76256 2.33389 3.80897 2.94211 3.10589C3.55034 2.4028 4.37527 2.00781 5.23543 2.00781H8.37057C8.72551 2.00774 9.077 2.08848 9.40495 2.24544C9.7329 2.4024 10.0309 2.63249 10.2819 2.92258L11.9922 4.90084L10.2862 6.87285C10.0352 7.16294 9.73723 7.39303 9.40928 7.54999C9.08132 7.70695 8.72984 7.78769 8.37489 7.78762H1.99219Z" stroke="#5B657B" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                  }
                  text="Resources"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('admin_management') && (
                <CustomLink
                  url={'/admin-accounts'}
                  icon={
                    <User2/>
                  }
                  text="Admin"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('community_chats') && (
                <CustomLink
                  url={'/admin-chats'}
                  icon={
                    <ChatsIcon  />
                  }
                  text="Chats"
                  expanded={expanded}
                />
              )}

              {canAccessAdmin('blog_management') && (
                <CustomLink
                  url={'/admin-blogs'}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-text-icon lucide-book-text"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M8 11h8" /><path d="M8 7h6" />
                    </svg>
                  }
                  text="Blogs"
                  expanded={expanded}
                />
              )}

              <hr className="w-full my-2 md:my-4" />
              <h1 className={`text-sm px-4 ${expanded ? '' : 'hidden'}`}>Search</h1>
              <div className="relative w-full">

                <button
                  ref={profileSearchRef}
                  onMouseEnter={() => setProfileSearchHovered(true)}
                  onMouseLeave={() => setProfileSearchHovered(false)}
                  onFocus={() => setProfileSearchHovered(true)}
                  onBlur={() => setProfileSearchHovered(false)}
                  onClick={(e) => {
                    if (
                      (currentUser.isBasicProfileDetailExist &&
                        currentUser.isProfileComplete) ||
                      currentUser.UserProfileTypeId === 10 ||
                      currentUser.UserProfileTypeId === 9
                    ) {
                      setShowProfileSearchModal(true);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 text-h8 2xl:text-scaled-h8 font-medium',
                    expanded ? 'border-l-2 border-transparent' : 'rounded',
                    showProfileSearchModal
                      ? expanded
                        ? 'text-omblue-700 font-semibold border-omblue-700'
                        : 'bg-lightBlueBg text-omblue-700 w-11 mx-auto'
                      : '',
                    expanded ? '' : 'justify-center'
                  )}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path d="M10.3 15H7C5.93913 15 4.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21M21 21L19.1 19.1M14 7C14 9.20914 12.2091 11 10 11C7.79086 11 6 9.20914 6 7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7ZM20 17C20 18.6569 18.6569 20 17 20C15.3431 20 14 18.6569 14 17C14 15.3431 15.3431 14 17 14C18.6569 14 20 15.3431 20 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <span className={`${!expanded && 'hidden'}`}>
                    Profiles
                  </span>
                </button>

                {/* Portal tooltip for Search Profiles */}
                <SidebarTooltip anchor={profileSearchRef.current} visible={!expanded && profileSearchHovered} text="Profiles" />
              </div>

              {showProfileSearchModal && (
                <ProfileSearchModal
                  showModal={showProfileSearchModal}
                  setShowModal={setShowProfileSearchModal}
                />
              )}

              <div className="relative w-full">

                <button
                  ref={postSearchRef}
                  onMouseEnter={() => setPostSearchHovered(true)}
                  onMouseLeave={() => setPostSearchHovered(false)}
                  onFocus={() => setPostSearchHovered(true)}
                  onBlur={() => setPostSearchHovered(false)}
                  onClick={(e) => {
                    if (
                      (currentUser.isBasicProfileDetailExist &&
                        currentUser.isProfileComplete) ||
                      currentUser.UserProfileTypeId === 10 ||
                      currentUser.UserProfileTypeId === 9
                    ) {
                      setShowPostSearchModal(true);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 min-h-11 !text-h8 2xl:!text-scaled-h8 font-medium',
                    expanded ? 'border-l-2 border-transparent' : 'rounded',
                    showPostSearchModal
                      ? expanded
                        ? 'text-omblue-700 font-semibold border-omblue-700'
                        : 'bg-lightBlueBg text-omblue-700 w-11 mx-auto'
                      : '',
                    expanded ? '' : 'justify-center'
                  )}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.3335 20.3257L15.0469 15.0391" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.3334 16.9974C14.0153 16.9974 17.0001 14.0126 17.0001 10.3307C17.0001 6.64883 14.0153 3.66406 10.3334 3.66406C6.65152 3.66406 3.66675 6.64883 3.66675 10.3307C3.66675 14.0126 6.65152 16.9974 10.3334 16.9974Z" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <span
                    className={`${!expanded && 'hidden'
                      } text-h8 2xl:text-scaled-h8`}
                  >
                    Opportunities
                  </span>
                </button>

                {/* Portal tooltip for Opportunities */}
                <SidebarTooltip anchor={postSearchRef.current} visible={!expanded && postSearchHovered} text="Opportunities" />
              </div>
              {showPostSearchModal && (
                <PostSearchModal
                  showModal={showPostSearchModal}
                  setShowModal={setShowPostSearchModal}
                />
              )}

              <CustomLink
                url="/explore"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path d="M16.24 7.76L14.436 13.171C14.3378 13.4656 14.1724 13.7333 13.9528 13.9528C13.7333 14.1724 13.4656 14.3378 13.171 14.436L7.76 16.24L9.564 10.829C9.66218 10.5344 9.82761 10.2667 10.0472 10.0472C10.2667 9.82761 10.5344 9.66218 10.829 9.564L16.24 7.76Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
                text="Explore"
                expanded={expanded}
              />
            </div>
            <hr className={`my-2 md:my-2 ${expanded && 'mx-2'}`} />
            <div className={`${expanded && 'px-2 '}`}>
              {!isTeamUser &&

                <div
                  ref={notificationsRef}
                  onMouseEnter={() => setNotificationsHovered(true)}
                  onMouseLeave={() => setNotificationsHovered(false)}
                  onFocus={() => setNotificationsHovered(true)}
                  onBlur={() => setNotificationsHovered(false)}
                  className={`font-medium text-blue-300 w-full flex items-center ${expanded
                    ? 'justify-start'
                    : 'justify-center relative !w-11 mx-auto'
                    } gap-3 px-3 py-1.5 font-medium  cursor-pointer`}
                  onClick={toggleNotificationBox}
                >
                  <svg className="flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path d="M10.2678 21C10.4433 21.304 10.6958 21.5565 10.9998 21.732C11.3038 21.9075 11.6487 21.9999 11.9998 21.9999C12.3508 21.9999 12.6957 21.9075 12.9997 21.732C13.3037 21.5565 13.5562 21.304 13.7318 21M3.26176 15.326C3.13112 15.4692 3.04491 15.6472 3.01361 15.8385C2.98231 16.0298 3.00728 16.226 3.08546 16.4034C3.16365 16.5807 3.29169 16.7316 3.45401 16.8375C3.61633 16.9434 3.80594 16.9999 3.99976 17H19.9998C20.1936 17.0001 20.3832 16.9438 20.5456 16.8381C20.708 16.7324 20.8363 16.5817 20.9146 16.4045C20.993 16.2273 21.0182 16.0311 20.9872 15.8398C20.9561 15.6485 20.8702 15.4703 20.7398 15.327C19.4098 13.956 17.9998 12.499 17.9998 8C17.9998 6.4087 17.3676 4.88258 16.2424 3.75736C15.1172 2.63214 13.5911 2 11.9998 2C10.4085 2 8.88234 2.63214 7.75712 3.75736C6.6319 4.88258 5.99976 6.4087 5.99976 8C5.99976 12.499 4.58876 13.956 3.26176 15.326Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  {expanded && 'Notifications'}
                  {expanded
                    ? notificationCount?.AllNotificationsCount > 0 && (
                      <NotificationBadge
                        number={notificationCount.AllNotificationsCount}
                        expanded={expanded}
                      />
                    ) : notificationCount?.AllNotificationsCount > 0 && (
                      <NotificationBadge
                        number={notificationCount.AllNotificationsCount}
                        expanded={expanded}
                      />
                    )
                  }
                  
                  {/* Portal tooltip for Notifications */}
                  <SidebarTooltip
                    anchor={notificationsRef.current}
                    visible={!expanded && notificationsHovered} text="Notifications" />
                </div>
              }
              <div className="relative m">
                <div
                  ref={userRef}
                  onMouseEnter={() => setUserHovered(true)}
                  onMouseLeave={() => setUserHovered(false)}
                  onFocus={() => setUserHovered(true)}
                  onBlur={() => setUserHovered(false)}
                  onClick={() => setShowOptions(!showOptions)}
                  className={cn(
                    'mb-2 cursor-pointer',
                    expanded
                      ? 'w-full bg-white border mt-2 border-[#edf3f8] rounded-lg p-2 flex items-center gap-2'
                      : 'flex items-center gap-3 px-3  rounded-md py-3 mb-4 text-h8 2xl:text-scaled-h8 cursor-pointer'
                  )}
                >
                  <Image
                    src={
                      isTeamUser ? 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/fd78e42d-c711-45ba-80d8-5c625be62ab6.PNG' :
                        currentUser?.ProfilePicture ||
                        'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'
                    }
                    alt="user profile"
                    width={expanded ? 200 : 200}
                    height={expanded ? 200 : 200}
                    className={cn(
                      'rounded-full object-cover bg-profile-frame',
                      expanded ? 'w-12 h-12' : 'w-12 h-12 mx-auto'
                    )}
                  />

                  {expanded ? (
                    <div className="flex-1 flex items-center justify-between ">
                      <div className="min-w-0">
                        <p className="text-sm  font-semibold text-omblue-700 truncate">
                          {isTeamUser ? switchTeamData?.teamName : currentUser ? currentUser?.UserName : 'Guest User'}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 ">
                          {getRolesIcon(currentUser?.UserProfileType)}

                          <span className="text-xs truncate">{isTeamUser ? switchTeamData?.teamName : currentUser ? currentUser?.UserProfileType : 'Guest User'}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                          <circle cx="5" cy="12" r="1.5" fill="#9AA3B2" />
                          <circle cx="12" cy="12" r="1.5" fill="#9AA3B2" />
                          <circle cx="19" cy="12" r="1.5" fill="#9AA3B2" />
                        </svg>
                      </div>
                    </div>
                  ) : null}

                  {/* Portal tooltip for user name */}
                  <SidebarTooltip anchor={userRef.current} visible={!expanded && userHovered} text={isTeamUser ? switchTeamData?.teamName : currentUser ? currentUser?.UserName : 'Guest User'} />
                </div>

                <div
                  className={cn(
                    'bg-white shadow-blur border absolute p-1 right-1 rounded-md bottom-10 z-50 text-blue-300',
                    { hidden: !showOptions }
                  )}
                  ref={ref}
                >
                  {currentUser?.UserProfileTypeId != 10 && (
                    <CustomLink
                      url={isTeamUser ? `/settings/teamprofile/${switchTeamData?.teamId}` :
                        !currentUser?.UserProfileDetailsId
                          ? `/profile/new-profile`
                          : `/profile/${add2040ToProfileDetailsId(
                            Number(currentUser?.UserProfileDetailsId)
                          )}`
                      }
                      icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      }
                      text="My Profile"
                      expanded={expanded}
                    />
                  )}

                  <CustomLink
                    url={`/chats`}
                    icon={
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    }
                    text="Messages"
                    expanded={expanded}
                  />

                  <CustomLink
                    url={`/settings`}
                    icon={
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.67082 4.1342C9.72591 3.55454 9.99515 3.01624 10.4259 2.62448C10.8567 2.23271 11.418 2.01562 12.0003 2.01562C12.5826 2.01562 13.1439 2.23271 13.5747 2.62448C14.0055 3.01624 14.2747 3.55454 14.3298 4.1342C14.3629 4.50865 14.4858 4.86962 14.688 5.18654C14.8901 5.50346 15.1657 5.76701 15.4913 5.95488C15.8169 6.14274 16.183 6.2494 16.5585 6.26582C16.9341 6.28224 17.3081 6.20793 17.6488 6.0492C18.1779 5.80898 18.7775 5.77422 19.3308 5.95168C19.8841 6.12915 20.3516 6.50615 20.6423 7.0093C20.933 7.51246 21.0261 8.10577 20.9035 8.67377C20.7808 9.24177 20.4512 9.74381 19.9788 10.0822C19.6712 10.298 19.4201 10.5848 19.2467 10.9182C19.0734 11.2516 18.9829 11.6219 18.9829 11.9977C18.9829 12.3735 19.0734 12.7438 19.2467 13.0772C19.4201 13.4106 19.6712 13.6974 19.9788 13.9132C20.4512 14.2516 20.7808 14.7536 20.9035 15.3216C21.0261 15.8896 20.933 16.4829 20.6423 16.9861C20.3516 17.4892 19.8841 17.8662 19.3308 18.0437C18.7775 18.2212 18.1779 18.1864 17.6488 17.9462C17.3081 17.7875 16.9341 17.7132 16.5585 17.7296C16.183 17.746 15.8169 17.8527 15.4913 18.0405C15.1657 18.2284 14.8901 18.4919 14.688 18.8089C14.4858 19.1258 14.3629 19.4867 14.3298 19.8612C14.2747 20.4409 14.0055 20.9792 13.5747 21.3709C13.1439 21.7627 12.5826 21.9798 12.0003 21.9798C11.418 21.9798 10.8567 21.7627 10.4259 21.3709C9.99515 20.9792 9.72591 20.4409 9.67082 19.8612C9.63776 19.4866 9.51491 19.1255 9.31268 18.8085C9.11045 18.4914 8.83479 18.2278 8.50905 18.0399C8.18331 17.852 7.81708 17.7454 7.4414 17.7291C7.06571 17.7128 6.69162 17.7873 6.35082 17.9462C5.82171 18.1864 5.22214 18.2212 4.66882 18.0437C4.11549 17.8662 3.64799 17.4892 3.3573 16.9861C3.06661 16.4829 2.97353 15.8896 3.09618 15.3216C3.21882 14.7536 3.54842 14.2516 4.02082 13.9132C4.32844 13.6974 4.57955 13.4106 4.7529 13.0772C4.92626 12.7438 5.01677 12.3735 5.01677 11.9977C5.01677 11.6219 4.92626 11.2516 4.7529 10.9182C4.57955 10.5848 4.32844 10.298 4.02082 10.0822C3.54908 9.74364 3.22007 9.24179 3.09772 8.67418C2.97537 8.10657 3.06842 7.51374 3.3588 7.01091C3.64918 6.50808 4.11613 6.13118 4.66891 5.95344C5.22168 5.7757 5.8208 5.80983 6.34982 6.0492C6.69057 6.20793 7.06456 6.28224 7.44012 6.26582C7.81567 6.2494 8.18175 6.14274 8.50735 5.95488C8.83296 5.76701 9.10851 5.50346 9.31068 5.18654C9.51286 4.86962 9.6357 4.50865 9.66882 4.1342M14.9998 11.9982C14.9998 13.6551 13.6567 14.9982 11.9998 14.9982C10.343 14.9982 8.99982 13.6551 8.99982 11.9982C8.99982 10.3413 10.343 8.9982 11.9998 8.9982C13.6567 8.9982 14.9998 10.3413 14.9998 11.9982Z" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    }
                    text="Settings"
                    expanded={expanded}
                  />


                  {!isAdminUser && !isTeamUser && (
                    <CustomLink
                      url={'/verification'}
                      icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                          <path d="M2 20H22M5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      }
                      text="Verification"
                      expanded={expanded}
                    />
                  )}
                  {!isTeamUser ? (
                    <CustomLink
                      url={'/saved-resources'}
                      icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          
                        >
                          <path d="M1.99219 7.78762V17.0091C1.99219 18.3348 2.44778 19.6063 3.25875 20.5437C4.06972 21.4812 5.16963 22.0078 6.31651 22.0078H17.6679C18.8147 22.0078 19.9147 21.4812 20.7256 20.5437C21.5366 19.6063 21.9922 18.3348 21.9922 17.0091V9.89834C21.9922 8.57259 21.5366 7.30114 20.7256 6.36369C19.9147 5.42624 18.8147 4.89959 17.6679 4.89959H11.9922M1.99219 7.78762V5.75688C1.99219 4.76256 2.33389 3.80897 2.94211 3.10589C3.55034 2.4028 4.37527 2.00781 5.23543 2.00781H8.37057C8.72551 2.00774 9.077 2.08848 9.40495 2.24544C9.7329 2.4024 10.0309 2.63249 10.2819 2.92258L11.9922 4.90084L10.2862 6.87285C10.0352 7.16294 9.73723 7.39303 9.40928 7.54999C9.08132 7.70695 8.72984 7.78769 8.37489 7.78762H1.99219Z" stroke="#5B657B" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>

                      }
                      text="Saved Resources"
                      expanded={expanded}
                    />
                  ) : null}
                  {currentUser?.UserProfileTypeId === 10 && (
                    <CustomLink
                      url={'/discount-portal/discount'}
                      icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                          <path d="M15.0002 9.00303L9.00019 15.003M9.00019 9.00303H9.01019M15.0002 15.003H15.0102M3.85019 8.62303C3.70423 7.96555 3.72665 7.28187 3.91535 6.63537C4.10405 5.98886 4.45294 5.40047 4.92966 4.92475C5.40638 4.44903 5.9955 4.10137 6.6424 3.91402C7.2893 3.72667 7.97303 3.70569 8.63019 3.85303C8.9919 3.28733 9.4902 2.82179 10.0791 2.49931C10.6681 2.17684 11.3287 2.00781 12.0002 2.00781C12.6716 2.00781 13.3323 2.17684 13.9212 2.49931C14.5102 2.82179 15.0085 3.28733 15.3702 3.85303C16.0284 3.70505 16.7133 3.72594 17.3612 3.91374C18.0091 4.10155 18.599 4.45017 19.076 4.92718C19.5531 5.40419 19.9017 5.9941 20.0895 6.64203C20.2773 7.28996 20.2982 7.97486 20.1502 8.63303C20.7159 8.99474 21.1814 9.49303 21.5039 10.082C21.8264 10.6709 21.9954 11.3316 21.9954 12.003C21.9954 12.6745 21.8264 13.3351 21.5039 13.9241C21.1814 14.513 20.7159 15.0113 20.1502 15.373C20.2975 16.0302 20.2765 16.7139 20.0892 17.3608C19.9018 18.0077 19.5542 18.5968 19.0785 19.0736C18.6027 19.5503 18.0144 19.8992 17.3679 20.0879C16.7213 20.2766 16.0377 20.299 15.3802 20.153C15.019 20.7209 14.5203 21.1884 13.9303 21.5123C13.3404 21.8363 12.6782 22.0061 12.0052 22.0061C11.3322 22.0061 10.67 21.8363 10.0801 21.5123C9.49011 21.1884 8.99143 20.7209 8.63019 20.153C7.97303 20.3004 7.2893 20.2794 6.6424 20.092C5.9955 19.9047 5.40638 19.557 4.92966 19.0813C4.45294 18.6056 4.10405 18.0172 3.91535 17.3707C3.72665 16.7242 3.70423 16.0405 3.85019 15.383C3.28015 15.0223 2.81061 14.5232 2.48524 13.9322C2.15988 13.3413 1.98926 12.6776 1.98926 12.003C1.98926 11.3284 2.15988 10.6648 2.48524 10.0738C2.81061 9.48285 3.28015 8.98378 3.85019 8.62303Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      }
                      text="Manage Discounts"
                      expanded={expanded}
                    />
                  )}
                  {/* {!isAdminUser  && (
                      <CustomLink
                        url={'/saved-resources'}
                      icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          
                        >
                          <path d="M1.99219 7.78762V17.0091C1.99219 18.3348 2.44778 19.6063 3.25875 20.5437C4.06972 21.4812 5.16963 22.0078 6.31651 22.0078H17.6679C18.8147 22.0078 19.9147 21.4812 20.7256 20.5437C21.5366 19.6063 21.9922 18.3348 21.9922 17.0091V9.89834C21.9922 8.57259 21.5366 7.30114 20.7256 6.36369C19.9147 5.42624 18.8147 4.89959 17.6679 4.89959H11.9922M1.99219 7.78762V5.75688C1.99219 4.76256 2.33389 3.80897 2.94211 3.10589C3.55034 2.4028 4.37527 2.00781 5.23543 2.00781H8.37057C8.72551 2.00774 9.077 2.08848 9.40495 2.24544C9.7329 2.4024 10.0309 2.63249 10.2819 2.92258L11.9922 4.90084L10.2862 6.87285C10.0352 7.16294 9.73723 7.39303 9.40928 7.54999C9.08132 7.70695 8.72984 7.78769 8.37489 7.78762H1.99219Z" stroke="#5B657B" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                        }
                        text="Save Resources"
                        expanded={expanded}
                      />
                    )} */}
                  {!isTeamUser &&
                    <button
                      className="w-full flex flex-nowrap items-center gap-3 px-4 py-3 min-h-11 text-h8 2xl:text-scaled-h8 font-medium hover:bg-olblue-50 transition-colors text-[#5B657B] hover:text-omblue-700 relative"
                      onClick={handleLogout}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 17L21 12M21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>


                      <h1 className={expanded ? 'block leading-tight' : 'hidden'}>
                        Logout
                      </h1>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </aside>

        {isNotificationOpen && (
          <NotificationPanel
            loader={loader}
            notificationList={notificationList}
            onNotificationClick={handleNotificationClick}
            expanded={expanded}
            onAction={handleSubmit}
            boxRef={boxRef}
          />
        )}

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            setBlockedPath(null);
          }}
          blockedPath={blockedPath}
        />

        <ProfileCompletionModal
          visible={showProfileCompletionModal}
          firstName={profileCompletionFirstName}
          onClose={() => setShowProfileCompletionModal(false)}
        />
      </>
    )
  );
};

export default Sidebar;
