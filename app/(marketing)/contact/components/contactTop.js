import Image from 'next/image';
import React from 'react';

export const ContactTopListing = ({
  header,
  paragraph,
  svg,
  email,
  bgColor,
  addCurve,
}) => {
  return (
    <div
      className={`relative p-[32px_26px] w-full flex-[1_0_0] h-[310px] rounded-[12px] border border-gray-300-custom ${bgColor} flex flex-col items-start justify-center hover:scale-0.5 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out`}
    >
      {addCurve}
      <div className="flex flex-col gap-6 items-start small-500:items-center w-full">
        <div className=" rounded-sm bg-[#F2F7FC] small-500:w-[48px] w-[52px] small-500:h-[48px] h-[52px] flex justify-center items-center">
          <Image
            alt="SVG"
            src={svg}
            width={32}
            height={32}
            className="small-500:size-[29.54px] size-[32px]"
          />
        </div>
        <div className="w-full flex flex-col gap-8 small-500:items-center">
          <div className="flex flex-col gap-3 small-500:items-center">
            <h2 className=" xl:text-[24px] md:text-[22px] text-[18px] small-500:text-[18px] font-semibold leading-150 text-blue-strong small-500:text-center">
              {header}
            </h2>
            <p className="text-[#808181]  font-medium small-500:text-[16px] text-[16px] md:text-[18px] leading-150 small-500:text-center">
              {paragraph}
            </p>
          </div>
          <a
            href={`mailto:${email}`}
            className="text-[#2C57A4] = font-medium small-500:text-[18px] text-[18px] md:text-[20px] leading-150 hover:underline hover:underline-offset-[3px]"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
};
