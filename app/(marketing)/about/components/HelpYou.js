'use client';

import { helpYou } from '../../../../data/marketing';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export const HelpYou = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    let removeSliderListeners = () => {};

    const applySliderEffect = () => {
      removeSliderListeners();
      removeSliderListeners = () => {};

      const slider = sliderRef.current;
      if (slider && window.innerWidth <= 768) {
        let isDown = false;
        let startX;
        let scrollLeft;

        const mouseDown = (e) => {
          isDown = true;
          slider.classList.add('active');
          startX = e.pageX - slider.offsetLeft;
          scrollLeft = slider.scrollLeft;
        };

        const mouseLeave = () => {
          isDown = false;
          slider.classList.remove('active');
        };

        const mouseUp = () => {
          isDown = false;
          slider.classList.remove('active');
        };

        const mouseMove = (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - slider.offsetLeft;
          const walk = (x - startX) * 3; //scroll-fast
          slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener('mousedown', mouseDown);
        slider.addEventListener('mouseleave', mouseLeave);
        slider.addEventListener('mouseup', mouseUp);
        slider.addEventListener('mousemove', mouseMove);

        removeSliderListeners = () => {
          slider.removeEventListener('mousedown', mouseDown);
          slider.removeEventListener('mouseleave', mouseLeave);
          slider.removeEventListener('mouseup', mouseUp);
          slider.removeEventListener('mousemove', mouseMove);
        };
      }
    };

    applySliderEffect();
    window.addEventListener('resize', applySliderEffect);

    return () => {
      window.removeEventListener('resize', applySliderEffect);
      removeSliderListeners();
    };
  }, []);

  return (
    <section id="how-we-can-help-you" className="px-4 md:px-12 py-10 md:py-20 bg-[#F8F8F8]">
      <h4 className="text-blue-strong text-[40px] leading-[44px] text-center font-semibold">
        How Orisuun Can Help You
      </h4>
      <div ref={sliderRef} className="slider overflow-x-scroll flex gap-4 md:gap-[24px] max-w-[1054px] mx-auto pt-8 md:pt-[80px] lg:overflow-visible lg:flex-wrap">
        {helpYou.map((item) => (
          <div
            key={item.title}
            className="slide min-w-[75%] max-w-[232px] md:max-w-[515px] mx-auto px-4 pt-5 bg-white border border-[#D8D9D9] rounded-xl flex-shrink-0 lg:flex-shrink lg:min-w-0"
          >
            <Image src={item?.icon} alt="image" width={52} height={52} />
            <p className="text-blue-strong sm:text-[24px] text-[20px] leading-[36px] font-semibold pt-[24px]">
              {item?.title}
            </p>
            <p className="text-[#3B4761] text-[20px] leading-[30px] font-medium pt-[12px]">
              {item?.description}
            </p>
            <p className="text-blue-strong text-[20px] leading-[26px] font-semibold pt-6 pb-[18px]">
              {item?.help_title}
            </p>
            {item?.helps?.map((data) => (
              <div key={data.help} className="flex items-start gap-[20px] pb-6">
                <Image
                  src={data?.icon}
                  alt={data?.help}
                  width={24}
                  height={24}
                />
                <p className="text-[#3B4761] text-[20px] leading-[30px] font-medium">
                  {data?.help}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
