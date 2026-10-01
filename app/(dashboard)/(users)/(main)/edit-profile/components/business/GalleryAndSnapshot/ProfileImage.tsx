'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';


const ProfileImage = ({ imageUrl, isVerified }) => {
    const { formState: { errors } } = useFormContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(imageUrl || null);

    useEffect(() => {
        setSelectedImage(imageUrl || null);
    }, [imageUrl]);

    return (
        <div className="flex flex-col items-center space-y-3 space-x-2">
            <div className="relative group">
                <div className="relative w-40 h-40">
                    <div className='w-full h-full rounded-full border-[6px] border-white bg-[#E4E7EC] shadow-md cursor-pointer overflow-hidden'>
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                {/* Icon */}
                                <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M35.6667 7.0013H20C14.3995 7.0013 11.5992 7.0013 9.46009 8.09124C7.57847 9.04997 6.04867 10.5798 5.08993 12.4614C4 14.6005 4 17.4008 4 23.0013V51.0013C4 56.6018 4 59.4021 5.08993 61.5412C6.04867 63.4228 7.57847 64.9526 9.46009 65.9114C11.5992 67.0013 14.3995 67.0013 20 67.0013H50.6667C53.7666 67.0013 55.3165 67.0013 56.5882 66.6606C60.0391 65.7359 62.7346 63.0404 63.6593 59.5895C64 58.3178 64 56.7679 64 53.668M57.3333 23.668V3.66797M47.3333 13.668H67.3333M29 25.3346C29 29.0165 26.0152 32.0013 22.3333 32.0013C18.6514 32.0013 15.6667 29.0165 15.6667 25.3346C15.6667 21.6527 18.6514 18.668 22.3333 18.668C26.0152 18.668 29 21.6527 29 25.3346ZM43.9668 36.7285L15.7705 62.3615C14.1845 63.8032 13.3916 64.5241 13.3214 65.1486C13.2606 65.6899 13.4682 66.2268 13.8773 66.5864C14.3493 67.0013 15.4209 67.0013 17.5643 67.0013H48.8533C53.6505 67.0013 56.0491 67.0013 57.933 66.1954C60.2981 65.1836 62.1823 63.2994 63.1941 60.9344C64 59.0504 64 56.6518 64 51.8546C64 50.2405 64 49.4334 63.8235 48.6818C63.6018 47.7373 63.1766 46.8525 62.5775 46.0893C62.1008 45.482 61.4706 44.9778 60.2102 43.9695L50.8861 36.5102C49.6246 35.501 48.9939 34.9964 48.2993 34.8183C47.6871 34.6614 47.0429 34.6817 46.4418 34.8769C45.7598 35.0984 45.1621 35.6418 43.9668 36.7285Z" stroke="#475467" stroke-width="6.66667" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <span className="absolute bottom-3 right-3 w-6 h-6 rounded-full border-2 border-white bg-green-500"></span>
                </div>
            </div>

            {
                isVerified ? (
                    <div className="flex items-center px-3 py-2 text-sm sm:text-[15px] font-medium text-[#1B9500] bg-[#F3FFF5] rounded-md border border-[#B7EFC0]">
                        <span className="w-2 h-2 rounded-full bg-[#1B9500] mr-2" />
                        Verified
                    </div>
                ) : (
                    <div className="flex items-center px-3 py-2 text-sm sm:text-[15px] font-medium text-[#FF4405] bg-[#FFF9F5] rounded-md border border-[#FFE6D5]">
                        <span className="w-2 h-2 rounded-full bg-[#FF4405] mr-2" />
                        Not Verified
                    </div>
                )
            }

            {typeof errors.BusinessImage?.message === 'string' && (
                <p className="mt-1 text-[16px] text-red-600">{errors.BusinessImage.message}</p>
            )}
        </div>
    );
};

export default ProfileImage;
