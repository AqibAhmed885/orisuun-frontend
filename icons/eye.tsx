import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Eye: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.15234 7.11393C3.76568 5.4686 6.01368 4.44727 8.4999 4.44727C10.9861 4.44727 13.2341 5.46771 14.8475 7.11393"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.49962 11.7795C9.84965 11.7795 10.9441 10.6851 10.9441 9.33507C10.9441 7.98504 9.84965 6.89062 8.49962 6.89062C7.14959 6.89062 6.05518 7.98504 6.05518 9.33507C6.05518 10.6851 7.14959 11.7795 8.49962 11.7795Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.07411 5.62836L2.94434 3.78125"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.98894 4.574L6.56494 2.46289"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9258 5.62836L14.0556 3.78125"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0112 4.574L10.4352 2.46289"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Eye;
