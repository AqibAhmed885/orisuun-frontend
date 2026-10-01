import StructuredDataInjector from '@/components/StructuredDataInjector';
import { pricingFAQ } from '../../../data/marketing/PricingData';
import {
  getUserProfileTypeFeatures,
  getUserProfileType,
  getSubscriptionPlanBasedOnProfileType
} from '../../api/marketing/pricing';
import { PricingHero } from './components/pricingHero';
import { MembershipBenefits } from './components/membershipBenefits';
import { WeOffer } from './components/weoffer';
import HeroSection from '@/app/(landing)/weekly-funding/components/hero-section';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orisuun | Pricing and Plans ',
  description:
    'Explore our transparent and flexible pricing plans that easily pay for themselves.',
  // keywords:
    // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  alternates: {
    canonical: 'https://orisuun.com/pricing',
  },
  openGraph: {
    title: 'Membership Pricing | Orisuun',
    description: 'Simple, accessible membership pricing to join the Orisuun ecosystem.',
    url: 'https://orisuun.com/pricing',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/pricing630.png',
        width: 1200,
        height: 630,
        alt: 'Membership Pricing | Orisuun',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Membership Pricing | Orisuun',
    description: 'Simple, accessible membership pricing to join the Orisuun ecosystem.',
    images: ['https://orisuun.com/og/pricing675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/pricing',
  },
};

const structuredDataConfig = {
  pageId: 'pricing',
  pageUrl: 'https://orisuun.com/pricing',
  pageTitle: 'Orisuun | Pricing and Plans',
  pageDescription: 'Compare Orisuun Standard and Premium plans and review pricing FAQs.',
  // Cross-page product reference
  externalProduct: {
    "@type": "Product",
    "@id": "https://orisuun.com/what-we-offer#product",
    "name": "Orisuun Platform",
    "brand": {
      "@id": "https://orisuun.com/#organization"
    }
  },
  offerCatalog: {
    name: 'Orisuun Plans',
    offers: [
      {
        id: 'standard-offer',
        name: 'Standard',
        url: 'https://orisuun.com/pricing#standard',
        availability: 'https://schema.org/InStock',
        itemOfferedId: 'https://orisuun.com/what-we-offer#product'
      },
      {
        id: 'premium-offer',
        name: 'Premium',
        url: 'https://orisuun.com/pricing#premium',
        availability: 'https://schema.org/InStock',
        itemOfferedId: 'https://orisuun.com/what-we-offer#product'
      }
    ]
  },
  faqs: pricingFAQ.map(faq => ({
    question: faq.title,
    content: faq.content
  }))
};

async function fetchPricingData() {
  try {
    // Fetch all required data in parallel
    const [profileFeatures, profileTypes] = await Promise.all([
      getUserProfileTypeFeatures().catch(err => {
        console.error('Error fetching profile features:', err);
        return [];
      }),
      getUserProfileType().catch(err => {
        console.error('Error fetching profile types:', err);
        return [];
      })
    ]);

    const defaultProfile =
      profileTypes?.find((type) => type?.UserProfileName !== 'Partners') ||
      profileTypes?.[0] ||
      null;
    const defaultProfileType = defaultProfile?.Id || defaultProfile?.id || null;
    let subscriptionPlans = null;

    if (defaultProfileType) {
      try {
        subscriptionPlans = await getSubscriptionPlanBasedOnProfileType(defaultProfileType);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
      }
    }

    return {
      profileFeatures: profileFeatures || [],
      profileTypes: profileTypes || [],
      initialSubscriptionPlans: subscriptionPlans,
      defaultProfileType
    };
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return {
      profileFeatures: [],
      profileTypes: [],
      initialSubscriptionPlans: null,
      defaultProfileType: null
    };
  }
}

export default async function Pricing() {
  // const pricingData = await fetchPricingData();

  return (
    <>
      <StructuredDataInjector config={structuredDataConfig} />
      <>
        <PricingHero />
        <MembershipBenefits />
        <HeroSection />
        
        <WeOffer />
      </>
    </>
  );
}
