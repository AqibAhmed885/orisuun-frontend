'use client';

import { RootState } from '@/data/store';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import testImg from './components/image.png'
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { checkOnlineStatus } from '@/utils/helper';
import { useFollowStatus } from '@/hooks/useFollowStatus';
import { chatApi } from '@/app/api/dashboard/chats';
export const TypeIcons = {
    'Black-owned Business': (
        <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />
    ),
    Expert: <ExpertsIcon className="text-omblue-500 w-4 h-4" />,
    Mentor: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
    Professional: <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
    'Strategy Consultant': <ConsultantIcon className="text-omblue-500 w-5 h-5" />,
    Investor: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
    Advocate: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Partner: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Admin: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    SystemAdmin: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
};

const MentorProfile = ({ profileData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);
    const [favouriteId, setFavouriteId] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL
        ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
        : 'https://api.orisuun.com/api';

    const handleSave = (updatedData) => {
    };
    const formatToK = (value) => {
        if (!value) return '—';
        const num = parseInt(value);
        if (isNaN(num)) return value;
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num;
    };
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const teamData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('teamData'));

    let isShow = false;
    if (currentUser?.Id == profileData?.UserId) {
        isShow = true;
    }

    const router = useRouter()
    const [flagUrl, setFlagUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profileData) {
            setIsFavourite(profileData?.IsFavouriteProfile);
            setFavouriteId(profileData?.FavouriteId);
        }
    }, [profileData]);

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

    // use shared hook to manage follow status and actions
    const {
        isFollowing: hookIsFollowing,
        loading: followLoading,
        refresh: refreshFollow,
        setIsFollowing: setHookIsFollowing,
        followerCount,
        follow,
        unfollow
    } = useFollowStatus({
        profileUserId: profileData?.UserId,
        profileDetailId: profileData?.ProfileDetailId,
        initialFollowerCount: 3
    });

    // mirror hook state to local state if you still use local isFollowing variable elsewhere
    useEffect(() => {
        setIsFollowing(hookIsFollowing);
    }, [hookIsFollowing]);

    const handleToggleFollow = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
            const teamData = JSON.parse(localStorage.getItem('teamData') || 'null');
            const followerId = teamData?.isActive ? teamData?.teamId : currentUser?.Id;
            if (!followerId) {
                toast.info('Please sign in to follow users');
                return;
            }

            if (hookIsFollowing) {
                await unfollow();
                toast.success('Unfollowed');
            } else {
                await follow();
                toast.success('Following');
            }
        } catch (err) {
            console.error('Follow toggle error', err);
            toast.error('Could not update follow status');
        }
    };

    const countryFlag = async (countryName: string): Promise<string | null> => {
        if (!countryName) return null;

        try {
            const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            const data = await res.json();
            const countryCode = data[0]?.cca2?.toLowerCase();
            if (countryCode) {
                return `https://flagcdn.com/w40/${countryCode}.png`;
            }
            return null;
        } catch (error) {
            console.error('Error fetching flag:', error);
            return null;
        }
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
                        XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
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
            toast.error(error?.response?.data?.Message || 'Failed to update favorite status');
        }
    };

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', currentUser?.Id);

            const res = await axios.post(`${apiEndpoint}/Profile/UploadBanner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                },
            });

            if (res.status === 200) {
                toast.success('Banner uploaded successfully');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload banner');
        }
    };

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

    return (
        <>
            <div className="w-full bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-sm relative">
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-10"></div>

                {/* Main container */}
                <div className="max-full mx-auto pb-1 relative">
                    {/* Banner section */}
                    <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl  aspect-auto md:aspect-[3200/560] absolute">
                        {/* Show banner image if available */}
                        {profileData?.BannerPicture ? (
                            <Image
                                src={profileData?.BannerPicture}
                                alt="Banner"
                                className="w-full h-full object-cover rounded-t-2xl"
                                width={3200}
                                height={410}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                {isShow && (
                                    <>    <p className="text-xl mb-1 font-semibold text-[#1D2939]">Upload Banner Image</p>
                                        <p className="text-lg mb-3">Optimal dimensions: 3200 x 410px</p></>
                                )}
                            </div>
                        )}

                        {/* Share Button */}
                        <button
                            className="absolute flex bg-white py-[7px] px-[10px] rounded right-4 top-4 text-blue-600 hover:text-blue-700"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                    .then(() => {
                                        toast.success('Link copied to clipboard!');
                                    })
                                    .catch((err) => {
                                        console.error('Failed to copy URL: ', err);
                                        toast.error('Failed to copy link');
                                    });
                            }}
                        >
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.15833 11.2587L11.85 14.5753M11.8417 5.42533L6.15833 8.74199M16.5 4.16699C16.5 5.5477 15.3807 6.66699 14 6.66699C12.6193 6.66699 11.5 5.5477 11.5 4.16699C11.5 2.78628 12.6193 1.66699 14 1.66699C15.3807 1.66699 16.5 2.78628 16.5 4.16699ZM6.5 10.0003C6.5 11.381 5.38071 12.5003 4 12.5003C2.61929 12.5003 1.5 11.381 1.5 10.0003C1.5 8.61961 2.61929 7.50033 4 7.50033C5.38071 7.50033 6.5 8.61961 6.5 10.0003ZM16.5 15.8337C16.5 17.2144 15.3807 18.3337 14 18.3337C12.6193 18.3337 11.5 17.2144 11.5 15.8337C11.5 14.4529 12.6193 13.3337 14 13.3337C15.3807 13.3337 16.5 14.4529 16.5 15.8337Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="ml-2 text-sm font-semibold">Share</span>
                        </button>
                    </div>
                </div>



                <div className="flex mt-[5vh] md:mt-[20vh]  lg:pb-20 flex-col lg:items-center lg:text-center  bg-white p-6 shadow-md">
                    {/* Profile Image */}
                    <div className="relative w-[126px] h-[142px] lg:w-[186px] lg:h-[213px]">

                        <svg width="220" height="230" className="w-full h-full" viewBox="0 0 189 189" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <foreignObject
                                x="3.65347"
                                y="-8.12778"
                                width="181.693"
                                height="205.256"
                            >
                                <div
                                    style={{
                                        backdropFilter: 'blur(4.19px)',
                                        clipPath: 'url(#bgblur_0_3_6_clip_path)',
                                        height: '100%',
                                        width: '100%',
                                    }}
                                />
                            </foreignObject>

                            <path
                                d="M12.0312 75.65C12.0312 34.0077 45.789 0.25 87.4312 0.25H94.5H101.569C143.211 0.25 176.969 34.0077 176.969 75.65V94.5V94.5C176.969 123.816 161.867 151.064 137.007 166.601L105.615 186.221C102.971 187.874 99.9154 188.75 96.7972 188.75H94.5H92.2028C89.0846 188.75 86.0292 187.874 83.385 186.221L51.9932 166.601C27.1334 151.064 12.0312 123.816 12.0312 94.5V94.5V75.65Z"
                                fill="white"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M100.783 8.62749C138.955 8.62749 169.899 39.5726 169.899 77.7447V94.4996C169.899 121.28 156.103 146.172 133.393 160.366L105.49 177.806C102.807 179.483 99.7061 180.373 96.5419 180.373H92.4579C89.2937 180.373 86.1929 179.483 83.5097 177.806L55.6063 160.366C32.8964 146.172 19.0995 121.28 19.0995 94.4996V77.7447C19.0995 39.5726 50.0446 8.62749 88.2167 8.62749H100.783Z"
                                fill="url(#imagePattern)"
                                stroke="#F2F4F7"
                                strokeWidth="4.18889"
                            />

                            {/* Green icon at bottom-right  */}
                            {/* Online Dot */}
                            {checkOnlineStatus(profileData.LastActive) ===
                                'online' ? (<g transform="translate(118, 157)">
                                    <rect x="1.55065" y="2.01549" width="21.3914" height="21.3914" rx="13.1721" fill="#17B26A" />
                                    <rect x="1.55065" y="2.01549" width="21.3914" height="21.3914" rx="13.1721" stroke="white" stroke-width="2.25807" />
                                </g>) : (
                                <g transform="translate(118, 157)">
                                    <rect x="1.55065" y="2.01549" width="21.3914" height="21.3914" rx="13.1721" fill="#6B7280" />
                                    <rect x="1.55065" y="2.01549" width="21.3914" height="21.3914" rx="13.1721" stroke="white" stroke-width="2.25807" />
                                </g>)}
                            <defs>
                                <clipPath id="bgblur_0_3_6_clip_path" transform="translate(-3.65347 8.12778)">
                                    <path d="M12.0312 75.65C12.0312 34.0077 45.789 0.25 87.4312 0.25H94.5H101.569C143.211 0.25 176.969 34.0077 176.969 75.65V94.5V94.5C176.969 123.816 161.867 151.064 137.007 166.601L105.615 186.221C102.971 187.874 99.9154 188.75 96.7972 188.75H94.5H92.2028C89.0846 188.75 86.0292 187.874 83.385 186.221L51.9932 166.601C27.1334 151.064 12.0312 123.816 12.0312 94.5V94.5V75.65Z" />
                                </clipPath>

                                <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="183" height="180">
                                    <image
                                        href={profileData?.ProfilePicture}
                                        x="0"
                                        y="0"
                                        width="183"
                                        height="180"
                                        preserveAspectRatio="xMidYMid slice"
                                    />
                                </pattern>
                            </defs>
                        </svg>
                    </div>


                    <div className="flex gap-2  absolute right-10 top-[14vh] lg:top-[30vh]">
                        {!isShow && (
                            <button
                                className="px-4 py-2 flex justify-center items-center gap-1"
                                onClick={() => setFavourite(profileData)}
                            >
                                {isFavourite ? (
                                    <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663ZM8.0002 10.713L10.3477 12.1463L9.70936 9.47134L11.7985 7.68217L9.05686 7.46217L8.0002 4.92301L6.94353 7.46217L4.20186 7.68217L6.29103 9.47134L5.6527 12.1463L8.0002 10.7138V10.713Z" fill="#3B82F6" />
                                    </svg>
                                ) : (
                                    <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663ZM8.0002 10.713L10.3477 12.1463L9.70936 9.47134L11.7985 7.68217L9.05686 7.46217L8.0002 4.92301L6.94353 7.46217L4.20186 7.68217L6.29103 9.47134L5.6527 12.1463L8.0002 10.7138V10.713Z" fill="#101828" />
                                    </svg>
                                )}
                                <p className={`${isFavourite ? 'text-[#101828 2357C6]' : 'text-[#475467]'} text-lg font-semibold leading-[2]`}>
                                    {isFavourite ? 'Favorited' : 'Add to Favourite'}
                                </p>
                            </button>
                        )}

                        {isShow && (
                            <button
                                onClick={() =>
                                    router.push(
                                        `/profile/edit-profile/${add2040ToProfileDetailsId(currentUser?.UserProfileDetailsId
                                        )}`
                                    )}
                                className="flex lg:mt-10  items-center gap-2 px-4 py-2 bg-[#2357C6] font-semibold text-white rounded-md hover:bg-[#658ce0] transition-colors"
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
                                Edit Informationsdf
                            </button>
                        )}
                    </div>
                    {/* Name & Verified */}

                    <div className="lg:hidden  flex items-center gap-3 text-sm my-6">
                        <span className="flex items-center gap-1 bg-[#f5f8ff] px-3 py-2 rounded-lg">
                            {flagUrl && (
                                <Image
                                    src={flagUrl}
                                    alt={profileData?.CountryName || 'Country flag'}
                                    width={20}
                                    height={15}
                                    className="w-5 h-4 object-cover rounded-sm"
                                />
                            )}
                            {profileData?.CountryName || 'country name'}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                            </svg>
                            {profileData?.CityName || 'cityname'}
                        </span>
                    </div>
                    <div className="mb-1 lg:hidden sm:mb-0">

                        <div className="flex items-center gap-2 -mt-4">
                            <h1 className="text-[30px] font-semibold">{profileData?.CompanyName}</h1>
                            {profileData?.ProfileVerified && (
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1141_216881)">
                                        <path d="M15.4442 4.04062C15.6342 4.50002 15.9988 4.86517 16.4579 5.05581L18.0678 5.72264C18.5272 5.91294 18.8922 6.27796 19.0825 6.73738C19.2728 7.19681 19.2728 7.71302 19.0825 8.17245L18.4162 9.78115C18.2258 10.2408 18.2255 10.7575 18.4168 11.2169L19.082 12.8251C19.1763 13.0527 19.2249 13.2966 19.2249 13.5429C19.225 13.7893 19.1765 14.0332 19.0822 14.2608C18.9879 14.4883 18.8497 14.6951 18.6755 14.8693C18.5013 15.0434 18.2945 15.1815 18.0669 15.2757L16.4582 15.9421C15.9988 16.132 15.6336 16.4966 15.443 16.9558L14.7762 18.5656C14.5859 19.025 14.2209 19.3901 13.7614 19.5804C13.302 19.7707 12.7858 19.7707 12.3264 19.5804L10.7177 18.914C10.2582 18.7242 9.7422 18.7246 9.28304 18.9151L7.67318 19.581C7.21401 19.7708 6.69825 19.7707 6.2392 19.5805C5.78014 19.3904 5.41533 19.0258 5.2249 18.5668L4.55788 16.9565C4.36793 16.4971 4.00332 16.132 3.54421 15.9413L1.93435 15.2745C1.47513 15.0843 1.11022 14.7195 0.919849 14.2603C0.729477 13.8012 0.729219 13.2852 0.919131 12.8258L1.58548 11.2171C1.77531 10.7577 1.77492 10.2417 1.5844 9.78252L0.91901 8.1715C0.824671 7.94395 0.776094 7.70005 0.776054 7.45372C0.776015 7.20739 0.824513 6.96346 0.91878 6.73588C1.01305 6.50831 1.15123 6.30153 1.32544 6.12738C1.49965 5.95322 1.70647 5.8151 1.93408 5.72091L3.54278 5.05456C4.00178 4.86478 4.36671 4.50063 4.55749 4.04205L5.22432 2.43219C5.41462 1.97277 5.77964 1.60775 6.23906 1.41745C6.69849 1.22715 7.2147 1.22715 7.67413 1.41745L9.28283 2.0838C9.74227 2.27363 10.2583 2.27324 10.7174 2.08272L12.328 1.41848C12.7874 1.22829 13.3034 1.22833 13.7628 1.41859C14.2221 1.60886 14.5871 1.97377 14.7774 2.43307L15.4444 4.04341L15.4442 4.04062Z" fill="url(#paint0_linear_1141_216881)" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9166 7.87925C14.0502 7.6694 14.0949 7.41507 14.041 7.17221C13.9871 6.92935 13.8389 6.71785 13.6291 6.58425C13.4192 6.45065 13.1649 6.40588 12.922 6.4598C12.6792 6.51372 12.4677 6.6619 12.3341 6.87175L8.66283 12.6405L6.98283 10.5405C6.82751 10.3462 6.60138 10.2216 6.35418 10.1941C6.10699 10.1665 5.85897 10.2383 5.6647 10.3936C5.47043 10.5489 5.34582 10.7751 5.31827 11.0223C5.29073 11.2695 5.36251 11.5175 5.51783 11.7118L8.01783 14.8368C8.111 14.9534 8.23066 15.046 8.36687 15.1071C8.50308 15.1681 8.65189 15.1957 8.80094 15.1877C8.94998 15.1796 9.09494 15.1361 9.22376 15.0607C9.35258 14.9853 9.46154 14.8802 9.54158 14.7543L13.9166 7.87925Z" fill="white" />
                                    </g>
                                    <defs>
                                        <linearGradient id="paint0_linear_1141_216881" x1="13.7616" y1="1.41811" x2="6.23862" y2="19.5803" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#1594FF" />
                                            <stop offset="1" stop-color="#0BC1A5" />
                                        </linearGradient>
                                        <clipPath id="clip0_1141_216881">
                                            <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            )}
                        </div>
                        <p className="text-[18px] text-[#475467] ">{profileData?.Tagline || 'Managing partner'}</p>


                        <span className="bg-[#ECF4FB] text-[#102A56] border border-[#B2DDFF] px-3 mt-[2px] rounded-2xl inline-flex items-center justify-center gap-1">
                            {TypeIcons[profileData?.UserProfileType as keyof typeof TypeIcons]}
                            {profileData?.UserProfileType}
                        </span>
                        <p className="text-20 text-gray-600  py-2 mt-2 lg:mt-0"><span className='text-16 font-semibold pr-2'>1224</span>Followers</p>
                    </div>
                    {!isShow && (
                        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2 ">
                            {/* Follow Button */}
                            <button
                                className="flex justify-center items-center gap-2 px-4 py-2 bg-[#2357C6] text-white text-sm font-semibold rounded-md hover:bg-[#1e4bb2] transition-colors"
                                onClick={handleToggleFollow}
                                disabled={followLoading}
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.8332 6.33301V1.33301M13.3332 3.83301H18.3332M13.3332 15.4997V14.4997C13.3332 13.0995 13.3332 12.3995 13.0607 11.8647C12.821 11.3943 12.4386 11.0118 11.9681 10.7722C11.4334 10.4997 10.7333 10.4997 9.33317 10.4997H5.6665C4.26637 10.4997 3.56631 10.4997 3.03153 10.7722C2.56112 11.0118 2.17867 11.3943 1.93899 11.8647C1.6665 12.3995 1.6665 13.0995 1.6665 14.4997V15.4997M10.4165 4.24967C10.4165 5.86051 9.11067 7.16634 7.49984 7.16634C5.88901 7.16634 4.58317 5.86051 4.58317 4.24967C4.58317 2.63884 5.88901 1.33301 7.49984 1.33301C9.11067 1.33301 10.4165 2.63884 10.4165 4.24967Z"
                                        stroke="white"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>

                            {/* Chat Button */}
                            <button
                                className="flex justify-center items-center gap-2 px-4 py-2 border border-[#D0D5DD] bg-white text-[#344054] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
                                onClick={handleChatClick}
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5ZM6.66667 10C6.66667 10.2301 6.48012 10.4167 6.25 10.4167C6.01988 10.4167 5.83333 10.2301 5.83333 10C5.83333 9.76988 6.01988 9.58333 6.25 9.58333C6.48012 9.58333 6.66667 9.76988 6.66667 10ZM10.4167 10C10.4167 10.2301 10.2301 10.4167 10 10.4167C9.76988 10.4167 9.58333 10.2301 9.58333 10C9.58333 9.76988 9.76988 9.58333 10 9.58333C10.2301 9.58333 10.4167 9.76988 10.4167 10ZM14.1667 10C14.1667 10.2301 13.9801 10.4167 13.75 10.4167C13.5199 10.4167 13.3333 10.2301 13.3333 10C13.3333 9.76988 13.5199 9.58333 13.75 9.58333C13.9801 9.58333 14.1667 9.76988 14.1667 10Z"
                                        stroke="#344054"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Chat</span>
                            </button>
                        </div>
                    )}

                    {/* Visit Website Link */}
                    <a href={profileData?.WebsiteUrl} className="lg:hidden text-[#2357C6] text-sm font-semibold inline-flex items-center gap-1 hover:underline underline">
                        Visit Website
                        <svg width="10" className='ml-2' height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.833496 9.16536L9.16683 0.832031M9.16683 0.832031H0.833496M9.16683 0.832031V9.16536" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                    <div className="hidden lg:flex items-center gap-2">
                        <h1 className="text-[30px] font-semibold -mb-3 pt-4">{profileData?.CompanyName}</h1>
                        {profileData?.ProfileVerified && (
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1141_216881)">
                                    <path d="M15.4442 4.04062C15.6342 4.50002 15.9988 4.86517 16.4579 5.05581L18.0678 5.72264C18.5272 5.91294 18.8922 6.27796 19.0825 6.73738C19.2728 7.19681 19.2728 7.71302 19.0825 8.17245L18.4162 9.78115C18.2258 10.2408 18.2255 10.7575 18.4168 11.2169L19.082 12.8251C19.1763 13.0527 19.2249 13.2966 19.2249 13.5429C19.225 13.7893 19.1765 14.0332 19.0822 14.2608C18.9879 14.4883 18.8497 14.6951 18.6755 14.8693C18.5013 15.0434 18.2945 15.1815 18.0669 15.2757L16.4582 15.9421C15.9988 16.132 15.6336 16.4966 15.443 16.9558L14.7762 18.5656C14.5859 19.025 14.2209 19.3901 13.7614 19.5804C13.302 19.7707 12.7858 19.7707 12.3264 19.5804L10.7177 18.914C10.2582 18.7242 9.7422 18.7246 9.28304 18.9151L7.67318 19.581C7.21401 19.7708 6.69825 19.7707 6.2392 19.5805C5.78014 19.3904 5.41533 19.0258 5.2249 18.5668L4.55788 16.9565C4.36793 16.4971 4.00332 16.132 3.54421 15.9413L1.93435 15.2745C1.47513 15.0843 1.11022 14.7195 0.919849 14.2603C0.729477 13.8012 0.729219 13.2852 0.919131 12.8258L1.58548 11.2171C1.77531 10.7577 1.77492 10.2417 1.5844 9.78252L0.91901 8.1715C0.824671 7.94395 0.776094 7.70005 0.776054 7.45372C0.776015 7.20739 0.824513 6.96346 0.91878 6.73588C1.01305 6.50831 1.15123 6.30153 1.32544 6.12738C1.49965 5.95322 1.70647 5.8151 1.93408 5.72091L3.54278 5.05456C4.00178 4.86478 4.36671 4.50063 4.55749 4.04205L5.22432 2.43219C5.41462 1.97277 5.77964 1.60775 6.23906 1.41745C6.69849 1.22715 7.2147 1.22715 7.67413 1.41745L9.28283 2.0838C9.74227 2.27363 10.2583 2.27324 10.7174 2.08272L12.328 1.41848C12.7874 1.22829 13.3034 1.22833 13.7628 1.41859C14.2221 1.60886 14.5871 1.97377 14.7774 2.43307L15.4444 4.04341L15.4442 4.04062Z" fill="url(#paint0_linear_1141_216881)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9166 7.87925C14.0502 7.6694 14.0949 7.41507 14.041 7.17221C13.9871 6.92935 13.8389 6.71785 13.6291 6.58425C13.4192 6.45065 13.1649 6.40588 12.922 6.4598C12.6792 6.51372 12.4677 6.6619 12.3341 6.87175L8.66283 12.6405L6.98283 10.5405C6.82751 10.3462 6.60138 10.2216 6.35418 10.1941C6.10699 10.1665 5.85897 10.2383 5.6647 10.3936C5.47043 10.5489 5.34582 10.7751 5.31827 11.0223C5.29073 11.2695 5.36251 11.5175 5.51783 11.7118L8.01783 14.8368C8.111 14.9534 8.23066 15.046 8.36687 15.1071C8.50308 15.1681 8.65189 15.1957 8.80094 15.1877C8.94998 15.1796 9.09494 15.1361 9.22376 15.0607C9.35258 14.9853 9.46154 14.8802 9.54158 14.7543L13.9166 7.87925Z" fill="white" />
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_1141_216881" x1="13.7616" y1="1.41811" x2="6.23862" y2="19.5803" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#1594FF" />
                                        <stop offset="1" stop-color="#0BC1A5" />
                                    </linearGradient>
                                    <clipPath id="clip0_1141_216881">
                                        <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        )}
                    </div>

                    {/* Role Badge */}
                    <span className="hidden bg-[#ECF4FB] text-[#102A56] border border-[#B2DDFF] px-3 mt-5 rounded-2xl lg:inline-flex items-center gap-1">
                        {TypeIcons[profileData?.UserProfileType as keyof typeof TypeIcons]}
                        {profileData?.UserProfileType}
                    </span>

                    {/* Tagline */}
                    <p className="hidden lg:block text-24 text-gray-600 py-2">{profileData?.Tagline || '"Empowering the next generation of Black entrepreneurs through strategic mentorship"'}</p>
                    {/* Location & Country */}
                    <div className="hidden lg:flex items-center gap-3 text-sm">

                        <span className="flex items-center gap-1 bg-[#f5f8ff] px-3 py-2 rounded-lg">
                            {flagUrl && (
                                <Image
                                    src={flagUrl}
                                    alt={profileData?.CountryName || 'Country flag'}
                                    width={20}
                                    height={15}
                                    className="w-5 h-4 object-cover"
                                />
                            )}
                            {profileData?.CountryName || 'country name'}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                            </svg>
                            {profileData?.CityName || 'cityname'}
                        </span>
                    </div>

                    {/* Follower count */}
                    <p className="hidden lg:block text-sm text-gray-500 pt-3">
                        <span className="font-semibold text-lg text-gray-800"><span className='pr-1'>{followerCount}</span></span> Followers
                    </p>

                    {/* Actions */}
                    <div className="hidden lg:block flex-wrap gap-6  text-sm mt-5">
                        <div className="flex gap-7">
                            {/* Follow Button */}
                            {!isShow && (
                                <button
                                    className="flex items-center gap-2 px-10 py-2 bg-[#2357C6] text-white text-sm font-semibold rounded-md hover:bg-[#1e4bb2] transition-colors"
                                    onClick={handleToggleFollow}
                                    disabled={followLoading}
                                >
                                    <svg className='h-5 w-5' viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.8332 6.33301V1.33301M13.3332 3.83301H18.3332M13.3332 15.4997V14.4997C13.3332 13.0995 13.3332 12.3995 13.0607 11.8647C12.821 11.3943 12.4386 11.0118 11.9681 10.7722C11.4334 10.4997 10.7333 10.4997 9.33317 10.4997H5.6665C4.26637 10.4997 3.56631 10.4997 3.03153 10.7722C2.56112 11.0118 2.17867 11.3943 1.93899 11.8647C1.6665 12.3995 1.6665 13.0995 1.6665 14.4997V15.4997M10.4165 4.24967C10.4165 5.86051 9.11067 7.16634 7.49984 7.16634C5.88901 7.16634 4.58317 5.86051 4.58317 4.24967C4.58317 2.63884 5.88901 1.33301 7.49984 1.33301C9.11067 1.33301 10.4165 2.63884 10.4165 4.24967Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>)}

                            {/* Chat Button */}
                            {!isShow && (
                                <button
                                    className="flex items-center gap-2 px-10 py-2 border border-[#D0D5DD] bg-white text-[#344054] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={handleChatClick}
                                >
                                    <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5ZM6.66667 10C6.66667 10.2301 6.48012 10.4167 6.25 10.4167C6.01988 10.4167 5.83333 10.2301 5.83333 10C5.83333 9.76988 6.01988 9.58333 6.25 9.58333C6.48012 9.58333 6.66667 9.76988 6.66667 10ZM10.4167 10C10.4167 10.2301 10.2301 10.4167 10 10.4167C9.76988 10.4167 9.58333 10.2301 9.58333 10C9.58333 9.76988 9.76988 9.58333 10 9.58333C10.2301 9.58333 10.4167 9.76988 10.4167 10ZM14.1667 10C14.1667 10.2301 13.9801 10.4167 13.75 10.4167C13.5199 10.4167 13.3333 10.2301 13.3333 10C13.3333 9.76988 13.5199 9.58333 13.75 9.58333C13.9801 9.58333 14.1667 9.76988 14.1667 10Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    Chat
                                </button>
                            )}

                            {/* Visit Website Link */}
                            <a href={profileData?.WebsiteUrl} className="hidden lg:inline-flex text-[#2357C6] text-sm font-semibold items-center gap-1 hover:underline">

                                Visit Website
                                <svg width="10" className='ml-2' height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.833496 9.16536L9.16683 0.832031M9.16683 0.832031H0.833496M9.16683 0.832031V9.16536" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

            </div >
            <svg
                className="w-full h-[12px] rounded-b-2xl"
                viewBox="0 0 1297 11"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_1141_233765)">
                    <rect width="1297" height="15" transform="translate(0 -2)" fill="url(#paint0_linear_1141_233765)" />
                </g>
                <defs>
                    <linearGradient id="paint0_linear_1141_233765" x1="0" y1="7.5" x2="1434.48" y2="7.5" gradientUnits="userSpaceOnUse">
                        <stop offset="0.230769" stopColor="#2647AF" />
                        <stop offset="1" stopColor="#05DBCE" />
                    </linearGradient>
                    <clipPath id="clip0_1141_233765">
                        <rect width="1297" height="11" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </>
    );
};

export default MentorProfile;