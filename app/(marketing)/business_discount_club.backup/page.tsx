import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import DiscountSwiper from './components/DiscountSwiper';
import WhyCard from './components/WhyCard';
import HowItWorks from './components/HowItWorks';
import { whyData } from '@/data/marketing/bussinessDiscount';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = {
  title: 'Orisuun | Discount Marketing Tool',
  description:
    'The Discount Portal is an effective marketing tool that allows businesses to\n' +
    'attract new and loyal customers by offering them exclusive incentives to start\n' +
    'a business relationship',
  // keywords: [
    // 'Marketing tool',
    // 'discount',
    // 'Black-Owned Business',
    // 'emerging markets',
    // 'introduction',
    // 'boost visibility',
    // 'community building',
    // 'outreach',
  // ],
  alternates: {
    canonical: 'https://orisuun.com/business-discount-club',
  },
  openGraph: {
    title: 'Orisuun | Discount Marketing Tool',
    description: 'The Discount Portal is an effective marketing tool that allows businesses to attract new and loyal customers by offering them exclusive incentives to start a business relationship',
    url: 'https://orisuun.com/business-discount-club',
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
  return (
    <>
      <section className="relative overflow-x-hidden xs:pt-10  md:pt-20 md:max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]'} flex flex-col gap-10 sm:gap-20 w-full mx-auto sm:pr-0 sm:pl-0">
        <Image
          src={`${staticUrl}/discount-portal/star.png`}
          alt="banner"
          width={552}
          height={552}
          className="absolute xl:top-[-40px] z-0 w-[330px] top-[-20px] right-[-110px] xl:w-[560px] xl:h-auto  xl:right-[100px] "
          loading="eager"
        />
        <div className="flex flex-col xs:gap-3 md:!gap-4 items-center md:!max-w-[870px] xs:px-4 md:!px-0 text-start mx-auto">
          <p className="uppercase text-blue-200 xs:text-sm md:!text-base font-semibold">
            Black-owned Businesses
          </p>
          <h1 className="md:!text-[64px] xs:text-[32px] z-10 relative leading-[43.2px] font-semibold md:!leading-[120%] text-blue-strong text-center mx-auto ">
            Get customers and keep them with incentives through our Discount
            Portal. It Works!
          </h1>
          <p className="text-blue-300 xs:text-center md:text-xl leading-150">
            Works whether you&apos;re targeting fellow businesses (B2B) or
            individuals (B2C)
          </p>
        </div>
        <DiscountSwiper />
        <section className="flex flex-col xs:gap-10 md:!gap-20 max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-5 pt-20">
            <p className="md:!text-xl text-sm font-medium leading-150 text-blue-300 text-center mx-auto max-w-[640px]">
              Why Choose Orisuun’s Discount Portal?
            </p>
            <h2 className=" text-2xl md:!text-[40px] leading-110 font-semibold md:!leading-110 text-blue-strong md:!max-w-[640px] small-500:max-w-[288px] text-center mx-auto ">
              Unlock Unmatched Business Growth with Our Discount Portal
            </h2>
            <p className="hidden sm:block md:!text-xl mt-1 text-[16px] font-medium leading-150 text-blue-300 text-center mx-auto max-w-[750px] whitespace-pre-wrap">
              Are you ready to elevate your business while attracting a loyal,
              long-term customer base? Welcome to Orisuun’s Discount Portal, the
              premier platform designed to connect your business with an
              exclusive community eager for savings and unique deals.
            </p>
            <p className="sm:hidden md:!text-xl font-medium leading-150 text-blue-300 text-center mx-auto max-w-[750px] whitespace-pre-wrap">
              Are you ready to elevate your business while attracting a loyal,
              long-term customer base? Welcome to Orisuun’s Discount Portal.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:!grid-rows-2 xs:px-4 md:!px-0 lg:grid-rows-1 xs:gap-5 md:!gap-8 small-500:pt-0 md:!pb-32 xs:pb-10">
            {whyData.map((elem, index) => (
              <WhyCard
                key={index}
                image={elem.image}
                title={elem.title}
                descriptionPoints={elem.descriptionPoints}
              />
            ))}
          </div>
        </section>
        <HowItWorks />
        <section className="flex flex-col gap-10 xs:px-4 md:!px-0 lg:max-w-[1280px] w-full pb-20 items-center mx-auto">
          <div className="bg-about xs:h-auto md:!h-[332px] w-full xs:rounded-xl overflow-hidden md:rounded">
            <div
              className="bg-[image:var(--circle5)] xs:bg-contain bg-no-repeat bg-left-top w-full h-full"
              style={{
                '--circle5': `url(${staticUrl}/about/icons/circle5.svg)`,
              } as React.CSSProperties}
            >
              <div
                className="xs:bg-[image:var(--spike4)] xs:[background-size:auto] xs:[background-position-x:100%] xs:[background-position-y:100%] md:!bg-contain md:!bg-[image:var(--spike5)] md:!p-20 xs:p-8 bg-no-repeat md:!bg-[103%] w-full h-full flex flex-col xs:gap-5 md:gap-10 justify-center items-center text-center rounded-[12px]"
                style={{
                  '--spike4': `url(${staticUrl}/about/icons/spike4.svg)`,
                  '--spike5': `url(${staticUrl}/about/icons/spike5.svg)`,
                } as React.CSSProperties}
              >
                <p className="text-white max-w-[706px] xs:text-xl md:!text-2xl md:!text-[40px] leading-[29px] md:!leading-[44px] font-semibold">
                  Premium members, start incentivizing your new customers today!
                </p>
                <div className="flex gap-4 items-center justify-center">
                  <Link
                    href={'/signin'}
                    className="bg-white hover:bg-opacity-90 px-4 py-1 h-11 w-[92px] flex justify-center rounded-full items-center md:!text-base leading-6 font-semibold text-text-gray"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={'/signup'}
                    className="bg-transparent border-2 border-white hover:border-black-50 box-border hover:bg-opacity-90 px-4 py-1 h-11 w-[92px] flex justify-center rounded-full items-center md:!text-base leading-6 font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
