import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const GoTo: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1975_34192)">
        <path
          d="M7.33398 8.66732L14.6673 1.33398"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M9.33398 1.33398H14.4673C14.5778 1.33398 14.6673 1.42353 14.6673 1.53398V6.66732"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M6.00065 2.66797H2.66732C2.3137 2.66797 1.97456 2.80844 1.72451 3.05849C1.47446 3.30854 1.33398 3.64768 1.33398 4.0013V13.3346C1.33398 13.6883 1.47446 14.0274 1.72451 14.2774C1.97456 14.5275 2.3137 14.668 2.66732 14.668H12.0007C12.3543 14.668 12.6934 14.5275 12.9435 14.2774C13.1935 14.0274 13.334 13.6883 13.334 13.3346V10.0013"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1975_34192">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GoTo;
