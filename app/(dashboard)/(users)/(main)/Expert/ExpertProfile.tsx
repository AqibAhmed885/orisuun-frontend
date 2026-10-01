'use client';

import { RootState } from '@/data/store';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import ProfileFlag from '../Investor/ProfileFlag'
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
    'Strategy Consultant': <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.53395 1.70005C5.5839 1.69987 5.5839 1.69987 5.63486 1.69969C5.72647 1.69944 5.81807 1.69953 5.90968 1.69977C6.0088 1.69994 6.10792 1.69967 6.20704 1.69946C6.40089 1.69912 6.59475 1.6992 6.7886 1.69942C6.94624 1.69959 7.10388 1.69961 7.26152 1.69953C7.284 1.69952 7.30648 1.69951 7.32964 1.69949C7.37532 1.69947 7.421 1.69945 7.46668 1.69942C7.89451 1.6992 8.32234 1.69945 8.75016 1.69986C9.11678 1.7002 9.48339 1.70014 9.85001 1.69979C10.2763 1.69938 10.7026 1.69922 11.1289 1.69946C11.1745 1.69948 11.22 1.69951 11.2655 1.69953C11.2991 1.69955 11.2991 1.69955 11.3333 1.69957C11.4907 1.69963 11.648 1.69952 11.8053 1.69934C11.9972 1.69913 12.1891 1.69919 12.381 1.69959C12.4788 1.69979 12.5766 1.69987 12.6744 1.69962C12.7807 1.69935 12.887 1.69967 12.9932 1.70005C13.0238 1.69988 13.0543 1.69971 13.0858 1.69954C13.5604 1.70281 13.9688 1.86968 14.3078 2.17841C14.65 2.52502 14.7882 2.91251 14.786 3.37606C14.786 3.41103 14.786 3.44601 14.7861 3.48099C14.7862 3.57674 14.786 3.67248 14.7857 3.76822C14.7855 3.87161 14.7856 3.97499 14.7856 4.07838C14.7857 4.25738 14.7855 4.43638 14.7852 4.61539C14.7847 4.87419 14.7846 5.13299 14.7845 5.3918C14.7844 5.81172 14.7841 6.23163 14.7835 6.65155C14.783 7.0594 14.7827 7.46726 14.7824 7.87511C14.7824 7.90052 14.7824 7.92592 14.7824 7.9521C14.7823 8.1508 14.7822 8.3495 14.7821 8.54819C14.7815 9.52175 14.7804 10.4953 14.7794 11.4689C13.2287 11.4689 11.6779 11.4689 10.0802 11.4689C10.0533 11.3934 10.0264 11.3179 9.99872 11.2401C9.86198 10.8858 9.69052 10.5634 9.4283 10.2744C9.41254 10.256 9.39678 10.2376 9.38055 10.2186C8.89479 9.67284 8.19719 9.44422 7.47255 9.33406C7.51227 9.25582 7.55898 9.19171 7.61718 9.12414C7.9491 8.73838 8.16898 8.29171 8.28744 7.80919C8.39221 7.82346 8.4397 7.86613 8.51316 7.93548C8.53599 7.95685 8.55882 7.97821 8.58235 8.00023C8.60674 8.02345 8.63113 8.04666 8.65627 8.07059C8.68144 8.09424 8.70661 8.1179 8.73254 8.14227C8.79934 8.20507 8.8659 8.26809 8.93241 8.33116C9.00037 8.39552 9.06855 8.45966 9.13672 8.52383C9.27036 8.64968 9.40373 8.77577 9.53695 8.90201C9.63099 8.8642 9.69158 8.81434 9.76349 8.74666C9.78687 8.72478 9.81025 8.7029 9.83434 8.68035C9.86004 8.65605 9.88572 8.63175 9.91141 8.60745C9.93862 8.58189 9.96585 8.55635 9.99308 8.53081C10.0516 8.47586 10.1101 8.42083 10.1685 8.36573C10.2608 8.27869 10.3533 8.19184 10.4459 8.10502C10.6422 7.92079 10.8383 7.73634 11.0343 7.55187C11.2461 7.35256 11.458 7.15328 11.6702 6.95425C11.7622 6.86786 11.8541 6.78135 11.946 6.69474C12.003 6.64102 12.0601 6.5874 12.1173 6.53381C12.1439 6.50885 12.1704 6.48385 12.1968 6.45881C12.2329 6.42475 12.2691 6.39086 12.3053 6.35698C12.3255 6.33793 12.3457 6.31888 12.3666 6.29926C12.4162 6.25891 12.4162 6.25891 12.4706 6.25891C12.4706 6.72019 12.4706 7.18146 12.4706 7.65671C12.8471 7.65671 13.2235 7.65671 13.6114 7.65671C13.6097 7.25824 13.6097 7.25824 13.6071 6.85978C13.6058 6.69704 13.6046 6.53431 13.6041 6.37157C13.6036 6.24023 13.6027 6.10891 13.6014 5.97757C13.601 5.92769 13.6008 5.87782 13.6008 5.82794C13.6004 5.42119 13.5685 5.0679 13.2583 4.75559C13.0055 4.52875 12.7326 4.45148 12.3912 4.44927C12.3671 4.44902 12.343 4.44877 12.3181 4.44851C12.2386 4.44771 12.1591 4.44708 12.0796 4.44645C12.0243 4.44593 11.9691 4.44539 11.9139 4.44485C11.7687 4.44345 11.6235 4.44219 11.4784 4.44096C11.3041 4.43946 11.1298 4.43778 10.9555 4.43613C10.6909 4.43364 10.4263 4.43138 10.1617 4.42908C10.1617 4.78132 10.1617 5.13356 10.1617 5.49648C10.6547 5.49648 11.1477 5.49648 11.6557 5.49648C11.4723 5.69662 11.4723 5.69662 11.4009 5.76331C11.3766 5.78613 11.3766 5.78613 11.3518 5.80941C11.3346 5.82541 11.3174 5.84141 11.2996 5.85789C11.2811 5.87526 11.2625 5.89264 11.2434 5.91055C11.1826 5.9674 11.1217 6.02416 11.0608 6.08091C11.0184 6.12054 10.976 6.16017 10.9337 6.19981C10.8225 6.30369 10.7113 6.40749 10.6001 6.51128C10.4864 6.61737 10.3728 6.72354 10.2592 6.8297C10.0366 7.03767 9.81399 7.24555 9.59128 7.45339C9.49796 7.41548 9.43475 7.36554 9.36153 7.29988C9.33777 7.27862 9.314 7.25737 9.28952 7.23547C9.18072 7.13664 9.07217 7.03758 8.96412 6.93803C8.9075 6.88595 8.85045 6.83433 8.79295 6.78309C8.42812 6.35699 8.34982 6.1836 8.06105 5.80311C7.74976 5.39294 7.57636 5.04489 7.25524 4.75946C7.23903 4.74472 7.22282 4.72998 7.20612 4.71479C6.76876 4.33186 6.20519 4.09311 5.62545 3.97162C5.58328 3.96228 5.58328 3.96228 5.54025 3.95275C4.99612 3.85352 4.41646 3.91053 3.88977 4.05928C3.83269 4.07327 3.83269 4.07327 3.7512 4.07327C3.74846 3.95042 3.74652 3.82759 3.74523 3.70472C3.74469 3.66312 3.74395 3.62152 3.743 3.57993C3.73141 3.06091 3.84128 2.57929 4.23696 2.19232C4.59742 1.85392 5.02622 1.69723 5.53395 1.70005Z" fill="#2357C6" />
        <path d="M2.72538 10.6283C2.77428 10.6281 2.82317 10.6279 2.87206 10.6277C3.00392 10.6272 3.13577 10.6272 3.26762 10.6274C3.37811 10.6275 3.4886 10.6273 3.5991 10.6272C3.85997 10.6268 4.12085 10.6268 4.38173 10.6271C4.64994 10.6274 4.91814 10.6271 5.18635 10.6263C5.4175 10.6257 5.64865 10.6255 5.8798 10.6257C6.01747 10.6258 6.15514 10.6257 6.29281 10.6253C6.42236 10.6248 6.5519 10.6249 6.68144 10.6255C6.72868 10.6256 6.77591 10.6255 6.82315 10.6252C7.37352 10.6221 7.84499 10.7542 8.24715 11.1616C9.20247 12.2012 8.71653 14.2424 8.71653 15.2974C6.09402 15.2974 3.47151 15.2974 0.769531 15.2974C0.769531 11.6489 0.769531 11.6489 1.27452 11.1296C1.29282 11.1102 1.31112 11.0908 1.32997 11.0709C1.72272 10.6818 2.20658 10.6268 2.72538 10.6283Z" fill="#2357C6" />
        <path d="M6.4118 5.23756C6.92726 5.66831 7.28105 6.25113 7.3472 6.92745C7.39771 7.68864 7.20614 8.36537 6.70319 8.95371C6.28001 9.41635 5.67798 9.7314 5.04763 9.77317C4.30644 9.8062 3.65197 9.62223 3.0894 9.13023C2.61644 8.68334 2.28457 8.10257 2.25837 7.44196C2.25766 7.37588 2.25764 7.30979 2.25825 7.24371C2.25852 7.2088 2.25878 7.17388 2.25906 7.13791C2.27292 6.43867 2.57329 5.84021 3.0672 5.34995C3.23097 5.19417 3.40647 5.07997 3.60701 4.97435C3.63346 4.96016 3.6599 4.94597 3.68714 4.93135C4.57032 4.49441 5.64314 4.64537 6.4118 5.23756Z" fill="#2357C6" />
    </svg>
    ,
    Investor: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
    Advocate: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Partner: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Admin: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    SystemAdmin: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
};

