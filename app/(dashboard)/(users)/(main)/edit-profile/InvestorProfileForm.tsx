'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import BasicInformation from './components/investor/Basic/Basic';
import ContactInformation from './components/investor/Contact/Contact';
import AboutBusiness from './components/investor/About/About';
import AssociatePeople from './components/investor/AssociatePeople/AssociatePeople';
import TabSwitcher from './components/investor/MemoAndCredentials/TabSwicthMemo&Credentials';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { generateUploadFileSasTokenData } from './components/investor/Basic/ProfileImage';
import { apiEndpoint } from '@/utils/utils';
import { useDispatch } from 'react-redux';
import { updateCurrentUser, addProfileData } from '@/data/slices/user-slice';
import InvestmentThesisInput from './components/investor/InvestmentThesis/Thesis';
import InvestmentStatsSection from './components/investor/InvestmentStats/InvestmentStats';
import NotableInvestmentSection from './components/investor/NotableInvestment/NotableInvestment';
import Loader from '@/components/ui/loader';
import { useRouter } from 'next/navigation';
import { updateStoredUserData } from '@/utils/user-storage';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

const NotableInvestmentSchema = z.object({
    Id: z.number({ required_error: 'Id is required' }).min(0, 'Id is required'),
    CompanyName: z
        .string({ required_error: 'Company name is required' })
        .min(1, 'Company name is required'),
    InvestmentAmt: z
        .union([
            z.string().min(1, 'Investment amount is required'),
            z.number().min(1, 'Investment amount is required'),
        ]),
    InvestmentStage: z
        .array(z.string())
        .min(1, 'At least one investment stage is required'),
    InvestmentStageFormatted: z.string().optional(),
    InvestmentStatus: z
        .string({ required_error: 'Investment status is required' })
        .min(1, 'Investment status is required')
        .refine((val) => val === 'Active' || val === 'Exited', {
            message: 'Investment status must be either Active or Exited',
        }),
});

