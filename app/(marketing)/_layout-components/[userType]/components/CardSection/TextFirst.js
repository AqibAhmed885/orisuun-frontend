import Image from 'next/image';
import Link from 'next/link';

export const TextFirst = ({
  image,
  heading,
  paragraph1,
  paragraph2,
  paragraph3,
  buttonText,
  link
}) => {
  return (
    <div className="grid items-center grid-cols-1 gap-10 px-4 lg:px-16 sm:grid-cols-2">
      <div className="lg:w-[515px] w-full flex flex-col items-start sm:gap-10 gap-6">
        <h5 className="sm:text-[32px] text-[24px] leading-[35px] text-blue-strong font-semibold">
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
        <button className="flex justify-center items-center px-5 py-[10px] bg-[#2357C6] rounded-full text-[16px] font-bold leading-[24px] text-white ">
          <Link href={link}>{buttonText}</Link>
        </button>
      </div>
      <Image src={image} alt={heading.slice(0, 10)} width={670} height={600} />
    </div>
  );
};
