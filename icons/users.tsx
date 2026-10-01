import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Users: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.8372 10.9998C15.3645 10.9998 14.1706 9.80593 14.1706 8.33317C14.1706 6.86041 15.3645 5.6665 16.8372 5.6665C18.31 5.6665 19.5039 6.86041 19.5039 8.33317C19.5039 9.80593 18.31 10.9998 16.8372 10.9998Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6902 20.1625C10.9928 19.9291 10.5835 19.1705 10.8422 18.4838C11.7555 16.0598 14.0902 14.3345 16.8342 14.3345C19.5782 14.3345 21.9128 16.0598 22.8262 18.4838C23.0848 19.1718 22.6755 19.9305 21.9782 20.1625C20.6955 20.5905 18.9368 20.9998 16.8328 20.9998C14.7288 20.9998 12.9715 20.5905 11.6902 20.1625Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5013 7.66634C7.02854 7.66634 5.83464 6.47243 5.83464 4.99967C5.83464 3.52692 7.02854 2.33301 8.5013 2.33301C9.97406 2.33301 11.168 3.52692 11.168 4.99967C11.168 6.47243 9.97406 7.66634 8.5013 7.66634Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.50468 17.6356C5.84068 17.533 4.43268 17.1876 3.35934 16.829C2.66201 16.5956 2.25268 15.837 2.51134 15.1503C3.42468 12.7263 5.75934 11.001 8.50334 11.001C9.80601 11.001 11.0167 11.3903 12.0273 12.0583"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Users;
