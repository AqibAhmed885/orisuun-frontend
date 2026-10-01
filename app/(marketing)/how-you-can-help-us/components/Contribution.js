import Image from 'next/image';
import { useState, useEffect } from 'react';

const Contribution = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ left: false, right: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (imageType) => {
    setImagesLoaded(prev => ({ ...prev, [imageType]: true }));
  };

  return (
    <section className="mt-[120px] lg:mt-[150px] lg:px-[80px] px-4 mx-auto gap-2">
      <div className="bg-[#1B3C7B] relative bg-cover bg-center rounded-[12px] flex justify-center items-center overflow-clip">
        <div>
          {!imagesLoaded.left && (
            <div className="absolute bottom-[-14px] md:left-[1px] md:bottom-[2px] max-w-[150px] md:max-w-[300px] w-[150px] md:w-[300px] h-[150px] md:h-[300px] bg-gray-300 animate-pulse rounded" />
          )}
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/how-svgs/left-star.svg`}
            alt="bottom"
            width={300}
            height={300}
            className={`absolute bottom-[-14px] md:left-[1px] md:bottom-[2px] max-w-[150px] md:max-w-[300px] transition-opacity duration-500 ${
              imagesLoaded.left ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad('left')}
            priority={false}
            loading="lazy"
          />
        </div>
        <div>
          {!imagesLoaded.right && (
            <div className="absolute right-[-1px] top-[-11px] md:right-[1px] md:top-[2px] max-w-[150px] md:max-w-[300px] w-[150px] md:w-[300px] h-[150px] md:h-[300px] bg-gray-300 animate-pulse rounded" />
          )}
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/how-svgs/right-star.svg`}
            alt="top"
            width={300}
            height={300}
            className={`absolute right-[-1px] top-[-11px] md:right-[1px] md:top-[2px] max-w-[150px] md:max-w-[300px] transition-opacity duration-500 ${
              imagesLoaded.right ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad('right')}
            priority={false}
            loading="lazy"
          />
        </div>

        <p
          className={`text-[#ADCFF5] text-[40px] small-500:text-[24px] font-semibold leading-[110%] text-center mx-auto max-w-[636px] md:py-[80px] py-[62px] px-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="small-500:hidden block">
            All contributions need not be financial!{' '}
          </span>
          <span className="hidden small-500:block text-[24px] leading-[31.2px]">
            Make a contribution to the development of Black-owned business
          </span>
        </p>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-[60px] md:pb-[30px] mt-[48px] pb-[40px] mx-auto transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="transition-all duration-300 hover:scale-105">
          <h2 className="text-blue-strong md:text-[24px] text-[20px] small-500:text-center font-semibold leading-9 mb-3">
            Host an Event
          </h2>
          <p className="text-[#5b657b] text-[20px] small-500:text-center font-medium leading-[150%]">
            We&apos;ll be putting on a Black business event in your city soon
            enough. If you&apos;re an event planner or have access to an event
            space, let us know.
          </p>
        </div>
        <div className="transition-all duration-300 hover:scale-105">
          <h2 className="text-blue-strong md:text-[24px] text-[20px] small-500:text-center font-semibold leading-9 mb-3">
            Speak at an Event
          </h2>
          <p className="text-[#5b657b] text-[20px] small-500:text-center font-medium leading-[150%]">
            Come share your expertise at one of our Black business events. Find
            a promising business owner to mentor.
          </p>
        </div>
        <div className="transition-all duration-300 hover:scale-105">
          <h2 className="text-blue-strong md:text-[24px] small-500:text-center text-[20px] font-semibold leading-9 mb-3">
            Keep us in the Media
          </h2>
          <p className="text-[#5b657b] text-[20px] small-500:text-center font-medium leading-[150%]">
            Tell your favorite journalist or podcast host about what we&apos;re
            doing here at Orisuun.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contribution;
