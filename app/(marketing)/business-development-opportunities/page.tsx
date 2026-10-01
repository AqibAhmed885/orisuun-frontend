import type { Metadata } from "next";

import BoardMatchingHero from "../find-a-board-member/components/hero";
import GrowthIntelligenceSection from "./components/GrowthIntelligenceSection";
import GrowthBeyondRoomsSection from "./components/GrowthBeyondRoomsSection";
import StrategicPipelineSection from "./components/StrategicPipelineSection";
import TailoredMatchingSection from "./components/TailoredMatchingSection";
import WhatsIncludedSection from "./components/WhatsIncludedSection";

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL ?? '';

export const metadata: Metadata = {
    title: "B2B Opportunity Matching & Strategic Pipeline | Orisuun",
    description:
        "Access the strategic pipeline your business needs to scale faster. Discover highly relevant enterprise opportunities, corporate mandates, and member opportunities algorithmically matched to your capabilities.",
    alternates: {
        canonical: "https://orisuun.com/business-development-opportunities",
    },
    openGraph: {
        title: "Expand Your Reach. Secure Your Next Contract.",
        description:
            "Get matched with global opportunities from market expansion to product development.",
        url: "https://orisuun.com/business-development-opportunities",
        siteName: "Orisuun",
        type: "website",
        locale: "en_US",
    },
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Service",
            serviceType: "B2B Strategic Pipeline & Contract Matching System",
            provider: {
                "@type": "Organization",
                name: "Orisuun",
                url: "https://orisuun.com",
            },
            name: "Orisuun Business Development Opportunity Matching System",
            description:
                "Expand Your Reach. Secure Your Next Contract. A strategic pipeline built to connect businesses with relevant commercial leads, corporate mandates, and tailored contract opportunities based on capability matching.",
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Growth Intelligence & Matching Infrastructure",
                itemListElement: [
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Intelligent Capability Matching",
                            description:
                                "Algorithmic sorting calibrated for extreme relevance, filtering corporate opportunities by specialized industry criteria, regional boundaries, and operational scale.",
                        },
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Growth Intelligence Ecosystem",
                            description:
                                "Provides data transparency through pipeline mapping, historical bid timelines, targeted ecosystem trends, and verified network visibility parameters.",
                        },
                    },
                ],
            },
        },
    ],
};

const content = {
    image: `${staticUrl}/businessDevelopment/hero.svg`,
    mobileBackgroundImage: `${staticUrl}/businessDevelopment/mobilehero.svg`,
    title: <>
    Expand Your Reach. <br /> Secure Your Next <br /> Contract.
    </>,
    description:
        "Growth shouldn't rely on luck. Our intelligent business development tool automatically scans active contracts, partnerships, and RFP postings across the platform to score and deliver the highest-value opportunities directly to your dashboard.",
    primaryCta: {
        label: 'Find Opportunities',
        href: '/signup',
    },
    secondaryCta: {
        label: 'Post an Opportunity',
        href: '/signup',
    },
};

