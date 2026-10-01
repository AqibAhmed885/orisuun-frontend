import React, { SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  className?: string; 
}

const DownloadIcon: React.FC<SvgIconProps> = ({ className, ...rest }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path
        d="M1 12.754V13.75C1 14.5456 1.31607 15.3087 1.87868 15.8713C2.44129 16.4339 3.20435 16.75 4 16.75H14C14.7956 16.75 15.5587 16.4339 16.1213 15.8713C16.6839 15.3087 17 14.5456 17 13.75V12.75M9 1.25V12.25M9 12.25L12.5 8.75M9 12.25L5.5 8.75"
        stroke="black"
        strokeOpacity="0.6"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownloadIcon;
