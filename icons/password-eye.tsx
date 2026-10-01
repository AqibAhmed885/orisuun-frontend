import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const PasswordEye: React.FC<LogoProps> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="20"
            height="20"
            x="0"
            y="0"
            viewBox="0 0 512 512"
            {...props}
        >
            <g>
                <g data-name="Layer 16">
                    <circle
                        cx="256"
                        cy="256"
                        r="69.74"
                        fill="currentColor"
                        opacity="1"
                        data-original="#68727F"
                    ></circle>
                    <path
                        d="M506.11 236.81C446.14 148 351.07 96 256 96.65 160.93 96 65.86 148 5.89 236.81a34.22 34.22 0 0 0 0 38.38C65.86 364 160.93 416 256 415.35c95.07.65 190.14-51.35 250.11-140.16a34.22 34.22 0 0 0 0-38.38zM256 363.74A107.74 107.74 0 1 1 363.74 256 107.74 107.74 0 0 1 256 363.74z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#68727F"
                    ></path>
                </g>
            </g>
        </svg>
    );
};

export default PasswordEye;