import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AccessFaq } from '@/data/marketing/AccessFaq';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';
import HeroSection from '@/components/marketing/NewHomepage/herosection';
import Slider from '@/components/marketing/NewHomepage/slider';
import PartnersGrid from '@/components/marketing/NewHomepage/PartnersGrid';
import TrustedScrollSection from '@/components/marketing/NewHomepage/TrustedScrollSection';
import CorporateSavingsSection from '@/components/marketing/NewHomepage/CorporateSavingsSection';
import FavouriteCardsSlider from '@/components/marketing/NewHomepage/FavouriteCardsSlider';
const StickyAccordionCardStack = dynamic(
  () => import('@/components/marketing/NewHomepage/StickyAccordionCardStack')
);
const AllInOneTabs = dynamic(
  () => import('@/components/marketing/NewHomepage/AllInOneTabs')
);
const WhoIsOrisuunForSection = dynamic(
  () => import('@/components/marketing/NewHomepage/WhoIsOrisuunForSection')
);
const TopVoicesSection = dynamic(
  () => import('@/components/marketing/NewHomepage/TopVoicesSection')
);
const EasySteps = dynamic(
  () => import('@/components/marketing/NewHomepage/easysteps').then(
    (mod) => mod.EasySteps
  )
);
const FAQSection = dynamic(
  () => import('@/components/marketing/NewHomepage/FAQSection')
);

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
export const metadata = {
  title: 'Orisuun | Your Ecosystem for Black Business Growth',
  description:
    'Orisuun is a vibrant ecosystem dedicated to promoting the growth of Black-owned businesses through collaboration and investment',

  // keywords:
    // 'Black-Owned Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search',
  icons: {
    icon: [
      { url: `${staticUrl}/favicon96c.png`, sizes: '96x96' },
      { url: `${staticUrl}/favicon192c.png`, sizes: '192x192' },
      { url: `${staticUrl}/favicon256c.png`, sizes: '256x256' },
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
        <HeroSection />
        <Slider />
        <PartnersGrid />
        <StickyAccordionCardStack />
        <AllInOneTabs />
        <WhoIsOrisuunForSection />
        <TopVoicesSection />
        <div className="relative overflow-hidden px-8 bg-[#F4F5FA]">
          <Image
            src="/homepage-slider/slider-rings.svg"
            alt=""
            width={478}
            height={557}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-12 right-12 z-0 h-auto w-[40vw] max-w-none md:w-[40vw]"
          />
          <div className="relative z-10">
            <CorporateSavingsSection />
            <FavouriteCardsSlider />
          </div>
        </div>
        <TrustedScrollSection />
        <EasySteps />
        <FAQSection />
    </>
  );
}
