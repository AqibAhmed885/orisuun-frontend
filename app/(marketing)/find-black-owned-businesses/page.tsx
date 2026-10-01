
import React from 'react'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

// Dynamically import ALL components including the wrapper to prevent 'use client' directive from contaminating server rendering
const HeroSection = dynamic(
  () => import('./components/heroSection'),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '400px' }} />
  }
)

const PartnersMarquee = dynamic(
  () => import('./components/PartnersMarquee'),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '200px' }} />
  }
)

const Featured = dynamic(
  () => import('../find-black-owned-restaurants/components/Featured'),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '600px' }} />
  }
)

// This is the key fix: dynamically import ClientComponentsWrapper as a whole unit
// This prevents the 'use client' directive from ever touching the server component tree
const ClientComponentsWrapper = dynamic(
  () => import('./components/ClientComponentsWrapper'),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '400px' }} />
  }
)

export const metadata: Metadata = {
  title: 'Orisuun | Find Black-Owned Businesses',
  description: 'Find Black-owned businesses near you. Use Orisuun to explore local Black-owned businesses in your neighborhood and around the world.',
  // keywords: 'in my area, local, map, nearby, local black-owned business, black-owned businesses, Black-owned shops near me, Black-owned businesses in my area, Black-owned stores near me, where to find black-owned businesses, NYC, Atlanta, Houston, Miami, Providence, Fayetteville, Charlotte, New Orleans, Newark, North Carolina, DC, Maryland, Virginia Beach, Toronto, London, Paris',
  openGraph: {
    title: 'Find Black-Owned Businesses | Orisuun',
    description: 'Search and discover Black-owned businesses by category and location.',
    url: 'https://orisuun.com/find-black-owned-businesses',
    siteName: 'Orisuun',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://orisuun.com/og/homepage630.png',
        width: 1200,
        height: 630,
        alt: 'Find Black-Owned Businesses | Orisuun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Black-Owned Businesses | Orisuun',
    description: 'Search and discover Black-owned businesses by category and location.',
    images: ['https://orisuun.com/og/homepage675.png'],
    creator: '@orisuun',
  },
  alternates: {
    canonical: 'https://orisuun.com/find-black-owned-businesses',
  },
  metadataBase: new URL('https://orisuun.com'),
}

const firstLines = [
  'Find Black-Owned ',
  'Explore Black-Owned',
  'Black-Owned Businesses',
];

const secondLines = [
  'Businesses Near You',
  'Businesses Near You',
  'Close to You',
];

const subtitles = [
  'Easily find nearby Black-owned businesses and connect with the products and services you need',
  'Discover local Black-owned shops, services, and restaurants making an impact in your community',
  'Search local Black-owned shops and services and support entrepreneurs in your community',
];

const images = [
  `${staticUrl}/find/map-image.png`,
];

const findFAQ = [
  {
    title: 'Where do the Black-owned businesses in your database come from?',
    content:
      "The businesses in our database come directly from owners and entrepreneurs who register and create a profile on Orisuun. Because our community is global, members from around the world add their companies to the platform—giving you access to a growing, verified network of Black-owned businesses both near you and worldwide.",
  },
  {
    title: 'What qualifies as a Black-owned business?',
    content:
      "A business qualifies as Black-owned on Orisuun when the owner or founders self-identify as Black. For members who choose to become verified, we require documentation showing that the business is at least 10% Black-owned. Because Orisuun is a global platform, we don’t limit participation based on ethnicity or nationality—our focus is simply supporting businesses with Black ownership, wherever they are in the world.",
  },
  {
    title: 'How do I know the database is accurate?',
    content:
      "Our database stays accurate through a combination of business self-registration, ongoing profile updates, and optional verification. Business owners are responsible for maintaining their information, and verified members provide documentation to confirm ownership details. We also routinely review listings and use community feedback to ensure the information on Orisuun remains current and reliable.",
  },
  {
    title: 'What should I do if I know of a Black-owned business that belongs on Orisuun?',
    content:
      "If you know a Black-owned business that should be on Orisuun, share our platform with them and encourage them to create a profile. You can also submit the business to our team, and we’ll reach out to invite them to join. Your recommendations help grow the network and make it easier for others to discover and support Black-owned businesses.",
  },
  {
    title: "What is the Supporter's Discount Portal?",
    content:
      "The Discount Portal is a feature that lets our business members offer exclusive deals to Orisuun supporters like you. It’s designed to encourage more people to visit, shop with, and support Black-owned businesses by giving them special savings they can’t get anywhere else. Participation by our business members is completely optional, so not every business will offer discounts—but those that do provide special savings you won’t find anywhere else.",
  }

];

