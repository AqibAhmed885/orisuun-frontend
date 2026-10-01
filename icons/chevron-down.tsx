import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const ChevronDown: React.FC<LogoProps> = ({ ...props }) => {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.50013 5.27877L0.259766 1.03842L1.05013 0.248047L4.50013 3.69805L7.95013 0.248047L8.7405 1.03842L4.50013 5.27877Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronDown;
