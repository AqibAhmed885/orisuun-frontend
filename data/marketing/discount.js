const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const orderList = [
    'The discounts/incentives must work as you have described them on the site.',
    'Any discount/incentive must be in addition to or equal to any discounts/incentives offered by you in the normal course of business.',
    'The full terms of the discounts/incentives posted on our site by you are controlling.',
];

export const unorderedList = [
    'Your offer will be removed from our site upon the expiry date.',
    'We provide the option to offer one-time-use codes.',
    'You can set the limit of how many discounts can be issued to a user.',
    'Your discounts/incentives are available to our verified business profiles only.',
];

export const discountPortalLandingHero = {
    title: 'Get your business in front of a new and eager set of potential customers',
    titleClassName: 'md:w-[668px] md:h-[219px]',
    titleStyle: {
        fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
        fontWeight: 500,
        fontStyle: 'normal',
        fontSize: '55px',
        lineHeight: '100%',
        letterSpacing: '-1.72px',
        verticalAlign: 'middle',
    },
    description:
        'Turn occasional browsers into loyal patrons. Our Discount Portal gives you the direct tools to launch strategic, high-intent incentives that capture attention, drive immediate customer acquisition, and build long-term repeat business—all on your own terms.',
    ctaLabel: 'Start Free Trial',
    ctaHref: '/signup',
    image: `${staticUrl}/discount-portal-landing/hero_dashboard.svg`,
    imageMobile: `${staticUrl}/discount-portal-landing/hero-mobile.svg`,
    imageAlt: 'Orisuun Discount Portal dashboard preview',
};

export const bobDiscountHero = {
    title: 'Get Customers and Keep Them with Incentives Through our Discount Portal. It Works! ',
    titleClassName: 'md:w-[668px] md:h-[219px]',
    titleStyle: {
        fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
        fontWeight: 500,
        fontStyle: 'normal',
        fontSize: '55px',
        lineHeight: '100%',
        letterSpacing: '-1.72px',
        verticalAlign: 'middle',
    },
    description:
        'Turn occasional browsers into loyal patrons. Our Discount Portal gives you the direct tools to launch strategic, high-intent incentives that capture attention, drive immediate customer acquisition, and build long-term repeat business—all on your own terms.',
    ctaLabel: 'Start Free Trial!',
    ctaHref: '/signup',
    image: `${staticUrl}/discount-portal-landing/bob-hero-d.svg`,
    imageMobile: `${staticUrl}/discount-portal-landing/hero-mobile.svg`,
    imageAlt: 'Orisuun Discount Portal dashboard preview',
};

export const discountPortalLandingBenefitsHeader = {
    titlePrefix: 'Unlock',
    highlightedTitle: 'Unmatched',
    titleSuffix: 'Business Growth with Our Discount Portal',
    highlightImage: `${staticUrl}/discount-portal-landing/Union.png`,
    description:
        'Are you ready to elevate your business while attracting a loyal, long-term customer base?  Welcome to Orisuun’s Discount Portal, the premier platform designed to connect your business with an exclusive community eager for savings and unique deals.',
};

export const discountPortalLandingBenefits = [
    {
        icon: `${staticUrl}/discount-portal-landing/reach-audience.png`,
        title: 'Reach the Right Audience',
        points: [
            'Reach an engaged community already looking for trusted offers.',
            'Connect with customers more likely to buy, return, and refer.'
        ],
    },
    {
        icon: `${staticUrl}/discount-portal-landing/eye.png`,
        title: 'Boost Your Visibility',
        points: [
            'Put your offer in front of people who match your ideal audience.',
            'Gain exposure without relying on expensive advertising campaigns.'
        ],
    },
    {
        icon: `${staticUrl}/discount-portal-landing/icon-park-solid_sales-report.png`,
        title: 'Drive Traffic and Sales',
        points: [
            'Use compelling discounts to bring more people to your business.',
            'Track how each offer supports visits, sales, and repeat customers.'
        ],
    },
    {
        icon: `${staticUrl}/discount-portal-landing/fluent_people-community-16-filled.png`,
        title: 'Community Building',
        points: [
            'Join a network built around belonging, support, and shared growth.',
            'Build recognition inside a global community of active business owners.'
        ],
    },
    {
        icon: `${staticUrl}/discount-portal-landing/effective-integration.png`,
        title: 'Effective Integration',
        points: [
            'Connect your discount offers with the systems you already use.',
            'Use unique codes to track activity, usage, and campaign performance.'
        ],
    },
    {
        icon: `${staticUrl}/discount-portal-landing/cost-effective-marketing.png`,
        title: 'Cost-Effective Marketing',
        points: [
            'Reach a targeted audience without paying high upfront marketing costs.',
            'Turn warm introductions into loyal customers and repeat buyers.'
        ],
    },
];

