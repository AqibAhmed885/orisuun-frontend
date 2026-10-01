'use client';

import { HeroCardFund } from './heroCardFund';
import { HeroFundArt } from './heroFundArt';
import FundBtn from '../FundBtn';

export const HeroFund = () => {
  return (
    <div className="h-full flex flex-col md:px-5 small-500:px-[16px] small-500:gap-[120px] md:mb-[150px] small-500:mb-[120px] sm:mb-[250px]">
      <div className="h-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col lg:gap-0 md:gap-[60px] small-500:gap-[60px] mb-[70px]">
        <div className="lg:mt-[173px] flex flex-col items-start xl:ml-20 lg:ml-10 md:mt-[80px] small-500:mt-[60px] 2k:w-[658px] 3xl:w-[658px] xl:w-[500px] lg:w-[400px] small-500:w-full">
          <h1 className="2k:max-w-[578.16px] 3xl:max-w-[578.16px] lg:max-w-[450px] md:max-w-[578.16px] mb-8 small-500:mb-6 text-blue-strong 2k:text-[48px] 3xl:text-[48px] xl:text-[45px] lg:text-[35px] md:text-[48px] small-500:text-[28px] font-semibold leading-110 ">
            Empower Black business owners with Orisuun’s Black Wealth Fund
          </h1>
          {/* <p className="lg:max-w-[358px] mb-5 text-blu-ray-300 text-[20px] small-500:text-[16px] leading-150 font-medium ">
            We&apos;re helping Black-owned businesses around the world catch up.{' '}
          </p> */}
          <p className="lg:w-[370px] text-[20px] small-500:text-[16px] font-medium text-blu-ray-300 leading-150 mb-10">
            Be a part of this Black ownership movement.
          </p>
          <div className="flex lg:justify-start md:justify-center small-500:justify-center w-full lg:mb-[136px] md:mb-[16px] small-500:mb-[16px]">
            <FundBtn
              className={`px-5 py-[10px] text-white text-[16px] font-bold leading-150 whitespace-nowrap rounded-full bg-nav-blue flex justify-center items-center small-500:text-[14px]`}
            >
              Make a Contribution
            </FundBtn>
          </div>
        </div>
        <div className="flex-1 xl:mr-[32.52px] md:mr-0 small-500:mr-0">
          <HeroFundArt />
        </div>
      </div>
      <div className="w-full md:h-[184px] sm:h-full md:mb-0 mt-auto">
        <div className="h-full flex lg:gap-[31px] md:gap-3 small-500:gap-[16px] md:flex-row sm:flex-col small-500:flex-col items-center sm:gap-[15px] xl:mx-20 lg:mx-15 md:mx-5 sm:mx-5 small-500:mx-0 justify-center">
          <HeroCardFund />
        </div>
      </div>
    </div>
  );
};
