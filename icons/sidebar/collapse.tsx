import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> { }
const Collapse: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="18"
      height="15"
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.85938 2.50391L7.6088 4.86919L9.97409 7.11977" stroke="#101828" stroke-width="1.15432" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.39844 2.39844L4.14786 4.76372L6.51315 7.0143" stroke="#101828" stroke-width="1.15432" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  );
};

export default Collapse;
