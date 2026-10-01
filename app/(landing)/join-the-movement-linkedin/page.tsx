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
const market = staticUrl + "/userTypes/images/market.png";
const study = staticUrl + "/userTypes/images/study.png";
const write = staticUrl + "/userTypes/images/write.png";
const support = staticUrl + "/userTypes/images/support1.png";
const paris = staticUrl + "/userTypes/images/paris.png";
const instrument = staticUrl + "/userTypes/images/instrument.png";
const promise = staticUrl + "/userTypes/images/promise.png";
const lounch = staticUrl + "/userTypes/images/lounch1.png";
const realstate = staticUrl + "/userTypes/images/realstate.png";


export const metadata = {
  title: 'Orisuun | Join the Movement',
  description: 'A platform to connect and support Black-owned businesses',
  robots: {
    index: false,
  },
};

const page = () => {
  const heroItems = [
    {
      heading: "Turn Visibility into Investment",
      subheading:
        "Fundraising on Orisuun spotlights Black entrepreneurs seeking growth capital. As an Advocate, your engagement helps bridge the gap between opportunity and investment.",
    },
    {
      heading: "Be the Reason Businesses Get Found",
      subheading:
        "Your support goes further on Orisuun. Help Black-owned businesses get discovered, trusted, and funded - starting with just one click. Search and filter for Black-owned businesses in your neighborhood and around the world",
    },
    {
      heading: "Find Black-Owned Businesses to Support in Your Neighborhood and Around the World",
      subheading:
        "Your support goes further on Orisuun. Help Black-owned businesses get discovered, trusted, and funded - starting with just one click. Search and filter for Black-owned businesses in your neighborhood and around the world",
    },
  ];

  const images = [
    `${staticUrl}/leading-pages/investor/hero1.png`,
    `${staticUrl}/leading-pages/black-business/hero2.png`,
    `${staticUrl}/leading-pages/black-business/hero3.png`,
  ];

  return (
    <div className='w-full  '>
      {/* Preload above-the-fold section image to improve LCP without touching shared marketing components */}
      <Head>
        <link rel="preload" as="image" href={market} />
      </Head>
      <Header link='/signup?profile=advocates'/>

      <HeroSection heroItems={heroItems} images={images} href='/signup?profile=advocates' />
      <div className='w-full flex flex-col px-6 items-center'>
        <p className='text-4xl text-[#001E5F] font-medium  text-center mt-3 mb-3'>Turn Small Actions into Big Impact!</p>
        <p className=' text-[#5B657B] text-xl   leading-[30px] max-w-4xl font-medium text-center mb-14'>You don’t need capital to create change</p>
      </div>

      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 w-full space-y-10'>
        {/* first */}
        <TextFirst
          image={support}
          heading={"Donate to Black-Owned Businesses "}
          paragraph1={"Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need."}
          paragraph2={"Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community."}
          paragraph3={""}
          buttonText={"Start donating"}
          link1={"/signup?profile=advocates"}
          link2={"/signup?profile=advocates"}
        />

        {/* 2nd */}
        <ImageFirst
          image={study}
          heading={"Find Black-Owned Businesses in Your Neighborhood"}
          paragraph1={"Locate Black-owned businesses right in your neighborhood and support local entrepreneurs."}
          paragraph2={"Strengthening local businesses contributes to the overall economic health of your community and encourages sustainable growth."}
          paragraph3={""}
          buttonText={"Find businesses"}
          link1={"/signup?profile=advocates"}
          link2={"/signup?profile=advocates"}
        />
        
        {/* 3rd */}
        <TextFirst
          image={instrument}
          heading={"Find Black-Owned Businesses Around the World"}
          paragraph1={"Explore Black-owned businesses on a global scale and build international connections."}
          paragraph2={"Search worldwide, by country, city, or keyword and expand your market reach by engaging with global Black-owned businesses."}
          paragraph3={""}
          buttonText={"Find businesses"}
          link1={"/signup?profile=advocates"}
          link2={"/signup?profile=advocates"}
        />

        {/* 4th */}
        <ImageFirst
          image={write}
          heading={"Write Reviews and Share Your Experience "}
          paragraph1={"Share your experiences with Black-owned businesses by writing reviews on Orisuun."}
          paragraph2={"Your feedback helps other users make informed decisions and supports the businesses in improving their services and products."}
          paragraph3={"Tell businesses about your experience with public or private ratings and reviews."}
          buttonText={"Share my experience"}
          link1={"/signup?profile=advocates"}
          link2={"/signup?profile=advocates"}
        />

        {/* 5th */}
        <TextFirst
          image={paris}
          heading={"Rise Up Our Local, Regional, and Global Leaderboards"}
          paragraph1={"Demonstrate your commitment to supporting Black-owned businesses by climbing our leaderboards."}
          paragraph2={"Show off your contributions and make sure dedication is recognized."}
          paragraph3={""}
          buttonText={"See the leaderboard"}
          link2={"/signup?profile=advocates"}
        />

        {/* 6th */}
        <ImageFirst
          image={promise}
          heading={"We Don’t Just Promise Value — We Guarantee It. "}
          paragraph1={"Stay active for a year. If Orisuun doesn’t bring you at least $100 in new value through customers, savings, or connections, we’ll send you $250 cash—because your success fuels our mission."}
          paragraph2={"Get matched. Get moving. Grow with guidance."}
          paragraph3={""}
          buttonText={"Try Risk-Free"}
          link1={"/signup?profile=advocates"}
          link2={"/signup?profile=advocates"}
        />

        <TwoCardPromo
          leftImage={lounch}
          leftTitle="Join Now. Grow Faster."
          leftParagraphs={[
            "Join now and claim your status as a featured business. With homepage and category spotlights, we’re featuring businesses who join today.",
            "Visibility is power, and we’re rewarding active members with special shoutouts in our newsletters and partner channels.",
          ]}
          leftCtaHref="/signup?profile=advocates"
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
            heading={"Plug in for Just $33 a Year-That’s less than an Uber Ride"}
            paragraph1={"One Uber ride gets you across town."}
            paragraph2={"This gets your business in front of the people that matter!  This membership pays for itself every day. "}
            paragraph3={""}
            buttonText={"Claim Your spot"}
            link={"/signup?profile=advocates"}
          />
        </div>
        <LandingFooter />
      </div>
    </div>
  );
};

export default page;
