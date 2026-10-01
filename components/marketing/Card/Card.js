'use client';
// components/Card.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

const Card = ({
  imageSrc,
  title,
  description,
  containerClassName,
  titleClassName,
  descriptionClassName,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={clsx(
        'border border-[#D8D9D9] p-5 md:p-[26px] rounded-xl transition-all duration-300 hover:shadow-lg h-full flex flex-col',
        containerClassName
      )}
    >
      {imageSrc && (
        <div className="relative mb-6">
          {!imageLoaded && (
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
          )}
          <Image
            src={imageSrc}
            width={32}
            height={32}
            alt="icon"
            className={`mb-6 transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={false}
            loading="lazy"
          />
        </div>
      )}
      <h3
        className={clsx(
          'text-xl font-semibold leading-[130%] mb-4 text-left',
          titleClassName
        )}
      >
        {title}
      </h3>
      <p
        className={clsx(
          'md:text-xl text-[16px] font-medium leading-[150%] text-left',
          descriptionClassName
        )}
      >
        {description}
      </p>
    </div>
  );
};

export default Card;
