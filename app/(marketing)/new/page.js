import WhatsNew from './components/WhatsNew';

export const metadata = {
  title: 'Orisuun | New Platform Functions and Features',
  description:
    'Stay up to date on our newest platform offerings and how these new features are empowering Black-owned businesses to grow.',
  // keywords:
    // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions',
  robots: {
    index: false,
  },
  alternates: {
    canonical: 'https://orisuun.com/new',
  },
};

const New = () => {
  return (
    <>
      <WhatsNew />
    </>
  );
};

export default New;
