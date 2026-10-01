import DreamTeamCtaSection from '../find-a-cofounder/components/dream-team-cta-section';
import {
  BenefitsSection,
  HeroSection,
  HowPortalWorksSection,
  HowToGetInSection,
} from './components';
import { discountPortalLandingHero } from '@/data/marketing/discount';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;


export const metadata = {
  title: "Reach Eager New Customers via Orisuun's Partner Discount Portal",
  description:
    'Put your business in front of a brand new customer base. Sign up, create your partner profile, and manage custom discount incentives with our intuitive dashboard.',
  alternates: {
    canonical: 'https://orisuun.com/partners-discount-club',
  },
  openGraph: {
    title: "Reach Eager New Customers via Orisuun's Partner Discount Portal",
    description:
      'Put your business in front of a brand new customer base. Sign up, create your partner profile, and manage custom discount incentives with our intuitive dashboard.',
    url: 'https://orisuun.com/partners-discount-club',
    siteName: 'Orisuun',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'B2B Partner Alliance & Customer Acquisition Platform',
      provider: {
        '@type': 'Organization',
        name: 'Orisuun',
        url: 'https://orisuun.com',
      },
      name: 'Orisuun Partner Discount Portal',
      description:
        'Get your business in front of a new and eager set of potential customers. A dedicated portal for alliance partners to offer exclusive discounts, manage custom profiles, unlock unmatched growth, and drive cost-effective marketing.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Partner Portal Core Capabilities',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Expanded Market & Customer Reach',
              description:
                'Position your business offers directly to a targeted audience of potential clients. Features include local trust building, community validation, and highly visible exclusive promotional listings.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Partner Admin Dashboard Management',
              description:
                'Comprehensive self-service portal functionality allowing partners to upload logos, create detailed customer profiles, and directly administer, track, or update live discount campaigns.',
            },
          },
        ],
      },
      steps: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Sign up and create profile',
          text: 'Join the platform as a partner, submit your business information, and establish your promotional profile details.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Create and manage rewards',
          text: 'Configure custom discount structures, adjust promotional incentives, and control the offers you present to the community.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Publish to Partner Portal dashboard',
          text: 'Go live to feature your enterprise discounts prominently across the specialized Orisuun network hub.',
        },
      ],
    },
  ],
};

export default function DiscountPortalLandingPage() {
  return (
    <main className="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection content={discountPortalLandingHero} />
      <BenefitsSection />
      <HowPortalWorksSection />
      <HowToGetInSection />
      <DreamTeamCtaSection
        content={{
          title: 'Ready to build your customer base?',
          description:
            "This is the new wave of marketing. Reaching an untapped customer base has never been so easy. ",
          image: `${staticUrl}/founder/images/cta.svg`,
          imageAlt: 'Founder team meeting',
          cta: {
            label: 'Open Your Digital Practice',
            href: '/signup',
          },
        }}
      />
    </main>
  );
}