const ExpertProfile = ({ profileData }) => {
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
        <div className="w-full  relative">
            {/* Main container */}
            <div className="max-full mx-auto ">
                {/* Banner section */}
                <div className="w-full bg-gray-100 border-2 sm:rounded-t-2xl border-[#F9FAFB] h-80 aspect-[3200/560] relative">
                    {profileData?.BannerPicture ? (
                        <Image
                            src={profileData?.BannerPicture}
                            alt="Banner"
                            className="w-full h-full object-cover sm:rounded-t-2xl"
                            width={3200}
                            height={410}
                        />
                    ) : (
                        <div className="absolute inset-0 border flex flex-col items-center justify-center text-gray-500 bg-gray-300">
                            {isShow && (
                                <>
                                    <p className="text-xl mb-1 font-semibold text-[#1D2939]">Upload Banner Image</p>
                                    <p className="text-lg mb-3">Optimal dimensions: 3200 x 410px</p>
                                </>
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
            {/* Profile content */}
            <div className="mx-9  relative flex flex-col border border-gray-200 pb-5 lg:flex-row bg-white  rounded-b-xl  lg:rounded-xl gap-2 px-10 lg:mx-10  sm:pt-6 lg:-mt-20">
                <div className="flex flex-col md:flex-row justify-between gap-4 w-full mx-auto">
                    {/* Left Section */}
                    <div className="flex flex-col md:flex-row gap-4 ">
                        <div className='relative  -mt-[15%]'>
                            <svg width="240" height="220" viewBox="0 0 180 180" fill="none">
                                <defs>
                                    <clipPath id="bgblur_0_1_46_clip_path" transform="translate(0 8)">
                                        <path d="M8 70C8 31.3401 39.3401 0 78 0H90H102C140.66 0 172 31.3401 172 70V90V110C172 148.66 140.66 180 102 180H90H78C39.3401 180 8 148.66 8 110V90V70Z" />
                                    </clipPath>
                                    <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="183" height="180">
                                        <image
                                            href={profileData?.ProfilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}  // <-- Replace this with your actual image path or URL
                                            x="0"
                                            y="0"
                                            width="183"
                                            height="180"
                                            preserveAspectRatio="xMidYMid slice"
                                        />
                                    </pattern>
                                </defs>

                                <foreignObject x="0" y="-8" width="180" height="196">
                                    <div
                                        style={{
                                            backdropFilter: 'blur(4px)',
                                            clipPath: 'url(#bgblur_0_1_46_clip_path)',
                                            height: '100%',
                                            width: '100%',
                                        }}
                                    />
                                </foreignObject>

                                <path
                                    data-figma-bg-blur-radius="8"
                                    d="M8 70C8 31.3401 39.3401 0 78 0H90H102C140.66 0 172 31.3401 172 70V90V110C172 148.66 140.66 180 102 180H90H78C39.3401 180 8 148.66 8 110V90V70Z"
                                    fill="white"
                                    fillOpacity="0.2"
                                />
                                <path
                                    d="M96 8C132.451 8 162 37.5492 162 74V106C162 142.451 132.451 172 96 172H84C47.5492 172 18 142.451 18 106V74C18 37.5492 47.5492 8 84 8H96Z"
                                    fill="url(#imagePattern)"
                                    stroke="#F2F4F7"
                                    strokeWidth="4"
                                />
                                {checkOnlineStatus(profileData.LastActive) ===
                                    'online' ? (
                                    <g transform="translate(139, 139)">
                                        <rect x="0" y="0" width="20" height="20" rx="12.5781" fill="#17B26A" />
                                        <rect x="0" y="0" width="20" height="20" rx="12.5781" stroke="white" strokeWidth="2.15625" />
                                    </g>
                                ) : (
                                    <g transform="translate(139, 139)">
                                        <rect x="0" y="0" width="20" height="20" rx="12.5781" fill="#D0D5DD" />
                                        <rect x="0" y="0" width="26.1562" height="20" rx="12.5781" stroke="white" strokeWidth="2.15625" />
                                    </g>
                                )}


                            </svg>
                            {/* online dot */}

                            <div className="hidden lg:flex justify-center items-center mb-2 gap-3 text-sm">
                                <span className="bg-[#f5f8ff] px-3 py-2 rounded-lg flex gap-2">
                                    {flagUrl && (
                                        <Image
                                            src={flagUrl}
                                            alt={profileData?.CountryName || 'Country flag'}
                                            width={20}
                                            height={15}
                                            className="w-5 h-4 object-cover rounded-sm"
                                        />
                                    )}

                                    <span>{profileData?.CountryName || 'Not Notspecified'}</span>
                                </span>
                            </div>
                        </div>
                        {/* country location mobile layout*/}
                        <div>

                            <div className="flex lg:hidden items-center gap-3 text-sm">
                                <span className="flex justify-center items-center gap-2 bg-[#f5f8ff] px-3 py-2 rounded-lg">
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
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                                    </svg>

                                    {profileData?.CityName || "Not specified"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 mb-1 ">

                                    <h1 className="text-xl sm:text-2xl font-semibold py-2 mt-1">{profileData?.CompanyName}</h1>
                                    {
                                        profileData?.ProfileVerified &&
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
                                    }

                                </div>
                            </div>
                            <div>
                                <span className="bg-[#ECF4FB] border border-[#B2DDFF] text-[#102A56] px-3 py-[2px] rounded-2xl inline-flex items-center gap-1">
                                    {TypeIcons[profileData?.UserProfileType as keyof typeof TypeIcons]}
                                    {profileData?.UserProfileType}
                                </span>
                                <p className="text-lg text-gray-600 mb-2 pt-2">{profileData?.Tagline || 'Empowering Black-owned businesses through expert legal counsel and strategic guidance'}</p>
                            </div>
                            <div className="hidden lg:flex items-center mb-2 gap-3 text-sm">
                                {/* <span className="flex justify-center items-center gap-2 bg-[#f5f8ff] px-3 py-2 rounded-lg">
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
                                </span> */}
                                <span className="flex items-center gap-1">
                                    <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                                    </svg>

                                    {profileData?.CityName || "Not specified"}
                                </span>
                                <a href={profileData?.WebsiteUrl} className="text-[#2357C6] text-sm font-semibold inline-flex items-center gap-1 hover:underline underline">
                                    Visit Website
                                    <svg width="10" className='ml-2' height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.833496 9.16536L9.16683 0.832031M9.16683 0.832031H0.833496M9.16683 0.832031V9.16536" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </a>
                            </div>

                            <p className="font-semibold py-2">{followerCount}<span className="font-medium pl-1 text-gray-600">Followers</span></p>



                            {/* follow chat mobile btn layout */}
                            {!isShow && (
                                <>
                                    <div className="lg:hidden grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6  pt-4">
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
                                    <a href={profileData?.WebsiteUrl} className="lg:hidden pt-8 mb-2 text-[#2357C6] text-sm font-semibold inline-flex items-center gap-1 hover:underline underline">
                                        Visit Website
                                        <svg width="10" className='ml-2' height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.833496 9.16536L9.16683 0.832031M9.16683 0.832031H0.833496M9.16683 0.832031V9.16536" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </a>
                                </>
                            )}

                            <div className="lg:hidden  flex gap-2  absolute right-10 top-[2vh]">
                                {!isShow && (
                                    <button
                                        className="px-4 py-2 flex justify-center items-center gap-1"
                                        onClick={() => setFavourite(profileData)}
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
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.4987 17.999H10.8321M2.08203 18.4156L6.70642 16.637C7.00221 16.5232 7.1501 16.4664 7.28846 16.3921C7.41137 16.3261 7.52853 16.25 7.63873 16.1645C7.7628 16.0682 7.87484 15.9561 8.09893 15.7321L17.4987 6.33228C18.4192 5.41181 18.4192 3.91943 17.4987 2.99895C16.5782 2.07848 15.0859 2.07847 14.1654 2.99895L4.7656 12.3987C4.54151 12.6228 4.42947 12.7348 4.33319 12.8589C4.24768 12.9691 4.17153 13.0863 4.10556 13.2092C4.03129 13.3476 3.97441 13.4954 3.86064 13.7912L2.08203 18.4156ZM2.08203 18.4156L3.79713 13.9564C3.91986 13.6373 3.98123 13.4778 4.08648 13.4047C4.17846 13.3408 4.29228 13.3167 4.40228 13.3377C4.52814 13.3617 4.64902 13.4826 4.89077 13.7243L6.77334 15.6069C7.01509 15.8487 7.13597 15.9695 7.16 16.0954C7.18101 16.2054 7.15685 16.3192 7.09299 16.4112C7.0199 16.5164 6.86035 16.5778 6.54126 16.7005L2.08203 18.4156Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        Edit Information
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                {/* Right Section */}
                <div className="w-full hidden lg:block ">
                    {/* Large screen follow/chat/fav buttons */}
                    <div className="absolute top-0 right-0 mt-7 mr-3 z-10">
                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex flex-col gap-4">
                                {/* Follow Button */}
                                {!isShow && (
                                    <button
                                        className="w-44 flex items-center gap-2 justify-center py-2 bg-[#2357C6] text-white text-sm font-semibold rounded-md hover:bg-[#1e4bb2] transition-colors"
                                        onClick={handleToggleFollow}
                                        disabled={followLoading}
                                    >
                                        <svg className='w-5 h-5' viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.8332 6.33301V1.33301M13.3332 3.83301H18.3332M13.3332 15.4997V14.4997C13.3332 13.0995 13.3332 12.3995 13.0607 11.8647C12.821 11.3943 12.4386 11.0118 11.9681 10.7722C11.4334 10.4997 10.7333 10.4997 9.33317 10.4997H5.6665C4.26637 10.4997 3.56631 10.4997 3.03153 10.7722C2.56112 11.0118 2.17867 11.3943 1.93899 11.8647C1.6665 12.3995 1.6665 13.0995 1.6665 14.4997V15.4997M10.4165 4.24967C10.4165 5.86051 9.11067 7.16634 7.49984 7.16634C5.88901 7.16634 4.58317 5.86051 4.58317 4.24967C4.58317 2.63884 5.88901 1.33301 7.49984 1.33301C9.11067 1.33301 10.4165 2.63884 10.4165 4.24967Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                                    </button>
                                )}

                                {/* Chat Button */}
                                {!isShow && (
                                    <button
                                        className="w-44 flex justify-center items-center gap-2  py-2 border border-[#D0D5DD] bg-white text-[#344054] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
                                        onClick={handleChatClick}
                                    >
                                        <svg className='w-5 h-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Chat
                                    </button>
                                )}

                                {/* Favorite or Edit Buttons */}
                                <div className="flex gap-2 ">
                                    {!isShow && (
                                        <button className="w-48 px-5 flex justify-center items-center" onClick={() => setFavourite(profileData)}>
                                            {isFavourite ? (
                                                <svg className='h-6 w-6' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.0002 12.6663L3.10186 15.658L4.43353 10.0747L0.0751953 6.34134L5.79603 5.88301L8.0002 0.583008L10.2044 5.88301L15.926 6.34134L11.5669 10.0747L12.8985 15.658L8.0002 12.6663Z" fill="#3B82F6" />
                                                </svg>
                                            ) : (
                                                <svg className='w-6 h-6' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.99922 14.1654L5.10089 17.157L6.43255 11.5737L2.07422 7.84036L7.79505 7.38203L9.99922 2.08203L12.2034 7.38203L17.9251 7.84036L13.5659 11.5737L14.8976 17.157L9.99922 14.1654ZM9.99922 12.212L12.3467 13.6454L11.7084 10.9704L13.7976 9.1812L11.0559 8.9612L9.99922 6.42203L8.94255 8.9612L6.20088 9.1812L8.29005 10.9704L7.65172 13.6454L9.99922 12.2129V12.212Z" fill="#667085" />
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
                                                router.push(`/profile/edit-profile/${add2040ToProfileDetailsId(currentUser?.UserProfileDetailsId)}`)
                                            }
                                            className="flex mr-4 items-center gap-2 px-4 py-2 bg-[#2357C6] font-semibold text-white rounded-md hover:bg-[#658ce0] transition-colors"
                                        >
                                            <svg className='h-6 w-6' viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.4987 17.999H10.8321M2.08203 18.4156L6.70642 16.637C7.00221 16.5232 7.1501 16.4664 7.28846 16.3921C7.41137 16.3261 7.52853 16.25 7.63873 16.1645C7.7628 16.0682 7.87484 15.9561 8.09893 15.7321L17.4987 6.33228C18.4192 5.41181 18.4192 3.91943 17.4987 2.99895C16.5782 2.07848 15.0859 2.07847 14.1654 2.99895L4.7656 12.3987C4.54151 12.6228 4.42947 12.7348 4.33319 12.8589C4.24768 12.9691 4.17153 13.0863 4.10556 13.2092C4.03129 13.3476 3.97441 13.4954 3.86064 13.7912L2.08203 18.4156ZM2.08203 18.4156L3.79713 13.9564C3.91986 13.6373 3.98123 13.4778 4.08648 13.4047C4.17846 13.3408 4.29228 13.3167 4.40228 13.3377C4.52814 13.3617 4.64902 13.4826 4.89077 13.7243L6.77334 15.6069C7.01509 15.8487 7.13597 15.9695 7.16 16.0954C7.18101 16.2054 7.15685 16.3192 7.09299 16.4112C7.0199 16.5164 6.86035 16.5778 6.54126 16.7005L2.08203 18.4156Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>

                                            Edit Information
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:grid grid-cols-4 gap-6 p-6 mx-10 mt-6 bg-white rounded-2xl shadow">

                {/* Years of Experience */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-5 w-5' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3346 9.16667H15.3346C16.2681 9.16667 16.7348 9.16667 17.0913 9.34832C17.4049 9.50811 17.6599 9.76308 17.8196 10.0767C18.0013 10.4332 18.0013 10.8999 18.0013 11.8333V17.5M11.3346 17.5V5.16667C11.3346 4.23325 11.3346 3.76654 11.153 3.41002C10.9932 3.09641 10.7382 2.84144 10.4246 2.68166C10.0681 2.5 9.60139 2.5 8.66797 2.5H5.66797C4.73455 2.5 4.26784 2.5 3.91132 2.68166C3.59771 2.84144 3.34275 3.09641 3.18296 3.41002C3.0013 3.76654 3.0013 4.23325 3.0013 5.16667V17.5M18.8346 17.5H2.16797M5.91797 5.83333H8.41797M5.91797 9.16667H8.41797M5.91797 12.5H8.41797" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                    </div>
                    <div className="text-sm text-gray-500 font-medium">Years of Experience</div>
                    <div className="text-3xl font-bold text-gray-900">{profileData?.YearsOfExperience || '0'}</div>
                </div>

                {/* focus */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-5 w-5' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.83594 6.5C4.83594 5.09987 4.83594 4.3998 5.10842 3.86502C5.3481 3.39462 5.73056 3.01217 6.20096 2.77248C6.73574 2.5 7.43581 2.5 8.83594 2.5H12.5026C13.9027 2.5 14.6028 2.5 15.1376 2.77248C15.608 3.01217 15.9904 3.39462 16.2301 3.86502C16.5026 4.3998 16.5026 5.09987 16.5026 6.5V17.5L10.6693 14.1667L4.83594 17.5V6.5Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                    </div>
                    <div className="text-sm text-gray-500 font-medium">Focus</div>
                    <div className="text-3xl font-bold text-gray-900r">
                        {profileData?.Focus || 'Not specified'}
                    </div>
                </div>

                {/* Geography */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.99843 15.8336V10.0003M10.2413 15.9041L16.0567 17.851C16.5125 18.0035 16.7404 18.0798 16.8809 18.0251C17.0029 17.9775 17.0955 17.8754 17.1309 17.7493C17.1716 17.6041 17.0733 17.3848 16.8768 16.9462L10.6364 3.01891C10.4442 2.58999 10.3481 2.37553 10.2143 2.30908C10.098 2.25135 9.96139 2.25113 9.84491 2.30849C9.71084 2.37451 9.61405 2.58866 9.42049 3.01696L3.12508 16.947C2.927 17.3853 2.82796 17.6044 2.86823 17.7498C2.90321 17.8761 2.99552 17.9785 3.11745 18.0264C3.25786 18.0815 3.4861 18.0058 3.94259 17.8543L9.8197 15.9036C9.89795 15.8776 9.93708 15.8646 9.9771 15.8595C10.0126 15.855 10.0486 15.855 10.0841 15.8597C10.1241 15.8649 10.1632 15.878 10.2413 15.9041Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div className="text-sm text-gray-500 font-medium">Geography</div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {profileData?.Geography?.split('|').map((type, index, arr) => (
                            <div key={index} className="text-3xl font-bold text-gray-900">
                                {type ? type + (index !== arr.length - 1 ? ',' : '') : 'Not specified'}
                            </div>
                        ))}

                    </div>
                </div>

                {/* Client Served */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl text-gray-600">
                        <svg className='h-5 w-5' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5013 14.168V15.8346C14.5013 16.0556 14.5891 16.2676 14.7454 16.4239C14.9017 16.5802 15.1136 16.668 15.3346 16.668C15.5556 16.668 15.7676 16.5802 15.9239 16.4239C16.0802 16.2676 16.168 16.0556 16.168 15.8346V3.33464H4.5013V12.5013H2.83464V2.5013C2.83464 2.28029 2.92243 2.06833 3.07871 1.91205C3.23499 1.75577 3.44695 1.66797 3.66797 1.66797H17.0013C17.2223 1.66797 17.4343 1.75577 17.5906 1.91205C17.7468 2.06833 17.8346 2.28029 17.8346 2.5013V15.8346C17.8346 16.4977 17.5712 17.1336 17.1024 17.6024C16.6336 18.0712 15.9977 18.3346 15.3346 18.3346H3.66797C3.00493 18.3346 2.36904 18.0712 1.9002 17.6024C1.43136 17.1336 1.16797 16.4977 1.16797 15.8346V14.168H14.5013Z" fill="#101828" />
                        </svg>


                    </div>
                    <div className="text-sm text-gray-500 font-medium">Publications</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {profileData?.Publications}
                    </div>
                </div>
            </div>
            {/* experience,focus etc.... mobile layout*/}
            <div className="mx-10 lg:hidden bg-white mt-6">
                <div className='border rounded-xl p-5 shadow-[#1018280D]'>
                    <div className="flex justify-between p-2 items-center ">
                        <div className="space-y-10">
                            <div className='flex flex-col justify-center items-center space-y-2'>
                                <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.8346 9.16667H14.8346C15.7681 9.16667 16.2348 9.16667 16.5913 9.34832C16.9049 9.50811 17.1599 9.76308 17.3196 10.0767C17.5013 10.4332 17.5013 10.8999 17.5013 11.8333V17.5M10.8346 17.5V5.16667C10.8346 4.23325 10.8346 3.76654 10.653 3.41002C10.4932 3.09641 10.2382 2.84144 9.92462 2.68166C9.5681 2.5 9.10139 2.5 8.16797 2.5H5.16797C4.23455 2.5 3.76784 2.5 3.41132 2.68166C3.09771 2.84144 2.84275 3.09641 2.68296 3.41002C2.5013 3.76654 2.5013 4.23325 2.5013 5.16667V17.5M18.3346 17.5H1.66797M5.41797 5.83333H7.91797M5.41797 9.16667H7.91797M5.41797 12.5H7.91797" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className="text-gray-500 text-sm font-medium">Years of Experience</p>
                                <p className="text-2xl font-bold">25+</p>
                            </div>
                            <div className='flex flex-col justify-center items-center space-y-2'>
                                <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1141_236222)">
                                        <path d="M6.2513 10.0013L8.7513 12.5013L13.7513 7.5013M18.3346 10.0013C18.3346 14.6037 14.6037 18.3346 10.0013 18.3346C5.39893 18.3346 1.66797 14.6037 1.66797 10.0013C1.66797 5.39893 5.39893 1.66797 10.0013 1.66797C14.6037 1.66797 18.3346 5.39893 18.3346 10.0013Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1141_236222">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <p className="text-gray-500 text-sm font-medium">Success Rate</p>
                                <p className="text-2xl font-bold">86%</p>
                            </div>
                        </div>

                        <div className="space-y-10 ">
                            <div className='flex flex-col justify-center items-center space-y-2'>
                                <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0013 18.3346C5.3988 18.3346 1.66797 14.6038 1.66797 10.0013C1.66797 5.3988 5.3988 1.66797 10.0013 1.66797C14.6038 1.66797 18.3346 5.3988 18.3346 10.0013C18.3346 14.6038 14.6038 18.3346 10.0013 18.3346ZM5.84547 15.2146C7.02509 16.1577 8.49103 16.6704 10.0013 16.668C11.643 16.668 13.1455 16.0746 14.3071 15.0913C13.7644 14.5344 13.1155 14.092 12.3988 13.7903C11.6822 13.4886 10.9122 13.3336 10.1346 13.3346C9.32846 13.3337 8.53089 13.5003 7.79252 13.824C7.05416 14.1476 6.39112 14.6212 5.84547 15.2146ZM4.6813 14.018C5.38168 13.2747 6.22686 12.6827 7.16475 12.2786C8.10264 11.8744 9.11337 11.6666 10.1346 11.668C11.1193 11.6667 12.0946 11.8599 13.0044 12.2366C13.9142 12.6133 14.7407 13.166 15.4363 13.863C16.1497 12.8589 16.571 11.6768 16.6534 10.4479C16.7359 9.21896 16.4763 7.99121 15.9034 6.90085C15.3305 5.81049 14.4667 4.90015 13.4079 4.27084C12.3491 3.64152 11.1367 3.31783 9.90514 3.33568C8.67357 3.35352 7.47102 3.71221 6.4309 4.37193C5.39079 5.03166 4.55377 5.96664 4.01271 7.07314C3.47166 8.17964 3.24771 9.4144 3.36573 10.6404C3.48375 11.8665 3.93911 13.0358 4.6813 14.0188V14.018ZM10.0013 10.8346C9.11725 10.8346 8.2694 10.4834 7.64428 9.85833C7.01916 9.2332 6.66797 8.38536 6.66797 7.5013C6.66797 6.61725 7.01916 5.7694 7.64428 5.14428C8.2694 4.51916 9.11725 4.16797 10.0013 4.16797C10.8854 4.16797 11.7332 4.51916 12.3583 5.14428C12.9834 5.7694 13.3346 6.61725 13.3346 7.5013C13.3346 8.38536 12.9834 9.2332 12.3583 9.85833C11.7332 10.4834 10.8854 10.8346 10.0013 10.8346ZM10.0013 9.16797C10.4433 9.16797 10.8673 8.99237 11.1798 8.67981C11.4924 8.36725 11.668 7.94333 11.668 7.5013C11.668 7.05927 11.4924 6.63535 11.1798 6.32279C10.8673 6.01023 10.4433 5.83464 10.0013 5.83464C9.55928 5.83464 9.13535 6.01023 8.82279 6.32279C8.51023 6.63535 8.33464 7.05927 8.33464 7.5013C8.33464 7.94333 8.51023 8.36725 8.82279 8.67981C9.13535 8.99237 9.55928 9.16797 10.0013 9.16797Z" fill="#667085" />
                                </svg>
                                <p className="text-gray-500 text-sm font-medium">Client Served</p>
                                <p className="text-2xl font-bold text">150+</p>
                            </div>

                            <div className='flex flex-col justify-center items-center space-y-2'>
                                <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6654 17.5C16.6654 16.337 16.6654 15.7555 16.5218 15.2824C16.1987 14.217 15.365 13.3834 14.2996 13.0602C13.8265 12.9167 13.245 12.9167 12.082 12.9167H7.91537C6.7524 12.9167 6.17091 12.9167 5.69775 13.0602C4.63241 13.3834 3.79873 14.217 3.47556 15.2824C3.33203 15.7555 3.33203 16.337 3.33203 17.5M13.7487 6.25C13.7487 8.32107 12.0698 10 9.9987 10C7.92763 10 6.2487 8.32107 6.2487 6.25C6.2487 4.17893 7.92763 2.5 9.9987 2.5C12.0698 2.5 13.7487 4.17893 13.7487 6.25Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className="text-gray-500 text-sm font-medium">Status</p>
                                <p className="text-2xl font-bold ">Available</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ExpertProfile;