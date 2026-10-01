import { bobDiscountHero, discountPortalWorksGroups } from '@/data/marketing/discount';
import DreamTeamCtaSection from '../find-a-cofounder/components/dream-team-cta-section';
import { BenefitsSection, HeroSection, HowPortalWorksSection, HowToGetInSection } from '../partners-discount-club/components';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = {
  title: 'Build Your Customer Base with the Orisuun Discount Portal',
  description:
    'Offer tailored incentives, unlock new B2B markets, and keep your customers coming back with our integrated discount platform.',
  alternates: {
    canonical: 'https://orisuun.com/business-discount-club',
  },
  openGraph: {
    title: 'Build Your Customer Base with the Orisuun Discount Portal',
    description:
      'Offer tailored incentives, unlock new B2B markets, and keep your customers coming back with our integrated discount platform.',
    url: 'https://orisuun.com/business-discount-club',
    siteName: 'Orisuun',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Business Growth Incentive & Customer Retention Platform',
      provider: {
        '@type': 'Organization',
        name: 'Orisuun',
        url: 'https://orisuun.com',
      },
      name: 'Orisuun Discount Portal',
      description:
        'An integrated business incentive platform built to help companies acquire and retain customers by creating, managing, and distributing tailored discount offerings and strategic customer perks.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Discount Portal Core Features',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Expanded Market Visibility',
              description:
                'Showcase specialized incentives and promotional discounts directly to an ecosystem of verified buyers, corporate partners, and growing businesses.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Customer Retention & Engagement Tools',
              description:
                'Deploy customized incentive frameworks and automated discount structures designed to drive repeat purchases, build community trust, and maximize customer lifetime value.',
            },
          },
        ],
      },
    },
  ],
};

const businessDiscountPortalWorksGroups = discountPortalWorksGroups.map((group, groupIndex) => ({
  ...group,
  items: group.items.map((item, itemIndex) => ({
    ...item,
    text:
      groupIndex === 1 && itemIndex === 2
        ? 'Offers are only available to the Orisuun member categories you choose.'
        : item.text,
  })),
}));

export default function DiscountPortalLandingPage() {
  return (
    <main className="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection content={bobDiscountHero} />
      <BenefitsSection />
      <HowPortalWorksSection groups={businessDiscountPortalWorksGroups} />
      <HowToGetInSection />
      <DreamTeamCtaSection
        content={{
          title: 'Ready to build your customer base?',
          description:
            "This is the new wave of marketing. Reaching an untapped customer base has never been so easy. ",
          image: `${staticUrl}/founder/images/cta.svg`,
          imageAlt: 'Founder team meeting',
          cta: {
              label: 'Access the Portal',
            href: '/signup',
          },
        }}
      />
    </main>
  );
}
