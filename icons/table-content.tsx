import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const TableContent: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_3628_8729)">
        <path d="M0.625 0.625H4.375V4.375H0.625V0.625Z" fill="#2357C6" />
        <path d="M5.625 0.625H19.375V4.375H5.625V0.625Z" fill="#2357C6" />
        <path d="M0.625 5.625H4.375V9.375H0.625V5.625Z" fill="#2357C6" />
        <path d="M5.625 5.625H19.375V9.375H5.625V5.625Z" fill="#2357C6" />
        <path d="M0.625 10.625H4.375V14.375H0.625V10.625Z" fill="#2357C6" />
        <path d="M5.625 10.625H19.375V14.375H5.625V10.625Z" fill="#2357C6" />
        <path d="M0.625 15.625H4.375V19.375H0.625V15.625Z" fill="#2357C6" />
        <path d="M5.625 15.625H19.375V19.375H5.625V15.625Z" fill="#2357C6" />
      </g>
      <defs>
        <clipPath id="clip0_3628_8729">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TableContent;
