import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const PortalIcon = staticUrl + "/home/images/swiper/fund-raising.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const CurrentFundraising = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="w-full flex flex-col gap-6 items-start lg:w-[480px] small-500:pt-0 small-500:mb-10 ">
        <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
          Current Fundraising
        </h2>
        <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
          Crowdfunding for Black-owned Businesses
          <br />
          Our platform is built for one purpose: to help Black-owned businesses
          grow and succeed. We connect entrepreneurs with people who want to see
          real change in the marketplace. Whether you’re looking to fund a new
          idea or back an established business that’s ready to scale, your
          contribution directly impacts the future of Black entrepreneurship.
        </p>
        <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
          We make it simple to find, vet, and support the Black-owned businesses
          that matter to you. By backing these businesses, you’re not just
          making a financial contribution – you’re helping to level the playing
          field and create economic opportunities where they’re needed most.
        </p>
        <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
          Our platform gives you the tools to find and choose exciting
          opportunities around the world and get rewarded, directly, in the
          process. Contribute or become a sponsor today.
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
