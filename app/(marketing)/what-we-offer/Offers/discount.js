import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const PortalIcon = staticUrl + "/home/images/swiper/discountNew.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const Discount = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="w-full flex flex-col gap-6 items-start lg:w-[480px] small-500:pt-0 small-500:mb-10 ">
        <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
          Discount Portal
        </h2>
        <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
          For our Partners and other verified business owners, the discount
          portal offers a warm introduction to new potential clients, where you
          can provide a meaningful discount to start a new, lasting client
          relationship.
        </p>
        <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
          For our verified business owners, the discount portal is a powerful
          tool to reduce costs and overhead, as members will find suppliers and
          vendors of all types eager to provide generous discounts to our
          members.
        </p>
      </div>

      <div className="relative">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="platform" src={PortalIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 lg:w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
    </div>
  );
};
