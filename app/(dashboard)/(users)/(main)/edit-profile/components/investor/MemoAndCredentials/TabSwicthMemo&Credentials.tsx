'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import BasicInfoSwitch from './BasicInfoSwitch';
import Memo from './Memo/Memo';
import Credentials from './Credentials/Credentials';
import DefaultBanner from './image.png'
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

export const profileFormSchema = z.object({
    Memo: z.string().optional(),
    assetsUnderManagement: z.number().optional(),
    averageTimeToClose: z.string().optional(),
    numberOfFunds: z.number().optional(),
    averageReturn: z.number().optional(),

    professionalExperience: z
        .array(
            z.object({
                Id: z.number().min(0, 'Required'),
                CompanyName: z.string().min(1, 'Required'),
                StartDate: z.string().min(1, 'Required'),
                EndDate: z.string().min(1, 'Required'),
                Responsibility: z.string()
            })
        ),

    educationCertification: z
        .array(
            z.object({
                Id: z.number().min(0, 'Required'),
                School: z.string().min(1, 'Required'),
                DegreeTypeId: z.number().min(1, 'Required'),
                StartDate: z.string().min(1, 'Required'),
                EndDate: z.string().min(1, 'Required'),
                AboutProgram: z.string()
            })
        ),

    recognitionAward: z
        .array(
            z.object({
                Id: z.number().min(0, 'Required'),
                AwardingBody: z.string().min(1, 'Required'),
                Name: z.string().min(1, 'Required')
            })
        ),

    skills: z.array(z.object({
        Id: z.number().min(0, 'Required'),
        Skill: z.string().min(1, 'Required'),
    })).min(1, '*At least one skill is required'),

    publicationResearch: z.array(z.object({
        Id: z.number().min(0, 'Required'),
        Title: z.string().min(1, 'Required')
    }))
});

export type ProfileFormType = z.infer<typeof profileFormSchema>;

