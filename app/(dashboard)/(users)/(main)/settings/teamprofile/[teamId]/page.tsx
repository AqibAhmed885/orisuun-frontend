'use client';
import { useParams, useRouter } from 'next/navigation';
import StyledTick from '@/icons/verification/styled-tick';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Youtube from '@/icons/socials/youtube';
import X from '@/icons/socials/x';
import Facebook from '@/icons/socials/facebook';
import Instagram from '@/icons/socials/instagram';
import Linkedin from '@/icons/socials/linkedin';
import { apiEndpoint, cn } from '@/utils/utils';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import Add from '@/icons/add';
import Link from 'next/link';
import OverviewIcon from '@/public/icons/profile/overview-icon';
import FundamentalsIcon from '@/public/icons/profile/fundamentals-icon';
import CredentialsIcon from '@/public/icons/profile/credentials-icon';
import ReviewsIcon from '@/public/icons/profile/reviews-icon';
import BusinessDevelopmmentIcon from '@/public/icons/profile/business-development-icon';
import FundraisingIcon from '@/public/icons/profile/fundraising-icon';
import EditIcon from '@/icons/edit-icon';
import Button from '@/components/ui/button';
import Share from '@/icons/share';
import { settings } from '@/app/api/dashboard/settings';
import { toast } from 'react-toastify';
import StarRating from '../../components/StarRatting'
import BlueSky from '@/icons/socials/bluesky';
// import { loadStripe } from '@stripe/stripe-js';
import Loader from '@/components/ui/loader';
import axios from 'axios';
import Modal from '@/components/ui/modal/modal';
import StarRatings from 'react-star-ratings';
import TeamReviewModal from '../../components/TeamReviewModal';
import TeamReviews from '../../components/TeamReviews';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import TabSection from './TabSection'
import { getOriginalPrivateId } from '@/utils/profile.helpers';
import { checkOnlineStatus } from '@/utils/helper';
import { favouriteService } from '@/app/api/dashboard/favourites';
// Profile type mapping
const profileTypeMap = {
    1: 'Black-owned Businesses',
    2: 'Consultant',
    3: 'Expert',
    4: 'Advocate',
    5: 'Professional',
    6: 'Investor',
    7: 'Mentor'
};

const icons = {
    'Black-owned Businesses': <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />,
    'Consultant': <ConsultantIcon className="text-omblue-500 w-5 h-5" />,
    'Expert': <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
    'Advocate': <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    'Professional': <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
    'Investor': <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
    'Mentor': <MentorsIcon className="text-omblue-500 w-5 h-5" />,
};

const roleBasedTabs = {
    'Black-owned Businesses': [
        'overview',
        'fundamentals',
        'credentials',
        'reviews',
        'fundraising-campaign',
    ],
    'Consultant': [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
    ],
    'Expert': [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
    ],
    'Advocate': ['overview', 'reviews'],
    'Professional': [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
    ],
    'Investor': ['overview', 'fundamentals', 'credentials', 'reviews'],
    'Mentor': [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
    ],
};



