'use client';

import React from 'react';

interface ImageDisplaySectionProps {
    imageUrl?: string;
    verified?: boolean;
}

const ImageDisplaySection: React.FC<ImageDisplaySectionProps> = ({ imageUrl, verified = false }) => {
    const fallbackImage =
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

    return (
        <div className="flex flex-col items-start lg:items-center justify-start lg:justify-center w-full px-4 sm:px-0 space-y-3">
            <div className="relative w-32 h-36 sm:w-44 sm:h-48 md:w-52 md:h-56 lg:w-44 lg:h-54 overflow-hidden">
                <svg
                    viewBox="0 0 155 177"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <defs>
                        <clipPath id="custom-avatar-shape">
                            <path d="M83.7842 2.62793C121.956 2.62793 152.9 33.573 152.9 71.7451V88.5C152.9 115.281 139.104 140.172 116.395 154.366L88.4912 171.807C85.808 173.484 82.7072 174.373 79.543 174.373H75.459C72.2948 174.373 69.194 173.484 66.5107 171.807L38.6074 154.366C15.8975 140.172 2.10059 115.281 2.10059 88.5V71.7451C2.10059 33.573 33.0457 2.62793 71.2178 2.62793H83.7842Z" />
                        </clipPath>
                    </defs>
                    <image
                        href={imageUrl || fallbackImage}
                        width="155"
                        height="177"
                        clipPath="url(#custom-avatar-shape)"
                        preserveAspectRatio="xMidYMid slice"
                    />
                    <path
                        d="M83.7842 2.62793C121.956 2.62793 152.9 33.573 152.9 71.7451V88.5C152.9 115.281 139.104 140.172 116.395 154.366L88.4912 171.807C85.808 173.484 82.7072 174.373 79.543 174.373H75.459C72.2948 174.373 69.194 173.484 66.5107 171.807L38.6074 154.366C15.8975 140.172 2.10059 115.281 2.10059 88.5V71.7451C2.10059 33.573 33.0457 2.62793 71.2178 2.62793H83.7842Z"
                        fill="none"
                        stroke="#D1D5DB"
                        strokeWidth={4.2}
                    />
                </svg>
            </div>

            {!verified && (
                <div className="flex items-center lg:justify-center px-3 py-2 text-sm sm:text-[15px] font-medium text-[#FF4405] bg-[#FFF9F5] rounded-md border border-[#FFE6D5] lg:mx-auto">
                    <span className="w-2 h-2 rounded-full bg-[#FF4405] mr-2" />
                    Not Verified
                </div>
            )}

            <p className="text-sm sm:text-[15px] text-gray-500 lg:mx-auto">Max upload size is 5MB</p>
        </div>
    );
};

export default ImageDisplaySection;
