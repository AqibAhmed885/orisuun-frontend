const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const pricingIcon = (fileName) => `${staticUrl}/icons/pricing/${fileName}`;

const Public = pricingIcon('public.svg');
const Team = pricingIcon('team.svg');
const chat = pricingIcon('chat.svg');
const donate = pricingIcon('donate.svg');
const invest = pricingIcon('invest.svg');
const database = pricingIcon('database.svg');
const business = pricingIcon('business.svg');
const peer = pricingIcon('peer.svg');
const cofounder = pricingIcon('cofounder.svg');
const director = pricingIcon('director.svg');
const fundraising = pricingIcon('fundraising.svg');
const major = pricingIcon('major.svg');
const mdicompass = pricingIcon('mdi_compass.svg');
const searchfilter = pricingIcon('search-filter.svg');
const socialleaderboard = pricingIcon('social-leaderboard.svg');
const personalisedfeed = pricingIcon('personalisedfeed.svg');
const ProfilePage = pricingIcon('profile-page.svg');
const formteam = pricingIcon('formteam.svg');
const discuntclub = pricingIcon('discuntclub.svg');
const feedbackreview = pricingIcon('feedback-review.svg');
const verified = pricingIcon('verified.svg');
const businessHandshake = pricingIcon('business-handshake.svg');
const createaccount = pricingIcon('create-account.svg');
const btc = pricingIcon('btc.svg');
const createcrowfunding = pricingIcon('create-crowfunding.svg');
const createcrowfundingreward = pricingIcon('create-crowfunding-reward.svg');
const sponser = pricingIcon('sponser.svg');
const contribute = pricingIcon('contribute.svg');
const crowfundingcontribution = pricingIcon('crowfunding-contribution.svg');
const community = pricingIcon('community.svg');

export const basicPlanDetails = [
  {
    type: 'Black-owned Businesses',
    functions: [
      {
        icon: invest, label:
          <span>Eligible for <strong>$1,000 Weekly Giveaway</strong> </span>
      },
      {
        icon: Public, label:
          <span> <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business</span>
      },
      {
        icon: formteam, label:
          <span> Team Forming to <strong>Conduct Business as a Unit</strong></span>
      },
      {
        icon: chat, label:
          <span> <strong>Direct Messaging</strong> with Customers, Mentors, Investors</span>
      },
      {
        icon: community, label:
          <span> <strong>Community and Universal Chat Access</strong> to Engage and Learn from Relevant Communities</span>
      },
      {
        icon: crowfundingcontribution, label:
          <span> Participate in <strong>Crowdfunding Campaigns</strong> to Support other Black-owned Businesses</span>
      },
      {
        icon: searchfilter, label:
          <span> <strong>Access to Investors, Mentors, and Experts</strong> on the Platform Just for You</span>
      },
      {
        icon: database, label:
          <span> <strong>Track Grants, Accelerators, and Financing Programs</strong> with Reminders and Status Tracking</span>
      },
    ],
  },
  {
    type: 'Experts',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Mentors',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Investors',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Professionals',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Strategy Consultants',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Partners',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
    ],
  }
];


export const partnerPlanDetails = [
  {
    icon: Public,
    label: 'Customizable Public Profiles With Personal Web Address',
  },
  { icon: Team, label: 'Team Forming' },
  { icon: chat, label: 'Private Chat' },
  { icon: donate, label: 'Donate to Black-owned Businesses' },
  {
    icon: invest,
    label: 'Invest in Black-owned Businesses',
    coming: 'Coming second quarter of 2025',
  },
  {
    icon: database,
    label: 'Sophisticated and Comprehensive Profile Database',
  },
  {
    icon: business,
    label: 'Matching System for Business Development Opportunities',
  },
  { icon: peer, label: 'Escrow Peer-to-peer Transactions' },
  { icon: cofounder, label: 'Co-Founder Matching' },
  { icon: director, label: 'Board Director Matching' },
  { icon: fundraising, label: 'Match Fundraising Campaigns' },
  {
    icon: major,
    label: 'Provide B2B Discounts',
  },
];