const getInvestorRegistrationSchema = (investorType: string) => z.object({
    BannerPicture:
        z.string().url('Invalid banner image URL').or(z.literal('')).optional(),
    BusinessImage: z
        .string()
        .url('Invalid profile picture URL'),
    OrganizationName: z
        .string({ required_error: 'Organization Name is required' })
        .min(2, 'Organization Name should be at least 2 characters'),
    FirstName: investorType === 'individual'
        ? z.string({ required_error: 'First Name is required' })
            .min(2, 'First Name should be at least 2 characters')
        : z.string().optional(),
    LastName: z.string({ required_error: 'Last Name is required' }),
    Website: z
        .string()
        .url('Invalid Website URL')
        .optional()
        .or(z.literal('')),
    TitlePosition: z.string().optional(),
    StreetAddress: z.string().min(1, 'Street Address is required'),
    State: z.string().optional(),
    City: z.string().min(1, 'City is required'),
    Country: z.string().min(1, 'Country is required'),
    minCheckSize: z.union([
        z.string().min(1).transform(Number),
        z.number().min(1000, `Minimum check size must be at least $1000`)
    ]),
    maxCheckSize: z.union([
        z.string().min(1).transform(Number),
        z.number().max(100000000000000, `Maximum check size must be less than $10000000`)
    ]),
    InvestmentStage: z.array(z.string()).min(1, "At least one stage is required"),
    InvestmentStageFormatted: z
        .string()
        .min(1, 'Investment Stage is required'),
    InvestorType: z.array(z.string()).min(1, 'At least one type is requried'),
    InvestorTypeFormatted: z.string().min(1, 'Investor Type is required'),
    GeographyOfService: z.array(z.string()).min(1, "At least one geography is required"),
    GeographyOfServiceFormatted: z
        .string()
        .min(1, 'Geography of Service is required'),
    About: z.string().min(1, 'About is required'),
    Mission: z.string().optional(),
    Vision: z.string().optional(),
    Languages: z.string().optional(),
    ProfileUrl: z
        .string()
        .min(1, 'Custom URL must have at least one character after orisuun.com/')
        .refine((value) => /^[a-zA-Z0-9-]+$/.test(value), {
            message: 'Custom URL can only contain letters, numbers, and hyphens',
        }),
    Tags: z.array(z.string()).max(5, 'Enter up to 5 tags').optional(),
    EmailIdForBusinessDevelopment: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
    PhoneNumber: z.string().optional(),
    SocialLinks: z.object({
        YoutubeUrl: z
            .string()
            .regex(/\./, 'Invalid Youtube URL')
            .optional()
            .or(z.literal('')),
        FacebookUrl: z
            .string()
            .regex(/\./, 'Invalid Facebook URL')
            .optional()
            .or(z.literal('')),
        LinkedinUrl: z
            .string()
            .regex(/\./, 'Invalid LinkedIn URL')
            .optional()
            .or(z.literal('')),
        BlueSkyUrl: z
            .string()
            .regex(/\./, 'Invalid BlueSky URL')
            .optional()
            .or(z.literal('')),
        InstagramUrl: z
            .string()
            .regex(/\./, 'Invalid Instagram URL')
            .optional()
            .or(z.literal('')),
        ThreadsUrl: z
            .string()
            .regex(/\./, 'Invalid Threads URL')
            .optional()
            .or(z.literal('')),
        TwitterUrl: z
            .string()
            .regex(/\./, 'Invalid Twitter URL')
            .optional()
            .or(z.literal('')),
        RedditUrl: z
            .string()
            .regex(/\./, 'Invalid Reddit URL')
            .optional()
            .or(z.literal('')),
    }).optional(),
    InvestmentThesis: z.string().min(1, 'Thesis is required'),
    TeamMembers: z.array(z.object({
        Name: z.string().min(1),
        ProfilePicture: z.string().url().min(1),
        Position: z.string().min(1),
        About: z.string().min(1),
        Email: z.string().email(),
        Username: z.string().min(4),
        Password: z.string().optional(),
    })).optional(),
    InvestmentsNumber: z.string().optional(),
    Exits: z.string().optional(),
    ActivePortfolio: z.string().optional(),
    NotableInvestments: z
        .array(NotableInvestmentSchema)
        .optional(),
    Language: z.string().optional(),
});

type InvestorRegistrationFormData = z.infer<
    ReturnType<typeof getInvestorRegistrationSchema>
>;;

