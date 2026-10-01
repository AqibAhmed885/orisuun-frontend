import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const ProfileSearchIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 8.05642C11.6876 8.05642 13.0556 6.6884 13.0556 5.00087C13.0556 3.31333 11.6876 1.94531 10 1.94531C8.31248 1.94531 6.94446 3.31333 6.94446 5.00087C6.94446 6.6884 8.31248 8.05642 10 8.05642Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4445 16.9453C15.8252 16.9453 16.9445 15.826 16.9445 14.4453C16.9445 13.0646 15.8252 11.9453 14.4445 11.9453C13.0637 11.9453 11.9445 13.0646 11.9445 14.4453C11.9445 15.826 13.0637 16.9453 14.4445 16.9453Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.58 10.8773C10.3867 10.8607 10.1967 10.834 10 10.834C7.16558 10.834 4.73447 12.534 3.65669 14.9673C3.25114 15.884 3.75336 16.9384 4.70891 17.2395C6.07003 17.6684 7.87114 18.0551 10 18.0551C10.2067 18.0551 10.3945 18.0362 10.5945 18.0295"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2111 16.2168L18.0555 18.0612"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProfileSearchIcon;