const businesses = [
  {
    name: 'Juniper & Rye Kitchen',
    location: 'Atlanta, GA',
    country: 'United States',
    countryCode: 'us',
    description: 'Modern Southern cooking with seasonal ingredients.',
    industry: 'Food',
    initials: 'JR',
    colors: ['#0D3B66', '#1E81B0'],
    image: `${staticUrl}/find/businesses/juniper.svg`,
  },
  {
    name: 'Vela Skin Lab',
    location: 'Los Angeles, CA',
    country: 'United States',
    countryCode: 'us',
    description: 'Clean skincare formulated for everyday use.',
    industry: 'Beauty & Wellness',
    initials: 'VS',
    colors: ['#93221E', '#D3622C'],
    image: `${staticUrl}/find/businesses/vela.svg`,
  },
  {
    name: 'Crown & Coil Studio',
    location: 'Detroit, MI',
    country: 'United States',
    countryCode: 'us',
    description: 'Natural hair care and styling services.',
    industry: 'Beauty & Wellness',
    initials: 'CC',
    colors: ['#0C3A2B', '#15836E'],
    image: `${staticUrl}/find/businesses/crown.svg`,
  },
  {
    name: 'Cobalt Root Apothecary',
    location: 'Oakland, CA',
    country: 'United States',
    countryCode: 'us',
    description: 'Small-batch skincare and wellness products.',
    industry: 'Beauty & Wellness',
    initials: 'CR',
    colors: ['#0E2F5A', '#1E5FB9'],
    image: `${staticUrl}/find/businesses/cobalt.svg`,
  },
  {
    name: 'Riverbend Vegan Co.',
    location: 'Portland, OR',
    country: 'United States',
    countryCode: 'us',
    description: 'Plant-based comfort meals and baked goods.',
    industry: 'Food',
    initials: 'RV',
    colors: ['#CC8B11', '#E1B057'],
    image: `${staticUrl}/find/businesses/riverbend.svg`,
  },
  {
    name: 'Noir Thread Studio',
    location: 'Brooklyn, NY',
    country: 'United States',
    countryCode: 'us',
    description: 'Everyday apparel and lifestyle accessories.',
    industry: 'Fashion & Retail',
    initials: 'NT',
    colors: ['#0B3D59', '#1D7AAF'],
    image: `${staticUrl}/find/businesses/noir.svg`,
  },
  {
    name: 'Maison Soleil Café',
    location: 'Paris, FR',
    country: 'France',
    countryCode: 'fr',
    description: 'Coffee, pastries, and light breakfast offerings.',
    industry: 'Food',
    initials: 'MS',
    colors: ['#0C2F4B', '#0F6AA5'],
    image: `${staticUrl}/find/businesses/maison.svg`,
  },
  {
    name: 'Élan Home Collective',
    location: 'London, UK',
    country: 'United Kingdom',
    countryCode: 'gb',
    description: 'Home décor, textiles, and gift items.',
    industry: 'Home & Lifestyle',
    initials: 'EH',
    colors: ['#7C341E', '#D05E2A'],
    image: `${staticUrl}/find/businesses/elan.svg`,
  },
  {
    name: 'Southside Market Co.',
    location: 'Chicago, IL',
    country: 'United States',
    countryCode: 'us',
    description: 'Curated gifts and locally sourced goods.',
    industry: 'Retail',
    initials: 'SM',
    colors: ['#AA1E1E', '#E05A30'],
    image: `${staticUrl}/find/businesses/southside.svg`,
  },
  {
    name: 'Atlas & Ash Footwear',
    location: 'Milan, IT',
    country: 'Italy',
    countryCode: 'it',
    description: 'Handcrafted leather shoes and accessories.',
    industry: 'Fashion & Retail',
    initials: 'AA',
    colors: ['#0F4474', '#1F85C3'],
    image: `${staticUrl}/find/businesses/atlas.svg`,
  },
  {
    name: 'Harbor Spice Collective',
    location: 'Baltimore, MD',
    country: 'United States',
    countryCode: 'us',
    description: 'Caribbean-inspired seafood and spice blends.',
    industry: 'Food',
    initials: 'HS',
    colors: ['#0B4E6B', '#0F8C99'],
    image: `${staticUrl}/find/businesses/harbor.svg`,
  },
  {
    name: 'Golden Ember Grill',
    location: 'Houston, TX',
    country: 'United States',
    countryCode: 'us',
    description: 'Slow-smoked barbecue and classic sides.',
    industry: 'Food',
    initials: 'GE',
    colors: ['#164F3B', '#2AA271'],
    image: `${staticUrl}/find/businesses/golden.svg`,
  },
]

const Page = () => {
  return (
    <>
      <div>
        <HeroSection firstLines={firstLines} secondLines={secondLines} subtitles={subtitles} images={images} />
        <PartnersMarquee />
        <Featured title={"Featured Black-Owned Businesses"} subtitle={"Explore Black-owned restaurants like Maison Soleil Café in Paris, independent retail brands such as Southside Market Co. in Chicago, and service providers across cities including Atlanta, New York, and Washington, DC."} data={businesses} category={"Businesses"} />
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <ClientComponentsWrapper
            businessCounter={2261}
            advocatesCounter={14308}
            faqList={findFAQ}
          />
        </Suspense>
      </div>
    </>
  )
}

export default Page
