import Head from 'next/head';
import type { Metadata } from 'next';
import Header from './components/header';
import Footer from './components/footer';
import HeroSection from './components/hero-section';
import FeaturesSection from './components/features-section';
import TrustGrowthSection from './components/trust-growth-section';
import HowItWorksSection from './components/how-it-works-section';
import WeeklyEntriesSection from './components/weekly-entries-section';
import TrackProgressSection from './components/track-progress-section';
import TransparencySection from './components/transparency-section';
import GradientCtaSection from './components/gradient-cta-section';
import FaqSection from './components/faq-section';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata: Metadata = {
    title: '$1,000 Weekly Funding for Black-Owned Businesses | Orisuun Free Tier',
    description:
        'A recurring funding opportunity for Black-owned businesses. One eligible active member receives $1,000 each week. No equity. No debt. No strings attached. Join free!',
    // keywords: [
        // 'Black-owned business funding',
        // 'funding for Black-owned businesses',
        // 'weekly funding for Black-owned businesses',
        // 'small business funding',
        // 'non-dilutive funding',
        // 'no equity funding',
        // 'no debt funding',
        // 'Black entrepreneur funding',
        // 'business funding opportunities',
        // '$1,000 weekly funding',
        // 'startup funding for Black founders',
        // 'grants for Black-owned businesses',
        // 'free membership',
    // ],
    alternates: {
        canonical: 'https://orisuun.com/free/weekly-funding',
    },
    openGraph: {
        type: 'website',
        url: 'https://orisuun.com/free/weekly-funding',
        siteName: 'Orisuun',
        title: '$1,000 Weekly for Black-Owned Businesses - Free Tier',
        description:
            'A recurring funding opportunity for Black-owned businesses. One eligible active member receives $1,000 each week. No equity. No debt. Join free today!',
        images: [
            {
                url: 'https://orisuun.com/landing/weekly-funding/weeklyfunding600.png',
                width: 1200,
                height: 630,
                alt: '$1,000 weekly funding for Black-owned businesses. No equity. No debt.',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '$1,000 Weekly for Black-Owned Businesses - Free',
        description:
            'A recurring funding opportunity for Black-owned businesses. One eligible active member receives $1,000 each week. No equity. No debt. Join free!',
        images: [
            {
                url: 'https://orisuun.com/landing/weekly-funding/weeklyfunding675.png',
                alt: '$1,000 weekly funding for Black-owned businesses. No equity. No debt.',
            },
        ],
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://orisuun.com/#organization',
            name: 'Orisuun',
            url: 'https://orisuun.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://orisuun.com/logo.png',
            },
        },
        {
            '@type': 'WebSite',
            '@id': 'https://orisuun.com/#website',
            name: 'Orisuun',
            url: 'https://orisuun.com',
            publisher: {
                '@id': 'https://orisuun.com/#organization',
            },
        },
        {
            '@type': 'Service',
            '@id': 'https://orisuun.com/#service',
            name: 'Orisuun Free Membership',
            serviceType: 'Business networking and growth platform free membership',
            provider: {
                '@id': 'https://orisuun.com/#organization',
            },
            url: 'https://orisuun.com/free',
            description:
                'Orisuun Free tier provides access to discounts, communities, connections, reviews, search, and leaderboard features at no cost.',
            audience: {
                '@type': 'Audience',
                audienceType: 'Businesses, including Black-owned businesses',
            },
            offers: {
                '@type': 'Offer',
                name: 'Free Membership',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://orisuun.com/free/signup',
            },
        },
        {
            '@type': 'WebPage',
            '@id': 'https://orisuun.com/free/weekly-funding/#webpage',
            url: 'https://orisuun.com/free/weekly-funding',
            name: 'Orisuun Weekly Business Fund for Black-Owned Businesses - Free Tier',
            description:
                'The Orisuun Weekly Business Fund is a recurring funding opportunity for Black-owned business members. Each week, one eligible active member receives $1,000 in non-dilutive, no-debt funding. Join free to participate!',
            isPartOf: {
                '@id': 'https://orisuun.com/#website',
            },
        },
    ],
};

export default function WeeklyFreeFundingPage() {
    return (
        <div className='w-full'>
            <Head>
                <link rel='preload' as='image' href={`${staticUrl}/landing/weekly-giveaway/hero-bg.svg`} />
            </Head>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Header signInLink='/signin' joinLink='/free/signup' />
            <HeroSection />
            <FeaturesSection />
            <TrustGrowthSection />
            <GradientCtaSection
                title='The $1,000 Weekly Business Fund'
                description='Every week, one eligible Black-owned business member receives $1,000 to support their growth.'
                buttonLabel='Join Free'
                buttonHref='/free/signup'
                text='Free membership with completed profile required for eligibility'
            />
            <HowItWorksSection />
            <WeeklyEntriesSection />
            <TrackProgressSection />
            <GradientCtaSection
                title='The earlier you join, the more entries you can build.'
                description='Start now, complete your profile, and begin earning entries through activity right away. Free membership gets you access to the weekly funding.'
                buttonLabel='Join Free'
                buttonHref='/free/signup'
                cardBackground='bg-white'
                cardClassName='text-[#0F1116]'
                textWidthClass='max-w-2xl'
            />
            <TransparencySection />
            <FaqSection />
            <GradientCtaSection
                title={
                <div className='flex flex-col items-center gap-4 justify-center'>
                    <span>
                        Start building.
                    </span>
                    <span>
                        Start earning entries
                    </span>
                </div>}
                description='Join Orisuun free tier today and become eligible for the weekly $1,000 member grants'
                buttonLabel='Join Free'
                buttonHref='/free/signup'
            />
            <Footer />
        </div>
    );
}
