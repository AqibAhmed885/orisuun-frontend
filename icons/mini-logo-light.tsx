import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const MiniLogoLight: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="40" rx="9.58065" fill="#16357A" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 20.0052C32 26.6238 26.6237 32 19.9948 32C13.3762 32 8 26.6238 8 20.0052C8 13.3763 13.3762 8 19.9948 8C26.6237 8 32 13.3763 32 20.0052ZM25.9556 20.0052C25.9556 16.7168 23.2832 14.0444 19.9948 14.0444C16.7064 14.0444 14.0444 16.7168 14.0444 20.0052C14.0444 23.2936 16.7064 25.9556 19.9948 25.9556C23.2832 25.9556 25.9556 23.2936 25.9556 20.0052Z"
        fill="#69B3E7"
      />
    </svg>
  );
};

export default MiniLogoLight;
