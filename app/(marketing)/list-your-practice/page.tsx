import BookingBenefits from "../your-strategist-practice/components/booking-benefits";
import BookingFaq from "../your-strategist-practice/components/booking-faq";
import BookingFaqPanel from "../your-strategist-practice/components/booking-faq-panel";
import BookingHero from "../your-strategist-practice/components/booking-hero";
import ConsultantBookingSprints from "../your-strategist-practice/components/consultant-booking-sprints";
import { FaqItem } from "../your-strategist-practice/page";
import { BookingJsonLd, bookingSeo, getBookingMetadata } from "../booking-seo";
import GotoExpert from "./components/goto-expert";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const seo = bookingSeo.listYourPractice;

export const metadata = getBookingMetadata(seo);

const benefitCards = [
    {
        title: 'Monetized Discovery',
        description:
            "Turn 'quick questions' into paid strategy sessions. Set your own rates for 30-minute sprints and get paid for your specialized knowledge.",
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.88889 0H1.77778C0.795938 0 0 0.795938 0 1.77778V8.88889" fill="url(#paint0_linear_1155_56129)" />
            <path d="M8.88889 32.0002H1.77778C0.795938 32.0002 0 31.2043 0 30.2224V23.1113" fill="url(#paint1_linear_1155_56129)" />
            <path d="M23.1094 32.0002H30.2205C31.2024 32.0002 31.9983 31.2043 31.9983 30.2224V23.1113" fill="url(#paint2_linear_1155_56129)" />
            <path d="M23.1094 0H30.2205C31.2024 0 31.9983 0.795938 31.9983 1.77778V8.88889" fill="url(#paint3_linear_1155_56129)" />
            <path d="M20.4436 10.666H11.5547V21.3327H20.4436V10.666Z" fill="url(#paint4_linear_1155_56129)" />
            <defs>
                <linearGradient id="paint0_linear_1155_56129" x1="-0.111111" y1="-0.0891928" x2="5.20624" y2="10.7324" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint1_linear_1155_56129" x1="-0.111111" y1="23.0221" x2="5.20624" y2="33.8437" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint2_linear_1155_56129" x1="22.9983" y1="23.0221" x2="28.3156" y2="33.8437" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint3_linear_1155_56129" x1="22.9983" y1="-0.0891928" x2="28.3156" y2="10.7324" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint4_linear_1155_56129" x1="11.4436" y1="10.559" x2="18.497" y2="22.5213" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>,
    },
    {
        title: "Qualified Lead Flow",
        description:
            "Founders browse the directory for specific needs (Tax, IP, Compliance). When they book you, they aren't just looking for a chat—they are looking for an expert to solve a problem.",
        Icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_1155_56140"  maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                <path d="M29.3788 15.1749L33.7031 22.7538L29.3788 23.5959V28.6485H26.7842L21.595 27.8064L20.7302 33.7012H7.75718L6.02745 24.9593C3.36367 22.5037 1.70312 19.0283 1.70312 15.1749C1.70312 7.73317 7.89815 1.70117 15.541 1.70117C23.1838 1.70117 29.3788 7.73317 29.3788 15.1749Z" fill="white" stroke="white" stroke-width="3.40378" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.2109 13.4957C11.2109 12.6629 11.4646 11.8489 11.9397 11.1564C12.4149 10.464 13.0902 9.92435 13.8804 9.60567C14.6706 9.28698 15.5401 9.2036 16.3789 9.36606C17.2177 9.52853 17.9883 9.92954 18.593 10.5184C19.1978 11.1072 19.6096 11.8575 19.7765 12.6743C19.9434 13.491 19.8577 14.3376 19.5304 15.107C19.2031 15.8764 18.6489 16.534 17.9377 16.9966C17.2266 17.4593 16.3905 17.7062 15.5353 17.7062V20.2325M15.5353 25.2852V26.1273" stroke="black" stroke-width="3.40378" stroke-linecap="round" stroke-linejoin="round" />
            </mask>
            <g mask="url(#mask0_1155_56140)">
                <path d="M-3.48438 -2.50391H38.0291V37.9171H-3.48438V-2.50391Z" fill="url(#paint0_linear_1155_56140)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_1155_56140" x1="17.2724" y1="-2.50391" x2="17.2724" y2="37.9171" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#103685" />
                    <stop offset="1" stop-color="#58A0F3" />
                </linearGradient>
            </defs>
        </svg>,
    },
    {
        title: 'Zero Admin Overhead',
        description:
            "We handle the scheduling, the video hosting, and the payment collection. You just show up and provide the counsel.",
        Icon: <svg width="26" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.75 0H3.25C1.4625 0 0 1.44 0 3.2V28.8C0 30.56 1.4625 32 3.25 32H22.75C24.5375 32 26 30.56 26 28.8V3.2C26 1.44 24.5375 0 22.75 0ZM3.25 3.2H11.375V16L7.3125 13.6L3.25 16V3.2Z" fill="url(#paint0_linear_1155_56147)" />
            <defs>
                <linearGradient id="paint0_linear_1155_56147" x1="-0.325" y1="-0.321094" x2="21.0908" y2="35.0912" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>,
    },
];

const faqItems: FaqItem[] = [
    {
        title: "Automated Retainers/Payments:",
        body: 'Fees are collected at the time of booking. No more chasing clients for 30-minute consultation fees.."',
        image: `${staticUrl}/booking/investor/1.svg`,
        imageAlt: 'Availability and calendar settings dashboard',
        imagePosition: 'object-left-top',
    },
    {
        title: "Integrated Video Suite",
        body: "No third-party apps. Our secure, built-in video platform allows you to screen-share documents and review contracts in real-time.",
        image: `${staticUrl}/booking/investor/2.svg`,
        imageAlt: 'Calendar events and booking schedule',
        imagePosition: 'object-left-top',
    },
    {
        title: 'The Hard-Stop Timer',
        body: "Maintain your schedule with precision. Our system manages the session length, ensuring your consultations stay profitable and on-time.",
        image: `${staticUrl}/booking/investor/3.svg`,
        imageAlt: 'Strategy consultant profile illustration',
        imagePosition: 'object-center',
    },
];

const svgHighlight = (
    <svg width="302" height="51" viewBox="0 0 302 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -left-2 px-2">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M209.866 0.978819C199.262 0.735234 190.34 0.475729 185.735 0.245382C176.638 -0.209655 155.058 -0.0141811 137.776 0.685607C124.491 1.22159 102.72 2.56139 82.9547 3.93986C77.4278 3.84422 71.8295 3.7245 66.3128 3.58092C17.0287 2.29856 10.7072 2.4903 8.21328 5.34317C5.62975 8.30024 5.61996 8.55187 8.08577 8.64255C8.76226 8.66739 9.45621 8.84637 10.0497 9.12016C8.94916 9.52732 8.31219 10.0137 7.8297 10.6C7.72215 10.7308 7.6192 10.8565 7.52086 10.9772C3.72175 10.1716 3.17353 10.6258 3.7867 13.8739C3.92409 14.6015 3.91229 15.4394 3.77739 16.2971C3.40783 16.5881 3.30411 17.1057 3.38394 17.9143C3.01456 19.0339 2.45848 20.0889 1.77585 20.8698C-0.769879 23.7821 -0.699074 24.0306 2.77394 24.3741L2.93809 24.3901C2.62676 25.1264 2.23532 25.8044 1.78132 26.3562C-0.690823 29.3607 -0.613877 29.6065 2.86614 29.8221C4.92621 29.9496 7.12884 29.9606 7.76082 29.8467C8.28495 29.752 10.071 31.1819 12.0243 33.2034C10.526 33.4611 11.0322 33.8604 13.1645 34.8286C13.3948 34.9333 13.6206 35.045 13.841 35.1629C14.8765 36.2259 15.9732 37.0935 17.1306 37.7656C18.3305 39.1972 18.5456 40.4988 17.0298 40.5634C12.6023 40.7521 18.0693 44.3247 28.3744 47.9768C39.5868 51.9505 40.2132 51.9534 94.8734 48.3009C106.518 47.5228 118.492 46.6216 129.363 45.7232C135.468 46.0162 142.857 46.2642 150.411 46.4301C156.148 46.764 161.966 47.0531 167.376 47.2632C199.281 48.5069 279.006 49.0893 268.384 48.0012C259.347 47.0753 264.051 45.1528 278.342 43.9311C285.71 43.3013 292.014 41.8743 292.35 40.7602C292.687 39.646 294.924 38.8066 297.321 38.8947C300.566 39.014 301.704 38.0791 301.774 35.2362C301.801 34.1519 301.614 33.2935 301.127 32.5849C301.746 31.9815 302 31.0493 302 29.6913C302 27.1208 300.829 25.8617 297.324 24.9466C298.86 24.893 299.204 24.6939 298.534 24.1797C299.02 23.7163 298.953 22.7959 298.572 21.2113C298.442 20.6722 298.392 20.064 298.411 19.4262C298.953 19.2923 298.949 19.0826 298.458 18.7388C298.633 17.0646 299.248 15.2882 300.156 14.0729C302.476 10.9677 302.394 10.7252 299 10.6541C297.14 10.6153 295.164 10.6813 294.395 10.8024C293.871 10.0964 292.444 9.10575 290.293 7.95565C289.793 7.47169 289.277 6.94568 288.764 6.39291C285.861 3.26392 282.518 1.74456 278.743 1.8374C277.899 1.85816 276.807 1.87227 275.5 1.88026C267.712 -0.356727 258.29 -0.163586 213.383 0.893153C212.214 0.920678 211.041 0.949253 209.866 0.978819ZM25.7192 13.5411C25.5326 13.5828 25.3477 13.6247 25.1647 13.667C24.7143 13.5513 24.2665 13.4304 23.8233 13.3044C24.4589 13.3773 25.092 13.4564 25.7192 13.5411ZM13.8695 8.26601C14.8763 8.12448 16.0526 7.9977 17.4341 7.88322C14.8892 7.70559 13.7949 7.78648 13.8695 8.26601Z" fill="#BAD9FF" />
    </svg>


);

const defaultSprintTopics = [
    'The Legal Entity Audit',
    'The Tax Gap Scan',
    'IP Protection Review',
    'Fractional CFO Strategy',
];

export default function ProfessionalBooking() {
    return (
        <div>
            <BookingJsonLd data={seo.structuredData} />
            <BookingHero
                subtitle='Booking for Professionals'
                title='Scale Your Consulting Without the Admin Tax'
                description="We’ve automated the 'Business' of your practice. From calendar syncing to automated payments, we provide the tools so you can focus on the law, the books, or the strategy."
                ctaPrimary='List Your Practice'
                ctaSecondary='See how we handle the billing'
                linkPrimary='/signup'
                linkSecondary='/'
                imageSrc={`${staticUrl}/booking/hero2.svg`}
            />
            <BookingBenefits
                title='Consulting Infrastructure, '
                highlightedTitle='Built for 2026'
                benefitCards={benefitCards}
            />
            <BookingFaq
                faqs={faqItems}
                title={<>Stop Chasing Invoices. Start <br /></>}
                highlightedTitle="Solving Problems."

                description="We’ve optimized the professional workflow so you can maximize your billable impact without the 'small business' friction."
                svgHighlight={svgHighlight}
            />

            <ConsultantBookingSprints
                title="Productize Your Expertise"
                description="Founders book by outcome. Choose which of these high-demand professional sprints you want to list on your profile"
                topics={defaultSprintTopics}
                rows={1}
            />
            <GotoExpert />
            <BookingFaqPanel />
        </div>
    );
}
