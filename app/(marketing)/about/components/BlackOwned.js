'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export const BlackOwned = () => {
  const sectionRef = useRef(null);
  const [, setSectionTop] = useState(0);
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setSectionTop(rect.top + window.pageYOffset);
      }
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 md:px-12 xs:mt-5 md:mt-0 md:block relative"
    >
      <div className="bg-about h-[492px] rounded-[12px] mb-[150px]">
        <div
          className="bg-[image:var(--circle5)] bg-no-repeat bg-left-top w-full h-full"
          style={{
            '--circle5': `url(${staticUrl}/about/icons/circle5.svg)`,
          }}
        >
          <div
            className="md:bg-[image:var(--spike5)] bg-contain md:!p-20 xs:p-10 bg-no-repeat bg-right w-full h-full flex flex-col gap-10 justify-center items-center text-center rounded-[12px]"
            style={{
              '--spike5': `url(${staticUrl}/about/icons/spike5.svg)`,
            }}
          >
            <p className="text-white max-w-[706px] text-[24px] md:text-[40px] leading-[29px] md:leading-[44px] font-semibold">
              Orisuun is 100% Black-Owned
            </p>
            <p className="text-white max-w-[706px] text-[24px] md:text-[40px] leading-[29px] md:leading-[44px] font-semibold">
              The company is solely dedicated to economic empowerment, and it
              will always be that way.
            </p>
            <Link
              href={'/founder'}
              className="bg-white hover:bg-opacity-90 px-5 py-2.5 h-14 mt-5 flex justify-center rounded-full items-center md:text-2xl font-semibold text-nav-blue"
            >
              Meet The Founder
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
