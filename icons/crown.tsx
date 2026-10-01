import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Crown: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.5 6L16.5 12L21.5 8L19.5 18H5.5L3.5 8L8.5 12L12.5 6Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Crown;
