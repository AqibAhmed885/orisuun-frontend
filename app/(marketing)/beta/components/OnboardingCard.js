import Image from 'next/image';

import { OnboardingCardData } from '../../../../data/marketing/OnboardingCardData';
export const OnboardingCard = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <>
      {OnboardingCardData.map((item, index) => (
        <div
          key={index}
          className={`max-w-[406.34px] px-[26px] pb-[26px] pt-8 bg-white shadow rounded-xl  border border-[#D8D9D9] transition-all duration-300 ${index === 1 ? 'max-h-[322px]' : 'max-h-[262px]'
            }`}
        >
          <div className="w-full h-full flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="w-[52px] h-[52px] p-3 bg-[#F2F7FC] rounded">
                <Image
                  alt="icon"
                  src={`${staticUrl}/beta/images/${item.icon}`}
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <div className="max-w-[353.33px] h-full flex flex-col gap-3">
              <div className="w-full h-[26px] flex justify-center items-center ">
                <h2 className="text-blue-strong text-[18px] leading-6 lg:text-[20px] font-semibold lg:leading-[26px] text-center">
                  {item.title}
                </h2>
              </div>
              <div
                className={`w-full ${index === 1 ? 'h-[150px] ' : 'h-[90px]'}`}
              >
                <p className="w-full text-center text-blu-ray-300 lg:text-[19.5px] font-medium lg:leading-150 text-base">
                  {item.parag}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
