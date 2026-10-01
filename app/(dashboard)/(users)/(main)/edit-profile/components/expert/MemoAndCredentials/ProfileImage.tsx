'use client';

import React from 'react';

interface ImageDisplaySectionProps {
  imageUrl?: string;
  verified?: boolean;
}

const ImageDisplaySection: React.FC<ImageDisplaySectionProps> = ({ imageUrl, verified = false }) => {
  const fallbackImage =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  return (
    <div className="flex flex-col items-start lg:items-center justify-start lg:justify-center w-full px-4 sm:px-0 space-y-3">

      <svg width="230" height="220" viewBox="0 0 180 180" fill="none">
        <foreignObject x="0" y="-8" width="180" height="196">
          <div
            style={{
              backdropFilter: 'blur(4px)',
              clipPath: 'url(#bgblur_0_8_23_clip_path)',
              height: '100%',
              width: '100%',
            }}
          />
        </foreignObject>
        <path
          d="M8 70C8 31.3401 39.3401 0 78 0H90H102C140.66 0 172 31.3401 172 70V90V110C172 148.66 140.66 180 102 180H90H78C39.3401 180 8 148.66 8 110V90V70Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M96 8C132.451 8 162 37.5492 162 74V106C162 142.451 132.451 172 96 172H84C47.5492 172 18 142.451 18 106V74C18 37.5492 47.5492 8 84 8H96Z"
          fill="url(#imagePattern)"
          stroke="#F2F4F7"
          strokeWidth="4"
        />
        <defs>
          <clipPath id="bgblur_0_8_23_clip_path" transform="translate(0 8)">
            <path d="M8 70C8 31.3401 39.3401 0 78 0H90H102C140.66 0 172 31.3401 172 70V90V110C172 148.66 140.66 180 102 180H90H78C39.3401 180 8 148.66 8 110V90V70Z" />
          </clipPath>
          <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="183" height="180">
            <image
              href={imageUrl || fallbackImage}
              x="0"
              y="0"
              width="183"
              height="180"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
      </svg>

      <p className="text-sm sm:text-[15px] text-gray-500 lg:mx-auto">Max upload size is 5MB</p>
      {!verified && (
        <div className="flex items-center lg:justify-center px-3 py-2 text-sm sm:text-[15px] font-medium text-[#FF4405] bg-[#FFF9F5] rounded-md border border-[#FFE6D5] lg:mx-auto">
          <span className="w-2 h-2 rounded-full bg-[#FF4405] mr-2" />
          Not Verified
        </div>
      )}

    </div>
  );
};

export default ImageDisplaySection;
