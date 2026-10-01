'use client';

import Image from 'next/image';
import FundBtn from '../FundBtn';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const QuarterRing = `${process.env.NEXT_PUBLIC_STATIC_URL}/fund/ring.png`;
const QuarterStar = `${process.env.NEXT_PUBLIC_STATIC_URL}/fund/quart-star.png`;

const icons = [
  {
    ring: QuarterRing,
    star: QuarterStar,
  },
  {
    star: QuarterStar,
    ring: QuarterRing,
  },
];

export const FundSupport = () => {
  const searchParams = useSearchParams();
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  useEffect(() => {
    const cancelStatus = searchParams.get('isCancelOpen') === 'true';
    setIsCancelOpen(cancelStatus);
  }, [searchParams]);

  return (
    <div className="w-full mb-[129px] md:h-[404px] small-500:h-full small-500:mb-[120px] lg:px-20 md:px-6 small-500:px-4">
      <div className="bg-[#68A9DC] w-full rounded-[20px] h-full relative">
        {icons.map((icon, index) => (
          <div key={index}>
            {index === 0 ? (
              <>
                <div className="absolute top-0 md:block small-500:hidden">
                  <Image
                    alt="ring-left"
                    src={icon.ring}
                    width={160}
                    height={160}
                    priority={false}
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-0 md:block small-500:hidden">
                  <Image
                    alt="star-left"
                    src={icon.star}
                    width={200}
                    height={200}
                    className="rounded-bl-[20px]"
                    priority={false}
                    loading="lazy"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="absolute top-0 right-0 md:block small-500:hidden">
                  <Image
                    alt="star-right"
                    src={icon.star}
                    width={200}
                    height={200}
                    className="rounded-bl-[20px] rotate-[180deg]"
                    priority={false}
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-0 right-0">
                  <Image
                    alt="ring-right"
                    src={icon.ring}
                    width={160}
                    height={160}
                    className="rotate-[180deg]"
                    priority={false}
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>
        ))}
        <div className="flex flex-col lg:items-center whitespace-wrap small-500:px-4 small-500:pt-6">
          <p className="text-white font-semibold xl:text-[40px] mt-20 mb-6 leading-110 md:text-[26px] small-500:mb-[15px] small-500:mt-0 small-500:text-[24px] z-[3]">
            We wouldn&apos;t ask you to do anything we haven&apos;t done
            ourselves
          </p>
          <p className="text-white lg:w-[476px] lg:text-[20px] font-medium leading-150 text-center mb-[60px] md:text-[16px] small-500:text-[16px] small-500:text-start small-500:mb-[40px] z-[3]">
            That&apos;s why Orisuun&apos;s ownership has agreed to contribute
            the initial $10,000 to get the fund started.
          </p>
          <FundBtn
            className={`lg:bg-[#2c57a4] bg-white rounded-[88px] flex px-5 py-[10px] mb-3 small-500:mb-4 w-full justify-center`}
          >
            <p className="text-center lg:text-white text-[#2c57a4] text-[16px] font-bold leading-150">
              Support the Fund
            </p>
          </FundBtn>
          <FundBtn
            defaultContent="method"
            className={`text-center small-500:mb-6`}
            isCancelOpen={isCancelOpen}
          >
            <p className="text-white text-[14px] font-medium leading-[130%]">
              Cancel your subscription
            </p>
          </FundBtn>
        </div>
      </div>
    </div>
  );
};
