import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const MessageWriting: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.6252 9.66488H8.66461C8.66461 9.13967 8.87325 8.63597 9.24463 8.26459C9.61601 7.89321 10.1197 7.68457 10.6449 7.68457C11.1701 7.68457 11.6738 7.89321 12.0452 8.26459C12.4166 8.63597 12.6252 9.13967 12.6252 9.66488Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5144 6.62956C11.5144 7.10956 11.1255 7.68525 10.6458 7.68525C10.516 7.68332 10.3896 7.64377 10.2818 7.5714C10.187 7.51021 10.1037 7.43283 10.0357 7.34279L10.0304 7.33756C9.87168 7.13448 9.77506 6.87017 9.77506 6.62956C9.77502 6.5152 9.79752 6.40195 9.84126 6.29628C9.88501 6.19062 9.94915 6.09461 10.03 6.01374C10.1109 5.93287 10.2069 5.86874 10.3126 5.82499C10.4182 5.78124 10.5315 5.75875 10.6458 5.75879C10.8765 5.7592 11.0975 5.85114 11.2603 6.01441C11.4232 6.17769 11.5146 6.39894 11.5144 6.62956ZM7.33537 9.66494H3.37476C3.37476 9.13973 3.58339 8.63603 3.95477 8.26465C4.32615 7.89327 4.82985 7.68464 5.35506 7.68464C5.88027 7.68464 6.38397 7.89327 6.75535 8.26465C7.12673 8.63603 7.33537 9.13973 7.33537 9.66494Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.22585 6.62956C6.22585 6.87017 6.12739 7.13417 5.97047 7.33756L5.96523 7.34279C5.89666 7.43279 5.81282 7.51007 5.71754 7.5711C5.60677 7.64248 5.4837 7.68525 5.35539 7.68525C4.87539 7.68525 4.48462 7.10925 4.48462 6.62956C4.48462 6.14956 4.87539 5.75879 5.35539 5.75879C5.83539 5.75879 6.22585 6.14956 6.22585 6.62956Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7507 11.6339H4.2492C2.24213 11.6339 0.615356 10.0068 0.615356 8.00006C0.615356 5.99329 2.24213 4.36621 4.2492 4.36621H11.7507C13.7578 4.36621 15.3846 5.99329 15.3846 8.00006C15.3846 10.0068 13.7578 11.6339 11.7507 11.6339Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.80982 3.27539L8.90059 4.36647L7.80982 5.45754M4.30367 10.5431L3.21228 11.6342L4.30336 12.7252"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MessageWriting;
