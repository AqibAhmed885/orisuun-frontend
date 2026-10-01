import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const BoardIcon = staticUrl + "/home/images/swiper/directors.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const BoardMatching = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="w-full flex flex-col gap-6 items-start lg:w-[480px] small-500:pt-0 small-500:mb-10">
        <div className="w-full flex flex-col justify-between">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Board Member Matching
          </h2>
        </div>
        <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
          Take your company’s governance and stability up a notch. Bringing on
          the right board member who is aligned and properly motivated can
          greatly increase the longevity, stability, and long-term prospects of
          a business.
        </p>
        <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
          Our board member matching system allows members to create easily
          searchable posts designed to introduce your company to a world of
          exceptionally talented potential board members that your business
          would not otherwise have access to.
        </p>
      </div>
      <div className="relative">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="platform" src={BoardIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 lg:w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
    </div>
  );
};
