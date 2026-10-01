import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const DisputeIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.25 1.25C11.041 1.25 9.25 3.041 9.25 5.25C9.25 5.978 9.447 6.658 9.787 7.246C10.024 7.691 9.758 8.742 9.25 9.25C9.94 9.287 10.848 8.976 11.254 8.713C11.524 8.869 11.952 9.075 12.512 9.181C12.751 9.226 12.998 9.25 13.25 9.25C15.459 9.25 17.25 7.459 17.25 5.25C17.25 3.041 15.459 1.25 13.25 1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.55078 10.75C5.65535 10.75 6.55078 9.85457 6.55078 8.75C6.55078 7.64543 5.65535 6.75 4.55078 6.75C3.44621 6.75 2.55078 7.64543 2.55078 8.75C2.55078 9.85457 3.44621 10.75 4.55078 10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.75 16C1.275 14.403 2.778 13.25 4.551 13.25C6.324 13.25 7.827 14.403 8.352 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DisputeIcon;
