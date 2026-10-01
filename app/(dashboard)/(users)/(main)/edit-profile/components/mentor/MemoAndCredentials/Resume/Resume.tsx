'use client';

import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import IndustryExperience from './IndustryExperience';
import ClientSizeFocus from './ClientSizeFocus';

export interface MentorClientSizeFocusItem {
    Id: number;
    ClientSize: string;
    Percentage: string;
}

const Resume = ({ currentUserData, setDeleteIdsData }) => {
    const { watch, setValue, trigger, register, reset, formState: { errors } } = useFormContext();
    const resume = watch('resume');
    const [fileName, setFileName] = useState<string>('');
    const [sasToken, setSasToken] = React.useState<string>('');

    const CLIENT_SIZES = ['Individual', 'Business', 'Middle Market', 'Enterprise'];

    const mapClientSizeFocus = (apiData: MentorClientSizeFocusItem[]) => {
        const fixedClientSizeData = CLIENT_SIZES.map(size => {
            const found = apiData?.find(item => item.ClientSize === size);
            return {
                Id: found ? found.Id : 0,
                ClientSize: size,
                Percentage: found ? parseInt(found.Percentage) : 0,
            };
        });
        if (apiData != null && apiData.length > 0) {
            const idsToDelete = apiData
                .filter(item => !CLIENT_SIZES.includes(item.ClientSize))
                .map(item => item.Id);

            if (idsToDelete.length > 0) {
                setDeleteIdsData((prev) => ({
                    ...prev,
                    mentorClientSizeFocus: [...prev.mentorClientSizeFocus, ...idsToDelete]
                }));
            }
        }
        return fixedClientSizeData;
    };


    useEffect(() => {
        if (currentUserData) {
            const mappedData = {
                resume: currentUserData?.Resume || '',
                mentorIndustryExperience: currentUserData?.IndustryExperience?.map((item) => ({
                    Id: item.Id,
                    Industry: item.Industry,
                    YearsOfExperience: parseInt(item.YearsOfExperience)
                })) || [],
                mentorClientSizeFocus: mapClientSizeFocus(currentUserData?.ClientSizeFocus) || mapClientSizeFocus([]),
            }
            reset(mappedData);
        }
    }, [currentUserData])

    React.useEffect(() => {
        const fetchSasToken = async () => {
            const tokenData = await generateUploadFileSasTokenData();
            setSasToken(tokenData.token);
        };
        fetchSasToken();
    }, []);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ['application/pdf'];
        const maxSize = 5 * 1024 * 1024;

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
                setValue('resume', fileUrl);
                setFileName(file.name);
                await trigger('resume');
                toast.success('Resume Uploaded Successfully!')
            }
        } catch (err) {
            console.error('Resume upload failed:', err);
            toast.error('Failed to upload resume. Please try again.');
        }
    };

    return (<>
        <div className='w-[95%] mx-auto min-h-[30rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Mentor's resume/CV</h2>

                    <div className="border border-dashed border-gray-300 rounded-xl min-h-[24rem] flex flex-col items-center justify-center text-center px-4 py-10">
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6673 2.39258V5.8347C11.6673 6.30141 11.6673 6.53476 11.7581 6.71302C11.838 6.86982 11.9655 6.99731 12.1223 7.0772C12.3006 7.16803 12.5339 7.16803 13.0007 7.16803H16.4428M13.334 11.3346H6.66732M13.334 14.668H6.66732M8.33398 8.0013H6.66732M11.6673 2.16797H7.33398C5.93385 2.16797 5.23379 2.16797 4.69901 2.44045C4.2286 2.68014 3.84615 3.06259 3.60647 3.53299C3.33398 4.06777 3.33398 4.76784 3.33398 6.16797V14.8346C3.33398 16.2348 3.33398 16.9348 3.60647 17.4696C3.84615 17.94 4.2286 18.3225 4.69901 18.5622C5.23379 18.8346 5.93385 18.8346 7.33398 18.8346H12.6673C14.0674 18.8346 14.7675 18.8346 15.3023 18.5622C15.7727 18.3225 16.1552 17.94 16.3948 17.4696C16.6673 16.9348 16.6673 16.2348 16.6673 14.8346V7.16797L11.6673 2.16797Z" stroke="#101828" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <p className="text-gray-600 mb-4 text-[14px]">
                            Upload your resume <br /> Supported document: PDF
                        </p>

                        <label className="text-[14px] bg-[#2357C6] text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
                            Upload resume
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        {typeof errors.resume?.message === 'string' && (
                            <span className="text-red-500">
                                {errors.resume.message}
                            </span>
                        )}


                        {/* View File Component */}
                        {resume && typeof resume === 'string' && (
                            <div className="mt-6 flex items-center gap-4 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 max-w-md" onClick={() => window.open(resume, '_blank')}>
                                <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.89941 0.505859H16.6992C16.781 0.505859 16.8591 0.538924 16.917 0.59668L24.2021 7.88184C24.2599 7.93961 24.2929 8.01792 24.293 8.09961V24.2998C24.293 25.5112 23.311 26.4939 22.0996 26.4941H5.89941C4.68784 26.4941 3.70508 25.5114 3.70508 24.2998V2.7002C3.70508 1.48862 4.68784 0.505859 5.89941 0.505859Z" fill="white" stroke="#D0D5DD" stroke-width="1.0125" />
                                    <path d="M16.6992 0.335938V5.39844C16.6992 6.88961 17.9081 8.09844 19.3992 8.09844H24.4617" stroke="#D0D5DD" strokeWidth="1.0125" />
                                    <path d="M17.8543 17.1075C17.0963 17.1075 16.1478 17.2397 15.8375 17.2862C14.5532 15.945 14.1878 15.1827 14.1056 14.9794C14.217 14.6932 14.6045 13.606 14.6596 12.2097C14.6867 11.5106 14.5391 10.9882 14.2205 10.6571C13.9026 10.3265 13.5177 10.3008 13.4073 10.3008C13.0203 10.3008 12.3711 10.4965 12.3711 11.807C12.3711 12.944 12.9012 14.1505 13.0478 14.4623C12.2757 16.7103 11.4468 18.2493 11.2708 18.5658C8.16839 19.7338 7.92578 20.8632 7.92578 21.1833C7.92578 21.7585 8.33543 22.102 9.02159 22.102C10.6887 22.102 12.21 19.3031 12.4616 18.8171C13.6456 18.3453 15.2304 18.0531 15.6332 17.9833C16.7888 19.0841 18.1253 19.3779 18.6803 19.3779C19.0978 19.3779 20.0757 19.3779 20.0757 18.3724C20.0758 17.4387 18.8791 17.1075 17.8543 17.1075ZM17.7739 17.7675C18.6744 17.7675 18.9124 18.0653 18.9124 18.2228C18.9124 18.3216 18.8749 18.644 18.3922 18.644C17.9594 18.644 17.2121 18.3938 16.4769 17.8511C16.7835 17.8108 17.2372 17.7675 17.7739 17.7675ZM13.36 10.9406C13.4422 10.9406 13.4962 10.967 13.5408 11.0288C13.7998 11.3881 13.5909 12.5624 13.3368 13.4813C13.0914 12.6934 12.9073 11.4844 13.1664 11.0591C13.217 10.976 13.2749 10.9406 13.36 10.9406ZM12.9227 17.974C13.2487 17.3154 13.6141 16.3555 13.8132 15.8126C14.2114 16.4793 14.7471 17.0982 15.057 17.4338C14.0923 17.6372 13.3624 17.8404 12.9227 17.974ZM8.57338 21.2712C8.5519 21.2457 8.54872 21.192 8.56491 21.1276C8.59885 20.9925 8.85823 20.3228 10.7343 19.4836C10.4657 19.9067 10.0457 20.5113 9.58437 20.963C9.25962 21.2669 9.00674 21.4211 8.83276 21.4211C8.77052 21.4211 8.68476 21.4041 8.57338 21.2712Z" fill="#D92D20" />
                                </svg>

                                <div className="flex flex-col">
                                    <p className=" text-gray-900">{fileName ? fileName : "Mentor's Resume"}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>

        <div className='w-[95%] mx-auto mt-5 md:mt-10 pb-2 md:pb-4 bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
            <IndustryExperience setDeleteIdsData={setDeleteIdsData} />
        </div>

        <div className='w-[95%] mx-auto mt-5 md:mt-10 pb-2 md:pb-4 bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
            <ClientSizeFocus />
        </div>

    </>
    );
};

export default Resume;
