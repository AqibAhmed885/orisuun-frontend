'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import BasicInformation from './components/business/BasicInformation/BasicInformation';
import ContactInformation from './components/business/ContactInformation/ContactInfo';
import BusinessDetailsInfo from './components/business/BusinessDetails/BusinessDetailsInfo';
import AboutBusiness from './components/business/AboutBusiness/AboutBusiness';
import AssociatePeople from './components/business/AssociatePeople/AssociatePeople';
import PitchBook from './components/business/Pitchbook/PitchBook';
import TabSwitcher from './components/business/GalleryAndSnapshot/TabSwicthGallery&Snap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { generateUploadFileSasTokenData } from './components/business/BasicInformation/ProfileImage';
import { apiEndpoint } from '@/utils/utils';
import { useDispatch } from 'react-redux';
import { updateCurrentUser, addProfileData } from '@/data/slices/user-slice';
import Loader from '@/components/ui/loader';
import { useRouter } from 'next/navigation';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { updateStoredUserData } from '@/utils/user-storage';

const businessRegistrationSchema = z.object({
    BannerImage: z.string().optional(),
    BusinessImage: z.string().min(1, 'Profile Image is required'),
    BusinessName: z
        .string({ required_error: 'Company Name is required' })
        .min(2, 'Company Name should be at least 2 characters')
        .max(30, 'Company Name should not exceed 30 characters'), 
    Website: z
        .string()
        .regex(/\./, 'Invalid Website URL')
        .optional()
        .or(z.literal('')),
    CompanyTagline: z
        .string({ required_error: 'Company Tagline is required' })
        .trim()
        .min(1, 'Company Tagline is required'),
    StreetAddress: z.string().min(1, 'Street Address is required'),
    State: z.string().optional(),
    City: z
        .string({ required_error: 'City is required' })
        .min(1, 'City is required'),
    Country: z.string().min(1, 'Country is required').min(1),
    BusinessType: z.string().min(1, 'Business type is required'),
    BlackOwnershipPercentage: z
        .string({ required_error: 'This field is required' })
        .min(1, 'This field is required'),
    EthnicityOfBlackOwnership: z.string().optional(),
    CustomURL: z
        .string()
        .min(1, 'Custom URL must have at least one character after orisuun.com/')
        .refine(
            (value) => {
                // Ensure the value starts with the prefix and has at least one character after the prefix
                return value.trim().length > 0;
            },
            {
                message:
                    'Custom URL must start with "orisuun.com/" and have at least one character after it',
            }
        )
        .refine(
            (value) => {
                return /^[a-zA-Z0-9-]+$/.test(value); // Allow alphanumeric characters and hyphens
            },
            {
                message: 'Custom URL can only contain letters, numbers, and hyphens',
            }
        )
        .refine((value) => value.trim().length > 0, {
            message: 'Custom URL cannot be empty after orisuun.com/',
        }),
    BusinessMail: z
        .string({ required_error: 'This field is required' })
        .email()
        .min(1, 'This field is required'),
    PhoneNumber: z.string().optional(),
    SearchTags: z.array(z.string()).max(5, 'Enter up to 5 tags').optional(),
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
    Stage: z.string().min(1, 'Stage is required'),
    AnnualRevenueRange: z.string().min(1, 'Annual Revenue is required'),
    Employees: z
        .string({ required_error: 'No of employees is required' })
        .min(1, 'No of employees is required'),
    Founded: z.string().min(1, 'This field is required'),
    FundingStage: z.string().min(1, 'Funding stage is required'),
    OpenToInvestment: z
        .string()
        .refine((val) => {
            const parts = val.trim().split(' ').filter(Boolean);
            if (parts.length === 0) return false;
            if (parts.includes('No') && (parts.includes('Debt') || parts.includes('Equity'))) return false;
            return parts.every((v) => ['Debt', 'Equity', 'No'].includes(v));
        }, {
            message: 'Invalid investment selection. Cannot select "No" with "Debt" or "Equity"',
        }),
    OpenToMentorship: z.string().min(1, 'Mentorship preference is required'),
    OpenToProfessionalServices: z.boolean({
        required_error: 'Professional services preference is required',
    }),
    OpenToStrategyAdvisors: z.boolean({
        required_error: 'Strategy advisors preference is required',
    }),
    Industries: z.array(z.number()).min(1, 'At least one industry is required'),
    RevenueVisibility: z.string().optional(),
    IsRevenueVisible: z.boolean().optional(),
    About: z.string().min(1, 'About is required'),
    Mission: z.string().optional(),
    Vision: z.string().optional(),
    Languages: z.string().optional(),
    BusinessHours: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
    }),
    TeamMembers: z.array(z.object({
        Name: z.string().min(1),
        ProfilePicture: z.string().url().min(1),
        Position: z.string().min(1),
        About: z.string().min(1),
        Email: z.string().email(),
        Username: z.string().min(4),
        Password: z.string().optional(),
    })).optional(),
    PitchBook: z.any().optional()
})
    .refine(
        (data) =>
            parseInt(data.BlackOwnershipPercentage) === 0 ||
            (parseInt(data.BlackOwnershipPercentage) > 0 &&
                data.EthnicityOfBlackOwnership),
        {
            message: 'Ethnicity Black Ownership is required',
            path: ['EthnicityOfBlackOwnership'],
        }
    );

