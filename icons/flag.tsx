import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const FlagIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.53125 4.53167C5.26144 3.81594 6.24315 3.41504 7.26562 3.41504C8.2881 3.41504 9.26981 3.81594 10 4.53167C10.7302 5.2474 11.7119 5.6483 12.7344 5.6483C13.7568 5.6483 14.7386 5.2474 15.4688 4.53167V11.5629C14.7386 12.2786 13.7568 12.6795 12.7344 12.6795C11.7119 12.6795 10.7302 12.2786 10 11.5629C9.26981 10.8472 8.2881 10.4463 7.26562 10.4463C6.24315 10.4463 5.26144 10.8472 4.53125 11.5629V4.53167Z"
        stroke="#2357C6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.53125 17.0312V11.5625"
        stroke="#2357C6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlagIcon;