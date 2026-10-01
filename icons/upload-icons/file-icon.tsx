import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const FileIcon: React.FC<LogoProps> = (props) => {
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
        d="M11.3056 12.75H14.1945"
        stroke="#6C8ED9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3056 17.082H20.6945"
        stroke="#6C8ED9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3056 21.416H20.6945"
        stroke="#6C8ED9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.97223 23.5829V8.41623C6.97223 6.82012 8.26501 5.52734 9.86112 5.52734H17.9298C18.3126 5.52734 18.6809 5.67901 18.951 5.95057L24.6046 11.6041C24.8761 11.8757 25.0278 12.2426 25.0278 12.6253V23.5829C25.0278 25.179 23.735 26.4718 22.1389 26.4718H9.86112C8.26501 26.4718 6.97223 25.179 6.97223 23.5829Z"
        stroke="#6C8ED9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.8978 12.0265H19.9722C19.1749 12.0265 18.5278 11.3794 18.5278 10.582V5.67383"
        stroke="#6C8ED9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g clipPath="url(#clip0_907_55769)">
        <g clipPath="url(#clip1_907_55769)">
          <rect x="20" y="20" width="12" height="12" rx="6" fill="white" />
          <path
            d="M26 20C22.6861 20 20 22.6861 20 26C20 29.3139 22.6861 32 26 32C29.3139 32 32 29.3139 32 26C31.9902 22.6902 29.3097 20.0098 26 20ZM28.8901 24.3901L25.1401 28.1401C25.067 28.2133 24.971 28.25 24.875 28.25C24.779 28.25 24.683 28.2133 24.6099 28.1401L23.1099 26.6401C22.9633 26.4935 22.9633 26.2565 23.1099 26.1099C23.2565 25.9632 23.4935 25.9632 23.6401 26.1099L24.875 27.3448L28.3599 23.8599C28.5065 23.7133 28.7435 23.7133 28.8901 23.8599C29.0367 24.0065 29.0367 24.2435 28.8901 24.3901Z"
            fill="#2357C6"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_907_55769">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(20 20)"
          />
        </clipPath>
        <clipPath id="clip1_907_55769">
          <rect x="20" y="20" width="12" height="12" rx="6" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FileIcon;
