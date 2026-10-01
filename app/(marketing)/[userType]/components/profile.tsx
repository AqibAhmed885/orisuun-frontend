'use client';
import Star from '@/icons/star';
import StyledTick from '@/icons/verification/styled-tick';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import Youtube from '@/icons/socials/youtube';
import X from '@/icons/socials/x';
import Facebook from '@/icons/socials/facebook';
import Instagram from '@/icons/socials/instagram';
import Linkedin from '@/icons/socials/linkedin';
import { cn } from '@/utils/utils';
import OverviewTab from '@/components/tabs-section/overview';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Reviews from '@/components/tabs-section/reviews';
import Credentials from '@/components/tabs-section/credentials';
import Fundamentals from '@/components/tabs-section/fundamentals';
import BusinessDevelopmentTab from '@/components/tabs-section/business-development-tab';
import SkillsAndExperience from '@/components/tabs-section/skills-and-experience';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { addProfileData } from '@/data/slices/user-slice';
import Loader from '@/components/ui/loader';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import Add from '@/icons/add';
import { fetchPublicProfile } from '../../../api/marketing/profile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Campaign from '@/components/fundraising/campaign-details';
import OverviewIcon from '@/public/icons/profile/overview-icon';
import FundamentalsIcon from '@/public/icons/profile/fundamentals-icon';
import CredentialsIcon from '@/public/icons/profile/credentials-icon';
import ReviewsIcon from '@/public/icons/profile/reviews-icon';
import BusinessDevelopmmentIcon from '@/public/icons/profile/business-development-icon';
import FundraisingIcon from '@/public/icons/profile/fundraising-icon';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import NotFound from '@/components/not-found';

const icons = {
  'Black-owned Businesses': (
    <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />
  ),
  Experts: <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
  Mentors: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
  Professionals: <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
  Consultant: <ConsultantIcon className="text-omblue-500 w-5 h-5" />,
  Investors: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
  Advocates: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
};

