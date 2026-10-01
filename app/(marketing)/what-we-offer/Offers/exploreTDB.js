import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const ExploreIcon = staticUrl + "/home/images/swiper/explore.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const ExploreTDB = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="relative lg:order-1 md:order-2 small-500:order-2 flex items-center">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="platform" src={ExploreIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-50px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
      <div className="w-full lg:order-2 md:order-1 small-500:order-1 flex flex-col gap-6 md:gap-10 lg:w-[480px] small-500:pt-0 small-500:mb-10">
        <div className="flex flex-col items-start gap-6">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Explore
          </h2>
        </div>
        <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
          Find exactly what you need or want around the globe – explore our
          database of businesses, experts, professionals, and investors by
          industry, country, region, city, and many other parameters.
        </p>
        <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
          Our powerful Explore tool enable members to zero in on exact matches
          using tags, keywords, location, and a robust set of filter options.
        </p>
      </div>
    </div>
  );
};
