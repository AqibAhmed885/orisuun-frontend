import BookingHero from "../your-strategist-practice/components/booking-hero";
import { BookingJsonLd, bookingSeo, getBookingMetadata } from "../booking-seo";
import { PartnerCell } from "@/components/marketing/NewHomepage/PartnerCell";
//import AdvisorDirectorySection from "./components/AdvisorDirectorySection";
import QuestionToSolutionSection from "./components/QuestionToSolutionSection";
import ResultsSliderSection from "./components/ResultsSliderSection";
import StickyAdviceSection from "./components/StickyAdviceSection";
import BookingBenefits from "../your-strategist-practice/components/booking-benefits";
import DreamTeamCtaSection from "../find-a-cofounder/components/dream-team-cta-section";
import MentorBookingDirectory from "../list-your-expertise/components/mentor-booking-directory";
const seo = bookingSeo.bookAnExpert;
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = getBookingMetadata(seo);

const partners = [
    { name: 'Goldman Sachs', slug: 'goldman-sachs' },
    { name: 'Skadden', slug: 'skadden' },
    { name: 'Oliver Wyman', slug: 'oliver-wyman' },
    { name: 'Clifford Chance', slug: 'clifford-chance' },
    { name: 'Morgan Stanley', slug: 'morgan-stanley' },
    { name: 'Bain & Company', slug: 'bain-company' },
    { name: 'BCG', slug: 'bcg' },
    { name: 'Osler', slug: 'osler' },
    { name: 'Lazard', slug: 'lazard' },
    { name: 'Scotiabank', slug: 'scotiabank' },
    { name: 'McKinsey & Company', slug: 'mckinsey' },
    { name: 'Evercore', slug: 'evercore' },
];

