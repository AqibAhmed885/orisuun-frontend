import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const ArrowLeft: React.FC<LogoProps> = ({ ...props }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_475_71881"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <rect width="20" height="20" fill="currentColor" />
      </mask>
      <g mask="url(#mask0_475_71881)">
        <path
          d="M6.14419 10.625L10.891 15.3718L9.99998 16.25L3.75 9.99998L9.99998 3.75L10.891 4.62819L6.14419 9.375H16.25V10.625H6.14419Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default ArrowLeft;