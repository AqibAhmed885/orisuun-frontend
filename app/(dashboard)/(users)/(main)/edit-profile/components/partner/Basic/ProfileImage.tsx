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
                    className="relative cursor-pointer overflow-hidden mx-auto"
                >
                    <svg width="200" height="194" viewBox="0 0 170 164" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            {/* Clip path for the image */}
                            <clipPath id="custom-avatar-shape">
                                <path d="M126.011 8C133.459 8 140.138 12.5868 142.812 19.5381L166.459 81.0225C168.191 85.527 168.043 90.539 166.046 94.9326L143.084 145.448C140.163 151.874 133.756 156 126.697 156H46.7559C40.016 156 33.8405 152.235 30.7539 146.243L4.70215 95.6709C2.22486 90.862 2.04162 85.1942 4.20312 80.2354L30.9795 18.8076C33.8406 12.244 40.3194 8.00005 47.4795 8H126.011Z" />
                            </clipPath>

                            {/* Top-only visible mask */}
                            <linearGradient id="top-only-mask-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="1" />
                                <stop offset="26%" stopColor="white" stopOpacity="1" />
                                <stop offset="21%" stopColor="white" stopOpacity="0" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <mask id="top-only-mask">
                                <rect x="0" y="0" width="200" height="200" fill="url(#top-only-mask-gradient)" />
                            </mask>

                            {/* Outer path for reuse */}
                            <path id="outer-path" d="M126.011 8C133.459 8 140.138 12.5868 142.812 19.5381L166.459 81.0225C168.191 85.527 168.043 90.539 166.046 94.9326L143.084 145.448C140.163 151.874 133.756 156 126.697 156H46.7559C40.016 156 33.8405 152.235 30.7539 146.243L4.70215 95.6709C2.22486 90.862 2.04162 85.1942 4.20312 80.2354L30.9795 18.8076C33.8406 12.244 40.3194 8.00005 47.4795 8H126.011Z" />

                            {/* Gradient for border */}
                            <linearGradient id="gradient-border" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6EE7B7" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>

                        {/* Top 20% gradient stroke with background-transparent bottom */}

                        <use
                            href="#outer-path"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="11"
                            filter="url(#glass-effect)"
                            opacity="0.1"
                            mask="url(#top-only-mask)"
                            transform="scale(1.03) translate(-2 -2.5)"
                        />
                        {/* Profile Image inside clipped shape */}
                        <image
                            href={selectedImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                            width="170"
                            height="164"
                            clipPath="url(#custom-avatar-shape)"
                            preserveAspectRatio="xMidYMid slice"
                        />

                        {/* Optional: Inner subtle gray border */}
                        <path
                            d="M126.011 8C133.459 8 140.138 12.5868 142.812 19.5381L166.459 81.0225C168.191 85.527 168.043 90.539 166.046 94.9326L143.084 145.448C140.163 151.874 133.756 156 126.697 156H46.7559C40.016 156 33.8405 152.235 30.7539 146.243L4.70215 95.6709C2.22486 90.862 2.04162 85.1942 4.20312 80.2354L30.9795 18.8076C33.8406 12.244 40.3194 8.00005 47.4795 8H126.011Z"
                            fill="none"
                            stroke="#F2F4F7"
                            strokeWidth="4"
                        />
                    </svg>
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
