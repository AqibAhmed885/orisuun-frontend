import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const InstagramSquare: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="6" fill="#0D1530" />
      <circle cx="16" cy="16" r="6" fill="white" />
      <circle cx="25.25" cy="7.25" r="2.25" fill="white" />
    </svg>
  );
};

export default InstagramSquare;
