import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const AlarmClock: React.FC<LogoProps> = (props) => {
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
        d="M19.333 2L21.9997 4.66667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66667 2L2 4.66667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0003 20.3327C16.6027 20.3327 20.3337 16.6017 20.3337 11.9993C20.3337 7.39698 16.6027 3.66602 12.0003 3.66602C7.39795 3.66602 3.66699 7.39698 3.66699 11.9993C3.66699 16.6017 7.39795 20.3327 12.0003 20.3327Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.10833 17.8926L3.66699 20.3339"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.8926 17.8926L20.3339 20.3339"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.66602V11.9993L15.6667 14.3327"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AlarmClock;
