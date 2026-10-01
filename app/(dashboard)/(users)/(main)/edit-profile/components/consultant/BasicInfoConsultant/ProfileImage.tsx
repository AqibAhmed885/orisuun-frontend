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
                    <svg width="230" height="220" viewBox="0 0 183 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id="bgblur_0_2_26_clip_path" transform="translate(7.50125 6.24134)">
                                <path d="M84.5579 3.34315C88.9449 1.23049 94.0551 1.23049 98.4421 3.34316L158.588 32.3081C162.975 34.4207 166.162 38.4161 167.245 43.1632L182.1 108.247C183.183 112.994 182.046 117.976 179.01 121.783L137.388 173.976C134.352 177.783 129.748 180 124.879 180H58.1214C53.2522 180 48.648 177.783 45.6121 173.976L3.98958 121.783C0.953689 117.976 -0.183454 112.994 0.900044 108.247L15.7549 43.1632C16.8384 38.4161 20.0246 34.4207 24.4116 32.308L84.5579 3.34315Z" />
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
                        <foreignObject
                            x={-7.50125}
                            y={-6.24134}
                            width={198.003}
                            height={194.241}
                        >
                            <div
                                style={{
                                    backdropFilter: 'blur(4px)',
                                    clipPath: 'url(#bgblur_0_2_26_clip_path)',
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </foreignObject>
                        <path
                            d="M84.5579 3.34315C88.9449 1.23049 94.0551 1.23049 98.4421 3.34316L158.588 32.3081C162.975 34.4207 166.162 38.4161 167.245 43.1632L182.1 108.247C183.183 112.994 182.046 117.976 179.01 121.783L137.388 173.976C134.352 177.783 129.748 180 124.879 180H58.1214C53.2522 180 48.648 177.783 45.6121 173.976L3.98958 121.783C0.953689 117.976 -0.183454 112.994 0.900044 108.247L15.7549 43.1632C16.8384 38.4161 20.0246 34.4207 24.4116 32.308L84.5579 3.34315Z"
                            fill="#D9D9D9"
                            fillOpacity="0.2"
                        />
                        <path
                            d="M83.1895 13.542C88.1251 11.1649 93.8749 11.1649 98.8105 13.542L149.081 37.7529C154.016 40.1298 157.601 44.6245 158.819 49.9648L171.235 104.368C172.454 109.708 171.175 115.312 167.76 119.595L132.971 163.223C129.555 167.505 124.375 170 118.897 170H63.1025C57.6247 170 52.4447 167.505 49.0293 163.223L14.2402 119.595C10.8253 115.312 9.54603 109.708 10.7646 104.368L23.1807 49.9648C24.3995 44.6245 27.9839 40.1298 32.9189 37.7529L83.1895 13.542Z"
                            fill="url(#imagePattern)"
                            stroke="#F2F4F7"
                            strokeWidth={4}
                        />
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
