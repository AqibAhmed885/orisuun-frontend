import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const ArrowDown: React.FC<LogoProps> = (props) => {
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
        id="mask0_755_43219"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <rect width="20" height="20" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_755_43219)">
        <path
          d="M9.99997 12.5311L5.28845 7.81959L6.16664 6.94141L9.99997 10.7747L13.8333 6.94141L14.7115 7.81959L9.99997 12.5311Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default ArrowDown;
