import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const StyledTick: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.74874 27.1553L7.36927 23.145L2.85133 22.1553L3.29237 17.504L0.230835 14.0015L3.29237 10.4989L2.85133 5.84766L7.36927 4.85792L9.74874 0.847656L14 2.65279L18.2513 0.847656L20.6307 4.85792L25.1487 5.84766L24.7076 10.4989L27.7692 14.0015L24.7076 17.504L25.1487 22.1553L20.6307 23.145L18.2513 27.1552L14 25.3501L9.74874 27.1553ZM12.6 18.2732L19.6718 11.2015L18.2667 9.75532L12.6 15.422L9.73334 12.5964L8.32823 14.0015L12.6 18.2732Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default StyledTick;
