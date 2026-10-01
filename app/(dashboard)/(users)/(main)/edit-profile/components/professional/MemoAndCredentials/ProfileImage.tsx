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
        <foreignObject x="-8" y="-8" width="196" height="196">
          <div
            style={{
              backdropFilter: 'blur(4px)',
              clipPath: 'url(#bgblur_0_5_3_clip_path)',
              height: '100%',
              width: '100%',
            }}
          />
        </foreignObject>
        <g data-figma-bg-blur-radius="8">
          <rect width="180" height="180" rx="8" fill="white" fillOpacity="0.2" />
        </g>
        <rect x="9" y="8" width="164" height="164" rx="6" fill="url(#imagePattern)" />
        <rect
          x="9"
          y="8"
          width="164"
          height="164"
          rx="6"
          stroke="#F2F4F7"
          strokeWidth="4"
        />
        <defs>
          <clipPath id="bgblur_0_5_3_clip_path" transform="translate(8 8)">
            <rect width="180" height="180" rx="8" />
          </clipPath>
          <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="183" height="180">
            <image
              href={imageUrl || fallbackImage}  // <-- Replace this with your actual image path or URL
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
