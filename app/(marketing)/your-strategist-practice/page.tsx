
import ConsultantBookingPeerGroup from './components/booking-peer-group';
import ConsultantBookingSprints from './components/consultant-booking-sprints';
import BookingHero from './components/booking-hero';
import BookingBenefits from './components/booking-benefits';
import BookingFaq from './components/booking-faq';
import DreamTeamCtaSection from '../find-a-cofounder/components/dream-team-cta-section';
import BookingFaqPanel from './components/booking-faq-panel';
import { BookingJsonLd, bookingSeo, getBookingMetadata } from '../booking-seo';
import BookingDirectory from './components/booking-directory';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const seo = bookingSeo.yourStrategistPractice;

export const metadata = getBookingMetadata(seo);


export type FaqItem = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

const faqItems: FaqItem[] = [
  {
        title: "The 'Hard Stop' Protocol",
        body: 'The \'Hard Stop\' Protocol: "Our system manages the clock.Sessions conclude automatically at the 15-, 30-, or 60-minute mark, ensuring your \'side\' work never bleeds into your \'firm\' work."',
        image: `${staticUrl}/booking/consultant/faq1.svg`,
    imageAlt: 'Availability and calendar settings dashboard',
    imagePosition: 'object-left-top',
  },
  {
      title: "Automated Retainers",
        body: "Fees are collected upfront. No invoicing, no chasing, and no awkward 'fee-for-service' conversations with owners.",
    image: `${staticUrl}/booking/consultant/faq2.svg`,
    imageAlt: 'Calendar events and booking schedule',
    imagePosition: 'object-left-top',
  },
  {
      title: 'Integrated Video Suite',
      body: "No third-party apps. Our secure, built-in video platform allows you to screen-share documents and review contracts in real-time.",
    image: `${staticUrl}/booking/consultant/faq3.svg`,
    imageAlt: 'Strategy consultant profile illustration',
    imagePosition: 'object-top-right',
  },
];

 const benefitCards = [
    {
        title: 'Monetize Your Mindshare:',
        description:
            "Turn those idle hours or 'between-project' windows into high-margin income. Set your own premium rates and get paid for your institutional-grade insight without the administrative overhead.",
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.42841 2.40948C7.59258 1.32517 11.2499 0 15.2645 0C19.2045 0 22.7729 1.27717 24.9273 2.34904L25.0348 2.40237C25.6152 2.69566 26.0872 2.97207 26.4284 3.1996L24.0998 6.60273L22.7845 7.28531C18.2552 9.57036 12.1813 9.57036 7.65124 7.28531L6.49316 6.82315L4.03125 3.1996C4.30769 3.02044 4.59114 2.85233 4.88092 2.69566C5.05097 2.60323 5.23347 2.50783 5.42841 2.40948ZM6.96066 3.45557C7.78189 3.71331 8.65289 3.93906 9.53812 4.1026C11.457 4.45633 13.3892 4.50877 15.0423 4.0315C17.1434 3.42357 19.3484 2.9303 21.4149 2.63878C19.6515 2.05841 17.5193 1.5998 15.2645 1.5998C12.0098 1.5998 8.98796 2.55524 6.96066 3.45557Z" fill="url(#paint0_linear_1145_46930)" />
            <path d="M23.4966 8.71958L23.7144 8.60938C25.9425 10.9895 28.0285 14.046 29.271 17.1594C27.9345 16.3997 26.4231 16.0014 24.8858 16.004C23.3552 16.0038 21.8506 16.3989 20.5175 17.151C19.1845 17.9031 18.0683 18.9867 17.277 20.2968C16.6555 19.8186 15.8934 19.5592 15.1092 19.5591V16.004C15.8825 16.004 16.541 16.4973 16.7863 17.1887C16.8227 17.3019 16.8815 17.4066 16.959 17.4966C17.0366 17.5866 17.1314 17.6602 17.2379 17.713C17.3444 17.7657 17.4604 17.7966 17.579 17.8037C17.6976 17.8109 17.8165 17.7942 17.9285 17.7546C18.0406 17.715 18.1435 17.6533 18.2313 17.5732C18.3191 17.4932 18.39 17.3963 18.4397 17.2883C18.4894 17.1804 18.517 17.0636 18.5208 16.9448C18.5245 16.826 18.5044 16.7077 18.4617 16.5968C18.2166 15.9035 17.7626 15.3033 17.1622 14.8787C16.5618 14.4542 15.8446 14.2263 15.1092 14.2264V13.3377H13.3317V14.2264C12.3888 14.2264 11.4845 14.601 10.8178 15.2677C10.1511 15.9344 9.77656 16.8387 9.77656 17.7816C9.77656 18.7244 10.1511 19.6287 10.8178 20.2954C11.4845 20.9621 12.3888 21.3367 13.3317 21.3367V24.8918C12.5584 24.8918 11.8998 24.3985 11.6545 23.707C11.6182 23.5939 11.5594 23.4892 11.4819 23.3992C11.4043 23.3092 11.3095 23.2356 11.203 23.1828C11.0965 23.1301 10.9805 23.0992 10.8619 23.0921C10.7433 23.0849 10.6244 23.1016 10.5124 23.1412C10.4003 23.1808 10.2974 23.2425 10.2096 23.3225C10.1218 23.4026 10.0509 23.4995 10.0012 23.6074C9.95148 23.7154 9.92392 23.8322 9.92014 23.951C9.91637 24.0698 9.93645 24.1881 9.9792 24.299C10.2242 24.9923 10.6782 25.5925 11.2787 26.017C11.8791 26.4416 12.5963 26.6695 13.3317 26.6693V27.5581H15.1092V26.6693C15.4707 26.6682 15.8164 26.6169 16.1464 26.5156C16.5326 28.5927 17.6462 30.4644 19.2874 31.7949C18.0644 31.9282 16.7224 31.9993 15.2559 31.9993C-6.48452 31.9993 -0.769678 16.8279 6.71472 8.6156L6.92269 8.71958C11.9052 11.233 18.5141 11.233 23.4966 8.71958Z" fill="url(#paint1_linear_1145_46930)" />
            <path d="M15.1098 21.3288C15.6635 21.3288 16.1586 21.5821 16.4838 21.9793C16.1881 22.8377 16.0257 23.7363 16.0021 24.6439C15.7399 24.7968 15.4351 24.8839 15.1098 24.8839V21.3288ZM11.5547 17.7736C11.5547 17.3022 11.742 16.8501 12.0753 16.5167C12.4087 16.1834 12.8608 15.9961 13.3322 15.9961V19.5512C12.8608 19.5512 12.4087 19.3639 12.0753 19.0306C11.742 18.6972 11.5547 18.2451 11.5547 17.7736Z" fill="#003153" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8837 31.9978C26.7694 31.9978 28.5779 31.2487 29.9113 29.9153C31.2448 28.5818 31.9939 26.7733 31.9939 24.8876C31.9939 23.0018 31.2448 21.1933 29.9113 19.8599C28.5779 18.5265 26.7694 17.7773 24.8837 17.7773C22.9979 17.7773 21.1894 18.5265 19.856 19.8599C18.5225 21.1933 17.7734 23.0018 17.7734 24.8876C17.7734 26.7733 18.5225 28.5818 19.856 29.9153C21.1894 31.2487 22.9979 31.9978 24.8837 31.9978ZM25.7724 25.2609L26.8301 24.3125L28.0166 25.6368L24.8837 28.4436L21.7507 25.635L22.9372 24.3116L23.9949 25.2609V21.3325H25.7724V25.2609Z" fill="url(#paint2_linear_1145_46930)" />
            <defs>
                <linearGradient id="paint0_linear_1145_46930" x1="3.75129" y1="-0.0902986" x2="6.33575" y2="13.0004" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint1_linear_1145_46930" x1="-0.365887" y1="8.37468" x2="11.6602" y2="39.0035" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <linearGradient id="paint2_linear_1145_46930" x1="17.5957" y1="17.6347" x2="26.1024" y2="34.947" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>,
    },
    {
        title: "The Problem-Solver's Edge:",
        description:
            'Keep your toolkit sharp by tackling real-world challenges for established mid-market firms and scaling enterprises outside your usual industry silos.',
        Icon: <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.6638 2.13985C24.9094 2.25379 25.135 2.40087 25.3326 2.5738C24.3456 3.06023 23.3508 3.53034 22.3486 3.98393C21.4513 4.39287 20.5406 4.77127 19.6182 5.11851C19.203 5.27043 18.8382 5.39084 18.5398 5.47084C18.2198 5.5565 18.0518 5.57589 17.9998 5.57589C17.9478 5.57589 17.7798 5.5565 17.4606 5.47084C17.1614 5.39003 16.7966 5.27043 16.3814 5.11851C15.4593 4.77126 14.5489 4.39285 13.6519 3.98393C12.6491 3.53161 11.6543 3.06149 10.6679 2.5738C10.8655 2.40087 11.0903 2.25379 11.3367 2.13985C13.1095 1.31639 16.223 0 17.9998 0C19.7758 0 22.8902 1.3172 24.6638 2.13985ZM19.1998 16.8279V7.8014C19.6176 7.68371 20.0305 7.54892 20.4374 7.39735C21.4126 7.03068 22.3752 6.63098 23.3238 6.19893C24.3114 5.75346 25.2916 5.29117 26.2637 4.81224C26.3381 5.70923 26.3997 6.92299 26.3997 8.48505C26.3997 10.3905 26.3085 11.7764 26.2133 12.7033C26.1157 13.6488 25.5174 14.4335 24.663 14.8303C23.243 15.4897 20.9638 16.465 19.1998 16.8279ZM11.3359 14.8303C10.4823 14.4343 9.8839 13.648 9.78631 12.7033C9.69111 11.7764 9.59991 10.3905 9.59991 8.48505C9.59991 6.92218 9.66151 5.71003 9.73591 4.81224C10.7083 5.29049 11.6884 5.75252 12.6759 6.19813C13.6244 6.63045 14.5871 7.03042 15.5622 7.39735C15.9974 7.55654 16.4182 7.69715 16.7998 7.8014V16.8279C15.0359 16.465 12.7567 15.4897 11.3359 14.8303ZM15.0639 19.312C15.3095 19.4259 15.5351 19.573 15.7326 19.7467C14.7457 20.233 13.7509 20.7029 12.7487 21.1561C11.8514 21.565 10.9407 21.9434 10.0183 22.2906C9.60311 22.4426 9.23831 22.563 8.93991 22.643C8.61992 22.7286 8.45192 22.748 8.39992 22.748C8.34792 22.748 8.17992 22.7286 7.86072 22.643C7.56153 22.5622 7.19673 22.4426 6.78153 22.2906C5.85937 21.9434 4.949 21.565 4.05196 21.1561C3.0492 20.704 2.05439 20.2342 1.06799 19.7467C1.26639 19.5722 1.48932 19.4273 1.73678 19.312C3.50957 18.4885 6.62314 17.1721 8.39992 17.1721C10.1759 17.1721 13.2903 18.4893 15.0639 19.312ZM9.59991 34V24.9735C10.0177 24.8558 10.4306 24.721 10.8375 24.5695C11.8127 24.2025 12.7753 23.8026 13.7239 23.3703C14.7115 22.925 15.6916 22.463 16.6638 21.9844C16.7382 22.8814 16.7998 24.0943 16.7998 25.6572C16.7998 27.5627 16.7086 28.9486 16.6134 29.8755C16.5158 30.8209 15.9174 31.6056 15.0639 32.0024C13.6431 32.6618 11.3639 33.6372 9.59991 34ZM1.73598 32.0024C0.882392 31.6064 0.283997 30.8201 0.186398 29.8755C0.0911991 28.9486 0 27.5627 0 25.6572C0 24.0951 0.0615994 22.8822 0.135999 21.9844C1.10831 22.463 2.08844 22.9253 3.07597 23.3711C4.02452 23.8031 4.98719 24.2028 5.96234 24.5695C6.39754 24.7287 6.81833 24.8693 7.19993 24.9735V34C5.43595 33.6372 3.15677 32.6618 1.73598 32.0024ZM34.9325 19.7467C34.7311 19.5704 34.5059 19.424 34.2637 19.312C32.4901 18.4885 29.3757 17.1721 27.5997 17.1721C25.8237 17.1721 22.7094 18.4893 20.9358 19.312C20.6935 19.424 20.4683 19.5704 20.267 19.7467C21.2539 20.233 22.2487 20.7029 23.251 21.1561C24.1483 21.565 25.0589 21.9434 25.9813 22.2906C26.3965 22.4426 26.7613 22.563 27.0597 22.643C27.3797 22.7286 27.5477 22.748 27.5997 22.748C27.6517 22.748 27.8197 22.7286 28.1397 22.643C28.4381 22.5622 28.8037 22.4426 29.2181 22.2906C30.1403 21.9434 31.0507 21.565 31.9477 21.1561C32.9505 20.704 33.9461 20.2342 34.9325 19.7467ZM28.7997 24.9727V33.9992C30.5637 33.6364 32.8429 32.661 34.2637 32.0016C35.1173 31.6056 35.7157 30.8193 35.8133 29.8746C35.9085 28.9478 35.9997 27.5619 35.9997 25.6564C36.0045 24.4307 35.9591 23.2054 35.8637 21.9836C34.8915 22.4626 33.9114 22.9249 32.9237 23.3703C31.9751 23.8023 31.0125 24.202 30.0373 24.5687C29.6021 24.7279 29.1813 24.8693 28.7997 24.9727ZM19.3862 29.8755C19.4838 30.8209 20.0822 31.6056 20.9358 32.0024C22.3566 32.6618 24.6358 33.6372 26.3997 34V24.9735C25.982 24.8558 25.5691 24.721 25.1622 24.5695C24.187 24.2025 23.2243 23.8026 22.2758 23.3703C21.2881 22.925 20.308 22.463 19.3358 21.9844C19.2404 23.2062 19.195 24.4315 19.1998 25.6572C19.1998 27.5627 19.291 28.9486 19.3862 29.8755Z" fill="url(#paint0_linear_1145_46928)" />
            <defs>
                <linearGradient id="paint0_linear_1145_46928" x1="-0.449999" y1="-0.341162" x2="19.1711" y2="41.9397" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
            </defs>
        </svg>
        ,
    },
    {
        title: 'The Purpose-Driven Portfolio:',
        description:
            "Directly impact the growth of Black-owned businesses. Move beyond 'corporate social responsibility' to real-world equity by applying the same frameworks used by the Big Three.",
        Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1145_46925)">
                <path d="M14.4 19.2H1.6V28.8C1.6 29.6487 1.93714 30.4626 2.53726 31.0627C3.13737 31.6629 3.95131 32 4.8 32H27.2C28.0487 32 28.8626 31.6629 29.4627 31.0627C30.0629 30.4626 30.4 29.6487 30.4 28.8V19.2H17.6V22.4H14.4V19.2ZM14.4 17.6H0V8C0 6.24 1.44 4.8 3.2 4.8H9.6V3.2C9.6 2.35131 9.93714 1.53737 10.5373 0.937258C11.1374 0.337142 11.9513 0 12.8 0L19.2 0C20.0487 0 20.8626 0.337142 21.4627 0.937258C22.0629 1.53737 22.4 2.35131 22.4 3.2V4.8H28.8C29.6487 4.8 30.4626 5.13714 31.0627 5.73726C31.6629 6.33737 32 7.15131 32 8V17.6H17.6V14.4H14.4V17.6ZM19.2 4.8V3.2H12.8V4.8H19.2Z" fill="url(#paint0_linear_1145_46925)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_1145_46925" x1="-0.399999" y1="-0.321094" x2="18.7425" y2="38.6366" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#003153" />
                    <stop offset="1" stop-color="#5EA8FF" />
                </linearGradient>
                <clipPath id="clip0_1145_46925">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
        ,
    },
];

const svgHighlight = (
    <svg width="347" height="51" viewBox="0 0 347 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 -left-2 z-0 size-[110%] pr-2">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M241.138 0.978819C228.953 0.735234 218.702 0.475729 213.41 0.245382C202.958 -0.209655 178.162 -0.0141811 158.306 0.685607C143.042 1.22159 118.026 2.56139 95.3155 3.93986C88.965 3.84422 82.5326 3.7245 76.1938 3.58092C19.5661 2.29856 12.3026 2.4903 9.43711 5.34317C6.46862 8.30024 6.45737 8.55187 9.29061 8.64255C10.0679 8.66739 10.8652 8.84637 11.5472 9.12016C10.2826 9.52732 9.55077 10.0137 8.99638 10.6C8.8728 10.7308 8.75452 10.8565 8.64152 10.9772C4.27631 10.1716 3.64641 10.6258 4.35094 13.8739C4.50881 14.6015 4.49525 15.4394 4.34025 16.2971C3.91561 16.5881 3.79645 17.1057 3.88816 17.9143C3.46375 19.0339 2.82481 20.0889 2.04046 20.8698C-0.884596 23.7821 -0.803241 24.0306 3.18727 24.3741L3.37589 24.3901C3.01817 25.1264 2.56839 25.8044 2.04675 26.3562C-0.79376 29.3607 -0.705349 29.6065 3.29321 29.8221C5.66024 29.9496 8.19109 29.9606 8.91723 29.8467C9.51946 29.752 11.5717 31.1819 13.816 33.2034C12.0944 33.4611 12.676 33.8604 15.1261 34.8286C15.3907 34.9333 15.6501 35.045 15.9034 35.1629C17.0932 36.2259 18.3533 37.0935 19.6832 37.7656C21.0618 39.1972 21.309 40.4988 19.5673 40.5634C14.4801 40.7521 20.7618 44.3247 32.6023 47.9768C45.4855 51.9505 46.2053 51.9534 109.01 48.3009C122.39 47.5228 136.148 46.6216 148.638 45.7232C155.654 46.0162 164.143 46.2642 172.824 46.4301C179.415 46.764 186.1 47.0531 192.317 47.2632C228.975 48.5069 320.579 49.0893 308.375 48.0012C297.991 47.0753 303.396 45.1528 319.817 43.9311C328.283 43.3013 335.525 41.8743 335.913 40.7602C336.299 39.646 338.87 38.8066 341.624 38.8947C345.352 39.014 346.66 38.0791 346.741 35.2362C346.772 34.1519 346.557 33.2935 345.997 32.5849C346.708 31.9815 347 31.0493 347 29.6913C347 27.1208 345.655 25.8617 341.627 24.9466C343.392 24.893 343.788 24.6939 343.018 24.1797C343.576 23.7163 343.5 22.7959 343.061 21.2113C342.912 20.6722 342.854 20.064 342.877 19.4262C343.499 19.2923 343.495 19.0826 342.93 18.7388C343.131 17.0646 343.838 15.2882 344.881 14.0729C347.547 10.9677 347.453 10.7252 343.553 10.6541C341.416 10.6153 339.146 10.6813 338.262 10.8024C337.66 10.0964 336.02 9.10575 333.549 7.95565C332.974 7.47169 332.381 6.94568 331.792 6.39291C328.456 3.26392 324.615 1.74456 320.277 1.8374C319.308 1.85816 318.053 1.87227 316.551 1.88026C307.603 -0.356727 296.777 -0.163586 245.179 0.893153C243.835 0.920678 242.487 0.949253 241.138 0.978819ZM29.5515 13.5411C29.3371 13.5828 29.1247 13.6247 28.9144 13.667C28.3969 13.5513 27.8824 13.4304 27.3731 13.3044C28.1034 13.3773 28.8309 13.4564 29.5515 13.5411ZM15.9362 8.26601C17.0929 8.12448 18.4446 7.9977 20.0319 7.88322C17.1078 7.70559 15.8504 7.78648 15.9362 8.26601Z" fill="#BAD9FF" />
    </svg>

);

const defaultSprintTopics = [
    'The Growth Stress-Test',
    'Go-to-Market (GTM) Vetting',
    ' Diversification',
    'Post-Merger Integration',
    'Blue ocean mapping',
    'Competitive intelligence session',
    'Recurring revenue options exploration',
    'Moving to value-based pricing',
    'Exit strategies and options',
    'Mergers and acquisitions',
    'Market entry',
    'Market expansion',
    'Product entry',
    'Unit Economics Deep-Dive',
    'Risks analysis',
];

const ctaSection={
    title: 'Join the New Guard of Strategic Mentors',
    description:
    "You aren't just joining a directory; you’re joining a peer group of Big Three alumni, boutique firm partners, and independent operators who are rewriting the protocol for pipeline growth and client acquisition.",
    image: `${staticUrl}/founder/images/cta.svg`,
    imageAlt: 'Founder team meeting',
    cta: {
        label: 'Open Your Digital Practice',
        href: '/signup',
    },
}


export default function ConsultantBookingPage() {
    return (
        <main className="bg-white">
            <BookingJsonLd data={seo.structuredData} />
            <BookingHero
                subtitle='Booking for Strategy Consultants'
                title='The High-Impact Advisory for the Modern Consultant'
                description='Stay sharp, stay connected, and get paid for your expertise— outside the firm. Open your calendar to Black-owned businesses across the SMB spectrum for high-stakes, timed strategy sessions. Impact where it matters; income on your own terms.'
                ctaPrimary='Open Your Digital Practice'
                ctaSecondary='How we protect your billable time'
                linkPrimary='/signup'
                linkSecondary='/consultant-booking-faq'
                imageSrc={`${staticUrl}/booking/consultant/desktop.svg`}
                mobileImageSrc={`${staticUrl}/booking/consultant/mobile.svg`}
            />
            <BookingBenefits
                benefitCards={benefitCards}
                highlightedTitle='Rigorous Strategy.'
                afterTitle={' Zero Firm Bureaucracy'}
                
            />
            <BookingFaq
                faqs={faqItems}
                title=''
                highlightedTitle='Institutional Strategy,'
                titleAfterHighlight={
                    <> Scaled for <br /> Your Lifestyle. </> 
                }
                description="We’ve built a 'frictionless boardroom' that respects the pace and privacy of a national-firm career."
                svgHighlight={svgHighlight}
            />
            <ConsultantBookingSprints
                title='Productize Your Frameworks'
                description="Don' t sell 'chatting.' Sell outcomes. List specific, high-utility modules that owners can book instantly:"
                topics={defaultSprintTopics}
                rows={3}
            />
            {/* <BookingDirectory
                image={ctaSection.image}
                title={ctaSection.title}
                description={ctaSection.description}
            /> */}
            <DreamTeamCtaSection content={ctaSection} />
            
            <BookingFaqPanel />
        </main>
    );
}
