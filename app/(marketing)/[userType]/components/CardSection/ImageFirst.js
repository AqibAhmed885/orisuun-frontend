import { link } from 'fs';
import Image from 'next/image';
import Link from 'next/link';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';

export const ImageFirst = ({
  image,
  heading,
  paragraph1,
  paragraph2,
  paragraph3,
  buttonText,
  link1,
  link2 = "/signup",
}) => {
  return (
    <div className="grid items-center grid-cols-1 gap-10 px-4 lg:px-16 sm:grid-cols-2">
      <Image
        src={image}
        alt="market"
        className="mx-auto lg:mx-0 order-last sm:order-first"
        width={670}
        height={600}
        placeholder="blur"
        blurDataURL={getShimmerPlaceholder(670, 600)}
        sizes="(max-width: 768px) 100vw, 670px"
      />
      <div className="lg:w-[515px] w-full flex flex-col items-start sm:gap-10 gap-6">
        <h5 className="sm:text-[32px] text-[24px] leading-[35px] text-blue-strong font-medium">
          {heading}
        </h5>
        <div className="flex flex-col sm:gap-6 gap-4">
          <p className="text-blu-ray-300 sm:text-[20px] text-[16px] leading-[30px] font-medium">
            {paragraph1}
          </p>
          <p className="text-blu-ray-300 sm:text-[20px] text-[16px] leading-[30px] font-medium">
            {paragraph2}
          </p>
          {paragraph3 && (
            <p className="text-blu-ray-300 sm:text-[20px] text-[16px] leading-[30px] font-medium">
              {paragraph3}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="flex justify-center items-center px-5 py-[10px] bg-[#2357C6] rounded-full text-[16px] font-bold leading-[24px] text-white ">
            <Link href={link2}>{buttonText}</Link>
          </button>
          {(buttonText === 'Find new customers' || link1) ? (
            <button className="flex transition-all duration-200 justify-center items-center px-5 py-[10px] text-[#2357C6] rounded-full text-[16px] font-bold leading-[24px] border border-[#D8D9D9] hover:bg-nav-blue hover:text-white disabled:bg-[#C7C7C7]">
              <Link href={link1}>Learn More</Link>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
