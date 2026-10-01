const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const CalendarImg = staticUrl + "/home/images/swiper/calender-img.png";
const PublicProfilesdImg = staticUrl + "/home/images/swiper/customized-public-profile-page.png";
const searchDataImg = staticUrl + "/home/images/swiper/database-search.png";
const feedDataImg = staticUrl + "/home/images/swiper/PersonalizedFeed.png";
const leaderboardDataImg = staticUrl + "/home/images/swiper/leadership-img.png";
const privateChatDataImg = staticUrl + "/home/images/swiper/pricatechat-img.png";
const teamFormingDataImg = staticUrl + "/home/images/swiper/teamforming-img.png";
const feedbackReviewDataImg = staticUrl + "/home/images/swiper/feedbackreview-img.png";
const discountClubPartnersImg = staticUrl + "/home/images/swiper/for-ouroartnersimg.png";
const Transactionimg = staticUrl + "/home/images/swiper/Transactions-img.png";
const matchimg = staticUrl + "/home/images/swiper/co-fundermatchimg.png";
const businesdevelopmentImg = staticUrl + "/home/images/swiper/co-founderimg.png";
const boardmemberimg = staticUrl + "/home/images/swiper/boardmemberimg.png";
const ExpertIcon = staticUrl + "/what we offer/expert.svg";
const TheStrategyConsultantsImg = staticUrl + "/what we offer/TheStrategyConsultants.png";
const PeopleIcon = staticUrl + "/what we offer/people.png";
const ProfessionalIcon = staticUrl + "/what we offer/professional.png";
const MentorIcon = staticUrl + "/what we offer/mentor.svg";
const PartnersIcon = staticUrl + "/what we offer/partner.svg";
const InvestorsIcon = staticUrl + "/what we offer/investor.png";
const BlackOwnedBusinessesIcon = staticUrl + "/userTypes/images/black-owned-businesses.png";


const publicProfileInnerData = [
  { id: 1, name: 'Ratings and reviews' },
  { id: 2, name: 'Business development opportunity posts' },
  { id: 3, name: 'Fundraising campaigns' },
  { id: 4, name: 'Pitch books, discounts, co-founder opportunities' },
];
const expert = [
  {
    id: 1,name: 'The key resource in taking an idea to its maximum potential.',
  },
  {
    id: 2,name: 'These are the clarifiers and elevators – they’re going to sharpen business ideas and plans with perspective and insight.',
  },
];
const managementAbilities = [
  {
    id: 1,
    name:
      'Research specific business issues and report back with detailed models, plans, and options.',
  },
  {
    id: 2,
    name:
      'Keep businesses ahead of the competition with strategic planning.',
  },
  // {
  //   id: 3,
  //   name:
  //     'Strategy Consultants can elect to be verified through our verification program.',
  // },
];
const people = [
  {
    id: 1,
    name:
      'They use the Search and Explore functions on our database to find Black-owned businesses to buy from',
  },
  {
    id: 2,
    name: 'They contribute to fundraising campaigns',
  },
  {
    id: 3,
    name: 'They provide valuable feedback to the businesses they visit',
  },
];
const professional = [
  {
    id: 1,
    name:
      'The professional on the platform are experienced operators. They are ready to help solve the problem of the day, month, or year.',
  },
  {
    id: 2,
    name:
      'These are the standardizers – they’re going make sure regular business functions are operating properly. They will lighten a load.',
  },
];
const mentor = [
  {
    id: 1,
    name: '*To be verified as a Mentor, one must have run, for at least one year, a profitable business with over $1M in revenue ',
  },
  {
    id: 2,
    name: '*High-level executives at multinational corporations also qualify to serve as mentors.',
  },
];
const mentorsRole = [
  {
    id: 1,
    name:
      '*These are the teachers – they’re going to help our business members avoid easily-made mistakes.',
  },
  {
    id: 2,
    name:
      'Mentors are meant to guide on business decisions. To foster deep knowledge of a business’s history and trajectory, mentorships should be an ongoing relationship that increase in value over time.',
  },
];
const partner = [
  {
    id: 1,
    name:
      "Our partner are here to support on an institutional level. They're matching campaign donations, they're bringing our business members into their organization as a vendors, and they're giving you access to all of the professional talent at their firms.",
  },
  {
    id: 2,
    name:
      'They are also the cost cutters - our Discount Portal is full of special offers from our partner, who are eager to help our business members grow.',
  },
];
const investor = [
  {
    id: 1,
    name:
      'These are the revenue growers – they’re going to provide growth capital and set our business members up for success.',
  },
];
const blackRole = [
  {
    id: 1,
    name: 'The platform is designed to help these businesses find the resources to expand and scale.',
  },
];

