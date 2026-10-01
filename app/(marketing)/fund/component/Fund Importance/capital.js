import { CapitalizationTable } from './CapitalizationTable';

export const FundCapitalization = () => {
  return (
    <div className="flex flex-col w-full gap-4 small-500:gap-0">
      <div className="flex flex-col items-start gap-4 pt-5 lg:pt-0 small-500:mb-3 ">
        <h1 className="text-blue-strong text-[32px] font-semibold leading-150 small-500:text-[20px]">
          Capitalization Table
        </h1>
        <p className="text-[12px] text-blu-ray-300 font-medium leading-150 small-500:text-[16px]">
          Simplified for illustrative purpuses
        </p>
      </div>
      <div className=" flex flex-col gap-6 small-500:mb-6">
        <div className="overflow-x-auto hide-scrollbar ">
          <CapitalizationTable />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-blu-ray-300 text-[16px] font-medium leading-[24px] ">
          Cap table and records management coming to Orisuun in 2025
        </p>
      </div>
    </div>
  );
};
