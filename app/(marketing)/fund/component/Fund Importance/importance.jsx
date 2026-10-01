import { FundCapitalization } from './capital';
import { ImportanceImage } from './importanceImages';

export const HeroFundImportance = () => {
  return (
    <div className="w-full h-full mb-[150px] flex flex-col md:px-6 small-500:px-4 small-500:mb-[120px]">
      <div className="w-full h-full mb-3 flex flex-col gap-[32px] small-500:gap-[24px]">
        <div className="flex justify-center w-full">
          <div className="flex flex-col items-center gap-6 ">
            <h3 className="w-full text-blue-strong text-[40px] small-500:text-[24px] leading-110 font-semibold">
              Why the Fund is important?
            </h3>
            <div className="flex flex-col items-center small-500:gap-2">
              <p className="text-blu-ray-300 text-[20px] small-500:text-[16px] font-medium leading-150">
                Access to capital is critical at every stage
              </p>
              <p className="text-blu-ray-300 text-[20px] small-500:text-[16px] font-medium leading-150">
                Let us show you how
              </p>
            </div>
          </div>
        </div>
      </div>
      <ImportanceImage />
      <div className="mt-[200px] sm:mt-[320px] lg:mt-[60px] ">
        <div className="xl:px-20 lg:px-0">
          <FundCapitalization />
        </div>
      </div>
    </div>
  );
};
