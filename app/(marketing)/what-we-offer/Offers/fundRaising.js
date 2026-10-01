import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const FundIcon = staticUrl + "/home/images/swiper/fund-raising.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const FundRaising = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="relative lg:order-1 md:order-2 small-500:order-2 flex items-center">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="team" src={FundIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
      <div className="lg:order-2 md:order-1 small-500:order-1 flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
        <div className="w-full flex flex-col gap-6 items-start lg:w-[480px] small-500:pt-0 small-500:mb-10">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Fundraising
          </h2>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Launch a campaign to raise funds for new equipment, expansion, new
            products, and a few other verifiable purposes.
          </p>
        </div>
      </div>
    </div>
  );
};