export const calendarData = {
  title: 'Calendar',
  desc1:
    'Stay up-to-date on all of the Black business events, conferences, meetups, webinars, workshops, grant deadlines, competitions, and grand openings in your neighborhood and around the world.',
  desc2:
    'Add the events to your personal calendar or keep track of them on the platform.',
  imgTitle: 'Calendar', //TODO: remove this from all the objs
  imgSrc: CalendarImg,
};
export const publicProfilesData = {
  title: 'Customizable Public Profile Page',
  desc1:
    'Increase your web presence with a beautiful, easy-to-follow profile designed to show potential clients and customers—on and off our site—what you can offer. Pages include:',
  imgTitle: 'Public Profile',
  imgSrc: PublicProfilesdImg,
  innerData: publicProfileInnerData,
};
export const searchData = {
  title: 'Database Search & Explore Functionality',
  desc1:
    'Find exactly what you need or want around the globe – search our database of businesses, experts, professionals, and investors by industry, country, region, city, and many other parameters.',
  desc2:
    'Our powerful Explore tool enables members to zero in on exact matches using tags, keywords, location, and a robust set of filter options.',
  imgTitle: 'Database Search',
  imgSrc: searchDataImg,
};
export const feedData = {
  title: 'Personalized Feed',
  desc1:
    'Stay on top of site activity as it happens, from new members to new discounts, fundraising campaigns, and leaderboard changes.',
  desc2: 'Check and add events to the Global Black Business Events Calendar.',
  desc3:
    'Stay up-to-date on the latest news from around the world most relevant to Black-owned businesses and the community around them.',
  imgTitle: 'Personalized Feed',
  imgSrc: feedDataImg,
};
export const leaderboardData = {
  title: 'Rise Up Our Local, Regional, and Global Leaderboards',
  desc1:
    'Demonstrate your commitment to supporting Black-owned businesses by climbing our leaderboards for most reviews, received or given, most conversations, most money raised, most connections or favourites, and so much more.',
  desc2:
    'Show off your contributions and make sure your dedication is recognized.',
  imgTitle: 'Leaderboards',
  imgSrc: leaderboardDataImg
};
/***************Collab*****************/
export const privateChatData = {
  title: 'Private Chat',
  desc1:
    'We have developed a secure messaging system within the platform, so you don’t have to take business off the platform. Chat one-on-one with mentors, investors, and business members, or join/create group chats.',
  desc2: 'Members can use the messaging system to send files of all types.',
  imgTitle: 'Private Chat',
  imgSrc: privateChatDataImg,
};
export const teamFormingData = {
  title: 'Team Forming',
  desc1: 'Members can form teams to conduct business as a unit.',
  desc2:
    'Members who have been invited to a team can join and leave that team as they see fit.',
  desc3:
    'Teams can create their own profiles to promote those activities that will be conducted as a team.',
  imgTitle: 'Team Forming',
  imgSrc: teamFormingDataImg,
};
export const feedbackReviewData = {
  title: 'Write Reviews and Share Your Experience',
  desc1:
    'Share your experiences with Black-owned businesses by writing reviews on Orisuun.',
  desc2:
    'Your feedback helps other users make informed decisions and supports the businesses in improving their services and products.',
  desc3:
    'Tell businesses about your experience with public or private ratings and reviews.',
  imgTitle: 'Write Reviews and Share Your Experience',
  imgSrc: feedbackReviewDataImg,
};
/***************Grow*****************/
export const discountClubPartnersData = {
  title: 'For our Partners',
  desc1:
    'The Discount Portal offers a warm introduction to new potential clients and customers, where you can provide a meaningful discount to start a new, lasting client relationship with growing Black-owned businesses.',
  linkText: 'Learn More >',
  linkHref: '/discount',
  imgTitle: 'For our Partners',
  imgSrc: discountClubPartnersImg,
};

