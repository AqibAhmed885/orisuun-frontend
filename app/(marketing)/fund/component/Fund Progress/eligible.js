
import Image from 'next/image';
import { eligibleCard } from '../../../../../data/marketing/fund';
export const ProgressEligible = () => {
  return (
    <div className="w-full h-full flex flex-col items-start gap-6 small-500:gap-5">
      <p className="font-semibold text-blue-strong text-[24px] leading-150 small-500:text-[20px]">
        Which businesses are eligible?
      </p>
      <div className="w-full flex gap-4 small-500:flex-col small-500:pr-4">
        {eligibleCard.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-3 py-4 px-5 h-full w-full rounded-xl border border-gray-300-custom bg-white"
          >
            <Image alt="img" src={card.icon} width={24} height={24} />
            <p className="text-[#4A4A4A] text-[20px] font-medium leading-150 small-500:text-[16px]">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
