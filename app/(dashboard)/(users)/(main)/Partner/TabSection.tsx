'use client'
import React, { act, useEffect, useState } from 'react';
import SocialMediaIcon, { hasSocialMediaAsset } from '@/components/profile/SocialMediaIcon';
import OpportunityCard from '../Bob/components/tabsection/opportunities/OpportunityCard';
import Fundraising from '../Bob/components/tabsection/fundraising/Fundraising';
import CampaignDetails from '../Bob/components/tabsection/fundraising/CampaignDetails';
import Sponser from '../Bob/components/tabsection/fundraising/Sponser';
import RecentContibution from '../Bob/components/tabsection/fundraising/RecentContibution';
import Reward from '../Bob/components/tabsection/fundraising/Reward';
import CampaignUpdates from '../Bob/components/tabsection/fundraising/CampaignUpdates';
import AboutCompany from '../Bob/components/tabsection/overview/AboutCompany';
import { apiEndpoint } from '@/utils/utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ExperienceSection from '../Investor/ExperienceSection'
import Education from '../Investor/Education'
import Publications from '../Investor/Publications'
import Skills from '../Investor/Skills'
import RecognitionAwards from '../Investor/RecognitionAwards'
import TestimonialCard from '../Investor/TestimonialCard';
import Consultations from '../Professional/components/consultations';
import { useProfileViewState } from '@/hooks/useProfileViewState';
import type { ProfileTab } from '@/data/slices/profile-view-slice';
const TabSection = ({ profileData, UserProfileDetailId }) => {

    const [campaignDetails, setCampaignDetails] = useState<any>(null);
    const { activeTab, containerRef, setActiveTab } = useProfileViewState(
        profileData?.UserId || profileData?.userId
    );
    const router = useRouter();
    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
    const handleClick = () => {
        router.push('/fundraising/sponsor');
    };

    const fetchCampaignDetails = async () => {
        try {
            const response = await axios.get(
                `${apiEndpoint}/Campaign/GetCampaignDetails/${profileData?.CampaignId}`,
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (response.status === 200) {
                setCampaignDetails(response.data.Result);
            } else {
                toast.error('Failed to fetch campaign');
            }
        } catch (error) {
            toast.error('Error fetching campaign!');
            console.error('Error fetching campaign:', error);
        } finally {
        }
    };

    useEffect(() => {
        if (profileData?.CampaignId) fetchCampaignDetails();
    }, [profileData?.CampaignId]);

    const isVerified = !!profileData.ProfileVerified;
    const isCurrentUserAdvocate = currentUser?.UserProfileType === 'Advocate';

    const tabs: ProfileTab[] = isCurrentUserAdvocate
        ? ['Overview', 'Reviews', 'Consultations']
        : [
            'Overview',
            'Campaigns Sponsored',
            'Opportunities',
            'Reviews',
            'Consultations',
            ...(isVerified ? ['Fundraising' as const] : []),
        ];
    const galleryItems = [
        ...(profileData?.BusinessPhotos || []).map((photo, index) => ({
            type: 'photo',
            id: index + 1,
            title: `Business Photo ${index + 1}`,
            src: photo.ProfilePicture
        })),
        ...(profileData?.BusinessVideos || []).map((video, index) => ({
            type: 'video',
            id: index + 100,
            title: `Business Video ${index + 1}`,
            src: video.ProfileVideo
        }))
    ];
    const getSocialIcon = (type) => {
        if (hasSocialMediaAsset(type)) return <SocialMediaIcon platform={type} />;

        switch (type.toLowerCase()) {
            case 'youtube':
                return (
                    <svg className="w-4 h-4 text-[#2357C6]" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M549.7 124.1c-6.3-23.7-24.9-42.3-48.6-48.6C456.5 64 288 64 288 64S119.5 64 74.9 75.5C51.2 81.8 32.5 100.4 26.3 124.1 16 168.5 16 256 16 256s0 87.5 10.3 131.9c6.3 23.7 24.9 42.3 48.6 48.6C119.5 448 288 448 288 448s168.5 0 213.1-11.5c23.7-6.3 42.3-24.9 48.6-48.6C560 343.5 560 256 560 256s0-87.5-10.3-131.9zM232 336V176l142 80-142 80z" />
                    </svg>
                );
            case 'bluesky':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bluesky" viewBox="0 0 16 16">
                        <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
                    </svg>

                );
            case 'instagram':
                return (
                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 6.75C8.90326 6.75 8.33097 6.98705 7.90901 7.40901C7.48705 7.83097 7.25 8.40326 7.25 9C7.25 9.59674 7.48705 10.169 7.90901 10.591C8.33097 11.0129 8.90326 11.25 9.5 11.25C10.0967 11.25 10.669 11.0129 11.091 10.591C11.5129 10.169 11.75 9.59674 11.75 9C11.75 8.40326 11.5129 7.83097 11.091 7.40901C10.669 6.98705 10.0967 6.75 9.5 6.75ZM9.5 5.25C10.4946 5.25 11.4484 5.64509 12.1517 6.34835C12.8549 7.05161 13.25 8.00544 13.25 9C13.25 9.99456 12.8549 10.9484 12.1517 11.6517C11.4484 12.3549 10.4946 12.75 9.5 12.75C8.50544 12.75 7.55161 12.3549 6.84835 11.6517C6.14509 10.9484 5.75 9.99456 5.75 9C5.75 8.00544 6.14509 7.05161 6.84835 6.34835C7.55161 5.64509 8.50544 5.25 9.5 5.25ZM14.375 5.0625C14.375 5.31114 14.2762 5.5496 14.1004 5.72541C13.9246 5.90123 13.6861 6 13.4375 6C13.1889 6 12.9504 5.90123 12.7746 5.72541C12.5988 5.5496 12.5 5.31114 12.5 5.0625C12.5 4.81386 12.5988 4.5754 12.7746 4.39959C12.9504 4.22377 13.1889 4.125 13.4375 4.125C13.6861 4.125 13.9246 4.22377 14.1004 4.39959C14.2762 4.5754 14.375 4.81386 14.375 5.0625ZM9.5 3C7.6445 3 7.3415 3.00525 6.47825 3.0435C5.89025 3.07125 5.49575 3.15 5.12975 3.2925C4.80425 3.4185 4.5695 3.56925 4.31975 3.81975C4.08501 4.04655 3.90452 4.32344 3.79175 4.62975C3.64925 4.99725 3.5705 5.391 3.5435 5.97825C3.5045 6.80625 3.5 7.09575 3.5 9C3.5 10.8555 3.50525 11.1585 3.5435 12.0218C3.57125 12.609 3.65 13.0043 3.79175 13.3695C3.91925 13.6958 4.06925 13.9305 4.31825 14.1795C4.571 14.4315 4.80575 14.5823 5.12825 14.7068C5.49875 14.85 5.89325 14.9295 6.47825 14.9565C7.30625 14.9955 7.59575 15 9.5 15C11.3555 15 11.6585 14.9948 12.5218 14.9565C13.1083 14.9288 13.5035 14.85 13.8695 14.7083C14.1943 14.5815 14.4305 14.4308 14.6795 14.1818C14.9323 13.929 15.083 13.6943 15.2075 13.3718C15.35 13.002 15.4295 12.6068 15.4565 12.0218C15.4955 11.1938 15.5 10.9043 15.5 9C15.5 7.1445 15.4948 6.8415 15.4565 5.97825C15.4288 5.39175 15.35 4.99575 15.2075 4.62975C15.0945 4.32375 14.9143 4.04697 14.6803 3.81975C14.4536 3.58488 14.1766 3.40438 13.8703 3.29175C13.5028 3.14925 13.1083 3.0705 12.5218 3.0435C11.6938 3.0045 11.4043 3 9.5 3ZM9.5 1.5C11.5378 1.5 11.792 1.5075 12.5915 1.545C13.3903 1.5825 13.934 1.70775 14.4125 1.89375C14.9075 2.08425 15.3245 2.34225 15.7415 2.7585C16.1229 3.13342 16.418 3.58694 16.6063 4.0875C16.7915 4.56525 16.9175 5.10975 16.955 5.9085C16.9903 6.708 17 6.96225 17 9C17 11.0378 16.9925 11.292 16.955 12.0915C16.9175 12.8903 16.7915 13.434 16.6063 13.9125C16.4185 14.4133 16.1233 14.867 15.7415 15.2415C15.3665 15.6227 14.913 15.9178 14.4125 16.1063C13.9348 16.2915 13.3903 16.4175 12.5915 16.455C11.792 16.4903 11.5378 16.5 9.5 16.5C7.46225 16.5 7.208 16.4925 6.4085 16.455C5.60975 16.4175 5.066 16.2915 4.5875 16.1063C4.08674 15.9184 3.63315 15.6232 3.2585 15.2415C2.87705 14.8666 2.58195 14.4131 2.39375 13.9125C2.20775 13.4348 2.0825 12.8903 2.045 12.0915C2.00975 11.292 2 11.0378 2 9C2 6.96225 2.0075 6.708 2.045 5.9085C2.0825 5.109 2.20775 4.566 2.39375 4.0875C2.58143 3.58663 2.8766 3.13299 3.2585 2.7585C3.63325 2.37692 4.08682 2.0818 4.5875 1.89375C5.066 1.70775 5.609 1.5825 6.4085 1.545C7.208 1.50975 7.46225 1.5 9.5 1.5Z" fill="#2357C6" />
                    </svg>


                );
            case 'linkedin':
                return (
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5013 7.95964C11.2655 7.1788 12.2605 6.66797 13.418 6.66797C14.6335 6.66797 15.7993 7.15085 16.6589 8.0104C17.5184 8.86994 18.0013 10.0357 18.0013 11.2513V17.5013H16.3346V11.2513C16.3346 10.4778 16.0273 9.73589 15.4804 9.18891C14.9334 8.64193 14.1915 8.33464 13.418 8.33464C12.6444 8.33464 11.9026 8.64193 11.3556 9.18891C10.8086 9.73589 10.5013 10.4778 10.5013 11.2513V17.5013H8.83464V7.08464H10.5013V7.95964ZM4.66797 5.41797C4.33645 5.41797 4.01851 5.28627 3.78409 5.05185C3.54966 4.81743 3.41797 4.49949 3.41797 4.16797C3.41797 3.83645 3.54966 3.51851 3.78409 3.28409C4.01851 3.04966 4.33645 2.91797 4.66797 2.91797C4.99949 2.91797 5.31743 3.04966 5.55185 3.28409C5.78627 3.51851 5.91797 3.83645 5.91797 4.16797C5.91797 4.49949 5.78627 4.81743 5.55185 5.05185C5.31743 5.28627 4.99949 5.41797 4.66797 5.41797ZM3.83464 7.08464H5.5013V17.5013H3.83464V7.08464Z" fill="#2357C6" />
                    </svg>


                );
            case 'facebook':
                return (
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.332 7.5013H15.082L14.6654 9.16797H11.332V16.668H9.66536V9.16797H6.33203V7.5013H9.66536V5.9413C9.66536 4.45547 9.82036 3.9163 10.1104 3.37297C10.3945 2.83614 10.8335 2.39714 11.3704 2.11297C11.9137 1.82297 12.4529 1.66797 13.9387 1.66797C14.3737 1.66797 14.7554 1.70964 15.082 1.79297V3.33464H13.9387C12.8354 3.33464 12.4995 3.39964 12.157 3.58297C11.9037 3.71797 11.7154 3.9063 11.5804 4.15964C11.397 4.50214 11.332 4.83797 11.332 5.9413V7.5013Z" fill="#2357C6" />
                    </svg>


                );
            case 'twitter':
                return (
                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.1526 1.6875H16.6336L11.2134 7.8825L17.5899 16.3125H12.5971L8.68663 11.1997L4.21216 16.3125H1.72966L7.52716 9.68625L1.41016 1.6875H6.52966L10.0644 6.36075L14.1526 1.6875ZM13.2819 14.8275H14.6566L5.78266 3.0945H4.30741L13.2819 14.8275Z" fill="#2357C6" />
                    </svg>


                );
            case 'threads':
                return (
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M119.3 94.1C156.3 57 204.2 32 256 32c141.4 0 224 100.7 224 224s-82.6 224-224 224c-51.8 0-99.7-25-136.7-62.1-29.8-29.8-55.4-69.4-59.1-116.3-2.6-34 4.2-70.7 24.2-99.6 15.3-22.5 35.4-40.5 60.9-51.2 18.2-7.8 39.6-11.8 64.4-11.8 49.8 0 97.3 17.1 132.4 47.5 35.2 30.6 57.5 72.6 57.5 117.2 0 33.3-14.6 62.5-41.1 81.4-23.5 16.7-52.9 24.9-84.2 24.9-27.7 0-54.6-9.3-75.5-26.2-21.1-17-34.4-41.3-34.4-66.6 0-18.6 7.3-36.8 20.1-50.1 11.6-11.7 26.3-18.1 41.9-18.1 23.9 0 46.2 15.6 50.1 40.6 2.7 17.6-4.1 35.2-17.6 45.9-9.7 7.7-22.1 11.9-34.8 11.9-9.1 0-17.9-2.4-25.6-7 10.7 21.5 33.4 34.5 58.2 34.5 14.2 0 27.7-4.2 39.3-12.1 17.1-11.7 27-31 27-52.5 0-32.5-16.1-63.5-43.6-86.6-27.1-22.8-62.8-35.4-99.6-35.4-42.3 0-81.3 15.7-110.1 44.3C82.1 190.3 70.3 223.6 72.9 260c2.9 38.5 21.7 73.7 50.5 102.5C162.2 407.8 206.4 432 256 432c58.8 0 104.4-19.1 138.3-48.3C435.2 356 448 309.5 448 256s-12.8-100-53.7-140.7C353.4 75.3 306.7 56 256 56c-38.5 0-74.9 17.5-103.7 46.3l-33-8.2z" />
                    </svg>
                );
            case 'reddit':
                return (
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M440 128c-39.8 0-72 32.2-72 72 0 10.7 2.4 20.9 6.7 29.9C348.7 223.8 313.3 208 272 208s-76.7 15.8-102.7 41.9c4.3-9 6.7-19.2 6.7-29.9 0-39.8-32.2-72-72-72s-72 32.2-72 72 32.2 72 72 72c15.5 0 29.8-5 41.6-13.4 20.4 33.6 58.8 56.4 102.4 56.4s82-22.8 102.4-56.4c11.8 8.4 26.1 13.4 41.6 13.4 39.8 0 72-32.2 72-72s-32.2-72-72-72z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                );
        }
    };
    return (
        <div ref={containerRef} className="w-full scroll-mt-4">
            {/* Navigation Tabs */}
            <div className="tabs flex bg-[#F2F4F7] rounded-md p-[3px] md:p-[5px]">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2 md:px-4 ${currentUser?.UserProfileType === 'Advocate'
                            ? 'w-1/3'
                            : isVerified
                                ? 'w-1/6'
                                : 'w-1/5'
                            } py-2 text-sm md:text-lg rounded-md font-medium transition-colors duration-200
${activeTab === tab ? 'bg-white text-black shadow-sm font-semibold' : 'bg-transparent text-gray-600 hover:text-black'}`}

                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content ">
                {activeTab === 'Overview' && (
                    <div className="overview-content">
                        <AboutCompany profileData={profileData} />

                        <div className=" border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ">
                            {/* Partnership Focus */}

                            {/* Orisuun Achievements section hidden */}


                            {/* Recent Achievements */}
                            <div className="mb-6    bg-white p-4 rounded-lg  w-full border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>

                                <div className="grid grid-cols-2 md:block gap-x-4 gap-y-4 text-sm">
                                    {/* Website */}
                                    {profileData?.WebsiteUrl && (
                                        <a
                                            href={profileData?.WebsiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-600"
                                        >
                                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5.80968 16.5C6.92201 15.9665 8.17481 15.6667 9.49984 15.6667C10.8249 15.6667 12.0777 15.9665 13.19 16.5M5.1665 13.1667H13.8332C15.2333 13.1667 15.9334 13.1667 16.4681 12.8942C16.9386 12.6545 17.321 12.272 17.5607 11.8016C17.8332 11.2669 17.8332 10.5668 17.8332 9.16667V5.5C17.8332 4.09987 17.8332 3.3998 17.5607 2.86502C17.321 2.39462 16.9386 2.01217 16.4681 1.77248C15.9334 1.5 15.2333 1.5 13.8332 1.5H5.1665C3.76637 1.5 3.06631 1.5 2.53153 1.77248C2.06112 2.01217 1.67867 2.39462 1.43899 2.86502C1.1665 3.3998 1.1665 4.09987 1.1665 5.5V9.16667C1.1665 10.5668 1.1665 11.2669 1.43899 11.8016C1.67867 12.272 2.06112 12.6545 2.53153 12.8942C3.06631 13.1667 3.76637 13.1667 5.1665 13.1667Z"
                                                    stroke="#98A2B3"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="text-[#2357C6] break-all">{profileData?.WebsiteUrl}</span>
                                        </a>
                                    )}

                                    {/* Phone */}
                                    {profileData?.PhoneNumber && (
                                        <p className="flex items-center gap-2 text-gray-600 md:py-3">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5.48356 6.37779C6.06356 7.58581 6.85422 8.71801 7.85553 9.71933C8.85685 10.7206 9.98905 11.5113 11.1971 12.0913C11.301 12.1412 11.3529 12.1661 11.4187 12.1853C11.6523 12.2534 11.9392 12.2045 12.137 12.0628C12.1927 12.0229 12.2403 11.9753 12.3356 11.88C12.6269 11.5887 12.7726 11.443 12.9191 11.3478C13.4715 10.9886 14.1837 10.9886 14.7361 11.3478C14.8825 11.443 15.0282 11.5887 15.3196 11.88L15.4819 12.0424C15.9248 12.4853 16.1462 12.7067 16.2665 12.9446C16.5058 13.4175 16.5058 13.9761 16.2665 14.449C16.1462 14.6869 15.9248 14.9083 15.4819 15.3512L15.3506 15.4825C14.9092 15.9239 14.6886 16.1446 14.3885 16.3131C14.0556 16.5001 13.5385 16.6346 13.1567 16.6334C12.8126 16.6324 12.5774 16.5657 12.107 16.4322C9.57917 15.7147 7.19387 14.361 5.20388 12.371C3.2139 10.381 1.86017 7.99569 1.1427 5.46786C1.00919 4.99749 0.942437 4.7623 0.941413 4.41818C0.940277 4.03633 1.07475 3.51925 1.26176 3.18633C1.4303 2.88631 1.65098 2.66563 2.09233 2.22428L2.22369 2.09292C2.66656 1.65005 2.888 1.42861 3.12581 1.30833C3.59878 1.0691 4.15734 1.0691 4.6303 1.30832C4.86812 1.42861 5.08955 1.65005 5.53242 2.09291L5.69481 2.25531C5.98615 2.54665 6.13182 2.69231 6.22706 2.8388C6.58622 3.3912 6.58622 4.10336 6.22706 4.65576C6.13182 4.80225 5.98615 4.94791 5.69481 5.23925C5.59955 5.33451 5.55192 5.38214 5.51206 5.43782C5.37038 5.63568 5.32146 5.92256 5.38957 6.15619C5.40873 6.22193 5.43367 6.27389 5.48356 6.37779Z"
                                                    stroke="#98A2B3"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            {profileData?.PhoneNumber}
                                        </p>
                                    )}

                                    {/* Email - spans full row if alone */}
                                    {profileData?.UserEmailId != "" && (
                                        <a
                                            href={`mailto:${profileData?.UserEmailId}`}
                                            className="col-span-2 flex items-center gap-2 text-gray-600 hover:text-blue-600"
                                        >
                                            <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1.1665 3.83203L7.9706 8.5949C8.52158 8.98058 8.79707 9.17343 9.09672 9.24812C9.36142 9.3141 9.63826 9.3141 9.90295 9.24812C10.2026 9.17343 10.4781 8.98058 11.0291 8.5949L17.8332 3.83203M5.1665 14.6654H13.8332C15.2333 14.6654 15.9334 14.6654 16.4681 14.3929C16.9386 14.1532 17.321 13.7707 17.5607 13.3003C17.8332 12.7656 17.8332 12.0655 17.8332 10.6654V5.33203C17.8332 3.9319 17.8332 3.23183 17.5607 2.69705C17.321 2.22665 16.9386 1.8442 16.4681 1.60451C15.9334 1.33203 15.2333 1.33203 13.8332 1.33203H5.1665C3.76637 1.33203 3.06631 1.33203 2.53153 1.60451C2.06112 1.8442 1.67867 2.22665 1.43899 2.69705C1.1665 3.23183 1.1665 3.9319 1.1665 5.33203V10.6654C1.1665 12.0655 1.1665 12.7656 1.43899 13.3003C1.67867 13.7707 2.06112 14.1532 2.53153 14.3929C3.06631 14.6654 3.76637 14.6654 5.1665 14.6654Z"
                                                    stroke="#98A2B3"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            {profileData?.UserEmailId}
                                        </a>
                                    )}
                                </div>
                                <div className="flex border-t-2 border-gray-300 py-5 mt-5 ">
                                    <div className="flex flex-wrap gap-2 text-sm ">
                                        {profileData?.SocialMediaUrls?.filter(item => item.SocialMediaUrl?.trim())?.length > 0 ? (
                                            profileData.SocialMediaUrls
                                                .filter(item => item.SocialMediaUrl?.trim())
                                                .map((item, index) => {
                                                    const url = item.SocialMediaUrl.startsWith('http')
                                                        ? item.SocialMediaUrl
                                                        : `https://${item.SocialMediaUrl}`;

                                                    return (
                                                        <a
                                                            key={index}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-gray-700 hover:text-blue-600  "
                                                        >
                                                            {getSocialIcon(item.LinkType)}
                                                        </a>
                                                    );
                                                })
                                        ) : (
                                            <p className="text-gray-500">No social media links available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Partnership Focus */}
                        <div className=" border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ">
                            {/* Partnership Focus */}
                            <div className=" shadow-sm  bg-white p-4 rounded-xl border">
                                <h2 className="text-lg font-semibold mb-4">Partnership Focus</h2>
                                <div className="flex flex-wrap gap-3">
                                    {profileData?.PartnershipFocus.split('|').map((item) => (
                                        <span
                                            key={item}
                                            className="border border-[#EAECF0] text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Achievements */}
                            <div className=" shadow-sm  bg-white p-4 rounded-xl border">
                                <h2 className="text-lg font-semibold mb-4">Recent Achievements</h2>

                                <ul className="space-y-2 text-[#1D2939] text-[15px]">
                                    {
                                        profileData?.PartnerRecentAchivements.map((achievement, index) => (
                                            <li>{achievement?.Achievement}</li>
                                        )
                                        )
                                    }

                                </ul>
                            </div>
                        </div>

                        {/* Support Programs */}
                        <div className=" shadow-sm  bg-white p-4 rounded-xl border space-y-4 mt-6">
                            <h2 className="text-lg font-semibold">Support Programs</h2>

                            {
                                profileData?.PartnerSupportProgram.map((program, index) => <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-sm text-gray-800">{program?.Title}</h3>
                                    <p className="text-sm text-[#475467] mt-1">{program?.Description}</p>
                                </div>
                                )
                            }

                        </div>


                    </div>
                )}

                {
                    activeTab === 'Snapshot' && (
                        <div className=''>
                            <div className="bg-white  p-4 rounded-xl mt-6 border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900  mb-2">Resume/CV</h2>
                                <div className=" w-full flex flex-col bg-white p-4 rounded-xl mt-4 border border-gray-200">
                                    <div className="flex justify-between items-center px-4   bg-[#FCFCFD]">
                                        <h3 className="text-2xl font-medium">Resume</h3>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4 ">
                                        <iframe
                                            src={profileData?.Resume || 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/3905c1f2-024b-4447-a06e-54c92899c604.pdf'}
                                            className="w-full h-full min-h-[70vh]"
                                            frameBorder="0"
                                            title="Pitchbook"
                                        >
                                            <p>Your browser does not support iframes. You can <a href={profileData.Pitchbook} target="_blank" rel="noopener noreferrer">download the PDF</a> instead.</p>
                                        </iframe>
                                    </div>
                                    {/* <div className="p-4 border-t flex justify-end">
                            <a
                                href={profileData.Pitchbook}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Download
                            </a>
                        </div> */}
                                </div>
                            </div>
                            <div className=" bg-white  p-4 rounded-xl mt-6 border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Snapshot</h2>

                                <div className="w-full flex flex-col lg:flex-row gap-5">
                                    {/* Industry Experience */}
                                    <div className="w-full lg:w-1/2">
                                        <h3 className="text-md font-semibold text-gray-900 mb-3">Industry Experience</h3>
                                        {profileData?.MentorIndustryExperience.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-1 rounded-full bg-[#BFD2FB] inline-block"></span>
                                                    <span className="text-[#344054]">{item.Industry}</span>
                                                </div>
                                                <span className="text-gray-700">{item.YearsOfExperience}  years</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-[1px] bg-gray-200 lg:hidden" />
                                    <div className="hidden lg:block w-[1px] bg-gray-200" />

                                    {/* Client Size Focus */}
                                    <div className="w-full lg:w-1/2">
                                        <h3 className="text-md font-semibold text-gray-900 mb-3">Client Size Focus</h3>
                                        {profileData?.MentorClientSizeFocus.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-1 rounded-full bg-[#BFD2FB] inline-block"></span>
                                                    <span className="text-[#344054]">{item.ClientSize}</span>
                                                </div>
                                                <span className="text-gray-700">{item.Percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )
                }

                {
                    activeTab === 'Opportunities' && (
                        <div className="overview-content ">
                            <div className='bg-white p-4  border border-gray-200 shadow-md rounded-xl '>

                                <OpportunityCard profileData={profileData?.BdList} />
                            </div>
                        </div>
                    )
                }


                {
                    activeTab === 'Campaigns Sponsored' && (
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Sponsored Campaigns</h2>

                            {/* Campaign Card */}
                            <div>No Campaigns</div>
                        </div>

                    )
                }

                {
                    activeTab === 'Credentials' && (
                        <div className="overview-content ">
                            <div className='bg-white p-4  border border-gray-200 rounded-xl '>
                                <h2 className="text-lg font-semibold text-gray-900 mb-5">Professional Experience</h2>
                                <ExperienceSection UsersProfessionalExperience={profileData?.UsersProfessionalExperience} />
                            </div>
                            <div className='bg-white p-4  border border-gray-200 rounded-xl mt-6'>
                                <h2 className="text-lg font-semibold text-gray-900 mb-5">Education</h2>
                                <Education UsersProfessionalExperience={profileData?.UsersEducationCertification} />
                            </div>
                            <div className='bg-white p-4  border border-gray-200 rounded-xl mt-6'>
                                <h2 className="text-lg font-semibold text-gray-900 mb-5">Licenses & Certifications</h2>
                                <RecognitionAwards UsersRecognitionAwards={profileData?.UsersRecognitionAwards} />
                            </div>
                            <div className='bg-white p-4  border border-gray-200 rounded-xl mt-6'>
                                <h2 className="text-lg font-semibold text-gray-900 mb-5">Skills</h2>
                                <Skills UserSkills={profileData?.UserSkills} />
                            </div>
                            <div className='bg-white p-4  border border-gray-200 rounded-xl mt-6'>
                                <h2 className="text-lg font-semibold text-gray-900 mb-5">Publications & Research</h2>
                                <Publications UserPublicationResearch={profileData?.UserPublicationResearch} />
                            </div>

                        </div>
                    )
                }

                {
                    activeTab === 'Reviews' && (
                        <div className="overview-content ">
                            <div className=''>

                                <TestimonialCard
                                    profileData={profileData?.ReviewList || []}
                                    currentUser={currentUser}
                                    apiEndpoint={apiEndpoint}
                                    userId={profileData?.UserId}
                                    UserProfileDetailId={UserProfileDetailId}
                                    GivenReview={profileData?.ProfileReviewTo}
                                />
                            </div>
                        </div>
                    )
                }
                {activeTab === 'Consultations' && (
                    <Consultations profileData={profileData} />
                )}
                {
                    activeTab === 'Fundraising' && (
                        <div className="overview-content ">
                            <div className='bg-white p-4 rounded-xl border border-gray-200 mt-4'>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Active Fundraising</h2>
                                        <p className="mt-2 text-gray-600">Support our growth and expansion</p>
                                    </div>
                                    <button

                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push('/fundraising/sponsor');
                                        }}
                                        className="px-4 py-2 bg-[#17B26A] font-semibold text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Become a Sponsor
                                    </button>
                                </div>
                                <Fundraising campaignDetails={campaignDetails} />
                            </div>

                            <div className='bg-white p-4 rounded-xl border border-gray-200 mt-4'>
                                <div className="flex justify-between items-start mb-2">
                                    <div className='py-2'>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">Campaign Details</h2>
                                            <p className="mb-2 text-gray-600">Support our growth and expansion</p>
                                        </div>
                                        <CampaignDetails campaignDetails={campaignDetails} />
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white p-4 rounded-xl border border-gray-200 mt-4'>
                                <div className="flex  justify-between items-start mb-2">
                                    <div className='py-2'>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">Our Sponsors</h2>
                                            <p className="mb-2 text-gray-600">Organizations supporting our expansion</p>
                                        </div>


                                    </div>
                                </div>
                                <div>
                                    {campaignDetails?.Sponsors.map((sponsor, index) => (
                                        <Sponser key={index} sponsor={sponsor} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row w-full mt-4 gap-4">
                                <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                                    <RecentContibution campaignDetails={campaignDetails} />
                                </div>
                                <div className="w-full  sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                                    <Reward campaignDetails={campaignDetails} />
                                </div>
                            </div>
                            {/* CampaignUpdates */}
                            <CampaignUpdates campaignDetails={campaignDetails} />

                        </div>
                    )
                }

                {/* {activeTab !== 'Overview' && (
                    <div className="other-tab-content">
                        <h2>{activeTab} Content</h2>
                        <p>This section would contain {activeTab.toLowerCase()} information about the business.</p>
                    </div>
                )} */}
            </div>

            <style jsx>{`
        .coffee-business {
          font-family: Arial, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 20px;
        }
        
        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
        
        .tab:hover {
          background-color: #f5f5f5;
        }
        
        .tab.active {
          border-bottom: 3px solid #8B4513;
          font-weight: bold;
          color: #8B4513;
        }
        
        .read-more {
          color: #2357C6;
          border: none;
          size: 16px;
          weight: 800;
          border-radius: 4px;
          cursor: pointer;
          margin: 10px 0;
        }
        
        .mission-vision {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }
        
        .mission, .vision {
          flex: 1;
          padding: 15px;
          background-color: #dfe6f5;
          border-radius: 8px;
        }
        
        .gallery-filters {
          display: flex;
          gap: 10px;
          margin: 15px 0;
          border-bottom: 1px solid #ddd;
        }
        
        .gallery-filters button {
          padding: 5px 15px;
          background: none;
          cursor: pointer;
        }
        
       .gallery-filters button.active {
        color: #2357C6;
        font-weight: 600; /* semibold */
        border-bottom: 3px solid #2357C6;
        }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        
        .gallery-item {
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .mission-vision {
            flex-direction: column;
          }
          
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>




        </div>
    );
};

export default TabSection;
