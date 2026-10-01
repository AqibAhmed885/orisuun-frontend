import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Bin: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_895_61810"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="28"
        height="28"
      >
        <rect width="28" height="28" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_895_61810)">
        <path
          d="M8.52565 23.9174C7.94381 23.9174 7.44686 23.7113 7.0348 23.2993C6.62271 22.8872 6.41667 22.3902 6.41667 21.8084V7.00075H5.25V5.25078H10.5V4.21875H17.5V5.25078H22.7499V7.00075H21.5833V21.8084C21.5833 22.3977 21.3791 22.8966 20.9708 23.3049C20.5624 23.7132 20.0636 23.9174 19.4743 23.9174H8.52565ZM19.8333 7.00075H8.16664V21.8084C8.16664 21.9131 8.2003 21.9991 8.26761 22.0665C8.33493 22.1338 8.42094 22.1674 8.52565 22.1674H19.4743C19.564 22.1674 19.6463 22.13 19.7211 22.0552C19.7959 21.9804 19.8333 21.8982 19.8333 21.8084V7.00075ZM10.9712 19.8341H12.7211V9.33409H10.9712V19.8341ZM15.2788 19.8341H17.0288V9.33409H15.2788V19.8341Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default Bin;
