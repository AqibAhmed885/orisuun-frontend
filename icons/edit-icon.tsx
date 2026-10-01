import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const EditIcon: React.FC<LogoProps> = (props) => {
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
        d="M9 5H4C2.895 5 2 5.895 2 7V20C2 21.105 2.895 22 4 22H17C18.105 22 19 21.105 19 20V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M16 5L19 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M11.0979 15.9024C11.0338 15.9665 10.9536 16.0119 10.8656 16.0339L7.80845 16.7982C7.44226 16.8897 7.11057 16.5581 7.20211 16.1919L7.96641 13.1347C7.98839 13.0468 8.03385 12.9665 8.09793 12.9024L18.293 2.70731C18.684 2.31631 19.317 2.31631 19.707 2.70731L21.293 4.29331C21.684 4.68431 21.684 5.31731 21.293 5.70731L11.0979 15.9024Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
    </svg>
  );
};

export default EditIcon;