type GrowthCard = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const growthCards: GrowthCard[] = [
    {
        title: 'Targeted B2B Partnerships',
        description:
            'Discover other platform businesses looking for strategic joint ventures, supply chain allies, or co-delivery partners to tackle projects together.',
        icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1099_48264)">
                <path d="M12.6562 10.7812C12.6562 10.7812 12.75 10.8281 12.75 10.875V10.9219H12.7969C13.5 11.4844 14.2031 11.7656 15 11.7656C15.7969 11.7656 16.5469 11.4375 17.25 10.875C17.25 10.875 17.2969 10.8281 17.3438 10.8281C18.7969 9.5625 19.7812 7.17188 19.7812 5.01562C19.7812 4.54688 19.7344 4.125 19.6406 3.70312V3.60938L19.5937 3.51562C19.5469 3.28125 19.4531 3.04688 19.3594 2.8125L19.3125 2.71875L19.2656 2.625C18.5156 0.9375 16.9688 0 15 0C12.75 0 10.9688 1.3125 10.4063 3.42188V3.46875L10.3594 3.60938L10.2188 4.45312V4.96875C10.2188 7.17188 11.25 9.5625 12.6562 10.7812ZM26.8594 24.0938C26.5781 24.0938 26.2969 24.1406 26.0625 24.2812L23.4375 21.8906H25.1719V21.7969C25.2188 15.7031 22.0312 14.9531 21.6562 14.9062C20.8594 14.7656 20.2031 14.5312 19.5937 14.2031C19.3594 14.0625 19.2188 13.9688 19.0781 13.875C18.7969 13.6875 18.5625 13.4531 18.3281 13.2188C18.1406 13.0312 18 12.8438 17.8594 12.6562C17.6719 12.4219 17.5312 12.1406 17.3906 11.8594L17.3438 11.7656L17.25 11.8125C16.5469 12.2812 15.7969 12.5156 15 12.5156C14.2031 12.5156 13.4531 12.2812 12.75 11.8125L12.6562 11.7656L12.6094 11.8594C12.5156 12.0469 12.4219 12.1875 12.3281 12.3281C12.1406 12.6094 11.9062 12.9375 11.6719 13.1719C11.4375 13.4062 11.2031 13.5938 10.9219 13.8281L10.875 13.875C10.8281 13.875 10.8281 13.9219 10.7812 13.9219C10.125 14.3906 9.28125 14.7188 8.34375 14.8594C8.20312 14.8594 4.73437 15.4219 4.78125 21.75V21.8438H6.5625L3.9375 24.2344C3.70312 24.1406 3.42187 24.0469 3.14062 24.0469C2.01562 24.0469 1.125 24.9375 1.125 26.0625C1.125 27.1875 2.01562 28.0781 3.14062 28.0781C4.21875 28.125 5.15625 27.2344 5.15625 26.1094C5.15625 25.875 5.10937 25.6875 5.0625 25.4531L9 21.8906L9.04688 21.8438H14.25V26.1094C13.5469 26.4375 13.0312 27.1406 13.0312 27.9375C13.0312 29.0625 13.9219 29.9531 15.0469 29.9531C16.1719 29.9531 17.0625 29.0625 17.0625 27.9375C17.0625 27.1406 16.5938 26.3906 15.8438 26.1094V21.8438H21.0469L21.0938 21.8906L24.9844 25.4531C24.9375 25.6406 24.8906 25.875 24.8906 26.1094C24.8906 27.2344 25.7812 28.125 26.9062 28.125C28.0312 28.125 28.9219 27.2344 28.9219 26.1094C28.875 24.9844 27.9844 24.0938 26.8594 24.0938Z" fill="#003153" />
            </g>
            <defs>
                <clipPath id="clip0_1099_48264">
                    <rect width="30" height="30" fill="white" />
                </clipPath>
            </defs>
        </svg>
        ,
    },
    {
        title: 'Ranked Relevancy Scores',
        description:
            'Every opportunity is mathematically scored against your capabilities, eliminating guesswork and maximizing your bidding efficiency.',
        icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 12.8125C3.75 7.80744 7.80744 3.75 12.8125 3.75H17.1875C22.1926 3.75 26.25 7.80744 26.25 12.8125C26.25 17.8176 22.1926 21.875 17.1875 21.875H16.75V26.25C16.75 26.25 3.75 24.0625 3.75 12.8125ZM17.3071 7.80094C17.9507 8.229 18.4361 8.92212 18.4361 9.85069C18.4361 10.8374 18.0381 11.5624 17.3936 12.0064C17.1266 12.1904 16.8392 12.3107 16.5625 12.3898V13.3474C16.5625 13.8652 16.1427 14.2849 15.625 14.2849C15.1073 14.2849 14.6875 13.8652 14.6875 13.3474V11.5991C14.6875 11.1056 15.0701 10.6967 15.5624 10.6638C15.9087 10.6406 16.1714 10.5716 16.3298 10.4625C16.3964 10.4166 16.4442 10.3639 16.4801 10.2923C16.5174 10.2179 16.5611 10.0837 16.5611 9.85069C16.5611 9.65531 16.4842 9.5055 16.2687 9.36212C16.0236 9.19912 15.6299 9.07906 15.1571 9.06406C14.6893 9.04919 14.235 9.14062 13.9011 9.3025C13.5656 9.46519 13.4429 9.64738 13.4083 9.78206C13.2795 10.2836 12.7686 10.5857 12.2671 10.4569C11.7656 10.3281 11.4635 9.81712 11.5922 9.31562C11.8076 8.47731 12.4347 7.92969 13.0832 7.61531C13.7333 7.30012 14.4974 7.16712 15.2167 7.19C15.9309 7.21269 16.6931 7.3925 17.3071 7.80094ZM15.625 18.125C16.3154 18.125 16.875 17.5654 16.875 16.875C16.875 16.1846 16.3154 15.625 15.625 15.625C14.9346 15.625 14.375 16.1846 14.375 16.875C14.375 17.5654 14.9346 18.125 15.625 18.125Z" fill="#003052" />
        </svg>
        ,
    },
    {
        title: 'Direct RFP & Sourcing',
        description:
            'Access curated requests for proposals (RFPs) and enterprise contract opportunities posted directly by members ready to buy.',
        icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0219 7.12424C18.5276 6.80634 17.9618 6.61671 17.3758 6.57251C16.7898 6.52831 16.202 6.63094 15.6656 6.87111L13.4812 7.85549C12.6356 8.23727 11.7185 8.43538 10.7906 8.43674H9.375C8.1318 8.43674 6.93951 8.9306 6.06044 9.80967C5.18136 10.6888 4.6875 11.881 4.6875 13.1242C4.6875 14.3674 5.18136 15.5597 6.06044 16.4388C6.93951 17.3179 8.1318 17.8117 9.375 17.8117H10.7906C11.7185 17.8131 12.6356 18.0112 13.4812 18.393L15.6656 19.3774C16.1201 19.5799 16.6118 19.6853 17.1094 19.6867C17.5714 19.688 18.0291 19.5979 18.4562 19.4216C18.8833 19.2454 19.2714 18.9865 19.5981 18.6598C19.9248 18.3331 20.1837 17.945 20.3599 17.5179C20.5361 17.0909 20.6262 16.6331 20.625 16.1711V10.0774C20.6247 9.49059 20.4779 8.91318 20.198 8.39749C19.918 7.8818 19.5138 7.44415 19.0219 7.12424ZM11.25 19.6867H6.5625V20.1555C6.5625 21.0257 6.9082 21.8603 7.52356 22.4757C8.13891 23.091 8.97351 23.4367 9.84375 23.4367C10.714 23.4367 11.5486 23.091 12.1639 22.4757C12.7793 21.8603 13.125 21.0257 13.125 20.1555V19.6867H11.25ZM22.5 10.3117V15.9367C23.2459 15.9367 23.9613 15.6404 24.4887 15.113C25.0162 14.5855 25.3125 13.8702 25.3125 13.1242C25.3125 12.3783 25.0162 11.6629 24.4887 11.1355C23.9613 10.6081 23.2459 10.3117 22.5 10.3117Z" fill="black" />
        </svg>
        ,
    },
    {
        title: 'Network Expansion',
        description:
            'Move beyond your immediate circle and build relationships with people who can open doors, share insight, and create momentum.',
        icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1102_48274)">
                <path d="M2.10939 10.7812C2.10939 12.4406 2.79376 13.5469 4.14376 14.0625C5.19376 14.4703 6.53439 14.475 7.96407 14.4656H8.56407C9.91876 14.4656 11.1938 14.4656 12.1969 14.0625C13.5422 13.5375 14.2266 12.4312 14.2266 10.7812C14.2299 9.84126 14.0128 8.91359 13.5927 8.07267C13.1727 7.23175 12.5614 6.501 11.8078 5.93906C12.1256 5.31656 12.2782 4.62291 12.2511 3.92452C12.224 3.22613 12.0181 2.54639 11.6531 1.95039C11.288 1.35438 10.7761 0.862053 10.1663 0.520555C9.5565 0.179057 8.86924 -0.000181377 8.17032 1.37728e-07C7.0862 0.00123772 6.04676 0.432132 5.27973 1.19828C4.5127 1.96444 4.08062 3.00338 4.07814 4.0875C4.08078 4.74117 4.24161 5.38449 4.54689 5.9625C3.79389 6.52087 3.1815 7.24716 2.75836 8.08366C2.33523 8.92017 2.11302 9.84383 2.10939 10.7812ZM8.17032 1.875C8.60904 1.875 9.0379 2.00516 9.40261 2.24899C9.76733 2.49283 10.0515 2.83938 10.2192 3.24479C10.3869 3.6502 10.4305 4.09625 10.3446 4.52647C10.2586 4.95669 10.047 5.35174 9.73645 5.66163C9.4259 5.97153 9.0304 6.18232 8.6 6.26734C8.16959 6.35236 7.72365 6.30779 7.31859 6.13925C6.91353 5.97072 6.56758 5.68581 6.32452 5.32058C6.08146 4.95535 5.95221 4.52622 5.95314 4.0875C5.95438 3.50028 6.18852 2.93753 6.60419 2.52274C7.01986 2.10795 7.5831 1.875 8.17032 1.875ZM15.7031 3.02344H27.8906V4.89844H15.7031V3.02344ZM15.7031 6.30469H27.8906V8.17969H15.7031V6.30469ZM15.7031 9.58594H22.2656V11.4609H15.7031V9.58594ZM4.14376 29.5922C5.19376 30 6.53439 30.0047 7.96407 30H8.56407C9.91876 30 11.1938 30 12.1969 29.5922C13.5422 29.0719 14.2266 27.9656 14.2266 26.3109C14.2302 25.3709 14.0133 24.4431 13.5932 23.6021C13.1732 22.7611 12.5616 22.0304 11.8078 21.4688C12.1283 20.8449 12.2832 20.1492 12.2574 19.4483C12.2317 18.7474 12.0262 18.065 11.6608 17.4663C11.2953 16.8677 10.7822 16.3731 10.1705 16.0299C9.55891 15.6866 8.86933 15.5064 8.16798 15.5064C7.46663 15.5064 6.77706 15.6866 6.16542 16.0299C5.55379 16.3731 5.04063 16.8677 4.6752 17.4663C4.30976 18.065 4.1043 18.7474 4.07855 19.4483C4.0528 20.1492 4.20761 20.8449 4.52814 21.4688C3.77578 22.0307 3.16525 22.7608 2.74529 23.6008C2.32532 24.4407 2.10756 25.3672 2.10939 26.3062C2.10939 27.9656 2.81251 29.0625 4.14376 29.5922ZM8.17032 17.4047C8.60771 17.4056 9.03502 17.5362 9.39824 17.7798C9.76147 18.0235 10.0443 18.3694 10.2111 18.7737C10.3778 19.1781 10.4209 19.6228 10.3351 20.0517C10.2492 20.4806 10.0381 20.8744 9.72845 21.1833C9.41884 21.4923 9.02461 21.7025 8.59555 21.7875C8.1665 21.8725 7.72188 21.8284 7.31787 21.6608C6.91386 21.4932 6.56859 21.2096 6.32569 20.8459C6.08278 20.4822 5.95314 20.0546 5.95314 19.6172C5.9519 19.3255 6.00837 19.0364 6.1193 18.7665C6.23023 18.4967 6.39342 18.2515 6.59949 18.045C6.80556 17.8385 7.05044 17.6748 7.32002 17.5633C7.58961 17.4518 7.87859 17.3947 8.17032 17.3953V17.4047ZM15.7031 18.5391H27.8906V20.4141H15.7031V18.5391ZM15.7031 21.8203H27.8906V23.6953H15.7031V21.8203ZM15.7031 25.1016H22.2656V26.9766H15.7031V25.1016Z" fill="#002748" />
            </g>
            <defs>
                <clipPath id="clip0_1102_48274">
                    <rect width="30" height="30" fill="white" />
                </clipPath>
            </defs>
        </svg>
        ,
    },
];

