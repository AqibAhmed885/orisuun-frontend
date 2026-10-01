'use client';

import { RootState } from '@/data/store';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import DefaultBanner from './image.png'
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import ProfileFlag from './ProfileFlag'
import { checkOnlineStatus } from '@/utils/helper';
import { useFollowStatus } from '@/hooks/useFollowStatus';
import { chatApi } from '@/app/api/dashboard/chats';
export const TypeIcons = {
    'Black-owned Business': (
        <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />
    ),
    Expert: <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
    Mentor: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
    Professional: <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
    'Strategy Consultant': <ConsultantIcon className="text-omblue-500 w-5 h-5" />,
    Investor: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
    Advocate: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Partner: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Admin: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    SystemAdmin: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
};

const InvestorProfile = ({ profileData }) => {
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
        <div className="w-full bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-sm">
            {/* Main container */}
            <div className="max-full mx-auto pb-2">
                {/* Banner section */}
                <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-64 md:aspect-[3200/560] relative">
                    <Image
                        src={profileData?.BannerPicture || DefaultBanner}
                        alt="Banner"
                        className="w-full h-full object-cover rounded-t-2xl"
                        width={3200}
                        height={410}
                    />
                    {/* Show banner image if available */}
                    {/* {profileData?.BannerPicture ? (
                        <Image
                            src={profileData?.BannerPicture}
                            alt="Banner"
                            className="w-full h-full object-cover rounded-t-2xl"
                            width={1000}
                            height={1000}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                            {isShow && (
                                <>    <p className="text-xl mb-1 font-semibold text-[#1D2939]">Upload Banner Image</p>
                                    <p className="text-lg mb-3">Optimal dimensions: 3200 x 410px</p></>
                            )}
                        </div>
                    )} */}

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
            {/* Profile content */}
            <div className="flex flex-col sm:flex-row gap-6 px-10 mt-2 lg:pb-9 sm:pt-6">
                <div className="flex justify-between sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-32 h-32 sm:w-[200px] sm:h-[200px]  sm:mx-0">
                        {/* Outer border with rounded octagon */}
                        <div className="w-full h-full rounded-octagon bg-[#dfebfb] flex items-center justify-center">
                            {/* Inner white border with rounded octagon */}
                            <div className="w-[92%] h-[92%] bg-white rounded-octagon flex items-center justify-center">
                                {/* Image with rounded octagon shape */}
                                <div className="w-[92%] h-[92%] rounded-octagon overflow-hidden">

                                    <img
                                        src={profileData?.ProfilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />

                                </div>
                            </div>
                        </div>

                        {/* Online status dot */}

                        {checkOnlineStatus(profileData.LastActive) ===
                            'online' ? (
                            <div className="absolute bottom-1.5 right-1.5 sm:-bottom-1 sm:right-7 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white shadow-md z-30"></div>
                        ) : (
                            <div className="absolute bottom-1.5 right-1.5 sm:-bottom-1 sm:right-7 w-4 h-4 sm:w-6 sm:h-6 bg-gray-500 rounded-full border-2 border-white shadow-md z-30"></div>
                        )}
                        {/* Location info - mobile only */}
                        <div className="sm:hidden  flex items-center gap-3 text-sm my-6">
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
                                {profileData?.CountryName}
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className='w-5 h-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                                </svg>
                                {profileData?.CityName}
                            </span>
                        </div>
                    </div>

                    {/* Mobile-only actions */}
                    <div className="sm:hidden flex flex-col gap-2 mt-2">
                        {/* Mobile buttons */}
                        <div className="flex flex-col gap-2">
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
                                    <p className={`${isFavourite ? 'text-blue-500' : 'text-[#101828]'} text-sm font-semibold`}>
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
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2357C6] font-medium text-white rounded-md hover:bg-[#658ce0] transition-colors text-sm"
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
                                </button>
                            )}

                            {/* Visit Website Link - mobile only */}
                            <a href={profileData?.WebsiteUrl} className="px-4 py-2 text-[#2357C6] text-sm  inline-flex items-center justify-center gap-1  font-semibold transition-colors hover:underline underline">
                                Visit Website
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.833496 9.16536L9.16683 0.832031M9.16683 0.832031H0.833496M9.16683 0.832031V9.16536" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>




                {/* Profile info section - Right side */}
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 mt-7 lg:mt-0">
                        <div className="mb-4  sm:mb-0">

                            <div className="flex items-center gap-2 ">
                                <h1 className="text-[30px] font-semibold lg:-mt-2 mb-1">{profileData?.CompanyName}</h1>
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
                            <p className="text-20 text-gray-600 mb-1 py-1">{profileData?.Tagline}</p>

                            <span className="bg-[#ECF4FB] border text-[#102A56] border-[#B2DDFF] px-3 py-[2px]  rounded-2xl inline-flex items-center gap-1">
                                {TypeIcons[profileData?.UserProfileType as keyof typeof TypeIcons]}
                                {profileData?.UserProfileType}
                            </span>
                            <p className="text-20 text-gray-600  py-2  lg:mt-2"><span className='text-16 font-semibold pr-2'>{followerCount}</span>Followers</p>
                        </div>
                        <div className="flex gap-2 small-767:hidden">
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
                                    <p className={`${isFavourite ? 'text-[#101828 2357C6]' : 'text-[#101828]'} text-lg font-semibold leading-[2]`}>
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
                                    className="flex small-767:hidden items-center gap-2 px-4 py-2 bg-[#2357C6] font-semibold text-white rounded-md hover:bg-[#658ce0] transition-colors"
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
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-3 text-sm small-767:hidden">
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
                            {profileData?.CountryName}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                            </svg>
                            {profileData?.CityName}
                        </span>
                    </div>
                    <div className="small-767:hidden flex flex-wrap gap-6 mb-4 text-sm mt-5">
                        <div className="flex gap-7">
                            {/* Follow Button */}
                            {!isShow && (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-[#2357C6] text-white text-sm font-semibold rounded-md hover:bg-[#1e4bb2] transition-colors"
                                    onClick={handleToggleFollow}
                                    disabled={followLoading}
                                >
                                    <svg className='h-4 w-4' viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.8332 6.33301V1.33301M13.3332 3.83301H18.3332M13.3332 15.4997V14.4997C13.3332 13.0995 13.3332 12.3995 13.0607 11.8647C12.821 11.3943 12.4386 11.0118 11.9681 10.7722C11.4334 10.4997 10.7333 10.4997 9.33317 10.4997H5.6665C4.26637 10.4997 3.56631 10.4997 3.03153 10.7722C2.56112 11.0118 2.17867 11.3943 1.93899 11.8647C1.6665 12.3995 1.6665 13.0995 1.6665 14.4997V15.4997M10.4165 4.24967C10.4165 5.86051 9.11067 7.16634 7.49984 7.16634C5.88901 7.16634 4.58317 5.86051 4.58317 4.24967C4.58317 2.63884 5.88901 1.33301 7.49984 1.33301C9.11067 1.33301 10.4165 2.63884 10.4165 4.24967Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>)}

                            {/* Chat Button */}
                            {!isShow && (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] bg-white text-[#344054] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={handleChatClick}
                                >
                                    <svg className='h-4 w-4' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5ZM6.66667 10C6.66667 10.2301 6.48012 10.4167 6.25 10.4167C6.01988 10.4167 5.83333 10.2301 5.83333 10C5.83333 9.76988 6.01988 9.58333 6.25 9.58333C6.48012 9.58333 6.66667 9.76988 6.66667 10ZM10.4167 10C10.4167 10.2301 10.2301 10.4167 10 10.4167C9.76988 10.4167 9.58333 10.2301 9.58333 10C9.58333 9.76988 9.76988 9.58333 10 9.58333C10.2301 9.58333 10.4167 9.76988 10.4167 10ZM14.1667 10C14.1667 10.2301 13.9801 10.4167 13.75 10.4167C13.5199 10.4167 13.3333 10.2301 13.3333 10C13.3333 9.76988 13.5199 9.58333 13.75 9.58333C13.9801 9.58333 14.1667 9.76988 14.1667 10Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    Chat
                                </button>
                            )}

                            {/* Visit Website Link */}
                            <a href={profileData?.WebsiteUrl} className="small-767:hidden text-[#2357C6] text-sm font-semibold inline-flex items-center gap-1 hover:underline underline">
                                Visit Website
                                <svg width="10" className='ml-2' height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.833496 9.16536L9.16683 0.832031M9.16683 0.832031H0.833496M9.16683 0.832031V9.16536" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {!isShow && (
                <div className="lg:hidden grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 ">
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
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
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
            <div className="hidden lg:grid grid-cols-4 gap-6 p-6 bg-white rounded-2xl shadow">

                {/* Check Size */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-4 w-4' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.8346 7.08203H2.16797M2.16797 10.4154H5.12353C5.57369 10.4154 5.79877 10.4154 6.01641 10.4542C6.2096 10.4886 6.39805 10.5457 6.57789 10.6242C6.7805 10.7126 6.96778 10.8375 7.34233 11.0872L7.82694 11.4102C8.20149 11.6599 8.38877 11.7848 8.59138 11.8732C8.77122 11.9517 8.95967 12.0088 9.15286 12.0432C9.3705 12.082 9.59558 12.082 10.0457 12.082H10.9569C11.407 12.082 11.6321 12.082 11.8497 12.0432C12.0429 12.0088 12.2314 11.9517 12.4112 11.8732C12.6138 11.7848 12.8011 11.6599 13.1757 11.4102L13.6603 11.0872C14.0348 10.8375 14.2221 10.7126 14.4247 10.6242C14.6046 10.5457 14.793 10.4886 14.9862 10.4542C15.2038 10.4154 15.4289 10.4154 15.8791 10.4154H18.8346M2.16797 5.9987L2.16797 13.9987C2.16797 14.9321 2.16797 15.3988 2.34962 15.7553C2.50941 16.0689 2.76438 16.3239 3.07798 16.4837C3.4345 16.6654 3.90121 16.6654 4.83464 16.6654L16.168 16.6654C17.1014 16.6654 17.5681 16.6654 17.9246 16.4837C18.2382 16.3239 18.4932 16.069 18.653 15.7553C18.8346 15.3988 18.8346 14.9321 18.8346 13.9987V5.9987C18.8346 5.06528 18.8346 4.59857 18.653 4.24205C18.4932 3.92844 18.2382 3.67348 17.9246 3.51369C17.5681 3.33203 17.1014 3.33203 16.168 3.33203L4.83464 3.33203C3.90122 3.33203 3.4345 3.33203 3.07798 3.51369C2.76438 3.67348 2.50941 3.92844 2.34962 4.24205C2.16797 4.59857 2.16797 5.06528 2.16797 5.9987Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Check Size</div>
                    <div className="text-3xl font-bold text-gray-900">${formatToK(profileData?.MinCheckSize)} - ${formatToK(profileData?.MaxCheckSize)}</div>
                </div>

                {/* Investment Stage */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-4 w-4' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.66927 2.5C8.5776 2.5 10.9884 4.62833 11.4301 7.4125C12.4093 6.43667 13.7609 5.83333 15.2526 5.83333H19.0026V7.91667C19.0026 10.9083 16.5776 13.3333 13.5859 13.3333H11.5026V17.5H9.83594V10.8333H8.16927C4.9476 10.8333 2.33594 8.22167 2.33594 5V2.5H5.66927ZM17.3359 7.5H15.2526C13.1818 7.5 11.5026 9.17917 11.5026 11.25V11.6667H13.5859C15.6568 11.6667 17.3359 9.9875 17.3359 7.91667V7.5ZM5.66927 4.16667H4.0026V5C4.0026 7.30083 5.86844 9.16667 8.16927 9.16667H9.83594V8.33333C9.83594 6.0325 7.9701 4.16667 5.66927 4.16667Z" fill="#101828" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Investment Stage</div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {profileData?.InvestmentStage?.split('|').map(stage => (
                            <span key={stage} className="px-3 py-1 text-sm text-[#1B3D86] bg-[#EAF0FE] rounded-full">{stage}</span>
                        ))}
                    </div>
                </div>

                {/* Investment Type */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-4 w-4' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19.168H13.3333V18.3346H6.66667V19.168H5V18.3346H4.16667C3.24583 18.3346 2.5 17.5888 2.5 16.668V5.83464C2.5 4.9138 3.24583 4.16797 4.16667 4.16797H6.66667V2.5013C6.66667 2.0413 7.04 1.66797 7.5 1.66797H12.5C12.96 1.66797 13.3333 2.0413 13.3333 2.5013V4.16797H15.8333C16.7542 4.16797 17.5 4.9138 17.5 5.83464V16.668C17.5 17.5888 16.7542 18.3346 15.8333 18.3346H15V19.168ZM15.8333 5.83464H4.16667V16.668H15.8333V5.83464ZM8.33333 7.5013V15.0013H6.66667V7.5013H8.33333ZM13.3333 7.5013V15.0013H11.6667V7.5013H13.3333ZM11.6667 3.33464H8.33333V4.16797H11.6667V3.33464Z" fill="#101828" />
                        </svg>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Investment Type</div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {profileData?.InvestorType?.split('|').map(type => (
                            <span key={type} className="px-3 py-1 text-sm text-[#1B3D86] bg-[#EAF0FE] rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 mx-1 bg-[#1B3D86] rounded-full inline-block" />
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Geography of Service */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-4 w-4' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3372 1.66797C12.4216 3.94993 13.6062 6.91133 13.6706 10.0013C13.6062 13.0913 12.4216 16.0527 10.3372 18.3346M10.3372 1.66797C8.25284 3.94993 7.06828 6.91133 7.00391 10.0013C7.06828 13.0913 8.25284 16.0527 10.3372 18.3346M10.3372 1.66797C5.73487 1.66797 2.00391 5.39893 2.00391 10.0013C2.00391 14.6037 5.73487 18.3346 10.3372 18.3346M10.3372 1.66797C14.9396 1.66797 18.6706 5.39893 18.6706 10.0013C18.6706 14.6037 14.9396 18.3346 10.3372 18.3346M2.42059 7.5013H18.2539M2.42057 12.5013H18.2539" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Geography of Service</div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {profileData?.GeographyOfService?.split('|').map(loc => (
                            <span key={loc} className="px-3 py-1 text-sm text-[#1B3D86] bg-[#EAF0FE] rounded-full flex items-center gap-1">
                                <ProfileFlag location={loc.trim()} />
                                {loc.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>


            {/* mobile view */}
            <div className="lg:hidden mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-2xl shadow">

                {/* Check Size */}
                <div className="flex flex-col  space-y-2 order-1">
                    <div className="text-2xl text-gray-600">
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.3327 7.58203H1.66602M1.66602 10.9154H4.62158C5.07174 10.9154 5.29682 10.9154 5.51446 10.9542C5.70764 10.9886 5.8961 11.0457 6.07594 11.1242C6.27855 11.2126 6.46583 11.3375 6.84038 11.5872L7.32498 11.9102C7.69954 12.1599 7.88682 12.2848 8.08943 12.3732C8.26927 12.4517 8.45772 12.5088 8.6509 12.5432C8.86855 12.582 9.09363 12.582 9.54379 12.582H10.4549C10.9051 12.582 11.1302 12.582 11.3478 12.5432C11.541 12.5088 11.7294 12.4517 11.9093 12.3732C12.1119 12.2848 12.2992 12.1599 12.6737 11.9102L13.1583 11.5872C13.5329 11.3375 13.7202 11.2126 13.9228 11.1242C14.1026 11.0457 14.2911 10.9886 14.4842 10.9542C14.7019 10.9154 14.927 10.9154 15.3771 10.9154H18.3327M1.66602 6.4987L1.66602 14.4987C1.66602 15.4321 1.66602 15.8988 1.84767 16.2553C2.00746 16.5689 2.26243 16.8239 2.57603 16.9837C2.93255 17.1654 3.39926 17.1654 4.33268 17.1654L15.666 17.1654C16.5994 17.1654 17.0661 17.1654 17.4227 16.9837C17.7363 16.8239 17.9912 16.569 18.151 16.2553C18.3327 15.8988 18.3327 15.4321 18.3327 14.4987V6.4987C18.3327 5.56528 18.3327 5.09857 18.151 4.74205C17.9912 4.42844 17.7363 4.17348 17.4227 4.01369C17.0661 3.83203 16.5994 3.83203 15.666 3.83203L4.33268 3.83203C3.39926 3.83203 2.93255 3.83203 2.57603 4.01369C2.26243 4.17348 2.00746 4.42844 1.84767 4.74205C1.66602 5.09857 1.66602 5.56528 1.66602 6.4987Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Check Size</div>
                    <div className="text-3xl font-bold text-gray-900">$100k - $50M</div>
                </div>

                {/* Investment Type */}
                <div className="flex flex-col space-y-2 order-2">
                    <div className="text-2xl text-gray-600">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 19.168H13.8333V18.3346H7.16667V19.168H5.5V18.3346H4.66667C3.74583 18.3346 3 17.5888 3 16.668V5.83464C3 4.9138 3.74583 4.16797 4.66667 4.16797H7.16667V2.5013C7.16667 2.0413 7.54 1.66797 8 1.66797H13C13.46 1.66797 13.8333 2.0413 13.8333 2.5013V4.16797H16.3333C17.2542 4.16797 18 4.9138 18 5.83464V16.668C18 17.5888 17.2542 18.3346 16.3333 18.3346H15.5V19.168ZM16.3333 5.83464H4.66667V16.668H16.3333V5.83464ZM8.83333 7.5013V15.0013H7.16667V7.5013H8.83333ZM13.8333 7.5013V15.0013H12.1667V7.5013H13.8333ZM12.1667 3.33464H8.83333V4.16797H12.1667V3.33464Z" fill="#101828" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Investment Type</div>
                    <div className="flex gap-2 flex-wrap">
                        {profileData?.InvestorType?.split('|').map(type => (
                            <span key={type} className="px-3 py-1 text-sm text-[#1B3D86] bg-[#EAF0FE] rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 mx-1 bg-[#1B3D86] rounded-full inline-block" />
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Investment Stage */}
                <div className="flex flex-col space-y-2 order-3">
                    <div className="text-2xl text-gray-600">
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.99935 3C7.90768 3 10.3185 5.12833 10.7602 7.9125C11.7393 6.93667 13.091 6.33333 14.5827 6.33333H18.3327V8.41667C18.3327 11.4083 15.9077 13.8333 12.916 13.8333H10.8327V18H9.16602V11.3333H7.49935C4.27768 11.3333 1.66602 8.72167 1.66602 5.5V3H4.99935ZM16.666 8H14.5827C12.5118 8 10.8327 9.67917 10.8327 11.75V12.1667H12.916C14.9868 12.1667 16.666 10.4875 16.666 8.41667V8ZM4.99935 4.66667H3.33268V5.5C3.33268 7.80083 5.19852 9.66667 7.49935 9.66667H9.16602V8.83333C9.16602 6.5325 7.30018 4.66667 4.99935 4.66667Z" fill="#101828" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Investment Stage</div>
                    <div className="flex gap-2 flex-wrap ">
                        {profileData?.InvestmentStage?.split('|').map(stage => (
                            <span key={stage} className="px-3 py-1 text-sm text-[#1B3D86] bg-[#EAF0FE] rounded-full">{stage}</span>
                        ))}
                    </div>
                </div>

                {/* Geography of Service */}
                <div className="flex flex-col space-y-2 order-4">
                    <div className="text-2xl text-gray-600">
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.99935 2.16797C12.0837 4.44993 13.2683 7.41133 13.3327 10.5013C13.2683 13.5913 12.0837 16.5527 9.99935 18.8346M9.99935 2.16797C7.91495 4.44993 6.73039 7.41133 6.66602 10.5013C6.73039 13.5913 7.91495 16.5527 9.99935 18.8346M9.99935 2.16797C5.39698 2.16797 1.66602 5.89893 1.66602 10.5013C1.66602 15.1037 5.39698 18.8346 9.99935 18.8346M9.99935 2.16797C14.6017 2.16797 18.3327 5.89893 18.3327 10.5013C18.3327 15.1037 14.6017 18.8346 9.99935 18.8346M2.0827 8.0013H17.916M2.08268 13.0013H17.916" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Geography of Service</div>
                    <div className="flex gap-2 flex-wrap ">
                        {profileData?.GeographyOfService?.split('|').map(loc => (
                            <span key={loc} className="px-3 py-1 text-sm text-[#1B3D86] bg-[#EAF0FE] rounded-full flex items-center gap-1">
                                <ProfileFlag location={loc.trim()} />
                                {loc.trim()}
                            </span>
                        ))}
                    </div>
                </div>

            </div>


        </div>
    );
};

export default InvestorProfile;