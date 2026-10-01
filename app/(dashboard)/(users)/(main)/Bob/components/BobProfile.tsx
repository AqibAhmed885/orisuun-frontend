'use client';
import { getOriginalPrivateId } from "@/utils/profile.helpers";
import { useEffect, useState } from "react";
import { fetchProfileDetails } from "@/app/api/profile-details";
import { CampaignDetailsProvider } from '@/components/fundraising/campaign-details/context/campaign-context'
import ProfileShimmer from "../../profile/components/ProfileShimmer";
import ProfileSidebarShimmer from "../../profile/components/ProfileSidebar";
import TabSectionShimmer from "../../profile/components/TabSectionShimmer";
import BusinessProfile from "../BusinessProfile";
import ProfileSidebar from "./sidebar/ProfileSidebar";
import TabSection from "./TabSection";

const BobProfile = ({ params, searchParams}) => {
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
                <div className="text-red-600 text-base">Failed to load profile data.</div>
            </div>
        );
    }


    return (
        <div className="min-h-screen  text-base" style={{fontSize: '1rem'}}>
            <div className=" mx-auto md:px-4 md:py-6" style={{fontSize: '1rem'}}>
                <div className='mb-6'>
                    <BusinessProfile profileData={profileData} />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 min-h-0">
                    <div className="w-full lg:w-[360px] order-2 lg:order-1">
                        <ProfileSidebar profileData={profileData} />
                    </div>
                    <div className="w-full lg:flex-1 order-1 lg:order-2 min-h-0" style={{fontSize: '1rem'}}>
                        <CampaignDetailsProvider>
                            <TabSection profileData={profileData} UserProfileDetailId={getOriginalPrivateId(params.id)} />
                        </CampaignDetailsProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BobProfile;
