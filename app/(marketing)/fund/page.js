import { HeroFund } from './component/Hero Fund/heroFund'
import { HeroFundImportance } from './component/Fund Importance/importance';
import AOSWrapper from '../../../components/marketing/AOS Wrapper/Aos';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import StructuredDataInjector from '@/components/StructuredDataInjector';

// Lazy load components that are below the fold
const LazyFundDifference = dynamic(() => import('./component/Fund Difference/difference').then(mod => ({ default: mod.FundDifference })));
const LazyFundProgress = dynamic(() => import('./component/Fund Progress/progress').then(mod => ({ default: mod.FundProgress })));
const LazyFundVision = dynamic(() => import('./component/Fund Vision/vision').then(mod => ({ default: mod.FundVision })));
const LazyFundSupport = dynamic(() => import('./component/Fund Support/support').then(mod => ({ default: mod.FundSupport })));
const LazyFundStage = dynamic(() => import('./component/Fund Stage/stage').then(mod => ({ default: mod.FundStage })));
const LazyBlackWealth = dynamic(() => import('./component/Fund Wealth/blackWealth').then(mod => ({ default: mod.BlackWealth })));

export const metadata = {
  title: 'Orisuun | Empowering Black Entrepreneurs: The Black Wealth Fund',
  description:
    'Our Black Wealth Fund is dedicated to fostering economic empowerment within the Black community by providing strategic investments and grants to Black-owned startups and established businesses. With a commitment to cultivating talent, we offer financial resources coupled with mentorship and guidance to propel Black entrepreneurs towards success. Our mission is to address systemic barriers to wealth accumulation and entrepreneurship within the Black community, creating pathways for economic advancement and generational prosperity. Through our tailored investment approach and comprehensive support network, we aim to fuel the growth of Black-owned businesses across various sectors, including technology, finance, media, consumer products, real estate, healthcare, and beyond. Whether through equity investments, debt financing, or grant opportunities, we prioritize initiatives that have the potential to drive significant and sustainable business growth for social and economic impact. Join us in building a future where Black entrepreneurs have equitable access to the resources they need to thrive, innovate, and leave a lasting legacy of prosperity for generations to come. Together, we can create a more inclusive and prosperous economy for all',
  // keywords:
    // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  alternates: {
    canonical: 'https://orisuun.com/fund',
  },
  openGraph: {
    title: 'Orisuun | Empowering Black Entrepreneurs: The Black Wealth Fund',
    description: 'Our Black Wealth Fund is dedicated to fostering economic empowerment within the Black community by providing strategic investments and grants to Black-owned startups and established businesses.',
    url: 'https://orisuun.com/fund',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/black_wealth_fund630.png',
        width: 1200,
        height: 630,
        alt: 'Orisuun Black Wealth Fund',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orisuun | Empowering Black Entrepreneurs: The Black Wealth Fund',
    description: 'Our Black Wealth Fund is dedicated to fostering economic empowerment within the Black community by providing strategic investments and grants to Black-owned startups and established businesses.',
    images: ['https://orisuun.com/og/black_wealth_fund675.png'],
  },
};

const structuredDataConfig = {
  pageId: 'fund',
  pageUrl: 'https://orisuun.com/fund',
  pageTitle: 'Orisuun | Empowering Black Entrepreneurs: Black Wealth Fund',
  pageDescription: 'Learn about the Orisuun Black Wealth Fund and make a contribution to support Black wealth creation.',
  investmentFund: {
    name: 'Orisuun Black Wealth Fund',
    description: 'A fund focused on supporting Black wealth creation through grants, direct investments, and other capital deployment approaches.',
    additionalProperty: [
      {
        name: 'Capital Deployment',
        value: 'Grants'
      },
      {
        name: 'Capital Deployment',
        value: 'Direct investments'
      },
      {
        name: 'Capital Deployment',
        value: 'Guarantor pool'
      }
    ]
  },
  potentialAction: {
    "@type": "DonateAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://orisuun.com/fund"
    },
    "object": {
      "@id": "https://orisuun.com/fund#investment-fund"
    }
  }
};

export default function Fund() {
  return (
    <AOSWrapper>
      <StructuredDataInjector config={structuredDataConfig} />
      <div className="flex flex-col mt-20 ">
        <HeroFund />
        <HeroFundImportance />
        <LazyFundStage />
        <LazyBlackWealth />
        <LazyFundDifference />
        <LazyFundProgress />
        <LazyFundVision />
        <Suspense>
          <LazyFundSupport />
        </Suspense>
      </div>
    </AOSWrapper>
  );
}
