import Image from 'next/image';
import Link from 'next/link';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const vector = staticUrl + "/userTypes/images/vector.svg";


export const ClaimCard = ({
  image,
  heading,
  paragraph1,
  paragraph2,
  paragraph3,
  buttonText,
  link = "/signup",
}) => {
  return (
    <div className="grid items-center grid-cols-1 gap-10 py-4 px-4 lg:px-4 sm:grid-cols-2">
      <div className="lg:w-[515px] w-full flex flex-col items-start sm:gap-10 gap-6">
        <h5 className=" text-4xl leading-[35px] text-white font-medium">
          {heading}
        </h5>
        <div className="flex flex-col sm:gap-3 gap-4">
          <p className="text-white sm:text-lg text-[16px] leading-[30px] font-medium">
            {paragraph1}
          </p>
          <p className="text-white relative sm:text-xl text-[16px] leading-[30px] font-medium">
            {paragraph2}
            <Image src={vector} alt={heading.slice(0, 10)} width={670} height={600} className='absolute right-24 w-24  md:right-80'/>
          </p>
          {paragraph3 && (
            <p className="text-white sm:text-[20px] text-[16px] leading-[30px] font-medium">
              {paragraph3}
            </p>
          )}
        </div>
        <button className="flex justify-center items-center px-5 md:inline-flex mt-6  w-full lg:w-48 py-[10px] bg-white rounded-full text-[16px] font-bold leading-[24px] text-blue-strong md:text-omblue-600  ">
          <Link href={link}>{buttonText}</Link>
        </button>
      </div>
      <Image 
        src={image} 
        alt={heading.slice(0, 10)} 
        width={670} 
        height={460}
        placeholder="blur"
        blurDataURL={getShimmerPlaceholder(670, 460)}
      />
    </div>
  );
};
