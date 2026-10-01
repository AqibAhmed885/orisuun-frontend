import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const Blurs = staticUrl + "/what we offer/platformBlur.svg";
const CofounderIcon = staticUrl + "/home/images/swiper/founder.svg";

export const Cofounder = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px] ">
      <div className="relative lg:order-1 md:order-2 small-500:order-2 flex items-center">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="platform" src={CofounderIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-50px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
      <div className="w-full lg:order-2 md:order-1 small-500:order-1 flex flex-col gap-6 md:gap-10 lg:w-[480px] small-500:pt-0 small-500:mb-10 ">
        <div className="flex flex-col items-start">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Co-founder Match
          </h2>
        </div>
        <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
          Find the perfect people to propel your business or idea into its next
          phase, with precision and confidence.
        </p>
        <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
          Our co-founder matching system allows members to create easily
          searchable posts designed to fill specific gaps in a leadership team’s
          domain coverage.
        </p>
      </div>
    </div>
  );
};
