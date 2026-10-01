'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '../../../../../utils/utils';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const right = `${staticUrl}/icons/right.svg`;

export const DifferenceCard = ({content}) => {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setVisibleCards(3);
      } else {
        setVisibleCards(3);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (visibleCards >= 4) {
      setFocusedIndex(currentIndex + 2);
    } else {
      setFocusedIndex(currentIndex + 1);
    }
  }, [currentIndex, visibleCards]);

  const handlePrevClick = () => {
    if (currentIndex > 0 && focusedIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      containerRef.current.scrollTo({
        left: (currentIndex - 1) * (436 + 104),
        behavior: 'smooth',
      });
    }
  };

  const handleNextClick = () => {
    if (currentIndex <= 6) {
      setCurrentIndex(currentIndex + 1);
      containerRef.current.scrollTo({
        left: (currentIndex + 1) * (436 + 104),
        behavior: 'smooth',
      });
    }
  };

  // this handles the logic for the first card since by default the focusedIndex is 2 i.e currentIndex + 2 used for the visible card state

  const handleFirstClick = () => {
    if (focusedIndex === 1) {
      setFocusedIndex(focusedIndex - 1);
      containerRef.current.scrollTo({
        left: (focusedIndex - 1) * (436 + 104),
        behavior: 'smooth',
      });
    }
  };

  // this is also same logic as the first card but for the last card

  const handleLastClick = () => {
    if (focusedIndex >= 4) {
      setFocusedIndex(focusedIndex + 1);
      containerRef.current.scrollTo({
        left: (focusedIndex + 1) * (436 + 104),
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const cardWidth = 436 + 104;
      const newCurrentIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newCurrentIndex);
    }
  };

  return (
    <div className="mb-[105px] h-full w-full relative small-500:mb-0 small-500:px-4">
      <div
        className="flex w-full overflow-x-auto gap-[104px] small-500:gap-4 py-4 hide-scrollbar small-500:justify-start"
        onScroll={handleScroll}
        ref={containerRef}
      >
        {content.map((item, index) => (
          <div
            key={index}
            tabIndex={0}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            className={cn(
              `sm:w-[436px] relative max-h-[296px] small-500:w-[80%] flex-shrink-0 transition-all rounded-xl p-[26px] small-500:p-4`,
              focusedIndex === index && !item.main ? 'border border-[#2357C6] shadow-lg' : '',
              item.main ? 'bg-why-we-created-orisun-bg shadow-different-shadow-blue-2' : 'bg-white shadow-different-shadow')}
          >
            {
              item.main &&
              <>
                <Image 
                  src={`${staticUrl}/about/icons/star-bg.svg`} 
                  alt='star bg' 
                  width={120} 
                  height={120} 
                  className='absolute top-0 left-0 z-10' 
                  priority={false}
                  loading="lazy"
                />
                <Image 
                  src={`${staticUrl}/about/icons/circle-bg.svg`} 
                  alt='circle bg' 
                  width={110} 
                  height={110} 
                  className='absolute bottom-0 right-0' 
                  priority={false}
                  loading="lazy"
                />
              </>
            }
            <div className="w-full h-full flex flex-col items-center gap-6">
              <Image
                src={item.icon}
                alt="difference icon"
                width={32}
                height={32}
                priority={index < 3} // Prioritize first 3 icons
                loading={index < 3 ? "eager" : "lazy"}
              />
              <div className="flex flex-col items-center gap-3 w-full">
                <h3 className={cn('text-lg md:text-xl md:leading-[26px] leading-[23.4px] font-semibold text-center', item.main ? 'text-white' : 'text-blue-strong')}>
                  {item.title}
                </h3>
                <p className={cn('text-sm md:text-xl md:leading-[30px] leading-[21px] text-center z-10', item.main ? 'text-white' : 'text-[#5B657B]')}>
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {focusedIndex === 1 ? (
        <button
          className={`absolute left-0 top-1/2 z-20 transform -translate-y-1/2 p-2 rounded-full shadow-md bg-white small-500:hidden`}
          onClick={handleFirstClick}
        >
          <Image
            src={right}
            className="rotate-180"
            width={40}
            height={40}
            alt="previous"
          />
        </button>
      ) : (
        <button
          className={`absolute left-0 top-1/2 z-20 transform -translate-y-1/2 p-2 rounded-full shadow-md small-500:hidden ${currentIndex === 0 ? 'hidden' : 'block bg-white'
            }`}
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          <Image
            src={right}
            className="rotate-180"
            width={40}
            height={40}
            alt="previous"
          />
        </button>
      )}
      {focusedIndex >= 4 ? (
        <button
          className={`absolute right-0 top-1/2 z-20 transform -translate-y-1/2 p-2 rounded-full shadow-md bg-white small-500:hidden ${focusedIndex === 5 ? 'hidden' : 'block'
            }`}
          onClick={handleLastClick}
          disabled={focusedIndex === 5}
        >
          <Image src={right} width={40} height={40} alt="next" />
        </button>
      ) : (
        <button
          className={`absolute right-0 top-1/2 z-20 transform -translate-y-1/2 p-2 rounded-full shadow-md small-500:hidden ${currentIndex >= content.length - visibleCards &&
            focusedIndex >= 5
            ? 'hidden'
            : 'bg-white block'
            }`}
          onClick={handleNextClick}
          disabled={currentIndex >= content.length - visibleCards}
        >
          <Image src={right} width={40} height={40} alt="next" />
        </button>
      )}
    </div>
  );
};