/**************Dobusiness*******************/
export const BoardmemberData = {
  title: 'Board Member Matching',
  desc1:
    'Take your company’s governance and stability up a notch. Bringing on the right board member who is aligned and properly motivated can greatly increase the longevity, stability, and long-term prospects of a business.',
  desc2:
    'Our board member matching system allows members to create easily searchable posts designed to introduce your company to a world of exceptionally talented potential board members that your business would not otherwise have access to.',
  imgTitle: 'Board Member Matching',
  imgSrc: boardmemberimg,
};
export const BusinessdevelopmentData = {
  title: 'Business Development Opportunity Matching',
  desc1:
    'Members can create searchable posts showcasing the business development opportunities that they can facilitate for others and the business development opportunities they are seeking themselves.',
  desc2:
    'Other interested members can find these posts through search or on the posting member’s profile and match with it – indicating that they are a viable counterparty. This means they can facilitate the business development opportunity the posting member is seeking, or they are seeking a business development opportunity that the posting member can facilitate.',
  imgTitle: 'Business Development Opportunity Matching',
  imgSrc: businesdevelopmentImg,
};
export const CofounderData = {
  title: 'Co-founder Match',
  desc1:
    'Find the perfect people to propel your business or idea into its next phase, with precision and confidence.',
  desc2:
    'Our co-founder matching system allows members to create easily searchable posts designed to fill specific gaps in a leadership team’s domain coverage.',
  imgTitle: 'Co-founder Match',
  imgSrc: matchimg,
};
export const TransactionsData = {
  title: 'Escrow-based Peer-to-Peer Transactions',
  desc1:
    'We offer an in-platform payment system that allows members to do business on the site.',
  desc2:
    'Orisuun operates as an ‘escrow agent’ to ensure payment is made only after services or goods have been received. We also provide human-run dispute resolution.',
  imgTitle: 'Escrow-based Peer-to-Peer Transactions',
  imgSrc: Transactionimg,
};
/***********access********************/
export const ExpertsData = {
  title: 'The Experts',
  desc1:
    'Those recognized and credentialed individuals (or small organizations) who can confidently claim to be among the top of their field.',
  title2: 'Role on Orisuun',
  imgTitle: 'The Experts',
  imgSrc: ExpertIcon,
  innerData: expert,
  padding : 'pb-12',
  justifyStart: "justify-start",
};
export const StrategyConsultantsData = {
  title: 'The Strategy Consultants',
  desc1:
    'Those accomplished and practicing Strategy Consultants currently or recently employed at a national-level management consulting firm. Students at select graduate-level business schools also qualify.',
  title2: 'Role on Orisuun',
  imgTitle: 'The Strategy Consultants',
  imgSrc: TheStrategyConsultantsImg,
  innerData: managementAbilities,
  justifyStart: 'justify-start',
};
export const PeopleData = {
  title: 'The People',
  desc1:
    'They are the customers, clients, and advocates for our Black-owned business members.',
  title2: 'Role on Orisuun',
  imgSrc: PeopleIcon,
  innerData: people,
  justifyStart: "justify-start",
};
export const ProfessionalsData = {
  title: 'The Professionals',
  desc1:
    'Those currently licensed and practicing in regulated fields such as law, accounting, architecture, information technology, engineering, finance, journalism, marketing, and many others.',
  title2: 'Role on Orisuun',
  imgSrc: ProfessionalIcon,
  innerData: professional,
  row: 'md:flex-row-reverse',
};

export const MentorsData = {
  title: 'Mentors',
  desc1:
    'Those accomplished business people who have succeeded in starting or running a business.',
  title2: 'Role on Orisuun',
  imgSrc: MentorIcon,
  innerData2: mentor,
  innerData: mentorsRole,
  row: 'md:flex-row-reverse',
};

export const PartnersData = {
  title: 'The Partners',
  desc1:
    'Large and multinational organizations ready to collab, do business, and help our members grow.',
  title2: 'Role on Orisuun',
  imgSrc: PartnersIcon,
  innerData: partner,
  row: 'md:flex-row-reverse',
};
export const InvestorsData = {
  title: 'The Investors',
  desc1:
    'Those established and professional investors and institutions actively searching for impactful investment opportunities.',
  title2: 'Role on Orisuun',
  imgSrc: InvestorsIcon,
  innerData: investor,
};

export const BlackOwnedBusinessesData = {
  title: 'The Black-Owned Businesses',
  desc1:
    'Those privately-owned businesses around the world with at least 25% Black ownership. These businesses may operate in any industry and be any size.',
  title2: 'Role on Orisuun',
  imgSrc: BlackOwnedBusinessesIcon,
  innerData: blackRole,
  row: 'md:flex-row-reverse',
};
 