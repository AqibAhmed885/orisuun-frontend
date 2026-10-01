'use client';

import React, { useState } from 'react';
import TeamMemberPopup from './AddPeoplePopup';
import { useFormContext } from 'react-hook-form';

const AssociatePeople = () => {
    const {
        register,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useFormContext();
    const [showPopup, setShowPopup] = useState(false);
    const teamMembers = watch('TeamMembers');
    
    return (
        <>
            <div className='w-[95%] mx-auto min-h-[24rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
                <div className="max-w-full mx-auto">
                    <div className="w-[95%] mx-auto bg-white rounded-t-2xl h-auto relative mb-16 sm:mb-20 px-6 py-4">
                        <div className='pb-5'>
                            <h2 className='text-[16px] font-semibold'>Associated  People</h2>
                        </div>
                        <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl w-[100%] py-16">
                            <div className="mb-4">
                                <svg width="59" height="58" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="57" height="56" rx="11.5" fill="white" />
                                    <rect x="1" y="1" width="57" height="56" rx="11.5" stroke="#F2F4F7" />
                                    <path d="M34.4999 32.6974C35.7131 33.3069 36.7533 34.285 37.5126 35.508C37.6629 35.7502 37.7381 35.8713 37.7641 36.039C37.8169 36.3798 37.5839 36.7988 37.2665 36.9336C37.1103 37 36.9346 37 36.5832 37M32.8332 29.1102C34.068 28.4966 34.9165 27.2224 34.9165 25.75C34.9165 24.2776 34.068 23.0034 32.8332 22.3898M31.1665 25.75C31.1665 27.8211 29.4876 29.5 27.4165 29.5C25.3455 29.5 23.6665 27.8211 23.6665 25.75C23.6665 23.6789 25.3455 22 27.4165 22C29.4876 22 31.1665 23.6789 31.1665 25.75ZM21.6326 35.282C22.9611 33.2871 25.0577 32 27.4165 32C29.7754 32 31.8719 33.2871 33.2005 35.282C33.4916 35.719 33.6371 35.9375 33.6203 36.2166C33.6073 36.4339 33.4648 36.7 33.2912 36.8313C33.0681 37 32.7614 37 32.1479 37H22.6852C22.0717 37 21.7649 37 21.5419 36.8313C21.3682 36.7 21.2258 36.4339 21.2127 36.2166C21.196 35.9375 21.3415 35.719 21.6326 35.282Z" stroke="#101828" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-4 text-center text-[16px]">
                                Add team members who will have access to this business profile
                            </p>
                            <button type='button' onClick={() => setShowPopup(true)} className="px-6 py-2 rounded-md bg-[#2357C6] text-white text-[16px] font-semibold hover:bg-blue-200 transition">
                                Add People
                            </button>
                            {teamMembers?.length > 0 && (
                                <div className="mt-8 w-full">
                                    <h3 className="text-[16px] font-semibold text-gray-800 mb-4 ms-5">Associated Members -</h3>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ms-5">
                                        {teamMembers.map((member, index) => (
                                            <div
                                                key={index}
                                                className="w-[24rem] bg-white border border-gray-200 rounded-lg shadow-md p-4 flex gap-4 items-start relative"
                                            >
                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => {
                                                        const updatedMembers = [...teamMembers];
                                                        updatedMembers.splice(index, 1);
                                                        setValue('TeamMembers', updatedMembers);
                                                    }}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                                                    title="Remove"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
          1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 
          11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 
          4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>

                                                {/* Avatar or Placeholder */}
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {member.ProfilePicture ? (
                                                        <img
                                                            src={member.ProfilePicture}
                                                            alt={member.Name}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-gray-500 uppercase">
                                                            {member.Name?.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Member Info */}
                                                <div className="flex-1">
                                                    <p className="text-[15px] font-semibold text-gray-800">Name: {member.Name}</p>
                                                    <p className="text-[14px] text-gray-600">
                                                        <span className="font-semibold">About:</span> {member.About}
                                                    </p>
                                                    <p className="text-[14px] text-gray-600">
                                                        <span className="font-semibold">Position:</span> {member.Position}
                                                    </p>
                                                    <p className="text-[13px] text-gray-500">
                                                        <span className="font-semibold">Email:</span> {member.Email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup */}
            {showPopup && (
                <TeamMemberPopup onClose={() => setShowPopup(false)} />
            )}
        </>
    );
};

export default AssociatePeople;
