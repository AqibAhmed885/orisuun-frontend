'use client'
import React, { act, useCallback, useEffect, useMemo, useState } from 'react';
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

    const fetchCampaignDetails = useCallback(async () => {
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
    }, [profileData?.CampaignId]);

    useEffect(() => {
        if (profileData?.CampaignId) fetchCampaignDetails();
    }, [fetchCampaignDetails, profileData?.CampaignId]);

    const isVerified = !!profileData.ProfileVerified;
    const isCurrentUserAdvocate = currentUser?.UserProfileType === 'Advocate';

    const tabs = useMemo<ProfileTab[]>(
        () => (isCurrentUserAdvocate
            ? ['Overview', 'Reviews', 'Consultations']
            : [
                'Overview',
                'Snapshot',
                'Credentials',
                'Opportunities',
                'Reviews',
                'Consultations',
                ...(isVerified ? ['Fundraising' as const] : []),
            ]),
        [isCurrentUserAdvocate, isVerified]
    );

    useEffect(() => {
        if (!tabs.includes(activeTab)) {
            setActiveTab('Overview');
        }
    }, [activeTab, tabs]);

    const tabWidthClass = isCurrentUserAdvocate
        ? 'w-1/3'
        : tabs.length === 4
            ? 'w-1/4'
            : tabs.length === 5
                ? 'w-1/5'
                : tabs.length === 6
                    ? 'w-1/6'
                    : 'w-[14.2857%]';
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
        <div ref={containerRef} className="w-full scroll-mt-4">
            {/* Navigation Tabs */}
            <div className="overflow-x-auto">
                <div className="tabs flex bg-[#F2F4F7] rounded-md p-[3px] md:p-[5px] whitespace-nowrap min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-2 md:px-4 ${tabWidthClass} py-2 text-sm rounded-md transition-colors duration-200
    ${activeTab === tab ? 'bg-white text-black shadow-sm font-semibold' : 'bg-transparent text-gray-600 hover:text-black'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>


            {/* Tab Content */}
            <div className="tab-content ">
                {activeTab === 'Overview' && (
                    <div className="overview-content">
                        <AboutCompany profileData={profileData} />


                    </div>
                )}

                {
                    activeTab === 'Snapshot' && (
                        <div className=''>
                            {
                                profileData.Resume &&
                                <div className="bg-white  p-4 rounded-xl mt-6 border border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900  mb-2">Resume</h2>
                                    <div className=" w-full flex flex-col bg-white p-4 rounded-xl mt-4 border border-gray-200">
                                        <div className="flex justify-between items-center px-4   bg-[#FCFCFD]">
                                            <h3 className="text-2xl font-medium">Resume</h3>
                                        </div>
                                        {
                                            profileData?.Resume ? <div className="flex-1 overflow-auto p-4 ">
                                                <iframe
                                                    src={profileData?.Resume || 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/3905c1f2-024b-4447-a06e-54c92899c604.pdf'}
                                                    className="w-full h-full min-h-[70vh]"
                                                    frameBorder="0"
                                                    title="Pitchbook"
                                                >
                                                    <p>Your browser does not support iframes. You can <a href={profileData.Pitchbook} target="_blank" rel="noopener noreferrer">download the PDF</a> instead.</p>
                                                </iframe>
                                            </div> : <p className='p-4'>No resume available</p>
                                        }
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
                            }

                            {/* Professional Snapshot  */}
                            {profileData?.IndustryExperience.length > 0 && profileData?.ClientSizeFocus.length > 0 &&
                                <div className=" bg-white  p-4 rounded-xl mt-6 border border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Snapshot</h2>

                                    <div className="w-full flex flex-col lg:flex-row gap-5">
                                        {/* Industry Experience */}
                                        <div className="w-full lg:w-1/2">
                                            <h3 className="text-md font-semibold text-gray-900 mb-3">Industry Experience</h3>
                                            {profileData?.IndustryExperience?.map((item, idx) => (
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
                                            {profileData?.ClientSizeFocus?.map((item, idx) => (
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
                            }
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
                    activeTab === 'Credentials' && (
                        <div>
                            {(
                                profileData?.UsersProfessionalExperience?.length > 0 ||
                                profileData?.UsersEducationCertification?.length > 0 ||
                                profileData?.UsersRecognitionAwards?.length > 0 ||
                                profileData?.UserSkills?.length > 0 ||
                                profileData?.UserPublicationResearch?.length > 0
                            ) ? (
                                <div className="overview-content ">
                                    {profileData?.UsersProfessionalExperience?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Professional Experience</h2>
                                            <ExperienceSection UsersProfessionalExperience={profileData?.UsersProfessionalExperience} />
                                        </div>
                                    )}

                                    {profileData?.UsersEducationCertification?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Education</h2>
                                            <Education UsersProfessionalExperience={profileData?.UsersEducationCertification} />
                                        </div>
                                    )}

                                    {profileData?.UsersRecognitionAwards?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Certifications</h2>
                                            <RecognitionAwards UsersRecognitionAwards={profileData?.UsersRecognitionAwards} />
                                        </div>
                                    )}

                                    {profileData?.UserSkills?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Skills</h2>
                                            <Skills UserSkills={profileData?.UserSkills} />
                                        </div>
                                    )}

                                    {profileData?.UserPublicationResearch?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Publications & Research</h2>
                                            <Publications UserPublicationResearch={profileData?.UserPublicationResearch} />
                                        </div>
                                    )}
                                </div>
                            ) : (<p className='p-1'>No Credentials</p>)}
                        </div>
                    )
                }

                {
                    activeTab === 'Reviews' && (
                        <div className="overview-content ">
                            <div className=''>

                                <TestimonialCard
                                    profileData={profileData?.ReviewList || []}
                                    GivenReview={profileData?.ProfileReviewTo}
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

                {activeTab === 'Consultations' && (
                    <Consultations profileData={profileData} />
                )}

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




        </div >
    );
};

export default TabSection;
