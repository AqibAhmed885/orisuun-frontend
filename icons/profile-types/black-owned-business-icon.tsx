import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const BlackOwnedBusinessIcon: React.FC<LogoProps> = ({ ...props }) => {
  return (
    <svg
      width="12"
      height="11"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.66718 1.16589C7.82551 0.928394 8.17449 0.928393 8.33282 1.16589L11.3135 5.63697C11.4437 5.83216 11.7131 5.87399 11.8962 5.72744L15.1425 3.1304C15.4341 2.89718 15.8579 3.15511 15.7846 3.5212L14.2865 11.0118C14.2491 11.1987 14.085 11.3333 13.8943 11.3333H2.1057C1.91503 11.3333 1.75086 11.1987 1.71347 11.0118L0.215353 3.5212C0.142135 3.15511 0.565934 2.89718 0.857463 3.1304L4.10376 5.72744C4.28694 5.87399 4.55633 5.83216 4.68646 5.63697L7.66718 1.16589Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default BlackOwnedBusinessIcon;
