'use client';
import { useEffect, useRef, useState } from 'react';
import RevenueChart from '../../../../../components/marketing/SVG/RevenueChart';
import RevenueChartAnimated from '../../../../../components/marketing/SVG/RevenueChartAnimated';
import Image from 'next/image';

const SmallScreenChart = `${process.env.NEXT_PUBLIC_STATIC_URL}/smallscreenchart.png`;


export const ImportanceImage = () => {
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const firstImageRef = useRef(null);

  const checkForScrollEvent = () => {
    if (firstImageRef.current) {
      const { top } = firstImageRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      top <= windowHeight * 0.4
        ? setShowSecondImage(true)
        : setShowSecondImage(false);
    }
  };

  const checkForScreenSize = () => {
    const width = window.innerWidth;
    setIsSmallScreen(width <= 768);
  };

  useEffect(() => {
    window.addEventListener('scroll', checkForScrollEvent);
    window.addEventListener('resize', checkForScreenSize);
    checkForScreenSize();

    return () => {
      window.removeEventListener('scroll', checkForScrollEvent);
      window.removeEventListener('resize', checkForScreenSize);
    };
  }, []);

  return (
    <div
      className={`relative lg:overflow-hidden lg:h-full max-h-[748px]  flex justify-center items-center `}
    >
      <div
        ref={firstImageRef}
        className={`flex justify-center items-center transition-opacity duration-300 ease-in-out `}
      >
        <RevenueChart className={`w-full h-full object-contain`} />
      </div>

      {isSmallScreen ? (
        <Image
          alt="small-image"
          src={SmallScreenChart}
          className={`absolute  top-0 w-full  max-h-[451px] sm:max-h-[727px]  flex justify-center items-center  ${showSecondImage ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300 ease-in-out`}
          width={288}
          height={322}
        />
      ) : (
        <div
          className={`absolute w-full flex justify-center items-center ${showSecondImage ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300 ease-in-out`}
        >
          <RevenueChartAnimated className={`w-full h-full object-contain`} />
        </div>
      )}
    </div>
  );
};
