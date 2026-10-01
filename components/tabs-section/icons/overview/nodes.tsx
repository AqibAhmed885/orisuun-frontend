import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Nodes: React.FC<LogoProps> = (props) => {
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
        d="M14.6641 5.10156C17.4027 6.02556 19.5041 8.33356 20.1361 11.1936"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.8283 14.6428C3.25897 11.8094 4.20697 8.83476 6.3683 6.85742"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5081 19.2578C15.3388 21.1685 12.2894 21.8338 9.49609 20.9511"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9997 7.66732C13.4724 7.66732 14.6663 6.47341 14.6663 5.00065C14.6663 3.52789 13.4724 2.33398 11.9997 2.33398C10.5269 2.33398 9.33301 3.52789 9.33301 5.00065C9.33301 6.47341 10.5269 7.66732 11.9997 7.66732Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.07194 19.6673C6.5447 19.6673 7.73861 18.4734 7.73861 17.0007C7.73861 15.5279 6.5447 14.334 5.07194 14.334C3.59918 14.334 2.40527 15.5279 2.40527 17.0007C2.40527 18.4734 3.59918 19.6673 5.07194 19.6673Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9284 19.6673C20.4011 19.6673 21.5951 18.4734 21.5951 17.0007C21.5951 15.5279 20.4011 14.334 18.9284 14.334C17.4556 14.334 16.2617 15.5279 16.2617 17.0007C16.2617 18.4734 17.4556 19.6673 18.9284 19.6673Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Nodes;
