const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const topListingData = [
  {
    id: 1,
    header: 'Business and partner',
    email: 'partner@orisuun.com',
    paragraph: 'For business collaborations and partnership opportunities',
    svg: `${staticUrl}/contact-svgs/business.svg`,
  },
  {
    id: 2,
    header: 'General inquiries',
    email: 'hello@orisuun.com',
    paragraph: 'For any general questions or information requests',
    svg: `${staticUrl}/contact-svgs/general.svg`,
  },
  {
    id: 3,
    header: 'Media',
    email: 'media@orisuun.com',
    paragraph: 'For press, media, interview requests, and public relations',
    svg: `${staticUrl}/contact-svgs/media.svg`,
  },
  {
    id: 4,
    header: 'Career opportunities',
    email: 'careers@orisuun.com',
    paragraph: 'For job openings and career related questions',
    svg: `${staticUrl}/contact-svgs/career.svg`,
  },
  {
    id: 5,
    header: 'Volunteer opportunities',
    email: 'volunteers@orisuun.com',
    paragraph: 'For information and applications related to volunteer work',
    svg: `${staticUrl}/contact-svgs/volunteer.svg`,
  },
  {
    id: 6,
    header: 'Support',
    email: 'help@orisuun.com',
    paragraph: 'Customer support, assistance, and service-related questions',
    svg: `${staticUrl}/contact-svgs/support.svg`,
  },
];
