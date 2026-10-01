import { DifferenceCard } from './differenceCard';
import { differenceDetails } from '../../../../../data/marketing/fund';
export const FundDifference = () => {
  return (
    <div className="w-full h-full mb-[150px] flex flex-col gap-[120px] small-500:gap-[41px] small-500:mb-[120px]">
      <div className="w-full flex justify-center">
        <h2 className="text-blue-strong text-[40px] h-full font-semibold leading-110 small-500:text-[24px]">
          How we are different!
        </h2>
      </div>
      <DifferenceCard content={differenceDetails} />
    </div>
  );
};
