import Image from 'next/image';
import Link from 'next/link';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';

export const TextFirst = ({
  image,
  heading,
  paragraph1,
  paragraph2,
  paragraph3,
  buttonText,
  link1 = "",
  link2 = "/signup",
}) => {
  return (
    <div className="grid items-center grid-cols-1 gap-10 px-4 lg:px-16 sm:grid-cols-2">
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
        <div className="flex sm:flex-row flex-col sm:gap-4 gap-3 w-full">
        <button className="flex justify-center items-center px-5 py-[10px] bg-[#2357C6] rounded-full text-[16px] font-semibold tracking-wide leading-[24px] text-white ">
            <Link href={link2}>{buttonText}</Link>
        </button>
        {
          link1 && (
            <Link
              href={link1}
              className="text-omblue-500  border px-5 py-[10px] rounded-full font-bold text-base leading-[24px]"
            >
              Learn more
            </Link>
          )
          }
          </div>
      </div>
      <Image 
        src={image} 
        alt={heading.slice(0, 10)} 
        width={670} 
        height={600}
        placeholder="blur"
        blurDataURL={getShimmerPlaceholder(670, 600)}
        sizes="(max-width: 768px) 100vw, 670px"
      />
    </div>
  );
};
