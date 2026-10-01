import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const CorporateFare: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_918_64488"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_918_64488)">
        <path
          d="M2.36523 20.5771V4.07715C2.36523 3.52486 2.81295 3.07715 3.36523 3.07715H10.865C11.4173 3.07715 11.865 3.52486 11.865 4.07715V7.07715H20.6342C21.1865 7.07715 21.6342 7.52486 21.6342 8.07715V20.5771H2.36523ZM3.86498 19.0771H10.3652V16.5771H3.86498V19.0771ZM3.86498 15.0771H10.3652V12.5771H3.86498V15.0771ZM3.86498 11.0771H10.3652V8.57715H3.86498V11.0771ZM3.86498 7.07715H10.3652V4.57715H3.86498V7.07715ZM11.865 19.0771H20.1345V8.57715H11.865V19.0771ZM14.0575 12.5771V11.0771H17.7497V12.5771H14.0575ZM14.0575 16.5771V15.0771H17.7497V16.5771H14.0575Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default CorporateFare;
