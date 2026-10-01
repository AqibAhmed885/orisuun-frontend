import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
interface MiniLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const MiniLogo: React.FC<MiniLogoProps> = ({ className, ...rest }) => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      className={className}
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="42" height="42" rx="10" fill="#0A193A" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.6998 21.0062C35.6998 29.1139 29.1139 35.6998 20.9934 35.6998C12.8857 35.6998 6.2998 29.1139 6.2998 21.0062C6.2998 12.8857 12.8857 6.2998 20.9934 6.2998C29.1139 6.2998 35.6998 12.8857 35.6998 21.0062ZM28.2955 21.0062C28.2955 16.9779 25.0217 13.7042 20.9934 13.7042C16.9651 13.7042 13.7042 16.9779 13.7042 21.0062C13.7042 25.0345 16.9651 28.2955 20.9934 28.2955C25.0217 28.2955 28.2955 25.0345 28.2955 21.0062Z"
        fill="#69B3E7"
      />
    </svg>
  );
};

export default MiniLogo;
