'use client'
import React, { act, useEffect, useState } from 'react';
import OpportunityCard from './tabsection/opportunities/OpportunityCard';
import Fundraising from './tabsection/fundraising/Fundraising';
import CampaignDetails from './tabsection/fundraising/CampaignDetails';
import Sponser from './tabsection/fundraising/Sponser';
import RecentContibution from './tabsection/fundraising/RecentContibution';
import Reward from './tabsection/fundraising/Reward';
import CampaignUpdates from './tabsection/fundraising/CampaignUpdates';
import BusinessSnapshot from './tabsection/snapshot/BusinessSnapshot';
import RevenueChart from './tabsection/snapshot/RevenueChart';
import BusinessHighlights from './tabsection/snapshot/BusinessHighlights';
import TestimonialCard from './tabsection/review/TestimonialCard';
import AboutCompany from './tabsection/overview/AboutCompany';
import Gallery from './tabsection/overview/Gallery';
import ListOfLocation from './tabsection/snapshot/ListOfLocation';
import DiscountSection from './tabsection/discount';
import { apiEndpoint } from '@/utils/utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProjectsSection from './tabsection/projects/ProjectsSection';
const TabSection = ({ profileData, UserProfileDetailId }) => {

    const [campaignDetails, setCampaignDetails] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Overview');
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

    const isBobBusinessProfile = profileData?.UserProfileType === 'Black-owned Business';
    const hasDiscountTab = isBobBusinessProfile && !isCurrentUserAdvocate;
    const hasProjectsTab = isBobBusinessProfile && !isCurrentUserAdvocate;

    const tabs = isCurrentUserAdvocate
        ? ['Overview', 'Reviews']
        : [
            'Overview',
            'Snapshot',
            'Opportunities',
            'Reviews',
            ...(isVerified ? ['Fundraising'] : []),
            ...(hasProjectsTab ? ['Projects'] : []),
            ...(hasDiscountTab ? ['Discounts'] : [])
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

    return (
        <div className="w-full">
            {/* Navigation Tabs */}
            <div className="tabs flex overflow-x-auto justify-between whitespace-nowrap bg-[#F2F4F7] rounded-md p-[3px] md:p-[5px]">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 px-2 md:px-4  py-2 text-sm md:text-sm rounded-md  transition-colors duration-200
        ${currentUser?.UserProfileType === 'Advocate'
                                ? 'min-w-1/2'
                                : isVerified
                                    ? 'min-w-[14%]'
                                    : ''
                            }
        ${activeTab === tab
                                ? 'bg-white text-black shadow-sm font-semibold'
                                : 'bg-transparent text-gray-600 hover:text-black'
                            }`}
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
                        {galleryItems.length > 0 && <Gallery items={galleryItems} />}


                    </div>
                )}

                {
                    activeTab === 'Snapshot' && (
                        <div className=''>
                            <div className="overview-content">
                                <div className='bg-white  rounded-xl shadow-md '>
                                    <BusinessSnapshot profileData={profileData} />
                                </div>
                            </div>
                            {
                                profileData?.LastRevenues && <div className='mt-3'>
                                    <RevenueChart LastRevenues={profileData?.LastRevenues} currency={profileData?.CurrencySymbol} />
                                </div>
                            }

                            {
                                profileData.UserProfileLocations?.length > 0 && <div className='mt-3'>
                                    <ListOfLocation locations={profileData?.UserProfileLocations} />
                                </div>
                            }


                            <BusinessHighlights profileData={profileData} />
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
                    activeTab === 'Reviews' && (
                        <div className="overview-content ">
                            <div className='bg-white p-4 rounded-xl shadow-md border border-gray-200 '>

                                <TestimonialCard
                                    profileData={profileData?.ReviewList || []}
                                    currentUser={currentUser}
                                    apiEndpoint={apiEndpoint}
                                    userId={profileData?.UserId}
                                    UserProfileDetailId={UserProfileDetailId}

                                />
                            </div>
                        </div>
                    )
                }
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
                                {campaignDetails ? (
                                    <Fundraising campaignDetails={campaignDetails} />
                                ) : (
                                    <p className="text-gray-600 text-center">No active fundraising campaigns at the moment.</p>
                                )}
                                {/* <Fundraising campaignDetails={campaignDetails} /> */}
                            </div>

                            <div className='bg-white p-4 rounded-xl border border-gray-200 mt-4'>
                                <div className="flex justify-between items-start mb-2">
                                    <div className='py-2'>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">Campaign Details</h2>
                                            <p className="mb-2 text-gray-600">Support our growth and expansion</p>
                                        </div>
                                        {campaignDetails ? (
                                            <CampaignDetails campaignDetails={campaignDetails} />
                                        ) : (
                                            <p className="w-full text-gray-600 text-center">No campaign details available.</p>
                                        )}
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
                            {campaignDetails ? (
                                <CampaignUpdates campaignDetails={campaignDetails} />
                            ) : (
                                <p className="text-gray-600 text-center">No campaign updates available.</p>
                            )}
                        </div>
                    )
                }

                {/* {activeTab !== 'Overview' && (
                    <div className="other-tab-content">
                        <h2>{activeTab} Content</h2>
                        <p>This section would contain {activeTab.toLowerCase()} information about the business.</p>
                    </div>
                )} */}

                {hasDiscountTab && activeTab === 'Discounts' && (
                    <DiscountSection profileData={profileData} />
                )}

                {hasProjectsTab && activeTab === 'Projects' && (
                    <ProjectsSection profileUserId={profileData?.UserId} />
                )}
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