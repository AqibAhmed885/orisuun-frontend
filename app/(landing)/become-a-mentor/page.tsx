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
const contract = staticUrl + "/userTypes/images/contract.png";
const board = staticUrl + "/userTypes/images/board.png";
const promise = staticUrl + "/userTypes/images/promise.png";
const lounch = staticUrl + "/userTypes/images/lounch1.png";
const realstate = staticUrl + "/userTypes/images/realstate.png";


export const metadata = {
  title: 'Orisuun | Become a Mentor',
  description: 'A platform to connect and support Black-owned businesses',
  robots: {
    index: false,
  },
};

const page = () => {

  const heroItems = [
    {
      heading: "Share Your Journey. Shape Someone Else’s",
      subheading:
        "Get paid to be the voice you wish you had! From one conversation to ongoing guidance, your mentorship helps businesses move faster and smarter - with your experience as their edge",
    },
    {
      heading: "Your Guidance. Their Growth. Your Growth.",
      subheading:
        "Get paid to be the voice you wish you had! From one conversation to ongoing guidance, your mentorship helps businesses move faster and smarter - with your experience as their edge",
    },
    {
      heading: "Someone’s Just One Conversation Away From Clarity",
      subheading:
        "Get paid to be the voice you wish you had! From one conversation to ongoing guidance, your mentorship helps businesses move faster and smarter - with your experience as their edge",
    },
  ];

  const images = [
     `${staticUrl}/leading-pages/mentor/hero1.png`,
     `${staticUrl}/leading-pages/mentor/hero2.png`,
     `${staticUrl}/leading-pages/mentor/hero3.png`,
   ];

  return (
    <div className='w-full  '>
      {/* Preload above-the-fold section image to improve LCP without touching shared marketing components */}
      <Head>
        <link rel="preload" as="image" href={market} />
      </Head>
      <Header link="/signup?profile=mentors" />

      <HeroSection heroItems={heroItems} images={images} href="/signup?profile=mentors" />
      <div className='w-full flex flex-col px-6 items-center'>
        <p className='text-4xl text-[#001E5F] font-medium  text-center mt-3 mb-3'>Share What You Know. See What It Grows. </p>
        <p className=' text-[#5B657B] text-xl   leading-[30px] max-w-4xl font-medium text-center mb-14'>Your insight can change someone’s business - and their life</p>
      </div>

      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 w-full space-y-10'>
        <ImageFirst
          image={market}
          heading={"Let the Orisuun network know about business opportunities you offer and are seeking "}
          paragraph1={"Broadcast the opportunities you offer and seek within the Orisuun network."}
          paragraph2={"Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward."}
          paragraph3={""}
          buttonText={"Find opportunities"}
          link1={"/signup?profile=mentors"}
          link2={"/signup?profile=mentors"}
        />
        {/* <div className='w-full bg-[#F2F7FC] py-16 px-6 md:px-12 '> */}
        <TextFirst
          image={board}
          heading={"Find promising Black-owned businesses in your niche looking for co-founders or board members "}
          paragraph1={"Broadcast the opportunities you offer and seek within the Orisuun network."}
          paragraph2={"Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward."}
          paragraph3={""}
          buttonText={"Find businesses"}
          link2={"/signup?profile=mentors"}
        />
        {/* </div> */}

        <ImageFirst
          image={support}
          heading={"Donate to Black-Owned Businesses"}
          paragraph1={"Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need."}
          paragraph2={"Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community."}
          paragraph3={""}
          buttonText={"Start donating"}
          link1={"/signup?profile=mentors"}
          link2={"/signup?profile=mentors"}
        />
        {/* <div className='w-full bg-[#F2F7FC] py-16 px-6 md:px-12 '> */}
        <TextFirst
          image={contract}
          heading={"Work directly with Black-owned businesses on our platform safely and securely  "}
          paragraph1={"Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun. "}
          paragraph2={"Take advantage of our low transaction fee (just 1%)."}
          paragraph3={""}
          buttonText={"Work with businesses"}
          link2={"/signup?profile=mentors"}
        />
        {/* </div> */}
        <ImageFirst
          image={promise}
          heading={"We Don’t Just Promise Value — We Guarantee It. "}
          paragraph1={"Stay active for a year. If Orisuun doesn’t bring you at least $100 in new value through customers, savings, or connections, we’ll send you $250 cash—because your success fuels our mission."}
          paragraph2={"Get matched. Get moving. Grow with guidance."}
          paragraph3={""}
          buttonText={"Try Risk-Free"}
          link1={"/signup?profile=mentors"}
          link2={"/signup?profile=mentors"}
        />
        <TwoCardPromo
          leftImage={lounch}
          leftTitle="Join Now. Grow Faster."
          leftParagraphs={[
            "Join now and claim your status as a featured business. With homepage and category spotlights, we’re featuring businesses who join today.",
            "Visibility is power, and we’re rewarding active members with special shoutouts in our newsletters and partner channels.",
          ]}
          leftCtaHref="/signup?profile=mentors"
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
            heading={"Plug in for Just $33 a Year–That’s less than an Uber ride"}
            paragraph1={"One Uber ride gets you across town."}
            paragraph2={"This gets your business in front of the people that matter!  This membership pays for itself every day. "}
            paragraph3={""}
            buttonText={"Claim Your spot"}
            link={"/signup?profile=mentors"}          />
        </div>
        <LandingFooter />
      </div>
    </div>
  );
};

export default page;
