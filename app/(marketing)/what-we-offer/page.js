import React from 'react';
import { WeOffer } from './component/weOffer';
import ServiceWorkerRegister from './ServiceWorkerRegister';
import './critical.css';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = {
  title:
    'Orisuun | Exclusive Black-Owned Business Network & Investment Opportunities',
  description:
    'Explore exclusive business development, networking, and investment opportunities. Unleash your potential on Orisuun. ',
  // keywords:
    // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  alternates: {
    canonical: 'https://orisuun.com/what-we-offer',
  },
  openGraph: {
    title: 'Orisuun | Exclusive Black-Owned Business Network & Investment Opportunities',
    description: 'Explore exclusive business development, networking, and investment opportunities. Unleash your potential on Orisuun.',
    url: 'https://orisuun.com/what-we-offer',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/what_we_offer630.png',
        width: 1200,
        height: 630,
        alt: 'Orisuun Business Network and Investment Opportunities',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orisuun | Exclusive Black-Owned Business Network & Investment Opportunities',
    description: 'Explore exclusive business development, networking, and investment opportunities. Unleash your potential on Orisuun.',
    images: ['https://orisuun.com/og/what_we_offer675.png'],
  },
};

const WhatWeOffer = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://orisuun.com/#organization",
        "name": "Orisuun",
        "url": "https://orisuun.com",
        "description": "Orisuun is a community-driven platform connecting Black-owned businesses with investors, mentors, clients, and professionals to fuel growth and opportunity.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://orisuun.com/logo.svg"
        },
        "sameAs": [
          "https://www.linkedin.com/company/orisuun",
          "https://www.instagram.com/orisuun/",
          "https://www.youtube.com/@orisuun"
        ]
      },
      {
        "@type": "Service",
        "@id": "https://orisuun.com/what-we-offer#service",
        "name": "Orisuun Platform Features",
        "description": "A community-driven platform that combines powerful tools and features with access to a collaborative ecosystem of Black-owned businesses, investors, mentors, clients, and professionals.",
        "provider": {
          "@id": "https://orisuun.com/#organization"
        },
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "Discover Feature", "value": "Searchable directory of Black-owned businesses" },
          { "@type": "PropertyValue", "name": "Discover Feature", "value": "Highly customizable public profiles" },
          { "@type": "PropertyValue", "name": "Discover Feature", "value": "Personalized feeds to follow platform activity, followers and followings, business events around the world, business news, and business resouces" },
          { "@type": "PropertyValue", "name": "Discover Feature", "value": "Leaderboard to show off your accomplishments" },
          { "@type": "PropertyValue", "name": "Discover Feature", "value": "Calendar to highlight your upcoming business events" },
          { "@type": "PropertyValue", "name": "Collab Feature", "value": "Subject-based community chats and one-on-one breakout rooms" },
          { "@type": "PropertyValue", "name": "Collab Feature", "value": "Team forming to offer services as a team on the platform" },
          { "@type": "PropertyValue", "name": "Collab Feature", "value": "Feedback and reviews" },
          { "@type": "PropertyValue", "name": "Grow Feature", "value": "Discounts from our partners on products and services you probably already use" },
          { "@type": "PropertyValue", "name": "Grow Feature", "value": "Crowdfunding directly on the platform" },
          { "@type": "PropertyValue", "name": "Grow Feature", "value": "Discounts offered from our Black-owned business members to attract and retain customers" },
          { "@type": "PropertyValue", "name": "Do Business Feature", "value": "Escrow-based transactions directly on the platform" },
          { "@type": "PropertyValue", "name": "Do Business Feature", "value": "Business development opportunity matching" },
          { "@type": "PropertyValue", "name": "Do Business Feature", "value": "Co-founder opportunity matching" },
          { "@type": "PropertyValue", "name": "Do Business Feature", "value": "Board member opportunity matching" },
          { "@type": "PropertyValue", "name": "Ecosystem Access", "value": "Access to a multi-role ecosystem including Black-owned businesses, investors, mentors, clients, and professionals" }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://orisuun.com/#website",
        "url": "https://orisuun.com",
        "name": "Orisuun",
        "publisher": {
          "@id": "https://orisuun.com/#organization"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://orisuun.com/what-we-offer#webpage",
        "url": "https://orisuun.com/what-we-offer",
        "name": "Orisuun | Exclusive Black-Owned Business Network and Investment Platform",
        "description": "Explore the features of the Orisuun platform and how its tools and ecosystem help Black-owned businesses discover opportunities, collaborate, grow, and do business.",
        "isPartOf": {
          "@id": "https://orisuun.com/#website"
        },
        "about": {
          "@id": "https://orisuun.com/what-we-offer#service"
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data - Rendered First */}
      <StructuredDataInjector structuredData={structuredData} />

      {/* Preload critical SVG resources */}
      <link 
        rel="preload" 
        href={`${staticUrl}/what we offer/optimized/toolsLayer1.svg`} 
        as="image" 
        type="image/svg+xml"
      />
      <link 
        rel="preload" 
        href={`${staticUrl}/what we offer/optimized/toolsLayer2.svg`} 
        as="image" 
        type="image/svg+xml"
      />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      <ServiceWorkerRegister />
      <WeOffer />
    </>
  );
};

export default WhatWeOffer;
