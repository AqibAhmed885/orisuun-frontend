import React, { SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const VideoIcon: React.FC<SvgIconProps> = ({ className, ...rest }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.8 0C2.14903 0 0 2.14903 0 4.8V35.2C0 37.851 2.14903 40 4.8 40H35.2C37.851 40 40 37.851 40 35.2V4.8C40 2.14903 37.851 0 35.2 0H4.8ZM11.9924 29.801C12.3894 30 12.5879 30 12.9849 30C13.3819 30 13.5804 30 13.9773 29.801L27.8716 21.8408C28.4671 21.4428 28.8641 20.8458 28.8641 20.0498C28.8641 19.2537 28.4671 18.6567 27.8716 18.2587L13.9773 10.2985C13.3819 9.9005 12.5879 9.9005 11.9924 10.2985C11.397 10.6965 11 11.2935 11 12.0896V28.01C11 28.806 11.397 29.403 11.9924 29.801ZM22.9094 20.0498L14.9698 24.6269V15.4726L22.9094 20.0498Z"
        fill="#844FDA"
      />
    </svg>
  );
};

export default VideoIcon;
