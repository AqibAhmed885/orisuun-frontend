import Image from 'next/image';
import WhatWeOffer from './Group 1000009612.webp';

export const Explore = () => {
  return (
    <section className="flex w-full lg:mt-4 lg:flex-row items-center md:flex-col sm:flex-col small-500:flex-col">
      <div className="w-full flex flex-col justify-start items-start lg:w-[35%] xl:pt-[0] small-500:pt-[40px] small-500:px-4 order-1 lg:order-1">
        <h1 className="text-[#001E5F] font-semibold leading-110 md:mb-[60px] mb-[48px] xl:text-[48px] lg:text-[36px] text-[48px] ">
          Explore what comes with an Orisuun subscription:
        </h1>
        <div className="w-full flex md:flex-row flex-col gap-2">
          <div className=" h-full flex flex-col items-start gap-2">
            <p className="text-[#2357C6] text-[20px] font-semibold leading-[26px]">
              Platform functionality
            </p>
            <p className="text-blu-ray-300 text-[18px] font-medium leading-150 ">
              The Platform tools that allow for discovery, collaboration, connection and growth
            </p>
          </div>
          <div className="h-full flex flex-col items-start gap-2">
            <h3 className="text-[#2357C6] text-[20px] font-semibold leading-[26px]">
              Platform features
            </h3>
            <p className="text-blu-ray-300 text-[18px] font-medium leading-150">
              Exclusive access to the Orisuun ecosystem, including Black-owned businesses, mentors and investors
            </p>
          </div>
        </div>
      </div>
      {/* <div className="relative xl:pb-[31px] lg:pt-[0px] lg:pb-[31px] order-2 lg:order-2 rounded-[25px]"> */}
      {/* <div className="w-full relative pb-0 md:pt-[0px] pt-10 order-2 lg:order-2 rounded-[25px] md:mb-[-35px] mb-[-15px] "> */}
      <div className="w-full lg:w-[65%] pb-0 md:pt-[0px] order-2 lg:order-2 rounded-[25px] -mt-[3rem]">
        <Image
          alt="icon"
          src={WhatWeOffer}
          loading="lazy"
          className="w-full relative z-10" width={733} height={500}/>
      </div>
      {/* </div> */}
    </section>
  );
};
