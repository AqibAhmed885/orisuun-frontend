import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const AdobeIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="28" height="28" rx="4" fill="#E31D1C" />
      <path
        d="M6.20888 18.6832C6.07312 18.9162 6.00113 19.1803 6.00001 19.4493C5.9989 19.7184 6.06871 19.983 6.20253 20.2171C6.33636 20.4512 6.52955 20.6466 6.76297 20.7839C6.9964 20.9212 7.26196 20.9957 7.53337 21H15.0908L12.9872 17.5248H11.4289L14 13.2772L18.6747 21H20.4666C20.738 20.9957 21.0036 20.9212 21.237 20.7839C21.4705 20.6466 21.6636 20.4512 21.7975 20.2171C21.9313 19.983 22.0011 19.7184 22 19.4493C21.9989 19.1803 21.9269 18.9162 21.7911 18.6832L15.4024 7.8713C15.2748 7.61016 15.0756 7.38993 14.8276 7.23583C14.5795 7.08173 14.2927 7 14 7C13.7073 7 13.4205 7.08173 13.1724 7.23583C12.9244 7.38993 12.7252 7.61016 12.5976 7.8713L6.20888 18.6832Z"
        stroke="#F7FCFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AdobeIcon;
