
import WhoIsOrisuun from '@/components/marketing/Homepage/WhoIsOrisuun';
import { AccessFaq } from '@/data/marketing/AccessFaq';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';
import Hero from './Hero';
import Who from './Who';
import AllInOne from './AllInOne';
import { WhyNow } from '@/app/(marketing)/pricing.backup/components/WhyNow';
import Access from './Access';



export const metadata = {
  title: 'Orisuun | Your Ecosystem for Black Business Growth',
  description:
    'Orisuun is a vibrant ecosystem dedicated to promoting the growth of Black-owned businesses through collaboration and investment',

  // keywords:
    // 'Black-Owned Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search',
  icons: {
    icon: [
      { url: '/favicon96c.png', sizes: '96x96' },
      { url: '/favicon192c.png', sizes: '192x192' },
      { url: '/favicon256c.png', sizes: '256x256' },
    ],
  },
  alternates: {
    canonical: 'https://orisuun.com/',
  },
  openGraph: {
    title: 'Orisuun — A Business Ecosystem Built on Intentional Access',
    description:
      'Orisuun puts Black-owned businesses on the map—literally—and connects them with investors, mentors, and customers.',
    url: 'https://orisuun.com/',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/homepage630.png',
        width: 1200,
        height: 630,
        alt: 'Orisuun — A Business Ecosystem Built on Intentional Access',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orisuun — A Business Ecosystem Built on Intentional Access',
    description:
      'Orisuun puts Black-owned businesses on the map—literally—and connects them with investors, mentors, and customers.',
    images: ['https://orisuun.com/og/homepage675.png'],
    site: 'orisuun.com',
  },
};




export default function Home() {  
  const structuredData = getStructuredData({
    pageId: 'homepage',
    pageUrl: 'https://orisuun.com/',
    pageTitle: 'Orisuun — A Business Ecosystem Built on Intentional Access',
    pageDescription: 'Orisuun puts Black-owned businesses on the map—literally—and connects them with investors, mentors, and customers.',
    faqs: AccessFaq,
    video: {
      name: 'Orisuun Intro',
      description: 'A short demo showcasing how Orisuun helps Black entrepreneurs discover business resources.',
      url: 'https://fast.wistia.com/embed/iframe/55hjremisj',
      thumbnailUrl: 'https://fast.wistia.com/embed/medias/55hjremisj/swatch',
      uploadDate: '2025-09-05T08:00:00Z',
      duration: 'PT3M33S'
    }
  });

  return (
    <>
      <StructuredDataInjector structuredData={structuredData} />
      {/* <Hero /> */}
      <Who />
      {/* <How /> */}
      {/* <AllInOne  /> */}
      <WhoIsOrisuun />
      <WhyNow />
      <Access />
    </>
  );
}
