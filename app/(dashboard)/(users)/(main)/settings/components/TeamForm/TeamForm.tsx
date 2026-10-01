'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import BasicInformation from './Basic/Basic';
import About from './About/About';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ImageUploadSection, { generateUploadFileSasTokenData } from './Basic/ProfileImage';
import Loader from '@/components/ui/loader';
import { useParams, useRouter } from 'next/navigation';
import { settings } from '@/app/api/dashboard/settings';
import ProfileNFocus from './ProfileNFocus/ProfileNFocus';
import AddMemberModel from './AddMemberModel/AddMemberModel';
import { profile } from 'console';
import { favouriteService } from '@/app/api/dashboard/favourites';

const TeamProfileSchema = () => z.object({
    BannerPicture:
        z.string().url('Invalid banner image URL').or(z.literal('')).optional(),
    ProfileImage: z
        .string()
        .url('Invalid profile picture URL'),
    TeamName: z
        .string({ required_error: 'Team Name is required' })
        .min(2, 'Team Name should be at least 2 characters'),
    Website: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine((val) => {
            if (!val) return true;
            return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}.*$/.test(val);
        }, {
            message: 'Invalid Website URL',
        }),
    Tagline: z.string().min(1, 'Tagline is required'),
    Country: z.string().min(1, 'Country is required'),
    State: z.string().optional(),
    City: z.string().min(1, 'City is required'),
    About: z.string().min(1, 'About is required'),
    Mission: z.string().optional(),
    Vision: z.string().optional(),
    Languages: z.string().optional(),
    FocusArea: z.string().min(1, 'Focus Area is required'),
    ProfileType1: z.number().min(1, 'Select atleast 1 Profile type'),
    ProfileType2: z.number().nullable().optional(),
    ProfileType3: z.number().nullable().optional(),
});

type TeamProfileFormData = z.infer<
    ReturnType<typeof TeamProfileSchema>
>;;

