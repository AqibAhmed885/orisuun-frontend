import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const LocationPin: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.9991 10.9987C14.3923 10.9987 16.3324 9.0586 16.3324 6.66536C16.3324 4.27213 14.3923 2.33203 11.9991 2.33203C9.60587 2.33203 7.66577 4.27213 7.66577 6.66536C7.66577 9.0586 9.60587 10.9987 11.9991 10.9987Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9993 17.6608V10.9941"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9992 16.5703C19.3419 16.9903 21.6659 17.9196 21.6659 18.9983C21.6659 20.4716 17.3379 21.665 11.9992 21.665C6.66052 21.665 2.33252 20.4716 2.33252 18.9983C2.33252 17.9196 4.65652 16.989 7.99919 16.5703"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LocationPin;
