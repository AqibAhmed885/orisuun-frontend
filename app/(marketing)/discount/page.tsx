import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import WhyCard from '@/app/(marketing)/discount/components/WhyCard';
import HowToGetInCard from '@/app/(marketing)/discount/components/HowToGetInCard';
import HowItWorks from '@/app/(marketing)/discount/components/HowItWorks';
import DiscountSwiper from '@/app/(marketing)/discount/components/DiscountSwiper';
import DiscountFAQ from './components/DiscountFAQ';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

interface whyPointType {
  image: string,
  title: string,
  descriptionPoints: Array<string>
}

interface howToGetInType {
  image: string,
  title: string,
  description: string
}

const whyData: Array<whyPointType> = [
  {
    image: `${staticUrl}/discount-portal/partners_icon.png`,
    title: 'Reach the Right Audience',
    descriptionPoints: [
      'Our platform is home to a highly engaged community.',
      'Tap into a pool of potential customers who are actively seeking savings and are likely to become repeat buyers.',
    ],
  },
  {
    image: `${staticUrl}/discount-portal/eye_icon.png`,
    title: 'Boost Your Visibility',
    descriptionPoints: [
      'Gain exposure to a targeted audience without the need for expensive advertising campaigns.',
      'Our platform ensures that your discounts are highlighted to users who match your ideal customer profile.',
    ],
  },
  {
    image: `${staticUrl}/discount-portal/solid_sales_icon.png`,
    title: 'Drive Traffic and Sales',
    descriptionPoints: [
      'Offer compelling discounts that drive traffic to your business, whether it’s online or in-store.',
      'Watch as your sales, customer base, and retention increase with each incentive.',
    ],
  },
  {
    image: `${staticUrl}/discount-portal/people_icon.png`,
    title: 'Community Building',
    descriptionPoints: [
      'Stand out from the competition by joining an exclusive network that fosters a sense of belonging, support, and community.',
      'Play a vital role in the building of a new global business community.',
    ],
  },
  {
    image: `${staticUrl}/discount-portal/gears_icon.png`,
    title: 'Effective Integration',
    descriptionPoints: [
      'Our platform and the Discount Portal are designed to seamlessly work with your existing discount systems.',
      'Plus, our unique code system will allow you to track usage and effectiveness from start to finish.',
    ],
  },
  {
    image: `${staticUrl}/discount-portal/income_icon.png`,
    title: 'Cost-Effective Marketing',
    descriptionPoints: [
      'Maximize your marketing ROI by reaching a targeted audience with no upfront costs. This service is free.',
      'Let your next cohort of loyal, repeat customers come to you with a warm introduction from Orisuun.',
    ],
  },
];

const howToGetInData: howToGetInType[] = [
  {
    image: `${staticUrl}/discount-portal/contact_us.png`,
    title: '1) Contact us about your interest\n',
    description: 'We’ll create an account for you and send the credentials (which you’ll have to change) ',
  },
  {
    image: `${staticUrl}/discount-portal/create_profile.png`,
    title: ' 2) Create your user profile',
    description: 'Create your user profile in order to participate on the platform ',
  },
  {
    image: `${staticUrl}/discount-portal/select_link.png`,
    title: ' 3) Select the “Discount Portal” link',
    description: `You’ll enter your codes into our database at the end of the survey (each code will need to be entered/pasted into the field and separated by a comma)`,
  },
];

export const metadata = {
  title: 'Orisuun | Discount Marketing Tool',
  description: 'The Discount Portal is an effective marketing tool that allows businesses to\n' +
    'attract new and loyal customers by offering them exclusive incentives to start\n' +
    'a business relationship',
  // keywords: ['Marketing tool', 'discount', 'Black-Owned Business', 'emerging markets',
    // 'introduction', 'boost visibility', 'community building', 'outreach'],
  alternates: {
    canonical: 'https://orisuun.com/discount',
  },
  openGraph: {
    title: 'Orisuun | Discount Marketing Tool',
    description: 'The Discount Portal is an effective marketing tool that allows businesses to attract new and loyal customers by offering them exclusive incentives to start a business relationship',
    url: 'https://orisuun.com/discount',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og-image-discount.jpg',
        width: 1200,
        height: 630,
        alt: 'Orisuun Discount Marketing Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orisuun | Discount Marketing Tool',
    description: 'The Discount Portal is an effective marketing tool that allows businesses to attract new and loyal customers by offering them exclusive incentives to start a business relationship',
    images: ['https://orisuun.com/og-image-discount.jpg'],
  },
};

