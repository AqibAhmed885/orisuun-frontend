import React from 'react'
import { Metadata } from 'next'
import HeroSection from '../find-black-owned-businesses/components/heroSection';
import PartnersMarquee from '../find-black-owned-businesses/components/PartnersMarquee'
import Featured from './components/Featured'
import ClientComponentsWrapper from '../find-black-owned-businesses/components/ClientComponentsWrapper'
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata: Metadata = {
    title: 'Orisuun | Find Black-Owned Restaurants',
    description: 'Find Black-owned restaurants near you. Use Orisuun to explore local Black-owned restaurants in your neighborhood and around the world.',
    // keywords: 'in my area, local, map, nearby, local black-owned restaurant, black-owned restaurants, Black-owned bars near me, Black-owned restaurants in my area, Black-owned food trucks near me, where to find black-owned restaurants, NYC, Atlanta, Houston, Miami, Providence, Fayetteville, Charlotte, New Orleans, Newark, North Carolina, DC, Maryland, Virginia Beach, Toronto, London, Paris',
    openGraph: {
        title: 'Find Black-Owned Restaurants | Orisuun',
        description: 'Discover Black-owned restaurants near you.',
        url: 'https://orisuun.com/find-black-owned-restaurants',
        siteName: 'Orisuun',
        type: 'website',
        locale: 'en_US',
        images: [
          {
                url: 'https://orisuun.com/og/homepage630.png',
            width: 1200,
            height: 630,
                alt: 'Find Black-Owned Restaurants | Orisuun',
          },
        ],
    },
    twitter: {
      card: 'summary_large_image',
        title: 'Find Black-Owned Restaurants | Orisuun',
        description: 'Discover Black-owned restaurants near you.',
        images: ['https://orisuun.com/og/homepage675.png'],
        creator: '@orisuun',
    },
    alternates: {
        canonical: 'https://orisuun.com/find-black-owned-restaurants',
    },
    metadataBase: new URL('https://orisuun.com'),
}

const firstLines = [
    'Find Black-Owned ',
    'Explore Black-Owned',
    'Black-Owned Restaurants',
];

const secondLines = [
    'Restaurants Near You',
    'Restaurants Near You',
    'Close to You',
];

const subtitles = [
    'Easily find nearby Black-owned restaurants and connect with the products and services you need',
    'Discover local Black-owned shops, bars, and restaurants making an impact in your community',
    'Search local Black-owned bars and restaurants and support entrepreneurs in your community',
];

const images = [
    `${staticUrl}/find/map-image-restaurants.svg`,
];

const findFAQ = [
    {
        title: 'Where do the Black-owned restaurants in your database come from?',
        content:
            "Our listings come from restaurant and bar owners who sign up and build a profile on Orisuun. With a global membership base, businesses join us from cities and countries around the world—creating a diverse, ever-growing directory of Black-owned dining options. Because our database is continually expanding and updated by the owners themselves, you’ll have a reliable, robust tool to find exactly what you’re looking for, no matter where you are.",
    },
    {
        title: 'What qualifies as a Black-owned restaurant?',
        content:
            "A restaurant or bar counts as Black-owned on Orisuun if the owner or founders identify as Black. Some restaurants also choose to get verified, which means they show proof that at least 10% of the business is Black-owned. Because Orisuun is a global platform, we don’t restrict based on ethnicity or nationality—our goal is simply to highlight and support Black ownership wherever it exists.",
    },
    {
        title: 'How do I know that the database is accurate?',
        content:
            "Our database stays accurate through a combination of business self-registration, profile updates, and optional verification. Restaurant and bar owners are responsible for keeping their information current, and verified businesses provide documentation to confirm ownership. We also rely on community feedback and regular reviews to ensure the listings you see on Orisuun are up-to-date and reliable, so you can confidently find Black-owned dining options near you.",
    },
    {
        title: 'What should I do if I know of a Black-owned restaurant that belongs on Orisuun?',
        content:
            "If you know a Black-owned restaurant that should be on Orisuun, encourage the owners to create a free profile on our platform. You can also submit the restaurant to our team, and we’ll reach out to invite them to join. Every recommendation helps grow our global network and makes it easier for others to discover and support Black-owned dining options.",
    },
    {
        title: "What is the Supporter's Discount Portal?",
        content:
            "The Discount Portal is a feature that lets our business members offer exclusive deals to Orisuun supporters like you. It’s designed to encourage more people to visit, shop with, and support Black-owned businesses by giving them special savings they can’t get anywhere else. Participation by our business members is completely optional, so not every business will offer discounts—but those that do provide special savings you won’t find anywhere else.",
    },
];

