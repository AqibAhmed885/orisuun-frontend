'use client';

import EditIcon from '@/icons/edit-icon';
import Share from '@/icons/share';
import StyledTick from '@/icons/verification/styled-tick';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import SocialMediaIcon, { hasSocialMediaAsset } from '@/components/profile/SocialMediaIcon';
import Youtube from '@/icons/socials/youtube';
import X from '@/icons/socials/bluesky';
import Facebook from '@/icons/socials/facebook';
import Instagram from '@/icons/socials/instagram';
import Linkedin from '@/icons/socials/linkedin';
import { cn, getProfileTypeCategory } from '@/utils/utils';
import OverviewTab from '@/components/tabs-section/overview';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Reviews from '@/components/tabs-section/reviews';
import Credentials from '@/components/tabs-section/credentials';
import Fundamentals from '@/components/tabs-section/fundamentals';
import BusinessDevelopmentTab from '@/components/tabs-section/business-development-tab';
import SkillsAndExperience from '@/components/tabs-section/skills-and-experience';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { addCurrentUser, addProfileData, createUser } from '@/data/slices/user-slice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import Add from '@/icons/add';
// import Link from 'next/link';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import StarRatings from 'react-star-ratings';
import Hamburger from '@/icons/sidebar/hamburger';
import MessageIcon from '@/icons/message-icon';
import { checkOnlineStatus } from '@/utils/helper';
import {
    add2040ToProfileDetailsId,
    getOriginalPrivateId,
} from '@/utils/profile.helpers';
import Campaign from '@/components/fundraising/campaign-details';
import Favourite from '@/icons/favourite';
import OverviewIcon from '@/public/icons/profile/overview-icon';
import FundamentalsIcon from '@/public/icons/profile/fundamentals-icon';
import CredentialsIcon from '@/public/icons/profile/credentials-icon';
import ReviewsIcon from '@/public/icons/profile/reviews-icon';
import BusinessDevelopmmentIcon from '@/public/icons/profile/business-development-icon';
import FundraisingIcon from '@/public/icons/profile/fundraising-icon';
import PartnersIcon from '@/icons/profile-types/PartnersIcon';
import Loader from '@/components/ui/loader';
import Modal from '@/components/ui/modal/modal';
import { getLoggedInUserData, getLoggedInUserDataAction } from '@/server-actions/createProfile';
import ProfileShimmer from '../components/ProfileShimmer';
import ProfileSidebarShimmer from '../components/ProfileSidebar';
import TabSectionShimmer from '../components/TabSectionShimmer';
import { chatApi } from '@/app/api/dashboard/chats';
import NotFound from '@/components/not-found';
import { fetchProfileDetails } from '@/app/api/profile-details';

const icons = {
    'Black-owned Business': (
        <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />
    ),
    Expert: <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
    Mentor: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
    Professional: <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
    'Strategy Consultants': (
        <ConsultantIcon className="text-omblue-500 w-5 h-5" />
    ),
    Investor: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
    Advocate: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Partner: <PartnersIcon className="text-omblue-500 w-3 h-3" />,
};

