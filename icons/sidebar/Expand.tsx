import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> { }
const Expand: React.FC<LogoProps> = (props) => {
    return (
        <svg
            width="18"
            height="15"
            viewBox="0 0 18 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M4.13281 7.56641L6.38339 5.20112L4.0181 2.95055" stroke="#101828" stroke-width="1.15432" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.59375 7.67578L9.84432 5.3105L7.47904 3.05992" stroke="#101828" stroke-width="1.15432" stroke-linecap="round" stroke-linejoin="round" />
        </svg>


    );
};

export default Expand;
