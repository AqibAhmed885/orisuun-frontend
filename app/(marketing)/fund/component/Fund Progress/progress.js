import { ProgressDeployment } from './deployed';
import { ProgressEligible } from './eligible';
export const FundProgress = () => {
  return (
    <div className="w-full bg-gray-100-custom py-20 pl-20 pr-[157px] mb-[150px] lg:px-20 md:px-6 small-500:px-4 small-500:mb-[120px] small-500:pr-0 small-500:py-10">
      <div className="w-full flex xl:flex-row lg:flex-col md:flex-col small-500:flex-col xl:gap-0 md:gap-[51px] small-500:gap-[51px]">
        <div className="flex flex-col items-start mr-[212px] small-500:mr-0 lg:w-[336px]">
          <h2 className="text-blue-strong text-[40px] leading-110 font-semibold mb-6 small-500:text-[24px]">
            Track Our Progress
          </h2>
          <p className="font-medium text-[20px] text-blu-ray-300 leading-150">
            The Fund will begin deploying its resources in May of 2027
          </p>
        </div>
        <div className="w-full flex flex-col gap-[60px] small-500:gap-[52px]">
          <ProgressDeployment />
          <ProgressEligible />
        </div>
      </div>
    </div>
  );
};