export default function DiscountPortal() {
  return <>
    <section
      className="relative overflow-x-hidden pt-11 md:mt-[100px] max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]'} flex flex-col gap-10 sm:gap-20 w-full mx-auto sm:pr-0 sm:pl-0">
      <Image
        src={`${staticUrl}/discount-portal/star.png`}
        alt="banner"
        width={552}
        height={552}
        className="absolute xl:top-[-40px] z-0 w-[330px] top-[-20px] right-[-110px] xl:w-[560px] xl:h-auto  xl:right-[100px] "
        loading="eager"
      />
      <div className="mt-[44px] md:max-w-[870px] text-start mx-auto">
        <h1
          className="md:text-[64px] text-[36px] z-10 relative leading-[43.2px] font-semibold md:leading-[110%] text-blue-strong small-500:max-w-[90%] text-center mx-auto ">Get
          your business in front of a new and eager set of potential customers, for free</h1>
      </div>
      <DiscountSwiper />
      <section className="flex flex-col gap-20 max-w-[1280px] mx-auto pr-4 pl-4 sm:pr-0 sm:pl-0">
        <div className="flex flex-col gap-6 pt-20">
          <p
            className="md:text-xl text-[16px] font-medium leading-[150%] text-[#5B657B] text-center mx-auto max-w-[640px]">
            Why Choose Orisuun’s Discount Portal?
          </p>
          <h2
            className="md:text-[40px] text-[25px] leading-[110%] font-semibold md:leading-[110%] text-blue-strong md:max-w-[640px] small-500:max-w-[288px] text-center mx-auto ">
            Unlock Unmatched Business Growth with Our Discount Portal
          </h2>
          <p
            className="hidden sm:block md:text-xl text-[16px] font-medium leading-[150%] text-[#5B657B] text-center mx-auto max-w-[750px] whitespace-pre-wrap">
            Are you ready to elevate your business while attracting a loyal, long-term customer base?
            Welcome to Orisuun’s Discount Portal, the premier platform designed to connect your
            business with an exclusive community eager for savings and unique deals.
          </p>
          <p
            className="sm:hidden md:text-xl text-[16px] font-medium leading-[150%] text-[#5B657B] text-center mx-auto max-w-[750px] whitespace-pre-wrap">
            Are you ready to elevate your business while attracting a loyal, long-term customer base?
            Welcome to Orisuun’s Discount Portal.
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-rows-2 lg:grid-rows-1 gap-[32px] small-500:pt-0 pb-[60px] small-500:pb-[120px]">
          {
            whyData.map((elem, index) => (
              <WhyCard key={index} image={elem.image} title={elem.title} descriptionPoints={elem.descriptionPoints} />
            ))
          }
        </div>
      </section>
      <HowItWorks />
      <section className="flex flex-col gap-10 xl:max-w-[1280px] items-center mx-auto">
        <div className="pt-20 pr-4 pl-4 sm:pr-0 sm:pl-0 w-full">
          <div
            className="bg-[#2C57A4] relative bg-cover bg-center rounded-[12px] flex justify-center items-center overflow-clip">
            <div>
              <Image
                src={`${staticUrl}/discount-portal/how/left_star.svg`}
                alt="bottom"
                width={300}
                height={300}
                className="absolute bottom-[-10px] max-w-[150px] md:max-w-[300px] "
              />
            </div>
            <div>
              <Image
                src={`${staticUrl}/discount-portal/how/right_star.svg`}
                alt="top"
                width={300}
                height={300}
                className="absolute right-[-1px] top-[-11px] max-w-[150px] md:max-w-[300px] "
              />
            </div>
            <div
              className="text-white text-[40px] small-500:text-[24px] leading-[110%] text-center mx-auto  max-w-[636px] md:py-[80px] py-[50px] px-4 flex flex-col gap-2 items-center"
              data-aos="fade-up"
            >
              <span className="block font-semibold">
                How to Get In
                <br />
                3 easy steps
              </span>
              <div className="flex items-center gap-2 text-white">
                <Image src={`${staticUrl}/discount-portal/how/bi_clock-fill.svg`} width={24} height={24} alt="clock" />
                <span className="small-500:block text-[14px] leading-[31.2px]">
                  aprox. 35 minutes
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-wrap justify-between gap-[32px] pt-[30px] sm:pt-10 pb-[150px] small-500:pb-[120px] small-500:flex small-500:flex-col small-500:items-center">
          {
            howToGetInData.map((elem, index) => (
              <HowToGetInCard key={index} image={elem.image} title={elem.title} description={elem.description} />
            ))
          }
        </div>
      </section>
      <DiscountFAQ />
    </section>
  </>
    ;
}
