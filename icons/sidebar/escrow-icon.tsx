import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const EscrowIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
      <path d="M16 3L20 7M20 7L16 11M20 7H4M8 21L4 17M4 17L8 13M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
};

export default EscrowIcon;
