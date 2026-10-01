'use client';

import React, { useEffect, useState } from 'react';
import Gallery from './Gallery/Gallery';
import Snapshot from './Snapshot/Snapshot';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiEndpoint } from '@/utils/utils';
import Image from 'next/image';
import BasicInfoSwitch from './BasicInfoSwitch';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
import DefaultBanner from './image.png'
import Loader from '@/components/ui/loader';

export const profileFormSchema = z.object({
    Gallery: z
        .object({
            photos: z.array(z.string()),
            videos: z.array(z.string()),
        })
        .optional(),

    businessChannels: z
        .array(
            z.object({
                name: z.string().min(1, 'Required'),
                percent: z.number().min(0).max(100),
            })
        )
        .refine(
            (channels) => {
                const total = channels.reduce((sum, item) => sum + item.percent, 0);
                return total === 100;
            },
            {
                message: 'Total percentage should be 100%',
            }
        ),

    locations: z.array(z.object({
        cityId: z.string().min(1, 'City is required')
    })),

    products: z.array(
        z.object({
            name: z.string().min(1, 'Required'),
            percent: z.number().min(0).max(100),
        })
    )
        .refine(
            (channels) => {
                const total = channels.reduce((sum, item) => sum + item.percent, 0);
                return total === 100;
            },
            {
                message: 'Total percentage should be 100%',
            }
        ),

    clientSizes: z.array(
        z.object({
            label: z.string(),
            percent: z.number().min(0).max(100),
        })
    )
        .refine(
            (channels) => {
                const total = channels.reduce((sum, item) => sum + item.percent, 0);
                return total === 100;
            },
            {
                message: 'Total percentage should be 100%',
            }
        ),

    revenue: z
        .array(
            z.object({
                year: z.string().min(1, 'Year is required'),
                amount: z.string().min(1, 'Amount is required'),
            })
        )
        .max(5, 'Maximum 5 years'),

    businessHighlights: z.object({
        growth: z.number({ invalid_type_error: 'Growth is required' })
            .refine(val => !isNaN(val), { message: 'Growth is required' }),
        investment: z.number({ invalid_type_error: 'Investment is required' })
            .refine(val => !isNaN(val), { message: 'Investment is required' }),
        RegularCustomers: z.number({ invalid_type_error: 'Regular customers are required' })
            .refine(val => !isNaN(val), { message: 'Regular customers are required' })
    }),
    revenueCurrency: z.string().min(1, 'Currency is required')
});

export type ProfileFormType = z.infer<typeof profileFormSchema>;

