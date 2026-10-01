import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const FileIconAlt: React.FC<LogoProps> = ({ ...props }) => {
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
        d="M5.11133 6H6.88911"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.11133 8.66602H10.8891"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.11133 11.332H10.8891"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.44531 12.6658V3.33247C2.44531 2.35024 3.24087 1.55469 4.22309 1.55469H9.18842C9.42398 1.55469 9.65065 1.64802 9.81687 1.81513L13.296 5.29424C13.4631 5.46135 13.5564 5.68713 13.5564 5.92269V12.6658C13.5564 13.648 12.7609 14.4436 11.7786 14.4436H4.22309C3.24087 14.4436 2.44531 13.648 2.44531 12.6658Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.4766 5.55386H10.4455C9.95486 5.55386 9.55664 5.15564 9.55664 4.66498V1.64453"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FileIconAlt;
