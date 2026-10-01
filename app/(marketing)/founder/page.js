import { FounderHero, PayBanner } from './components'
import BiographySection from './components/BiographySection';
import WhyOrisuun from './components/WhyOrisuun';
import { biographyData } from '../../../data/marketing/founder';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';

export const metadata = {
  title: 'Meet Bek Sunuu, Founder of Orisuun',
  description:
    'Discover our commitment and story. Learn about our team and tools designed to promote Black business growth',
  // keywords:
    // 'Black-Owned Business, Bek Sunuu, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  alternates: {
    canonical: 'https://orisuun.com/founder',
  },
  openGraph: {
    title: 'Bek Sunuu — Founder of Orisuun',
    description: 'Learn about the founder behind\nOrisuun and the vision driving the platform.',
    url: 'https://orisuun.com/founder',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/founder630.png',
        width: 1200,
        height: 630,
        alt: 'Bek Sunuu — Founder of Orisuun',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bek Sunuu — Founder of Orisuun',
    description: 'Learn about the founder behind\nOrisuun and the vision driving the platform.',
    images: ['https://orisuun.com/og/founder675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/founder',
  },
  metadataBase: new URL('https://orisuun.com'),
};

export default function About() {
  const structuredData = getStructuredData({
    pageId: 'webpage',
    pageUrl: 'https://orisuun.com/founder',
    pageTitle: 'Meet Bek Sunuu, Founder of Orisuun',
    pageDescription: 'Meet Bek Sunuu, Founder of Orisuun',
    person: {
      name: 'Bek Sunuu',
      jobTitle: 'Founder',
      description:
        'Bek is a highly skilled and accomplished business leader (and former attorney) with a global perspective and deep expertise in corporate valuations, capital markets, restructurings, and international operations. As the CEO of Orisuun, he draws on over 12 years of experience across multiple continents, having lived and worked extensively in Africa, Asia, Europe, and North America.',
      sameAs: ['https://www.linkedin.com/in/beksunuu/'],
    },
    videos: [
      {
        videoId: 'video-1',
        name: 'The What, Who, How, and Why of Orisuun',
        description:
          'Discover the what, why, who, and how behind Orisuun—a platform built to uplift and empower Black entrepreneurs.',
        contentUrl: 'https://www.youtube.com/watch?v=SxKXvNxFGgY',
        embedUrl: 'https://www.youtube.com/embed/SxKXvNxFGgY',
        thumbnailUrl: ['https://i.ytimg.com/vi/SxKXvNxFGgY/hqdefault.jpg'],
        uploadDate: '2025-06-08',
      },
      {
        videoId: 'video-2',
        name: 'Vision for Orisuun and the Ecosystem',
        description:
          'Orisuun is currently setup to be the go-to tool for Black-owned business discovery, fundraising, and opportunities.',
        contentUrl: 'https://www.youtube.com/watch?v=G7mGjPq-40E',
        embedUrl: 'https://www.youtube.com/embed/G7mGjPq-40E',
        thumbnailUrl: ['https://i.ytimg.com/vi/G7mGjPq-40E/hqdefault.jpg'],
        uploadDate: '2025-06-14',
      },
      {
        videoId: 'video-3',
        name: "There's a Place for You Here",
        description:
          "There's a place and a role for everyone in the Orisuun ecosystem.",
        contentUrl: 'https://www.youtube.com/watch?v=-1NR3gWtLqM',
        embedUrl: 'https://www.youtube.com/embed/-1NR3gWtLqM',
        thumbnailUrl: ['https://i.ytimg.com/vi/-1NR3gWtLqM/hqdefault.jpg'],
        uploadDate: '2025-06-21',
      },
      {
        videoId: 'video-4',
        name: 'Orisuun Makes Sense for Black-Owned Businesses at All Stages',
        description:
          "Whether you're at the idea stage or you're looking to exit, Orisuun can help you maximize your potential.",
        contentUrl: 'https://www.youtube.com/watch?v=R0_Utczy2Sc',
        embedUrl: 'https://www.youtube.com/embed/R0_Utczy2Sc',
        thumbnailUrl: ['https://i.ytimg.com/vi/R0_Utczy2Sc/hqdefault.jpg'],
        uploadDate: '2025-07-11',
      },
    ],
  });

  return (
    <>
      {/* Structured Data - Rendered First */}
      <StructuredDataInjector structuredData={structuredData} />

      <main className="mt-12">
        <FounderHero />
        <BiographySection {...biographyData} />
        <WhyOrisuun />
        <PayBanner />
      </main>
    </>
  );
}
