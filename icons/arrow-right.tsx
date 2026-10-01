import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> { }
const ArrowRight: React.FC<LogoProps> = ({ ...props }) => {
  return (
    <svg className='h-4 w-4'
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 9H18M18 9L9.9 1M18 9L9.9 17"
        stroke="#2357C6"
        strokeWidth="1.63636"
      />
    </svg>
  );
};

export default ArrowRight;
