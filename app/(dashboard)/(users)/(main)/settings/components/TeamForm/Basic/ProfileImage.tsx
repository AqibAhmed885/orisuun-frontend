'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface ImageUploadSectionProps {
    onImageSelect?: (url: string) => void;
    VerifiedStatus?: boolean;
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

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ onImageSelect, VerifiedStatus }) => {
    const { setValue, watch, trigger, formState: { errors } } = useFormContext();
    const storedImage = watch('ProfileImage'); // URL string
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
                setValue('ProfileImage', imageUrl);
                await trigger('ProfileImage');

                if (onImageSelect) onImageSelect(imageUrl);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Failed to upload image. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-start lg:items-start justify-start sm:px-0 space-y-3">
            <div className="">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <div
                    onClick={handleImageClick}
                    className="relative cursor-pointer">
                    <svg width="364" height="233" viewBox="0 0 364 233" fill="none">
                        <defs>
                            <clipPath id="bgblur_0_9_27_clip_path" transform="translate(5.73538 5.73538)">
                                <rect width="364" height="233" rx="13" />
                            </clipPath>
                            <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="364" height="233">
                                <image
                                    href={selectedImage || 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/9adc394a-91d9-4888-a38b-c6f6b6da9365.png'}
                                    x="0"
                                    y="0"
                                    width="364"
                                    height="233"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </pattern>
                        </defs>

                        <foreignObject
                            x="-5.73538"
                            y="-5.73538"
                            width="375.471"
                            height="244.471"
                        >
                            <div
                                style={{
                                    backdropFilter: 'blur(2.87px)',
                                    clipPath: 'url(#bgblur_0_9_27_clip_path)',
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </foreignObject>

                        <g data-figma-bg-blur-radius="5.73538">
                            <rect width="364" height="233" rx="13" fill="white" fillOpacity="0.2" />
                            <rect
                                x="8.56615"
                                y="6.06615"
                                width="346.868"
                                height="220.868"
                                rx="21.4338"
                                fill="url(#imagePattern)"
                            />
                            <rect
                                x="8.56615"
                                y="6.06615"
                                width="346.868"
                                height="220.868"
                                rx="21.4338"
                                stroke="white"
                                strokeWidth="2.86769"
                            />
                        </g>
                    </svg>
                </div>
            </div>

            <p className="text-sm sm:text-[15px] md:px-3 text-gray-500">Max upload size is 5MB</p>

            <div className={`flex items-center px-3 md:px-5 py-2 text-sm sm:text-[15px] font-medium ${VerifiedStatus ?"text-green-500 bg-green-100 border-green-200" : "text-[#FF4405] bg-[#FFF9F5] border-[#FFE6D5]"} rounded-md border `}>
                <span className={`w-2 h-2 rounded-full ${VerifiedStatus ?"bg-green-500":"bg-[#FF4405]"} mr-2`} />
                {VerifiedStatus ?"Verified":"Not Verified"}
            </div>

            {typeof errors.ProfileImage?.message === 'string' && (
                <p className="text-sm text-red-600">{errors.ProfileImage.message}</p>
            )}
        </div>
    );

};

export default ImageUploadSection;
