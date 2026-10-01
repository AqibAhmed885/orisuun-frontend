import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const X: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_547_71686)">
        <mask
          id="mask0_547_71686"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="28"
          height="28"
        >
          <path d="M28 0H0V28H28V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_547_71686)">
          <path
            d="M24.7188 0H3.28125C1.46907 0 0 1.46907 0 3.28125V24.7188C0 26.5309 1.46907 28 3.28125 28H24.7188C26.5309 28 28 26.5309 28 24.7188V3.28125C28 1.46907 26.5309 0 24.7188 0Z"
            fill="currentColor"
          />
          <path
            d="M19.4639 5.46875H22.3584L16.0348 12.6962L23.474 22.5312H17.6491L13.0869 16.5664L7.86663 22.5312H4.97041L11.7341 14.8006L4.59766 5.46875H10.5704L14.6943 10.9209L19.4639 5.46875ZM18.448 20.7987H20.0519L9.69888 7.11025H7.97775L18.448 20.7987Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_547_71686">
          <rect width="28" height="28" rx="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default X;
