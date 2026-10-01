import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const OpportunityPostsIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.8333 3.33337H4.16667C3.70643 3.33337 3.33334 3.70647 3.33334 4.16671V15.8334C3.33334 16.2936 3.70643 16.6667 4.16667 16.6667H15.8333C16.2936 16.6667 16.6667 16.2936 16.6667 15.8334V4.16671C16.6667 3.70647 16.2936 3.33337 15.8333 3.33337Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 1.66663V4.99996"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66666 1.66663V4.99996"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33334 8.33337H16.6667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33334 11.6666H11.6667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OpportunityPostsIcon;