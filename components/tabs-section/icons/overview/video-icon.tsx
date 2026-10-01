import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const VideoIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.25 8.00017L16.509 5.65817C16.842 5.47517 17.25 5.71617 17.25 6.09617V11.9052C17.25 12.2852 16.842 12.5262 16.509 12.3432L12.25 10.0012"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 3.75H3.75C2.64543 3.75 1.75 4.64543 1.75 5.75V12.25C1.75 13.3546 2.64543 14.25 3.75 14.25H10.25C11.3546 14.25 12.25 13.3546 12.25 12.25V5.75C12.25 4.64543 11.3546 3.75 10.25 3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 7.5C5.16421 7.5 5.5 7.16421 5.5 6.75C5.5 6.33579 5.16421 6 4.75 6C4.33579 6 4 6.33579 4 6.75C4 7.16421 4.33579 7.5 4.75 7.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default VideoIcon;
