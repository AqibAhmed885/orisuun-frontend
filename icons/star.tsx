import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const Star: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.0783 6.0289C15 5.78802 14.7911 5.61202 14.5405 5.57557L10.4338 4.97913L8.59736 1.25735C8.37336 0.802238 7.62581 0.802238 7.40181 1.25735L5.56536 4.97824L1.4587 5.57468C1.20803 5.61113 0.999141 5.78713 0.920919 6.02802C0.842696 6.2689 0.907585 6.53468 1.08981 6.71157L4.06136 9.60757L3.35914 13.6973C3.31647 13.948 3.4187 14.2005 3.62403 14.3498C3.82936 14.4982 4.10225 14.5178 4.32625 14.4005L7.99914 12.4689L11.672 14.4005C11.7698 14.452 11.8756 14.4769 11.9823 14.4769C12.12 14.4769 12.2578 14.4342 12.3743 14.3498C12.5796 14.2005 12.6827 13.948 12.6391 13.6973L11.9369 9.60757L14.9085 6.71157C15.0907 6.53468 15.1556 6.2689 15.0774 6.02802L15.0783 6.0289Z"
        fill={props.fill || 'currentColor'}
        stroke={"currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Star;
