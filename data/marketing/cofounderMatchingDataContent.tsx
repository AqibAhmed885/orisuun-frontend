import type { ReactNode } from 'react';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export type MatchingHeroContent = {
  image: string;
  mobileImage?: string;
  mobileBackgroundImage?: string;
  title: string | ReactNode;
  label?: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export type MatchingDataCard = {
  title: string;
  body: string;
  icon?: string;
};

export type MatchingDataSectionContent = {
  title: string;
  description: string;
  cards: MatchingDataCard[];
};

export type MatchingAuthorityPoint = {
  label: string;
  text: string;
  icon?: string;
};

export type MatchingAuthoritySectionContent = {
  layout?: 'side' | 'top';
  image: string;
  rightImage?: string;
  title: string;
  description: string;
  points: MatchingAuthorityPoint[];
  cta: {
    label: string;
    href: string;
  };
};

export type MatchingCtaSectionContent = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cta: {
    label: string;
    href: string;
  };
};

export type CofounderMatchingPageData = {
  hero: MatchingHeroContent;
  dataSection: MatchingDataSectionContent;
  authoritySection: MatchingAuthoritySectionContent;
  ctaSection: MatchingCtaSectionContent;
};

export const cofounderMatchingPageData: CofounderMatchingPageData = {
  hero: {
    image: `${staticUrl}/founder/images/hero.svg`,
    mobileImage: `${staticUrl}/founder/images/image 376.svg`,
    mobileBackgroundImage: `${staticUrl}/founder/images/BG container.svg`,
    title: (
      <>
        Do not Build Alone.
        <br />
        Build Better.
      </>
    ),
    description:
      'Great companies are built on great partnerships. Our intelligent matching engine connects visionary founders with the specific technical, operational, or strategic talent they need to scale. Stop scrolling and start building with your perfect match.',
    primaryCta: {
      label: 'Find a Cofounder',
      href: '/search?type=cofounder',
    },
    secondaryCta: {
      label: 'Become a Cofounder',
      href: '/search?type=cofounder-opportunity',
    },
  },
  dataSection: {
    title: 'Algorithmic Chemistry for Founders.',
    description:
      'Our platform does more than search keywords. We analyze active cofounder posts and deep-profile data to score and rank candidates based on true compatibility.',
    cards: [
      {
        title: 'Precision Ranking',
        body: 'Our algorithm scores profiles and matches based on complementary skill sets, execution style, and long-term vision.',
        icon: `${staticUrl}/founder/images/founder-icon1.svg`,
      },
      {
        title: 'Dual-Sided Discovery',
        body: 'Whether you are a solo founder seeking a partner or a talented professional looking for your next big venture, the system proactively surfaces relevant opportunities.',
        icon: `${staticUrl}/founder/images/founder-icon2.svg`,
      },
      {
        title: 'Relevancy Scoring',
        body: 'We prioritize quality over quantity, delivering a curated shortlist of partners who align to your mission and stage.',
        icon: `${staticUrl}/founder/images/founder-icon3.svg`,
      },
    ],
  },
  authoritySection: {
    layout: 'top',
    image: `${staticUrl}/founder/images/dynamic1.svg`,
    rightImage: `${staticUrl}/founder/images/4.svg`,
    title: 'Zero Friction. Total Alignment.',
    description:
      'Finding a cofounder is the most important decision you make. We remove the guesswork, providing a streamlined path to discovery so you can focus on what matters: your product.',
    points: [
      {
        label: 'Dynamic Matching',
        text: 'As your profile or needs evolve, our engine continuously rescans the membership to find new, emerging matches in real-time.',
        icon: `${staticUrl}/founder/images/dynamic1.svg`,
      },
      {
        label: 'Global & Instant Connectivity',
        text: 'Connect with the right people across borders, roles, and industries, and turn distant opportunities into real relationships with founders, investors, mentors, and experts.',
        icon: `${staticUrl}/founder/images/4.svg`,
      },
    ],
    cta: {
      label: 'Explore the network',
      href: '/signup',
    },
  },
  ctaSection: {
    title: 'Ready to build your dream team?',
    description:
      "The next level of business isn't about competition—it's about composition. Join forces and start winning today.",
    image: `${staticUrl}/founder/images/cta.svg`,
    imageAlt: 'Founder team meeting',
    cta: {
      label: 'Start Free Trial!',
      href: '/signup',
    },
  },
};

export const matchingCtaSectionData = cofounderMatchingPageData.ctaSection;

export const cofounderMatchingHeroData = cofounderMatchingPageData.hero;
