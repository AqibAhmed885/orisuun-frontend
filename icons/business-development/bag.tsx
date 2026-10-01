import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Bag: React.FC<LogoProps> = (props) => {
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
        d="M2.66663 6.66699H29.3333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeMiterlimit="10"
      />
      <path
        d="M29.3333 30.6668H2.66663V6.66683L7.99996 1.3335H24L29.3333 6.66683V30.6668Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M22.6666 13.3335C22.6666 17.0002 19.6666 20.0002 15.9999 20.0002C12.3333 20.0002 9.33325 17.0002 9.33325 13.3335"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
    </svg>
  );
};

export default Bag;
