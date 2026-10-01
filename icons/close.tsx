import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Close: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.6667 5.33398L5.33333 18.6673"
        stroke="#080808"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33333 5.33398L18.6667 18.6673"
        stroke="#080808"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Close;
