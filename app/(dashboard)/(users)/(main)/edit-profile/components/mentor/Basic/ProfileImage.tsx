'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadSectionProps {
    onImageSelect?: (url: string) => void;
}

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string

export async function generateUploadFileSasTokenData() {
    try {
        const response = await axios.get(
            `${apiEndpoint}/UserVerification/GenerateUploadFileSasToken`,
            {
                headers: {
                    XApiKey: apiKey,
                },
            }
        );
        return response.data.Result;
    } catch (error) {
        console.error('Axios error:', error);
        return [];
    }
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ onImageSelect }) => {
    const { setValue, watch, trigger, formState: { errors } } = useFormContext();
    const storedImage = watch('BusinessImage'); // URL string
    const [selectedImage, setSelectedImage] = useState<string | null>(storedImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [sasToken, setSasToken] = useState<string>('');

    useEffect(() => {
        const fetchSasToken = async () => {
            const token = await generateUploadFileSasTokenData();
            setSasToken(token.token);
        };
        fetchSasToken();
    }, []);

    useEffect(() => {
        setSelectedImage(storedImage)
    }, [storedImage])

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit');
            return;
        }

        if (!file.type.match('image.*')) {
            alert('Please select a valid image file');
            return;
        }

        if (!sasToken) {
            alert('Upload token not ready. Please try again shortly.');
            return;
        }

        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${uniqueFileName}?${sasToken}`;

        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        };

        try {
            const res = await axios.put(blobUrl, file, config);
            if (res.status === 201) {
                const imageUrl = blobUrl.split('?')[0];
                setSelectedImage(imageUrl);
                setValue('BusinessImage', imageUrl);
                await trigger('BusinessImage');

                if (onImageSelect) onImageSelect(imageUrl);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Failed to upload image. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-start lg:items-center justify-start lg:justify-center w-full px-4 sm:px-0 space-y-3">
            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <div
                    onClick={handleImageClick}
                    className="relative w-32 h-36 sm:w-44 sm:h-48 md:w-52 md:h-56 lg:w-44 lg:h-54 cursor-pointer overflow-hidden mx-auto"
                >
                    {selectedImage ? (
                        <div className="relative w-full h-full mx-auto">
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
                                    href={
                                        selectedImage ||
                                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                    }
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
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            {/* Upload Icon */}
                            <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="..." stroke="#475467" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-sm sm:text-[15px] text-gray-500">Max upload size is 5MB</p>

            <div className="flex items-center px-3 py-2 text-sm sm:text-[15px] font-medium text-[#FF4405] bg-[#FFF9F5] rounded-md border border-[#FFE6D5]">
                <span className="w-2 h-2 rounded-full bg-[#FF4405] mr-2" />
                Not Verified
            </div>

            {typeof errors.BusinessImage?.message === 'string' && (
                <p className="text-sm text-red-600">{errors.BusinessImage.message}</p>
            )}
        </div>
    );

};

export default ImageUploadSection;
