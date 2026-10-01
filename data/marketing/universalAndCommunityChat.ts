const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export type UniversalCommunityChatHeroData = {
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
};

export type UniversalCommunityChatWhyPoint = {
  path: string;
  title: string;
  description: string[];
};

export type UniversalCommunityChatRoomsSectionData = {
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  description: string;
};

export type UniversalCommunityChatConnectionSectionData = {
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  featureTitle: string;
  featureDescription: string;
  featureHighlightLabel: string;
  featureHighlightDescription: string;
  image: string;
  imageAlt: string;
};

export type UniversalCommunityChatMomentumCard = {
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  imageAlt: string;
};

export type UniversalCommunityChatQuickGlanceSectionData = {
  titleStart: string;
  titleHighlight: string;
  image: string;
  imageAlt: string;
};

export type UniversalCommunityChatFocusedSectionData = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  highlightedRooms: string[];
};

export const universalCommunityChatHero: UniversalCommunityChatHeroData = {
  titleStart: 'From the Whole World',
  titleHighlight: 'to Your Tribe',
  titleEnd: 'to Your Inner Circle.',
  description:
    'Join the most active conversation on the web. Jump into the Universal Chat to meet everyone, or carve out your own space with Community Rooms. No barriers, just talk.',
  ctaLabel: 'Join the conversation',
  ctaHref: '/signup',
  image: `${staticUrl}/universal-and-community-chat/Celestial-Blue.svg`,
  imageAlt: 'Universal and community chat preview',
};

export const universalCommunityChatWhyData: UniversalCommunityChatWhyPoint[] = [
  {
    path: `${staticUrl}/universal-and-community-chat/Group.svg`,
    title: 'Create in Seconds',
    description: [
      'Start a room for anything - from "Astro Photography" to "Monday Morning Venting."',
    ],
  },
  {
    path: `${staticUrl}/universal-and-community-chat/Vector (4).svg`,
    title: 'Total Control',
    description: [
      'You moderate the vibe. Set the rules, lead the discussion, and build a micro-community within our massive ecosystem.',
    ],
  },
  {
    path: `${staticUrl}/universal-and-community-chat/temaki_room.svg`,
    title: 'Open to All',
    description: [
      'Every room you create is discoverable by the entire membership, giving your ideas the audience they deserve.',
    ],
  },
];

export const universalCommunityChatRoomsSection: UniversalCommunityChatRoomsSectionData = {
  titleStart: 'If You Can Imagine It,',
  titleHighlight: 'You Can Host It.',
  titleEnd: '',
  description:
    'Ready to go deep on a specific topic? Move from the Town Square to a dedicated space with Community Rooms. You are the architect.',
};

export const universalCommunityChatConnectionSection: UniversalCommunityChatConnectionSectionData = {
  titleStart: 'Meet people building,',
  titleHighlight: 'not broadcasting.',
  titleEnd: '',
  subtitle: 'Get advice from experience, not ego.',
  featureTitle: 'Institutional Strategy, Scaled for Your Lifestyle.',
  featureDescription:
    'Want to grow your influence? Every topic in Universal Chat, your name climbs to the top of the Live Member Lists.',
  featureHighlightLabel: 'The Exposure Edge',
  featureHighlightDescription:
    "Your profile stays front-and-center as long as you're part of the conversation. It’s the easiest way to spark new connections and get eyes on your presence.",
  image: `${staticUrl}/universal-and-community-chat/Frame 2147223754.svg`,
  imageAlt: 'Community chat engagement preview',
};

export const universalCommunityChatMomentumSection = {
  titleStart: 'From Small Talk to',
  titleHighlight: 'Big Moves.',
  description:
    'As conversations shift in Universal Chat into long-term goals, whether you are looking for lead partners or service providers, the path from room to boardroom starts here.',
};

export const universalCommunityChatMomentumCards: UniversalCommunityChatMomentumCard[] = [
  {
    title: 'Strategic Meetups',
    description: 'Find your next lead or investor in targeted groups like "Raising funds in Atlanta" or "Midwest Logistics Partners."',
    image: `${staticUrl}/universal-and-community-chat/1.svg`,
    mobileImage: `${staticUrl}/universal-and-community-chat/1.svg`,
    imageAlt: 'Strategic meetups preview',
  },
  {
    title: 'Hyper-Local Hubs',
    description: 'Join spaces like "NYC Retailers" or "Miami Tech Scene" to turn digital pixels into real-world handshakes.',
    image: `${staticUrl}/universal-and-community-chat/2.svg`,
    mobileImage: `${staticUrl}/universal-and-community-chat/2.svg`,
    imageAlt: 'Hyper-local hubs preview',
  },
  {
    title: "The Founder's Circle",
    description: 'Connect in rooms specifically for "Founders who made it past year one"—no fluff, just shared experience and survival tactics.',
    image: `${staticUrl}/universal-and-community-chat/3.svg`,
    mobileImage: `${staticUrl}/universal-and-community-chat/3.svg`,
    imageAlt: 'Founders circle preview',
  },
];

export const universalCommunityChatQuickGlanceSection: UniversalCommunityChatQuickGlanceSectionData = {
  titleStart: 'The Quick',
  titleHighlight: 'Glance',
  image: `${staticUrl}/universal-and-community-chat/Table.svg`,
  imageAlt: 'Universal chat and community rooms quick glance',
};

export const universalCommunityChatFocusedSection: UniversalCommunityChatFocusedSectionData = {
  title: 'Built for focused conversations that move people forward',
  description:
    'Orisuun helps members move from broad community discovery into deeper rooms built\naround shared goals, specific topics, and the people most relevant to the conversation.',
  ctaLabel: 'Get started now',
  ctaHref: '/signup',
  highlightedRooms: ['Mentor Circle', 'Funding Room', 'Marketing Room', 'Investor Q&A', 'Founder Chat'],
};
