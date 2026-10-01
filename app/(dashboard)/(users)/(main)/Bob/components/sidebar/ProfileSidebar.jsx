'use client'
import { useEffect, useState } from "react";
import SocialMediaIcon, { hasSocialMediaAsset } from '@/components/profile/SocialMediaIcon';
import MapComponent from "./MapComponent";
import Modal from "@/components/ui/modal/modal";
import { FaRedditAlien } from "react-icons/fa";
import ThreadSquare from "@/icons/socials/thread-square";

const ProfileSidebar = ({ profileData }) => {

    const [isPitchbookModalOpen, setIsPitchbookModalOpen] = useState(false);
    const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
    const isCurrentUserAdvocate = currentUser?.UserProfileType === 'Advocate';
    const allowedVisibilityIds = JSON.parse(profileData?.AnnualRevenueVisibility || '[]');
    const canSeeAnnualRevenue =
        allowedVisibilityIds.includes(currentUser?.UserProfileTypeId) ||
        currentUser?.UserProfileTypeId === 1;
    const industryList = profileData?.UserProfileIndustrySelectionInformation || profileData?.IndustryChartData || [];
    const [showAllIndustries, setShowAllIndustries] = useState(false);

    const visibleIndustries = showAllIndustries
        ? industryList
        : industryList.slice(0, 3);


    useEffect(() => {
        if (isAssociateModalOpen || isPitchbookModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto'; // Cleanup on unmount
        };
    }, [isAssociateModalOpen, isPitchbookModalOpen]);

    const getSocialIcon = (type) => {
        if (hasSocialMediaAsset(type)) return <SocialMediaIcon platform={type} />;

        switch (type.toLowerCase()) {
            case 'youtube':
                return (
                    <svg width={20} height={20} className=" text-gray-700 flex-shrink-0" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M549.7 124.1c-6.3-23.7-24.9-42.3-48.6-48.6C456.5 64 288 64 288 64S119.5 64 74.9 75.5C51.2 81.8 32.5 100.4 26.3 124.1 16 168.5 16 256 16 256s0 87.5 10.3 131.9c6.3 23.7 24.9 42.3 48.6 48.6C119.5 448 288 448 288 448s168.5 0 213.1-11.5c23.7-6.3 42.3-24.9 48.6-48.6C560 343.5 560 256 560 256s0-87.5-10.3-131.9zM232 336V176l142 80-142 80z" />
                    </svg>
                );
            case 'bluesky':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bluesky flex-shrink-0" viewBox="0 0 16 16">
                        <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
                    </svg>
                );
            case 'facebook':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.832 7.5013H14.582L14.1654 9.16797H10.832V16.668H9.16536V9.16797H5.83203V7.5013H9.16536V5.9413C9.16536 4.45547 9.32036 3.9163 9.61036 3.37297C9.89454 2.83614 10.3335 2.39714 10.8704 2.11297C11.4137 1.82297 11.9529 1.66797 13.4387 1.66797C13.8737 1.66797 14.2554 1.70964 14.582 1.79297V3.33464H13.4387C12.3354 3.33464 11.9995 3.39964 11.657 3.58297C11.4037 3.71797 11.2154 3.9063 11.0804 4.15964C10.897 4.50214 10.832 4.83797 10.832 5.9413V7.5013Z" fill="#667085" />
                    </svg>


                );
            case 'instagram':
                return (
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6.75C8.40326 6.75 7.83097 6.98705 7.40901 7.40901C6.98705 7.83097 6.75 8.40326 6.75 9C6.75 9.59674 6.98705 10.169 7.40901 10.591C7.83097 11.0129 8.40326 11.25 9 11.25C9.59674 11.25 10.169 11.0129 10.591 10.591C11.0129 10.169 11.25 9.59674 11.25 9C11.25 8.40326 11.0129 7.83097 10.591 7.40901C10.169 6.98705 9.59674 6.75 9 6.75ZM9 5.25C9.99456 5.25 10.9484 5.64509 11.6517 6.34835C12.3549 7.05161 12.75 8.00544 12.75 9C12.75 9.99456 12.3549 10.9484 11.6517 11.6517C10.9484 12.3549 9.99456 12.75 9 12.75C8.00544 12.75 7.05161 12.3549 6.34835 11.6517C5.64509 10.9484 5.25 9.99456 5.25 9C5.25 8.00544 5.64509 7.05161 6.34835 6.34835C7.05161 5.64509 8.00544 5.25 9 5.25ZM13.875 5.0625C13.875 5.31114 13.7762 5.5496 13.6004 5.72541C13.4246 5.90123 13.1861 6 12.9375 6C12.6889 6 12.4504 5.90123 12.2746 5.72541C12.0988 5.5496 12 5.31114 12 5.0625C12 4.81386 12.0988 4.5754 12.2746 4.39959C12.4504 4.22377 12.6889 4.125 12.9375 4.125C13.1861 4.125 13.4246 4.22377 13.6004 4.39959C13.7762 4.5754 13.875 4.81386 13.875 5.0625ZM9 3C7.1445 3 6.8415 3.00525 5.97825 3.0435C5.39025 3.07125 4.99575 3.15 4.62975 3.2925C4.30425 3.4185 4.0695 3.56925 3.81975 3.81975C3.58501 4.04655 3.40452 4.32344 3.29175 4.62975C3.14925 4.99725 3.0705 5.391 3.0435 5.97825C3.0045 6.80625 3 7.09575 3 9C3 10.8555 3.00525 11.1585 3.0435 12.0218C3.07125 12.609 3.15 13.0043 3.29175 13.3695C3.41925 13.6958 3.56925 13.9305 3.81825 14.1795C4.071 14.4315 4.30575 14.5823 4.62825 14.7068C4.99875 14.85 5.39325 14.9295 5.97825 14.9565C6.80625 14.9955 7.09575 15 9 15C10.8555 15 11.1585 14.9948 12.0218 14.9565C12.6083 14.9288 13.0035 14.85 13.3695 14.7083C13.6943 14.5815 13.9305 14.4308 14.1795 14.1818C14.4323 13.929 14.583 13.6943 14.7075 13.3718C14.85 13.002 14.9295 12.6068 14.9565 12.0218C14.9955 11.1938 15 10.9043 15 9C15 7.1445 14.9948 6.8415 14.9565 5.97825C14.9288 5.39175 14.85 4.99575 14.7075 4.62975C14.5945 4.32375 14.4143 4.04697 14.1803 3.81975C13.9536 3.58488 13.6766 3.40438 13.3703 3.29175C13.0028 3.14925 12.6083 3.0705 12.0218 3.0435C11.1938 3.0045 10.9043 3 9 3ZM9 1.5C11.0378 1.5 11.292 1.5075 12.0915 1.545C12.8903 1.5825 13.434 1.70775 13.9125 1.89375C14.4075 2.08425 14.8245 2.34225 15.2415 2.7585C15.6229 3.13342 15.918 3.58694 16.1063 4.0875C16.2915 4.56525 16.4175 5.10975 16.455 5.9085C16.4903 6.708 16.5 6.96225 16.5 9C16.5 11.0378 16.4925 11.292 16.455 12.0915C16.4175 12.8903 16.2915 13.434 16.1063 13.9125C16.9185 14.4133 15.6233 14.867 15.2415 15.2415C14.8665 15.6227 14.413 15.9178 13.9125 16.1063C13.4348 16.2915 12.8903 16.4175 12.0915 16.455C11.292 16.4903 11.0378 16.5 9 16.5C6.96225 16.5 6.708 16.4925 5.9085 16.455C5.10975 16.4175 4.566 16.2915 4.0875 16.1063C3.58674 15.9184 3.13315 15.6232 2.7585 15.2415C2.37705 14.8666 2.08195 14.4131 1.89375 13.9125C1.70775 13.4348 1.5825 12.8903 1.545 12.0915C1.50975 11.292 1.5 11.0378 1.5 9C1.5 6.96225 1.5075 6.708 1.545 5.9085C1.5825 5.109 1.70775 4.566 1.89375 4.0875C2.08143 3.58663 2.3766 3.13299 2.7585 2.7585C3.13325 2.37692 3.58682 2.0818 4.0875 1.89375C4.566 1.70775 5.109 1.5825 5.9085 1.545C6.708 1.50975 6.96225 1.5 9 1.5Z" fill="#667085" />
                    </svg>
                );
            case 'linkedin':
                return (

                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0013 7.95964C10.7655 7.1788 11.7605 6.66797 12.918 6.66797C14.1335 6.66797 15.2993 7.15085 16.1589 8.0104C17.0184 8.86994 17.5013 10.0357 17.5013 11.2513V17.5013H15.8346V11.2513C15.8346 10.4778 15.5273 9.73589 14.9804 9.18891C14.4334 8.64193 13.6915 8.33464 12.918 8.33464C12.1444 8.33464 11.4026 8.64193 10.8556 9.18891C10.3086 9.73589 10.0013 10.4778 10.0013 11.2513V17.5013H8.33464V7.08464H10.0013V7.95964ZM4.16797 5.41797C3.83645 5.41797 3.51851 5.28627 3.28409 5.05185C3.04966 4.81743 2.91797 4.49949 2.91797 4.16797C2.91797 3.83645 3.04966 3.51851 3.28409 3.28409C3.51851 3.04966 3.83645 2.91797 4.16797 2.91797C4.49949 2.91797 4.81743 3.04966 5.05185 3.28409C5.28627 3.51851 5.41797 3.83645 5.41797 4.16797C5.41797 4.49949 5.28627 4.81743 5.05185 5.05185C4.81743 5.28627 4.49949 5.41797 4.16797 5.41797ZM3.33464 7.08464H5.0013V17.5013H3.33464V7.08464Z" fill="#667085" />
                    </svg>



                );
            case 'pinterest':
                return (
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 496 512">
                        <path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z" />
                    </svg>
                );
            case 'reddit':
                return (
                    <FaRedditAlien className="w-5 h-5 text-[#667085]" />
                    // <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 512 512">
                    //     <path d="M440 128c-39.8 0-72 32.2-72 72 0 10.7 2.4 20.9 6.7 29.9C348.7 223.8 313.3 208 272 208s-76.7 15.8-102.7 41.9c4.3-9 6.7-19.2 6.7-29.9 0-39.8-32.2-72-72-72s-72 32.2-72 72 32.2 72 72 72c15.5 0 29.8-5 41.6-13.4 20.4 33.6 58.8 56.4 102.4 56.4s82-22.8 102.4-56.4c11.8 8.4 26.1 13.4 41.6 13.4 39.8 0 72-32.2 72-72s-32.2-72-72-72z" />
                    // </svg>
                );
            case 'spill':
                return (
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                );
            case 'threads':
                return (
                    <ThreadSquare className="w-5 h-5 text-[#667085]" />
                    // <svg width='20' height='20' className=" text-gray-700" fill="currentColor" viewBox="0 0 512 512">
                    //     <path d="M119.3 94.1C156.3 57 204.2 32 256 32c141.4 0 224 100.7 224 224s-82.6 224-224 224c-51.8 0-99.7-25-136.7-62.1-29.8-29.8-55.4-69.4-59.1-116.3-2.6-34 4.2-70.7 24.2-99.6 15.3-22.5 35.4-40.5 60.9-51.2 18.2-7.8 39.6-11.8 64.4-11.8 49.8 0 97.3 17.1 132.4 47.5 35.2 30.6 57.5 72.6 57.5 117.2 0 33.3-14.6 62.5-41.1 81.4-23.5 16.7-52.9 24.9-84.2 24.9-27.7 0-54.6-9.3-75.5-26.2-21.1-17-34.4-41.3-34.4-66.6 0-18.6 7.3-36.8 20.1-50.1 11.6-11.7 26.3-18.1 41.9-18.1 23.9 0 46.2 15.6 50.1 40.6 2.7 17.6-4.1 35.2-17.6 45.9-9.7 7.7-22.1 11.9-34.8 11.9-9.1 0-17.9-2.4-25.6-7 10.7 21.5 33.4 34.5 58.2 34.5 14.2 0 27.7-4.2 39.3-12.1 17.1-11.7 27-31 27-52.5 0-32.5-16.1-63.5-43.6-86.6-27.1-22.8-62.8-35.4-99.6-35.4-42.3 0-81.3 15.7-110.1 44.3C82.1 190.3 70.3 223.6 72.9 260c2.9 38.5 21.7 73.7 50.5 102.5C162.2 407.8 206.4 432 256 432c58.8 0 104.4-19.1 138.3-48.3C435.2 356 448 309.5 448 256s-12.8-100-53.7-140.7C353.4 75.3 306.7 56 256 56c-38.5 0-74.9 17.5-103.7 46.3l-33-8.2z" />
                    // </svg>
                );
            case 'tiktok':
                return (
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                    </svg>
                );
            case 'whatsapp':
                return (
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L4 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
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
    const socialMediaOrder = [
        'bluesky',
        'facebook',
        'instagram',
        'linkedin',
        'pinterest',
        'reddit',
        'spill',
        'threads',
        'tiktok',
        'whatsapp',
        'youtube'
    ];

    const formatYesNoValue = (value) => {
        if (value === true || value === 'Yes') return 'Yes';
        if (value === false || value === 'No') return 'No';
        return null;
    };
    return (
        <div className="w-full  ">
            {/* Achievement Badges */}
            {/* <div className=" shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Orisuun Achievements</h3>

                <div className="flex flex-row lg:flex-col gap-3">
                    <div className="flex items-center gap-2 p-2 py-3 bg-[#EFF8FF] border-2 border-[#B2DDFF] rounded-md w-full">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 6.5L6 7.5L8.25 5.25M5.10095 10.8004C5.26483 10.7788 5.43037 10.8232 5.56091 10.9238L6.16253 11.3854C6.3614 11.5382 6.63804 11.5382 6.83636 11.3854L7.46075 10.906C7.57741 10.8165 7.72462 10.7771 7.87016 10.7965L8.65121 10.8993C8.89952 10.9321 9.13895 10.7938 9.23505 10.5621L9.53558 9.83546C9.59169 9.69936 9.69946 9.59158 9.83556 9.53547L10.5622 9.23492C10.7938 9.13937 10.9321 8.89938 10.8994 8.65105L10.8005 7.89829C10.7788 7.73441 10.8233 7.56886 10.9238 7.43831L11.3854 6.83666C11.5382 6.63777 11.5382 6.36111 11.3854 6.16279L10.906 5.53836C10.8166 5.4217 10.7771 5.27448 10.7966 5.12893L10.8994 4.34784C10.9321 4.09951 10.7938 3.86007 10.5622 3.76396L9.83556 3.46342C9.69946 3.40731 9.59169 3.29953 9.53558 3.16343L9.23505 2.43678C9.1395 2.20512 8.89952 2.06679 8.65121 2.09957L7.87016 2.20234C7.72462 2.22234 7.57741 2.1829 7.46131 2.09401L6.83692 1.61458C6.63804 1.46181 6.3614 1.46181 6.16308 1.61458L5.53869 2.09401C5.42203 2.1829 5.27482 2.22234 5.12928 2.20345L4.34823 2.10068C4.09992 2.0679 3.8605 2.20623 3.76439 2.43789L3.46442 3.16454C3.40776 3.30009 3.29999 3.40786 3.16444 3.46453L2.43784 3.76452C2.20619 3.86063 2.06787 4.10007 2.10064 4.34839L2.20341 5.12948C2.2223 5.27503 2.18286 5.42225 2.09398 5.53836L1.61457 6.16279C1.46181 6.36167 1.46181 6.63833 1.61457 6.83666L2.09398 7.46108C2.18342 7.57775 2.22286 7.72497 2.20341 7.87052L2.10064 8.65161C2.06787 8.89993 2.20619 9.13937 2.43784 9.23548L3.16444 9.53603C3.30054 9.59214 3.40831 9.69991 3.46442 9.83602L3.76495 10.5627C3.8605 10.7943 4.10048 10.9327 4.34879 10.8999L5.10095 10.8004Z" stroke="#2E90FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span className="text-sm text-[#175CD3] font-semibold">Verified Business</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 py-3 bg-[#EFF8FF] border-2 border-[#B2DDFF] rounded-md w-full">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 6.5L6 7.5L8.25 5.25M5.10095 10.8004C5.26483 10.7788 5.43037 10.8232 5.56091 10.9238L6.16253 11.3854C6.3614 11.5382 6.63804 11.5382 6.83636 11.3854L7.46075 10.906C7.57741 10.8165 7.72462 10.7771 7.87016 10.7965L8.65121 10.8993C8.89952 10.9321 9.13895 10.7938 9.23505 10.5621L9.53558 9.83546C9.59169 9.69936 9.69946 9.59158 9.83556 9.53547L10.5622 9.23492C10.7938 9.13937 10.9321 8.89938 10.8994 8.65105L10.8005 7.89829C10.7788 7.73441 10.8233 7.56886 10.9238 7.43831L11.3854 6.83666C11.5382 6.63777 11.5382 6.36111 11.3854 6.16279L10.906 5.53836C10.8166 5.4217 10.7771 5.27448 10.7966 5.12893L10.8994 4.34784C10.9321 4.09951 10.7938 3.86007 10.5622 3.76396L9.83556 3.46342C9.69946 3.40731 9.59169 3.29953 9.53558 3.16343L9.23505 2.43678C9.1395 2.20512 8.89952 2.06679 8.65121 2.09957L7.87016 2.20234C7.72462 2.22234 7.57741 2.1829 7.46131 2.09401L6.83692 1.61458C6.63804 1.46181 6.3614 1.46181 6.16308 1.61458L5.53869 2.09401C5.42203 2.1829 5.27482 2.22234 5.12928 2.20345L4.34823 2.10068C4.09992 2.0679 3.8605 2.20623 3.76439 2.43789L3.46442 3.16454C3.40776 3.30009 3.29999 3.40786 3.16444 3.46453L2.43784 3.76452C2.20619 3.86063 2.06787 4.10007 2.10064 4.34839L2.20341 5.12948C2.2223 5.27503 2.18286 5.42225 2.09398 5.53836L1.61457 6.16279C1.46181 6.36167 1.46181 6.63833 1.61457 6.83666L2.09398 7.46108C2.18342 7.57775 2.22286 7.72497 2.20341 7.87052L2.10064 8.65161C2.06787 8.89993 2.20619 9.13937 2.43784 9.23548L3.16444 9.53603C3.30054 9.59214 3.40831 9.69991 3.46442 9.83602L3.76495 10.5627C3.8605 10.7943 4.10048 10.9327 4.34879 10.8999L5.10095 10.8004Z" stroke="#2E90FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span className="text-sm text-[#175CD3] font-semibold">Community Champion</span>
                    </div>
                </div>
            </div> */}
            {/* Pitchbook Section */}

            {
                profileData?.Pitchbook && (
                    <div className="mb-6 bg-white border-[#F2F4F7] p-4 border rounded-xl shadow-[#1018280F] shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Pitchbook</h3>
                        <div className="flex items-center justify-between gap- p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                            onClick={() => setIsPitchbookModalOpen(true)}>
                            <div className="flex gap-2 justify-center items-center">

                                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.39941 0.505859H16.1992C16.281 0.505859 16.3591 0.538924 16.417 0.59668L23.7021 7.88184C23.7599 7.93961 23.7929 8.01792 23.793 8.09961V24.2998C23.793 25.5112 22.811 26.4939 21.5996 26.4941H5.39941C4.18784 26.4941 3.20508 25.5114 3.20508 24.2998V2.7002C3.20508 1.48862 4.18784 0.505859 5.39941 0.505859Z" fill="white" stroke="#D0D5DD" stroke-width="1.0125" />
                                    <path d="M16.1992 0.335938V5.39844C16.1992 6.88961 17.4081 8.09844 18.8992 8.09844H23.9617" stroke="#D0D5DD" stroke-width="1.0125" />
                                    <path d="M17.3543 17.1075C16.5963 17.1075 15.6478 17.2397 15.3375 17.2862C14.0532 15.945 13.6878 15.1827 13.6056 14.9794C13.717 14.6932 14.1045 13.606 14.1596 12.2097C14.1867 11.5106 14.0391 10.9882 13.7205 10.6571C13.4026 10.3265 13.0177 10.3008 12.9073 10.3008C12.5203 10.3008 11.8711 10.4965 11.8711 11.807C11.8711 12.944 12.4012 14.1505 12.5478 14.4623C11.7757 16.7103 10.9468 18.2493 10.7708 18.5658C7.66839 19.7338 7.42578 20.8632 7.42578 21.1833C7.42578 21.7585 7.83543 22.102 8.52159 22.102C10.1887 22.102 11.71 19.3031 11.9616 18.8171C13.1456 18.3453 14.7304 18.0531 15.1332 17.9833C16.2888 19.0841 17.6253 19.3779 18.1803 19.3779C18.5978 19.3779 19.5757 19.3779 19.5757 18.3724C19.5758 17.4387 18.3791 17.1075 17.3543 17.1075ZM17.2739 17.7675C18.1744 17.7675 18.4124 18.0653 18.4124 18.2228C18.4124 18.3216 18.3749 18.644 17.8922 18.644C17.4594 18.644 16.7121 18.3938 15.9769 17.8511C16.2835 17.8108 16.7372 17.7675 17.2739 17.7675ZM12.86 10.9406C12.9422 10.9406 12.9962 10.967 13.0408 11.0288C13.2998 11.3881 13.0909 12.5624 12.8368 13.4813C12.5914 12.6934 12.4073 11.4844 12.6664 11.0591C12.717 10.976 12.7749 10.9406 12.86 10.9406ZM12.4227 17.974C12.7487 17.3154 13.1141 16.3555 13.3132 15.8126C13.7114 16.4793 14.2471 17.0982 14.557 17.4338C13.5923 17.6372 12.8624 17.8404 12.4227 17.974ZM8.07338 21.2712C8.0519 21.2457 8.04872 21.192 8.06491 21.1276C8.09885 20.9925 8.35823 20.3228 10.2343 19.4836C9.96568 19.9067 9.54572 20.5113 9.08437 20.963C8.75962 21.2669 8.50674 21.4211 8.33276 21.4211C8.27052 21.4211 8.18476 21.4041 8.07338 21.2712Z" fill="#D92D20" />
                                </svg>

                                <span className="text-sm text-gray-700">
                                    {/* {profileData.Pitchbook.split('/').pop()} */}
                                    Business Pitchbook
                                    <p className="text-gray-500  text-[12px] ">
                                        View our investment presentation
                                    </p>
                                </span>

                            </div>
                            <div>

                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.08398 10.4154L9.91732 4.58203M9.91732 4.58203H4.08398M9.91732 4.58203V10.4154" stroke="#98A2B3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>

                        </div>
                    </div>)
            }


            {/* Business Details */}
            <div className=" shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Business details</h3>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-3 text-sm">
                    {/* 1. Business Type */}
                    {
                        profileData.BussinessType && <div>
                            <p className="text-gray-500">Business Type</p>
                            <p className="font-medium text-gray-900">{profileData?.BussinessType}</p>
                        </div>
                    }


                    {/* 2. Industry */}
                    {/* {
                        industryList?.length > 0 && <div>
                            <p className="text-gray-500">Industry</p>
                            {industryList.map((ind, index) => (
                                <p key={index} className="font-medium text-gray-900">{ind?.IndustryName}</p>
                            ))}
                        </div>
                    } */}


                    {/* 9. Employees */}
                    {profileData?.NumberOfEmployess > 0 && <div>
                        {
                            !isCurrentUserAdvocate ? (
                                <p className="text-gray-500">Employees</p>
                            ) : (<p className="text-gray-500">Business Size</p>)}
                        <p className="font-medium text-gray-900">{profileData?.NumberOfEmployess}</p>
                    </div>}

                    {/* 3. In Business Since */}
                    {
                        profileData.BusinessSince && <div>
                            <p className="text-gray-500">In Business Since</p>
                            <p className="font-medium text-gray-900">{profileData?.BusinessSince || 'N/A'}</p>
                        </div>
                    }


                    {/* 4. Ethnicity of Black ownership */}
                    {
                        profileData?.EthinicityBlackOwnershipName && <div>
                            <p className="text-gray-500">Ethnicity of Black ownership</p>
                            <p className="font-medium text-gray-900">{profileData?.EthinicityBlackOwnershipName || 'N/A'}</p>
                        </div>
                    }


                    {/* 5. Stage */}
                    {(!isCurrentUserAdvocate && profileData?.Stage) && (
                        <div>
                            <p className="text-gray-500">Stage</p>
                            <p className="inline-block px-4 py-1 mt-1 rounded-full bg-[#F2F4F7] text-gray-900 font-semibold">
                                {profileData?.Stage || 'N/A'}
                            </p>
                        </div>
                    )}

                    {/* 6. Annual Revenue */}
                    {!isCurrentUserAdvocate && canSeeAnnualRevenue && profileData?.AnnualRevenue && (
                        <div>
                            <p className="text-gray-500">Annual Revenue</p>
                            <p className="font-medium text-gray-900">{profileData?.AnnualRevenue || 'N/A'}</p>
                        </div>
                    )}

                    {/* 7. Open to Investments */}
                    {!isCurrentUserAdvocate && profileData?.OpenToInvestment?.length > 0 && (
                        <div>
                            <p className="text-gray-500">Open to Investments</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {profileData?.OpenToInvestment?.includes("Equity") && (
                                    <span className="px-4 py-1 rounded-full bg-[#DCFAE6] text-[#085D3A] font-semibold">Equity</span>
                                )}
                                {profileData?.OpenToInvestment?.includes("Debt") && (
                                    <span className="px-4 py-1 rounded-full bg-[#DCFAE6] text-[#085D3A] font-semibold">Debt</span>
                                )}
                                {!profileData?.OpenToInvestment && (
                                    <span className="font-medium text-gray-900">N/A</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 8. Funding Stage */}
                    {!isCurrentUserAdvocate && profileData?.FundraisingStage && (
                        <div>
                            <p className="text-gray-500">Funding Stage</p>
                            <p className="inline-block px-4 py-1 mt-1 rounded-full bg-white border text-nowrap border-gray-200 text-gray-900 font-semibold">
                                {profileData?.FundraisingStage || 'N/A'}
                            </p>
                        </div>
                    )}

                    {!isCurrentUserAdvocate && industryList?.length > 0 && (
                        <div>
                            <p className="text-gray-500">Industry</p>

                            <div className="mt-1 flex flex-wrap gap-2">
                                {visibleIndustries.map((industry, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full font-medium bg-gray-50 px-4 py-1 text-gray-900"
                                    >
                                        {industry?.IndustryName}
                                    </span>
                                ))}

                                {industryList.length > 3 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowAllIndustries(!showAllIndustries)
                                        }
                                        className="rounded-full  px-4 py-1  text-omblue-900"
                                    >
                                        {showAllIndustries
                                            ? 'See Less'
                                            : `+${industryList.length - 3} More`}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 10. Open to Professional Services */}
                    {!isCurrentUserAdvocate && formatYesNoValue(profileData?.OpenToProfessionalServices) && (
                        <div className="">
                            <p className="text-gray-500">
                                Open to Professional Services
                            </p>
                            <p className="font-medium text-gray-900">
                                {formatYesNoValue(profileData?.OpenToProfessionalServices) || 'N/A'}
                            </p>
                        </div>
                    )}

                    {!isCurrentUserAdvocate && formatYesNoValue(profileData?.OpenToStrategyAdvisors) && (
                        <div className="">
                            <p className="text-gray-500">Open to Strategy Advisors</p>
                            <p className="font-medium text-gray-900">{formatYesNoValue(profileData?.OpenToStrategyAdvisors)}</p>
                        </div>
                    )}

                </div>
            </div>


            {/* Contact Information */}
            {profileData?.WebsiteUrl && profileData?.PhoneNumber && profileData?.UserEmailId && (
                <div className=" bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>

                    <div className="grid grid-cols-2 md:block gap-x-4 gap-y-4 text-sm">
                        {/* Website */}
                        {profileData?.WebsiteUrl && (
                            <a
                                href={profileData?.WebsiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 truncate"
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
                                <span className="text-[#2357C6] break-all truncate text-nowrap">{profileData?.WebsiteUrl}</span>
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
                        {profileData?.UserEmailId && (
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
                                {profileData?.EmailIdForBusinessDevelopment}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Language */}
            {profileData?.Languages?.length > 0 ?? <div className=" shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Language</h3>
                {
                    profileData?.Languages?.length > 0 ? (
                        <div className="space-y-2 text-sm">
                            {profileData.Languages.map((lang, index) => (
                                <p key={index} className="font-medium">{lang}</p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No languages specified</p>
                    )
                }
            </div>}

            {/* Associated People */}
            {
                profileData?.AssociatePeoples?.length > 0 && (
                    <div className=" shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Associated People</h3>
                        {profileData?.AssociatePeoples?.map((person, index) => (
                            <div key={index} className="mb-4 cursor-pointer" onClick={() => {
                                setSelectedPerson(person);
                                setIsAssociateModalOpen(true);
                            }}>
                                <div className="flex items-center justify-between">
                                    {/* Avatar + Name + Position */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <img
                                            src={person?.ProfilePicture || ''}
                                            className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                                            alt="profile"
                                        />
                                        <div>
                                            <p className="font-medium">{person?.Name}</p>
                                            <p className="text-gray-500">{person?.Position}</p>
                                        </div>
                                    </div>
                                    {/* Arrow Icon */}
                                    <svg
                                        width="5"
                                        height="9"
                                        viewBox="0 0 5 9"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M0.75 8L4.25 4.5L0.75 1"
                                            stroke="#98A2B3"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        ))}

                    </div>
                )
            }

            {/* Social Media */}


            {profileData?.SocialMediaUrls?.some(item => item.SocialMediaUrl?.trim()) && (
                <div className="shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg w-full border border-gray-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Social Media</h3>
                    <div className="flex flex-wrap items-center justify-center gap-4">                        {
                        profileData.SocialMediaUrls
                            .filter(item =>
                                item.SocialMediaUrl?.trim() &&
                                socialMediaOrder.includes(item.LinkType.toLowerCase())
                            )
                            .sort((a, b) => {
                                const indexA = socialMediaOrder.indexOf(a.LinkType.toLowerCase());
                                const indexB = socialMediaOrder.indexOf(b.LinkType.toLowerCase());
                                return indexA - indexB;
                            })
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
                                        className="w-5 h-5  text-gray-700 hover:text-blue-600"
                                    >
                                        {getSocialIcon(item.LinkType)}
                                        {/* {item.SocialMediaUrl.replace(/^https?:\/\//, '')} */}
                                    </a>
                                );
                            })
                    }
                    </div>
                </div>
            )}


            {
                !isCurrentUserAdvocate && profileData?.CountryName && (
                    <div className=" shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
                        <p className="text-[#101828] flex mb-2">
                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.66634 14.9487C7.98527 14.7348 6.44872 13.8888 5.369 12.5826C4.28928 11.2765 3.74741 9.60827 3.85352 7.91697C3.95964 6.22567 4.70578 4.63823 5.9403 3.47731C7.17481 2.31639 8.80505 1.66909 10.4997 1.66699C12.1964 1.66573 13.8297 2.31144 15.0669 3.47256C16.3041 4.63368 17.052 6.22282 17.1582 7.91619C17.2645 9.60956 16.7211 11.2797 15.6387 12.5864C14.5564 13.893 13.0166 14.7378 11.333 14.9487V16.677C14.6213 16.7537 17.1663 17.2795 17.1663 17.917C17.1663 18.607 14.1813 19.167 10.4997 19.167C6.81801 19.167 3.83301 18.607 3.83301 17.917C3.83301 17.2795 6.37801 16.7537 9.66634 16.677V14.9487ZM10.4997 13.3337C11.8258 13.3337 13.0975 12.8069 14.0352 11.8692C14.9729 10.9315 15.4997 9.65974 15.4997 8.33366C15.4997 7.00758 14.9729 5.73581 14.0352 4.79813C13.0975 3.86045 11.8258 3.33366 10.4997 3.33366C9.17359 3.33366 7.90182 3.86045 6.96414 4.79813C6.02646 5.73581 5.49967 7.00758 5.49967 8.33366C5.49967 9.65974 6.02646 10.9315 6.96414 11.8692C7.90182 12.8069 9.17359 13.3337 10.4997 13.3337ZM10.4997 10.0003C10.0576 10.0003 9.63372 9.82473 9.32116 9.51217C9.0086 9.19961 8.83301 8.77569 8.83301 8.33366C8.83301 7.89163 9.0086 7.46771 9.32116 7.15515C9.63372 6.84259 10.0576 6.66699 10.4997 6.66699C10.9417 6.66699 11.3656 6.84259 11.6782 7.15515C11.9907 7.46771 12.1663 7.89163 12.1663 8.33366C12.1663 8.77569 11.9907 9.19961 11.6782 9.51217C11.3656 9.82473 10.9417 10.0003 10.4997 10.0003Z" fill="#98A2B3" />
                            </svg>
                            {[profileData?.CountryName, profileData?.CityName].filter(Boolean).join(', ')}
                        </p>

                        <MapComponent
                            address={profileData?.CityName || profileData?.StateName || profileData?.CountryName}
                        />
                    </div>)
            }

            {isPitchbookModalOpen && profileData?.Pitchbook && !isCurrentUserAdvocate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Pitchbook</h3>
                            <button
                                onClick={() => setIsPitchbookModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <iframe
                                src={profileData.Pitchbook}
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
            )}
            {isAssociateModalOpen && selectedPerson && (
                <div className="fixed inset-0 z-50 flex  items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-base font-semibold text-gray-900">Associated People</h3>
                            <button
                                onClick={() => setIsAssociateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={selectedPerson.ProfilePicture || ''}
                                className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                                alt="Profile"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{selectedPerson.Name}</p>
                                <p className="text-xs text-gray-500">{selectedPerson.Position}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                            {selectedPerson?.About || 'No bio available.'}
                        </p>
                        {selectedPerson?.Email && (
                            <p className="text-sm pb-4">
                                Contact: <a href={`mailto:${selectedPerson.Email}`} className="text-[#2357C6] pl-2">{selectedPerson.Email}</a>
                            </p>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
}

export default ProfileSidebar;
