import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const ContributionIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.0001 20.2853C16.1285 20.2853 20.2858 16.128 20.2858 10.9996C20.2858 5.87122 16.1285 1.71387 11.0001 1.71387C5.87171 1.71387 1.71436 5.87122 1.71436 10.9996C1.71436 16.128 5.87171 20.2853 11.0001 20.2853Z"
        stroke="#2357C6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.4314 8.46026C13.3478 8.22369 13.2188 8.00854 13.0548 7.82534C12.706 7.43566 12.1992 7.19043 11.635 7.19043H10.1607C9.22168 7.19043 8.46045 7.95166 8.46045 8.89067C8.46045 9.68969 9.01681 10.3809 9.79736 10.5517L12.0421 11.0427C12.9165 11.234 13.5398 12.0089 13.5398 12.904C13.5398 13.956 12.687 14.8095 11.635 14.8095H10.3652C9.53586 14.8095 8.83032 14.2794 8.56883 13.5396"
        stroke="#2357C6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 7.18991V5.28516"
        stroke="#2357C6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 16.7133V14.8086"
        stroke="#2357C6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ContributionIcon;
