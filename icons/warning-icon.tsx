import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const WarningIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_819_7740"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_819_7740)">
        <path
          d="M1.24365 13.6666L8.00002 2L14.7564 13.6666H1.24365ZM2.96669 12.6666H13.0334L8.00002 3.99995L2.96669 12.6666ZM8.00002 11.8717C8.15259 11.8717 8.28047 11.8201 8.38367 11.7169C8.48687 11.6137 8.53847 11.4859 8.53847 11.3333C8.53847 11.1807 8.48687 11.0528 8.38367 10.9496C8.28047 10.8464 8.15259 10.7948 8.00002 10.7948C7.84745 10.7948 7.71957 10.8464 7.61637 10.9496C7.51317 11.0528 7.46157 11.1807 7.46157 11.3333C7.46157 11.4859 7.51317 11.6137 7.61637 11.7169C7.71957 11.8201 7.84745 11.8717 8.00002 11.8717ZM7.50004 10.1282H8.5V6.79483H7.50004V10.1282Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default WarningIcon;