const roleBasedTabs = {
    'Black-owned Business': [
        'overview',
        'fundamentals',
        'credentials',
        'reviews',
        'fundraising-campaign',
        'business-development-opportunities',
    ],
    'Strategy Consultants': [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Expert: [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Advocate: ['overview', 'reviews', 'business-development-opportunities'],
    Professional: [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Investor: [
        'overview',
        'fundamentals',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Mentor: [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    // Add other roles and their corresponding tabs
};

const renderTabContent = (selectedTab: string, CampaignId?: number) => {
    switch (selectedTab) {
        case 'overview':
            return <OverviewTab />;
        case 'credentials':
            return <Credentials />;
        case 'reviews':
            return <Reviews showLimited={true} />;
        case 'fundamentals':
            return <Fundamentals />;
        case 'fundraising-campaign':
            return CampaignId ? (
                <Campaign CampaignId={CampaignId} />
            ) : (
                'No Campaigns Found'
            );
        case 'business-development-opportunities':
            return <BusinessDevelopmentTab />;
        case 'skills-and-experience':
            return <SkillsAndExperience />;
        default:
            return null;
    }
};

interface tab {
    id: string;
    name: string;
    notification: any;
}


const Other = ({ params, searchParams }) => {
    const { profileData } = useSelector((state: RootState) => state.user);
    const [loader, setLoader] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const currentUserId = currentUser?.Id;
    const currentUserName = currentUser?.UserName;
    const teamData = JSON.parse(localStorage.getItem('teamData'));
    const isMobile = useMobileMediaQuery();
    const [isFavourite, setIsFavourite] = useState(false);
    const [favouriteId, setFavouriteId] = useState('');
    const [flagUrls, setFlagUrls] = useState({});
    const router = useRouter();
    const switchTeamData = useSelector((state: RootState) => state.user.teamData);
    

    const userInfo =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const currentUrl = `${window?.location?.origin}/${profileData?.ProfileUrl?.split('orisuun.com/')[1]
        ? profileData?.ProfileUrl?.split('orisuun.com/')[1]
        : profileData?.ProfileUrl
        }`;
    const [ratingDetails, setRatingDetails] = useState({
        Quality: 0,
        Service: 0,
        Cost: 0,
        Willing: 0,
        Review: '',
    });
    const handleShare = () => {
        // Copy the link to the clipboard
        navigator?.clipboard?.writeText(currentUrl).then(() => {
            toast.success('Link copied to clipboard!');
        });
    };
    // Fetch country data for flag URLs
    const fetchCountryData = async (countryName) => {
        try {
            const res = await fetch(
                `https://restcountries.com/v3.1/name/${countryName}`
            );
            const data = await res.json();
            const countryCode = data[0].cca2.toLowerCase();
            return `https://flagcdn.com/w320/${countryCode}.png`;
        } catch (error) {
            console.error('Error fetching flag:', error);
            return null;
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;

            if (hash === '#profile_reviews') {
                setSelectedTab('reviews');
            }
        }
    }, []);

    // Load flags based on profile countries
    const loadFlag = async (CountryName) => {
        const flags = {};

        if (CountryName) {
            const flagUrl = await fetchCountryData(CountryName);
            if (flagUrl) {

                flags[CountryName] = flagUrl;
            }
        }

        return flags; // Return the flag for this one profile
    };

    const ReviewSubmit = async () => {
        // setLoader(true);
        // const values = contractDetails?.escrowContract;
        // const result =
        //   contractDetails?.team?.length > 0 ? contractDetails?.team?.join(',') : '';
        const requestData = {
            ReviewedProfileId: profileData?.Id,
            UserId: (switchTeamData != null && switchTeamData?.isActive) ? switchTeamData.teamId : currentUser?.Id,
            Service: ratingDetails.Service,
            Quality: ratingDetails.Quality,
            Cost: ratingDetails.Cost,
            Refer: ratingDetails.Willing,
            Description: ratingDetails.Review,
            IsTeam: switchTeamData != null && switchTeamData?.isActive
            // UserId: currentUser.Id,
        };
        try {
            const response = await axios.post(
                `${apiEndpoint}/Profile/SaveProfileReview`,
                requestData,
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (response.status === 200) {
                toast.success(response.data.Message);
                // router.push('/transactions-and-escrow')
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message);
            console.error('Error creating campaign:', error);
        }
    };

    useEffect(() => {
        if (profileData) {
            const fetchFlags = async () => {
                const flags = await loadFlag(profileData.CountryOfOriginName);
                setFlagUrls(flags); // Update state with fetched flags
            };
            fetchFlags();
        }
    }, [profileData]);
    const userRole = profileData?.UserProfileType;
    const dispatch = useDispatch();
    const TABS = [
        {
            id: 'overview',
            name: 'Overview',
            notification: 0,
            icon: <OverviewIcon />,
        },
        {
            id: 'fundamentals',
            name: 'Fundamentals',
            notification: 0,
            icon: <FundamentalsIcon />,
        },
        {
            id: 'credentials',
            name: 'Credentials',
            icon: <CredentialsIcon />,
            notification:
                profileData?.AffliationsInformation?.length +
                profileData?.Certificates?.length +
                profileData?.RecognitionInformation?.length,
        },
        {
            id: 'reviews',
            name: 'Reviews',
            notification: profileData?.ReviewList?.length,
            icon: <ReviewsIcon />,
        },
        {
            id: 'business-development-opportunities',
            name: 'Business Development Opportunities',
            notification: profileData?.BdList?.length,
            icon: <BusinessDevelopmmentIcon />,
        },
        {
            id: 'fundraising-campaign',
            name: 'Fundraising Campaign',
            notification: 0,
            icon: <FundraisingIcon />,
        },
        {
            id: 'skills-and-experience',
            name: 'Skills & Experience',
            notification: profileData?.SkillsAndCapabilities?.length,
        },
    ];

    const accessibleTabs = TABS.filter((tab) =>
        roleBasedTabs[userRole]?.includes(tab.id)
    );

    const shouldRanderTab = (tab: tab) => {
        switch (tab.id) {
            case 'overview':
                return true;
            case 'credentials':
                return (
                    profileData.Certificates?.length ||
                    profileData.RecognitionInformation?.length ||
                    profileData.AffliationsInformation?.length
                );
            case 'reviews':
                return profileData.ReviewList?.length;
            case 'fundamentals':
                return (
                    profileData.UserProfileLocations?.length ||
                    profileData.ChannelCategories?.length ||
                    profileData.UserProfileServices?.length ||
                    profileData.ClientBySizes?.length
                );
            case 'fundraising-campaign':
                return !!profileData.CampaignId;
            case 'business-development-opportunities':
                return profileData.BdList?.length;
            case 'skills-and-experience':
                return (
                    profileData.SkillsAndCapabilities?.length ||
                    profileData.ProfileEducations?.length ||
                    profileData.Experiences?.length
                );
            default:
                return false;
        }
    };

    const [selectedTab, setSelectedTab] = useState(TABS[0].id);

    const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL
        ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
        : 'https://api.orisuun.com/api';
    useEffect(() => {
        if (profileData) {
            setIsFavourite(profileData?.IsFavouriteProfile);
            setFavouriteId(profileData?.FavouriteId);
        }
    }, [profileData]);
    const fetchProfileData = useCallback(async () => {
        if (!params.username && !currentUserId) return;

        try {
            const profile = await fetchProfileDetails({
                username: params.username,
                profileId: params.id,
                viewer: currentUserId
                    ? { Id: currentUserId, UserName: currentUserName }
                    : null,
            });
            dispatch(addProfileData(profile));
            setLoader(false);
        } catch (error) {
            setLoader(false);
            console.error('Error fetching profile data:', error);
            if (!params.username) {
                router.push('/profile/new-profile');
            }
            // toast('Failed to load profile data', { type: 'error' });
        }
    }, [currentUserId, currentUserName, dispatch, params.id, params.username, router]);

    useEffect(() => {
        const fetchData = async () => {
            const token =
                typeof window !== 'undefined'
                    ? window.localStorage.getItem('accessToken') ?? ''
                    : '';
            try {
                const result = await getLoggedInUserData(token);
                if (result.success) {
                    localStorage.setItem('accessToken', result.data.Token);
                    localStorage.setItem('RefereshToken', result.data.RefereshToken);
                    dispatch(createUser(result.data));
                    Cookies.set('token', result.data.Token, { path: '/' });
                    Cookies.set('userData', JSON.stringify(result.data), {
                        path: '/',
                    });
                    localStorage.setItem('userData', JSON.stringify(result.data));


                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);



    useEffect(() => {
        fetchProfileData();
        // if (currentUser) {
        // }
    }, [fetchProfileData]);

    const handleChatClick = async () => {
            try {
                // Check if the current user can send a message to this profile user
                const canSend = await chatApi.canSendMessage(currentUser?.Id, profileData?.UserId);
                if (canSend?.CanMessage) { // Adjust based on actual response structure
                    const payload = {
                        UserId: profileData?.UserId,
                        ProfilePicture: profileData?.ProfilePicture,
                        FullName: profileData?.ChatUserName,
                        LastActive: profileData?.LastActive,
                        UserProfileId: profileData?.ProfileDetailId,
                    };
                    localStorage.setItem('chatDetails', JSON.stringify(payload));
                    router.push('/chats');
                    toast.success('Redirecting to chat...');
                } else {
                    toast.error('You cannot send messages to this user based on your chat settings.');
                }
            } catch (error) {
                console.error('Error checking message permissions:', error);
                toast.error('Unable to verify messaging permissions. Please try again.');
            }
        };

    if (loader) {
        return (
            <div className="max-w-[100rem] mx-auto px-4 py-6">
                <div className="mb-6">
                    <ProfileShimmer />
                </div>
                <div className="flex flex-col-reverse lg:flex-row min-h-screen pt-6">
                    <div className="w-full lg:w-[370px] p-4">
                        <ProfileSidebarShimmer />
                    </div>
                    <div className="w-full lg:flex-1 p-4">
                        <TabSectionShimmer />
                    </div>
                </div>
            </div>
        );
    }
    if (!profileData) {
        return (
            <>
            <NotFound />
            </>
        );
    }

    const handleChange = (field, value) => {
        setRatingDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };
    const setFavourite = async (profile) => {
        const payload = {
            [!isFavourite ? 'UserProfileDetailId' : 'Id']: isFavourite
                ? favouriteId
                : profile.Id,
            UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
        };

        try {
            const response = await axios.post(
                !isFavourite
                    ? `${apiEndpoint}/Profile/SetFavouriteProfile`
                    : `${apiEndpoint}/Favourite/UnFavouriteProfile`,
                { ...payload },
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                toast.success(response.data.Message);
                if (response.data.Result) {
                    if (!isFavourite) {
                        setFavouriteId(response.data.Result);
                    }
                    setIsFavourite(!isFavourite);
                }
            }
        } catch (error) {
            console.error('Error updating favourite status:', error);
        }
    };
    const formatSocialUrl = (url: string | undefined): string => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    return (
        <>
            <div className="md:hidden flex items-center justify-between py-4">
                <Hamburger className="hamburger-top-icon" />
                <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
                    Profile
                </p>
                <Image
                    src={
                        currentUser?.ProfilePicture ||
                        'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'
                    }
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full h-8 w-8 me-2"
                />
            </div>
            <div className="hidden lg:flex justify-end items-center w-full p-6">
                {/* <Link
          href={'/'}
          className="flex items-center gap-2 text-sm text-blue-300 font-medium"
        >
          <ChevronRight className="rotate-180 w-4 h-4" />
          Back to profile
        </Link> */}

                <div className="flex col-span-4 md:col-span-2 gap-1.5">
                    {
                        <Button
                            className="!p-0 !min-w-8 min-h-8 !w-auto max-h-8 !max-w-8 text-nav-blue flex items-center justify-center rounded-full border border-omblue-100"
                            variant="ghost"
                            startIcon={<Share className="w-4 h-4" onClick={handleShare} />}
                        />
                    }
                    {profileData.UserId === currentUser.Id && (
                        <Button
                            className="!p-0 !min-w-8 min-h-8 !w-auto max-h-8 !max-w-8 text-nav-blue flex items-center justify-center rounded-full border border-omblue-100"
                            variant="ghost"
                            startIcon={
                                <EditIcon
                                    className="w-4 h-4"
                                    onClick={() =>
                                        router.push(
                                            `/profile/edit-profile/${add2040ToProfileDetailsId(
                                                Number(currentUser?.UserProfileDetailsId)
                                            )}`
                                        )
                                    }
                                />
                            }
                        />
                    )}
                    {profileData.UserId !== currentUser.Id && (
                        <Button
                            className="w-8 h-8 flex items-center justify-center rounded-full border"
                            title="Review"
                            style={{ color: 'white' }}
                            onClick={() => setShowReview(true)}
                        />
                    )}
                </div>
            </div>
            <div className="px-4 py-6 md:p-6 overflow-x-hidden">
                <div className="grid grid-cols-12 gap-10 mb-20">
                    <div className="col-span-12 md:col-span-6">
                        <div className="flex items-start gap-6 mobile:flex-col">
                            <div className="bg-profile-frame p-1 w-20 h-20 md:w-36 md:h-36 rounded-full flex items-center justify-center relative">
                                {/* Image container with proper aspect ratio handling */}
                                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                    <Image
                                        src={profileData?.ProfilePicture || 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'}
                                        alt={profileData?.CompanyName || "Company logo"}
                                        width={isMobile ? 64 : 148}
                                        height={isMobile ? 64 : 148}
                                        className="object-cover w-full h-full max-w-full max-h-full"
                                        style={{
                                            aspectRatio: '1/1', // Ensures perfect square aspect ratio
                                        }}
                                    />
                                </div>

                                {/* Favorite button - unchanged from your working version */}
                                <button
                                    className={`absolute bottom-2 md:bottom-7 -left-1.5 border flex justify-center items-center 
      min-w-[1.75rem] max-w-[1.75rem] min-h-[1.75rem] max-h-[1.75rem] rounded-full 
      ${isFavourite ? 'border-omblue-700' : 'border-[#7FAAE3]'} bg-olblue-50`}
                                    onClick={() => setFavourite(profileData)}
                                >
                                    <Favourite
                                        className={`${isFavourite ? 'text-omblue-700' : 'text-[#7FAAE3]'}`}
                                    />
                                </button>
                            </div>
                            <div className="space-y-1 mt-1 w-[calc(100%-168px)]">
                                <div className="flex items-center gap-2.5">
                                    <h3 className="text-h5 md:text-h3 2xl:text-scaled-h3 font-bold text-black-500 text-wrap capitalize">
                                        {profileData.CompanyName || profileData.Name}
                                    </h3>
                                    <Image
                                        src={
                                            flagUrls[profileData.CountryOfOriginName] ||
                                            'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'
                                        }
                                        alt={profileData.CountryOfOriginName}
                                        title={profileData.CountryOfOriginName}
                                        width={200}
                                        height={200}
                                        className="w-6 h-4 object-cover"
                                    />
                                    <div></div>
                                </div>
                                <p className="text-h7 2xl:text-scaled-h7 font-medium text-blue-300">
                                    {profileData.Tagline || profileData.WorkTitle}
                                </p>
                                <div className="flex items-center gap-2 pt-2">
                                    <div title="Profile">
                                        {profileData.UserProfileType === 'Black-owned Business' ? icons['Black-owned Business'] : icons[profileData.UserProfileType]}
                                    </div>
                                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                                        {profileData.UserProfileType === 'Black-owned Business' ? profileData.BlackOwnershipPercentage == '0%' ? 'Business' : 'Black-owned Business' : profileData.UserProfileType}
                                    </p>
                                </div>
                                {profileData?.ProfileVerified ? (
                                    <div className="flex items-center gap-2 text-[#1A9E78] py-2">
                                        <div title="Profile Status">
                                            <StyledTick className="xs:w-5 xs:h-5 2xl:w-scaled-5 2xl:h-scaled-5" />
                                        </div>
                                        <p className="text-h9 2xl:text-scaled-h9 font-medium">
                                            Verified
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-[#E88206] flex items-center gap-2 py-1">
                                        <div className="p-0.5 flex items-center justify-center rounded-full bg-[#E88206] text-white">
                                            <div title="Profile Status">
                                                <Add className="rotate-45 w-5 h-5" />
                                            </div>
                                        </div>
                                        <p className="text-h9 2xl:text-scaled-h9 font-medium">
                                            Not Verified
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 flex-wrap small-767:fixed small-767:bottom-0 small-767:left-0 small-767:bg-white small-767:w-full small-767:flex-nowrap small-767:gap-2 small-767:p-3 small-767:border-t small-767:flex-row-reverse">
                                    {profileData.UserId !== currentUser.Id &&
                                        profileData.IsAccountCreated &&
                                        profileData?.UserProfileTypeId !== 4 &&
                                        currentUser?.UserProfileTypeId !== 10 && (
                                            <Button
                                                className="min-w-1/2 m-0 max-w-1/2 px-4 py-3.5 h-[50px] btn-secondary text-h9 2xl:text-scaled-h9 md:min-w-[50px] w-1/2"
                                                title="Start a contract"
                                                style={{ color: 'white' }}
                                                onClick={() => {
                                                    router.push(
                                                        '/transactions-and-escrow/contract/new-contract'
                                                    );
                                                    localStorage.setItem(
                                                        'expert',
                                                        JSON.stringify([profileData.UserId])
                                                    );
                                                }}
                                            />
                                        )}
                                    {profileData.UserId !== currentUser.Id && (
                                        <button
                                            className="min-w-1/2 md:min-w-[50px] flex max-w-1/2 items-center justify-center small-767:w-[50%] border border-omblue-100 text-omblue-800 rounded-md gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 relative"
                                            onClick={handleChatClick}
                                        >
                                            <div className="absolute top-1 left-1">
                                                {checkOnlineStatus(profileData.LastActive) ===
                                                    'online' ? (
                                                    <div className="bg-green-500 rounded-full w-3 h-3 text-green-600 inline-block font-semibold">
                                                        {/* <p>Active</p> */}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-500 rounded-full w-3 h-3 text-white inline-block font-semibold">
                                                        {/* <p>{checkOnlineStatus(profileData.LastActive)}</p> */}
                                                    </div>
                                                )}
                                            </div>
                                            <MessageIcon className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4 ml-2" />
                                            <p className="flex">Chat</p>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 space-y-4">
                        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
                            About {profileData.CompanyName || profileData.Name}
                        </h6>
                        <div className="text-black-300 text-h8 2xl:text-scaled-h8 font-medium space-y-4">
                            <p className="">
                                {profileData.AboutCompany || profileData.AboutYou}
                            </p>
                            <ul className="list-disc space-y-1 ps-6">
                                {profileData.CompanyDetails &&
                                    profileData.CompanyDetails?.map(
                                        (detail: { CompanyDetails: string }, index: number) => (
                                            <li key={index}>{detail?.CompanyDetails}</li>
                                        )
                                    )}
                                {profileData.AdditionalAboutYou &&
                                    profileData.AdditionalAboutYou?.map(
                                        (detail: string, index: number) => (
                                            <li key={index}>{detail}</li>
                                        )
                                    )}
                                {profileData.UserAdditionalAboutYouDetails &&
                                    profileData.UserAdditionalAboutYouDetails?.map(
                                        (detail: any, index: number) => (
                                            <li key={index}>{detail.AboutYouDetail}</li>
                                        )
                                    )}
                            </ul>
                        </div>
                        <div className="flex items-center gap-4">
                            {profileData.SocialMediaUrls &&
                                profileData.SocialMediaUrls?.map(
                                    (
                                        social: { LinkType: string; SocialMediaUrl?: string },
                                        index: number
                                    ) => {
                                        const type = social.LinkType;
                                        const formattedUrl = formatSocialUrl(social.SocialMediaUrl);

                                        if (hasSocialMediaAsset(type)) {
                                            return (
                                                <Link
                                                    key={index}
                                                    href={formattedUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`Visit ${type} profile`}
                                                >
                                                    <SocialMediaIcon platform={type} />
                                                </Link>
                                            );
                                        }

                                        switch (type) {
                                            case 'YouTube':
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={formattedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Youtube />
                                                    </Link>
                                                );
                                            case 'FaceBook':
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={formattedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Facebook />
                                                    </Link>
                                                );
                                            case 'LinkedIn':
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={formattedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Linkedin />
                                                    </Link>
                                                );
                                            case 'BlueSky':
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={formattedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <X className="rounded-full w-8 h-8" />
                                                    </Link>
                                                );
                                            case 'Instagram':
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={formattedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Instagram />
                                                    </Link>
                                                );
                                            default:
                                                return null;
                                        }
                                    }
                                )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5 overflow-x-auto hide-scrollbar mb-10">
                    {accessibleTabs?.map(
                        (tab) =>
                            shouldRanderTab(tab) && (
                                <div
                                    key={tab.id}
                                    className={cn(
                                        'py-3 border-b-2 text-sm 2xl:text-scaled-h8 flex items-center gap-2 cursor-pointer',
                                        selectedTab === tab.id
                                            ? 'border-omblue-600 text-omblue-600 font-semibold'
                                            : 'border-transparent text-[#797B82] font-medium'
                                    )}
                                    style={{
                                        fontVariationSettings:
                                            selectedTab === tab.id ? "'wght' 600" : "'wght' 500",
                                        textRendering: 'optimizeLegibility',
                                    }}
                                    onClick={() => setSelectedTab(tab.id)}
                                >
                                    {tab.icon}
                                    <p className="w-max">{tab.name}</p>
                                    {/* {tab.notification > 0 && (
                    <p className="bg-[#F3F4F7] rounded-full text-blue-400 w-5 h-5 p-2 flex items-center justify-between text-h10 2xl:text-scaled-h10">
                      {tab.notification}
                    </p>
                  )} */}
                                </div>
                            )
                    )}
                </div>
                {renderTabContent(selectedTab, profileData?.CampaignId)}
                <Modal
                    showModal={showReview}
                    setShowModal={setShowReview}
                    title={`Write a review for ${profileData?.CompanyName}`}
                >
                    <div className="mb-4">
                        <div className="flex flex-wrap justify-between items-center gap-4 text-omblue-500 ">
                            <div className="w-[45%] mb-2">
                                <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                                    Quality
                                </p>
                                <StarRatings
                                    starDimension={'40px'}
                                    rating={ratingDetails?.Quality}
                                    starRatedColor="#69B3E7"
                                    changeRating={(value) => handleChange('Quality', value)}
                                    numberOfStars={5}
                                    name="rate"
                                    starSpacing="5px"
                                    starEmptyColor="#D1E7F8"
                                    starHoverColor="#69B3E7"
                                />
                            </div>
                            <div className="w-[45%] mb-2">
                                <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                                    Service
                                </p>
                                <StarRatings
                                    starDimension={'40px'}
                                    rating={ratingDetails?.Service}
                                    starRatedColor="#69B3E7"
                                    changeRating={(value) => handleChange('Service', value)}
                                    numberOfStars={5}
                                    name="Service"
                                    starSpacing="5px"
                                    starEmptyColor="#D1E7F8"
                                    starHoverColor="#69B3E7"
                                />
                            </div>
                            <div className="w-[45%] mb-2">
                                <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                                    Cost
                                </p>
                                <StarRatings
                                    starDimension={'40px'}
                                    rating={ratingDetails?.Cost}
                                    starRatedColor="#69B3E7"
                                    changeRating={(value) => handleChange('Cost', value)}
                                    numberOfStars={5}
                                    name="Cost"
                                    starSpacing="5px"
                                    starEmptyColor="#D1E7F8"
                                    // svgIconPath="M29.1572 11.0578C29.0008 10.576 28.583 10.224 28.0817 10.1511L19.8683 8.95825L16.1955 1.5147C15.7475 0.604476 14.2523 0.604476 13.8043 1.5147L10.1315 8.95648L1.91813 10.1494C1.41679 10.2223 0.999014 10.5743 0.84257 11.056C0.686125 11.5378 0.815903 12.0694 1.18035 12.4231L7.12346 18.2151L5.71901 26.3947C5.63368 26.896 5.83813 27.4009 6.24879 27.6996C6.65946 27.9965 7.20524 28.0356 7.65324 27.8009L14.999 23.9378L22.3448 27.8009C22.5403 27.904 22.7519 27.9538 22.9652 27.9538C23.2408 27.9538 23.5163 27.8685 23.7492 27.6996C24.1599 27.4009 24.3661 26.896 24.279 26.3947L22.8746 18.2151L28.8177 12.4231C29.1821 12.0694 29.3119 11.5378 29.1555 11.056L29.1572 11.0578Z"
                                    starHoverColor="#69B3E7"
                                />
                            </div>
                            <div className="w-[45%] mb-2">
                                <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                                    Willing For Refer
                                </p>
                                <StarRatings
                                    starDimension={'40px'}
                                    rating={ratingDetails?.Willing}
                                    starRatedColor="#69B3E7"
                                    changeRating={(value) => handleChange('Willing', value)}
                                    numberOfStars={5}
                                    name="Willing"
                                    starSpacing="5px"
                                    starEmptyColor="#D1E7F8"
                                    starHoverColor="#69B3E7"
                                />
                            </div>
                        </div>
                        <p className="text-h8 2xl:text-scaled-h8 font-semibold to-black-500 mb-2 mt-6">
                            Your Review:
                        </p>
                        <textarea
                            rows={4}
                            placeholder="Write your message here....."
                            onChange={(e) => handleChange('Review', e.target.value)}
                            value={ratingDetails?.Review}
                            className="resize-none border border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
                        />
                        <p className="text-gray-500 text-h10 2xl:text-scaled-h10 font-semibold my-2">
                            Maximum 250 words
                        </p>

                        <div className="flex justify-end items-center gap-2 pt-3">
                            <button
                                onClick={() => setShowReview(false)}
                                className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // setEndContract(!endContract);
                                    ReviewSubmit();
                                    setShowReview(false);
                                }}
                                className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
                            >
                                Write a review
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Other;
