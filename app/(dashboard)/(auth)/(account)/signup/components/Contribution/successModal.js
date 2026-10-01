import React from 'react';
import Image from 'next/image';
import Orisuun from '../../../../../../../public/home/icons/Orisunn-LOGO.svg';
import { MediaLinks } from '../../../../../../(marketing)/how-you-can-help-us/components/TellUs';

export const SuccessModal = () => {
  return (
    <main className="lg:w-[600px] lg:h-[680px] h-full w-full small-1000:px-4 pt-6 lg:pb-10 ">
      <section className="w-full h-full small-1000:flex-col hide-scrollbar  ">
        <div className="flex justify-center small-1000:justify-start">
          <Image src={Orisuun} alt="Orisuun" width={131} height={38} />
        </div>
        <div className="flex flex-col items-center justify-center gap-[44px] lg:gap-[53px] lg:flex-col-reverse mt-10 lg:mt-12">
          <p className="text-[24px] leading-[150%] text-[#001E5F] font-semibold lg:px-[78px] lg:mt-[53px] text-center">
            You have successfully contributed to the Black Wealth Fund
          </p>
          <Image
            src="/fund/success.svg"
            alt="sucess"
            width={173}
            height={177}
          />
        </div>

        <div className="mt-8 flex flex-col gap-6 justify-center items-center">
          <p className="text-[16px] text-[#5B657B]">Tell the world about it</p>
          <MediaLinks />
        </div>
      </section>
    </main>
  );
};