const TabSwitcher = ({ currentUserData, investorType, onBack }) => {

    const currentUser = typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'memo' | 'credentials'>('memo');
    const [isLoading, setIsLoading] = useState(false);
    const [deleteIdsData, setDeleteIdsData] = useState({
        professionalExperience: [],
        educationCertification: [],
        recognitionAward: [],
        skills: [],
        publicationResearch: [],
    })

    const methods = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            Memo: "",
            assetsUnderManagement: 0,
            averageTimeToClose: "",
            numberOfFunds: 0,
            averageReturn: 0,
            professionalExperience: [],
            educationCertification: [],
            recognitionAward: [],
            skills: [],
            publicationResearch: [],
        },
    });

    const onSubmit = async (data: ProfileFormType) => {
        if (activeTab == 'credentials') {
            const credentialsData = {
                UserId: currentUser?.Id,
                UserProfileDetailId: currentUser?.UserProfileDetailsId,
                UsersProfessionalExperiences: data.professionalExperience,
                UsersEducationCertifications: data.educationCertification,
                UsersRecognitionAwards: data.recognitionAward,
                UserSkills: data.skills,
                UserPublicationResearches: data.publicationResearch,
                DeleteProfessionalExperiencesIds: deleteIdsData.professionalExperience || [],
                DeleteEducationCertificationsIds: deleteIdsData.educationCertification || [],
                DeleteRecognitionAwardsIds: deleteIdsData.recognitionAward || [],
                DeleteSkillsIds: deleteIdsData.skills || [],
                DeletePublicationResearchesIds: deleteIdsData.publicationResearch || [],
            }
            setIsLoading(true)
            try {
                const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Profile/SaveOrUpdateInvestorProfileDetails`,
                    credentialsData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            XApiKey: process.env.NEXT_PUBLIC_API_KEY,
                        },
                    }
                );
                if (response.status === 200) {
                    toast.success("Credentials Updated successfully!")
                    router.push(
                        `/profile/${add2040ToProfileDetailsId(currentUser?.UserProfileDetailsId
                        )}`
                    )
                } else {
                    toast.error('Update failed!');
                }
            } catch {
            }
            finally {
                setIsLoading(false)
            }
        }
    };

    const isStringAndNotNull = (value: unknown): value is string => {
        return typeof value === 'string' && value.trim() !== '';
    };

    const onInvalid = async () => {
        const data = methods.getValues();
        if (activeTab === 'memo') {
            if (isStringAndNotNull(data.Memo) && data.assetsUnderManagement >= 0 && isStringAndNotNull(data.averageTimeToClose) && data.numberOfFunds >= 0 && data.averageReturn >= 0) {
                const memoAndHighlightsData = {
                    UserId: currentUser?.Id,
                    UserProfileDetailId: currentUser?.UserProfileDetailsId,
                    InvestorMemo: data.Memo,
                    AssetsUnderManagement: data.assetsUnderManagement.toString(),
                    AvgTimeToClose: data.averageTimeToClose,
                    NumberOfFunds: data.numberOfFunds.toString(),
                    AverageReturn: data.averageReturn.toString(),
                };
                setIsLoading(true)
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Profile/SaveInvestorMemoAndHighlights`,
                        memoAndHighlightsData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                XApiKey: process.env.NEXT_PUBLIC_API_KEY,
                            },
                        }
                    );
                    if (response.status === 200) {
                        toast.success("Memo and Highlights Updated successfully!")
                        setActiveTab('credentials');
                    } else {
                        toast.error('Update failed');
                    }
                } catch {
                    toast.error('Update failed');
                } finally {
                    setIsLoading(false)
                }
            }
            else {
                toast.error('Please Fill Required fields!')
            }
        }
    };

    const tabStyle = (tab: 'memo' | 'credentials') =>
        `text-[14px] w-1/2 text-center py-3 rounded-xl transition-all duration-300 ${activeTab === tab ? 'text-gray-900 font-bold bg-white shadow-md' : 'font-medium text-gray-500'
        }`;

    const handleBack = () => {
        if (activeTab === 'credentials') {
            setActiveTab('memo');
            return;
        }

        if (onBack) {
            onBack();
        }
    };

    return (
        <>
            {isLoading && (
                <Loader />
            )}
            <FormProvider {...methods}>
                <div className="text-lg font-semibold px-8 py-2 bg-white">
                    Investor Profile
                </div>
                <div className='w-[95%] mt-5 pb-16 bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-sm mx-auto'>
                    <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-64 md:aspect-[3200/560] relative">
                        {/* Show banner image if available */}<Image
                            src={currentUserData?.BannerPicture ? currentUserData?.BannerPicture : DefaultBanner}
                            alt="Banner"
                            className="w-full h-full object-cover rounded-t-2xl"
                            width={3200}
                            height={410}
                        />

                        {/* Share Button */}
                        <button
                            className="absolute flex bg-white py-[7px] px-[10px] rounded right-4 top-4 text-blue-600 hover:text-blue-700"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                    .then(() => {
                                        toast.success('Link copied to clipboard!');
                                    })
                                    .catch((err) => {
                                        console.error('Failed to copy URL: ', err);
                                        toast.error('Failed to copy link');
                                    });
                            }}
                        >
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.15833 11.2587L11.85 14.5753M11.8417 5.42533L6.15833 8.74199M16.5 4.16699C16.5 5.5477 15.3807 6.66699 14 6.66699C12.6193 6.66699 11.5 5.5477 11.5 4.16699C11.5 2.78628 12.6193 1.66699 14 1.66699C15.3807 1.66699 16.5 2.78628 16.5 4.16699ZM6.5 10.0003C6.5 11.381 5.38071 12.5003 4 12.5003C2.61929 12.5003 1.5 11.381 1.5 10.0003C1.5 8.61961 2.61929 7.50033 4 7.50033C5.38071 7.50033 6.5 8.61961 6.5 10.0003ZM16.5 15.8337C16.5 17.2144 15.3807 18.3337 14 18.3337C12.6193 18.3337 11.5 17.2144 11.5 15.8337C11.5 14.4529 12.6193 13.3337 14 13.3337C15.3807 13.3337 16.5 14.4529 16.5 15.8337Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="ml-2 text-sm font-semibold">Share</span>
                        </button>
                    </div>
                    {/* <BasicInfoSwitch currentUserData={currentUserData} investorType={investorType} /> */}
                </div>
                <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
                    <div className="w-[95%] mx-auto bg-[#EAECF0] rounded-xl h-auto relative mb-8 sm:mb-12 mt-10 px-2 py-2">
                        <button
                            type="button"
                            className={tabStyle('memo')}
                        >
                            Snapshot
                        </button>
                        <button
                            type="button"
                            className={tabStyle('credentials')}
                        >
                            Credentials
                        </button>
                    </div>

                    {/* Render tabs */}
                    {activeTab === 'memo' ? <Memo currentUserData={currentUserData} /> :
                        <Credentials currentUserData={currentUserData} setDeleteIdsData={setDeleteIdsData} />
                    }

                    {/* save button */}
                    <div className="w-[95%] mx-auto mb-5 mt-5">
                        <div className='flex justify-between w-[92%] mx-auto'>
                            <div className='flex gap-2'>
                                <button
                                    type='button'
                                    onClick={handleBack}
                                    className="px-4 py-2 rounded-md border border-[#D0D5DD] text-[#344054] bg-white font-semibold shadow-[14px] hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                                <button type='button' className="px-4 py-2 rounded-md border border-[#D0D5DD] text-[#344054] bg-white font-semibold shadow-[14px] hover:bg-gray-50 transition">
                                    Save & Close
                                </button>
                            </div>
                            <div className='flex gap-2'>
                                <button type='submit' className={`${activeTab == 'memo' ? "text-[#2D65DD] bg-[#EAF0FE]" : "text-white bg-[#2357C6]"} px-4 py-2 rounded-md border border-[#D0D5DD]  font-semibold shadow-[14px] hover:bg-gray-50 transition`}>
                                    {activeTab == 'memo' ? "Save & continue" : "Publish Profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default TabSwitcher;
