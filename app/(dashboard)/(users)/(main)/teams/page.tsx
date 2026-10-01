'use client';
import StyledTick from '@/icons/verification/styled-tick';
import Image from 'next/image';
import React, { useState } from 'react';
import Youtube from '@/icons/socials/youtube';
import X from '@/icons/socials/x';
import Facebook from '@/icons/socials/facebook';
import Instagram from '@/icons/socials/instagram';
import Linkedin from '@/icons/socials/linkedin';
import { cn } from '@/utils/utils';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import Add from '@/icons/add';
import Link from 'next/link';
import OverviewIcon from '@/public/icons/profile/overview-icon';
import FundamentalsIcon from '@/public/icons/profile/fundamentals-icon';
import CredentialsIcon from '@/public/icons/profile/credentials-icon';
import ReviewsIcon from '@/public/icons/profile/reviews-icon';
import BusinessDevelopmmentIcon from '@/public/icons/profile/business-development-icon';
import FundraisingIcon from '@/public/icons/profile/fundraising-icon';
import EditIcon from '@/icons/edit-icon';
import Button from '@/components/ui/button';
import Share from '@/icons/share';

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

const renderTabContent = (selectedTab: string) => {
    switch (selectedTab) {
        case 'overview':
            return <div className="p-4">Overview content goes here</div>;
        case 'credentials':
            return <div className="p-4">Credentials content goes here</div>;
        case 'reviews':
            return <div className="p-4">Reviews content goes here</div>;
        case 'fundamentals':
            return <div className="p-4">Fundamentals content goes here</div>;
        case 'fundraising-campaign':
            return <div className="p-4">Fundraising campaign content goes here</div>;
        case 'business-development-opportunities':
            return <div className="p-4">2xl:text-scaled-h7 font-semibold text-green-500 content goes here</div>;
        case 'skills-and-experience':
            return <div className="p-4">Skills and experience content goes here</div>;
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
};

export default function TeamsPage() {
    const isMobile = useMobileMediaQuery();

    // Dummy data for the team profile
    const profileData = {
        CompanyName: "Tech Innovators Team",
        Name: "Tech Innovators Team",
        Tagline: "Building the future together",
        WorkTitle: "Software Development Team",
        UserProfileType: "Professionals",
        ProfileVerified: true,
        AboutCompany: "We are a team of passionate developers and designers creating innovative solutions for modern problems.",
        AboutYou: "We are a team of passionate developers and designers creating innovative solutions for modern problems.",
        CompanyDetails: [
            { CompanyDetails: "Founded in 2020" },
            { CompanyDetails: "10+ team members" },
            { CompanyDetails: "Specialized in React and Node.js" }
        ],
        AdditionalAboutYou: [
            "Winner of 2023 Tech Excellence Award",
            "Open source contributors",
            "Active in tech community events"
        ],
        SocialMediaUrls: [
            { LinkType: "Twitter", SocialMediaUrl: "https://twitter.com/techinnovators" },
            { LinkType: "LinkedIn", SocialMediaUrl: "https://linkedin.com/company/tech-innovators" },
            { LinkType: "GitHub", SocialMediaUrl: "https://github.com/tech-innovators" }
        ],
        ProfilePicture: "/team-avatar.jpg", // Replace with your team image path
        ReviewList: [1, 2, 3], // Dummy reviews count
        SkillsAndCapabilities: ["React", "Node.js", "TypeScript", "UI/UX Design"],
        Certificates: ["AWS Certified", "Google Cloud Certified"],
        AffliationsInformation: ["Microsoft Partner", "Google Developers Group"],
        BdList: [1, 2], // Dummy business development items count
        CampaignId: null
    };

    const userRole = profileData?.UserProfileType;

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

    return (
        <>
            <div className="hidden lg:flex justify-end items-center w-full p-6">
                <div className="flex col-span-4 md:col-span-2 gap-1.5">
                    <Button
                        className="!p-0 !min-w-8 min-h-8 !w-auto max-h-8 !max-w-8 text-nav-blue flex items-center justify-center rounded-full border border-omblue-100"
                        variant="ghost"
                        startIcon={<Share className="w-4 h-4" />}
                    />
                    <Button
                        className="!p-0 !min-w-8 min-h-8 !w-auto max-h-8 !max-w-8 text-nav-blue flex items-center justify-center rounded-full border border-omblue-100"
                        variant="ghost"
                        startIcon={<EditIcon className="w-4 h-4" />}
                    />
                </div>
            </div>
            <div className="mx-8 py-6 md:p-6 overflow-x-hidden">

                <div className="grid grid-cols-12 gap-10 mb-20">

                    <div className="col-span-12 md:col-span-6">

                        <div className="flex items-start gap-6">

                            <div className="relative w-[120px] h-[120px] md:w-[180px] md:h-[180px]">
                                {/* Image 1 - Bottom layer */}
                                <div className="absolute bottom-[50px] left-0 md:bottom-[70px]">
                                    <Image
                                        src="/one.png"
                                        alt={profileData.CompanyName}
                                        width={64}
                                        height={64}
                                        className="rounded-full border-2 border-profile-frame md:w-[96px] md:h-[96px]"
                                    />
                                </div>

                                {/* Image 2 - Overlapping top of Image 1 */}
                                <div className="absolute bottom-0 left-0 z-20">
                                    <Image
                                        src="/one.png"
                                        alt="Team Member 2"
                                        width={64}
                                        height={64}
                                        className="rounded-full border-2 border-profile-frame md:w-[96px] md:h-[96px]"
                                    />
                                </div>

                                {/* Image 3 - Between Image 1 & 2, slightly right-shifted */}
                                <div className="absolute bottom-5 left-10 z-25 md:bottom-8 md:left-14">
                                    <Image
                                        src="/one.png"
                                        alt="Team Member 3"
                                        width={64}
                                        height={64}
                                        className="rounded-full border-2 border-profile-frame md:w-[96px] md:h-[96px]"
                                    />
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
                                    )
                                }
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

                {/* <div className="flex items-center gap-5 overflow-x-auto hide-scrollbar mb-10">
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
                </div> */}
                {/* {renderTabContent(selectedTab)} */}
            </div>
        </>
    );
}