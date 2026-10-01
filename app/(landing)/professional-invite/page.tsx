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
const support = staticUrl + "/userTypes/images/support.png";
const board = staticUrl + "/userTypes/images/board.png";
const contract = staticUrl + "/userTypes/images/contract.png";
const promise = staticUrl + "/userTypes/images/promise.png";
const lounch = staticUrl + "/userTypes/images/lounch1.png";
const realstate = staticUrl + "/userTypes/images/realstate.png";


export const metadata = {
  title: 'Orisuun | Professional Invite',
  description: 'A platform to connect and support Black-owned businesses',
  robots: {
    index: false,
  },
};

const page = () => {
  const heroItems = [
    {
      heading: "Get Paid for Your Services while Helping Black-owned Businesses Grow",
      subheading:
        "Turn your expertise into opportunity. Offer your skills, build your brand, and get discovered by Black-owned businesses, startups, and investors, looking for trusted professionals  ",
    },
    {
      heading: "Work with Founders Who Need What You Do Best",
      subheading:
        "Join a trusted network of professionals collaborating with founders who value expertise, innovation, and integrity. Together, we’re shaping businesses that redefine success.",
    },
    {
      heading: "Work That Builds More Than a Career — It Builds a Legacy.",
      subheading:
        "Join Orisuun’s professional network to collaborate, consult, and contribute your expertise to businesses that are shaping the future of inclusive growth.",
    },
  ];

  const images = [
    `${staticUrl}/leading-pages/mentor/hero1.png`,
    `${staticUrl}/leading-pages/mentor/hero2.png`,
    `${staticUrl}/leading-pages/black-business/hero6.png`,
  ];

  return (
    <div className='w-full  '>
      {/* Preload above-the-fold section image to improve LCP without touching shared marketing components */}
      <Head>
        <link rel="preload" as="image" href={market} />
      </Head>
      <Header link={"/signup?profile=professionals"}
/>

      <HeroSection heroItems={heroItems} images={images} href={"/signup?profile=professionals"}
/>
      <div className='w-full flex flex-col px-6 items-center'>
        <p className='text-4xl text-[#001E5F] font-medium  text-center mt-3 mb-3'>List Your Services. Get Hired For What You Know.</p>
        <p className=' text-[#5B657B] text-xl   leading-[30px] max-w-4xl font-medium text-center mb-14'>Create your strategy consultant profile and start working with businesses that need smart ,
          actionable plans to grow and thrive</p>
      </div>

      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 w-full space-y-10'>

        {/* 1st */}
        <ImageFirst
          image={market}
          heading={"Let the Orisuun network know about business opportunities you offer and are seeking "}
          paragraph1={"Broadcast the opportunities you offer and seek within the Orisuun network."}
          paragraph2={"Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward."}
          paragraph3={""}
          buttonText={"Find opportunities"}
          link1={"/signup?profile=professionals"}
          link2={"/signup?profile=professionals"}
        />

        {/* 2nd */}
        <TextFirst
          image={board}
          heading={"Find promising Black-owned businesses in your niche looking for co-founders or board members  "}
          paragraph1={"Broadcast the opportunities you offer and seek within the Orisuun network.."}
          paragraph2={"Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward."}
          paragraph3={""}
          buttonText={"Find business"}
          link2={"/signup?profile=professionals"}
        />

        {/* 3rd */}
        <ImageFirst
          image={support}
          heading={"Donate to Black-Owned Businesses"}
          paragraph1={"Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need."}
          paragraph2={"Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community."}
          paragraph3={""}
          buttonText={"Find your guide"}
          link1={"/signup?profile=professionals"}
          link2={"/signup?profile=professionals"}
        />

        {/* 4th */}
        <TextFirst
          image={contract}
          heading={"Work directly with Black-owned businesses on our platform safely and securely  "}
          paragraph1={"Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun. "}
          paragraph2={"Take advantage of our low transaction fee (just 1%)."}
          paragraph3={""}
          buttonText={"Raise funds"}
          link2={"/signup?profile=professionals"}
        />

        {/* 5th */}
        <ImageFirst
          image={promise}
          heading={"We Don’t Just Promise Value — We Guarantee It. "}
          paragraph1={"Stay active for a year. If Orisuun doesn’t bring you at least $100 in new value through customers, savings, or connections, we’ll send you $250 cash—because your success fuels our mission."}
          paragraph2={"Get matched. Get moving. Grow with guidance."}
          paragraph3={""}
          buttonText={"Try Risk-Free"}
          link1={"/signup?profile=professionals"}
          link2={"/signup?profile=professionals"}
        />

        <TwoCardPromo
          leftImage={lounch}
          leftTitle="Join Now. Grow Faster."
          leftParagraphs={[
            "Join now and claim your status as a featured business. With homepage and category spotlights, we’re featuring businesses who join today.",
            "Visibility is power, and we’re rewarding active members with special shoutouts in our newsletters and partner channels.",
          ]}
          leftCtaHref="/signup?profile=professionals"
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
            link={"/signup?profile=professionals"}
          />
        </div>
        <LandingFooter />
      </div>



    </div>
  );
};

export default page;
