import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const HtmlIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="28" height="28" rx="4" fill="#FF996D" />
      <path
        d="M7.45614 21.2006L6 5H22L20.5419 21.1981L13.9903 23L7.45614 21.2006Z"
        fill="#E44F26"
      />
      <path
        d="M14 21.623L19.2945 20.167L20.54 6.32495H14V21.623Z"
        fill="#F1662A"
      />
      <path
        d="M13.9998 12.333H11.3493L11.1666 10.2984H13.9998V8.31128H8.97754L9.02549 8.84485L9.51735 14.3201H13.9998V12.333ZM13.9998 17.4932L13.9907 17.4958L11.7602 16.8986L11.6176 15.3139H9.60678L9.88738 18.4331L13.9907 19.5632L13.9998 19.5606V17.4932Z"
        fill="#EBEBEB"
      />
      <path
        d="M13.9927 12.333V14.3201H16.4591L16.2271 16.8973L13.9927 17.4951V19.5626L18.0993 18.4331L18.1291 18.0975L18.5996 12.8666L18.6488 12.333H13.9927ZM13.9927 8.31128V10.2984H18.8309L18.8711 9.85221L18.9625 8.84485L19.0104 8.31128H13.9927Z"
        fill="white"
      />
    </svg>
  );
};

export default HtmlIcon;
