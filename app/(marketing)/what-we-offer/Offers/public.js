import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const PublicIcon = staticUrl + "/home/images/swiper/public-businessNew.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";
import { profile } from '../../../../data/marketing/what-we-offer'

export const Public = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="relative lg:order-1 md:order-2 small-500:order-2 flex items-start">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="platform" src={PublicIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
      <div className="lg:order-2 md:order-1 small-500:order-1 flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
        <div className="w-full pt-10 flex flex-col items-start gap-6 lg:w-[480px] small-500:pt-0 small-500:mb-10">
          <h2 className="text-blue-strong md:text-[32px] font-semibold leading-110 text-[20px]">
            Customizable Public Profiles
          </h2>
          <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
            Increase your web presence with a beautiful, easy-to-follow
            profile designed to show potential clients and customers - on and
            off our site -- what you can offer.
          </p>
          <div className="flex gap-6 flex-col w-full">
            {profile.map((text) => (
              <div key={text.id} className="flex gap-5 w-full">
                <div className="border-l border-blu-ray-300"></div>
                <p className="h-full md:text-[20px] font-medium text-blu-ray-300 leading-150 text-[16px]">
                  {text.parag}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
