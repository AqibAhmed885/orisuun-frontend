'use client';

import React from 'react';
import SocialMediaSection from './socialMedia';
import TagInput from './TagInput';
import { useFormContext } from 'react-hook-form';

const ContactInformation: React.FC = () => {
    const {
        register,
        formState: { errors },
        setValue
    } = useFormContext();

    return (
        <div className='w-[95%] mx-auto min-h-[60rem] md:min-h-[58rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-full mx-auto">
                <div className="w-[95%] mx-auto bg-white h-52 relative mb-16 sm:mb-20">
                    <div className='pb-5 pt-5'>
                        <h2 className='text-[16px] font-semibold'>Contact Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Custom URL */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-black">Custom URL</label>
                            <div className="flex w-full">
                                <span className="bg-gray-100 text-gray-500 px-3 py-3 rounded-l-md border border-r-0 border-gray-300 text-[16px] shadow-md">
                                    orisuun.com/
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter custom url"
                                    {...register('ProfileUrl')}
                                    className="w-full min-w-0 text-[16px] font-normal text-gray-500 px-4 py-3 border border-gray-300 rounded-r-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <p className="text-[14px] text-[#4B5563]">Create a custom url for your profile</p>
                            {typeof errors.ProfileUrl?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.ProfileUrl.message}</p>}
                        </div>

                        {/* Search Tag */}
                        <TagInput maxTags={5} />
                    </div>

                    <div className="mt-5 w-full mx-auto bg-white h-52 relative mb-16 sm:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Business Mail */}
                            <div className="space-y-2">
                                <label className="block text-[16px] font-semibold text-black">Business Mail*</label>
                                <input
                                    type="email"
                                    placeholder="contact@business.com"
                                    {...register('EmailIdForBusinessDevelopment')}
                                    className="w-full text-[16px] font-normal text-gray-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {typeof errors.EmailIdForBusinessDevelopment?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.EmailIdForBusinessDevelopment.message}</p>}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="block text-[16px] font-semibold text-black">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="+1 (555) 123-4567"
                                    {...register('PhoneNumber')}
                                    className="w-full text-[16px] font-normal text-gray-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {typeof errors.PhoneNumber?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.PhoneNumber.message}</p>}
                            </div>

                            {/* Social Media */}
                            <div className='col-span-2'>
                                <SocialMediaSection />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInformation;
