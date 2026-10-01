import {
  AboutHero,
  AllWelcome,
  BlackOwned,
  Field,
  WhyWeCreated,
  HelpYou,
  KeyValues,
} from './components';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';

export const metadata = {
  title: 'Orisuun | The Number One Network Platform for Black-Owned Businesses',
  description:
    'Discover our commitment and story. Learn about our team and tools designed to promote Black business growth',
  // keywords:
    // 'Black-Owned Business, Bek Sunuu, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  alternates: {
    canonical: 'https://orisuun.com/about',
  },
  openGraph: {
    title: 'About Orisuun',
    description: 'Learn more about Orisuun’s mission, values, and ecosystem approach.',
    url: 'https://orisuun.com/about',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/about630.png',
        width: 1200,
        height: 630,
        alt: 'About Orisuun',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Orisuun',
    description: 'Learn more about Orisuun’s mission, values, and ecosystem approach.',
    images: ['https://orisuun.com/og/about675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/about',
    creator: '@orisuun',
  },
  metadataBase: new URL('https://orisuun.com'),
};

export default function About() {
  const structuredData = getStructuredData({
    pageId: 'webpage',
    pageUrl: 'https://orisuun.com/about',
    pageTitle: 'Orisuun | The Number One Network Platform for Black-Owned Businesses',
    pageDescription:
      'Discover our commitment and story. Learn about our team and tools designed to promote Black business growth.',
    orgLogoUrl: 'https://orisuun.com/logo.svg',
    audio: {
      id: 'pronunciation-audio',
      name: 'Orisuun pronunciation',
      description: 'Audio pronunciation guide for the name Orisuun.',
      contentUrl: 'https://orisuun.com/audio/voice1.mp3',
      encodingFormat: 'audio/mpeg',
    },
  });
  return (
    <>
      {/* Structured Data - Rendered First */}
      <StructuredDataInjector structuredData={structuredData} />

      <main className="max-w-[1440px] mx-auto">
        <AboutHero />
      <BlackOwned />
      <Field />
      <WhyWeCreated />
      <AllWelcome />
      <HelpYou />
      <KeyValues />
      </main>
    </>
  );
}
