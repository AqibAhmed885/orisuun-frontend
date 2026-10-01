'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import SocialMediaIcon, { hasSocialMediaAsset } from '@/components/profile/SocialMediaIcon';
import MapComponent from "../Bob/components/sidebar/MapComponent";
import BookingWidget from "./components/BookingWidget";

const ProfileSidebar = ({ profileData }) => {

    const [isPitchbookModalOpen, setIsPitchbookModalOpen] = useState(false);
    const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    let currentUser = null;

    if (typeof window !== 'undefined') {
        try {
            const storedUser = localStorage.getItem('userData');
            currentUser = storedUser ? JSON.parse(storedUser) : null;
        } catch {
            currentUser = null;
        }
    }
    const isCurrentUserAdvocate = currentUser?.UserProfileType === 'Advocate';
    const allowedVisibilityIds = (() => {
        try {
            return JSON.parse(profileData?.AnnualRevenueVisibility || '[]');
        } catch {
            return [];
        }
    })();
    const canSeeAnnualRevenue =
        allowedVisibilityIds.includes(currentUser?.UserProfileTypeId) ||
        currentUser?.UserProfileTypeId === 1;


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

    const getSocialIcon = (type = '') => {
        if (hasSocialMediaAsset(type)) return <SocialMediaIcon platform={type} />;

        switch (type.toLowerCase()) {
            case 'youtube':
                return (
                    <svg className="w-4 h-4 text-[#3F3F3F]" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M549.7 124.1c-6.3-23.7-24.9-42.3-48.6-48.6C456.5 64 288 64 288 64S119.5 64 74.9 75.5C51.2 81.8 32.5 100.4 26.3 124.1 16 168.5 16 256 16 256s0 87.5 10.3 131.9c6.3 23.7 24.9 42.3 48.6 48.6C119.5 448 288 448 288 448s168.5 0 213.1-11.5c23.7-6.3 42.3-24.9 48.6-48.6C560 343.5 560 256 560 256s0-87.5-10.3-131.9zM232 336V176l142 80-142 80z" />
                    </svg>
                );
            case 'bluesky':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.7042 4.70625C17.7609 3.84708 17.1251 3.05625 16.2859 3.26958C13.2192 4.04708 10.7459 8.26708 9.99841 9.73208C9.25174 8.26708 6.77757 4.04708 3.71091 3.26958C2.87174 3.05708 2.23591 3.84708 2.29257 4.70625L2.54257 8.42791C2.66841 10.3279 4.30591 11.7729 6.21757 11.6729L6.62591 11.6429C6.59341 11.6487 4.20591 12.0746 3.80091 13.2937C3.25257 14.9462 4.86757 16.1337 4.86757 16.1337C4.88591 16.1537 6.44591 17.8804 8.00507 16.8829C9.22424 16.2912 9.99924 13.5412 9.99924 13.5412C9.99924 13.5412 10.7734 16.2912 11.9926 16.8829C13.5592 17.8854 15.1276 16.1362 15.1292 16.1329C15.1426 16.1246 16.7417 14.9404 16.1959 13.2937C15.7876 12.0662 13.3701 11.6437 13.3701 11.6437L13.7809 11.6729C15.6917 11.7729 17.3292 10.3271 17.4559 8.42791L17.7042 4.70625Z" stroke="#667085" stroke-width="1.25" stroke-linejoin="round" />
                    </svg>
                );
            case 'instagram':
                return (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6.75C8.40326 6.75 7.83097 6.98705 7.40901 7.40901C6.98705 7.83097 6.75 8.40326 6.75 9C6.75 9.59674 6.98705 10.169 7.40901 10.591C7.83097 11.0129 8.40326 11.25 9 11.25C9.59674 11.25 10.169 11.0129 10.591 10.591C11.0129 10.169 11.25 9.59674 11.25 9C11.25 8.40326 11.0129 7.83097 10.591 7.40901C10.169 6.98705 9.59674 6.75 9 6.75ZM9 5.25C9.99456 5.25 10.9484 5.64509 11.6517 6.34835C12.3549 7.05161 12.75 8.00544 12.75 9C12.75 9.99456 12.3549 10.9484 11.6517 11.6517C10.9484 12.3549 9.99456 12.75 9 12.75C8.00544 12.75 7.05161 12.3549 6.34835 11.6517C5.64509 10.9484 5.25 9.99456 5.25 9C5.25 8.00544 5.64509 7.05161 6.34835 6.34835C7.05161 5.64509 8.00544 5.25 9 5.25ZM13.875 5.0625C13.875 5.31114 13.7762 5.5496 13.6004 5.72541C13.4246 5.90123 13.1861 6 12.9375 6C12.6889 6 12.4504 5.90123 12.2746 5.72541C12.0988 5.5496 12 5.31114 12 5.0625C12 4.81386 12.0988 4.5754 12.2746 4.39959C12.4504 4.22377 12.6889 4.125 12.9375 4.125C13.1861 4.125 13.4246 4.22377 13.6004 4.39959C13.7762 4.5754 13.875 4.81386 13.875 5.0625ZM9 3C7.1445 3 6.8415 3.00525 5.97825 3.0435C5.39025 3.07125 4.99575 3.15 4.62975 3.2925C4.30425 3.4185 4.0695 3.56925 3.81975 3.81975C3.58501 4.04655 3.40451 4.32344 3.29175 4.62975C3.14925 4.99725 3.0705 5.391 3.0435 5.97825C3.0045 6.80625 3 7.09575 3 9C3 10.8555 3.00525 11.1585 3.0435 12.0217C3.07125 12.609 3.15 13.0043 3.29175 13.3695C3.41925 13.6958 3.56925 13.9305 3.81825 14.1795C4.071 14.4315 4.30575 14.5822 4.62825 14.7067C4.99875 14.85 5.39325 14.9295 5.97825 14.9565C6.80625 14.9955 7.09575 15 9 15C10.8555 15 11.1585 14.9948 12.0217 14.9565C12.6082 14.9288 13.0035 14.85 13.3695 14.7083C13.6943 14.5815 13.9305 14.4307 14.1795 14.1818C14.4323 13.929 14.583 13.6943 14.7075 13.3717C14.85 13.002 14.9295 12.6067 14.9565 12.0217C14.9955 11.1937 15 10.9043 15 9C15 7.1445 14.9948 6.8415 14.9565 5.97825C14.9288 5.39175 14.85 4.99575 14.7075 4.62975C14.5945 4.32375 14.4143 4.04697 14.1803 3.81975C13.9536 3.58488 13.6766 3.40438 13.3702 3.29175C13.0027 3.14925 12.6082 3.0705 12.0217 3.0435C11.1937 3.0045 10.9043 3 9 3ZM9 1.5C11.0378 1.5 11.292 1.5075 12.0915 1.545C12.8903 1.5825 13.434 1.70775 13.9125 1.89375C14.4075 2.08425 14.8245 2.34225 15.2415 2.7585C15.6229 3.13342 15.918 3.58694 16.1063 4.0875C16.2915 4.56525 16.4175 5.10975 16.455 5.9085C16.4903 6.708 16.5 6.96225 16.5 9C16.5 11.0378 16.4925 11.292 16.455 12.0915C16.4175 12.8903 16.2915 13.434 16.1063 13.9125C15.9185 14.4133 15.6233 14.867 15.2415 15.2415C14.8665 15.6227 14.413 15.9178 13.9125 16.1063C13.4347 16.2915 12.8903 16.4175 12.0915 16.455C11.292 16.4903 11.0378 16.5 9 16.5C6.96225 16.5 6.708 16.4925 5.9085 16.455C5.10975 16.4175 4.566 16.2915 4.0875 16.1063C3.58674 15.9184 3.13315 15.6232 2.7585 15.2415C2.37705 14.8666 2.08195 14.4131 1.89375 13.9125C1.70775 13.4347 1.5825 12.8903 1.545 12.0915C1.50975 11.292 1.5 11.0378 1.5 9C1.5 6.96225 1.5075 6.708 1.545 5.9085C1.5825 5.109 1.70775 4.566 1.89375 4.0875C2.08143 3.58663 2.3766 3.13299 2.7585 2.7585C3.13325 2.37692 3.58682 2.0818 4.0875 1.89375C4.566 1.70775 5.109 1.5825 5.9085 1.545C6.708 1.50975 6.96225 1.5 9 1.5Z" fill="#667085" />
                    </svg>
                );
            case 'linkedin':
                return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9974 7.95573C10.7616 7.1749 11.7566 6.66406 12.9141 6.66406C14.1296 6.66406 15.2954 7.14695 16.155 8.00649C17.0145 8.86603 17.4974 10.0318 17.4974 11.2474V17.4974H15.8307V11.2474C15.8307 10.4738 15.5234 9.73198 14.9765 9.185C14.4295 8.63802 13.6876 8.33073 12.9141 8.33073C12.1405 8.33073 11.3986 8.63802 10.8517 9.185C10.3047 9.73198 9.9974 10.4738 9.9974 11.2474V17.4974H8.33073V7.08073H9.9974V7.95573ZM4.16406 5.41406C3.83254 5.41406 3.5146 5.28237 3.28018 5.04795C3.04576 4.81353 2.91406 4.49558 2.91406 4.16406C2.91406 3.83254 3.04576 3.5146 3.28018 3.28018C3.5146 3.04576 3.83254 2.91406 4.16406 2.91406C4.49558 2.91406 4.81353 3.04576 5.04795 3.28018C5.28237 3.5146 5.41406 3.83254 5.41406 4.16406C5.41406 4.49558 5.28237 4.81353 5.04795 5.04795C4.81353 5.28237 4.49558 5.41406 4.16406 5.41406ZM3.33073 7.08073H4.9974V17.4974H3.33073V7.08073Z" fill="#667085" />
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
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6565 1.6875H16.1375L10.7173 7.8825L17.0938 16.3125H12.101L8.19053 11.1997L3.71606 16.3125H1.23356L7.03106 9.68625L0.914062 1.6875H6.03356L9.56828 6.36075L13.6565 1.6875ZM12.7858 14.8275H14.1605L5.28656 3.0945H3.81131L12.7858 14.8275Z" fill="#667085" />
                    </svg>
);
            case 'threads':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.375 10C4.375 7.29417 5.0925 5.60667 6.14167 4.58917C7.19583 3.56833 8.685 3.125 10.4333 3.125C12.8133 3.125 14.8875 4.3475 15.6542 6.755C15.7044 6.91302 15.8154 7.0446 15.9627 7.12079C16.11 7.19698 16.2816 7.21153 16.4396 7.16125C16.5976 7.11097 16.7292 6.99997 16.8054 6.85268C16.8816 6.70538 16.8961 6.53386 16.8458 6.37583C15.8858 3.36333 13.2617 1.875 10.4325 1.875C8.48917 1.875 6.6375 2.36917 5.2725 3.69167C3.90333 5.01833 3.125 7.08083 3.125 10C3.125 12.9192 3.90333 14.9817 5.2725 16.3083C6.6375 17.6308 8.48917 18.125 10.4325 18.125C12.8758 18.125 14.9567 16.8108 15.8608 15.0583C16.3167 14.175 16.4775 13.1675 16.2033 12.1758C15.9283 11.1825 15.2367 10.2725 14.1117 9.54917L14.0558 9.5175C13.9294 9.45395 13.8007 9.39502 13.67 9.34083C13.6561 9.15972 13.6375 8.97806 13.6142 8.79583C13.4267 7.32083 12.5192 6.2975 11.3492 5.89583C10.1942 5.5 8.83583 5.72667 7.7475 6.61083C7.68096 6.66157 7.6253 6.72516 7.58379 6.79782C7.54229 6.87047 7.5158 6.95073 7.5059 7.03381C7.49599 7.1169 7.50287 7.20113 7.52612 7.28151C7.54938 7.36189 7.58854 7.43678 7.64128 7.50174C7.69402 7.5667 7.75926 7.62041 7.83315 7.65969C7.90704 7.69896 7.98806 7.723 8.0714 7.73037C8.15475 7.73775 8.23874 7.72832 8.31837 7.70263C8.39801 7.67694 8.47167 7.63552 8.535 7.58083C9.30667 6.955 10.2167 6.82917 10.9433 7.07833C11.6567 7.32333 12.2458 7.945 12.3742 8.95333V8.955C11.5133 8.78583 10.6092 8.76583 9.805 8.90583C9.12167 9.02583 8.46 9.27 7.955 9.68917C7.43417 10.1225 7.09917 10.7308 7.09667 11.4925V11.4958C7.09626 11.537 7.09737 11.5781 7.1 11.6192C7.12074 12.0482 7.23599 12.4673 7.4375 12.8467C7.62333 13.1933 7.915 13.5467 8.35917 13.81C8.80333 14.0733 9.365 14.225 10.0617 14.225C11.5617 14.225 12.6083 13.6008 13.1808 12.5175C13.4542 12.0008 13.6067 11.4008 13.6675 10.7583C14.4325 11.3083 14.8367 11.9217 14.9983 12.5083C15.1775 13.1558 15.0825 13.84 14.75 14.485C14.0767 15.7892 12.445 16.875 10.4333 16.875C8.685 16.875 7.19583 16.4317 6.14167 15.4108C5.0925 14.3942 4.375 12.7058 4.375 10ZM10.02 10.1375C10.7742 10.0058 11.6517 10.0517 12.4467 10.2517C12.4275 10.9325 12.3042 11.5017 12.0758 11.9333C11.7475 12.5542 11.1608 12.975 10.0617 12.975C9.55083 12.975 9.21667 12.865 8.99667 12.7333C8.80205 12.619 8.64307 12.4528 8.5375 12.2533C8.42501 12.0392 8.36046 11.8032 8.34833 11.5617L8.3475 11.5C8.3475 11.14 8.49 10.87 8.75417 10.65C9.03667 10.4167 9.46833 10.2333 10.02 10.1375Z" fill="#667085" />
                    </svg>
                );
            case 'reddit':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.625 11.0938C5.625 11.3838 5.74023 11.662 5.94535 11.8671C6.15047 12.0723 6.42867 12.1875 6.71875 12.1875C7.00883 12.1875 7.28703 12.0723 7.49215 11.8671C7.69727 11.662 7.8125 11.3838 7.8125 11.0938C7.8125 10.8037 7.69727 10.5255 7.49215 10.3204C7.28703 10.1152 7.00883 10 6.71875 10C6.42867 10 6.15047 10.1152 5.94535 10.3204C5.74023 10.5255 5.625 10.8037 5.625 11.0938ZM12.2402 13.4316C11.7891 13.7871 10.8945 14.1699 10 14.1699C9.10547 14.1699 8.21094 13.7871 7.75977 13.4316C7.47852 13.2109 7.07031 13.2578 6.84766 13.5391C6.625 13.8203 6.67383 14.2285 6.95508 14.4512C7.74023 15.0703 8.93555 15.4688 10 15.4688C11.0645 15.4688 12.2598 15.0703 13.0449 14.4512C13.1801 14.3445 13.2674 14.1884 13.2875 14.0174C13.3077 13.8463 13.2591 13.6743 13.1523 13.5391C13.0456 13.4039 12.8896 13.3166 12.7185 13.2964C12.5475 13.2763 12.3754 13.3249 12.2402 13.4316ZM18.75 8.90625C18.75 7.69727 17.7715 6.71875 16.5625 6.71875C15.7402 6.71875 15.0254 7.17188 14.6504 7.84375C13.5254 7.22852 12.1562 6.83203 10.6641 6.74023L11.9707 3.80859L14.4688 4.5293C14.6934 5.16602 15.3008 5.625 16.0156 5.625C16.9219 5.625 17.6562 4.89062 17.6562 3.98438C17.6562 3.07812 16.9219 2.34375 16.0156 2.34375C15.3906 2.34375 14.8477 2.69336 14.5703 3.20703L11.7871 2.40234C11.6365 2.3586 11.4752 2.37091 11.333 2.43699C11.1908 2.50306 11.0773 2.61843 11.0137 2.76172L9.24023 6.74414C7.78516 6.8457 6.44922 7.24023 5.34961 7.8418C5.15999 7.50111 4.88271 7.21733 4.5465 7.01986C4.2103 6.8224 3.8274 6.71844 3.4375 6.71875C2.22852 6.71875 1.25 7.69727 1.25 8.90625C1.25 9.80078 1.78711 10.5684 2.55469 10.9082C2.41602 11.3184 2.34375 11.748 2.34375 12.1875C2.34375 15.207 5.77148 17.6562 10 17.6562C14.2285 17.6562 17.6562 15.207 17.6562 12.1875C17.6562 11.7461 17.582 11.3184 17.4453 10.9082C18.2129 10.5684 18.75 9.80078 18.75 8.90625ZM16.0156 3.36914C16.0964 3.36914 16.1764 3.38505 16.2511 3.41597C16.3257 3.44689 16.3935 3.49221 16.4507 3.54934C16.5078 3.60647 16.5531 3.67429 16.584 3.74893C16.6149 3.82358 16.6309 3.90358 16.6309 3.98438C16.6309 4.06517 16.6149 4.14517 16.584 4.21982C16.5531 4.29446 16.5078 4.36228 16.4507 4.41941C16.3935 4.47654 16.3257 4.52186 16.2511 4.55278C16.1764 4.5837 16.0964 4.59961 16.0156 4.59961C15.8525 4.59961 15.696 4.53479 15.5806 4.41941C15.4652 4.30403 15.4004 4.14755 15.4004 3.98438C15.4004 3.8212 15.4652 3.66472 15.5806 3.54934C15.696 3.43396 15.8525 3.36914 16.0156 3.36914ZM2.34375 8.90625C2.34375 8.30273 2.83398 7.8125 3.4375 7.8125C3.6447 7.81266 3.84759 7.87168 4.02255 7.98267C4.19752 8.09366 4.33735 8.25207 4.42578 8.43945C3.85352 8.87305 3.38086 9.37305 3.0293 9.92188C2.82705 9.83986 2.65382 9.69945 2.53171 9.51856C2.40961 9.33767 2.34417 9.1245 2.34375 8.90625ZM10 16.3574C6.48828 16.3574 3.64258 14.4902 3.64258 12.1875C3.64258 9.88477 6.48828 8.01758 10 8.01758C13.5117 8.01758 16.3574 9.88477 16.3574 12.1875C16.3574 14.4902 13.5117 16.3574 10 16.3574ZM16.9688 9.92188C16.6191 9.37305 16.1445 8.87305 15.5723 8.43945C15.748 8.07031 16.125 7.8125 16.5605 7.8125C17.1641 7.8125 17.6543 8.30273 17.6543 8.90625C17.6562 9.36523 17.3711 9.75977 16.9688 9.92188ZM12.1875 11.0938C12.1875 11.3838 12.3027 11.662 12.5079 11.8671C12.713 12.0723 12.9912 12.1875 13.2812 12.1875C13.5713 12.1875 13.8495 12.0723 14.0546 11.8671C14.2598 11.662 14.375 11.3838 14.375 11.0938C14.375 10.8037 14.2598 10.5255 14.0546 10.3204C13.8495 10.1152 13.5713 10 13.2812 10C12.9912 10 12.713 10.1152 12.5079 10.3204C12.3027 10.5255 12.1875 10.8037 12.1875 11.0938Z" fill="#667085" />
                    </svg>
                );
            default:
                return null;
        }
    };
    const allowedSocialOrder = [
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
        'youtube',
    ];
    const formatToAMPM = (time: string) => {
        const [hourStr, minuteStr] = time.split(':');
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert '0' or '12' to '12'
        return `${hour}:${minute} ${ampm}`;
    };
    return (
        <div className="w-full  ">
            <BookingWidget profileData={profileData} />

            {/* Achievement Badges */}
            {false && (
            <div className="mb-6  shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200">
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
            </div>
            )}

            {/* Service Areas */}
            {
                profileData?.ServiceAreas && <div className="bg-white p-4 rounded-lg  w-full border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Service Areas</h2>
                    <div className="flex flex-wrap gap-2">
                        {profileData?.ServiceAreas?.split('|')?.map((style, index) => (
                            <span
                                key={index}
                                className="px-4 py-1 text-sm border border-[#EAECF0] rounded-full text-gray-700"
                            >
                                {style}
                            </span>
                        ))}
                    </div>
                </div>
            }

            {/* Service Offered */}
            {
                profileData?.ServiceOffered?.length > 0 && <div className="bg-white p-4 rounded-lg  w-full border border-gray-200 space-y-4 mt-6">
                    <h2 className="text-xl font-semibold text-gray-900">Service Offered</h2>

                    <>
                        {profileData?.ServiceOffered?.map((type, index) => (
                            <div key={index} className="bg-[#FCFCFD] p-4 rounded-xl border">
                                <h3 className="font-semibold text-gray-900">{type?.Title}</h3>
                                <p className="text-sm text-[#475467] mt-1">
                                    {type?.Description}
                                </p>
                            </div>
                        ))}
                    </>


                </div>
            }

            {/* Service Geography */}
            <div className=" mx-auto bg-white p-4 rounded-lg space-y-1.5  w-full border border-gray-200 mt-6">
                <h2 className="text-xl font-semibold pb-3">Service Geography</h2>
                <p className="text-4 text-gray-900">
                    <span className="font-semibold ">{profileData?.ServiceGeography ? 'Primary :' : ''}</span>
                    {profileData?.ServiceGeography
                        ? profileData.ServiceGeography.split('|').map((item, index) => (
                            <span key={index}> {item ? item + (index !== profileData.ServiceGeography.split('|').length - 1 ? ',' : '') : 'Not specified'}</span>
                        ))
                        : <span> Not specified</span>}
                </p>
                <p className="text-4 text-gray-900 "><span className=" font-semibold ">Remote :</span> {profileData?.ConsultationAvailable ? "Virtual" : "No virtual"}  consultations available</p>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Availability</h3>
                    <div className="flex  items-start gap-2 text-sm text-gray-700">
                        {
                            profileData?.Availability?.length > 0 &&
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.0013 5.0013V10.0013L13.3346 11.668M18.3346 10.0013C18.3346 14.6037 14.6037 18.3346 10.0013 18.3346C5.39893 18.3346 1.66797 14.6037 1.66797 10.0013C1.66797 5.39893 5.39893 1.66797 10.0013 1.66797C14.6037 1.66797 18.3346 5.39893 18.3346 10.0013Z"
                                    stroke="#98A2B3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }

                        <div className="flex flex-col">
                            {profileData?.Availability?.length > 0 && (
                                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-gray-700">
                                    {profileData.Availability.map((slot: any, index: number) => (
                                        <React.Fragment key={slot.Id || index}>
                                            <div className="font-medium">{slot.Day}</div>
                                            <div>
                                                {formatToAMPM(slot.TimeFrom)} - {formatToAMPM(slot.TimeTo)}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-700 mt-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.98356 7.37779C7.56356 8.58581 8.35422 9.71801 9.35553 10.7193C10.3568 11.7206 11.4891 12.5113 12.6971 13.0913C12.801 13.1412 12.8529 13.1661 12.9187 13.1853C13.1523 13.2534 13.4392 13.2045 13.637 13.0628C13.6927 13.0229 13.7403 12.9753 13.8356 12.88C14.1269 12.5887 14.2726 12.443 14.4191 12.3478C14.9715 11.9886 15.6837 11.9886 16.2361 12.3478C16.3825 12.443 16.5282 12.5887 16.8196 12.88L16.9819 13.0424C17.4248 13.4853 17.6462 13.7067 17.7665 13.9446C18.0058 14.4175 18.0058 14.9761 17.7665 15.449C17.6462 15.6869 17.4248 15.9083 16.9819 16.3512L16.8506 16.4825C16.4092 16.9239 16.1886 17.1446 15.8885 17.3131C15.5556 17.5001 15.0385 17.6346 14.6567 17.6334C14.3126 17.6324 14.0774 17.5657 13.607 17.4322C11.0792 16.7147 8.69387 15.361 6.70388 13.371C4.7139 11.381 3.36017 8.99569 2.6427 6.46786C2.50919 5.99749 2.44244 5.7623 2.44141 5.41818C2.44028 5.03633 2.57475 4.51925 2.76176 4.18633C2.9303 3.88631 3.15098 3.66563 3.59233 3.22428L3.72369 3.09292C4.16656 2.65005 4.388 2.42861 4.62581 2.30833C5.09878 2.0691 5.65734 2.0691 6.1303 2.30832C6.36812 2.42861 6.58955 2.65005 7.03242 3.09291L7.19481 3.25531C7.48615 3.54665 7.63182 3.69231 7.72706 3.8388C8.08622 4.3912 8.08622 5.10336 7.72706 5.65576C7.63182 5.80225 7.48615 5.94791 7.19481 6.23925C7.09955 6.33451 7.05192 6.38214 7.01206 6.43782C6.87038 6.63568 6.82146 6.92256 6.88957 7.15619C6.90873 7.22193 6.93367 7.27389 6.98356 7.37779Z" stroke="#98A2B3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                        <div className="flex flex-col">
                            {profileData?.AcceptingClients ? (
                                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-gray-700">
                                    Currently accepting new clients
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">Currently not accepting new clients</div>
                            )}
                        </div>


                    </div>
                </div>
                {profileData?.ResponseTime &&
                    <div>
                        <p className="text-sm font-semibold text-[#344054] pt-1">
                            Response Time: <span className="font-normal text-[#344054]">{profileData?.ResponseTime}</span>
                        </p>
                    </div>
                }
            </div>
            {/* Associated People */}
            {
                profileData?.AssociatePeoples?.length > 0 && (
                    <div className=" shadow-[#1018280F] shadow-sm bg-white mt-6 p-4 rounded-lg  w-full border border-gray-200 mb-6">
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
            {/* Contact Information */}
            {(
                profileData?.WebsiteUrl ||
                profileData?.PhoneNumber ||
                profileData?.UserEmailId ||
                (profileData?.SocialMediaUrls?.some(item => item?.SocialMediaUrl?.trim()))
            ) && (
                    <div className="mb-6 bg-white p-4 rounded-lg w-full border border-gray-200 mt-6">
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
                                    {/* SVG omitted for brevity */}
                                    <span className="text-[#2357C6] break-all">{profileData?.WebsiteUrl}</span>
                                </a>
                            )}

                            {/* Phone */}
                            {profileData?.PhoneNumber && (
                                <p className="flex items-center gap-2 text-gray-600 md:py-3">
                                    {/* SVG omitted for brevity */}
                                    {profileData?.PhoneNumber}
                                </p>
                            )}

                            {/* Email */}
                            {profileData?.UserEmailId && (
                                <a
                                    href={`mailto:${profileData?.UserEmailId}`}
                                    className="col-span-2 flex items-center gap-2 text-gray-600 hover:text-blue-600 overflow-hidden"
                                >
                                    <svg
                                        className="h-5 w-5 shrink-0"
                                        viewBox="0 0 19 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.1665 3.83203L7.9706 8.5949C8.52158 8.98058 8.79707 9.17343 9.09672 9.24812C9.36142 9.3141 9.63826 9.3141 9.90295 9.24812C10.2026 9.17343 10.4781 8.98058 11.0291 8.5949L17.8332 3.83203M5.1665 14.6654H13.8332C15.2333 14.6654 15.9334 14.6654 16.4681 14.3929C16.9386 14.1532 17.321 13.7707 17.5607 13.3003C17.8332 12.7656 17.8332 12.0655 17.8332 10.6654V5.33203C17.8332 3.9319 17.8332 3.23183 17.5607 2.69705C17.321 2.22665 16.9386 1.8442 16.4681 1.60451C15.9334 1.33203 15.2333 1.33203 13.8332 1.33203H5.1665C3.76637 1.33203 3.06631 1.33203 2.53153 1.60451C2.06112 1.8442 1.67867 2.22665 1.43899 2.69705C1.1665 3.23183 1.1665 3.9319 1.1665 5.33203V10.6654C1.1665 12.0655 1.1665 12.7656 1.43899 13.3003C1.67867 13.7707 2.06112 14.1532 2.53153 14.3929C3.06631 14.6654 3.76637 14.6654 5.1665 14.6654Z"
                                            stroke="#98A2B3"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="break-all min-w-0 text-sm">{profileData?.UserEmailId}</span>
                                </a>

                            )}
                        </div>

                        <div className="flex border-t-2 border-gray-300 py-5 mt-5">
                            <div className="flex flex-wrap gap-2 text-sm">
                                {profileData?.SocialMediaUrls?.filter(item => item?.SocialMediaUrl?.trim())?.length > 0 ? (
                                    allowedSocialOrder
                                        .map(type => profileData?.SocialMediaUrls?.find(item => item?.LinkType?.toLowerCase() === type))
                                        .filter(Boolean)
                                        .map((item, index) => {
                                            const socialUrl = item?.SocialMediaUrl || '';
                                            const url = socialUrl.startsWith('http')
                                                ? socialUrl
                                                : `https://${socialUrl}`;

                                            return (
                                                <a
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                                                >
                                                    {getSocialIcon(item?.LinkType)}
                                                </a>
                                            );
                                        })
                                ) : (
                                    <p className="text-gray-500">No social media links available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}


            {/* Language */}
            {profileData?.Languages?.length > 0 &&
                <div className="mb-6 border-1  shadow-[#1018280F]  bg-white p-4 rounded-lg w-full border border-gray-200">
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
            {
                profileData?.CountryName && profileData?.CityName && <div className=" shadow-[#1018280F] shadow-sm bg-white p-4 rounded-lg  w-full border border-gray-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
                    <p className="text-[#101828] flex mb-2">
                        <svg className="h-5 w-5" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.66634 14.9487C7.98527 14.7348 6.44872 13.8888 5.369 12.5826C4.28928 11.2765 3.74741 9.60827 3.85352 7.91697C3.95964 6.22567 4.70578 4.63823 5.9403 3.47731C7.17481 2.31639 8.80505 1.66909 10.4997 1.66699C12.1964 1.66573 13.8297 2.31144 15.0669 3.47256C16.3041 4.63368 17.052 6.22282 17.1582 7.91619C17.2645 9.60956 16.7211 11.2797 15.6387 12.5864C14.5564 13.893 13.0166 14.7378 11.333 14.9487V16.677C14.6213 16.7537 17.1663 17.2795 17.1663 17.917C17.1663 18.607 14.1813 19.167 10.4997 19.167C6.81801 19.167 3.83301 18.607 3.83301 17.917C3.83301 17.2795 6.37801 16.7537 9.66634 16.677V14.9487ZM10.4997 13.3337C11.8258 13.3337 13.0975 12.8069 14.0352 11.8692C14.9729 10.9315 15.4997 9.65974 15.4997 8.33366C15.4997 7.00758 14.9729 5.73581 14.0352 4.79813C13.0975 3.86045 11.8258 3.33366 10.4997 3.33366C9.17359 3.33366 7.90182 3.86045 6.96414 4.79813C6.02646 5.73581 5.49967 7.00758 5.49967 8.33366C5.49967 9.65974 6.02646 10.9315 6.96414 11.8692C7.90182 12.8069 9.17359 13.3337 10.4997 13.3337ZM10.4997 10.0003C10.0576 10.0003 9.63372 9.82473 9.32116 9.51217C9.0086 9.19961 8.83301 8.77569 8.83301 8.33366C8.83301 7.89163 9.0086 7.46771 9.32116 7.15515C9.63372 6.84259 10.0576 6.66699 10.4997 6.66699C10.9417 6.66699 11.3656 6.84259 11.6782 7.15515C11.9907 7.46771 12.1663 7.89163 12.1663 8.33366C12.1663 8.77569 11.9907 9.19961 11.6782 9.51217C11.3656 9.82473 10.9417 10.0003 10.4997 10.0003Z" fill="#98A2B3" />
                        </svg>
                        {[profileData?.CountryName, profileData?.CityName].filter(Boolean).join(', ')}
                    </p>

                    <MapComponent
                        address={profileData?.CityName || profileData?.StateName || profileData?.CountryName}
                    />
                </div>
            }

            {
                isPitchbookModalOpen && profileData?.Pitchbook && !isCurrentUserAdvocate && (
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
                )
            }
            {
                isAssociateModalOpen && selectedPerson && (
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
                )
            }

        </div >
    );
}

export default ProfileSidebar;

function redirect(arg0: string) {
    throw new Error("Function not implemented.");
}