export const premiumPlanDetails = [
  {
    type: 'Black-owned Businesses',
    // Structured sections for display in popovers and pricing pages
    sections: [
      {
        title: 'Visibility & Discovery',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Get Discovered by Customers</strong> Searching Locally and Globally
              </span>
          },
        ],
      },
      {
        title: 'Customers & Revenue (Discount Club)',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Save on Business Expenses</strong> with Major Vendor Discounts
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save with Exclusive Offers</strong> from Other Business Members
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                <strong>Offer Your Own Discount</strong> to Attract and Retain Loyal Customers
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage and Learn from Relevant Communities
              </span>
          },
          {
            icon: searchfilter,
            label:
              <span>
                <strong>Access to Investors, Mentors, and Experts</strong> on the Platform Just for You
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
          {
            icon: business,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
      {
        title: 'Funding & Transactions',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Participate in<strong> Crowdfunding Campaigns</strong> to Support other Black-owned Businesses
              </span>
          },
          {
            icon: fundraising,
            label:
              <span>
                Create Crowdfunding Campaignsto <strong> Raise Money for Your Projects</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools & Opportunity Management',
        functions: [
          {
            icon: database,
            label:
              <span>
                <strong>Track Grants, Accelerators, and Financing Programs </strong> with Reminders and Status Tracking
              </span>
          },
        ],
      },
      {
        title: 'Additional Benefits',
        functions: [
          {
            icon: invest,
            label:
              <span>
                Eligible for <strong> $1,000 Weekly Giveaway</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Mentors',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools for Work',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Experts',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools for Work',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Investors',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools for Work',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Professionals',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools for Work',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Strategy Consultants',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools for Work',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
    ],
  },
  {
    type: 'Partners',
    sections: [
      {
        title: 'Build Your Presence',
        functions: [
          {
            icon: Public,
            label:
              <span>
                <strong>Customizable Public Profiles</strong> With Personal URL (orisuun.com/yourname) to Showcase Your Business
              </span>
          },
          {
            icon: verified,
            label:
              <span>
                <strong>Verified Account Status</strong>  to Build Trust and Credibility
              </span>
          },
          {
            icon: mdicompass,
            label:
              <span>
                <strong>Grow Your Following</strong>   as Members Discover and Engage
              </span>
          },
        ],
      },
      {
        title: 'Find Businesses & Opportunity',
        functions: [
          {
            icon: discuntclub,
            label:
              <span>
                <strong>Robust Search and Filter Tools </strong>  to Find Black-Owned Businesses Locally and Globally
              </span>
          },
          {
            icon: btc,
            label:
              <span>
                <strong>Save on Business Expenses</strong>  with Major Vendor Discounts
              </span>
          },
          {
            icon: sponser,
            label:
              <span>
                Contribute to<strong> Crowdfunding Campaigns</strong> and earn rewards
              </span>
          },
        ],
      },
      {
        title: 'Connections & Collaboration',
        functions: [
          {
            icon: chat,
            label:
              <span>
                <strong>Direct Messaging</strong> with Customers, Mentors, Investors
              </span>
          },
          {
            icon: community,
            label:
              <span>
                <strong>Community and Universal Chat Access</strong> to Engage, Share Insights and Learn
              </span>
          },
          {
            icon: formteam,
            label:
              <span>
                Team Forming to<strong> Conduct Business as a Unit</strong>
              </span>
          },
        ],
      },
      {
        title: 'Tools for Work',
        functions: [
          {
            icon: peer,
            label:
              <span>
                <strong>Transact Securely</strong> with Built-in Escrow and Dispute Resolution
              </span>
          },
          {
            icon: crowfundingcontribution,
            label:
              <span>
                Find and Post <strong> Business Development Opportunities</strong>
              </span>
          },
        ],
      },
    ],
  },
];

export const accessTo = [
  'Experts',
  'Professionals',
  'Strategy Consultants',
  'Mentors',
  'Investors',
  'Potential Clients and Customers',
];

export const pricingFAQ = [
  {
    title: 'What kind of support and guidance can I expect from Orisuun?',
    content: `Our platform and systems are quite intuitive. We have all of our forms and functions well-labeled and explained. However, if there are any issues or questions about the functionality of our site, please do not hesitate to reach out to us at [help@orisuun.com](help@orisuun.com). We will get a response to you in under 24 hours.`,
  },
  {
    title: 'How do you protect members data?',
    content:
      "Orisuun has a strong data protection culture and practice. We respect our members and their privacy, and therefore take efforts to remove data, documents, and information directly provided to us when they are no longer in use. Orisuun's practice is to delete member data within 90 days of account deletion. It is also our practice to delete uploaded verification documents within 90 days of use. For a complete and controlling explanation of our privacy policy, please visit our privacy policy page. \n \n As a matter of data hygiene, we ask that you not send us sensitive documents that we do not ask for and that any documents that you do send to us have redacted any sensitive personal information that we do not need(e.g.social security numbers, etc.). \n \n For payments on the site, we partner with Stripe.Your credit card and other payment data is not stored by Orisuun.Please visit Stripe to learn more about their data policies.",
  },
  {
    title: 'Can I cancel my subscription at any time?',
    content:
      'Absolutely, members can cancel at any time. They simply need go to the "Billing" section of "Settings" on their account.',
  },
  {
    title: 'Which payment methods do you accept?',
    content:
      'We accept nearly all credit and debit card networks, including Visa, Mastercard, Maestro, American Express, Diners Club, Discover, JCP, Accel, Union Pay, Star, NYCE, and Pulse. \n \n For your convenience, we also accept Apple Pay, Google Pay, and PayPal across our site.',
  },
  {
    title: 'What documents are required for verification?',
    content: `Businesses that seek verification will need to provide documentation of ownership (including tax return schedules), formation documents, bylaws, and a certificate of good standing (among other ad hoc documents as any case my require). \n \n We also require proof of certain claims on a profile, such as affiliations, certifications, and recognition. Some members may be asked to prove affiliation through possession of an associated email address. Some members will be required to participate in a video call for verification.\n 
Our partners are verified as a part of their onboarding process.`,
  },
  // {
  //   title1: 'Does the Orisuun platform have a free trial',
  //   content1:
  //     'Orisuun does not have a free trial or a free version. However, our prices are extremely accessible. Be assured that our subscription plans pay for themselves several times over.',
  // },
];

export const PricingData = [
  {
    title: 'Discovery',
    details: [
      {
        icon: Public,
        label: 'Customizable Public Profile Page',
        description:
          'Increase your web presence with beautiful, easy-to-follow webpage (personalized web address) ',
      },
      {
        icon: ProfilePage,
        label: 'Customizable Members Only Profile Page ',
        description:
          'Share your credentials, accomplishments, and pitch books with collaborators and investors  ',
      },
      {
        icon: mdicompass,
        label: 'Database Explore Functionality',
        description:
          'Explore our databases of businesses, mentors, and investors by country, city, or industry',
      },
      {
        icon: searchfilter,
        label: 'Robust Search & Filter Functionality  ',
        description:
          'Find businesses, professionals, experts, and consultants in your neighborhood and around the world',
      },
      {
        icon: socialleaderboard,
        label: 'Leaderboard and Badges',
        description:
          "Compete with all of Orisuun's members for the number one spot in reviews, convos, and investments",
      },
      {
        icon: personalisedfeed,
        label: 'Personalized Feed ',
        description:
          'Keep track of all platform activity and Black business events and news around the world ',
      },
    ],
  },
  {
    title: 'Collaboration and Support',
    details: [
      {
        icon: chat,
        label: 'Chat',
        description:
          'Take care of business right on the platform with our private chat. Chat one-on-one or in groups.',
      },
      {
        icon: formteam,
        label: 'Form Teams',
        description:
          'Members can form teams to conduct business as a unit. Teams can create their own profile page.',
      },
      {
        icon: feedbackreview,
        label: 'Feedback and Reviews',
        description:
          'Give and receive public or private reviews from members you have interacted with.',
      },
      /*****not for Black-Owned Business only*********/
      {
        icon: verified,
        label: 'Verified Account* (Optional)',
        description:
          'Increase your credibility and visibility with a verified account. Verifications are done by humans (*$99/lifetime)',
      },
      //UNIVERSal chat 
      {
        icon: businessHandshake,
        label: 'Business Handshake*',
        description:
          'Seal the deal with a virtual handshake to signify a formal agreement between two parties (*requires verified account).',
      },
      //community chat
      {
        icon: createaccount,
        label: 'Create Account for Others*',
        description:
          'Create accounts for your team members, clients, or portfolio companies to manage on your behalf (*requires verified account).',
      },
      /**************/
    ],
  },
  {
    title: 'Growth',
    details: [
      /*************for investor , mentor , Strategy Consultants , Experts , Black-Owned Business*******************/
      {
        icon: discuntclub,
        label: 'Discount Club - Partner to Business',
        description:
          'Lower your costs with exclusive discounts from popular vendors across all industries.',
      },
      /*************for professional*******************/
      {
        icon: discuntclub,
        label: 'Discount Club - Partner to Customer',
        description:
          'Lower your costs with exclusive disocunts from popular vendors across all industries.',
      },
      /*************for advocate*******************/
      {
        icon: discuntclub,
        label: 'Discount Club - Business to Customer',
        description:
          'Find and your favourite Black-owned businesses with individualized discount codes, just for you',
      },
      /*************for Black-Owned Business*******************/
      {
        icon: Public,
        label: 'Discount Club - Business to Business',
        description:
          'Lower your costs with exclusive discounts from business members across all industries.',
      },
      {
        icon: Public,
        label: 'Create Discounts - Business to Business*',
        description:
          'Incentivize new or existing customers to buy from you with individualized discounts from your business (*requires verification: $99/lifetime).',
      },
      {
        icon: Public,
        label: 'Create Discounts - Business to Customer*',
        description:
          'Incentivize new or existing customers to buy from you with individualized discounts from your business (*requires verification: $99/lifetime).',
      },
      {
        icon: Public,
        label: 'Create Crowdfunding Campaigns*',
        description:
          'Launch a campaign to raise funds for new equipment, expansion, or new products (*requires verification: $99/lifetime).',
      },
      {
        icon: Public,
        label: 'Create Crowdfunding Rewards*',
        description:
          'Incentivize contributions for your crowdfunding campaign with everything from swag to free products (*requires verification: $99/lifetime).',
      },
      /*************for Black-Owned Business*******************/
      {
        icon: sponser,
        label: 'Sponsor Crowdfunding Campaigns',
        description:
          'Match fundraising donations one-to-one or higher for a day, a week, or as long as you would like.',
      },
      {
        icon: contribute,
        label: 'Contribute to Crowdfunding Campaigns',
        description:
          'Help businesses reach their fundraising goals by making on-time donations.',
      },
      {
        icon: crowfundingcontribution,
        label: 'Crowdfunding Rewards Contributions',
        description:
          'Get rewarded for your contribution to a crowdfunding campaign with everything from swag to free products.',
      },
    ],
  },
  {
    title: 'Doing Business',
    details: [
      {
        icon: Public,
        label: 'Transactions and Escrow',
        description:
          'In-platform peer-to-peer payment system, so you can do business. Orisun acts as an “escrow agent” to ensure payment is made only after goods or services are received.',
      },
      {
        icon: Public,
        label: 'Business Development Matching',
        description:
          'Create searchable posts showcasing the business development opportunities you can facilitate or are seeking.',
      },
      {
        icon: Public,
        label: 'Co-founder Matching',
        description:
          'Create searchable posts showcasing the co-founder opportunities you can facilitate or are seeking.',
      },
      {
        icon: Public,
        label: 'Board Member Matching',
        description:
          'Create searchable posts for your new board member to find and match with. Take your business governance and stability up a notch.',
      },
    ],
  },
  {
    title: 'Plus More',
    details: [
      {
        icon: Public,
        label: 'Global Black Business News',
        description:
          'Get the latest and most relevant news for Black-owned businesses from around the world directly in your feed.',
      },
      {
        icon: Public,
        label: 'Favourite and Save',
        description:
          'Save all of your favorite members in one place to find them quickly.',
      },
      {
        icon: Public,
        label: 'Global Black Business Calendar',
        description:
          'Stay up-to-date on all of the Black business events, conferences, meetups, webinars, and grand openings in your neighborhood and around the world.',
      },
      {
        icon: Public,
        label: 'Connections & Follow',
        description:
          'Make real connections and follow businesses or people to stay up to date with their progress and latest happenings.',
      },
    ],
  },
];
