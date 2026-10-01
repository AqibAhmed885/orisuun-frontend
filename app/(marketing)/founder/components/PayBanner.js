'use client';

import React from 'react';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const PayBanner = () => {
  return (
    <section className="xs:p-4 sm:!p-20 sm:!pb-28 sm:!h-auto">
      <div
        className="xs:[background-position-x:-14%] 3xl:![background-position-x:0%] lg:![background-position-x:-0.5%] 2k:![background-position-x:-2.5%] bg-[#2C57A4] bg-[image:var(--star-left-sm)] xs:bg-banner-vector-sm sm:!bg-banner-vector sm:bg-left-top md:bg-[image:var(--star-left)] bg-no-repeat bg-left-top md:h-[266px] rounded-[12px]"
        style={{
          '--star-left-sm': `url('${staticUrl}/about/images/star2-md.svg')`,
          '--star-left': `url('${staticUrl}/about/images/star2.svg')`,
        }}
      >
        <div
          className="xs:[background-position-x:114%] 3xl:![background-position-x:100%] lg:![background-position-x:100.5%] 2k:![background-position-x:102.5%] min-h-10 sm:!min-h-0 bg-[image:var(--star-right-sm)] md:bg-[image:var(--star-right)] sm:bg-right-bottom xs:bg-banner-vector-sm sm:!bg-banner-vector bg-no-repeat bg-right-bottom h-full w-full rounded-xl flex flex-col gap-[40px] justify-center items-center text-center md:px-0 md:py-0 xs:px-10 sm:!px-4 py-10"
          style={{
            '--star-right-sm': `url('${staticUrl}/about/images/star1-md.svg')`,
            '--star-right': `url('${staticUrl}/about/images/star1.svg')`,
          }}
        >
          <h5 className="max-w-2xl text-white text-[24px] md:text-[40px] leading-[29px] md:leading-[44px] font-semibold">
            &quot;Orisuun is a place where you can do your part and get paid
            too.&quot;
          </h5>
        </div>
      </div>
    </section>
  );
};
