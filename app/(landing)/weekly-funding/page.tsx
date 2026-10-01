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
    title: '$1,000 Weekly Funding for Black-Owned Businesses | Orisuun',
    description:
        'A recurring funding opportunity for Black-owned businesses. One eligible active member receives $1,000 each week. No equity. No debt. No strings attached.',
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
    // ],
    alternates: {
        canonical: 'https://orisuun.com/weekly-funding',
    },
    openGraph: {
        type: 'website',
        url: 'https://orisuun.com/weekly-funding',
        siteName: 'Orisuun',
        title: '$1,000 Weekly for Black-Owned Businesses',
        description:
            'A recurring funding opportunity for Black-owned businesses. One eligible active member receives $1,000 each week. No equity. No debt.',
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
        title: '$1,000 Weekly for Black-Owned Businesses',
        description:
            'A recurring funding opportunity for Black-owned businesses. One eligible active member receives $1,000 each week. No equity. No debt.',
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
            name: 'Orisuun Membership',
            serviceType: 'Business networking and growth platform membership',
            provider: {
                '@id': 'https://orisuun.com/#organization',
            },
            url: 'https://orisuun.com',
            description:
                'Orisuun is a subscription-based platform that helps businesses connect with customers, supporters, capital, expertise, business opportunities, and growth tools.',
            audience: {
                '@type': 'Audience',
                audienceType: 'Businesses, including Black-owned businesses',
            },
            offers: [
                {
                    '@type': 'Offer',
                    name: 'Standard Membership',
                    price: '5',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: 'https://orisuun.com/signup',
                },
                {
                    '@type': 'Offer',
                    name: 'Premium Membership',
                    price: '8',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: 'https://orisuun.com/signup',
                },
            ],
        },
        {
            '@type': 'WebPage',
            '@id': 'https://orisuun.com/weekly-funding/#webpage',
            url: 'https://orisuun.com/weekly-funding',
            name: 'Orisuun Weekly Business Fund for Black-Owned Businesses',
            description:
                'The Orisuun Weekly Business Fund is a recurring funding opportunity for Black-owned business members. Each week, one eligible active member receives $1,000 in non-dilutive, no-debt funding. No equity is given up and no repayment is required. Eligibility, selection rules, and weekly winners are published publicly.',
            isPartOf: {
                '@id': 'https://orisuun.com/#website',
            },
            about: [
                {
                    '@type': 'Thing',
                    name: 'Black-owned business funding',
                },
                {
                    '@type': 'Thing',
                    name: 'Funding opportunities for Black-owned businesses',
                },
                {
                    '@type': 'Thing',
                    name: 'Non-dilutive business funding',
                },
                {
                    '@type': 'Thing',
                    name: 'No-debt business funding',
                },
                {
                    '@type': 'Thing',
                    name: 'Small business growth funding',
                },
                {
                    '@type': 'Thing',
                    name: 'Entrepreneurship support',
                },
            ],
            keywords: [
                'Black-owned business funding',
                'funding opportunities for Black-owned businesses',
                'weekly business fund',
                'non-dilutive funding',
                'no equity funding',
                'no debt funding',
                'small business funding',
                'Black entrepreneur funding',
            ],
            mainEntity: {
                '@id': 'https://orisuun.com/weekly-funding/#fund-benefit',
            },
            publisher: {
                '@id': 'https://orisuun.com/#organization',
            },
        },
        {
            '@type': 'DefinedTerm',
            '@id': 'https://orisuun.com/weekly-funding/#fund-benefit',
            name: 'Orisuun Weekly Business Fund',
            description:
                'A recurring member benefit available through Orisuun for eligible Black-owned business members. Each week, one eligible active member receives $1,000. The funding is non-dilutive, carries no debt obligation, and does not require giving up ownership in the business.',
            inDefinedTermSet: 'https://orisuun.com/weekly-funding',
        },
        {
            '@type': 'FAQPage',
            '@id': 'https://orisuun.com/weekly-funding/#faq',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'Do I need to be a paying member to be eligible?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. The weekly $1,000 fund is a member benefit available to active members with completed business profiles.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Can I win more than once?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. Members can win more than once.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How do I increase my chances?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Each day of qualifying activity earns you an additional entry into the weekly selection pool.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'What counts as qualifying activity?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Examples include chats, launching new fundraising campaigns, posting new business opportunities, and offering new discounts on the platform.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How will I know how many entries I have?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'There is a dashboard widget that tracks your weekly activity and keeps count of your entries.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'If I win, how will I be contacted?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Winning members are contacted immediately by email and through chat on the platform.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How are winners selected?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Winners are selected at random from the eligible entry pool each week.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How do winners get paid?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: "Funds are sent securely and directly to the winner's bank account or online wallet.",
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Do I have to give Orisuun a piece of my business?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No. This funding is not tied to equity or ownership in your company. The money is yours, with no strings attached.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Is this money a loan?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No. This funding is not tied to any debt or repayment obligation. The money is yours, with no strings attached.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Do I have to give Orisuun my bank details to win?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: "No. You are not required to provide your bank details. If you win, you can choose to provide them securely to receive a direct transfer. Other payment options may include online wallets, Orisuun's peer-to-peer system, or a check by mail.",
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Is the process public?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. The selection process is published, and winners are announced each week.',
                    },
                },
            ],
        },
    ],
};

export default function WeeklyGiveawayPage() {
    return (
        <div className='w-full'>
            <Head>
                <link rel='preload' as='image' href={`${staticUrl}/landing/weekly-giveaway/hero-bg.svg`} />
            </Head>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Header signInLink='/signin' joinLink='/signup' />
            <HeroSection />
            <FeaturesSection />
            <TrustGrowthSection />
            <GradientCtaSection
                title='The $1,000 Weekly Business Fund'
                description='Every week, one eligible Black-owned business member receives $1,000 to support their growth.'
                buttonLabel='Become a Member'
                buttonHref='/signup'
                text='Active membership and completed profile required for eligibility'
            />
            <HowItWorksSection />
            <WeeklyEntriesSection />
            <TrackProgressSection />
            <GradientCtaSection
                title='The earlier you join, the more entries you can build.'
                description='Start now, complete your profile, and begin earning entries through activity right away. Save with an annual membership and get 52 chances to win.'
                buttonLabel='Become a Member'
                buttonHref='/signup'
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
                description='Join Orisuun today and become eligible for the weekly $1,000 member grants'
                buttonLabel='Become a Member'
                buttonHref='/signup'
            />
            <Footer />
        </div>
    );
}
