import type { Metadata } from 'next';

import HeroSection from './components/HeroSection';
import ConnectionSection from './components/ConnectionSection';
import FocusedConversationsSection from './components/FocusedConversationsSection';
import BookingBenefits from '../your-strategist-practice/components/booking-benefits';
import { universalCommunityChatWhyData } from '@/data/marketing/universalAndCommunityChat';
import DreamTeamCtaSection from '../find-a-cofounder/components/dream-team-cta-section';
import StickyAdviceSection from './components/StickyAdviceSection';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata: Metadata = {
  title: 'Connect in Real-Time: Business Groups & Community Chat',
  description:
    'From global talk to targeted inner circles. Join purpose-driven chat spaces on Orisuun to find local partners, share founder tactics, and close business deals.',
  alternates: {
    canonical: 'https://orisuun.com/community-rooms',
  },
  openGraph: {
    title: 'From the Whole World to Your Inner Circle. | Orisuun Chat',
    description:
      'Stop scrolling, start talking. Experience a 24/7 stream of consciousness in Universal Chat or host your own dedicated community room to build your network.',
    url: 'https://orisuun.com/community-rooms',
    siteName: 'Orisuun',
    type: 'website',
    locale: 'en_US',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Professional Communication & Networking Chat',
  provider: {
    '@type': 'Organization',
    name: 'Orisuun',
    url: 'https://orisuun.com',
  },
  name: 'Orisuun Universal & Community Chat',
  description:
    'A real-time communication infrastructure featuring a 24/7 Universal Chat stream and user-hosted Community Rooms tailored for business networking and collaboration.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Chat Features',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Universal Chat',
          description:
            'An open digital town square with instant access for the entire membership, featuring a Live Member List that boosts profile visibility as you contribute.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Community Rooms',
          description:
            'User-generated, highly discoverable niche spaces for hyper-local hubs, specialized industry peer groups, and tactical business discussions.',
        },
      },
    ],
  },
};

const ctaSection={
    title: 'Stop Scrolling. Start Talking.',
    description:
    "Whether you want to shout to the masses or whisper to the experts, your new favorite community is one click away..",
    image: `${staticUrl}/founder/images/cta.svg`,
    imageAlt: 'Founder team meeting',
    cta: {
        label: 'Create Your Account',
        href: '/signup',
    },
}

export default function UniversalAndCommunityChatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="overflow-x-hidden ">
        <HeroSection />
        <BookingBenefits
          className="pb-12 sm:pb-16"
          benefitCards={universalCommunityChatWhyData.map((item) => ({
            title: item.title,
            description: item.description.join(' '),
            path: item.path,
          }))}
          title="If You Can Imagine It, "
          description="Ready to go deep on a specific topic? Move from the Town Square to a dedicated space. With Community Rooms, you are the architect.."
          highlightedTitle="You Can Host It."
        />
        <StickyAdviceSection />
        <ConnectionSection />
        <FocusedConversationsSection />
        <DreamTeamCtaSection content={ctaSection} />
      </main>
    </>
  );
}