export type BusinessRegistrationFormData = z.infer<typeof businessRegistrationSchema>;

const BusinessRegistrationForm = () => {
    const currentUser = typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [currentUserData, setCurrentUserData] = useState<any>(null);
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    const fetchProfileData = useCallback(async () => {
        setIsLoading(true)
        try {
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
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setIsLoading(false)
        }
    }, [dispatch, currentUser.Id, currentUser.UserProfileDetailsId, currentUser.UserName]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const getSocialUrl = (type: string, data: any) => {
        return (
            data?.SocialMediaUrls?.find((item: any) => item.LinkType === type)
                ?.SocialMediaUrl || ""
        );
    };

    const methods = useForm<BusinessRegistrationFormData>({
        resolver: zodResolver(businessRegistrationSchema),
        mode: 'onChange',
        defaultValues: {
            SearchTags: [],
            TeamMembers: [],
            Industries: [],
            Languages: '',
            RevenueVisibility: '[]',
            OpenToInvestment: '',
            OpenToMentorship: '',
            OpenToProfessionalServices: undefined,
            OpenToStrategyAdvisors: undefined,
            State: ''
        }
    });

    const { reset } = methods;

    // 
    useEffect(() => {
        if (currentUserData) {
            reset({
                BannerImage: currentUserData.BannerPicture || "",
                BusinessImage: currentUserData.ProfilePicture || "",
                BusinessName: currentUserData.CompanyName || "",
                Website: currentUserData.WebsiteUrl ? currentUserData.WebsiteUrl.replace(/^https?:\/\//, '') : '',
                CompanyTagline: currentUserData.Tagline || "",
                StreetAddress: currentUserData.AddressLine1 || "",
                State: currentUserData.State || "",
                City: currentUserData.City || "",
                Country: currentUserData.Country || "",
                BusinessType: currentUserData.BussinessType || "",
                BlackOwnershipPercentage: currentUserData.BlackOwnershipPercentage || "",
                EthnicityOfBlackOwnership: currentUserData.EthinicityBlackOwnership || "",
                CustomURL: currentUserData.ProfileUrl || "",
                BusinessMail: currentUserData.EmailIdForBusinessDevelopment || "",
                PhoneNumber: currentUserData.PhoneNumber || "",
                SearchTags: currentUserData.Tags || [],
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
                Stage: currentUserData.Stage || "",
                AnnualRevenueRange: currentUserData.AnnualRevenue || "",
                Employees: currentUserData.NumberOfEmployess || "",
                Founded: currentUserData.BusinessSince || "",
                FundingStage: currentUserData.FundraisingStage || "",
                OpenToInvestment: currentUserData.OpenToInvestment || "",
                OpenToMentorship: currentUserData.OpenToMentorship || "",
                OpenToProfessionalServices:
                    currentUserData.OpenToProfessionalServices === true ||
                        currentUserData.OpenToProfessionalServices === 'Yes'
                        ? true
                        : currentUserData.OpenToProfessionalServices === false ||
                            currentUserData.OpenToProfessionalServices === 'No'
                            ? false
                            : undefined,
                OpenToStrategyAdvisors:
                    currentUserData.OpenToStrategyAdvisors === true ||
                        currentUserData.OpenToStrategyAdvisors === 'Yes'
                        ? true
                        : currentUserData.OpenToStrategyAdvisors === false ||
                            currentUserData.OpenToStrategyAdvisors === 'No'
                            ? false
                            : undefined,
                Industries: (currentUserData.UserProfileIndustrySelectionInformation || []).map((i: any) => i.IndustryId),
                RevenueVisibility: currentUserData.AnnualRevenueVisibility || '[]',
                IsRevenueVisible: !!currentUserData.AnnualRevenueVisibility,
                About: currentUserData.AboutCompany || "",
                Mission: currentUserData.Mission || "",
                Vision: currentUserData.Vision || "",
                Languages: (currentUserData.Languages || []).join(', '),
                BusinessHours: {
                    from: currentUserData.Hours?.split('-')[0] || "",
                    to: currentUserData.Hours?.split('-')[1] || ""
                },
                PitchBook: currentUserData.Pitchbook || ""
            });
        }
    }, [currentUserData, reset]);

    const {
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        trigger
    } = methods;

    const onSubmit = async (data: BusinessRegistrationFormData, publishNow: boolean = false) => {
        var profileId = 0;
        const formData = new FormData();
        setIsLoading(true)
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'PitchBook' && value instanceof File) {
                formData.append(key, value);
            } else if (key === 'BusinessHours') {
                if (value?.from && value?.to) {
                    const formatted = `${value.from}-${value.to}`;
                    formData.append('BusinessHours', formatted);
                } else {
                    formData.append('BusinessHours', '');
                }
            } else if (Array.isArray(value)) {
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
            CompanyName: data.BusinessName,
            ProfilePicture: data.BusinessImage,
            Tagline: data.CompanyTagline,
            CountryOfOrigin: data.Country,
            City: data.City,
            ProfileUrl: data.CustomURL,
            AboutCompany: data.About,
            SocialMedias: data.SocialLinks,
            Tags: data.SearchTags,
            CompanyDetails: [],
            BannerImage: data.BannerImage
        };

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
                    AddressLine1: data.StreetAddress,
                    AddressLine2: '',
                    Country: data.Country,
                    State: data.State,
                    City: data.City,
                    Code: '',
                    CompanyWebsite: data.Website,
                    NumberofEmployees: data.Employees,
                    EmailIdForQueries: '',
                    EmailIdForBusinessDevelopment: data.BusinessMail,
                    BlackOwnershipPercentage: data.BlackOwnershipPercentage,
                    EthinicityBlackOwnership: data.EthnicityOfBlackOwnership,
                    Language: data.Languages,
                    PhoneNumber: data.PhoneNumber,
                    Hours: data.BusinessHours?.from && data.BusinessHours?.to
                        ? `${data.BusinessHours.from}-${data.BusinessHours.to}`
                        : '',
                    BusinessType: data.BusinessType,
                    BusinessSince: data.Founded,
                    PublicCompany: '',
                    UserProfileId: profileId,
                    ProfilePictureList: [],
                    videoList: []
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
                        const selectedIndustryData = {
                            UserId: currentUser.Id,
                            UserProfileTypeId: currentUser.UserProfileTypeId,
                            UserProfileDetailId: profileId,
                            IndustryList: data.Industries,
                        };
                        try {
                            const finalResult = await axios.post(
                                `${apiEndpoint}/Profile/SaveUserSelectionInformation`,
                                selectedIndustryData,
                                {
                                    headers: {
                                        XApiKey:
                                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                                    },
                                }
                            );
                            if (finalResult.status === 200) {
                                const extraDetailsData = {
                                    UserId: currentUser.Id,
                                    UserProfileDetailId: profileId,
                                    Stage: data.Stage,
                                    FundraisingStage: data.FundingStage,
                                    AnnualRevenueVisibility: data.RevenueVisibility.toString(),
                                    AnnualRevenue: data.AnnualRevenueRange,
                                    OpenToMentorship: data.OpenToMentorship,
                                    OpenToProfessionalServices: data.OpenToProfessionalServices,
                                    OpenToStrategyAdvisors: data.OpenToStrategyAdvisors,
                                    OpenToInvestment: data.OpenToInvestment,
                                    Mission: data.Mission,
                                    Vision: data.Vision,
                                    Pitchbook: data.PitchBook,
                                    AssociatePeoples: data.TeamMembers
                                }
                                try {
                                    const extraDetails = await axios.post(
                                        `${apiEndpoint}/Profile/SaveBobExtraDetails`,
                                        extraDetailsData,
                                        {
                                            headers: {
                                                XApiKey:
                                                    'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                                            },
                                        }
                                    );
                                    if (extraDetails.status === 200) {
                                        fetchProfileData();
                                        updateStoredUserData({
                                            isBasicProfileDetailExist: true,
                                            isProfileComplete: true,
                                            ProfilePicture: data.BusinessImage,
                                        }, currentUser.Id);
                                        toast.success('You have successfully completed your profile!');
                                        if (publishNow) {
                                        // Redirect to dashboard when published
                                            router.push(`/profile/${add2040ToProfileDetailsId(profileId)}`);
                                        } else {
                                            // Show form tabs for Save & continue
                                            setFormSubmitted(true);
                                        }
                                    }
                                }
                                catch { }
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
            setValue('BannerImage', uploadedUrl); // store in form as string
            await trigger('BannerImage'); // trigger validation if needed
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
            {!formSubmitted &&
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((data) => onSubmit(data, false))} >
                        {/* HEADER */}
                        {/* <div className="w-full h-[64px] border-b-2">
                            <h2 className="text-[16px] font-semibold top-[20px] left-[91px] absolute">Business Profile</h2>
                        </div> */}

                        {/* BANNER SECTION */}
                        <div className="md:w-[95%] mx-auto md:bg-white border border-gray-300 p-2 rounded-2xl pb-2 mt-3 md:shadow-[#1018280F] md:shadow-md">
                            <div className="max-[full] mx-auto  ">
                                <div className="w-full border-2 border-[#F9FAFB] md:rounded-t-2xl relative">
                                    <div style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} className="w-full bg-gray-100 border border-gray-200 md:rounded-t-2xl  aspect-[3200/560] relative">
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
                                </div>
                                <BasicInformation isverified={currentUserData?.ProfileVerified} />
                            </div>
                        </div>

                        <ContactInformation />
                        <BusinessDetailsInfo />
                        <AboutBusiness />
                        <AssociatePeople />
                        <PitchBook />

                        <div className="w-[95%] mx-auto mb-5 mt-5 text-sm">
                            <div className='flex justify-between w-[92%] mx-auto'>
                                <button
                                    type='button'
                                    disabled={!isValid}
                                    onClick={() => {
                                        // Directly submit with publishNow flag to avoid async state race
                                        handleSubmit((data) => onSubmit(data, true))();
                                    }}
                                    className={`px-4 py-2 rounded-md border border-[#D0D5DD] text-[#344054] bg-white font-semibold shadow-[14px] ${!isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 transition'}`}
                                >
                                    Publish Now
                                </button>
                                <div className='flex gap-2'>
                                    <button type='submit' className="px-4 py-2 rounded-md border border-[#D0D5DD] text-[#2D65DD] bg-[#EAF0FE] font-semibold shadow-[14px] hover:bg-gray-50 transition">
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
                    onBack={() => setFormSubmitted(false)}
                />
            )}
        </>
    );
};

export default BusinessRegistrationForm;
