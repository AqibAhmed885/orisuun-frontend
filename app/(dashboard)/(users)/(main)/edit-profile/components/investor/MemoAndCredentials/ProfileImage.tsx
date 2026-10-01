'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';


const ProfileImage = ({ imageUrl }) => {
    const { formState: { errors } } = useFormContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(imageUrl || null);

    useEffect(() => {
        setSelectedImage(imageUrl || null);
    }, [imageUrl]);

    return (
        <div className="flex flex-col items-center space-y-3 space-x-2">
            <div className="relative group">
                <div className="w-full h-full rounded-octagon bg-[#dfebfb] flex items-center justify-center">
                    <div className="w-[92%] h-[92%] bg-white rounded-octagon flex items-center justify-center">
                        <div className="w-[92%] h-[92%] rounded-octagon overflow-hidden">
                            <img
                                src={ selectedImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                            {/* selectedImage || */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[90px] h-[29px] flex items-center px-2 text-center py-5 text-[12px] font-medium text-[#FF4405] bg-[#FFF9F5] rounded-md border border-[#FFE6D5]">
                <span className="w-2 h-2 rounded-full bg-[#FF4405] mr-2" />
                Not Verified
            </div>

            {typeof errors.BusinessImage?.message === 'string' && (
                <p className="mt-1 text-[16px] text-red-600">{errors.BusinessImage.message}</p>
            )}
        </div>
    );
};

export default ProfileImage;
