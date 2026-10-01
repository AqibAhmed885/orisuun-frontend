import type { FC } from 'react';

export const CardsNodesShadow: FC = () => {
  return (
    <svg
      width="93"
      height="47"
      viewBox="0 0 93 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_478_4632)">
        <ellipse
          cx="46.5"
          cy="23.5"
          rx="9.5"
          ry="32.5"
          transform="rotate(90 46.5 23.5)"
          fill="#2E70DA"
          fillOpacity="0.14"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_478_4632"
          x="0"
          y="0"
          width="93"
          height="47"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="7"
            result="effect1_foregroundBlur_478_4632"
          />
        </filter>
      </defs>
    </svg>
  );
};
