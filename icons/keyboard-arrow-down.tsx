import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const KeyboardArrowDown: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_63_6023"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="32"
        height="32"
      >
        <rect
          x="32"
          y="32"
          width="32"
          height="32"
          transform="rotate(-180 32 32)"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_63_6023)">
        <path
          d="M16 11.4663L24 19.4663L22.1333 21.333L16 15.1997L9.86667 21.333L8 19.4663L16 11.4663Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default KeyboardArrowDown;