const benefitCards = [
    {
        title: 'Proprietary Deal Flow',
        description:
            "Meet founders and established business owners from the idea and seed stages all the way to exit. Spot the winners early through 1:1 strategy sessions.",
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1173_49985)">
                <path d="M17.1406 30.8571V18.8571C17.1406 18.0994 17.4416 17.3727 17.9775 16.8368C18.5133 16.301 19.24 16 19.9978 16C20.7555 16 21.4823 16.301 22.0181 16.8368C22.5539 17.3727 22.8549 18.0994 22.8549 18.8571V25.1429H27.4263C28.6388 25.1429 29.8015 25.6245 30.6588 26.4818C31.5161 27.3391 31.9978 28.5019 31.9978 29.7143V30.8571" fill="#2357C6" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703136 10.1075C0.0728888 8.65175 0.389806 7.21376 0.999394 5.89183C1.60898 4.56991 2.49686 3.39521 3.60232 2.44808C4.70778 1.50095 6.00474 0.803725 7.40451 0.404078C8.80429 0.00443033 10.2739 -0.0882103 11.7127 0.132491C13.1516 0.353191 14.5259 0.882028 15.7415 1.68284C16.9572 2.48365 17.9855 3.53754 18.7563 4.77245C19.5271 6.00737 20.0221 7.39417 20.2074 8.83803C20.3928 10.2819 20.2642 11.7488 19.8303 13.1383C18.3447 13.1823 16.9347 13.8034 15.8994 14.8698C14.8641 15.9362 14.2851 17.364 14.2852 18.8503V19.3509C12.7456 20.035 11.0595 20.3235 9.38005 20.1902C7.70062 20.0569 6.08113 19.506 4.66877 18.5876C3.2564 17.6691 2.09595 16.4123 1.29286 14.9313C0.489778 13.4504 0.0695305 11.7922 0.0703136 10.1075ZM10.18 2.70631C10.9709 2.70631 11.6086 3.34631 11.6086 4.13488V4.78174C12.1703 4.91108 12.6903 5.17995 13.1206 5.56348C13.5509 5.94701 13.8775 6.43283 14.0703 6.97603C14.1329 7.15297 14.16 7.34051 14.1501 7.52794C14.1402 7.71537 14.0935 7.89901 14.0126 8.06839C13.9318 8.23776 13.8183 8.38955 13.6788 8.51508C13.5393 8.64062 13.3764 8.73744 13.1995 8.80003C13.0225 8.86261 12.835 8.88973 12.6475 8.87984C12.4601 8.86994 12.2765 8.82323 12.1071 8.74236C11.9377 8.66149 11.7859 8.54806 11.6604 8.40853C11.5349 8.269 11.438 8.10612 11.3755 7.92917C11.3356 7.82025 11.2635 7.72605 11.1687 7.65909C11.074 7.59213 10.9612 7.55559 10.8452 7.55431H9.30231C9.217 7.55579 9.13518 7.58841 9.07224 7.64603C9.00931 7.70364 8.96961 7.78228 8.96062 7.86712C8.95163 7.95197 8.97397 8.03718 9.02343 8.1067C9.07289 8.17623 9.14606 8.22527 9.22917 8.2446L11.5766 8.7566C12.3355 8.92346 13.015 9.34366 13.5033 9.94806C13.9917 10.5525 14.2597 11.3051 14.2635 12.0821C14.2672 12.8591 14.0063 13.6142 13.5238 14.2233C13.0413 14.8324 12.3659 15.259 11.6086 15.4332V16.0823C11.6086 16.4612 11.4581 16.8246 11.1902 17.0925C10.9223 17.3604 10.5589 17.5109 10.18 17.5109C9.80115 17.5109 9.43778 17.3604 9.16988 17.0925C8.90197 16.8246 8.75146 16.4612 8.75146 16.0823V15.4355C8.19018 15.3058 7.67062 15.0367 7.24077 14.6532C6.81091 14.2697 6.48462 13.7841 6.29203 13.2412C6.16563 12.8838 6.18638 12.4909 6.34969 12.1488C6.51301 11.8067 6.80552 11.5436 7.16289 11.4172C7.52025 11.2908 7.91318 11.3115 8.25525 11.4748C8.59731 11.6382 8.86049 11.9307 8.98688 12.288C9.02678 12.3969 9.09888 12.4911 9.1936 12.5581C9.28832 12.6251 9.40118 12.6616 9.51717 12.6629H10.8452C10.9821 12.6595 11.1131 12.6065 11.2138 12.5137C11.3146 12.4209 11.3781 12.2946 11.3927 12.1584C11.4072 12.0222 11.3717 11.8854 11.2929 11.7734C11.214 11.6614 11.0971 11.5819 10.964 11.5497L8.61888 11.0355C7.89247 10.8771 7.24363 10.4713 6.78337 9.88744C6.32311 9.30357 6.08001 8.57792 6.09567 7.83461C6.11133 7.09131 6.38477 6.37654 6.86922 5.81257C7.35367 5.2486 8.01902 4.87048 8.75146 4.74288V4.13488C8.75146 3.34403 9.39146 2.70631 10.18 2.70631ZM17.1423 18.8503V31.9932H31.9995V29.7075C31.9995 28.495 31.5178 27.3323 30.6605 26.475C29.8032 25.6177 28.6404 25.136 27.428 25.136H22.8566V18.8503C22.8566 18.0925 22.5556 17.3658 22.0198 16.83C21.4839 16.2942 20.7572 15.9932 19.9995 15.9932C19.2417 15.9932 18.515 16.2942 17.9792 16.83C17.4433 17.3658 17.1423 18.0925 17.1423 18.8503Z" fill="url(#paint0_linear_1173_49985)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_1173_49985" x1="-0.328801" y1="-0.305244" x2="18.8179" y2="38.6022" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <clipPath id="clip0_1173_49985">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
,
    },
    {
        title: "Low-Friction Impact",
        description:
            'No more messy LinkedIn DMs. Set your availability, define your session type, and let the right founders find you.',
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.991 1.31515C10.5877 1.31515 7.08731 1.77023 5.22301 2.18274C3.5667 2.54918 2.62093 3.93886 2.44783 5.43324C2.14113 8.12123 1.98639 10.8244 1.98438 13.5298C1.98437 20.192 5.5022 26.4655 11.4811 29.5429C13.3545 30.5068 15.3814 31.3283 16.991 31.3283C18.6005 31.3283 20.6274 30.5068 22.5008 29.5429C28.4797 26.4655 31.9975 20.192 31.9975 13.5291C31.9975 10.1055 31.7393 7.20052 31.5341 5.43254C31.361 3.93886 30.4145 2.54848 28.7589 2.18204C26.8939 1.77023 23.3942 1.31515 16.991 1.31515Z" fill="url(#paint0_linear_1173_50038)" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.511247 0.511247C0.673287 0.349165 0.865669 0.220591 1.07741 0.132871C1.28914 0.0451498 1.51609 0 1.74528 0C1.97447 0 2.20141 0.0451498 2.41315 0.132871C2.62488 0.220591 2.81727 0.349165 2.97931 0.511247L30.8985 28.4305C31.2258 28.7578 31.4097 29.2017 31.4097 29.6645C31.4097 30.1274 31.2258 30.5713 30.8985 30.8985C30.5713 31.2258 30.1274 31.4097 29.6645 31.4097C29.2017 31.4097 28.7578 31.2258 28.4305 30.8985L0.511247 2.97931C0.349165 2.81727 0.220591 2.62488 0.132871 2.41315C0.0451498 2.20141 0 1.97447 0 1.74528C0 1.51609 0.0451498 1.28914 0.132871 1.07741C0.220591 0.865669 0.349165 0.673287 0.511247 0.511247Z" fill="url(#paint1_linear_1173_50038)" />
            <defs>
                <linearGradient id="paint0_linear_1173_50038" x1="1.60921" y1="1.01329" x2="19.5638" y2="37.5527" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint1_linear_1173_50038" x1="-0.392621" y1="-0.315171" x2="18.3967" y2="37.9239" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
,
    },
    {
        title: 'Community Leadership',
        description:
            "Solidify your position as a leading voice in the Black-owned business ecosystem.",
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1173_50042)">
                <path d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 30C0 30.5304 0.210714 31.0391 0.585786 31.4142C0.960859 31.7893 1.46957 32 2 32H30C30.5304 32 31.0391 31.7893 31.4142 31.4142C31.7893 31.0391 32 30.5304 32 30V2C32 1.46957 31.7893 0.960859 31.4142 0.585786C31.0391 0.210714 30.5304 0 30 0L2 0ZM25.27 10C25.67 10 25.996 10.326 25.996 10.728V16.244C25.9953 16.3874 25.9523 16.5273 25.8724 16.6463C25.7925 16.7653 25.6792 16.8581 25.5468 16.913C25.4143 16.9679 25.2687 16.9825 25.128 16.9549C24.9873 16.9273 24.8579 16.8588 24.756 16.758L22.706 14.708L17.706 19.708C17.5185 19.8955 17.2642 20.0008 16.999 20.0008C16.7338 20.0008 16.4795 19.8955 16.292 19.708L13 16.414L7.708 21.708C7.52049 21.8958 7.26607 22.0014 7.00071 22.0016C6.73534 22.0017 6.48077 21.8965 6.293 21.709C6.10523 21.5215 5.99963 21.2671 5.99944 21.0017C5.99926 20.7363 6.10449 20.4818 6.292 20.294L12.292 14.294C12.3849 14.2009 12.4952 14.127 12.6167 14.0766C12.7382 14.0262 12.8685 14.0002 13 14.0002C13.1315 14.0002 13.2618 14.0262 13.3833 14.0766C13.5048 14.127 13.6151 14.2009 13.708 14.294L17 17.584L21.292 13.292L19.238 11.24C19.1372 11.1381 19.0687 11.0087 19.0411 10.868C19.0135 10.7273 19.0281 10.5817 19.083 10.4492C19.1379 10.3168 19.2307 10.2035 19.3497 10.1236C19.4687 10.0437 19.6087 10.0007 19.752 10H25.27Z" fill="url(#paint0_linear_1173_50042)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_1173_50042" x1="-0.399999" y1="-0.321094" x2="18.7425" y2="38.6366" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <clipPath id="clip0_1173_50042">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>,
    },
];

const ctaSection = {
    title: 'Your Next Breakthrough is One Booking Away',
    description:
        "Join 1,000+ founders leveling up their business today.",
    image: `${staticUrl}/founder/images/cta.svg`,
    mobileimage: `${staticUrl}/booking/mobilecta.svg`,
    imageAlt: 'Get Started for Free',
    cta: {
        label: 'Open Your Digital Practice',
        href: '/signup',
    },
}

export default function BobBooking() {
    return (
        <div>
            <BookingJsonLd data={seo.structuredData} />
            <BookingHero
                subtitle='Booking for Strategy Consultants'
                title='Your Most Difficult Business Question, Answered in 30 Minutes.'
                description='Why spend months struggling when you can spend 30 minutes with an expert who’s already solved it? From pitch deck audits to legal protection, book the expertise you need, when you need it.'
                ctaPrimary='Solve a Challenge Today'
                ctaSecondary='Built-in Video: No Downloads Required.'
                linkPrimary='/signup'
                linkSecondary='/consultant-booking-faq'
                imageSrc={`${staticUrl}/booking/hero3.svg`}
                mobileImageSrc={`${staticUrl}/Frame 2147224083.svg`}
                imageFit='contain'
                mobileImageFit='contain'
                hideSecondaryOnMobile
                imagePosition='top'
                contentClassName='items-start md:items-center max-md:!pb-0'
                ctaClassName='max-md:!mt-2'
                mobileImageContainerClassName='-mt-8'
            />

            <div className="hidden w-full p-0.5 bg-[#E8EBF894] md:block">
                <div className="grid h-full grid-cols-3 gap-0.5 sm:grid-cols-6">
                    {partners.map((p, i) => (
                        <PartnerCell key={i} p={p} />
                    ))}
                </div>
            </div>

            <BookingBenefits benefitCards={benefitCards}
                title={<>
                    Business is Harder When You’re Guiding Yourself.
                </>
                }
                description='Most small businesses fail because they lack access to high-level strategy and insight. We’ve gathered the professionals you usually only find in corporate boardrooms and made them available to you for 30-minute sprints.'
            />

            <QuestionToSolutionSection />
            {/* <AdvisorDirectorySection /> */}
            <StickyAdviceSection />
            <ResultsSliderSection />
            <MentorBookingDirectory
                title={
                    <>
                        A Full Board of Advisors,
                        <br />
                        <span
                            className="relative inline-block bg-[image:var(--union-bg)] bg-contain bg-center bg-no-repeat px-4 py-1"
                            style={{
                                '--union-bg': `url(${staticUrl}/discount-portal-landing/Union.png)`,
                            } as React.CSSProperties}
                        >
                            <span className="relative z-10">On-Demand.</span>
                        </span>
                    </>
                }
                hideDescription
            />
            <DreamTeamCtaSection content={ctaSection} />
        </div>
    );
}
