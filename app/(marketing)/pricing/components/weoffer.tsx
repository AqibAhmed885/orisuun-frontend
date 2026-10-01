'use client';


import { LazySectionWithSkeleton } from '@/components/LazySection';
import { Discover } from '../../what-we-offer/Offers/discover';
import { Collab } from '../../what-we-offer/Offers/Collab';
import { Grow } from '../../what-we-offer/Offers/Grow';
import { Dobusiness } from '../../what-we-offer/Offers/dobusiness';
import { Access } from '../../what-we-offer/Offers/Access';


export const WeOffer = () => {
  return (
    <div className="w-full flex flex-col ">
      <div className="w-full flex flex-col">
        {/* <div className="w-full lg:pl-20 md:pl-10 sm:pl-0 small-500:pl-0">
          <Explore />
        </div> */}
        <LazySectionWithSkeleton
          skeletonHeight="600px"
          className="p-5 lg:p-10 md:container md:mx-auto w-full lg:py-120 relative py-16 before:absolute before:bg-nav-blue before:z-10 before:top-0 before:bottom-0 before:h-full before:-left-[100%] before:-right-[100%]"
        >
          <div id="discover-section">
            <Discover />
          </div>
        </LazySectionWithSkeleton>
        <LazySectionWithSkeleton
          skeletonHeight="600px"
          className="p-5 lg:p-10 md:container md:mx-auto w-full lg:py-120 relative py-16 before:absolute before:bg-olblue-500 before:z-10 before:top-0 before:bottom-0 before:h-full before:-left-[100%] before:-right-[100%]"
        >
          <div id="collab-section">
            <Collab />
          </div>
        </LazySectionWithSkeleton>
        <LazySectionWithSkeleton
          skeletonHeight="600px"
          className="p-5 lg:p-10 md:container md:mx-auto w-full lg:py-120 relative py-16 before:absolute before:bg-nav-blue before:z-10 before:top-0 before:bottom-0 before:h-full before:-left-[100%] before:-right-[100%]"
        >
          <div id="grow-section">
            <Grow />
          </div>
        </LazySectionWithSkeleton>
        {/* <LazySectionWithSkeleton
          skeletonHeight="200px"
          className="lg:p-10 md:container md:mx-auto w-full relative md:py-10 py-24 before:absolute before:bg-olblue-500 before:z-10 before:top-0 before:bottom-0 before:h-full before:-left-[100%] before:-right-[100%]"
        >
          <div className="flex md:flex-row flex-col justify-between relative z-10 items-center gap-10">
            <h2 className="md:text-[50px] text-[40px] text-white leading-[116%] font-semibold text-center">
              Get a FREE Account for One <br /> Year (3 Easy Steps)
            </h2>
            <a
              href="/pricing#get-a-free-account"
              className="py-2 text-h2 md:h-[70px] h-[64px] font-semibold text-white bg-blue-strong rounded-full w-[242px] flex items-center justify-center"
            >
              Ends Soon
            </a>
          </div>
        </LazySectionWithSkeleton> */}
        <LazySectionWithSkeleton
          skeletonHeight="600px"
          className="p-5 lg:p-10 md:container md:mx-auto w-full lg:py-120 relative py-16 before:absolute before:bg-[#16357A] before:z-10 before:top-0 before:bottom-0 before:h-full before:-left-[100%] before:-right-[100%]"
        >
          <div id="dobusiness-section">
            <Dobusiness />
          </div>
        </LazySectionWithSkeleton>
        <LazySectionWithSkeleton
          skeletonHeight="600px"
          className="w-full lg:p-10 md:container md:mx-auto lg:py-120 relative py-16 before:absolute before:bg-blue-500 before:z-10 before:top-0 before:bottom-0 before:h-full before:-left-[100%] before:-right-[100%]"
        >
          <div id="access-section">
            <Access />
          </div>
        </LazySectionWithSkeleton>
      </div>
    </div>
  );
};
