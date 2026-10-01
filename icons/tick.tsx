import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Tick: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.66406 10L7.4974 15.8333L18.3307 5"
        stroke={'currentColor'}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Tick;
