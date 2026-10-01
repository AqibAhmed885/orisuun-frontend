import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Quotes: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="50"
      height="40"
      viewBox="0 0 50 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M29.5522 40V22.3881C29.5522 16.0199 31.5423 10.9453 35.5224 7.16418C39.602 3.28358 44.4279 0.895523 50 0V7.01493C47.3134 7.91045 44.9254 9.55224 42.8358 11.9403C40.8458 14.3284 39.8507 17.2139 39.8507 20.597H49.7015V40H29.5522ZM0 40V22.3881C0 16.0199 1.99005 10.9453 5.97015 7.16418C10.0498 3.28358 14.8756 0.895523 20.4478 0V7.01493C17.7612 7.91045 15.3731 9.55224 13.2836 11.9403C11.2935 14.3284 10.2985 17.2139 10.2985 20.597H20.1493V40H0Z"
        fill="#001E5F"
      />
    </svg>
  );
};

export default Quotes;
