'use client';
import { useState } from 'react';
import Image from 'next/image';
import Orisuun from '../../../../../../../public/home/icons/Orisunn-LOGO.svg';
import Mark from '../../../../../../../public/home/images/check.png';
import { Button } from '@/components/marketing';

const contribution = [
  'Issue grants to startups',
  'Make equity investments in Black-owned business',
  'Make loans and other debt-related investments in Black-owned business',
  'Create a guarantor pool for businesses applying for loans through traditional/old fashioned means',
  'Conduct helpful research on new and innovative ways to promote and cultivate Black business ownership',
  'Purchase property in our neighborhoods',
  'Provide excellent business education to current and future business owners around the world',
];

const Check = () => (
  <div className="w-[24px] h-[24px] p-[6px]">
    <Image src={Mark} alt="Checkmark" width={12} height={12} />
  </div>
);

export const MonthlyDetails = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHandler = () => {
    setIsOpen(!isOpen);
  };
  return (
    <section className="lg:bg-[#D5E8FA] h-full lg:w-1/2 w-full lg:p-10 rounded-tl-[20px] rounded-bl-[20px] ">
      <div className="flex flex-col items-start lg:gap-8 gap-4">
        <Image src={Orisuun} alt="Orisuun" width={131} height={38} />
        <div className="lg:w-[320px] w-full flex flex-col gap-2">
          <h2 className="text-blue-strong text-[24px] font-semibold leading-150 lg:drop-shadow-xl">
            Begin a Monthly Contribution
          </h2>
          <p className="text-blu-ray-300 text-[14px] font-medium leading-[130%]">
            Help Black business owners gain access to the same opportunities
            that others have enjoyed for so long
          </p>
        </div>
        <div className="lg:w-[381.46px] w-full flex flex-col gap-5 lg:mb-[90px] mb-10">
          <h4 className="text-blue-strong text-[16px] font-semibold leading-[24px] small-1000:hidden lg:block">
            Your contribution will be used to:
          </h4>
          <div className="flex items-center justify-between lg:hidden">
            <h4 className="text-blue-strong text-[16px] font-semibold leading-[24px] small-1000:block lg:hidden ">
              How the contribution is used?
            </h4>
            <div>
              {isOpen ? (
                <div className="size-5" onClick={toggleHandler}>
                  <Image
                    src={'/icons/arrowup.svg'}
                    alt="arrowup"
                    width={20}
                    height={20}
                  />
                </div>
              ) : (
                <button className="size-5" onClick={toggleHandler}>
                  <Image
                    src={'/icons/arrowdown.svg'}
                    alt="arrowdown"
                    width={20}
                    height={20}
                  />
                </button>
              )}
            </div>
          </div>
          {isOpen && (
            <div className="h-full lg:hidden flex flex-col gap-5 small-1000:gap-4 small-1000:w-full">
              {contribution.map((text, index) => (
                <div key={index} className="h-full flex gap-4">
                  {Check()}
                  <div className="w-full flex justify-start items-center">
                    <p className="text-blu-ray-300 text-[14px] font-medium leading-[130%]">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
              <div className=" w-full lg:hidden pb-5">
                <p className="text-blue-strong text-[14px] font-medium leading-[130%]">
                  Please contribute confidently knowing that over 99% of the
                  funds we receive go directly to the high-impact programs
                  listed above.
                </p>
              </div>
            </div>
          )}
          <div className="h-full lg:flex flex-col gap-5 small-1000:gap-4 small-1000:w-full small-1000:hidden">
            {contribution.map((text, index) => (
              <div key={index} className="h-full flex gap-4">
                {Check()}
                <div className="w-full flex justify-start items-center">
                  <p className="text-blu-ray-300 text-[14px] font-medium leading-[130%]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:w-[389.25px] w-full small-1000:hidden">
        <p className="text-blue-strong text-[14px] font-medium leading-[130%]">
          Please contribute confidently knowing that over 99% of the funds we
          receive go directly to the high-impact programs listed above.
        </p>
      </div>
    </section>
  );
};
