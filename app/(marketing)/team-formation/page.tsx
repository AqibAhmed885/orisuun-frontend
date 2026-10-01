import TeamEcosystemSection from "./components/team-ecosystem-section";
import TeamCollabSection from "./components/team-collab-section";
import TeamGroupWaySection from "./components/team-group-way-section";
import TeamUseCasesSection from "./components/team-use-cases-section";
import BoardMatchingHero from "../find-a-board-member/components/hero";
import DreamTeamCtaSection from "../find-a-cofounder/components/dream-team-cta-section";

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = {
  title: 'Build Turnkey Business Teams & Collectives | Orisuun Network',
  description:
    'Scale your business reach without the overhead. Join forces on Orisuun to create "Plug-In" departments, bundle your offerings, and win bigger together.',
  alternates: {
    canonical: 'https://orisuun.com/team-formation',
  },
  openGraph: {
    title: "Don't Just Network. Build a Powerhouse.",
    description:
      'Individual expertise is valuable, but a collaborative team is unstoppable. Form a Team Identity on Orisuun to offer holistic, powerhouse group solutions.',
    url: 'https://orisuun.com/team-formation',
    siteName: 'Orisuun',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Professional Team Formation & Business Matching',
  provider: {
    '@type': 'Organization',
    name: 'Orisuun',
    url: 'https://orisuun.com',
  },
  name: 'Orisuun Team Identities',
  description:
    'A collaborative tool enabling independent Black-owned businesses, consultants, and experts to form unified group identities, bundle services, and offer turnkey solutions.',
  offers: {
    '@type': 'Offer',
    description: 'Available to Orisuun network subscribers.',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Team Forming Capabilities',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Plug-In Departments',
          description:
            'Combine multi-disciplinary experts like consultants, tech specialists, and investors into a single cohesive group offering.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Cross-Business Collaborations',
          description:
            'Enables businesses to bundle complementary products or services and appear in the directory as a unified market presence.',
        },
      },
    ],
  },
};

const content = {
    title: <>
        <span>Dont Just Network.</span>
        <br />  
          Build a Powerhouse
    </>,
    description: "Introducing Team Identities. Whether you’re a business looking to scale or an expert looking to dominate, stop working in a vacuum. Combine your strengths, create a unified group identity, and win bigger together.",
    image: `${staticUrl}/team-form/hero.svg`,
    mobileBackgroundImage: `${staticUrl}/team-form/mobile-hero.svg`,
    primaryCta: { label: "Find a Cofounder", href: "/search?type=cofounder" },
    secondaryCta: { label: "Become a Cofounder", href: "/cofounder-matching" },
}

const content2 = {
    title: 'Ready to build your dream team?',
    description:
        "The next level of business isn't about competition—it's about composition. Join forces and start winning today.",
    image: `${staticUrl}/founder/images/cta.svg`,
    imageAlt: 'Founder team meeting',
    cta: {
        label: 'Start Forming Your Team',
        href: '/signup',
    },
}


export default function TeamFormLanding(){
    return (
        <main className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <BoardMatchingHero content={content} />
            <TeamEcosystemSection />
            <TeamCollabSection />
            <TeamGroupWaySection />
            <TeamUseCasesSection />
            <DreamTeamCtaSection
                content={content2}
            />
        </main>
    );
}
       
