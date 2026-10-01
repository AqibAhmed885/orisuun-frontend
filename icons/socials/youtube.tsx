import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Youtube: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_547_71685)">
        <path
          d="M28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28C21.732 28 28 21.732 28 14Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.8471 8.24784C21.5967 8.44961 22.1877 9.04065 22.3896 9.79023C22.7643 11.1597 22.7499 14.0139 22.7499 14.0139C22.7499 14.0139 22.7499 16.8536 22.3896 18.2231C22.1877 18.9727 21.5967 19.5637 20.8471 19.7655C19.4777 20.1258 13.9999 20.1258 13.9999 20.1258C13.9999 20.1258 8.53662 20.1258 7.15277 19.7511C6.40319 19.5492 5.81219 18.9582 5.61038 18.2087C5.25 16.8536 5.25 13.9994 5.25 13.9994C5.25 13.9994 5.25 11.1597 5.61038 9.79023C5.81219 9.04065 6.4176 8.43521 7.15277 8.23337C8.52221 7.87305 13.9999 7.87305 13.9999 7.87305C13.9999 7.87305 19.4777 7.87305 20.8471 8.24784ZM16.8109 13.9994L12.2557 16.623V11.3759L16.8109 13.9994Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_547_71685">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Youtube;
