import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { UserSection2 } from './components';
import Who from '../../../components/marketing/Homepage/Who';
import { LazySectionWithSkeleton } from '@/components/LazySection';
import './critical.css';

// Dynamic imports for heavy components
const Elevate = dynamic(() => import('./components').then(mod => ({ default: mod.Elevate })));
const Exceptionally = dynamic(() => import('./components').then(mod => ({ default: mod.Exceptionally })));
const UserHero = dynamic(() => import('./components').then(mod => ({ default: mod.UserHero })));
const CardSection = dynamic(() => import('./components/CardSection'));
const AllInOne = dynamic(() => import('../../../components/marketing/Homepage/AllInOne'));
const WhoIsOrisuun = dynamic(() => import('@/components/marketing/Homepage/WhoIsOrisuun'));
const ExpertVerifiedSteps = dynamic(() => import('@/components/marketing/Homepage/ExpertVerifiedSteps'));
const MentorVerifiedSteps = dynamic(() => import('@/components/marketing/Homepage/MentorVerifiedSteps'));
const ConsultantVerifiedSteps = dynamic(() => import('@/components/marketing/Homepage/ConsultantVerifiedSteps'));
const OrisuunAndAdvocates = dynamic(() => import('@/components/marketing/Homepage/OrisuunAndAdvocates'));
const WhyNow = dynamic(() => import('../pricing.backup/components').then(mod => ({ default: mod.WhyNow })));
const Access = dynamic(() => import('../../../components/marketing/Homepage/Access'));

// export const metadata = (userType) => {
//   switch (userType) {
//     case 'black-owned-businesses':
//       return {
//         title: 'Orisuun | Driving Growth of Black-Owned Businesses',
//         description:
//           'Join our network dedicated to growing Black-owned businesses. Find valuable connections and business development opportunities. Connect with motivated investors and clients searching our database just for you. Claim your custom URL on Orisuun.com today! ',
//         keywords:
//           'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions',
//       };
//     case 'professionals':
//       return {
//         title:
//           'Orisuun | Get Paid to Provide Your Professional Services to Black-Owned Businesses',
//         description:
//           'Get paid to provide your professional services to growing Black-owned businesses. ',
//         keywords:
//           'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Professionals, Attorneys, Accountants, Marketing',
//       };
//     case 'experts':
//       return {
//         title: 'Orisuun | Get Paid to Provide Your Expert Opinion ',
//         description:
//           'Get paid to provide your expert opinion to Black-owned businesses. Claim your custom URL on Orisuun.com today!',
//         keywords:
//           'Subject Matter Expert, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions, Expert',
//       };
//     case 'mentors':
//       return {
//         title: 'Orisuun | Mentor Owners of Growing Black-Owned Businesses',
//         description:
//           'Mentor owners of growing Black-owned businesses. Claim your custom URL on Orisuun.com today! ',
//         keywords:
//           'Mentors, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Mentor',
//       };
//     case 'strategy-consultants':
//       return {
//         title:
//           'Orisuun | Get Paid to Provide Your Strategy Consultant Services to Black-owned Businesses',
//         description:
//           'Get paid to provide strategic advice to growing Black-owned businesses.',
//         keywords:
//           'Strategy Consulting, Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, New Features, New Platform Functions, Strategy Consultants, Strategy Consultants',
//       };
//     case 'partners':
//       return {
//         title:
//           'Orisuun | Create New Client Relationships with Growing Black-Owned Businesses',
//         description:
//           'Connect and create new client relationships with growing Black-owned businesses around the world. ',
//         keywords:
//           'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration ',
//       };
//     case 'investors':
//       return {
//         title:
//           'Orisuun | Create New Investment Relationships with Growing Black-Owned Businesses',
//         description:
//           'Connect and create new investment relationships with growing Black-businesses around the world.',
//         keywords:
//           'Invest in Black-Owned Businesses, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Invest in Black startups',
//       };
//     case 'advocates':
//       return {
//         title:
//           'Orisuun | Search, Find, and Support Black-Owned Businesses Around the World',
//         description:
//           'Search, find, and support Black-owned businesses around the world. Claim your custom URL on Orisuun.com today!',
//         keywords:
//           'Support Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching, Collaboration, Support Black-Owned Businesses',
//       };
//     default:
//       return {
//         title: 'Page Not Found',
//         description: '',
//       };
//   }
// };

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
    <div className="mt-16">
      <div className="flex flex-col">
        {/* <UserHero userType={userType} /> */}
        <UserSection2 userType={userType} />
      </div>
      <div className="max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px] w-full mx-auto">
        <Who />
        {/* {userType == 'advocates' && <OrisuunAndAdvocates userType={userType} />} */}
        <LazySectionWithSkeleton skeletonHeight="400px">
          <AllInOne isUserType={true} userType={userType} />
        </LazySectionWithSkeleton>
        <LazySectionWithSkeleton skeletonHeight="300px">
          <WhoIsOrisuun />
        </LazySectionWithSkeleton>
        {/* {(userType == 'black-owned-businesses' || userType == 'experts' || userType == 'professionals' || userType == 'strategy-consultants' || userType == 'mentors' || userType == 'investors' || userType == 'partners') && ( */}
        <LazySectionWithSkeleton skeletonHeight="600px">
          <Exceptionally userType={userType} />
        </LazySectionWithSkeleton>
        {/* )}  */}
        {userType == 'experts' && (
          <LazySectionWithSkeleton skeletonHeight="400px">
            <ExpertVerifiedSteps userType={userType} />
          </LazySectionWithSkeleton>
        )}
        {userType == 'mentors' && (
          <LazySectionWithSkeleton skeletonHeight="400px">
            <MentorVerifiedSteps userType={userType} />
          </LazySectionWithSkeleton>
        )}
        {userType == 'strategy-consultants' && (
          <LazySectionWithSkeleton skeletonHeight="400px">
            <ConsultantVerifiedSteps userType={userType} />
          </LazySectionWithSkeleton>
        )}
        {/* {userType == 'black-owned-businesses' && ( */}
          <LazySectionWithSkeleton skeletonHeight="800px">
            <CardSection userType={userType} />
            {/* <BobBenefits /> */}
          </LazySectionWithSkeleton>
        {/* )} */}
        {userType != 'experts' && userType != 'professionals' && userType != 'mentors' && userType != 'strategy-consultants' && userType != 'partners' && userType != 'investors' && userType != 'advocates' && userType != 'black-owned-businesses' && (
          <LazySectionWithSkeleton skeletonHeight="400px">
            <Elevate userType={userType} />
          </LazySectionWithSkeleton>
        )}
        {userType == 'black-owned-businesses' && (
          <>
            <LazySectionWithSkeleton skeletonHeight="400px">
              <WhyNow />
            </LazySectionWithSkeleton>
            <LazySectionWithSkeleton skeletonHeight="400px">
              <Access />
            </LazySectionWithSkeleton>
          </>
        )}
      </div>
    </div>
  );
}
