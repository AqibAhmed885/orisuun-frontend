import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const PlatformIcon = staticUrl + "/home/images/swiper/peer-transactions.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const Platform = () => {
  return (
    <section className="flex flex-col w-full">
      <div className="w-full flex justify-center mb-[116px] small-500:mb-[40px]">
        <h2 className="text-blue-strong md:text-[40px] font-semibold leading-110 text-center text-[24px] ">
          Platform Functionality
        </h2>
      </div>
      <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between lg:mb-[79.6px] md:mb-[0px] small-500:mb-[0px]">
        <div className="w-full flex flex-col items-start justify-start gap-6 lg:w-[480px] xl:pt-[26px] lg:pt-[0px] small-500:pt-0 small-500:mb-10">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Escrow-based Peer-to-Peer Transactions
          </h2>
          <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
            In-platform payment system that allows members to do business on the
            site.
          </p>
          <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
            Orisuun operates as an ‘escrow agent’ to ensure payment is made only
            after services or goods have been received.
          </p>
        </div>
        <div className="relative">
          <div className="relative z-10 md:w-full small-500:h-full">
            <Image alt="platform" src={PlatformIcon} width={733} height={500}/>
          </div>
          <div className="absolute z-0 lg:w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
            <Image src={Blurs} alt="blurimage" width={733} height={500}/>
          </div>
        </div>
      </div>
    </section>
  );
};
