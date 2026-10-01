import React, { SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const MP3Icon: React.FC<SvgIconProps> = ({ className, ...rest }) => {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...rest}
        >
            {/* Background with rounded corners */}
            <rect width="40" height="40" rx="8" fill="#F3E8FF" />

            {/* Document shape */}
            <path
                d="M12 10C12 8.89543 12.8954 8 14 8H24L30 14V30C30 31.1046 29.1046 32 28 32H14C12.8954 32 12 31.1046 12 30V10Z"
                fill="#D1B3FF"
            />
            <path
                d="M24 8V14H30"
                fill="#C8A2FF"
            />
            <path
                d="M24 8L30 14H24V8Z"
                fill="#B580FF"
            />

            {/* MP3 Text */}
            <text
                x="13"
                y="27"
                fill="#4B0082"
                fontSize="8"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                MP3
            </text>
        </svg>
    );
};

export default MP3Icon;
