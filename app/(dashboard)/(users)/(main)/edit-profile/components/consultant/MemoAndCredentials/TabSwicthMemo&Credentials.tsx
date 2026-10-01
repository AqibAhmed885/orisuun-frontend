'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import BasicInfoSwitch from './BasicInfoSwitch';
import Credentials from './Credentials/Credentials';
import DefaultBanner from './image.png'
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';
import Resume from './Resume/Resume';

export const profileFormSchema = z.object({
    resume: z.string().optional(),
    mentorIndustryExperience: z
        .array(
            z.object({
                Id: z.number().min(0, 'Required'),
                Industry: z.string().min(1, 'Required'),
                YearsOfExperience: z.number()
                    .min(1, 'Must be at least 1')
                    .max(100, 'Cannot be more than 100')
            })
        ).optional(),
    mentorClientSizeFocus: z
        .array(
            z.object({
                Id: z.number().min(0, 'Required'),
                ClientSize: z.string().min(1, 'Required'),
                Percentage: z.number().min(1, 'Required')
            })
        )
        .optional()
        .refine((arr) => {
            if (!arr || arr.length === 0) return true;
            const sum = arr.reduce((acc, item) => acc + item.Percentage, 0);
            return sum === 100;
        }, {
            message: 'Sum of all Percentages must be exactly 100',
        }),

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

const TabSwitcher = ({ currentUserData, onBack }) => {

    const currentUser = typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'resume' | 'credentials'>('resume');
    const [isLoading, setIsLoading] = useState(false);
    const [deleteIdsData, setDeleteIdsData] = useState({
        mentorIndustryExperience: [],
        mentorClientSizeFocus: [],
        professionalExperience: [],
        educationCertification: [],
        recognitionAward: [],
        skills: [],
        publicationResearch: [],
    })

    const methods = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            resume: "",
            mentorIndustryExperience: [],
            mentorClientSizeFocus: [],
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
        if (activeTab === 'resume') {
            if (isStringAndNotNull(data.resume) && data.mentorIndustryExperience.length > 0 && data.mentorClientSizeFocus.length > 0) {
                const IndustryError = data.mentorIndustryExperience.some(
                    (item) => item.YearsOfExperience > 100 || item.YearsOfExperience < 0
                );
                const totalPercent = data.mentorClientSizeFocus.reduce(
                    (sum, item) => sum + item.Percentage,
                    0
                );
                if(IndustryError){
                    toast.error("Invalid data for Years Of Experience!")
                }
                else if(totalPercent != 100){
                    toast.error("Total Client Size Percentage should be 100%!")
                }
                else if (!IndustryError && totalPercent == 100) {
                    const resumeData = {
                        UserId: currentUser?.Id,
                        UserProfileDetailId: currentUser?.UserProfileDetailsId,
                        Resume: data.resume,
                        MentorIndustryExperience: data.mentorIndustryExperience.map((item) => ({
                            Id: item.Id,
                            Industry: item.Industry,
                            YearsOfExperience: item.YearsOfExperience.toString()
                        })),
                        MentorClientSizeFocus: data.mentorClientSizeFocus.map((item) => ({
                            Id: item.Id,
                            ClientSize: item.ClientSize,
                            Percentage: item.Percentage.toString()
                        })),
                        DeleteMentorIndustryExperienceIds: deleteIdsData.mentorIndustryExperience || [],
                        DeleteMentorClientSizeFocusIds: deleteIdsData.mentorClientSizeFocus || [],
                    };
                    setIsLoading(true)
                    try {
                        const response = await axios.post(
                            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Profile/SaveMentorProfileExtraFieldsDetails`,
                            resumeData,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    XApiKey: process.env.NEXT_PUBLIC_API_KEY,
                                },
                            }
                        );
                        if (response.status === 200) {
                            toast.success("Profile Data Updated successfully!")
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
            }
            else {
                toast.error('Please Fill all Required fields!')
            }
        }
    };

    const tabStyle = (tab: 'resume' | 'credentials') =>
        `text-[14px] w-1/2 text-center py-3 rounded-xl transition-all duration-300 ${activeTab === tab ? 'text-gray-900 font-bold bg-white shadow-md' : 'font-medium text-gray-500'
        }`;

    const handleBack = () => {
        if (activeTab === 'credentials') {
            setActiveTab('resume');
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
                    Strategy Consultant
                </div>
                <div className='w-[95%] mt-5 pb-16 bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-sm mx-auto'>
                    {/* <BasicInfoSwitch currentUserData={currentUserData} /> */}
                </div>
                <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
                    <div className="w-[95%] mx-auto bg-[#EAECF0] rounded-xl h-auto relative mb-8 sm:mb-12 mt-10 px-2 py-2">
                        <button
                            type="button"
                            className={tabStyle('resume')}
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
                    {activeTab === 'resume' ? <Resume currentUserData={currentUserData} setDeleteIdsData={setDeleteIdsData} /> :
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
                                <button type='submit' className={`${activeTab == 'resume' ? "text-[#2D65DD] bg-[#EAF0FE]" : "text-white bg-[#2357C6]"} px-4 py-2 rounded-md border border-[#D0D5DD]  font-semibold shadow-[14px] hover:bg-gray-50 transition`}>
                                    {activeTab == 'resume' ? "Save & continue" : "Publish Profile"}
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
