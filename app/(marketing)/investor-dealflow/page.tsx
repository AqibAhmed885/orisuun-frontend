import BookingBenefits from "../your-strategist-practice/components/booking-benefits";
import BookingFaq from "../your-strategist-practice/components/booking-faq";
import BookingFaqPanel from "../your-strategist-practice/components/booking-faq-panel";
import BookingHero from "../your-strategist-practice/components/booking-hero";
import ConsultantBookingSprints from "../your-strategist-practice/components/consultant-booking-sprints";
import { FaqItem } from "../your-strategist-practice/page";
import { BookingJsonLd, bookingSeo, getBookingMetadata } from "../booking-seo";
import BookingDirectory from "../your-strategist-practice/components/booking-directory";
import BookingPeerGroup from "../your-strategist-practice/components/booking-peer-group";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const seo = bookingSeo.investorDealflow;

export const metadata = getBookingMetadata(seo);

const benefitCards = [
    {
        title: 'Proprietary Deal Flow',
        description:
            "Meet founders and established business owners from the idea and seed stages all the way to exit. Spot the winners early through 1:1 strategy sessions.",
        Icon: <svg width="32" height="29" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.6 29C1.14667 29 0.766933 28.8453 0.4608 28.536C0.154667 28.2267 0.00106667 27.8443 0 27.3889V11.2778C0 10.8213 0.1536 10.4389 0.4608 10.1307C0.768 9.82241 1.14773 9.66774 1.6 9.66667H7.2C7.65333 9.66667 8.0336 9.82133 8.3408 10.1307C8.648 10.44 8.80106 10.8224 8.8 11.2778V27.3889C8.8 27.8454 8.6464 28.2283 8.3392 28.5376C8.032 28.8469 7.65227 29.0011 7.2 29H1.6ZM13.2 29C12.7467 29 12.3669 28.8453 12.0608 28.536C11.7547 28.2267 11.6011 27.8443 11.6 27.3889V1.61111C11.6 1.15463 11.7536 0.772259 12.0608 0.464C12.368 0.155741 12.7477 0.00107407 13.2 0H18.8C19.2533 0 19.6336 0.154667 19.9408 0.464C20.248 0.773333 20.4011 1.1557 20.4 1.61111V27.3889C20.4 27.8454 20.2464 28.2283 19.9392 28.5376C19.632 28.8469 19.2523 29.0011 18.8 29H13.2ZM24.8 29C24.3467 29 23.9669 28.8453 23.6608 28.536C23.3547 28.2267 23.2011 27.8443 23.2 27.3889V14.5C23.2 14.0435 23.3536 13.6611 23.6608 13.3529C23.968 13.0446 24.3477 12.89 24.8 12.8889H30.4C30.8533 12.8889 31.2336 13.0436 31.5408 13.3529C31.848 13.6622 32.0011 14.0446 32 14.5V27.3889C32 27.8454 31.8464 28.2283 31.5392 28.5376C31.232 28.8469 30.8523 29.0011 30.4 29H24.8Z" fill="url(#paint0_linear_1143_60646)" />
            <defs>
                <linearGradient id="paint0_linear_1143_60646" x1="-0.399999" y1="-0.290991" x2="15.8876" y2="36.2857" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
        ,
    },
    {
        title: "Low-Friction Impact",
        description:
            'No more messy LinkedIn DMs. Set your availability, define your session type, and let the right founders find you.',
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.88889 21.1761C8.92719 17.9238 10.2351 14.8155 12.5329 12.5155C14.8308 10.2156 17.9363 8.9066 21.1858 8.86826C20.7329 6.23468 19.31 3.86672 17.1981 2.23184C15.0861 0.596962 12.4385 -0.186034 9.77793 0.0374241C7.11736 0.260882 4.63716 1.47455 2.82694 3.43885C1.01672 5.40315 0.00803636 7.97533 1.25565e-07 10.6476C-0.000386519 13.1709 0.892166 15.6128 2.51934 17.5401C4.14651 19.4674 6.40312 20.7556 8.88889 21.1761ZM14.8516 6.46078C15.0182 6.62762 15.1118 6.85387 15.1118 7.08978C15.1118 7.3257 15.0182 7.55195 14.8516 7.71879L9.51822 13.0569C9.43565 13.1397 9.33756 13.2055 9.22957 13.2503C9.12158 13.2952 9.00581 13.3183 8.88889 13.3183C8.77197 13.3183 8.6562 13.2952 8.54821 13.2503C8.44022 13.2055 8.34213 13.1397 8.25956 13.0569L5.59289 10.3878C5.51024 10.3051 5.44469 10.2069 5.39996 10.0988C5.35523 9.99076 5.33221 9.87492 5.33221 9.75794C5.33221 9.64096 5.35523 9.52512 5.39996 9.41704C5.44469 9.30897 5.51024 9.21076 5.59289 9.12805C5.67553 9.04533 5.77365 8.97971 5.88163 8.93494C5.98961 8.89018 6.10534 8.86713 6.22222 8.86713C6.3391 8.86713 6.45483 8.89018 6.56282 8.93494C6.6708 8.97971 6.76891 9.04533 6.85156 9.12805L8.88889 11.169L13.5929 6.459C13.6755 6.37615 13.7736 6.31041 13.8815 6.26556C13.9895 6.22071 14.1053 6.19762 14.2222 6.19762C14.3391 6.19762 14.4549 6.22071 14.5629 6.26556C14.6709 6.31041 14.769 6.37792 14.8516 6.46078ZM21.3333 32C24.1623 32 26.8754 30.8752 28.8758 28.873C30.8762 26.8708 32 24.1553 32 21.3238C32 18.4923 30.8762 15.7768 28.8758 13.7746C26.8754 11.7724 24.1623 10.6476 21.3333 10.6476C18.5044 10.6476 15.7912 11.7724 13.7909 13.7746C11.7905 15.7768 10.6667 18.4923 10.6667 21.3238C10.6667 24.1553 11.7905 26.8708 13.7909 28.873C15.7912 30.8752 18.5044 32 21.3333 32ZM18.4071 17.1352L21.3333 20.0658L24.2596 17.1352C24.4265 16.9681 24.6528 16.8743 24.8889 16.8743C25.1249 16.8743 25.3513 16.9681 25.5182 17.1352C25.6851 17.3022 25.7789 17.5288 25.7789 17.7651C25.7789 18.0013 25.6851 18.2279 25.5182 18.395L22.5902 21.3238L25.5182 24.2526C25.6851 24.4197 25.7789 24.6463 25.7789 24.8825C25.7789 25.1188 25.6851 25.3454 25.5182 25.5124C25.3513 25.6795 25.1249 25.7733 24.8889 25.7733C24.6528 25.7733 24.4265 25.6795 24.2596 25.5124L21.3333 22.5818L18.4071 25.5124C18.2402 25.6795 18.0138 25.7733 17.7778 25.7733C17.5417 25.7733 17.3154 25.6795 17.1484 25.5124C16.9815 25.3454 16.8878 25.1188 16.8878 24.8825C16.8878 24.6463 16.9815 24.4197 17.1484 24.2526L20.0764 21.3238L17.1484 18.395C17.0658 18.3123 17.0002 18.2141 16.9555 18.106C16.9108 17.9979 16.8878 17.8821 16.8878 17.7651C16.8878 17.6481 16.9108 17.5323 16.9555 17.4242C17.0002 17.3161 17.0658 17.2179 17.1484 17.1352C17.2311 17.0525 17.3292 16.9869 17.4372 16.9421C17.5452 16.8973 17.6609 16.8743 17.7778 16.8743C17.8947 16.8743 18.0104 16.8973 18.1184 16.9421C18.2264 16.9869 18.3245 17.0525 18.4071 17.1352Z" fill="url(#paint0_linear_1143_60648)" />
            <defs>
                <linearGradient id="paint0_linear_1143_60648" x1="-0.399999" y1="-0.321094" x2="18.7425" y2="38.6366" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>,
    },
    {
        title: 'Community Leadership',
        description:
            "Solidify your position as a leading voice in the Black-owned business ecosystem.",
        Icon: <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C14.727 0 13.5061 0.496682 12.6059 1.38078C11.7057 2.26488 11.2 3.46398 11.2 4.71429C11.2 5.96459 11.7057 7.16369 12.6059 8.04779C13.5061 8.93189 14.727 9.42857 16 9.42857C17.273 9.42857 18.4939 8.93189 19.3941 8.04779C20.2943 7.16369 20.8 5.96459 20.8 4.71429C20.8 3.46398 20.2943 2.26488 19.3941 1.38078C18.4939 0.496682 17.273 0 16 0ZM17.6 11H14.4C9.984 11 6.4 14.52 6.4 18.8571V19.6429C6.4 20.9471 7.472 22 8.8 22H23.2C24.528 22 25.6 20.9471 25.6 19.6429V18.8571C25.6 14.52 22.016 11 17.6 11ZM7.2 9.42857C7.952 9.42857 8.64 9.24 9.232 8.91C8.56096 7.86067 8.1505 6.67108 8.03377 5.43726C7.91704 4.20344 8.0973 2.95994 8.56 1.80714C8.144 1.66571 7.68 1.57143 7.2 1.57143C4.896 1.57143 3.2 3.23714 3.2 5.5C3.2 7.76286 4.896 9.42857 7.2 9.42857ZM6.576 11H5.6C2.512 11 0 13.4671 0 16.5V18.0714C0 18.5114 0.352 18.8571 0.8 18.8571H3.2C3.2 15.7771 4.496 12.9957 6.576 11ZM24.8 9.42857C27.104 9.42857 28.8 7.76286 28.8 5.5C28.8 3.23714 27.104 1.57143 24.8 1.57143C24.304 1.57143 23.856 1.66571 23.44 1.80714C23.9027 2.95994 24.083 4.20344 23.9662 5.43726C23.8495 6.67108 23.439 7.86067 22.768 8.91C23.36 9.24 24.032 9.42857 24.8 9.42857ZM26.4 11H25.424C26.4931 12.0214 27.3427 13.243 27.9226 14.5926C28.5025 15.9422 28.8008 17.3923 28.8 18.8571H31.2C31.648 18.8571 32 18.5114 32 18.0714V16.5C32 13.4671 29.488 11 26.4 11Z" fill="url(#paint0_linear_1143_60650)" />
            <defs>
                <linearGradient id="paint0_linear_1143_60650" x1="-0.399999" y1="-0.220752" x2="9.68179" y2="29.6235" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>,
    },
];

const faqItems: FaqItem[] = [
    {
        title: "Custom Booking Windows",
        body: 'Sync your calendar and open only the slots that work for you—whether that’s one hour a month or five."',
        image: `${staticUrl}/booking/investor/1.svg`,
        imageAlt: 'Availability and calendar settings dashboard',
        imagePosition: 'object-left-top',
    },
    {
        title: "Automated Virtual Office",
        body: "Calls take place in our secure, built-in video suite. No Zoom links to manage; no software for you or the owner to download.",
        image: `${staticUrl}/booking/investor/2.svg`,
        imageAlt: 'Calendar events and booking schedule',
        imagePosition: 'object-left-top',
    },
    {
        title: 'The Hard-Stop Timer',
        body: "To respect your time, our system manages the clock. Calls end precisely on schedule, so you’re never late for what’s next.",
        image: `${staticUrl}/booking/investor/3.svg`,
        imageAlt: 'Strategy consultant profile illustration',
        imagePosition: 'object-center',
    },
];

const svgHighlight = (
    <svg width="211" height="51" viewBox="0 0 211 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -left-2 z-0 size-[120%]">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M146.628 0.978819C139.219 0.735234 132.986 0.475729 129.768 0.245382C123.413 -0.209655 108.335 -0.0141811 96.261 0.685607C86.9791 1.22159 71.7678 2.56139 57.9584 3.93986C54.0969 3.84422 50.1855 3.7245 46.3311 3.58092C11.8976 2.29856 7.48086 2.4903 5.73842 5.34317C3.93337 8.30024 3.92653 8.55187 5.64933 8.64255C6.12198 8.66739 6.60682 8.84637 7.02148 9.12016C6.25256 9.52732 5.80753 10.0137 5.47042 10.6C5.39528 10.7308 5.32335 10.8565 5.25464 10.9772C2.60029 10.1716 2.21727 10.6258 2.64568 13.8739C2.74167 14.6015 2.73342 15.4394 2.63917 16.2971C2.38096 16.5881 2.3085 17.1057 2.36427 17.9143C2.1062 19.0339 1.71768 20.0889 1.24074 20.8698C-0.537896 23.7821 -0.488426 24.0306 1.93808 24.3741L2.05277 24.3901C1.83525 25.1264 1.56176 25.8044 1.24456 26.3562C-0.482661 29.3607 -0.428901 29.6065 2.0025 29.8221C3.44182 29.9496 4.98075 29.9606 5.42229 29.8467C5.78849 29.752 7.03637 31.1819 8.40108 33.2034C7.35423 33.4611 7.7079 33.8604 9.19769 34.8286C9.35864 34.9333 9.51637 35.045 9.67034 35.1629C10.3938 36.2259 11.1601 37.0935 11.9687 37.7656C12.8071 39.1972 12.9573 40.4988 11.8983 40.5634C8.80488 40.7521 12.6246 44.3247 19.8245 47.9768C27.6584 51.9505 28.096 51.9534 66.2857 48.3009C74.4217 47.5228 82.7873 46.6216 90.3825 45.7232C94.6485 46.0162 99.8105 46.2642 105.089 46.4301C109.097 46.764 113.162 47.0531 116.942 47.2632C139.233 48.5069 194.934 49.0893 187.513 48.0012C181.199 47.0753 184.486 45.1528 194.471 43.9311C199.619 43.3013 204.023 41.8743 204.258 40.7602C204.493 39.646 206.056 38.8066 207.731 38.8947C209.998 39.014 210.793 38.0791 210.842 35.2362C210.861 34.1519 210.73 33.2935 210.39 32.5849C210.823 31.9815 211 31.0493 211 29.6913C211 27.1208 210.182 25.8617 207.733 24.9466C208.806 24.893 209.047 24.6939 208.579 24.1797C208.918 23.7163 208.871 22.7959 208.605 21.2113C208.514 20.6722 208.479 20.064 208.493 19.4262C208.871 19.2923 208.869 19.0826 208.525 18.7388C208.648 17.0646 209.077 15.2882 209.712 14.0729C211.333 10.9677 211.276 10.7252 208.904 10.6541C207.604 10.6153 206.224 10.6813 205.687 10.8024C205.321 10.0964 204.323 9.10575 202.821 7.95565C202.471 7.47169 202.111 6.94568 201.753 6.39291C199.724 3.26392 197.389 1.74456 194.751 1.8374C194.161 1.85816 193.398 1.87227 192.485 1.88026C187.044 -0.356727 180.461 -0.163586 149.086 0.893153C148.269 0.920678 147.449 0.949253 146.628 0.978819ZM17.9694 13.5411C17.839 13.5828 17.7098 13.6247 17.582 13.667C17.2673 13.5513 16.9544 13.4304 16.6447 13.3044C17.0888 13.3773 17.5312 13.4564 17.9694 13.5411ZM9.69031 8.26601C10.3937 8.12448 11.2156 7.9977 12.1808 7.88322C10.4027 7.70559 9.63816 7.78648 9.69031 8.26601Z" fill="#BAD9FF" />
    </svg>

);

const defaultSprintTopics = [
    'First hire framework',
    'Founder burnout audit',
    'Supplier diversity navigation',
    'Succeeding in the vendor game',
    'Networking tools',
    'Pivoting roadmap',
    'Realistic goal setting',
    'Buying into a franchise',
    'Franchising your business',
];

export default function InvestorBooking() {
    return (
        <div>
            <BookingJsonLd data={seo.structuredData} />
            <BookingHero
                subtitle='Booking for Investors'
                title='Gain early access to high-potential Black-owned businesses'
                description='Share your expertise, mentor the next generation of founders, and build a proprietary pipeline of deal flow—all on your own schedule.'
                ctaPrimary='Join as an Investor'
                ctaSecondary='How the booking system works'
                linkPrimary='/signup'
                linkSecondary='/consultant-booking-faq'
               imageSrc={`${staticUrl}/booking/consultant/hero.svg`}
            />
            <BookingBenefits
                benefitCards={benefitCards}
                title='Beyond Mentorship. It’s '
                highlightedTitle='Strategic Alpha'
            />
            <BookingFaq
                faqs={faqItems}
                title='Set Your Availability.'
                highlightedTitle='The System'
                titleAfterHighlight={
                    <> <br /> Does the Rest </>
                }
                description="We’ve removed the friction. Your dashboard is a command center for your professional giving."
                svgHighlight={svgHighlight}
            />
            <ConsultantBookingSprints
                topics={defaultSprintTopics}
                rows={2}
            />
            <BookingDirectory
                image={`${staticUrl}/booking/investor/elite.svg`}
                title='Join a Directory of '
                highlightedTitle='Elite Operators'
                description='Connect with Black founders across industries and stages, from seed to exit.'
                
            />
            <BookingPeerGroup />
            <BookingFaqPanel />
        </div>
    );
}
