const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const discountFAQ = [
    {
        title: 'What if we don’t have an online system?',
        content:
            'Our Partners have the option of designating their discounts as in-store, online, or both. For our partners who do not operate online, they must select the “in-store only” option for their incentives, so there is no confusion for our members. ',
    },
    {
        title:
            'Who is the discount portal for / Who will have access to the discounts?',
        content:
            'This discounts on the Discount Portal are available only to verified business owners. To access the discounts, a member must have business profile and be verified – meaning they have gone through the verification process, where they must submit documentation to \n' +
            'prove their identity, ownership, and the claims on their profile.',
    },
    {
        title: 'What if we don’t have a discount function on our checkout?\n,',
        content:
            'This Discount Portal is discount-code-based. To participate, you will need some way –\n' +
            'whether in-store or online – to accept a code in exchange for a discounted price. ',
    },
    {
        title: 'What other ways can we help?',
        content:
            'If you would like to help support Black-owned businesses as a Partner, but don’t want to use the Discount Portal, we have a few other opportunities for you to do so. For instance, you can find vendors in our database, match fundraising donations, and encourage your employees to join our community to do the same. ',
    },
    {
        title: 'What if we need to change a parameter of our discount?',
        content:
            'During the course of an offered incentive, parameters cannot be changed. ',
    },
    {
        title: 'Are the discounts limited to only Black business owners?',
        content:
            'Absolutely not. While our site is designed to promote Black-owned businesses and support their growth, all business owners are enthusiastically welcome on our site. There is no functionality or feature across our whole site that is restricted to any race, nationality, or ethnicity – and it will always be that way. ',
    },
];
export const orderList = [
    'The discounts/incentives must work as you have described them on the site.',
    'Any discount/incentive must be in addition to or equal to any discounts/incentives offered by you in the normal course of business.',
    'The full terms of the discounts/incentives posted on our site by you are controlling.',
];

export const unorderedList = [
    'Your offer will be removed from our site upon the expiry date.',
    'We provide the option to offer one-time-use codes.',
    'You can set the limit of how many discounts can be issued to a user.',
    'Your discounts/ incentives are available to our verified business profiles only.',
];


interface whyPointType {
    image: string;
    title: string;
    descriptionPoints: Array<string>;
}
export const whyData: Array<whyPointType> = [
    {
        image: `${staticUrl}/discount-portal/partners_icon.png`,
        title: 'Reach the Right Audience',
        descriptionPoints: [
            'Our platform is home to a highly engaged community.',
            'Tap into a pool of potential customers who are actively seeking savings and are likely to become repeat buyers.',
        ],
    },
    {
        image: `${staticUrl}/discount-portal/eye_icon.png`,
        title: 'Boost Your Visibility',
        descriptionPoints: [
            'Gain exposure to a targeted audience without the need for expensive advertising campaigns.',
            'Our platform ensures that your discounts are highlighted to users who match your ideal customer profile.',
        ],
    },
    {
        image: `${staticUrl}/discount-portal/solid_sales_icon.png`,
        title: 'Drive Traffic and Sales',
        descriptionPoints: [
            'Offer compelling discounts that drive traffic to your business, whether it’s online or in-store.',
            'Watch as your sales, customer base, and retention increase with each incentive.',
        ],
    },
    {
        image: `${staticUrl}/discount-portal/people_icon.png`,
        title: 'Community Building',
        descriptionPoints: [
            'Stand out from the competition by joining an exclusive network that fosters a sense of belonging, support, and community.',
            'Play a vital role in the building of a new global business community.',
        ],
    },
    {
        image: `${staticUrl}/discount-portal/gears_icon.png`,
        title: 'Effective Integration',
        descriptionPoints: [
            'Our platform and the Discount Portal are designed to seamlessly work with your existing discount systems.',
            'Plus, our unique code system will allow you to track usage and effectiveness from start to finish.',
        ],
    },
    {
        image: `${staticUrl}/discount-portal/income_icon.png`,
        title: 'Cost-Effective Marketing',
        descriptionPoints: [
            'Maximize your marketing ROI by reaching a targeted audience with no upfront costs. This service is free.',
            'Let your next cohort of loyal, repeat customers come to you with a warm introduction from Orisuun.',
        ],
    },
];
