import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const GlobeNetwork: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_5000_15896)">
        <path
          d="M15.4287 7.99986C15.4287 9.97004 14.646 11.8595 13.2529 13.2527C11.8598 14.6458 9.97028 15.4284 8.0001 15.4284C6.02992 15.4284 4.14044 14.6458 2.74731 13.2527C1.35418 11.8595 0.571533 9.97004 0.571533 7.99986M15.4287 7.99986C15.4287 6.02968 14.646 4.14019 13.2529 2.74707C11.8598 1.35394 9.97028 0.571289 8.0001 0.571289C6.02992 0.571289 4.14044 1.35394 2.74731 2.74707C1.35418 4.14019 0.571533 6.02968 0.571533 7.99986M15.4287 7.99986H0.571533"
          stroke="#2357C6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8574 7.99986C10.717 10.7164 9.71641 13.318 8.00021 15.4284C6.284 13.318 5.28341 10.7164 5.14307 7.99986C5.28341 5.2833 6.284 2.68175 8.00021 0.571289C9.71641 2.68175 10.717 5.2833 10.8574 7.99986Z"
          stroke="#2357C6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_5000_15896">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GlobeNetwork;
