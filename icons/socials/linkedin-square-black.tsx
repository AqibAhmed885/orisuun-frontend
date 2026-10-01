import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
export const LinkedBlackIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="40" rx="9.58065" fill="#0D1530" />
      <path
        d="M30.7422 27.5877V20.322C30.7422 16.7512 29.9735 14.0234 25.8075 14.0234C23.7989 14.0234 22.4598 15.1145 21.9143 16.156H21.8647V14.3458H17.9219V27.5877H22.0383V21.0163C22.0383 19.2805 22.3606 17.6191 24.4932 17.6191C26.601 17.6191 26.6258 19.5781 26.6258 21.1155V27.5629H30.7422V27.5877Z"
        fill="white"
      />
      <path
        d="M11.3203 14.3477H15.4367V27.5895H11.3203V14.3477Z"
        fill="white"
      />
      <path
        d="M13.3806 8C12.0663 8 11 9.06629 11 10.3806C11 11.6948 12.0663 12.7859 13.3806 12.7859C14.6948 12.7859 15.7611 11.6948 15.7611 10.3806C15.7611 9.06629 14.6948 8 13.3806 8Z"
        fill="white"
      />
    </svg>
  );
};