export const discountPortalWorksHeader = {
    title: 'How the Discount Portal Works',
    description:
        'Publish offers that are clear, trackable, and useful for verified businesses in the Orisuun network.',
};


export const discountPortalWorksGroups = [
    {
        title: 'Before your offer goes live, make sure it meets the basic standards.',
        ctaLabel: 'Speak to the team',
        ctaHref: '/contact-us',
        items: [
            {
                icon: <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5949 20.6086C13.0696 20.6254 12.5462 20.5386 12.0544 20.3531C11.5627 20.1676 11.1123 19.8871 10.729 19.5275C9.95484 18.8014 9.50086 17.7975 9.46691 16.7366C9.43296 15.6757 9.82183 14.6448 10.548 13.8707C11.2741 13.0965 12.278 12.6426 13.3389 12.6086C13.5511 12.5959 13.7596 12.668 13.9187 12.809C14.0777 12.95 14.1742 13.1484 14.1869 13.3606C14.1996 13.5728 14.1276 13.7813 13.9865 13.9403C13.8455 14.0994 13.6471 14.1959 13.4349 14.2086C12.9755 14.2404 12.5348 14.4037 12.1657 14.6791C11.7965 14.9545 11.5144 15.3303 11.3529 15.7616C11.1915 16.1929 11.1576 16.6616 11.2552 17.1117C11.3528 17.5618 11.5779 17.9743 11.9036 18.2999C12.2292 18.6256 12.6417 18.8507 13.0918 18.9483C13.5419 19.046 14.0106 19.012 14.4419 18.8506C14.8733 18.6891 15.249 18.407 15.5244 18.0378C15.7998 17.6687 15.9631 17.2281 15.9949 16.7686C16.0113 16.5578 16.1089 16.3616 16.267 16.2214C16.4252 16.0811 16.6317 16.0077 16.8429 16.0166C16.948 16.0227 17.0509 16.0495 17.1456 16.0955C17.2404 16.1415 17.3251 16.2057 17.395 16.2845C17.4648 16.3632 17.5185 16.4551 17.5528 16.5546C17.5871 16.6542 17.6014 16.7595 17.5949 16.8646C17.5298 17.8805 17.0797 18.8333 16.3365 19.5289C15.5933 20.2246 14.6129 20.6107 13.5949 20.6086ZM7.17891 12.6086C7.00653 12.6044 6.83936 12.5486 6.69891 12.4486C6.52917 12.3213 6.41696 12.1318 6.38695 11.9217C6.35694 11.7117 6.41161 11.4983 6.53891 11.3286C7.36109 10.2344 8.42672 9.34672 9.65143 8.73576C10.8761 8.12479 12.2263 7.80736 13.5949 7.80861C15.0168 7.8063 16.4177 8.15239 17.6749 8.81661C17.8616 8.91845 18.0002 9.09029 18.0602 9.29433C18.1203 9.49837 18.0968 9.71789 17.9949 9.90461C17.8931 10.0913 17.7212 10.2299 17.5172 10.2899C17.3131 10.3499 17.0936 10.3264 16.9069 10.2246C15.3911 9.43227 13.642 9.20805 11.9754 9.59242C10.3088 9.9768 8.83455 10.9444 7.81891 12.3206C7.74038 12.4132 7.64217 12.4871 7.53145 12.5369C7.42074 12.5867 7.30029 12.6112 7.17891 12.6086Z" fill="#2B3344" />
                    <path d="M13.6008 25.4073C11.2682 25.4031 9.03232 24.4746 7.38291 22.8252C5.73351 21.1758 4.80501 18.9399 4.80078 16.6073C4.80308 16.0163 4.86202 15.427 4.97678 14.8473C4.99779 14.7422 5.03929 14.6423 5.09891 14.5533C5.15852 14.4643 5.23509 14.3879 5.32423 14.3285C5.41338 14.269 5.51335 14.2278 5.61846 14.207C5.72356 14.1862 5.83172 14.1863 5.93678 14.2073C6.04184 14.2283 6.14173 14.2698 6.23075 14.3294C6.31977 14.389 6.39617 14.4656 6.4556 14.5547C6.51503 14.6439 6.55632 14.7439 6.57711 14.849C6.59791 14.9541 6.59779 15.0622 6.57678 15.1673C6.37661 16.1531 6.38522 17.1699 6.60208 18.1522C6.81894 19.1345 7.23922 20.0604 7.83583 20.8703C8.43245 21.6803 9.19215 22.3562 10.066 22.8545C10.9398 23.3528 11.9084 23.6625 12.9092 23.7636C13.91 23.8647 14.921 23.755 15.8768 23.4414C16.8326 23.1279 17.7121 22.6176 18.4587 21.9434C19.2052 21.2691 19.8022 20.4459 20.2111 19.5269C20.62 18.6078 20.8318 17.6132 20.8328 16.6073C20.8344 15.4533 20.5543 14.3164 20.0168 13.2953C19.9664 13.2028 19.9346 13.1014 19.9234 12.9967C19.9122 12.8919 19.9217 12.786 19.9514 12.685C19.9812 12.584 20.0305 12.4898 20.0966 12.4078C20.1627 12.3259 20.2443 12.2577 20.3368 12.2073C20.4292 12.1569 20.5307 12.1251 20.6354 12.1139C20.7401 12.1027 20.846 12.1122 20.9471 12.142C21.0481 12.1717 21.1423 12.221 21.2242 12.2871C21.3062 12.3532 21.3744 12.4348 21.4248 12.5273C22.0779 13.7874 22.413 15.1881 22.4008 16.6073C22.3966 18.9399 21.4681 21.1758 19.8186 22.8252C18.1692 24.4746 15.9334 25.4031 13.6008 25.4073Z" fill="#2B3344" />
                    <path d="M13.6 30.2078C9.99306 30.2078 6.53384 28.775 3.98335 26.2245C1.43285 23.674 0 20.2148 0 16.6078C0 13.0009 1.43285 9.54168 3.98335 6.99118C6.53384 4.44069 9.99306 3.00783 13.6 3.00783C15.1145 3.00518 16.6185 3.25945 18.048 3.75983C18.1496 3.79335 18.2434 3.84691 18.3239 3.91732C18.4044 3.98773 18.47 4.07357 18.5168 4.16977C18.5635 4.26597 18.5905 4.37057 18.5962 4.47738C18.6018 4.58419 18.586 4.69105 18.5496 4.79164C18.5132 4.89222 18.457 4.98449 18.3844 5.06298C18.3117 5.14148 18.224 5.2046 18.1265 5.24863C18.0291 5.29265 17.9237 5.31668 17.8168 5.31929C17.7099 5.3219 17.6035 5.30305 17.504 5.26383C16.2491 4.82613 14.9291 4.60432 13.6 4.60783C11.2266 4.60783 8.90655 5.31162 6.93316 6.6302C4.95977 7.94877 3.4217 9.82292 2.51345 12.0156C1.60519 14.2083 1.36755 16.6211 1.83058 18.9489C2.2936 21.2767 3.43649 23.4149 5.11472 25.0931C6.79295 26.7713 8.93114 27.9142 11.2589 28.3773C13.5867 28.8403 15.9995 28.6026 18.1922 27.6944C20.3849 26.7861 22.2591 25.2481 23.5776 23.2747C24.8962 21.3013 25.6 18.9812 25.6 16.6078C25.6035 15.2788 25.3817 13.9587 24.944 12.7038C24.9048 12.6043 24.8859 12.4979 24.8885 12.391C24.8912 12.2841 24.9152 12.1788 24.9592 12.0813C25.0032 11.9838 25.0664 11.8961 25.1448 11.8235C25.2233 11.7508 25.3156 11.6946 25.4162 11.6583C25.5168 11.6219 25.6236 11.606 25.7305 11.6117C25.8373 11.6173 25.9419 11.6443 26.0381 11.6911C26.1343 11.7378 26.2201 11.8034 26.2905 11.8839C26.3609 11.9644 26.4145 12.0583 26.448 12.1598C26.9484 13.5893 27.2027 15.0933 27.2 16.6078C27.1958 20.2135 25.7616 23.6702 23.212 26.2198C20.6624 28.7694 17.2056 30.2036 13.6 30.2078Z" fill="#2B3344" />
                    <path d="M13.6032 17.4077C13.4983 17.409 13.3943 17.3883 13.2978 17.347C13.2014 17.3056 13.1146 17.2446 13.0432 17.1677C12.9667 17.0959 12.9057 17.0091 12.864 16.9128C12.8223 16.8165 12.8008 16.7127 12.8008 16.6077C12.8008 16.5028 12.8223 16.3989 12.864 16.3026C12.9057 16.2063 12.9667 16.1195 13.0432 16.0477L26.5152 2.57571C26.5888 2.50217 26.6761 2.44383 26.7721 2.40403C26.8682 2.36423 26.9712 2.34375 27.0752 2.34375C27.1792 2.34375 27.2822 2.36423 27.3783 2.40403C27.4744 2.44383 27.5617 2.50217 27.6352 2.57571C27.7088 2.64925 27.7671 2.73655 27.8069 2.83264C27.8467 2.92872 27.8672 3.03171 27.8672 3.13571C27.8672 3.23971 27.8467 3.34269 27.8069 3.43878C27.7671 3.53486 27.7088 3.62217 27.6352 3.69571L14.1632 17.1677C14.0918 17.2446 14.005 17.3056 13.9086 17.347C13.8122 17.3883 13.7081 17.409 13.6032 17.4077Z" fill="#2B3344" />
                    <path d="M24.9111 10.6235H24.7351L21.0551 9.77548C20.9089 9.74659 20.7745 9.67489 20.6691 9.56949C20.5637 9.46408 20.492 9.32972 20.4631 9.18348L19.6151 5.50348C19.5841 5.37325 19.5869 5.23724 19.6233 5.1084C19.6597 4.97956 19.7285 4.8622 19.8231 4.76748L24.3511 0.239484C24.4504 0.136626 24.576 0.0628771 24.7141 0.0262156C24.8523 -0.0104458 24.9979 -0.00862378 25.1351 0.0314841C25.273 0.0709338 25.3976 0.146693 25.4962 0.250837C25.5947 0.354982 25.6634 0.483684 25.6951 0.623484L26.4311 3.82348L29.6311 4.55948C29.8433 4.60616 30.0283 4.73521 30.1453 4.91825C30.2623 5.10128 30.3018 5.32331 30.2551 5.53548C30.2085 5.74766 30.0794 5.9326 29.8964 6.04962C29.7133 6.16664 29.4913 6.20616 29.2791 6.15948L25.5991 5.23148C25.4471 5.19646 25.3079 5.11937 25.1976 5.00903C25.0873 4.89869 25.0102 4.75955 24.9751 4.60748L24.4631 2.33548L21.2631 5.53548L21.9031 8.28748L24.6551 8.92748L26.7191 6.87948C26.8687 6.7329 27.0697 6.6508 27.2791 6.6508C27.4885 6.6508 27.6896 6.7329 27.8391 6.87948C27.9141 6.95385 27.9736 7.04234 28.0142 7.13982C28.0549 7.23731 28.0758 7.34187 28.0758 7.44748C28.0758 7.55309 28.0549 7.65766 28.0142 7.75515C27.9736 7.85263 27.9141 7.94111 27.8391 8.01548L25.4711 10.3835C25.3997 10.4603 25.313 10.5214 25.2165 10.5627C25.1201 10.6041 25.0161 10.6248 24.9111 10.6235Z" fill="#2B3344" />
                </svg>
,
                text: 'Your discount must work exactly as described on your offer page.',
            },
            {
                icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_826_16201" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                        <path d="M40 0H0V40H40V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_826_16201)">
                        <path d="M20 34.0625V5.3125M6.5625 11.875H33.4375M16.875 34.6875H23.125" stroke="#2B3344" stroke-width="2.1875" stroke-linecap="round" />
                        <path d="M10.7823 11.875L15.6652 22.9425C16.4832 24.7967 16.1805 26.9542 14.8837 28.5117C12.7499 31.0743 8.8147 31.0743 6.68095 28.5117C5.38417 26.9542 5.08145 24.7967 5.89948 22.9425L10.7823 11.875ZM29.5323 11.875L34.4151 22.9425C35.2333 24.7967 34.9304 26.9542 33.6336 28.5117C31.4998 31.0743 27.5647 31.0743 25.4309 28.5117C24.1342 26.9542 23.8314 24.7967 24.6495 22.9425L29.5323 11.875Z" stroke="#2B3344" stroke-width="2.1875" stroke-linejoin="round" />
                        <path d="M20 8.4375C20.8629 8.4375 21.5625 7.73794 21.5625 6.875C21.5625 6.01206 20.8629 5.3125 20 5.3125C19.1371 5.3125 18.4375 6.01206 18.4375 6.875C18.4375 7.73794 19.1371 8.4375 20 8.4375Z" fill="#2B3344" stroke="#2B3344" stroke-width="2.1875" />
                    </g>
                </svg>
,
                text: 'The offer must be equal to or better than your normal business discounts.',
            },
            {
                icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.668 13.332H23.3346" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 35V20" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 13.3333V5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M28.332 26.668H34.9987" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M31.668 20V5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M31.668 35.0013V26.668" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 23.332H11.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.33203 16.6667V5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.33203 34.9987V23.332" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>,
                text: 'You control the terms, limits, and conditions attached to each offer.',
            },
        ],
    },
    {
        title: 'Manage how every discount is issued, tracked, and made available.',
        items: [
            {
                icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33203C23.2336 3.33144 26.3975 4.2715 29.1061 6.03763C31.8148 7.80375 33.9512 10.3197 35.2549 13.2788C36.5587 16.2378 36.9735 19.5123 36.4488 22.703C35.9242 25.8937 34.4827 28.8629 32.3 31.2487" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 10V20L26.6667 23.3333" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.16536 14.793C3.63428 16.4074 3.35325 18.0936 3.33203 19.793" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.71484 26.668C5.65068 28.821 7.03081 30.7521 8.76484 32.3346" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.72656 8.72521C8.19163 8.21893 8.68758 7.7419 9.21156 7.29688" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.4062 35.6997C18.5624 37.1804 23.1361 36.9526 27.1246 35.0664" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>,
                text: 'Expired offers are automatically removed from the platform.',
            },
            {
                icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.7549 31.5781C20.5854 31.6908 19.4078 31.6908 18.2383 31.5781" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21.7549 8.42519C20.5855 8.31195 19.4078 8.3114 18.2383 8.42353" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M28.4531 10.457C29.4874 11.0136 30.4658 11.6683 31.3748 12.412" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M31.3748 27.5859C30.4658 28.3303 29.4875 28.9855 28.4531 29.5426" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.18985 22.1715C3.91344 21.6538 3.66204 21.1232 3.43652 20.5815C3.2972 20.2068 3.2972 19.7945 3.43652 19.4198C3.6609 18.8775 3.91119 18.3464 4.18652 17.8281" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M35.8086 17.8281C36.0856 18.3463 36.3376 18.8774 36.5636 19.4198C36.7029 19.7945 36.7029 20.2068 36.5636 20.5815C36.3375 21.1232 36.0856 21.6539 35.8086 22.1715" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.62109 12.4137C9.53004 11.6694 10.5084 11.0141 11.5428 10.457" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.5428 29.5426C10.5084 28.9855 9.53004 28.3303 8.62109 27.5859" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 25C22.7614 25 25 22.7614 25 20C25 17.2386 22.7614 15 20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
,
                text: 'Create one-time-use codes to control access and track redemptions.',
            },
            {
                icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 8.33203H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 31.668H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M23.332 5V11.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.668 28.332V34.9987" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M35 20H20" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M35.0013 31.668H26.668" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M34.9987 8.33203H23.332" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.332 16.668V23.3346" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.3333 20H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>,
                text: 'Offers are only available to verified business profiles on Orisuun.',
            },
        ],
    },
];

export const discountPortalGetInHeader = {
    title: 'How to Get In',
    subtitle: '3 easy steps',
    timeLabel: 'approx. 35 minutes',
    leftDecoration: `${staticUrl}/discount-portal-landing/how/end.png`,
    rightDecoration: `${staticUrl}/discount-portal-landing/how/start.png`,
    clockIcon: `${staticUrl}/discount-portal-landing/how/bi_clock-fill.svg`,
};

export const discountPortalGetInSteps = [
    {
        image: `${staticUrl}/discount-portal-landing/contact_us.png`,
        title: '1 Contact us about your interest',
        description:
            'We\'ll create an account for you and send the credentials, (which you\'ll have to change)',
    },
    {
        image: `${staticUrl}/discount-portal-landing/create1.png`,
        title: '2 Create your user profile',
        description: 'Create your user profile in order to participate on the platform.',
    },
    {
        image: `${staticUrl}/discount-portal-landing/select_link.png`,
        title: '3 Select the “Discount Portal” link',
        description:
            'Enter your discount codes into the Discount Portal, with each code separated by a comma.',
    },
];

export const discountPortalDreamTeamCta = {
    image: `${staticUrl}/discount-portal-landing/section_image.png`,
    imageAlt: 'Ready to build your dream team?',
};
