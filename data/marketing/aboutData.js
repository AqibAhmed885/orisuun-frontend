// export experts from '../../'

// /about/icons/.svg
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const helpYou = [
  {
    icon: `${staticUrl}/about/icons/help1.svg`,
    title: 'For Black-Owned businesses',
    description: 'We help you create your own opportunities',
    help_title: 'Access to:',
    helps: [
      {
        icon: `${staticUrl}/about/icons/experts.svg`,
        help: 'Experts',
      },
      {
        icon: `${staticUrl}/about/icons/mentorship.svg`,
        help: 'Meaningful mentorship',
      },
      {
        icon: `${staticUrl}/about/icons/consultants.svg`,
        help: 'Strategy consultants',
      },
      {
        icon: `${staticUrl}/about/icons/professionals.svg`,
        help: 'Professionals',
      },
      {
        icon: `${staticUrl}/about/icons/financing.svg`,
        help: 'Robust financing capabilities',
      },
      {
        icon: `${staticUrl}/about/icons/resourceful.svg`,
        help: 'Resourceful connections',
      },
      {
        icon: `${staticUrl}/about/icons/pertinent.svg`,
        help: 'Pertinent business development opportunities',
      },
      {
        icon: `${staticUrl}/about/icons/vendor.svg`,
        help: 'Vendor Discounts',
      },
      {
        icon: `${staticUrl}/about/icons/new.svg`,
        help: 'New clients and customers',
      },
      {
        icon: `${staticUrl}/about/icons/market.svg`,
        help: 'Relevant market data',
      },
    ],
  },
  {
    icon: `${staticUrl}/about/icons/help2.svg`,
    title: 'For those, who wants to support',
    description: 'Help businesses to develop and improve',
    help_title: 'You will be able to:',
    helps: [
      {
        icon: `${staticUrl}/about/icons/advise.svg`,
        help: 'Advise',
      },
      {
        icon: `${staticUrl}/about/icons/investment.svg`,
        help: 'Participate in a robust investment system',
      },
      {
        icon: `${staticUrl}/about/icons/effective.svg`,
        help: 'Give through a transparent and highly effective system',
      },
      {
        icon: `${staticUrl}/about/icons/mentor.svg`,
        help: 'Mentor',
      },
      {
        icon: `${staticUrl}/about/icons/expansions.svg`,
        help: 'Facilitate expansions',
      },
      {
        icon: `${staticUrl}/about/icons/find.svg`,
        help: 'Find Vendors',
      },
      {
        icon: `${staticUrl}/about/icons/findNew.svg`,
        help: 'Find new businesses to support',
      },
      {
        icon: `${staticUrl}/about/icons/vendor.svg`,
        help: 'Offer discounts for new customers',
      },
      {
        icon: `${staticUrl}/about/icons/new.svg`,
        help: 'Find new clients and customers',
      },
      {
        icon: `${staticUrl}/about/icons/market.svg`,
        help: 'Get relevant market data',
      },
    ],
  },
];
export const AllIconsImages = [
  {
    src: `${staticUrl}/about/scroll/investor.png`,
    name: 'Investor',
  },
  {
    src: `${staticUrl}/about/scroll/people.png`,
    name: 'The People:\n' + 'Customers, Clients, & Advocate',
  },
  {
    src: `${staticUrl}/about/scroll/partner.png`,
    name: 'Partner',
  },
  {
    src: `${staticUrl}/about/scroll/consultants.png`,
    name: 'Consultants',
  },
  {
    src: `${staticUrl}/about/scroll/mentor.png`,
    name: 'Mentor',
  },
  {
    src: `${staticUrl}/about/scroll/professional.png`,
    name: 'Professional',
  },
  {
    src: `${staticUrl}/about/scroll/expert.png`,
    name: 'Expert',
  },
];

export const scrollRanges = [
  {
    min: 0.05,
    max: 0.07,
  },
  {
    min: 0.07,
    max: 0.09,
  },
  {
    min: 0.09,
    max: 0.11,
  },
  {
    min: 0.11,
    max: 0.13,
  },
  {
    min: 0.13,
    max: 0.15,
  },
  {
    min: 0.15,
    max: 0.17,
  },
  {
    min: 0.17,
    max: 0.2,
  },
];

export const visibleRange = {
  min: 0,
  max: 0.2,
};
