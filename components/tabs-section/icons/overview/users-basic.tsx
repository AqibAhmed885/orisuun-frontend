import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const UsersBasic: React.FC<LogoProps> = (props) => {
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
        d="M7.66667 11.0052C9.13943 11.0052 10.3333 9.8113 10.3333 8.33854C10.3333 6.86578 9.13943 5.67188 7.66667 5.67188C6.19391 5.67188 5 6.86578 5 8.33854C5 9.8113 6.19391 11.0052 7.66667 11.0052Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8118 20.1639C13.5091 19.9306 13.9185 19.1719 13.6598 18.4853C12.7465 16.0613 10.4118 14.3359 7.66779 14.3359C4.92379 14.3359 2.58913 16.0613 1.67579 18.4853C1.41713 19.1733 1.82646 19.9319 2.52379 20.1639C3.80646 20.5919 5.56513 21.0013 7.66913 21.0013C9.77313 21.0013 11.5305 20.5919 12.8118 20.1639Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9997 7.66927C17.4724 7.66927 18.6663 6.47536 18.6663 5.0026C18.6663 3.52984 17.4724 2.33594 15.9997 2.33594C14.5269 2.33594 13.333 3.52984 13.333 5.0026C13.333 6.47536 14.5269 7.66927 15.9997 7.66927Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9983 17.6425C18.6623 17.5398 20.0703 17.1945 21.1436 16.8358C21.8409 16.6025 22.2503 15.8438 21.9916 15.1571C21.0783 12.7331 18.7436 11.0078 15.9996 11.0078C14.6969 11.0078 13.4863 11.3971 12.4756 12.0651"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UsersBasic;