export default function TeamProfilePage() {
    const router = useRouter();
    const params = useParams();
    const teamId = params.teamId;
    const isMobile = useMobileMediaQuery();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    //team review
    const [showReview, setShowReview] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showUsersReviews, setShowUsersReviews] = useState(false)
    const teamData = useSelector((state: RootState) => state.user.teamData);
    const [flagUrl, setFlagUrl] = useState<string | null>(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [ratingDetails, setRatingDetails] = useState({
        Quality: 0,
        Service: 0,
        Cost: 0,
        Willing: 0,
        Review: '',
    });

    useEffect(() => {
        const fetchFlag = async () => {
            if (!profileData?.CountryName) return;

            try {
                const res = await fetch(
                    `https://restcountries.com/v3.1/name/${profileData.CountryName}`
                );
                const data = await res.json();
                const countryCode = data[0]?.cca2?.toLowerCase();
                if (countryCode) {
                    setFlagUrl(`https://flagcdn.com/w40/${countryCode}.png`);
                }
            } catch (error) {
                console.error('Error fetching flag:', error);
            }
        };

        fetchFlag();
    }, [profileData?.CountryName]);
    useEffect(() => {
        const shouldShowReviews = localStorage.getItem('review');
        if (shouldShowReviews) {
            setSelectedTab('reviews');
            setShowUsersReviews(true);
            localStorage.removeItem('review');
        }

    }, []);
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    // const stripePromise = loadStripe(
    //     (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
    // );


    async function GetFavoriteInformation() {
        try {
            const teamsList = await favouriteService.getTeamList({
                userId: currentUser?.Id,
                isTeam: false
            });
            const isFav = teamsList.Result.some(team => team.TeamId == teamId);
            setIsFavourite(isFav);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    }
    const fetchTeamReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await settings.getTeamReviews(String(teamId));
            if (response.data.StatusCode === 200) {
                setReviews(response.data.Result);
            }
        } catch (error) {
            toast.error('Failed to fetch team reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    // Call this in useEffect when teamId changes
    useEffect(() => {
        if (teamId) {
            fetchTeamReviews();
            GetFavoriteInformation();
        }
    }, [teamId]);

    const ReviewSubmit = async () => {
        const requestData = {
            TeamId: profileData?.TeamId,
            UserId: teamData?.isActive ? teamData?.teamId : currentUser?.Id,
            ServiceRating: ratingDetails.Service,
            QualityRating: ratingDetails.Quality,
            CostRating: ratingDetails.Cost,
            ReferRating: ratingDetails.Willing,
            Review: ratingDetails.Review,
        };

        try {
            const response = await settings.submitTeamReview(requestData);

            if (response.data?.StatusCode === 200) {
                toast.success("Review submitted successfully");
                setRatingDetails({
                    Quality: 0,
                    Service: 0,
                    Cost: 0,
                    Willing: 0,
                    Review: '',
                });
            } else {
                toast.error(response.data?.Message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || 'Failed to submit review');
        }
    };


    // Fetch team profile data
    useEffect(() => {
        const fetchTeamProfile = async () => {
            try {
                const response = await settings.GetTeamProfile(teamId);
                if (response.status === 200) {
                    const data = response.data.Result;
                    setProfileData({
                        ...data,
                        UserProfileType: profileTypeMap[data.ProfileType1] || 'Professional',
                        ProfileVerified: data.IsVerified,
                        AboutCompany: data.About,
                        CompanyDetails: data.About ? [data.About] : [],
                        SocialMediaUrls: [

                            { LinkType: 'YouTube', SocialMediaUrl: data.YoutubeLink },
                            { LinkType: 'BlueSky', SocialMediaUrl: data.BlueSkyLink },
                            { LinkType: 'Facebook', SocialMediaUrl: data.FacebookLink },
                            { LinkType: 'Instagram', SocialMediaUrl: data.InstagramLink },
                            { LinkType: 'LinkedIn', SocialMediaUrl: data.LinkedInLink },
                        ].filter(social => social.SocialMediaUrl)
                    });
                    setIsFavourite(data.IsFavourite);

                }
            } catch (error) {
                toast.error('Failed to fetch team profile');
                console.error('Error fetching team profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (teamId) {
            fetchTeamProfile();
        }
    }, [teamId]);

    if (loading) {
        return <Loader />;
    }

    if (!profileData) {
        return <div className="flex justify-center items-center h-screen">Team not found</div>;
    }
    const handleFavorite = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Favourite/SetRemoveFavoriteTeam?userId=${(teamData && teamData?.isActive ? teamData.teamId : currentUser.Id)}&teamId=${profileData.TeamId}`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'XApiKey': process.env.NEXT_PUBLIC_API_KEY
                    }
                }
            );
            if (response.data.StatusCode == 200) {
                toast.success(!isFavourite ? 'Added to favorites' : 'Removed from favorites');
                setIsFavourite(prev => !prev);
            } else {
                throw new Error(response.data?.Message || 'Failed to update favorite status');
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            toast.error(error.message);
        }
    };

    const userRole = profileData.UserProfileType;

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
            notification: 0, // Update if you have credential data
        },
        {
            id: 'reviews',
            name: 'Reviews',
            notification: profileData.TotalRatings || 0,
            icon: <ReviewsIcon />,
        },
        {
            id: 'business-development-opportunities',
            name: 'Business Development Opportunities',
            notification: 0, // Update if you have BD data
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
            notification: 0, // Update if you have skills data
        },
    ];

    const accessibleTabs = TABS.filter((tab) =>
        roleBasedTabs[userRole]?.includes(tab.id)
    );

    const handleTabSelect = (id) => {
        setSelectedTab(id); // This is the key line you're missing
        if (id === "reviews") {
            setShowUsersReviews(true);
        } else {
            setShowUsersReviews(false);
        }
    }

    const isTeamMember = profileData.MemberDetails.find(u => u.UserId == currentUser.Id);



    return (
        <div className='p-7'>
            {/* Main container */}
            <div className="max-w-full mx-auto relative">
                {/* Banner Section */}
                <div className="w-full bg-gray-100 border-2 sm:rounded-t-2xl border-[#F9FAFB] h-[30vh] md:aspect-[3200/560] relative overflow-visible">
                    <div className="border rounded-t-2xl absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-300">
                        {profileData?.BannerImage ? (
                            <Image
                                src={profileData?.BannerImage}
                                alt="Banner"
                                className="w-full h-full object-cover sm:rounded-t-2xl"
                                width={3200}
                                height={410}
                            />
                        ) : (
                            <div className="absolute inset-0 border flex flex-col items-center justify-center text-gray-500 bg-gray-300">
                                {profileData.TeamAdminId == currentUser.Id && (
                                    <>
                                        <p className="text-xl mb-1 font-semibold text-[#1D2939]">Upload Banner Image</p>
                                        <p className="text-lg mb-3">Optimal dimensions: 3200 x 410px</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Share Button */}
                    <button
                        className="absolute flex bg-white py-[7px] px-[10px] rounded right-4 top-4 text-blue-600 hover:text-blue-700"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                                .then(() => toast.success('Link copied to clipboard!'))
                                .catch((err) => {
                                    console.error('Failed to copy URL: ', err);
                                    toast.error('Failed to copy link');
                                });
                        }}
                    >
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                            <path d="M6.15833 11.2587L11.85 14.5753M11.8417 5.42533L6.15833 8.74199M16.5 4.16699C16.5 5.5477 15.3807 6.66699 14 6.66699C12.6193 6.66699 11.5 5.5477 11.5 4.16699C11.5 2.78628 12.6193 1.66699 14 1.66699C15.3807 1.66699 16.5 2.78628 16.5 4.16699ZM6.5 10.0003C6.5 11.381 5.38071 12.5003 4 12.5003C2.61929 12.5003 1.5 11.381 1.5 10.0003C1.5 8.61961 2.61929 7.50033 4 7.50033C5.38071 7.50033 6.5 8.61961 6.5 10.0003ZM16.5 15.8337C16.5 17.2144 15.3807 18.3337 14 18.3337C12.6193 18.3337 11.5 17.2144 11.5 15.8337C11.5 14.4529 12.6193 13.3337 14 13.3337C15.3807 13.3337 16.5 14.4529 16.5 15.8337Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="ml-2 text-sm font-semibold">Share</span>
                    </button>
                </div>

                {/* SVG Profile Section Overlapping the Banner */}

                <svg viewBox="0 0 364 233" fill="none" className='relative z-10 -mt-[7rem]  xl:-mt-[12vh] px-5  h-[24vh] w-[40vh]'>
                    <defs>
                        <clipPath id="bgblur_0_9_27_clip_path" transform="translate(5.73538 5.73538)">
                            <rect width="364" height="233" rx="13" />
                        </clipPath>
                        <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="364" height="233">
                            <image
                                href={profileData?.ProfileImage || 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/9adc394a-91d9-4888-a38b-c6f6b6da9365.png'}
                                x="0"
                                y="0"
                                width="364"
                                height="233"
                                preserveAspectRatio="xMidYMid slice"
                            />
                        </pattern>
                    </defs>

                    <foreignObject
                        x="-5.73538"
                        y="-5.73538"
                        width="375.471"
                        height="244.471"
                    >
                        <div
                            style={{
                                backdropFilter: 'blur(2.87px)',
                                clipPath: 'url(#bgblur_0_9_27_clip_path)',
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </foreignObject>

                    <g data-figma-bg-blur-radius="5.73538">
                        <rect width="364" height="233" rx="13" fill="white" fillOpacity="0.2" />
                        <rect
                            x="8.56615"
                            y="6.06615"
                            width="346.868"
                            height="220.868"
                            rx="21.4338"
                            fill="url(#imagePattern)"
                        />
                        <rect
                            x="8.56615"
                            y="6.06615"
                            width="346.868"
                            height="220.868"
                            rx="21.4338"
                            stroke="white"
                            strokeWidth="2.86769"
                        />
                    </g>
                    {checkOnlineStatus(profileData.LastActive) === 'online' ? (
                        <g transform="translate(340, 210)">
                            <rect x="0" y="0" width="20" height="40" rx="12.5781" fill="#17B26A" />
                            <rect x="0" y="0" width="20" height="40" rx="12.5781" stroke="white" strokeWidth="2.15625" />
                        </g>
                    ) : (
                        <g transform="translate(340, 210)">
                            <rect x="0" y="0" width="20" height="20" rx="12.5781" fill="#6B7280" />
                            <rect x="0" y="0" width="20" height="20" rx="12.5781" stroke="white" strokeWidth="2.15625" />
                        </g>
                    )}
                </svg>

            </div>


            <div className="p-6 relative  bg-white">

                {/* Header */}
                <div className="flex-col justify-between items-start">
                    <div className='flex justify-between'>
                        <h1 className="text-xl sm:text-2xl flex items-center gap-1 font-semibold my-2 -mt-2">{profileData?.TeamName || 'Unnamed team'} {profileData.ProfileVerified ? (
                            <span className=" text-[#1A9E78]">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1141_238811)">
                                        <path d="M15.4442 4.04062C15.6342 4.50002 15.9988 4.86517 16.4579 5.05581L18.0678 5.72264C18.5272 5.91294 18.8922 6.27796 19.0825 6.73738C19.2728 7.19681 19.2728 7.71302 19.0825 8.17245L18.4162 9.78115C18.2258 10.2408 18.2255 10.7575 18.4168 11.2169L19.082 12.8251C19.1763 13.0527 19.2249 13.2966 19.2249 13.5429C19.225 13.7893 19.1765 14.0332 19.0822 14.2608C18.9879 14.4883 18.8497 14.6951 18.6755 14.8693C18.5013 15.0434 18.2945 15.1815 18.0669 15.2757L16.4582 15.9421C15.9988 16.132 15.6336 16.4966 15.443 16.9558L14.7762 18.5656C14.5859 19.025 14.2209 19.3901 13.7614 19.5804C13.302 19.7707 12.7858 19.7707 12.3264 19.5804L10.7177 18.914C10.2582 18.7242 9.7422 18.7246 9.28304 18.9151L7.67318 19.581C7.21401 19.7708 6.69825 19.7707 6.2392 19.5805C5.78014 19.3904 5.41533 19.0258 5.2249 18.5668L4.55788 16.9565C4.36793 16.4971 4.00332 16.132 3.54421 15.9413L1.93435 15.2745C1.47513 15.0843 1.11022 14.7195 0.919849 14.2603C0.729477 13.8012 0.729219 13.2852 0.919131 12.8258L1.58548 11.2171C1.77531 10.7577 1.77492 10.2417 1.5844 9.78252L0.91901 8.1715C0.824671 7.94395 0.776094 7.70005 0.776054 7.45372C0.776015 7.20739 0.824513 6.96346 0.91878 6.73588C1.01305 6.50831 1.15123 6.30153 1.32544 6.12738C1.49965 5.95322 1.70647 5.8151 1.93408 5.72091L3.54278 5.05456C4.00178 4.86478 4.36671 4.50063 4.55749 4.04205L5.22432 2.43219C5.41462 1.97277 5.77964 1.60775 6.23906 1.41745C6.69849 1.22715 7.2147 1.22715 7.67413 1.41745L9.28283 2.0838C9.74227 2.27363 10.2583 2.27324 10.7174 2.08272L12.328 1.41848C12.7874 1.22829 13.3034 1.22833 13.7628 1.41859C14.2221 1.60886 14.5871 1.97377 14.7774 2.43307L15.4444 4.04341L15.4442 4.04062Z" fill="url(#paint0_linear_1141_238811)" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9166 7.87925C14.0502 7.6694 14.0949 7.41507 14.041 7.17221C13.9871 6.92935 13.8389 6.71785 13.6291 6.58425C13.4192 6.45065 13.1649 6.40588 12.922 6.4598C12.6792 6.51372 12.4677 6.6619 12.3341 6.87175L8.66283 12.6405L6.98283 10.5405C6.82751 10.3462 6.60138 10.2216 6.35418 10.1941C6.10699 10.1665 5.85897 10.2383 5.6647 10.3936C5.47043 10.5489 5.34582 10.7751 5.31827 11.0223C5.29073 11.2695 5.36251 11.5175 5.51783 11.7118L8.01783 14.8368C8.111 14.9534 8.23066 15.046 8.36687 15.1071C8.50308 15.1681 8.65189 15.1957 8.80094 15.1877C8.94998 15.1796 9.09494 15.1361 9.22376 15.0607C9.35258 14.9853 9.46154 14.8802 9.54158 14.7543L13.9166 7.87925Z" fill="white" />
                                    </g>
                                    <defs>
                                        <linearGradient id="paint0_linear_1141_238811" x1="13.7616" y1="1.41811" x2="6.23862" y2="19.5803" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#1594FF" />
                                            <stop offset="1" stop-color="#0BC1A5" />
                                        </linearGradient>
                                        <clipPath id="clip0_1141_238811">
                                            <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg>

                            </span>
                        ) : (
                            <span className="text-[#E88206]">
                                <div className=" flex items-center justify-center rounded-full bg-[#E88206] text-white">
                                    <Add className="rotate-45 w-5 h-5" />
                                </div>

                            </span>
                        )}</h1>
                        <div className="flex ">

                            {
                                profileData.TeamAdminId == currentUser.Id && (
                                    // <Button
                                    //     className="!p-0 !min-w-8 min-h-8 !w-auto max-h-8 !max-w-8 text-nav-blue flex items-center justify-center rounded-full border border-omblue-100"
                                    //     variant="ghost"
                                    //     onClick={() => router.push(`/settings/edit-team-profile/${teamId}`)}
                                    //     startIcon={<EditIcon className="w-4 h-4" />}
                                    // />
                                    <>
                                        {
                                            profileData.TeamAdminId == currentUser.Id ? (
                                                <button
                                                    onClick={() => router.push(`/settings/edit-team-profile/${teamId}`)
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#2357C6] font-semibold text-white rounded-md hover:bg-[#658ce0] transition-colors"
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 20 21"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M17.5002 17.999H10.8335M2.0835 18.4156L6.70789 16.637C7.00367 16.5232 7.15156 16.4664 7.28993 16.3921C7.41283 16.3261 7.53 16.25 7.6402 16.1645C7.76426 16.0682 7.87631 15.9561 8.1004 15.7321L17.5002 6.33228C18.4207 5.41181 18.4207 3.91943 17.5002 2.99895C16.5797 2.07848 15.0873 2.07847 14.1669 2.99895L4.76706 12.3987C4.54298 12.6228 4.43093 12.7348 4.33466 12.8589C4.24914 12.9691 4.173 13.0863 4.10702 13.2092C4.03275 13.3476 3.97587 13.4954 3.86211 13.7912L2.0835 18.4156ZM2.0835 18.4156L3.7986 13.9564C3.92133 13.6373 3.98269 13.4778 4.08795 13.4047C4.17993 13.3408 4.29375 13.3167 4.40374 13.3377C4.52961 13.3617 4.65048 13.4826 4.89223 13.7243L6.77481 15.6069C7.01656 15.8487 7.13743 15.9695 7.16147 16.0954C7.18247 16.2054 7.15832 16.3192 7.09445 16.4112C7.02137 16.5164 6.86182 16.5778 6.54272 16.7005L2.0835 18.4156Z"
                                                            stroke="white"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    Edit Information
                                                </button>) : (<button
                                                    className="px-4 py-2 flex justify-center items-center gap-1"
                                                    onClick={handleFavorite}
                                                >
                                                    {isFavourite ? (
                                                        <svg width="23" height="23" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663ZM8.0002 10.713L10.3477 12.1463L9.70936 9.47134L11.7985 7.68217L9.05686 7.46217L8.0002 4.92301L6.94353 7.46217L4.20186 7.68217L6.29103 9.47134L5.6527 12.1463L8.0002 10.7138V10.713Z" fill="#3B82F6" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="23" height="23" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663ZM8.0002 10.713L10.3477 12.1463L9.70936 9.47134L11.7985 7.68217L9.05686 7.46217L8.0002 4.92301L6.94353 7.46217L4.20186 7.68217L6.29103 9.47134L5.6527 12.1463L8.0002 10.7138V10.713Z" fill="#101828" />
                                                        </svg>
                                                    )}
                                                    <p className={`${isFavourite ? 'text-[#101828 2357C6]' : 'text-[#475467]'} text-lg font-semibold leading-[2]`}>
                                                        {isFavourite ? 'Favorited' : 'Add to Favourite'}
                                                    </p>
                                                </button>)}


                                    </>
                                )
                            }
                            {
                                !isTeamMember && (
                                    <button
                                        className="px-4 py-2 flex justify-center items-center gap-1"
                                        onClick={handleFavorite}
                                    >
                                        {isFavourite ? (
                                            <svg width="23" height="23" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663ZM8.0002 10.713L10.3477 12.1463L9.70936 9.47134L11.7985 7.68217L9.05686 7.46217L8.0002 4.92301L6.94353 7.46217L4.20186 7.68217L6.29103 9.47134L5.6527 12.1463L8.0002 10.7138V10.713Z" fill="#3B82F6" />
                                            </svg>
                                        ) : (
                                            <svg width="23" height="23" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663ZM8.0002 10.713L10.3477 12.1463L9.70936 9.47134L11.7985 7.68217L9.05686 7.46217L8.0002 4.92301L6.94353 7.46217L4.20186 7.68217L6.29103 9.47134L5.6527 12.1463L8.0002 10.7138V10.713Z" fill="#101828" />
                                            </svg>
                                        )}
                                        <p className={`${isFavourite ? 'text-[#101828 2357C6]' : 'text-[#475467]'} text-lg font-semibold leading-[2]`}>
                                            {isFavourite ? 'Favorited' : 'Add to Favourite'}
                                        </p>
                                    </button>
                                )
                            }

                        </div>
                    </div>
                    <p className="text-gray-600 text-sm  w-[80%]">
                        {profileData?.slogan}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-row sm:items-center  gap-4 text-sm text-gray-500 ">
                        {/* Location Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 bg-[#f5f8ff] px-3 py-2 rounded-lg">
                                {flagUrl && (
                                    <Image
                                        src={flagUrl}
                                        alt={profileData?.CountryName || 'Country flag'}
                                        width={20}
                                        height={15}
                                        className="w-5 h-4 object-cover"
                                    />
                                )}
                                <span>{profileData?.CountryName || "Not specified"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <svg
                                    className='w-5 h-5'
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M17.5 8.83073H2.5M13.3333 2.16406V5.4974M6.66667 2.16406V5.4974M6.5 18.8307H13.5C14.9001 18.8307 15.6002 18.8307 16.135 18.5582C16.6054 18.3186 16.9878 17.9361 17.2275 17.4657C17.5 16.9309 17.5 16.2309 17.5 14.8307V7.83073C17.5 6.4306 17.5 5.73053 17.2275 5.19575C16.9878 4.72535 16.6054 4.3429 16.135 4.10321C15.6002 3.83073 14.9001 3.83073 13.5 3.83073H6.5C5.09987 3.83073 4.3998 3.83073 3.86502 4.10321C3.39462 4.3429 3.01217 4.72535 2.77248 5.19575C2.5 5.73053 2.5 6.4306 2.5 7.83073V14.8307C2.5 16.2309 2.5 16.9309 2.77248 17.4657C3.01217 17.9361 3.39462 18.3186 3.86502 18.5582C4.3998 18.8307 5.09987 18.8307 6.5 18.8307Z"
                                        stroke="#667085"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Founded 2022</span>
                            </div>
                        </div>

                        {/* Other Info Section */}
                        <div className="space-y-2 mt-2">

                            <div className="flex items-center gap-1 ">
                                <svg
                                    className='w-5 h-5'
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z"
                                        fill="#98A2B3"
                                    />
                                </svg>
                                <span>{profileData?.CityName || "Not specified"}</span>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <svg
                                    className='h-5 w-5'
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M14.9994 13.6974C16.2126 14.3069 17.2528 15.285 18.0121 16.508C18.1624 16.7502 18.2376 16.8713 18.2636 17.039C18.3164 17.3798 18.0834 17.7988 17.766 17.9336C17.6098 18 17.4341 18 17.0827 18M13.3327 10.1102C14.5675 9.49657 15.416 8.22238 15.416 6.75C15.416 5.27762 14.5675 4.00343 13.3327 3.3898M11.666 6.75C11.666 8.82107 9.98711 10.5 7.91604 10.5C5.84497 10.5 4.16604 8.82107 4.16604 6.75C4.16604 4.67893 5.84497 3 7.91604 3C9.98711 3 11.666 4.67893 11.666 6.75ZM2.13207 16.282C3.46066 14.2871 5.55719 13 7.91604 13C10.2749 13 12.3714 14.2871 13.7 16.282C13.9911 16.719 14.1366 16.9375 14.1198 17.2166C14.1068 17.4339 13.9643 17.7 13.7907 17.8313C13.5676 18 13.2609 18 12.6474 18H3.18467C2.57118 18 2.26444 18 2.04141 17.8313C1.86775 17.7 1.72528 17.4339 1.71224 17.2166C1.69548 16.9375 1.84101 16.719 2.13207 16.282Z"
                                        stroke="#667085"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className='text-[#667085]'>8 members</span>
                            </div>
                        </div>
                    </div>


                    {/* Chat Button */}
                    <button
                        className="flex items-center gap-2 px-5 mt-6 py-2 border border-[#D0D5DD] bg-[#2357C6] text-white text-sm font-semibold rounded-md hover:bg-[#667ba8] transition-colors"
                        onClick={() => {
                            const payload = {
                                UserId: profileData?.UserId,
                                ProfilePicture: profileData?.ProfilePicture,
                                FullName: profileData?.ChatUserName,
                                LastActive: profileData?.LastActive,
                                UserProfileId: profileData?.ProfileDetailId,
                            };
                            localStorage.setItem('chatDetails', JSON.stringify(payload));
                            router.push('/chats');
                        }}
                    >
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.25 10.5H6.25833M10 10.5H10.0083M13.75 10.5H13.7583M10 18C14.1421 18 17.5 14.6421 17.5 10.5C17.5 6.35786 14.1421 3 10 3C5.85786 3 2.5 6.35786 2.5 10.5C2.5 11.4976 2.69478 12.4497 3.04839 13.3204C3.11606 13.4871 3.1499 13.5704 3.165 13.6377C3.17976 13.7036 3.18516 13.7524 3.18517 13.8199C3.18518 13.8889 3.17265 13.9641 3.14759 14.1145L2.65344 17.0794C2.60169 17.3898 2.57582 17.5451 2.62397 17.6573C2.66611 17.7556 2.7444 17.8339 2.84265 17.876C2.95491 17.9242 3.11015 17.8983 3.42063 17.8466L6.38554 17.3524C6.53591 17.3273 6.61109 17.3148 6.68011 17.3148C6.74763 17.3148 6.79638 17.3202 6.86227 17.335C6.92962 17.3501 7.01294 17.3839 7.17958 17.4516C8.05025 17.8052 9.00238 18 10 18ZM6.66667 10.5C6.66667 10.7301 6.48012 10.9167 6.25 10.9167C6.01988 10.9167 5.83333 10.7301 5.83333 10.5C5.83333 10.2699 6.01988 10.0833 6.25 10.0833C6.48012 10.0833 6.66667 10.2699 6.66667 10.5ZM10.4167 10.5C10.4167 10.7301 10.2301 10.9167 10 10.9167C9.76988 10.9167 9.58333 10.7301 9.58333 10.5C9.58333 10.2699 9.76988 10.0833 10 10.0833C10.2301 10.0833 10.4167 10.2699 10.4167 10.5ZM14.1667 10.5C14.1667 10.7301 13.9801 10.9167 13.75 10.9167C13.5199 10.9167 13.3333 10.7301 13.3333 10.5C13.3333 10.2699 13.5199 10.0833 13.75 10.0833C13.9801 10.0833 14.1667 10.2699 14.1667 10.5Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                        Chat
                    </button>


                    {/* Favourite */}

                </div>

                {/* Team Members */}

                <div className="mt-10">
                    <h2 className="text-base font-semibold mb-4">Team Members</h2>
                    <div className="flex gap-8 pl-4">
                        {/* Member 1 */}
                        {profileData.MemberDetails.map((member) => (
                            <div className="text-center" onClick={() => router.push(`/profile/${member.UserProfileId}`)}>
                                <img
                                    src={member.ProfilePicture || '/default-profile.png'}
                                    alt="Amara Johnson"
                                    className="w-16 h-16 rounded-full mx-auto"
                                />
                                <div className="mt-2 font-medium text-sm">{member.Name}</div>
                                <div className="text-gray-500 text-xs">Founder & CEO</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <TabSection profileData={profileData} />
        </div >
    );
}