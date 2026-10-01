'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const ToolsCard = ({
  header,
  paragraphs,
  imageSrc,
  imageLeft,
  contentHeight,
  cardHeight,
  priority = false,
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return; // Skip observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading when image is 50px away from viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      className={`flex justify-between w-full gap-10 flex-col ${
        imageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } lg:gap-0 lg:pt-[71px] lg:pb-[70px] md:gap-20`}
    >
      <div
        className={`h-full ${contentHeight} flex flex-col gap-10 md:mt-[59px] lg:w-[594px] small-500:order-1`}
      >
        <h2
          className={`md:text-[32px] text-blue-strong font-semibold leading-110 text-[20px]`}
        >
          {header}
        </h2>
        <div className={`w-full h-full flex flex-col gap-6 ${cardHeight}`}>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div 
        ref={imgRef}
        className="h-full small-500:order-2 flex-shrink-0 lg:w-[500px] xl:w-[600px] relative"
      >
        {!isVisible && !priority ? (
          <div className="w-full h-[300px] lg:h-[400px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Loading...</span>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            )}
            <Image
              src={imageSrc}
              alt={header}
              width={600}
              height={400}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ToolsCard;
