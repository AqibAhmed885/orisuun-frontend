import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Hamburger: React.FC<LogoProps> = (props) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.6001 6.00078C3.6001 5.33804 4.13736 4.80078 4.8001 4.80078H19.2001C19.8628 4.80078 20.4001 5.33804 20.4001 6.00078C20.4001 6.66352 19.8628 7.20078 19.2001 7.20078H4.8001C4.13736 7.20078 3.6001 6.66352 3.6001 6.00078Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.6001 12.0008C3.6001 11.338 4.13736 10.8008 4.8001 10.8008H19.2001C19.8628 10.8008 20.4001 11.338 20.4001 12.0008C20.4001 12.6635 19.8628 13.2008 19.2001 13.2008H4.8001C4.13736 13.2008 3.6001 12.6635 3.6001 12.0008Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.6001 18.0008C3.6001 17.338 4.13736 16.8008 4.8001 16.8008H19.2001C19.8628 16.8008 20.4001 17.338 20.4001 18.0008C20.4001 18.6635 19.8628 19.2008 19.2001 19.2008H4.8001C4.13736 19.2008 3.6001 18.6635 3.6001 18.0008Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Hamburger;