const restaurants = [
    {
        name: 'Copper Leaf Supper Club',
        location: 'New Orleans, LA',
        country: 'United States',
        countryCode: 'us',
        description: 'Creole-inspired dishes paired with live jazz evenings.',
        industry: 'Food',
        initials: 'CL',
        colors: ['#0D3B66', '#1E81B0'],
        image: `${staticUrl}/find/resturants/copper.svg`,
    },
    {
        name: 'Midtown Hearth Kitchen',
        location: 'Atlanta, GA',
        country: 'United States',
        countryCode: 'us',
        description: 'Southern comfort food with modern, elevated touches.',
        industry: 'Food',
        initials: 'MH',
        colors: ['#93221E', '#D3622C'],
        image: `${staticUrl}/find/resturants/midtown.svg`,
    },
    {
        name: 'Union Park Taproom',
        location: 'Washington, DC',
        country: 'United States',
        countryCode: 'us',
        description: 'Craft beer selection with casual American fare.',
        industry: 'Food',
        initials: 'UP',
        colors: ['#0C3A2B', '#15836E'],
        image: `${staticUrl}/find/resturants/union.svg`,
    },
    {
        name: 'Red Brick Jerk House',
        location: 'London, UK',
        country: 'United Kingdom',
        countryCode: 'gb',
        description: 'Caribbean jerk specialties served as bold small plates.',
        industry: 'Food',
        initials: 'RJ',
        colors: ['#AA1E1E', '#E05A30'],
        image: `${staticUrl}/find/resturants/redbrick.svg`,
    },
    {
        name: 'Solstice Rooftop Bar',
        location: 'Chicago, IL',
        country: 'United States',
        countryCode: 'us',
        description: 'Seasonal cocktails with panoramic city views.',
        industry: 'Food',
        initials: 'SR',
        colors: ['#0F4474', '#1F85C3'],
        image: `${staticUrl}/find/resturants/solstice.svg`,
    },
    {
        name: 'Bayview Fish & Fry',
        location: 'Oakland, CA',
        country: 'United States',
        countryCode: 'us',
        description: 'Fried seafood classics with traditional sides.',
        industry: 'Food',
        initials: 'BF',
        colors: ['#0B4E6B', '#0F8C99'],
        image: `${staticUrl}/find/resturants/bayview.svg`,
    },
    {
        name: 'North Market Oyster Bar',
        location: 'Columbus, OH',
        country: 'United States',
        countryCode: 'us',
        description: 'Fresh oysters and coastal-inspired dishes.',
        industry: 'Food',
        initials: 'NM',
        colors: ['#0C2F4B', '#0F6AA5'],
        image: `${staticUrl}/find/resturants/northmarket.svg`,
    },
    {
        name: 'Anchor & Cane Tavern',
        location: 'Bristol, UK',
        country: 'United Kingdom',
        countryCode: 'gb',
        description: 'West African jollof rice, grilled meats, and classics.',
        industry: 'Food',
        initials: 'AC',
        colors: ['#164F3B', '#2AA271'],
        image: `${staticUrl}/find/resturants/anchor.svg`,
    },
    {
        name: 'Junebug Brunch Co.',
        location: 'Dallas, TX',
        country: 'United States',
        countryCode: 'us',
        description: 'All-day brunch featuring scratch-made pastries.',
        industry: 'Food',
        initials: 'JB',
        colors: ['#CC8B11', '#E1B057'],
        image: `${staticUrl}/find/resturants/junebug.svg`,
    },
    {
        name: 'Red Brick Jerk House',
        location: 'Brooklyn, NY',
        country: 'United States',
        countryCode: 'us',
        description: 'Caribbean jerk specialties served as bold small plates.',
        industry: 'Food',
        initials: 'RJ',
        colors: ['#AA1E1E', '#E05A30'],
        image: `${staticUrl}/find/resturants/redbrick1.svg`,
    },
    {
        name: 'Firefly Ramen Kitchen',
        location: 'Los Angeles, CA',
        country: 'United States',
        countryCode: 'us',
        description: 'House-made ramen and Japanese small plates.',
        industry: 'Food',
        initials: 'FR',
        colors: ['#0B3D59', '#1D7AAF'],
        image: `${staticUrl}/find/resturants/firefly.svg`,
    },
    {
        name: 'Highland Table Bistro',
        location: 'Denver, CO',
        country: 'United States',
        countryCode: 'us',
        description: 'New American cuisine using locally sourced ingredients.',
        industry: 'Food',
        initials: 'HT',
        colors: ['#0E2F5A', '#1E5FB9'],
        image: `${staticUrl}/find/resturants/highland.svg`,
    },
]

const Page = () => {
    return (
        <>
            <div>
                <HeroSection firstLines={firstLines} secondLines={secondLines} subtitles={subtitles} images={images} />
                <PartnersMarquee />
                <Featured title="Featured Black-Owned Restaurants" subtitle="Explore Black-owned restaurants like Golden Ember Grill in Houston, Juniper & Rye Kitchen in Atlanta, and Maison Soleil Café in Paris, with dining options found across cities including Chicago, Los Angeles, Miami, and London." data={restaurants} category={"Restaurants"}/>
                <ClientComponentsWrapper
                    businessCounter={2261}
                    advocatesCounter={14308}
                    faqList={findFAQ}
                />
            </div>
        </>
    )
}

export default Page