const headingWords = [
    "The",
    "Strategic",
    "pipeline",
    "businesses",
    "need",
    "to",
    "scale",
    "faster.",
];

const description = "Traditional business development takes months of cold outreach, endless meetings, and navigating broken networks. We’ve built an infrastructure that removes the friction, connecting businesses with high-intent partners, corporate contracts, and joint-venture opportunities the moment they become available.";

const includedCards = [
    {
        title: 'Precision Filters & Smart Sourcing',
        description:
            'Define your ideal contract criteria—industry vertical, project scale, geographical scope, and required capabilities—to narrow your feed to what matters.',
        tags: [
            'Industry Verticals',
            'Project Contract Value',
            'Geographic Focus',
            'Required Certifications',
        ],
    },
    {
        title: 'Algorithmic Vetting & Scoring',
        description:
            'The matching engine instantly crawls member profiles and opportunity posts, grading alignment so you can prioritize the highest-yield conversations.',
        tags: [
            'Capability Alignment',
            'Past Performance Match',
            'Real-time Relevance',
            'Partner discovery',
        ],
    },
    {
        title: 'Frictionless Connection & Bidding',
        description:
            'Move directly from discovery to action. Initiate a secure, private communication channel or submit your credentials straight to the decision-maker.',
        tags: [
            'Direct Messaging',
            'Secure Proposal Submission',
            'Next-step clarity',
            'Opportunity tracking',
        ],
    },
];


export default function BusinessDevelopmentOpportunities() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div>
                <BoardMatchingHero content={content} />
                <StrategicPipelineSection headingWords={headingWords} description={description} />
                <TailoredMatchingSection />
                <GrowthIntelligenceSection 
                    description={"Uncover high-value contracts and partnerships tailored specifically to your readiness and expertise."}
                    growthIntelligenceTitle="Real-time visibility meets ready-to-close intent."
                    growthIntelligenceButtonLabel="Explore opportunities"
                    growthIntelligenceDescription="Stop waiting for leads to turn warm. Our business development matching engine bridges
              the gap between active requirements and qualified providers, ensuring you miss zero
              revenue opportunities."
                    growthCards={growthCards}
                />
                <WhatsIncludedSection includedCards={includedCards} />
                <GrowthBeyondRoomsSection
                    title="Growth should not be limited by the rooms you already have access to."
                    description="Expand your pipeline, identify high-value partnerships, and position your company in
              front of active buyers looking for your exact expertise."
                    ctaLabel="Explore opportunities"
                    ctaLink="/search"
                />
            </div>
        </>
    );
}
