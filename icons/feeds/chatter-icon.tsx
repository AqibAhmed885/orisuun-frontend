import React from 'react';

interface ChatterIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const ChatterIcon: React.FC<ChatterIconProps> = ({ className, ...rest }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className='w-3.5 h-3.5'
      {...rest}
    >
      <path
        d="M2.66732 12.0005H4.00065V14.7212L7.40132 12.0005H10.6673C11.4027 12.0005 12.0007 11.4025 12.0007 10.6672V5.33382C12.0007 4.59849 11.4027 4.00049 10.6673 4.00049H2.66732C1.93198 4.00049 1.33398 4.59849 1.33398 5.33382V10.6672C1.33398 11.4025 1.93198 12.0005 2.66732 12.0005Z"
        fill="#7FAAE3"
      />
      <path
        d="M13.3333 1.3335H5.33333C4.598 1.3335 4 1.9315 4 2.66683H12C12.7353 2.66683 13.3333 3.26483 13.3333 4.00016V9.3335C14.0687 9.3335 14.6667 8.7355 14.6667 8.00016V2.66683C14.6667 1.9315 14.0687 1.3335 13.3333 1.3335Z"
        fill="#7FAAE3"
      />
    </svg>
  );
};

export default ChatterIcon;
