
import UserType from "../[userType]/userType"
import { Metadata } from 'next';
import { generatePublicProfileStructuredData, generateUserTypeStructuredData } from '@/utils/structuredData';
import axios from 'axios';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import UserProfile from '../../(dashboard)/(users)/(main)/profile/[id]/components/UserProfile';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

interface PageProps {
  params: { userType: string };
  searchParams?: { userProfileTypeId?: string };
}

import { validUserTypes } from '../../../data/marketing/users'

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const getPublicProfile = cache(async (username: string) => {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Profile/ExploreUserProfileV1`,
      { UserName: username },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    const result = response.data?.Result;
    return Array.isArray(result) ? result[0] : result || null;
  } catch {
    return null;
  }
});

const resolvePrivateRouteId = async (username: string): Promise<string | null> => {
  const result = await getPublicProfile(username);
  const rawProfileDetailId =
    result?.UserProfileDetailId ?? result?.UserProfileDetailsId ?? result?.Id;

  const profileDetailId = Number(rawProfileDetailId);
  if (!Number.isFinite(profileDetailId) || profileDetailId <= 0) {
    return null;
  }

  return String(add2040ToProfileDetailsId(profileDetailId));
};

const cleanDescription = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const getProfileName = (profile: any, username: string) =>
  profile?.CompanyName ||
  profile?.Name ||
  profile?.ChatUserName ||
  profile?.UserName ||
  username;

const getProfileDescription = (profile: any, name: string) => {
  const description = cleanDescription(
    profile?.AboutCompany ||
      profile?.AboutYou ||
      profile?.Tagline ||
      profile?.WorkTitle
  );

  return description
    ? description.slice(0, 160)
    : `View ${name}'s member profile, experience, and business details on Orisuun.`;
};

const getProfileOgImage = (profile: any) => {
  if (typeof profile?.ProfilePicture === 'string' && /^https?:\/\//i.test(profile.ProfilePicture)) {
    return profile.ProfilePicture;
  }

  const profileType = String(profile?.UserProfileType || '').toLowerCase();
  if (profileType.includes('business')) return 'https://orisuun.com/og/bob630.png';
  if (profileType.includes('mentor')) return 'https://orisuun.com/og/mentors630.png';
  if (profileType.includes('investor')) return 'https://orisuun.com/og/investors630.png';
  if (profileType.includes('partner')) return 'https://orisuun.com/og/partners630.png';
  if (profileType.includes('advocate')) return 'https://orisuun.com/og/advocates630.png';
  if (profileType.includes('professional')) return 'https://orisuun.com/og/professionals630.png';
  if (profileType.includes('consultant')) return 'https://orisuun.com/og/strategy_consultants630.png';
  if (profileType.includes('expert')) return 'https://orisuun.com/og/experts630.png';
  return 'https://orisuun.com/og/homepage630.png';
};

const getSocialUrls = (profile: any): string[] =>
  Array.isArray(profile?.SocialMediaUrls)
    ? profile.SocialMediaUrls.map((social: any) => social?.SocialMediaUrl).filter(Boolean)
    : [];

export async function generateMetadata({ params }) {
  const { userType } = params;

  switch (userType) {
    case 'black-owned-businesses':
      return {
        title: 'Orisuun | Driving Growth of Black-Owned Businesses',
        description:
          'Join our network dedicated to growing Black-owned businesses. Find valuable connections and business development opportunities. Connect with motivated investors and clients searching our database just for you. Claim your custom URL on Orisuun.com today!',
        // keywords:
          // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions',
        alternates: { canonical: 'https://orisuun.com/black-owned-businesses' },

        openGraph: {
          title: 'How Black-Owned Businesses Anchor the Orisuun Business Ecosystem',
          description:
            'Orisuun is built around Black-owned businesses, giving them visibility, access, and connections that power the network.',
          url: 'https://orisuun.com/black-owned-businesses',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/bob630.png',
              width: 1200,
              height: 630,
              alt: 'How Black-Owned Businesses Anchor the Orisuun Business Ecosystem',
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Black-Owned Businesses Anchor the Orisuun Business Ecosystem',
          description:
            'Orisuun is built around Black-owned businesses, giving them visibility, access, and connections that power the network.',
          images: ['https://orisuun.com/og/bob675.png'],
        },
      };

    case 'professionals':
      return {
        title:
          'Orisuun | Get Paid to Provide Your Professional Services to Black-Owned Businesses',
        description:
          'Get paid to provide your professional services to growing Black-owned businesses.',
        // keywords:
          // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Professionals, Attorneys, Accountants, Marketing',
        alternates: { canonical: 'https://orisuun.com/professionals' },

        openGraph: {
          title: 'How Professionals Participate on Orisuun',
          description:
            'Learn how professionals use Orisuun to offer services, join teams, collaborate with businesses, and contribute their skills across the platform.',
          url: 'https://orisuun.com/professionals',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/professionals630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Professionals Participate on Orisuun',
          description:
            'Learn how professionals use Orisuun to offer services, join teams, collaborate with businesses, and contribute their skills across the platform.',
          images: ['https://orisuun.com/og/professionals675.png'],
        },
      };

    case 'experts':
      return {
        title: 'Orisuun | Get Paid to Provide Your Expert Opinion',
        description:
          'Get paid to provide your expert opinion to Black-owned businesses. Claim your custom URL on Orisuun.com today!',
        // keywords:
          // 'Subject Matter Expert, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions, Expert',
        alternates: { canonical: 'https://orisuun.com/experts' },

        openGraph: {
          title: 'Expertise Businesses Can Plug Into',
          description:
            'Connect with experts offering specialized knowledge and insight within the Orisuun ecosystem.',
          url: 'https://orisuun.com/experts',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/experts630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Expertise Businesses Can Plug Into',
          description:
            'Connect with experts offering specialized knowledge and insight within the Orisuun ecosystem.',
          images: ['https://orisuun.com/og/experts675.png'],
        },
      };

    case 'mentors':
      return {
        title: 'Orisuun | Mentor Owners of Growing Black-Owned Businesses',
        description:
          'Mentor owners of growing Black-owned businesses. Claim your custom URL on Orisuun.com today!',
        // keywords:
          // 'Mentors, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Mentor',
        alternates: { canonical: 'https://orisuun.com/mentors' },

        openGraph: {
          title: 'How Mentors Participate on Orisuun',
          description:
            'See how mentors on Orisuun support businesses by sharing lived experience, insight, and practical guidance.',
          url: 'https://orisuun.com/mentors',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/mentors630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Mentors Participate on Orisuun',
          description:
            'See how mentors on Orisuun support businesses by sharing lived experience, insight, and practical guidance.',
          images: ['https://orisuun.com/og/mentors675.png'],
        },
      };

    case 'strategy-consultants':
      return {
        title:
          'Orisuun | Get Paid to Provide Your Strategy Consultant Services to Black-owned Businesses',
        description:
          'Get paid to provide strategic advice to growing Black-owned businesses.',
        // keywords:
          // 'Strategy Consulting, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions, Strategy Consultants',
        alternates: { canonical: 'https://orisuun.com/strategy-consultants' },

        openGraph: {
          title: 'How Strategy Consultants Participate on Orisuun',
          description:
            'Learn how Strategy Consultants use Orisuun to offer services, join teams, collaborate with businesses, and contribute their skills across the platform.',
          url: 'https://orisuun.com/strategy-consultants',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/strategy_consultants630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Strategy Consultants Participate on Orisuun',
          description:
            'Learn how Strategy Consultants use Orisuun to offer services, join teams, collaborate with businesses, and contribute their skills across the platform.',
          images: ['https://orisuun.com/og/strategy_consultants675.png'],
        },
      };

    case 'partners':
      return {
        title:
          'Orisuun | Create New Client Relationships with Growing Black-Owned Businesses',
        description:
          'Connect and create new client relationships with growing Black-owned businesses around the world.',
        // keywords:
          // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration',
        alternates: { canonical: 'https://orisuun.com/partners' },

        openGraph: {
          title: 'How Partners Participate on Orisuun',
          description:
            'Learn how partners participate on Orisuun by matching fundraising campaigns, offering discounts, and finding preferred vendors.',
          url: 'https://orisuun.com/partners',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/partners630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Partners Participate on Orisuun',
          description:
            'Learn how partners participate on Orisuun by matching fundraising campaigns, offering discounts, and finding preferred vendors.',
          images: ['https://orisuun.com/og/partners675.png'],
        },
      };

    case 'investors':
      return {
        title:
          'Orisuun | Create New Investment Relationships with Growing Black-Owned Businesses',
        description:
          'Connect and create new investment relationships with growing Black-owned businesses around the world.',
        // keywords:
          // 'Invest in Black-Owned Businesses, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Invest in Black startups',
        alternates: { canonical: 'https://orisuun.com/investors' },

        openGraph: {
          title: 'How Investors Participate on Orisuun',
          description:
            'See how investors use Orisuun to discover opportunities, build relationships, and cultivate exclusive deal flow.',
          url: 'https://orisuun.com/investors',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/investors630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Investors Participate on Orisuun',
          description:
            'See how investors use Orisuun to discover opportunities, build relationships, and cultivate exclusive deal flow.',
          images: ['https://orisuun.com/og/investors675.png'],
        },
      };

    case 'advocates':
      return {
        title:
          'Orisuun | Search, Find, and Support Black-Owned Businesses Around the World',
        description:
          'Search, find, and support Black-owned businesses around the world. Claim your custom URL on Orisuun.com today!',
        // keywords:
          // 'Support Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Support Black-Owned Businesses',
        alternates: { canonical: 'https://orisuun.com/advocates' },

        openGraph: {
          title: 'How Advocates Participate on Orisuun',
          description:
            'Support Black-owned businesses through advocacy, patronage, and investment.',
          url: 'https://orisuun.com/advocates',
          siteName: 'Orisuun',
          type: 'website',
          locale: 'en_US',
          images: [
            {
              url: 'https://orisuun.com/og/advocates630.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How Advocates Participate on Orisuun',
          description:
            'Support Black-owned businesses through advocacy, patronage, and investment.',
          images: ['https://orisuun.com/og/advocates675.png'],
        },
      };

    default:
      const profile = await getPublicProfile(userType);

      if (!profile) {
        return {
          title: 'Member Profile | Orisuun',
          description: 'View member profiles on Orisuun.',
          robots: { index: false, follow: false },
        };
      }

      const name = getProfileName(profile, userType);
      const title = `${name} | Orisuun Member Profile`;
      const description = getProfileDescription(profile, name);
      const canonicalUrl = `https://orisuun.com/${encodeURIComponent(userType)}`;
      const image = getProfileOgImage(profile);

      return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
        openGraph: {
          title,
          description,
          url: canonicalUrl,
          siteName: 'Orisuun',
          type: 'profile',
          locale: 'en_US',
          images: [{ url: image, alt: `${name} on Orisuun` }],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [image],
        },
      };
  }
}


const Profile = async ({ params, searchParams }: PageProps) => {
  const { userType } = params;

  // Generate structured data for the user type
  const structuredData = generateUserTypeStructuredData(userType);

  // Check if the userType is valid and render accordingly
  if (validUserTypes.includes(userType)) {
    return (
      <>
        {/* Structured Data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}

        {/* Preload critical userType images */}
        <link
          rel="preload"
          href={`/userTypes/images/${userType}.png`}
          as="image"
          type="image/png"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <UserType params={params} />
      </>
    );
  } else {
    const publicProfile = await getPublicProfile(userType);
    const privateRouteId = await resolvePrivateRouteId(userType);

    if (!publicProfile || !privateRouteId) {
      notFound();
    }

    const name = getProfileName(publicProfile, userType);
    const description = getProfileDescription(publicProfile, name);
    const image = getProfileOgImage(publicProfile);
    const structuredData = generatePublicProfileStructuredData({
      username: userType,
      name,
      description,
      profileType: publicProfile?.UserProfileType,
      image,
      jobTitle: publicProfile?.WorkTitle || publicProfile?.Tagline,
      website: publicProfile?.WebsiteUrl,
      socialUrls: getSocialUrls(publicProfile),
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        <UserProfile
          params={{ id: privateRouteId, username: userType }}
          searchParams={{
            userProfileTypeId: searchParams?.userProfileTypeId || '',
          }}
        />
      </>
    );
  }
};
export default Profile;