const TeamForm = () => {
    const teamId = useParams();
    const router = useRouter();
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    // Available profile types from members
    const [availableProfileTypes, setAvailableProfileTypes] = useState<{ value: number, label: string }[]>([]);
    const [openAddMembersModel, setOpenAddMembersModel] = useState(false)

    // All possible profile type options
    const allProfileTypes = [
        { value: 1, label: 'Business Member' },
        { value: 2, label: 'Consultant' },
        { value: 3, label: 'Expert' },
        { value: 4, label: 'Advocate' },
        { value: 5, label: 'Professional' },
        { value: 6, label: 'Investor' },
        { value: 7, label: 'Mentor' }
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [currentTeam, setCurrentTeam] = useState<any>(null);
    const [favouriteTeam, setFavouriteTeam] = useState(false)

    async function GetFavoriteInformation() {
        try {
            const teamsList = await favouriteService.getTeamList({
                userId: currentUser?.Id,
                isTeam: false
            });
            const isFavourite = teamsList.Result.some(team => team.TeamId == currentTeam.TeamId);
            setFavouriteTeam(isFavourite);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    }

    const GetTeamProfile = async () => {
        try {
            const response = await settings.GetTeamProfile(teamId.teamId);
            if (response.status === 200) {
                const profiledata = response.data.Result;
                // Get unique profile types from team members
                const memberProfileTypes = profiledata.MemberDetails.map(member => member.ProfileType);
                const uniqueMemberProfileTypes = [...new Set(memberProfileTypes)];
                // Filter available profile types based on members
                const filteredProfileTypes = allProfileTypes.filter(type =>
                    uniqueMemberProfileTypes.includes(type.value)
                );
                setAvailableProfileTypes(filteredProfileTypes);
                setCurrentTeam(profiledata);
            }
        } catch (error) {
            console.error("Failed to fetch team profile", error);
        }
    };

    useEffect(() => {
        GetTeamProfile();
    }, []);


    useEffect(() => {
        if (currentTeam) {
            GetFavoriteInformation()
            reset({
                BannerPicture: currentTeam.BannerImage || "",
                ProfileImage: currentTeam.ProfileImage || "",
                TeamName: currentTeam.TeamName || "",
                Website: currentTeam.Website ? currentTeam.Website.replace(/^https?:\/\//, '') : '',
                Tagline: currentTeam.Slogan || "",
                Country: currentTeam.Country || "",
                State: currentTeam.State || "",
                City: currentTeam.City || "",
                About: currentTeam.About || "",
                Mission: currentTeam.Mission || "",
                Vision: currentTeam.Vision || "",
                Languages: currentTeam.Languages || "",
                FocusArea: currentTeam.FocusArea || "",
                ProfileType1: currentTeam.ProfileType1 || null,
                ProfileType2: currentTeam.ProfileType2 || null,
                ProfileType3: currentTeam.ProfileType3 || null,
            });
            setBannerPreview(currentTeam.BannerImage)
        }
    }, [currentTeam]);


    const methods = useForm<TeamProfileFormData>({
        resolver: zodResolver(TeamProfileSchema()),
        defaultValues: {
            BannerPicture: "",
            ProfileImage: "",
            TeamName: "",
            Website: '',
            Tagline: "",
            Country: "",
            State: "",
            City: "",
            About: "",
            Mission: "",
            Vision: "",
            Languages: "",
            FocusArea: "",
        }
    });

    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger
    } = methods;

    const onSubmit = async (data: TeamProfileFormData) => {
        setIsLoading(true)
        const teamData = {
            TeamId: teamId.teamId,
            BannerImage: data.BannerPicture,
            ProfileImage: data.ProfileImage,
            TeamName: data.TeamName,
            Website: data.Website,
            Slogan: data.Tagline || null,
            Country: data.Country,
            State: data.State,
            City: data.City,
            About: data.About || null,
            Mission: data.Mission || null,
            Vision: data.Vision || null,
            Languages: data.Languages || '',
            FocusArea: data.FocusArea || '',
            ProfileType1: data.ProfileType1,
            ProfileType2: data.ProfileType2 || null,
            ProfileType3: data.ProfileType3 || null,
        }
        try {
            const response = await settings.CreateEditTeamProfile(teamData);
            if (response.status === 200) {
                toast.success('Team Profile Published Successfully!')
                router.push('/settings');
            }
            else {
                toast.error('Failed to Publish Team Profile!')
                setIsLoading(false)
            }
        } catch {
            toast.error('Failed to Publish Team Profile!')
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

    const handleFavorite = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Favourite/SetRemoveFavoriteTeam?userId=${currentUser.Id}&teamId=${currentTeam.TeamId}`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'XApiKey': process.env.NEXT_PUBLIC_API_KEY
                    }
                }
            );
            if (response.data.StatusCode == 200) {
                if (favouriteTeam) {
                    setFavouriteTeam(false)
                    toast.success('Team removed from favorites')
                }
                else {
                    setFavouriteTeam(true)
                    toast.success('Team added to favorites')
                }
            } else {
                throw new Error(response.data?.Message || 'Failed to update favorite status');
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            toast.error(error.message);
        }
    };

    return (
        <>
            {
                openAddMembersModel && currentTeam != null && (
                    <AddMemberModel parentTeamId={currentTeam.TeamId} setOpenAddMembersModel={setOpenAddMembersModel} />
                )
            }
            {isLoading && (
                <Loader />
            )}
            {!isLoading &&
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* HEADER */}
                        <div className="w-full h-[64px] border-b-2">
                            <h2 className="text-[16px] font-semibold top-[20px] left-[91px] absolute">Team</h2>
                        </div>

                        {/* BANNER SECTION */}
                        <div className="w-[95%] mx-auto min-h-[89rem] md:min-h-[55rem] bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-md">
                            <div className="max-[full] mx-auto m-5 pb-2 ">
                                <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-52 relative">
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
                                    </div>

                                    <div className="absolute right-4 top-4 flex gap-2">
                                        {bannerPreview && (
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="flex bg-white py-[7px] px-[10px] rounded text-blue-600 hover:text-blue-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
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
                                {/* Profile Image */}
                                <div className="w-[95%] mx-auto flex justify-start  relative">
                                    <ImageUploadSection onImageSelect={(file) => { }} VerifiedStatus={currentTeam?.IsVerified} />
                                </div>

                                {/* Always show BasicInformation */}
                                <div className='block md:flex mt-6 mb-2'>
                                    <div className='w-full md:w-[80%]'>
                                        <BasicInformation />
                                    </div>
                                    <div className='hidden md:flex font-semibold text-[#667085] items-center h-10 justify-center gap-2 cursor-pointer mx-auto' onClick={() => { handleFavorite() }}>
                                        {favouriteTeam ? (<>
                                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.425 12.5833L3.52667 15.575L4.85833 9.99167L0.5 6.25833L6.22083 5.8L8.425 0.5L10.6292 5.8L16.3508 6.25833L11.9917 9.99167L13.3233 15.575L8.425 12.5833Z" fill="#667085" />
                                            </svg>

                                            <p>Remove from Favourite</p>
                                        </>) : (<>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.99922 12.1693L3.10089 15.1609L4.43255 9.5776L0.0742188 5.84427L5.79505 5.38594L7.99922 0.0859375L10.2034 5.38594L15.9251 5.84427L11.5659 9.5776L12.8976 15.1609L7.99922 12.1693ZM7.99922 10.2159L10.3467 11.6493L9.70839 8.97427L11.7976 7.1851L9.05589 6.9651L7.99922 4.42594L6.94255 6.9651L4.20088 7.1851L6.29005 8.97427L5.65172 11.6493L7.99922 10.2168V10.2159Z" fill="#667085" />
                                            </svg>
                                            <p>Add to Favourite</p>
                                        </>)}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <About />
                        <ProfileNFocus availableProfileTypes={availableProfileTypes} />

                        {/*  */}
                        <div className='w-[95%] mx-auto min-h-[24rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
                            <div className="max-w-full mx-auto">
                                <div className="w-[95%] mx-auto bg-white rounded-t-2xl h-auto relative mb-16 sm:mb-20 py-4">
                                    <div className='pb-5'>
                                        <h2 className='text-[16px] font-semibold'>Team Members</h2>
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
                                            Add team members who makes this team
                                        </p>
                                        <button type='button' onClick={() => { setOpenAddMembersModel(true) }} className="px-6 py-2 rounded-md bg-[#2357C6] text-white text-[16px] font-semibold hover:bg-blue-200 transition">
                                            Add People
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        <div className="w-[95%] mx-auto mb-5 mt-5">
                            <div className='flex justify-end w-[92%] mx-auto'>
                                <div className=''>
                                    <button type='submit' className="px-4 py-2 rounded-md border border-[#D0D5DD] text-white bg-[#2357C6] font-semibold shadow-[14px] hover:bg-gray-50 transition">
                                        Publish Team
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            }
        </>
    );
};

export default TeamForm;