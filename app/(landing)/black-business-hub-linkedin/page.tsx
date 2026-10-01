import Image from 'next/image';
import Head from 'next/head';
import { HeroSection } from '../_components/black-business/heroSection';
import { ImageFirst } from '@/app/(marketing)/[userType]/components/CardSection/ImageFirst';
import { TextFirst } from '@/app/(marketing)/[userType]/components/CardSection/TextFirst';
import TwoCardPromo from '../_components/black-business/twoCardPromo';
import { ClaimCard } from '../_components/black-business/claimCard';
import Header from '../_components/header';
import LandingFooter from '../_components/landing-footer';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const market = staticUrl + "/userTypes/images/market.webp";
const scientific = staticUrl + "/userTypes/images/scientific1.webp";
const session = staticUrl + "/userTypes/images/session.png";
const investment = staticUrl + "/userTypes/images/investment.webp";
const promise = staticUrl + "/userTypes/images/promise.webp";
const lounch = staticUrl + "/userTypes/images/lounch1.webp";
const realstate = staticUrl + "/userTypes/images/realstate.webp";


export const metadata = {
  title: 'Orisuun | Black Business Hub',
  description:
    'Orisuun is a vibrant ecosystem dedicated to promoting the growth of Black-owned businesses through collaboration and investment',
  // keywords:
    // 'Black-Owned Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search',
  robots: {
    index: false,
  },
};

const page = () => {
  const heroItems = [
    {
      heading: "You Run Your Business. We’ll Help The Right People Find It!",
      subheading:
        "Orisuun gives Black-owned businesses a spotlight — plus access to exclusive discounts, smart connections, and growth tools. Claim your profile in minutes.",
    },
    {
      heading: "Expand Your Reach. Connect With the Right Opportunities.",
      subheading:
        "Gain visibility among investors, mentors, and advocates who believe in the future you’re building. Orisuun helps your business connect to resources, partnerships, and possibilities that drive impact.",
    },
    {
      heading: "Your Digital Identity for Growth and Recognition",
      subheading:
        "Create a verified business profile that highlights your achievements, visibility, and credibility. Orisuun turns your progress into a story investors and partners can trust.",
    },
    {
      heading: "Turn Visibility into Investment",
      subheading:
        "Fundraising on Orisuun spotlights Black entrepreneurs seeking growth capital. Starting a campaign can  bridge the gap between an idea and opportunity. Go where you’re supported.",
    },
  ];

   const images = [
      `${staticUrl}/leading-pages/black-business/hero1.webp`,
      `${staticUrl}/leading-pages/black-business/hero.webp`,
     `${staticUrl}/leading-pages/black-business/hero4.webp`,
      `${staticUrl}/leading-pages/black-business/hero5.webp`,
    ];

  return (
    <div className='w-full  '>
      {/* Preload above-the-fold section image to improve LCP without touching shared marketing components */}
      {/* <Head>
        <link rel="preload" as="image" href={market} />
      </Head> */}
      <Header />

      <HeroSection heroItems={heroItems} images={images} href={"/signup?profile=black-owned-business"} />
      <div className='w-full flex flex-col px-6 items-center'>
        <p className='text-4xl text-[#001E5F] font-medium  text-center mt-3 mb-3'>Connections. Capital. Confidence.</p>
        <p className=' text-[#5B657B] text-xl   leading-[30px] max-w-4xl font-medium text-center mb-14'>Orisuun is more than a listing — it’s a growth ecosystem. Get matched with investors, advisors, and opportunities tailored for you.</p>
      </div>

      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 w-full space-y-10'>
        <ImageFirst
          image={market}
          heading={"Let the Orisuun network know about business opportunities you offer and are seeking "}
          paragraph1={"Broadcast the opportunities you offer and seek within the Orisuun network."}
          paragraph2={"Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward."}
          paragraph3={""}
          buttonText={"Find opportunities"}
          link1={"/signup?profile=black-owned-business"}
          link2={"/signup?profile=black-owned-business"}
        />
        <div className='w-full bg-[#F2F7FC] py-16 px-6 md:px-12 '>
          <TextFirst
            image={scientific}
            heading={"Attract New Customers with Discounts"}
            paragraph1={"Introduce your business to new customers by offering exclusive discounts."}
            paragraph2={"Utilize Orisuun's platform to reach a wider audience and incentivize potential clients to choose your services or products, boosting your customer base and sales."}
            paragraph3={""}
            buttonText={"Find new customers"}
            link2={"/signup?profile=black-owned-business"}
          />
        </div>

        <ImageFirst
          image={session}
          heading={"Find Mentors Who Get It – And Get Results "}
          paragraph1={"Every great entrepreneur has someone in their corner. Orisuun gives you access to mentors who offer strategic clarity, emotional support, and lived experience — all tailored to Black-owned business success."}
          paragraph2={"Get matched. Get moving. Grow with guidance."}
          paragraph3={""}
          buttonText={"Find your guide"}
          link1={"/signup?profile=black-owned-business"}
          link2={"/signup?profile=black-owned-business"}
        />
        <div className='w-full bg-[#F2F7FC] py-16 px-6 md:px-12 '>
          <TextFirst
            image={investment}
            heading={"Investors Are Looking For You"}
            paragraph1={"We make you easy to find. Orisuun removes the gatekeeping by giving Black-owned businesses visibility with investors ready to fund your next move."}
            paragraph2={"Our platform is where capital meets community — no elevator pitch needed to get in the room. You deserve access, and we make it happen."}
            paragraph3={""}
            buttonText={"Raise funds"}
            
          />
        </div>
        <ImageFirst
          image={promise}
          heading={"We Don’t Just Promise Value — We Guarantee It. "}
          paragraph1={"Stay active for a year. If Orisuun doesn’t bring you at least $100 in new value through customers, savings, or connections, we’ll send you $250 cash—because your success fuels our mission."}
          paragraph2={"Get matched. Get moving. Grow with guidance."}
          paragraph3={""}
          buttonText={"Try Risk-Free"}
          link1={"/signup?profile=black-owned-business"}
        />
        <TwoCardPromo
          leftImage={lounch}
          leftTitle="Join Now. Grow Faster."
          leftParagraphs={[
            "Join now and claim your status as a featured business. With homepage and category spotlights, we’re featuring businesses who join today.",
            "Visibility is power, and we’re rewarding active members with special shoutouts in our newsletters and partner channels.",
          ]}
          leftCtaHref="/signup"
          rightTitle="The Perks"
          perks={[
            "Premium placement where people search and scroll",
            "Lifetime special recognition and privileges, including early access and a price freeze",
            "Direct shoutouts on our homepage and in our marketing materials",
          ]}
        />
        <div className='w-full max-w-[1440px] mx-auto bg-gradient-to-l from-[#001E5F] to-[#2357C6] rounded-3xl py-6 px-2 md:px-12 '>
          <ClaimCard
            image={realstate}
            heading={"Get Listed for Just $33 a Year-That’s less than an Uber Ride"}
            paragraph1={"One Uber ride gets you across town."}
            paragraph2={"This gets your business in front of the people that matter!  This membership pays for itself every day. "}
            paragraph3={""}
            buttonText={"Claim Your Listing"}
          />
        </div>
        <LandingFooter />
      </div>
     
    </div>
  );
};

export default page;
