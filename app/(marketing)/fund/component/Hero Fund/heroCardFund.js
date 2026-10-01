import { heroCardDetails } from '../../../../../data/marketing';

export const HeroCardFund = () => {
  return (
    <>
      {heroCardDetails.map((card, count) => (
        <div
          key={count}
          className="lg:w-[406px] w-full h-full border border-gray-300-custom bg-gray-100-custom rounded-xl"
        >
          <div className="mx-9 my-7 md:mx-4 md:my-5 small-500:mx-4 small-500:my-5">
            <div className="flex flex-col gap-6 small-500:gap-3">
              <h2 className="text-blue-strong text-[40px] small-500:text-[24px] font-semibold leading-110">
                {card.percent}
              </h2>
              <p className="text-blu-ray-300 leading-150 xl:text-[20px] lg:text-[18px] small-500:text-[16px] font-medium md:text-[14px]">
                {card.note}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
