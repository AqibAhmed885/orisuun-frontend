const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const teamFormImage = (fileName: string) => `${staticUrl}/team-form/${fileName}`;

export type TeamFormUseCase = {
  image: string;
  imageAlt: string ;
  title: string;
  emphasizedPhrases?: string[];
  description: string;
  cta: string;
};

export type TeamFormBlock = {
  title: string;
  description: string;
  image: string;
  backgroundImage?: string;
  imageAlt: string;
  cta?: string;
  isReversed?: boolean;
};

export const teamFormLandingData = {
  headingPrefix: 'Become a',
  headingHighlight: 'Turnkey Solution',
  headingDescription:
    'Individual expertise matters, but the right team wins bigger. Investors, mentors, consultants, and experts can now combine strengths into one greater group offering.',

  blocks: [
    {
      title:
        'Create stronger business ecosystems in a single place with people built to help you grow',
      description:
        'Connect with investors, mentors, experts, partners, and advocates who can support your next stage of growth. Build trusted relationships, discover useful opportunities, and move your business forward through one connected ecosystem.',
      image: teamFormImage('1.svg'),
      imageAlt: 'Team match cards and recommendations',
      cta: 'Create your team',
      isReversed: false,
    },
    {
      title: 'Build a shared team brand without losing your individual authority',
      description:
        'Create one unified team identity while members keep their own trusted profiles. Bring consultants, experts, mentors, and investors together under one clear offering that businesses can understand and hire as a complete group.',
      image: teamFormImage('2.svg'),
      imageAlt: 'Team identity builder dashboard',
      cta: 'Start Building',
      isReversed: true,
    },
    {
      title:
        'Turn your members into one complete offer clients can choose confidently',
      description:
        'Present your team as one polished service with clear roles, strengths, and outcomes. Help clients quickly understand how your combined expertise solves bigger problems than any individual profile alone.',
      image: teamFormImage('3.svg'),
      imageAlt: 'Team formation visual',
      cta: 'Start your team',
      isReversed: false,
    },
  ] satisfies TeamFormBlock[],
};
export const teamCollabSectionData = {
  titlePrefix: 'Offer More. Without the',
  titleHighlight: 'Overhead.',
  subtitle:
    "Why offer one product when you can offer a suite? Team up with other businesses on the platform to create powerful, complementary bundles.",
  mainImage: teamFormImage('Frame 2147224054.svg'), // export this from design
  features: [
    {
      icon: teamFormImage('bussiness-bag.svg'),
      title: 'Cross-Business Collabs',
      description:
        'If you sell software and they provide hardware, team up to offer a total solution.',
    },
    {
      icon: teamFormImage('leader.svg'),
      title: 'Unified Market Presence',
      description:
        'Appear in the directory as a cohesive group, making it easier for customers to trust your complete offer.',
    },
    {
      icon: teamFormImage('v3.svg'),
      title: 'Seamless Operation',
      description:
        'Chat, collaborate, and do business as a team, just as easily as you do as an individual.',
    },
  ],
};

export const teamGroupWaySectionData = {
  titlePrefix: 'Your Group,',
  titleHighlight: 'Your Way.',
  subtitle:
    "Forming a team doesn't mean losing your individual brand. It means adding a new, powerful layer to your presence on the platform.",
  image: teamFormImage('frame.svg'),
  imageAlt: 'Team profile and growth dashboard',
  contentTitle: 'Choose the right people to complete your business growth team',
  contentDescription:
    'Invite investors, mentors, consultants, experts, and professional partners into one shared team built around your business goals.',
  points: [
    'Add complementary member types based on the support your business needs',
    'Bring investors, mentors, consultants, and experts into one coordinated team',
    'Fundraising campaigns',
    'Pitchbooks, discounts, co-founder opportunities',
  ],
};

export const teamUseCasesSectionData = {
  eyebrow: 'USE CASES',
  title: 'Real ways teams can form around opportunity.',
  subtitle:
    'Whether the goal is expansion, customer growth, or a complete launch, Orisuun makes it easier for complementary people and businesses to join forces under one shared team identity.',
  useCases: [
    {
      image: teamFormImage('Frame 2147224057.svg'),
      imageAlt: 'Expansion Suite use case visual',
      title: 'A Strategy Consultant + an Expert + an Investor forming a "Market Entry Team" for startups',
      emphasizedPhrases: ['Strategy Consultant', 'Expert', 'Investor', 'Market Entry Team', ],
      description:
        'Designed for founders entering new markets who need strategic direction, specialist insight, and capital access in one coordinated team. Instead of hiring support separately, businesses can work with one group built around expansion.',
      cta: 'Start Your Team',
    },
    {
      image: teamFormImage('Frame 2147224057 (3).svg'),
      imageAlt: 'Retail Power-Link use case visual',
      title: 'Three independent retailers forming a Boutique Collective for shared customer growth',
      emphasizedPhrases: ['independent retailers', 'Boutique Collective'],
      description:
        'Built for businesses that serve similar audiences and want to grow together. Members can combine offers, create cross-store rewards, share visibility, and present one stronger collective presence to customers.',
      cta: 'Start Your Team',
    },
    {
      image: teamFormImage('Frame 2147224057 (1).svg'),
      imageAlt: 'Tech Alpha Group use case visual',
      title: 'A Developer + a UI/UX Designer + a Digital Marketer forming a Ready-to-Launch team',
      emphasizedPhrases: ['Developer', 'UI/UX Designer', 'Digital Marketer', 'Ready-to-Launch'],
      description:
        'Made for businesses that need a complete digital launch team without managing separate specialists. The group can handle product build, user experience, positioning, and launch support under one unified team identity.',
      cta: 'Start Your Team',
    },
  ] satisfies TeamFormUseCase[],
};