const TabSwitcher = ({ currentUserData, onBack }) => {

    const currentUser = typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'gallery' | 'snapshot'>('gallery');
    const [isLoading, setIsLoading] = useState(false)
    const methods = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
        defaultValues: {
            Gallery: {
                videos: [],
                photos: []
            },

            businessChannels: [],
            locations: [],
            products: [],
            clientSizes: [
                { label: 'Individual', percent: 25 },
                { label: 'Business', percent: 25 },
                { label: 'Middle Market', percent: 25 },
                { label: 'Enterprise', percent: 25 },
            ],
            revenue: [],
        },
    });

    const onSubmit = async (data: ProfileFormType, e) => {
        e.preventDefault();
        if (activeTab == 'snapshot') {
            const individualPercent = (data.clientSizes.find(item => item.label === 'Individual')).percent.toString();
            const enterprisePercent = (data.clientSizes.find(item => item.label === 'Enterprise')).percent.toString();
            const marketPercent = (data.clientSizes.find(item => item.label === 'Middle Market')).percent.toString();
            const businessPercent = (data.clientSizes.find(item => item.label === 'Business')).percent.toString();
            const locationList = data.locations.map(location => location.cityId);
            const businessChannelModels = data.businessChannels.map(channel => ({
                BusinessValue: channel.name,
                BusinessPercentage: channel.percent.toString()
            }));
            const serviceModels = data.products.map(product => ({
                ServiceName: product.name,
                ServicePercentage: product.percent.toString()
            }));
            const LastYearRevenues = data.revenue.map(product => ({
                Year: product.year.toString(),
                Revenue: product.amount.toString()
            }));
            const businessGrowth = data.businessHighlights.growth.toString();
            const amountOfInvestment = data.businessHighlights.investment.toString();
            const regularCustomers = data.businessHighlights.RegularCustomers.toString();

            const serviceChartsData = {
                UserId: currentUser?.Id,
                UserProfileDetailId: currentUser?.UserProfileDetailsId,
                UserProfileType: "Black-owned Business",
                EnterprisePercentage: enterprisePercent,
                IndividualPercentage: individualPercent,
                MidmarketBusinessPercentage: marketPercent,
                SmallBusinessPercentage: businessPercent,
                LocationList: locationList,
                businessChannelModels: businessChannelModels,
                serviceModels: serviceModels,
                LastYearRevenues: LastYearRevenues,
                BusinessGrowth: businessGrowth,
                AmountOfInvestment: amountOfInvestment,
                RegularCustomers: regularCustomers,
                CurrencySymbol: data.revenueCurrency,
            };
            setIsLoading(true)
            try {
                const result = await axios.post(
                    `${apiEndpoint}/Profile/CreateServicesChartsInformationProfile`,
                    serviceChartsData,
                    {
                        headers: {
                            XApiKey:
                                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                        },
                    }
                );

                if (result.status === 200) {
                    toast.success("Profile Updated Successfully!")
                    router.push(
                        `/profile/${add2040ToProfileDetailsId(currentUser?.UserProfileDetailsId
                        )}`
                    )
                }
            } catch {
                toast.error("Profile Update Failed!")
            } finally {
                setIsLoading(false)
            }
        }
    };

    const onFail = async () => {
        if (activeTab === 'gallery') {
            const data = methods.getValues();
            const photoData = data.Gallery.photos.map(url => ({
                OrigionalName: url
            }));
            const videoData = data.Gallery.videos.map(url => ({
                OrigionalName: url
            }));
            const mediaData = {
                UserId: currentUser?.Id,
                UserProfileDetailId: currentUser?.UserProfileDetailsId,
                ProfilePictureList: photoData,
                VideoList: videoData,
            };
            setIsLoading(true)
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Profile/UpdateBusinessPhotoVideo`,
                    mediaData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            XApiKey: process.env.NEXT_PUBLIC_API_KEY,
                        },
                    }
                );
                if (response.status === 200) {
                    setActiveTab('snapshot');
                } else {
                    toast.error('Update failed');
                }
            } catch {
                toast.error('Update failed');
            } finally {
                setIsLoading(false)
            }
        }
    };

    const tabStyle = (tab: 'gallery' | 'snapshot') =>
        `text-[14px] w-1/2 text-center py-3 rounded-xl transition-all duration-300 ${activeTab === tab ? 'text-gray-900 font-bold bg-white shadow-md' : 'font-medium text-gray-500'
        }`;

    const handleBack = () => {
        if (activeTab === 'snapshot') {
            setActiveTab('gallery');
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
                    Business Profile
                </div>
                <div className='w-[95%] mt-5 pb-16 bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-sm mx-auto'>
                    <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-64 md:aspect-[3200/560] relative">
                        <Image
                            src={currentUserData?.BannerPicture ? currentUserData?.BannerPicture : DefaultBanner}
                            alt="Banner"
                            className="w-full h-full object-cover rounded-t-2xl"
                            width={3200}
                            height={410}
                        />

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
                    {/* <BasicInfoSwitch currentUserData={currentUserData} /> */}
                </div>
                <form onSubmit={methods.handleSubmit(onSubmit, onFail)}>
                    <div className="w-[95%] mx-auto bg-[#EAECF0] rounded-xl h-auto relative mb-8 sm:mb-12 mt-10 px-2 py-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('gallery')}
                            className={tabStyle('gallery')}
                        >
                            Gallery
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('snapshot')}
                            className={tabStyle('snapshot')}
                        >
                            Snapshot
                        </button>
                    </div>

                    {/* Render tabs */}
                    {activeTab === 'gallery' ?
                        <Gallery currentUserData={currentUserData} /> :
                        <Snapshot currentUserData={currentUserData} />
                    }

                    {/* save button */}
                    <div className="w-[95%] text-sm mx-auto mb-5 mt-5">
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
                                <button type='submit' className={`${activeTab == 'gallery' ? "text-[#2D65DD] bg-[#EAF0FE] hover:text-omblue-500" : "text-omblue-500 "} px-4 py-2 rounded-md border border-[#D0D5DD]  font-semibold shadow-[14px]  hover:bg-gray-50 transition`}>
                                    {activeTab == 'gallery' ? "Save & continue" : <>
                                        <span className=''>Publish Profile</span>
                                    </>}
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
