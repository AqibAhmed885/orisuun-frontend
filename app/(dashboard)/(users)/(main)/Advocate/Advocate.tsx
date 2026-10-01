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
import PartnerProfile from "./AdvocateProfile";
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
                Advocate Profile
            </div> */}
            <div className="max-w-[100rem] mx-auto md:px-4 md:py-6" style={{fontSize: '1rem'}}>
                <div className='md:mb-6'>
                    <PartnerProfile profileData={profileData} params={params.id} />
                </div>

                
            </div>
        </div>
    );
};

export default Partner;
