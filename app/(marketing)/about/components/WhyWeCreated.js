'use client';
import { DifferenceCard } from '../../fund/component/Fund Difference/differenceCard';
import { whyWeCreatedDetails } from '../../../../data/marketing/whyWeCreatedData';
export const WhyWeCreated = () => {
  return (
    <section id="why-we-created" className="pt-[120px] md:pt-[150px] w-full pl-4 pr-0 md:px-0 mb-[120px] md:mb-0">
      <div className="w-full flex flex-col gap-[41px] md:gap-[120px]">
        <div className="flex justify-center w-full">
          <h2 className="text-blue-strong text-[40px] h-full font-semibold leading-110 text-center">
            Why we created Orisuun
          </h2>
        </div>

        <DifferenceCard content={whyWeCreatedDetails} />
      </div>
    </section>
  );
};