const renderTabContent = (selectedTab: string, CampaignId?: number) => {
  switch (selectedTab) {
    case 'overview':
      return <OverviewTab />;
    case 'credentials':
      return <Credentials />;
    case 'reviews':
      return <Reviews showLimited={true} />;
    case 'fundamentals':
      return <Fundamentals />;
    case 'fundraising-campaign':
      return CampaignId ? (
        <Campaign CampaignId={CampaignId} isPublic={true} />
      ) : (
        <>No Campaign</>
      );
    case 'business-development-opportunities':
      return <BusinessDevelopmentTab />;
    case 'skills-and-experience':
      return <SkillsAndExperience />;
    default:
      return null;
  }
};
const roleBasedTabs = {
  'Black-owned Businesses': [
    'overview',
    'fundamentals',
    'credentials',
    'reviews',
    'fundraising-campaign',
  ],
  'Strategy Consultants': [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  Experts: [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  Advocates: ['overview', 'reviews'],
  Professionals: [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  Investors: ['overview', 'fundamentals', 'credentials', 'reviews'],
  Mentors: [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  // Add other roles and their corresponding tabs
};

interface PageProps {
  params: { userType: string };
  searchParams: { userProfileTypeId: string };
}

const PublicProfile = ({ params, searchParams }: PageProps) => {
  const { profileData } = useSelector((state: RootState) => state.user);
  const [loader, setLoader] = useState(true);
  const isMobile = useMobileMediaQuery();
  const userRole = profileData?.UserProfileType;
  const dispatch = useDispatch();
  const TABS = [
    {
      id: 'overview',
      name: 'Overview',
      notification: 0,
      icon: <OverviewIcon />,
    },
    {
      id: 'fundamentals',
      name: 'Fundamentals',
      notification: 0,
      icon: <FundamentalsIcon />,
    },
    {
      id: 'credentials',
      name: 'Credentials',
      icon: <CredentialsIcon />,
      notification:
        profileData?.AffliationsInformation?.length +
        profileData?.Certificates?.length +
        profileData?.AffliationsInformation?.length,
    },
    {
      id: 'reviews',
      name: 'Reviews',
      notification: profileData?.ReviewList?.length,
      icon: <ReviewsIcon />,
    },
    {
      id: 'business-development-opportunities',
      name: 'Business Development Opportunities',
      notification: profileData?.BdList?.length,
      icon: <BusinessDevelopmmentIcon />,
    },
    {
      id: 'fundraising-campaign',
      name: 'Fundraising Campaign',
      notification: 0,
      icon: <FundraisingIcon />,
    },
    {
      id: 'skills-and-experience',
      name: 'Skills & Experience',
      notification: profileData?.SkillsAndCapabilities?.length,
    },
  ];

  const accessibleTabs = TABS.filter((tab) =>
    roleBasedTabs[userRole]?.includes(tab.id)
  );

  const [selectedTab, setSelectedTab] = useState(TABS[0].id);
  const router = useRouter();

  const fetchProfileData = useCallback(async () => {
    try {
      const result = await fetchPublicProfile(params.userType);
      setLoader(false);
      dispatch(addProfileData(result));
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoader(false);
    }
  }, [dispatch, params.userType]);

  useEffect(() => {
    fetchProfileData();
    // if (currentUser) {
    // }
  }, [fetchProfileData]);

  if (loader) {
    return <Loader />;
  }
  if (!profileData) {
    return (
      <>
        <NotFound />
      </>
    );
  }

  return (
    <>
      <div className="mx-8 py-6 md:p-6 overflow-x-hidden">
        <div className="grid grid-cols-12 gap-10 mb-20">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-start gap-6">
              <div className="relative w-fit h-fit rounded-full"> {/* Changed to w-fit/h-fit */}
                <Image
                  src={`${profileData?.ProfilePicture
                    ? profileData?.ProfilePicture
                    : BASE_URL
                    }`}
                  alt={profileData.CompanyName}
                  width={isMobile ? 64 : 148}
                  height={isMobile ? 64 : 148}
                  className="rounded-full border-2 border-profile-frame" // Added border directly to image
                />

                <div className="absolute bottom-2 md:bottom-7 -left-1.5 border border-warning-600 bg-warning-50 text-warning-600 rounded-full p-1">
                  <Star className="w-3 h-3 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="space-y-3 mt-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-h5 md:text-h3 2xl:text-scaled-h3 font-bold text-black-500 text-wrap capitalize">
                    {profileData.CompanyName || profileData.Name}
                  </h3>
                </div>
                <p className="text-h7 2xl:text-scaled-h7 font-medium text-blue-300">
                  {profileData.Tagline || profileData.WorkTitle}
                </p>
                <div className="flex items-center gap-2">
                  {icons[profileData.UserProfileType]}
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                    {profileData.UserProfileType}
                  </p>
                </div>
                {profileData?.ProfileVerified ? (
                  <div className="flex items-center gap-2 text-[#1A9E78]">
                    <StyledTick className="xs:w-5 xs:h-5 2xl:w-scaled-5 2xl:h-scaled-5" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium">
                      Verified
                    </p>
                  </div>
                ) : (
                  <div className="text-[#E88206] flex items-center gap-2 py-1">
                    <div className="p-0.5 flex items-center justify-center rounded-full bg-[#E88206] text-white">
                      <Add className="rotate-45 w-5 h-5" />
                    </div>
                    <p className="text-h9 2xl:text-scaled-h9 font-medium">
                      Not Verified
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 space-y-4">
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
              About {profileData.CompanyName || profileData.Name}
            </h6>
            <div className="text-black-300 text-h8 2xl:text-scaled-h8 font-medium space-y-4">
              <p className="">
                {profileData.AboutCompany || profileData.AboutYou}
              </p>
              <ul className="list-disc space-y-1 ps-4">
                {profileData.CompanyDetails &&
                  profileData.CompanyDetails?.map(
                    (detail: { CompanyDetails: string }, index: number) => (
                      <li key={index}>{detail?.CompanyDetails}</li>
                    )
                  )}
                {profileData.AdditionalAboutYou &&
                  profileData.AdditionalAboutYou?.map(
                    (detail: string, index: number) => (
                      <li key={index}>{detail}</li>
                    )
                  )}
              </ul>
            </div>
            <div className="flex items-center gap-4">
              {profileData.SocialMediaUrls &&
                profileData.SocialMediaUrls?.map(
                  (
                    social: { LinkType: string; SocialMediaUrl?: string },
                    index: number
                  ) => {
                    const type = social.LinkType === 'Twitter' ? 'BlueSky' : social.LinkType;
                    switch (type) {
                      case 'YouTube':
                        return (
                          <Link
                            key={index}
                            href={`${social.SocialMediaUrl}`}
                            target="_blank"
                          >
                            <Youtube />
                          </Link>
                        );
                      case 'FaceBook':
                        return (
                          <Link
                            key={index}
                            href={`${social.SocialMediaUrl}`}
                            target="_blank"
                          >
                            <Facebook />
                          </Link>
                        );
                      case 'LinkedIn':
                        return (
                          <Link
                            key={index}
                            href={`${social.SocialMediaUrl}`}
                            target="_blank"
                          >
                            <Linkedin />
                          </Link>
                        );
                      case 'BlueSky':
                        return (
                          <Link
                            key={index}
                            href={`${social.SocialMediaUrl}`}
                            target="_blank"
                          >
                            <X />
                          </Link>
                        );
                      case 'Instagram':
                        return (
                          <Link
                            key={index}
                            href={`${social.SocialMediaUrl}`}
                            target="_blank"
                          >
                            <Instagram />
                          </Link>
                        );
                      default:
                        return null;
                    }
                  }
                )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto hide-scrollbar mb-10">
          {accessibleTabs?.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                'py-3 border-b-2 text-sm 2xl:text-scaled-h8 flex items-center gap-2 cursor-pointer',
                selectedTab === tab.id
                  ? 'border-omblue-600 text-omblue-600 font-semibold'
                  : 'border-transparent text-[#797B82] font-medium'
              )}
              style={{
                fontVariationSettings:
                  selectedTab === tab.id ? "'wght' 600" : "'wght' 500",
                textRendering: 'optimizeLegibility',
              }}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.icon}
              <p className="w-max">{tab.name}</p>
            </div>
          ))}
        </div>
        {renderTabContent(selectedTab, profileData?.CampaignId)}
      </div>
    </>
  );
};

export default PublicProfile;
