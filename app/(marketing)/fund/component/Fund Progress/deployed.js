import Image from 'next/image';
import { deploymentCard } from '../../../../../data/marketing/fund';
export const ProgressDeployment = () => {
  return (
    <div className="flex flex-col items-start gap-6 h-full w-full small-500:gap-4">
      <p className="lg:w-[514px] text-[24px] font-semibold leading-150 text-blue-strong small-500:text-[20px]">
        The Fund will be deployed in three ways, primarily:
      </p>
      <div className="flex gap-4 w-full small-500:flex-col small-500:pr-4">
        {deploymentCard.map((list, index) => (
          <div
            key={index}
            className="flex w-full rounded-xl border border-gray-300-custom bg-white px-5 py-4"
          >
            <div className="flex flex-col gap-3 whitespace-nowrap">
              <Image alt="img" src={list.icon} width={24} height={24} />
              <p className="text-[#4A4A4A] text-[20px] font-medium small-500:text-[16px]">
                {list.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
