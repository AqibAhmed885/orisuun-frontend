import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Trash: React.FC<LogoProps> = (props) => {
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
        d="M2.44444 3.77734H13.5556"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3.77691V2.44358C6 1.95291 6.39822 1.55469 6.88889 1.55469H9.11111C9.60178 1.55469 10 1.95291 10 2.44358V3.77691"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6L11.6444 12.76C11.5947 13.704 10.8142 14.4444 9.86933 14.4444H6.13156C5.18578 14.4444 4.40622 13.704 4.35644 12.76L4.00089 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Trash;
