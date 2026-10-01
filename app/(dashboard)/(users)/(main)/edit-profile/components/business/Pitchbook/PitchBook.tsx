'use client';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

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
        console.error('SAS token error:', error);
        return null;
    }
}

const PitchBook = () => {
    const {
        setValue,
        watch,
        formState: { errors },
        trigger,
    } = useFormContext();

    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pitchBook = watch('PitchBook');
    const [sasToken, setSasToken] = useState<string>('');

    useEffect(() => {
        const fetchSasToken = async () => {
            const tokenData = await generateUploadFileSasTokenData();
            if (tokenData?.token) {
                setSasToken(tokenData.token);
            }
        };
        fetchSasToken();
    }, []);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['application/pdf'];
        const maxSize = 100 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PDF files are allowed.');
            return;
        }

        if (file.size > maxSize) {
            toast.error('File size must be under 5MB.');
            return;
        }

        if (!sasToken) {
            toast.error('Upload token not ready. Please try again.');
            return;
        }

        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${uniqueFileName}?${sasToken}`;

        try {
            const config = {
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': file.type,
                },
            };

            const res = await axios.put(blobUrl, file, config);
            if (res.status === 201) {
                const fileUrl = blobUrl.split('?')[0];
                setValue('PitchBook', fileUrl); // ✅ Save URL string
                setFileName(file.name);
                await trigger('PitchBook');
            }
        } catch (err) {
            console.error('PitchBook upload failed:', err);
            alert('Failed to upload pitchbook. Please try again.');
        }
    };

    return (
        <div className="w-[95%] mx-auto min-h-[24rem] bg-white border border-gray-300 rounded-2xl shadow-md mt-5">
            <div className="md:w-[95%] mx-auto p-2 md:px-6 py-4 mb-16 sm:mb-20">
                <div className="pb-5">
                    <h2 className="text-[16px] font-semibold">Pitchbook</h2>
                </div>
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl w-full py-16">
                    <div className="mb-4">
                        {/* SVG icon */}
                        <svg width="59" height="58" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="57" height="56" rx="11.5" fill="white" />
                            <rect x="1" y="1" width="57" height="56" rx="11.5" stroke="#F2F4F7" />
                            <path d="M31.1668 21.3926V24.8347C31.1668 25.3014 31.1668 25.5348 31.2577 25.713C31.3376 25.8698 31.465 25.9973 31.6218 26.0772C31.8001 26.168 32.0335 26.168 32.5002 26.168H35.9423M32.8335 30.3346H26.1668M32.8335 33.668H26.1668M27.8335 27.0013H26.1668M31.1668 21.168H26.8335C25.4334 21.168 24.7333 21.168 24.1985 21.4405C23.7281 21.6801 23.3457 22.0626 23.106 22.533C22.8335 23.0678 22.8335 23.7678 22.8335 25.168V33.8346C22.8335 35.2348 22.8335 35.9348 23.106 36.4696C23.3457 36.94 23.7281 37.3225 24.1985 37.5622C24.7333 37.8346 25.4334 37.8346 26.8335 37.8346H32.1668C33.567 37.8346 34.267 37.8346 34.8018 37.5622C35.2722 37.3225 35.6547 36.94 35.8943 36.4696C36.1668 35.9348 36.1668 35.2348 36.1668 33.8346V26.168L31.1668 21.168Z" stroke="#101828" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-center text-[16px]">
                        Upload your business pitchbook or presentation
                    </p>
                    <p className="text-gray-500 mb-4 text-center text-[16px]">
                        Supported document: PDF
                    </p>
                    <button
                        onClick={handleButtonClick}
                        type="button"
                        className="px-6 py-2 rounded-md bg-[#2357C6] text-white text-[16px] font-semibold hover:bg-blue-200 transition"
                    >
                        Upload Pitchbook
                    </button>
                    <input
                        ref={fileInputRef}
                        name="PitchBook"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    {typeof errors.PitchBook?.message === 'string' && (
                        <p className="text-red-600 text-[14px] mt-2">{errors.PitchBook.message}</p>
                    )}

                    {pitchBook && typeof pitchBook === 'string' && (
                        <div className="mt-6 flex items-center gap-4 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 max-w-md" onClick={() => window.open(pitchBook, '_blank')}>
                            <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.89941 0.505859H16.6992C16.781 0.505859 16.8591 0.538924 16.917 0.59668L24.2021 7.88184C24.2599 7.93961 24.2929 8.01792 24.293 8.09961V24.2998C24.293 25.5112 23.311 26.4939 22.0996 26.4941H5.89941C4.68784 26.4941 3.70508 25.5114 3.70508 24.2998V2.7002C3.70508 1.48862 4.68784 0.505859 5.89941 0.505859Z" fill="white" stroke="#D0D5DD" stroke-width="1.0125" />
                                <path d="M16.6992 0.335938V5.39844C16.6992 6.88961 17.9081 8.09844 19.3992 8.09844H24.4617" stroke="#D0D5DD" stroke-width="1.0125" />
                                <path d="M17.8543 17.1075C17.0963 17.1075 16.1478 17.2397 15.8375 17.2862C14.5532 15.945 14.1878 15.1827 14.1056 14.9794C14.217 14.6932 14.6045 13.606 14.6596 12.2097C14.6867 11.5106 14.5391 10.9882 14.2205 10.6571C13.9026 10.3265 13.5177 10.3008 13.4073 10.3008C13.0203 10.3008 12.3711 10.4965 12.3711 11.807C12.3711 12.944 12.9012 14.1505 13.0478 14.4623C12.2757 16.7103 11.4468 18.2493 11.2708 18.5658C8.16839 19.7338 7.92578 20.8632 7.92578 21.1833C7.92578 21.7585 8.33543 22.102 9.02159 22.102C10.6887 22.102 12.21 19.3031 12.4616 18.8171C13.6456 18.3453 15.2304 18.0531 15.6332 17.9833C16.7888 19.0841 18.1253 19.3779 18.6803 19.3779C19.0978 19.3779 20.0757 19.3779 20.0757 18.3724C20.0758 17.4387 18.8791 17.1075 17.8543 17.1075ZM17.7739 17.7675C18.6744 17.7675 18.9124 18.0653 18.9124 18.2228C18.9124 18.3216 18.8749 18.644 18.3922 18.644C17.9594 18.644 17.2121 18.3938 16.4769 17.8511C16.7835 17.8108 17.2372 17.7675 17.7739 17.7675ZM13.36 10.9406C13.4422 10.9406 13.4962 10.967 13.5408 11.0288C13.7998 11.3881 13.5909 12.5624 13.3368 13.4813C13.0914 12.6934 12.9073 11.4844 13.1664 11.0591C13.217 10.976 13.2749 10.9406 13.36 10.9406ZM12.9227 17.974C13.2487 17.3154 13.6141 16.3555 13.8132 15.8126C14.2114 16.4793 14.7471 17.0982 15.057 17.4338C14.0923 17.6372 13.3624 17.8404 12.9227 17.974ZM8.57338 21.2712C8.5519 21.2457 8.54872 21.192 8.56491 21.1276C8.59885 20.9925 8.85823 20.3228 10.7343 19.4836C10.4657 19.9067 10.0457 20.5113 9.58437 20.963C9.25962 21.2669 9.00674 21.4211 8.83276 21.4211C8.77052 21.4211 8.68476 21.4041 8.57338 21.2712Z" fill="#D92D20" />
                            </svg>

                            <div className="flex flex-col">
                                <p className=" text-gray-900">{fileName ? fileName : "Pitchbook"}</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PitchBook;
