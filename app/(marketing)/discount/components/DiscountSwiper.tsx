'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const DiscountSwiper = () => {
  const isUserType = false;
  const initialActiveIndex = 5;
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const iconSwiperRef = useRef(null);
  const imageSwiperRef = useRef(null);
  const allIcons = [
    { src: `${staticUrl}/home/icons/discount-icon.svg`, label: 'Discount \nPortal' },
    { src: `${staticUrl}/discount-portal/swiper-images/icons/international-search-icon.png`, label: 'Search for\ndiscount' },
    { src: `${staticUrl}/discount-portal/swiper-images/icons/credit-card-icon.png`, label: 'Terms' },
    { src: `${staticUrl}/discount-portal/swiper-images/icons/off-icon.png`, label: 'Promotional\nPosts' },
    { src: `${staticUrl}/discount-portal/swiper-images/icons/discount-label-icon.png`, label: 'Discount\nInformation' },
  ];

  const allImages = [
    `${staticUrl}/discount-portal/swiper-images/discount.png`,
    `${staticUrl}/discount-portal/swiper-images/search.png`,
    `${staticUrl}/discount-portal/swiper-images/terms.png`,
    `${staticUrl}/discount-portal/swiper-images/promotional-posts.png`,
    `${staticUrl}/discount-portal/swiper-images/discount-information.png`,
  ];

  const duplicatedIcons = [...allIcons, ...allIcons, ...allIcons];
  const duplicatedImages = [...allImages, ...allImages, ...allImages];

  const numSlides = allIcons.length;
  const offset = numSlides;

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
    if (iconSwiperRef.current && imageSwiperRef.current) {
      iconSwiperRef.current.slideTo(initialActiveIndex + offset);
      imageSwiperRef.current.slideTo(initialActiveIndex + offset);
    }
  }, [initialActiveIndex, offset]);

  const handleIconClick = (index) => {
    setActiveIndex(index);
    if (iconSwiperRef.current && imageSwiperRef.current) {
      iconSwiperRef.current.slideTo(index);
      imageSwiperRef.current.slideTo(index);
    }
  };

  const handleSlideChange = (swiper) => {
    const loopIndex = swiper.realIndex % numSlides;
    setActiveIndex(swiper.realIndex);
    if (swiper.activeIndex >= numSlides * 2) {
      swiper.slideTo(loopIndex + offset);
    } else if (swiper.activeIndex < numSlides) {
      swiper.slideTo(loopIndex + offset);
    }
  };

  return (
    <section
      className="relative mt-[60px] md:mt-[100px] max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]'} w-full mx-auto">
      {isUserType && (
        <p className="text-blue-strong uppercase font-semibold leading-[17.6px] text-center mb-2 opacity-50">
          How to Build
        </p>
      )}
      <h2 className="text-center text-blue-strong text-[26px] sm:text-[40px] font-semibold leading-[110%]">
        The Discount Portal
      </h2>
      <p
        className="mt-4 mb-[40px] md:mb-[78px] text-[#5B657B] text-center text-2xl md:text-xl font-medium md:leading-[150%]">
        Marketing and community, together
      </p>
      <div className="relative mb-[30px] md:px-16 items-center">
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-[53px] md:w-[100px] bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div
            className="absolute inset-y-0 right-0 w-[53px]  md:w-[100px] bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          <Swiper
            spaceBetween={24}
            breakpoints={{
              640: {
                spaceBetween: 24,
              },
              0: {
                spaceBetween: 32,
              },
            }}
            centeredSlides={true}
            slidesPerView="auto"
            onSlideChange={handleSlideChange}
            initialSlide={initialActiveIndex}
            onSwiper={(swiper) => (iconSwiperRef.current = swiper)}
          >
            {[...duplicatedIcons].map((icon, index) => (
              <SwiperSlide
                key={index}
                onClick={() => handleIconClick(index)}
                className="max-w-[120px] md:max-w-[174px] flex justify-center"
              >
                <div className="flex flex-col justify-center items-center ">
                  <div
                    className={`mb-3 bg-[#F5FAFF] px-[15px] py-[18px] md:px-[24.5px] md:py-[25px] rounded-[12px] cursor-pointer ${index === activeIndex
                        ? 'font-bold px-6 border border-[#2357C6] bg-[#F2F7FC] custom-double-shadow'
                        : ''
                      }`}
                  >
                    <Image
                      src={icon.src}
                      alt={icon.label}
                      width={44}
                      height={44}
                      className={`text-center cursor-pointer ${index === activeIndex ? 'opacity-100' : 'opacity-50'
                        }`}
                    />
                  </div>
                  <p
                    className={`md:h-[78px] text-[14px] leading-[18.2px] text-center cursor-pointer md:text-xl font-semibold md:leading-[130%] whitespace-pre-wrap ${index === activeIndex
                        ? 'text-[#2357C6] '
                        : 'text-[#7FAAE3]'
                      }`}
                  >
                    {icon.label}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        initialSlide={initialActiveIndex}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (imageSwiperRef.current = swiper)}
      >
        {[...duplicatedImages].map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex justify-center px-4 md:px-20 ">
              <Image
                src={image}
                alt={`Slide ${index}`}
                className="responsive-svg"
                width={1400}
                height={696}
                loading="eager"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
                quality={75}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Image
        src={`${staticUrl}/home/images/blurs.svg`}
        width={1400}
        height={800}
        className="absolute bottom-[-30px] z-0  xl:w-full xl:h-auto  2xl:right-0 "
        loading="eager"
        alt="blur"
      />
    </section>
  );
};
export default DiscountSwiper;