const InvestorRegistrationForm = ({ investorType }) => {
    const currentUser = typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const dispatch = useDispatch();
    const router = useRouter();
    const [currentUserData, setCurrentUserData] = useState<any>(null);
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    const [deleteNotableInvestmentIds, setDeleteNotableInvestmentIds] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitAction, setSubmitAction] = useState<'publish' | 'continue' | null>(null);


    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                `${apiEndpoint}/Profile/ViewUserProfileV1`,
                {
                    UserProfileDetailId: currentUser.UserProfileDetailsId,
                    UserId: currentUser.Id,
                    Username: currentUser.UserName,
                },
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (response.status === 200) {
                const profile = response.data.Result;
                dispatch(addProfileData(profile));
                setCurrentUserData(profile);
                setBannerPreview(profile.BannerPicture)
                setIsLoading(false);

            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const getSocialUrl = (type: string, data: any) => {
        return (
            data?.SocialMediaUrls?.find((item: any) => item.LinkType === type)
                ?.SocialMediaUrl || ""
        );
    };

    useEffect(() => {
        if (currentUserData) {
            const nameParts = currentUserData.CompanyName?.trim().split(' ') || [];
            reset({
                BannerPicture: currentUserData.BannerPicture || "",
                BusinessImage: currentUserData.ProfilePicture || "",
                OrganizationName: currentUserData.CompanyName || "",
                FirstName: nameParts[0] || '',
                LastName: nameParts[1] || '',
                Website: currentUserData.WebsiteUrl ? currentUserData.WebsiteUrl.replace(/^https?:\/\//, '') : '',
                TitlePosition: currentUserData.Tagline || "",
                StreetAddress: currentUserData.AddressLine1 || "",
                State: currentUserData.State || "",
                City: currentUserData.City || "",
                Country: currentUserData.Country || "",
                minCheckSize: parseInt(currentUserData.MinCheckSize) || 4656000,
                maxCheckSize: parseInt(currentUserData.MaxCheckSize) || 7083000,
                InvestmentStage: currentUserData.InvestmentStage
                    ? currentUserData.InvestmentStage.split('|').map(s => s.trim())
                    : [],
                InvestmentStageFormatted: currentUserData.InvestmentStage || "",
                InvestorType: currentUserData.InvestorType
                    ? currentUserData.InvestorType.split('|').map(s => s.trim())
                    : [],
                InvestorTypeFormatted: currentUserData.InvestorType || "",
                GeographyOfService: currentUserData.GeographyOfService
                    ? currentUserData.GeographyOfService.split('|').map(s => s.trim())
                    : [],
                GeographyOfServiceFormatted: currentUserData.GeographyOfService || "",
                About: currentUserData.AboutCompany || "",
                Mission: currentUserData.Mission || "",
                Vision: currentUserData.Vision || "",
                Languages: (currentUserData.Languages || []).join(', '),
                ProfileUrl: currentUserData.ProfileUrl || "",
                Tags: currentUserData.Tags || [],
                EmailIdForBusinessDevelopment: currentUserData.EmailIdForBusinessDevelopment || "",
                PhoneNumber: currentUserData.PhoneNumber || "",
                SocialLinks: {
                    YoutubeUrl: getSocialUrl("YouTube", currentUserData),
                    FacebookUrl: getSocialUrl("FaceBook", currentUserData),
                    LinkedinUrl: getSocialUrl("LinkedIn", currentUserData),
                    BlueSkyUrl: getSocialUrl("BlueSky", currentUserData),
                    InstagramUrl: getSocialUrl("Instagram", currentUserData),
                    ThreadsUrl: getSocialUrl("Threads", currentUserData),
                    TwitterUrl: getSocialUrl("Twitter", currentUserData),
                    RedditUrl: getSocialUrl("Reddit", currentUserData)
                },
                InvestmentThesis: currentUserData.InvestmentThesis || "",
                TeamMembers: currentUserData.AssociatePeoples || [],
                InvestmentsNumber: currentUserData.Investments || '',
                Exits: currentUserData.Exits || '',
                ActivePortfolio: currentUserData.ActivePortfolio || '',
                NotableInvestments: (currentUserData.NotableInvestment || []).map((item) => ({
                    Id: item.Id || 0,
                    CompanyName: item.CompanyName || '',
                    InvestmentAmt: item.Investment || '',
                    InvestmentStage: item.InvestmentStage
                        ? item.InvestmentStage.split('|').map(s => s.trim())
                        : [],
                    InvestmentStatus: item.InvestmentStatus || '',
                })),
                Language: '',
            });
        }
    }, [currentUserData]);


    const methods = useForm<InvestorRegistrationFormData>({
        resolver: zodResolver(getInvestorRegistrationSchema(investorType)),
        mode: 'onChange',
        defaultValues: {
            BannerPicture: '',
            BusinessImage: '',
            City: '',
            Country: '',
            minCheckSize: 4656000,
            maxCheckSize: 7083000,
            InvestmentStage: [],
            InvestmentStageFormatted: "",
            InvestorType: [],
            InvestorTypeFormatted: "",
            GeographyOfService: [],
            GeographyOfServiceFormatted: "",
            About: '',
            Mission: '',
            Vision: '',
            Languages: '',
            ProfileUrl: '',
            SocialLinks: {
                YoutubeUrl: '',
                FacebookUrl: '',
                LinkedinUrl: '',
                TwitterUrl: '',
                InstagramUrl: '',
            },
            TitlePosition: '',
            Tags: [],
            StreetAddress: '',
            State: '',
            Website: '',
            EmailIdForBusinessDevelopment: '',
            Language: '',
            PhoneNumber: '',
            InvestmentThesis: '',
            TeamMembers: [],
            InvestmentsNumber: '',
            Exits: '',
            ActivePortfolio: '',
            NotableInvestments: (currentUserData?.NotableInvestment || []).map((item) => ({
                Id: 0,
                CompanyName: '',
                InvestmentAmt: '',
                InvestmentStage: '',
                InvestmentStatus: '',
            })),
        }
    });

    const {
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        trigger
    } = methods;

    const onSubmit = async (data: InvestorRegistrationFormData) => {
        var profileId = 0;
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as any);
            }
        });

        const basicProfileData = {
            UserId: currentUser.Id,
            UserProfileTypeId: currentUser.UserProfileTypeId,
            UserProfileId: currentUser.UserProfileDetailsId,
            BannerImage: data.BannerPicture,
            ProfilePicture: data.BusinessImage,
            CompanyName: `${investorType === 'firm' ? data.OrganizationName : data.FirstName}`,
            LastName: `${investorType === 'individual' ? data.LastName : ''}`,
            SubAccountType: investorType,
            Tagline: data.TitlePosition ?? '',
            CountryOfOrigin: data.Country,
            City: data.City,
            ProfileUrl: data.ProfileUrl,
            AboutCompany: data.About,
            SocialMedias: data.SocialLinks,
            Tags: data.Tags,
            CompanyDetails: []
        };

        setIsLoading(true)
        try {
            const result = await axios.post(
                `${apiEndpoint}/Profile/CreateBasicInformationProfile`,
                basicProfileData,
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );

            if (result.status === 200) {
                dispatch(updateCurrentUser({
                    ...result.data.Result,
                    ProfilePicture: data.BusinessImage,
                }));
                updateStoredUserData({
                    UserProfileDetailsId: result?.data?.Result?.ProfileId,
                    ProfilePicture: data.BusinessImage,
                    ...(currentUser?.UserProfileTypeId === 4 && {
                        isBasicProfileDetailExist: true,
                        isProfileComplete: true,
                    }),
                }, currentUser.Id);
                profileId = result.data.Result.ProfileId;
                const businessProfileData = {
                    UserId: currentUser.Id,
                    UserProfileDetailId: profileId,
                    AddressLine1: data.StreetAddress || '',
                    AddressLine2: '',
                    Country: data.Country || '',
                    State: data.State || '',
                    City: data.City || '',
                    Code: '',
                    CompanyWebsite: data.Website,
                    NumberofEmployees: '',
                    EmailIdForQueries: '',
                    EmailIdForBusinessDevelopment: data.EmailIdForBusinessDevelopment || '',
                    BlackOwnershipPercentage: '',
                    EthinicityBlackOwnership: '',
                    Language: data.Languages,
                    PhoneNumber: data.PhoneNumber,
                    Hours: '',
                    BusinessType: '',
                    BusinessSince: '',
                    PublicCompany: '',
                    UserProfileId: profileId,
                    ProfilePictureList: [],
                    videoList: [],
                    Stage: '',
                    FundraisingStage: '',
                    AnnualRevenueVisibility: '',
                    AnnualRevenue: '',
                    OpenToMentorship: '',
                    OpenToInvestment: '',
                    Mission: '',
                    Vision: '',
                    Pitchbook: '',
                    AssociatePeoples: []
                };
                try {
                    const businessResult = await axios.post(
                        `${apiEndpoint}/Profile/CreateBusinessInformationProfilev1`,
                        businessProfileData,
                        {
                            headers: {
                                XApiKey:
                                    'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (businessResult.status === 200) {
                        dispatch(updateCurrentUser(businessResult.data.Result));
                        const notableInvestment = data.NotableInvestments?.map((item) => {
                            return {
                                Id: item.Id,
                                CompanyName: item.CompanyName,
                                Investment: item.InvestmentAmt,
                                InvestmentStage: item.InvestmentStage?.join(" | "),
                                InvestmentStatus: item.InvestmentStatus
                            };
                        });

                        const selectedExtraInfoData = {
                            UserId: currentUser.Id,
                            UserProfileDetailId: profileId,
                            InvestorType: data.InvestorTypeFormatted,
                            MinCheckSize: data.minCheckSize.toString(),
                            MaxCheckSize: data.maxCheckSize.toString(),
                            InvestmentStage: data.InvestmentStageFormatted,
                            GeographyOfService: data.GeographyOfServiceFormatted,
                            Mission: data.Mission,
                            Vision: data.Vision,
                            InvestmentThesis: data.InvestmentThesis,
                            InvestorAccountType: investorType,
                            Investments: data.InvestmentsNumber,
                            Exits: data.Exits,
                            ActivePortfolio: data.ActivePortfolio,
                            AssociatePeoples: data.TeamMembers,
                            NotableInvestments: notableInvestment,
                            DeleteNotableInvestmentIds: deleteNotableInvestmentIds
                        };
                        try {
                            const finalResult = await axios.post(
                                `${apiEndpoint}/Profile/SaveInvestorExtraDetails`,
                                selectedExtraInfoData,
                                {
                                    headers: {
                                        XApiKey:
                                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                                    },
                                }
                            );
                            if (finalResult.status === 200) {
                                fetchProfileData();
                                updateStoredUserData({
                                    isBasicProfileDetailExist: true,
                                    isProfileComplete: true,
                                    ProfilePicture: data.BusinessImage,
                                }, currentUser.Id);
                                toast.success('You have successfully completed your profile!');
                                if (submitAction === 'publish') {
                                    router.push(`/profile/${add2040ToProfileDetailsId(currentUser?.UserProfileDetailsId)}`);
                                    return;
                                }
                                setFormSubmitted(true);
                            }
                        }
                        catch (error) {
                            console.error('Axios error:', error);
                            toast.error(error.response.data.message);
                            return {
                                success: false,
                                message: 'An Error Occured',
                            };
                        }
                    }
                }
                catch (error) {
                    toast.error(error.message);
                }
            } else {
                toast.error('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Something went wrong.');
        } finally {
            setIsLoading(false)
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [bannerPreview, setBannerPreview] = React.useState<string | null>(null);

    const [sasToken, setSasToken] = React.useState<string>('');

    React.useEffect(() => {
        const fetchSasToken = async () => {
            const tokenData = await generateUploadFileSasTokenData();
            setSasToken(tokenData.token);
        };
        fetchSasToken();
    }, []);

    const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const uploadedUrl = await uploadToAzureBlob(file, sasToken);
        if (uploadedUrl) {
            setBannerPreview(uploadedUrl); // for display
            setValue('BannerPicture', uploadedUrl); // store in form as string
            await trigger('BannerPicture'); // trigger validation if needed
        } else {
            toast.error('Failed to upload banner image. Please try again.');
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const uploadToAzureBlob = async (file: File, sasToken: string): Promise<string | null> => {
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
                return blobUrl.split('?')[0]; // return only the image URL
            }
        } catch (err) {
            console.error('Azure upload error:', err);
        }

        return null;
    };

    return (
        <>
            {isLoading && (
                <Loader />
            )}
            {!formSubmitted && !isLoading &&
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* HEADER */}
                        <div className="w-full h-[64px] border-b-2">
                            <h2 className="text-[16px] font-semibold top-[20px] left-[91px] absolute">Investor Profile</h2>
                        </div>

                        {/* BANNER SECTION */}
                        <div className="w-[95%] mx-auto min-h-[89rem] md:min-h-[55rem] bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-md">
                            <div className="max-[full] mx-auto m-5 pb-2 ">
                                <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-52 relative mb-16 sm:mb-20">
                                    <div style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} className="w-full bg-gray-100 border border-gray-200 rounded-t-2xl h-[228px] md:aspect-[3200/560] relative mb-16">
                                        {!bannerPreview && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700" onClick={triggerFileInput}>
                                                <p className="text-[14px] text-gray-800 font-semibold">Upload Banner Image</p>
                                                <p className="text-[14px] text-gray-600 mb-2">Optimal dimensions 3200 x 560px</p>
                                                <label className="px-4 py-2 text-[14px] bg-[#2357C6] text-white font-semibold rounded-md hover:bg-[#2357C6] cursor-pointer">
                                                    Upload Image
                                                </label>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleBannerImageChange}
                                            ref={fileInputRef}
                                        />
                                        {bannerPreview && (
                                            <div className="absolute bottom-4 left-4 rounded bg-white/90 px-3 py-2 text-[12px] font-semibold text-gray-700 shadow-sm">
                                                Optimal dimensions 3200 x 560px
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute right-4 top-4 flex gap-2">
                                        {bannerPreview && (
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="flex min-w-[132px] items-center justify-center gap-2 bg-white py-[7px] px-3 rounded text-blue-600 hover:text-blue-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                    <span className="text-[14px] font-semibold">Edit Banner</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="flex bg-white py-[7px] px-[10px] rounded text-blue-600 hover:text-blue-700"
                                        >
                                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M6.15833 11.2587L11.85 14.5753M11.8417 5.42533L6.15833 8.74199M16.5 4.16699C16.5 5.5477 15.3807 6.66699 14 6.66699C12.6193 6.66699 11.5 5.5477 11.5 4.16699C11.5 2.78628 12.6193 1.66699 14 1.66699C15.3807 1.66699 16.5 2.78628 16.5 4.16699ZM6.5 10.0003C6.5 11.381 5.38071 12.5003 4 12.5003C2.61929 12.5003 1.5 11.381 1.5 10.0003C1.5 8.61961 2.61929 7.50033 4 7.50033C5.38071 7.50033 6.5 8.61961 6.5 10.0003ZM16.5 15.8337C16.5 17.2144 15.3807 18.3337 14 18.3337C12.6193 18.3337 11.5 17.2144 11.5 15.8337C11.5 14.4529 12.6193 13.3337 14 13.3337C15.3807 13.3337 16.5 14.4529 16.5 15.8337Z"
                                                    stroke="#344054"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="ml-2 text-[16px] font-semibold">Share</span>
                                        </button>
                                    </div>

                                    {/* Always show BasicInformation */}
                                    <BasicInformation investorType={investorType} />
                                </div>
                            </div>
                        </div>
                        <AboutBusiness />
                        <ContactInformation />
                        <InvestmentThesisInput />
                        {investorType == 'firm' && <AssociatePeople />}
                        <InvestmentStatsSection />
                        <NotableInvestmentSection setDeleteNotableInvestmentIds={setDeleteNotableInvestmentIds} />

                        <div className="w-[95%] mx-auto mb-5 mt-5">
                            <div className='flex justify-between w-[92%] mx-auto'>
                                <button
                                    type='submit'
                                    onClick={() => setSubmitAction('publish')}
                                    disabled={!isValid}
                                    className={`px-4 py-2 rounded-md border border-[#D0D5DD] text-[#344054] bg-white font-semibold shadow-[14px] ${!isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 transition'}`}
                                >
                                    Publish Now
                                </button>
                                <div className='flex gap-2'>
                                    <button
                                        type='submit'
                                        onClick={() => setSubmitAction('continue')}
                                        className="px-4 py-2 rounded-md border border-[#D0D5DD] text-[#2D65DD] bg-[#EAF0FE] font-semibold shadow-[14px] hover:bg-gray-50 transition"
                                    >
                                        Save & continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            }
            {formSubmitted && (
                <TabSwitcher
                    currentUserData={currentUserData}
                    investorType={investorType}
                    onBack={() => setFormSubmitted(false)}
                />
            )}

        </>
    );
};

export default InvestorRegistrationForm;
