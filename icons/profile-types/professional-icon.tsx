import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const ProfessionalsIcon: React.FC<LogoProps> = (props) => {
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
        d="M14.9545 17V17.8333H10.0455V17H3.5V21.1667C3.5 21.6267 3.86655 22 4.31818 22H20.6818C21.1335 22 21.5 21.6267 21.5 21.1667V17H14.9545Z"
        fill="currentColor"
      />
      <path
        d="M21.6667 5.25H16.6667V2.8125C16.6667 2.364 16.2933 2 15.8333 2H9.16667C8.70667 2 8.33333 2.364 8.33333 2.8125V5.25H3.33333C2.87333 5.25 2.5 5.614 2.5 6.0625V14.1875C2.5 14.636 2.87333 15 3.33333 15H10V13.375H15V15H21.6667C22.1267 15 22.5 14.636 22.5 14.1875V6.0625C22.5 5.614 22.1267 5.25 21.6667 5.25ZM15 5.25H10V3.625H15V5.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ProfessionalsIcon;
