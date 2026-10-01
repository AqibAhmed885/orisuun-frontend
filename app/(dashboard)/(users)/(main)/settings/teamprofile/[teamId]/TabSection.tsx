'use client'
import React, { act, useEffect, useState } from 'react';
import OpportunityCard from '../../../Bob/components/tabsection/opportunities/OpportunityCard';
import AboutCompany from './AboutCompany';
import { apiEndpoint } from '@/utils/utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ExperienceSection from '../../../Investor/ExperienceSection'
import Education from '../../../Investor/Education'
import Publications from '../../../Investor/Publications'
import Skills from '../../../Investor/Skills'
import RecognitionAwards from '../../../Investor/RecognitionAwards'
import TestimonialCard from './TestimonialCard';
import { any } from 'zod';
import Image from 'next/image';
import { fetchUserProfile } from '@/app/api/dashboard/dashboard';
import { getOriginalPrivateId } from '@/utils/profile.helpers';
const TabSection = ({ profileData }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const router = useRouter();
    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
    const [isLoading, setIsLoading] = useState(false);
    const [expandedMemberId, setExpandedMemberId] = useState(null);
    const handleClick = () => {
        router.push('/fundraising/sponsor');
    };
    const isVerified = !!profileData.ProfileVerified;
    const isCurrentUserAdvocate = currentUser?.UserProfileType === 'Advocate';

    const tabs = isCurrentUserAdvocate
        ? ['Overview', 'Reviews']
        : [
            'Overview',
            'Credentials',
            'Opportunities',
            'Reviews'
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
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [credentialData, setCredentialData] = useState(null);
    const toggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };


    useEffect(() => {
        const autoExpandFirstMember = async () => {
            if (activeTab === 'Credentials' && profileData?.MemberDetails?.length > 0 && !expandedMemberId) {
                const firstMember = profileData.MemberDetails[0];
                setIsLoading(true);
                setExpandedMemberId(firstMember.UserProfileId);
                try {
                    await fetchProfileData(firstMember.UserProfileId, firstMember.Name, firstMember.UserId);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        autoExpandFirstMember();
    }, [activeTab, profileData]);

    const fetchProfileData = async (Id, UserName, userId) => {
        try {
            const response = await axios.post(
                `${apiEndpoint}/Profile/ViewUserProfileV1`,
                {
                    UserId: userId,
                    UserProfileDetailId: Id,
                    UserName: UserName,
                },
                {
                    headers: {
                        XApiKey: 'your-api-key',
                    },
                }
            );
            if (response.status === 200) {
                setCredentialData(response.data.Result);
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const handleToggleCredentials = async (member) => {
        const isSame = expandedMemberId === member.UserProfileId;
        if (isSame) {
            setExpandedMemberId(null);
            setCredentialData(null);
        } else {
            setIsLoading(true);
            setExpandedMemberId(member.UserProfileId);
            try {
                await fetchProfileData(member?.UserProfileId, member?.Name, member?.UserId);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full mt-6">
            {/* Navigation Tabs */}
            <div className="overflow-x-auto">
                <div className="tabs flex bg-[#F2F4F7] rounded-md p-[3px] md:p-[5px] whitespace-nowrap min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-2 md:px-4 w-1/2
                                py-2 text-sm md:text-lg rounded-md font-medium transition-colors duration-200
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
                        <div className="p-6 bg-white rounded-2xl shadow-sm border mt-6">
                            <h2 className="text-lg font-semibold mb-4">Focus Area</h2>
                            <div className="flex flex-wrap gap-3">

                                {profileData?.FocusArea?.split('|').map((item, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 rounded-full border border-gray-200 text-sm text-[#3b3b3b] font-medium"
                                    >
                                        {item.trim()}
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>

                )}



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
                        <div className="overview-content ">
                            <div className="mt-10 bg-white p-4 border border-gray-200 rounded-xl">
                                <h2 className="text-base font-semibold mb-4">Team Members</h2>
                                <div className="flex flex-wrap w-full gap-y-6 ">
                                    {profileData.MemberDetails.map((member) => {
                                        const isExpanded = expandedMemberId === member.UserProfileId;
                                        return (
                                            <div
                                                key={member.UserProfileId}
                                                className="w-full lg:w-1/3 xl:w-1/4 flex p-[1px] justify-between items-center cursor-pointer"
                                                onClick={() => handleToggleCredentials(member)}
                                            >
                                                <div className="flex items-center gap-3 pl-2">
                                                    <img
                                                        src={member.ProfilePicture || '/default-profile.png'}
                                                        alt={member.Name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="font-medium text-sm text-[#0B0B0B]">{member.Name}</div>
                                                        <div className="text-gray-500 text-xs">Founder & CEO</div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`text-sm font-medium flex items-center transition-all duration-300
    ${isExpanded ? 'text-[#2357C6]' : 'text-gray-500'}
  `}
                                                >
                                                    {isExpanded ? 'Collapse Credentials' : 'See Credentials'}
                                                    {isExpanded ? (<svg

                                                        viewBox="0 0 20 21"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`${isExpanded ? 'rotate-180 ml-2 h-3 w-3' : 'ml-2 h-3 w-3'} transition-transform duration-300 w-5 h-5`}
                                                    >
                                                        <path
                                                            d="M10.0013 4.66406V16.3307M10.0013 16.3307L4.16797 10.4974M10.0013 16.3307L15.8346 10.4974"
                                                            stroke="#2357C6"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>) : (<svg className='h-5 w-5' viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10.5013 4.66406V16.3307M10.5013 16.3307L16.3346 10.4974M10.5013 16.3307L4.66797 10.4974" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                    )}

                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                            {isLoading ? (
                                <div className="flex mt-20 justify-center h-screen ">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>

                            ) : (<>{(
                                credentialData?.UsersProfessionalExperience?.length > 0 ||
                                credentialData?.UsersEducationCertification?.length > 0 ||
                                credentialData?.UsersRecognitionAwards?.length > 0 ||
                                credentialData?.UserSkills?.length > 0 ||
                                credentialData?.UserPublicationResearch?.length > 0
                            ) ? (
                                <>
                                    {credentialData?.UsersProfessionalExperience?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Professional Experience</h2>
                                            <ExperienceSection UsersProfessionalExperience={credentialData.UsersProfessionalExperience} />
                                        </div>
                                    )}

                                    {credentialData?.UsersEducationCertification?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Education</h2>
                                            <Education UsersProfessionalExperience={credentialData.UsersEducationCertification} />
                                        </div>
                                    )}

                                    {credentialData?.UsersRecognitionAwards?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Certifications</h2>
                                            <RecognitionAwards UsersRecognitionAwards={credentialData.UsersRecognitionAwards} />
                                        </div>
                                    )}

                                    {credentialData?.UserSkills?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Skills</h2>
                                            <Skills UserSkills={credentialData.UserSkills} />
                                        </div>
                                    )}

                                    {credentialData?.UserPublicationResearch?.length > 0 && (
                                        <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6'>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Publications & Research</h2>
                                            <Publications UserPublicationResearch={credentialData.UserPublicationResearch} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className='bg-white p-4 border border-gray-200 rounded-xl mt-6 text-center text-gray-500'>
                                    No credentials available
                                </div>
                            )}

                            </>)}


                        </div>
                    )
                }

                {
                    activeTab === 'Reviews' && (
                        <div className="overview-content ">
                            <div className=''>

                                <TestimonialCard
                                    profileData={profileData}
                                    GivenReview={profileData?.ProfileReviewTo}
                                    currentUser={currentUser}
                                    userId={profileData?.UserId}
                                    teamId={profileData?.TeamId}
                                />
                            </div>
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