import { VisionCard } from './visionCard';

export const FundVision = () => {
  return (
    <div className="w-full mb-[150px] lg:h-[576px] md:h-full small-500:h-full small-500:mb-[120px]">
      <div className=" h-full flex flex-col lg:gap-[148px] lg:mx-[189px] md:gap-[37px] md:mx-6 small-500:mx-4 small-500:gap-[37px]">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-blue-strong text-[40px] font-semibold leading-110 small-500:text-[24px] small-500:text-center">
            Our vision for the size of this fund
          </h2>
          <p className="w-[498px] text-blu-ray-300 text-[20px] font-medium leading-150 small-500:text-[16px] small-500:text-center small-500:w-full">
            To provide the lift and space that Black business owners need, this
            fund must match the scale of those that have driven growth for
            businesses owned by other groups.
          </p>
        </div>
        <div className="w-full mt-auto flex lg:flex-row md:flex-col sm:flex-col gap-8 lg:justify-center md:justify-start md:items-center relative lg:h-[270px] md:h-full small-500:flex-col">
          <VisionCard />
        </div>
      </div>
    </div>
  );
};
