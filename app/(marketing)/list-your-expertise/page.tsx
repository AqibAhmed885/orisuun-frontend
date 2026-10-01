import BookingBenefits from "../your-strategist-practice/components/booking-benefits";
import BookingHero from "../your-strategist-practice/components/booking-hero";
import BookingFaq from "../your-strategist-practice/components/booking-faq";
import { FaqItem } from "../your-strategist-practice/page";
import ConsultantBookingSprints from "../your-strategist-practice/components/consultant-booking-sprints";
import DreamTeamCtaSection from "../find-a-cofounder/components/dream-team-cta-section";
import BookingFaqPanel from "../your-strategist-practice/components/booking-faq-panel";
import MentorBookingDirectory from "./components/mentor-booking-directory";
import { BookingJsonLd, bookingSeo, getBookingMetadata } from "../booking-seo";
import BookingDirectory from "../your-strategist-practice/components/booking-directory";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const seo = bookingSeo.listYourExpertise;

export const metadata = getBookingMetadata(seo);

const benefitCards = [
    {
        title: 'Direct Access',
        description:
            "Founders and owners browse your profile and book you based on the specific 'Sprints' you offer. No middleman, no forced introductions.",
        Icon: <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 4.46577C0 3.87224 0.513959 3.40934 1.10425 3.47122L31.1043 6.61594C31.6134 6.6693 32 7.09856 32 7.61049V25.7257C32 26.3192 31.486 26.7821 30.8957 26.7203L0.895748 23.5755C0.386613 23.5222 0 23.0929 0 22.581V4.46577Z" fill="url(#paint0_linear_1143_53249)" />
            <path d="M28.4444 6.33555V1.17143C28.4444 0.556556 27.8948 0.0873333 27.2875 0.183817L0 4.51941" fill="url(#paint1_linear_1143_53249)" />
            <defs>
                <linearGradient id="paint0_linear_1143_53249" x1="-0.399999" y1="3.11986" x2="10.923" y2="34.525" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint1_linear_1143_53249" x1="-0.355555" y1="-0.0635721" x2="0.680001" y2="9.39842" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
        ,
    },
    {
        title: "Closed-Loop Impact",
        description:
            "Your wisdom is a high-value asset. We provide the infrastructure for you to share it without the administrative 'tax' of backand-forth emails.",
        Icon: <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.95122 0C2.90329 0 1.89828 0.414842 1.15729 1.15327C0.416288 1.89169 0 2.89321 0 3.9375V31.5L6.91463 27.5625L13.8293 31.5L20.7439 27.5625L27.6585 31.5V3.9375C27.6585 2.89321 27.2422 1.89169 26.5012 1.15327C25.7603 0.414842 24.7552 0 23.7073 0H3.95122ZM8.89024 5.90625C8.1043 5.90625 7.35054 6.21738 6.79479 6.7712C6.23904 7.32502 5.92683 8.07616 5.92683 8.85938C5.92683 9.64259 6.23904 10.3937 6.79479 10.9476C7.35054 11.5014 8.1043 11.8125 8.89024 11.8125C9.67619 11.8125 10.4299 11.5014 10.9857 10.9476C11.5414 10.3937 11.8537 9.64259 11.8537 8.85938C11.8537 8.07616 11.5414 7.32502 10.9857 6.7712C10.4299 6.21738 9.67619 5.90625 8.89024 5.90625ZM21.1529 6.48309C20.7824 6.11401 20.28 5.90667 19.7561 5.90667C19.2322 5.90667 18.7298 6.11401 18.3593 6.48309L6.50568 18.2956C6.31699 18.4772 6.16649 18.6944 6.06295 18.9346C5.95941 19.1748 5.90491 19.4332 5.90263 19.6946C5.90035 19.956 5.95033 20.2152 6.04967 20.4572C6.149 20.6991 6.2957 20.919 6.48119 21.1038C6.66669 21.2887 6.88727 21.4348 7.13007 21.5338C7.37286 21.6328 7.63301 21.6826 7.89533 21.6804C8.15765 21.6781 8.41689 21.6238 8.65792 21.5206C8.89895 21.4174 9.11695 21.2674 9.29919 21.0794L21.1529 9.26691C21.5232 8.89771 21.7313 8.39704 21.7313 7.875C21.7313 7.35296 21.5232 6.85229 21.1529 6.48309ZM18.7683 15.75C17.9823 15.75 17.2286 16.0611 16.6728 16.615C16.1171 17.1688 15.8049 17.9199 15.8049 18.7031C15.8049 19.4863 16.1171 20.2375 16.6728 20.7913C17.2286 21.3451 17.9823 21.6563 18.7683 21.6563C19.5542 21.6563 20.308 21.3451 20.8637 20.7913C21.4195 20.2375 21.7317 19.4863 21.7317 18.7031C21.7317 17.9199 21.4195 17.1688 20.8637 16.615C20.308 16.0611 19.5542 15.75 18.7683 15.75Z" fill="url(#paint0_linear_1143_53253)" />
            <defs>
                <linearGradient id="paint0_linear_1143_53253" x1="-0.345731" y1="-0.316077" x2="19.9426" y2="35.9384" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
        ,
    },
    {
        title: 'Total Sovereignty',
        description:
            "You decide your rate, your hours, and which topics you are open to discussing. You are in full control of your listing.",
        Icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6492 10.5195C14.9644 10.9803 13.9492 12.2745 13.9492 13.4949C13.9492 14.7153 14.9644 16.0095 16.6492 16.4685V10.5195ZM19.3492 19.5213V25.4685C21.034 25.0095 22.0492 23.7153 22.0492 22.4949C22.0492 21.2745 21.034 19.9803 19.3492 19.5213Z" fill="#2357C6" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M36 18C36 27.9414 27.9414 36 18 36C8.0586 36 0 27.9414 0 18C0 8.0586 8.0586 0 18 0C27.9414 0 36 8.0586 36 18ZM18 5.85C18.358 5.85 18.7014 5.99223 18.9546 6.24541C19.2078 6.49858 19.35 6.84196 19.35 7.2V7.7706C22.284 8.2962 24.75 10.5012 24.75 13.5C24.75 13.858 24.6078 14.2014 24.3546 14.4546C24.1014 14.7078 23.758 14.85 23.4 14.85C23.042 14.85 22.6986 14.7078 22.4454 14.4546C22.1922 14.2014 22.05 13.858 22.05 13.5C22.05 12.2796 21.0348 10.9854 19.35 10.5246V16.7706C22.284 17.2962 24.75 19.5012 24.75 22.5C24.75 25.4988 22.284 27.7038 19.35 28.2294V28.8C19.35 29.158 19.2078 29.5014 18.9546 29.7546C18.7014 30.0078 18.358 30.15 18 30.15C17.642 30.15 17.2986 30.0078 17.0454 29.7546C16.7922 29.5014 16.65 29.158 16.65 28.8V28.2294C13.716 27.7038 11.25 25.4988 11.25 22.5C11.25 22.142 11.3922 21.7986 11.6454 21.5454C11.8986 21.2922 12.242 21.15 12.6 21.15C12.958 21.15 13.3014 21.2922 13.5546 21.5454C13.8078 21.7986 13.95 22.142 13.95 22.5C13.95 23.7204 14.9652 25.0146 16.65 25.4736V19.2294C13.716 18.7038 11.25 16.4988 11.25 13.5C11.25 10.5012 13.716 8.2962 16.65 7.7706V7.2C16.65 6.84196 16.7922 6.49858 17.0454 6.24541C17.2986 5.99223 17.642 5.85 18 5.85Z" fill="url(#paint0_linear_1143_53255)" />
            <defs>
                <linearGradient id="paint0_linear_1143_53255" x1="-0.449999" y1="-0.361231" x2="21.0853" y2="43.4662" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
        ,
    },
    {
        title: 'Structured Impact',
        description:
            "30 minutes of your time can save an owner 6 months of mistakes.",
        Icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.05933 0 0 8.05933 0 18C0 27.9251 8.07577 36 18 36C27.9398 36 36 27.9398 36 18C36 8.0749 27.9251 0 18 0ZM27.3462 20.7692H16.9615C16.8697 20.7692 16.7817 20.7328 16.7168 20.6678C16.6519 20.6029 16.6154 20.5149 16.6154 20.4231V5.88462C16.6154 5.79281 16.6519 5.70476 16.7168 5.63985C16.7817 5.57493 16.8697 5.53846 16.9615 5.53846H19.0385C19.1303 5.53846 19.2183 5.57493 19.2832 5.63985C19.3481 5.70476 19.3846 5.79281 19.3846 5.88462V18H27.3462C27.438 18 27.526 18.0365 27.5909 18.1014C27.6558 18.1663 27.6923 18.2543 27.6923 18.3462V20.4231C27.6923 20.5149 27.6558 20.6029 27.5909 20.6678C27.526 20.7328 27.438 20.7692 27.3462 20.7692Z" fill="url(#paint0_linear_1143_53263)" />
            <defs>
                <linearGradient id="paint0_linear_1143_53263" x1="-0.449999" y1="-0.361231" x2="21.0853" y2="43.4662" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
        ,
    },
];

const faqItems: FaqItem[] = [
    {
        title: "Custom Booking Windows",
        body: 'Sync your calendar and open only the slots that work for you—whether that’s one hour a month or five.',
        image: `${staticUrl}/booking/investor/1.svg`,
        imageAlt: 'Availability and calendar settings dashboard',
        imagePosition: 'object-left-top',
    },
    {
        title: "Automated Virtual Office",
        body: "Calls take place in our secure, built-in video suite. No Zoom links to manage; no software for you or the owner to download.",
        image: `${staticUrl}/booking/investor/4.svg`,
        imageAlt: 'Calendar events and booking schedule',
        imagePosition: 'object-left-top',
    },
    {
        title: 'The Hard-Stop Timer',
        body: "To respect your time, our system manages the clock. Calls end precisely on schedule, so you’re never late for what’s next.",
        image: `${staticUrl}/booking/investor/5.svg`,
        imageAlt: 'Strategy consultant profile illustration',
        imagePosition: 'object-left-top',
    },
];

const svgHighlight = (
    <svg width="211" height="51" viewBox="0 0 211 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -left-2 z-0">
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

const ctaSection = {
    title: 'Quantify Your Contribution.',
    description:
        "See the ripple effect of your sessions. Track your total hours contributed and the collective growth of the founders who have booked your time.",
    image: `${staticUrl}/founder/images/cta.svg`,
    imageAlt: 'Founder team meeting',
    cta: {
        label: 'Open Your Digital Practice',
        href: '/signup',
    },
}

export default function MentorBooking() {
    return (
        <div>
            <BookingJsonLd data={seo.structuredData} />
            <BookingHero
                subtitle='Booking for Mentors'
                title='You’ve Reached the Top. Now Send the Elevator Back Down'
                description='Open your calendar to the next wave. List your expertise, set your own schedule, and let ambitious founders and business owners book the specific insights they need to scale. Share your wisdom without the scheduling headache.'
                ctaPrimary=' List Your Expertise'
                ctaSecondary='How the booking system works'
                linkPrimary='/signup?profile=mentors'
                linkSecondary='/signup?profile=mentors'
                imageSrc={`${staticUrl}/booking/mentor/desktop.svg`}
                mobileImageSrc='/booking/mentor/mobile.svg'
            />
            <BookingBenefits
                benefitCards={benefitCards}
                highlightedTitle='Rigorous Strategy.'
                afterTitle="Zero Firm Bureaucracy"
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
                description="You choose what you offer and the time you want to dedicate to each session. You can choose which of these ' Sprints' to list on your profile."
                                      topics={defaultSprintTopics}
                                      rows={2}
            />
            <BookingDirectory
                image={'/booking/mentor/your-impact.svg'}
                title={'Visualize   '}
                highlightedTitle="your Impact"
                description={'Your experience profile is valuable. You should be paid for the costs you can help business owners avoid. You should be paid for the opportunities you can help provide. Now you can, and you can see your impact visualized.'}
            />
            
            <MentorBookingDirectory />
            <DreamTeamCtaSection content={ctaSection} />
            <BookingFaqPanel />
            
        </div>
    );
}
