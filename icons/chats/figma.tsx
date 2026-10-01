import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const FigmaIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="4" fill="black" />
      <path
        d="M11.75 22C13.268 22 14.5 20.8053 14.5 19.3333V16.6666H11.75C10.232 16.6666 9 17.8613 9 19.3333C9 20.8053 10.232 22 11.75 22Z"
        fill="#0ACF83"
      />
      <path
        d="M9 14C9 12.528 10.232 11.3334 11.75 11.3334H14.5V16.6667H11.75C10.232 16.6667 9 15.472 9 14Z"
        fill="#A259FF"
      />
      <path
        d="M9 8.66667C9 7.19467 10.232 6 11.75 6H14.5V11.3333H11.75C10.232 11.3333 9 10.1387 9 8.66667Z"
        fill="#F24E1E"
      />
      <path
        d="M14.5 6H17.25C18.768 6 20 7.19467 20 8.66667C20 10.1387 18.768 11.3333 17.25 11.3333H14.5V6Z"
        fill="#FF7262"
      />
      <path
        d="M20 14C20 15.472 18.768 16.6667 17.25 16.6667C15.732 16.6667 14.5 15.472 14.5 14C14.5 12.528 15.732 11.3334 17.25 11.3334C18.768 11.3334 20 12.528 20 14Z"
        fill="#1ABCFE"
      />
    </svg>
  );
};

export default FigmaIcon;
