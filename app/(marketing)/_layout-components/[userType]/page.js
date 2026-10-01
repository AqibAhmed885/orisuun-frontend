import { notFound } from 'next/navigation';
import { Elevate, Exceptionally, UserHero, UserSection2 } from './components';
import CardSection from './components/CardSection';
import WhoUser from './components/WhoUser';
import AllInOne from '../../../../components/marketing/Homepage/AllInOne';
import Who from '../../../../components/marketing/Homepage/Who';

const getMetadata = (userType) => {
  switch (userType) {
    case 'black-owned-businesses':
      return {
        title: 'Orisuun | Driving Growth of Black-Owned Businesses',
        description:
          'Join our network dedicated to growing Black-owned businesses. Find valuable connections and business development opportunities. Connect with motivated investors and clients searching our database just for you. Claim your custom URL on Orisuun.com today! ',
        // keywords:
          // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions',
      };
    case 'professionals':
      return {
        title:
          'Orisuun | Get Paid to Provide Your Professional Services to Black-Owned Businesses',
        description:
          'Get paid to provide your professional services to growing Black-owned businesses. ',
        // keywords:
          // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Professionals, Attorneys, Accountants, Marketing',
      };
    case 'experts':
      return {
        title: 'Orisuun | Get Paid to Provide Your Expert Opinion ',
        description:
          'Get paid to provide your expert opinion to Black-owned businesses. Claim your custom URL on Orisuun.com today!',
        // keywords:
          // 'Subject Matter Expert, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions, Expert',
      };
    case 'mentors':
      return {
        title: 'Orisuun | Mentor Owners of Growing Black-Owned Businesses',
        description:
          'Mentor owners of growing Black-owned businesses. Claim your custom URL on Orisuun.com today! ',
        // keywords:
          // 'Mentors, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Mentor',
      };
    case 'strategy-consultants':
      return {
        title:
          'Orisuun | Get Paid to Provide Your Strategy Consultant Services to Black-owned Businesses',
        description:
          'Get paid to provide strategic advice to growing Black-owned businesses.',
        // keywords:
          // 'Strategy Consulting, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions, Strategy Consultants, Strategy Consultants',
      };
    case 'partners':
      return {
        title:
          'Orisuun | Create New Client Relationships with Growing Black-Owned Businesses',
        description:
          'Connect and create new client relationships with growing Black-owned businesses around the world. ',
        // keywords:
          // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration ',
      };
    case 'investors':
      return {
        title:
          'Orisuun | Create New Investment Relationships with Growing Black-Owned Businesses',
        description:
          'Connect and create new investment relationships with growing Black-businesses around the world.',
        // keywords:
          // 'Invest in Black-Owned Businesses, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Invest in Black startups',
      };
    case 'advocates':
      return {
        title:
          'Orisuun | Search, Find, and Support Black-Owned Businesses Around the World',
        description:
          'Search, find, and support Black-owned businesses around the world. Claim your custom URL on Orisuun.com today!',
        // keywords:
          // 'Support Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Support Black-Owned Businesses',
      };
    default:
      return {
        title: 'User Type',
        description: 'User type information and details.',
        // keywords: 'User type keywords',
      };
  }
};

export async function generateMetadata({ params }) {
  const { userType } = params;
  return getMetadata(userType);
}

export default async function UserType({ params }) {
  const { userType } = params;

  if (
    ![
      'black-owned-businesses',
      'professionals',
      'experts',
      'mentors',
      'strategy-consultants',
      'partners',
      'investors',
      'advocates',
    ].includes(userType)
  ) {
    notFound();
  }
  return (
    <div>
      <div className="flex flex-col">
        <UserHero userType={userType} />
        <UserSection2 userType={userType} />
      </div>
      <div className="max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px] w-full mx-auto">
        
        <AllInOne isUserType={true} />
        <Who/>
        {userType !== 'partners' && <Exceptionally userType={userType} />}
        <CardSection userType={userType} />
        <Elevate userType={userType} />
      </div>
    </div>
  );
}
