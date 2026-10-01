import React from 'react';

const CoFounderIcon: React.FC<LogoProps> = (props) => {
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
        d="M15.7494 0.900391H2.24941C1.50383 0.900391 0.899414 1.50481 0.899414 2.25039V15.7504C0.899414 16.496 1.50383 17.1004 2.24941 17.1004H15.7494C16.495 17.1004 17.0994 16.496 17.0994 15.7504V2.25039C17.0994 1.50481 16.495 0.900391 15.7494 0.900391Z"
        stroke="#797B82"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M0.899805 11.9545H4.94941L5.84941 13.5909H12.1494L13.0494 11.9545H17.099M17.0994 14V9.90909M0.899414 14V9.90909M5.84941 6.88795L8.36942 9.09091L12.5 5"
        stroke="#797B82"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CoFounderIcon;
