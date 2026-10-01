import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Profile: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 20H12C7.582 20 4 23.582 4 28V29.3333C4 29.3333 8.16667 30.6667 16 30.6667C23.8333 30.6667 28 29.3333 28 29.3333V28C28 23.582 24.418 20 20 20Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M9.33313 8.00016C9.33313 4.31816 12.3178 1.3335 15.9998 1.3335C19.6818 1.3335 22.6665 4.31816 22.6665 8.00016C22.6665 11.6822 19.6818 16.0002 15.9998 16.0002C12.3178 16.0002 9.33313 11.6822 9.33313 8.00016Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
    </svg>
  );
};

export default Profile;
