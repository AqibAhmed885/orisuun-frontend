import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Feather: React.FC<LogoProps> = (props) => {
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
        d="M13.4708 8.69531C12.9375 12.8477 9.28125 13.3224 5.625 12.6542"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.96875 16.0312C1.96875 16.0312 3.44475 3.07012 16.0312 1.96875C15.4012 3.06675 15.3866 4.89937 14.967 6.73762C14.3775 9 12.3401 9.28125 9.84375 9.28125"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Feather;
