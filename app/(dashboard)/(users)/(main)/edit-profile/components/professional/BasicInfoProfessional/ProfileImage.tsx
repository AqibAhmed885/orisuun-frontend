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
        <div className="flex flex-col items-center space-y-3 space-x-2">
            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <div onClick={handleImageClick} className="relative cursor-pointer" >
                    <svg width="230" height="220" viewBox="0 0 180 180" fill="none">
                        <foreignObject x="-8" y="-8" width="196" height="196">
                            <div
                                style={{
                                    backdropFilter: 'blur(4px)',
                                    clipPath: 'url(#bgblur_0_5_3_clip_path)',
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </foreignObject>
                        <g data-figma-bg-blur-radius="8">
                            <rect width="180" height="180" rx="8" fill="white" fillOpacity="0.2" />
                        </g>
                        <rect x="9" y="8" width="164" height="164" rx="6" fill="url(#imagePattern)" />
                        <rect
                            x="9"
                            y="8"
                            width="164"
                            height="164"
                            rx="6"
                            stroke="#F2F4F7"
                            strokeWidth="4"
                        />
                        <defs>
                            <clipPath id="bgblur_0_5_3_clip_path" transform="translate(8 8)">
                                <rect width="180" height="180" rx="8" />
                            </clipPath>
                            <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="183" height="180">
                                <image
                                    href={selectedImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}  // <-- Replace this with your actual image path or URL
                                    x="0"
                                    y="0"
                                    width="183"
                                    height="180"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </pattern>
                        </defs>
                    </svg>
                </div>
            </div>

            <p className="text-[12px] text-gray-500">Max upload size is 5MB</p>

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

export default ImageUploadSection;
