import React, { SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  className?: string; 
}

const OnlineGreenIcon: React.FC<SvgIconProps> = ({ className, ...rest }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_3918_8097)">
        <circle cx="26" cy="26" r="5" fill="#198754" />
      </g>
      <defs>
        <filter
          id="filter0_d_3918_8097"
          x="0"
          y="0"
          width="52"
          height="52"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="10.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0313726 0 0 0 0 0.0313726 0 0 0 0 0.0313726 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3918_8097"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3918_8097"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default OnlineGreenIcon;
