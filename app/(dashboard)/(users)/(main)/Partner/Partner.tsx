'use client';
import { getOriginalPrivateId } from "@/utils/profile.helpers";
import { useEffect, useState } from "react";
import { fetchProfileDetails } from "@/app/api/profile-details";
import InvestorProfile from "../Mentor/MentorProfile";
// import TabSection from "./TabSection";
// import ProfileSidebar from "./Sidebar/ProfileSidebar";
import Loader from "@/components/ui/loader";
import ProfileSidebar from "../Mentor/ProfileSidebar";
import TabSection from "./TabSection";
import PartnerProfile from "./PartnerProfile";
import ProfileShimmer from "../profile/components/ProfileShimmer";
import ProfileSidebarShimmer from "../profile/components/ProfileSidebar";
import TabSectionShimmer from "../profile/components/TabSectionShimmer";
const Partner = ({ params, searchParams }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchProfileData = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('userData'));
            const profile = await fetchProfileDetails({ username: params.username, profileId: params.id, viewer: currentUser });
            setProfileData(profile);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [params.id, params.username]);

    if (loading) {
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
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-600 text-lg">Failed to load profile data.</div>
            </div>
        );
    }
    const formatToK = (value) => {
        if (value == null || value === '') return '—';

        const num = parseFloat(value);
        if (isNaN(num)) return value;

        const absNum = Math.abs(num); // Support negative numbers
        const sign = num < 0 ? '-' : '';

        if (absNum >= 1_000_000_000_000) return sign + (absNum / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
        if (absNum >= 1_000_000_000) return sign + (absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (absNum >= 1_000_000) return sign + (absNum / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (absNum >= 1_000) return sign + (absNum / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';

        return sign + absNum.toString();
    };

    return (
        <div>
            {/* <div className="text-lg font-semibold px-8 py-2 bg-white">
                Mentor Profile
            </div> */}
            <div className="max-w-[100rem] mx-auto px-4 py-6  " style={{fontSize: '1rem'}}>
                <div className='mb-6'>
                    <PartnerProfile profileData={profileData} />
                </div>
                <div className="w-[98%] mx-auto mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='w-6 h-6' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3346 9.16667H15.3346C16.2681 9.16667 16.7348 9.16667 17.0913 9.34832C17.4049 9.50811 17.6599 9.76308 17.8196 10.0767C18.0013 10.4332 18.0013 10.8999 18.0013 11.8333V17.5M11.3346 17.5V5.16667C11.3346 4.23325 11.3346 3.76654 11.153 3.41002C10.9932 3.09641 10.7382 2.84144 10.4246 2.68166C10.0681 2.5 9.60139 2.5 8.66797 2.5H5.66797C4.73455 2.5 4.26784 2.5 3.91132 2.68166C3.59771 2.84144 3.34275 3.09641 3.18296 3.41002C3.0013 3.76654 3.0013 4.23325 3.0013 5.16667V17.5M18.8346 17.5H2.16797M5.91797 5.83333H8.41797M5.91797 9.16667H8.41797M5.91797 12.5H8.41797" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <p className="text-sm text-[#080808]">Businesses Supported</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">{profileData?.BusinessesSupported || '-'}</p>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='w-6 h-6' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.66797 13.3307C5.66797 15.1717 7.16035 16.6641 9.0013 16.6641H12.3346C14.1756 16.6641 15.668 15.1717 15.668 13.3307C15.668 11.4898 14.1756 9.9974 12.3346 9.9974H9.0013C7.16035 9.9974 5.66797 8.50501 5.66797 6.66406C5.66797 4.82311 7.16035 3.33073 9.0013 3.33073H12.3346C14.1756 3.33073 15.668 4.82311 15.668 6.66406M10.668 1.66406V18.3307" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>


                            </div>
                            <p className="text-sm text-[#080808]">Total Invested</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">${formatToK(profileData?.TotalInvested) || '-'}</p>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='w-6 h-6' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.99843 15.8336V10.0003M10.2413 15.9041L16.0567 17.851C16.5125 18.0035 16.7404 18.0798 16.8809 18.0251C17.0029 17.9775 17.0955 17.8754 17.1309 17.7493C17.1716 17.6041 17.0733 17.3848 16.8768 16.9462L10.6364 3.01891C10.4442 2.58999 10.3481 2.37553 10.2143 2.30908C10.098 2.25135 9.96139 2.25113 9.84491 2.30849C9.71084 2.37451 9.61405 2.58866 9.42049 3.01696L3.12508 16.947C2.927 17.3853 2.82796 17.6044 2.86823 17.7498C2.90321 17.8761 2.99552 17.9785 3.11745 18.0264C3.25786 18.0815 3.4861 18.0058 3.94259 17.8543L9.8197 15.9036C9.89795 15.8776 9.93708 15.8646 9.9771 15.8595C10.0126 15.855 10.0486 15.855 10.0841 15.8597C10.1241 15.8649 10.1632 15.878 10.2413 15.9041Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>


                            </div>
                            <p className="text-sm text-[#080808]">Campaign Sponsored</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">{profileData?.CampaignsSponsored}</p>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='w-6 h-6' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.8359 8.33073H2.83594M13.6693 1.66406V4.9974M7.0026 1.66406V4.9974M6.83594 18.3307H13.8359C15.2361 18.3307 15.9361 18.3307 16.4709 18.0582C16.9413 17.8186 17.3238 17.4361 17.5635 16.9657C17.8359 16.4309 17.8359 15.7309 17.8359 14.3307V7.33073C17.8359 5.9306 17.8359 5.23053 17.5635 4.69575C17.3238 4.22535 16.9413 3.8429 16.4709 3.60321C15.9361 3.33073 15.2361 3.33073 13.8359 3.33073H6.83594C5.43581 3.33073 4.73574 3.33073 4.20096 3.60321C3.73056 3.8429 3.3481 4.22535 3.10842 4.69575C2.83594 5.23053 2.83594 5.9306 2.83594 7.33073V14.3307C2.83594 15.7309 2.83594 16.4309 3.10842 16.9657C3.3481 17.4361 3.73056 17.8186 4.20096 18.0582C4.73574 18.3307 5.43581 18.3307 6.83594 18.3307Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>


                            </div>
                            <p className="text-sm text-[#080808]">Years Active</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">{profileData?.YearsActive || '-'}</p>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 min-h-0 pt-6">
                    <div className="w-full lg:flex-1 p-4" style={{fontSize: '1rem'}}>
                        <TabSection profileData={profileData} UserProfileDetailId={getOriginalPrivateId(params.id)} />
                    </div>
                    <div className="w-full lg:w-3/12 order-1 lg:order-2">
                        <ProfileSidebar profileData={profileData} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Partner;
