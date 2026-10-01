'use client'
import MessageIcon from '@/icons/message-icon';
import StyledTick from '@/icons/verification/styled-tick';
import React from 'react';
import { ChevronRight, Eye, Feather, Globe } from 'react-feather';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';
import Add from '@/icons/add';
import Users from '@/icons/users';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import TeamProfile from '../../settings/components/TeamProfileImage';
import { useRouter } from 'next/navigation';
// import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import Member from '../../transactions-and-escrow/contract/new-contract/_sections/member';
import Favourite from '@/icons/favourite';
const TeamCard = ({ team, fetchTeamList }) => {
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));

    const teamData = JSON.parse(localStorage.getItem('teamData'));

    // const stripePromise = loadStripe(
    //     (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
    // );
    const handleTeamChat = async () => {
        try {
            const groupName = `${team.TeamName} - ${currentUser?.UserName}`;
            const userIds = team.MemberDetails.map(member => member.UserId);
            const currentUserId = currentUser.Id;

            if (!userIds.includes(currentUserId)) {
                userIds.unshift(currentUserId);
            }

            const requestData = {
                Name: groupName,
                CreatedBy: currentUserId,
                UserIds: userIds
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/CreateGroupChat`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'XApiKey': process.env.NEXT_PUBLIC_API_KEY
                    }
                }
            );

            const result = response?.data?.Result;

            if (!result || !result.Id) {
                throw new Error('Invalid group data');
            }

            localStorage.setItem('chatDetails', JSON.stringify({
                GroupName: result.GroupName,
                GroupImage: result.GroupImage || team.TeamImage || null,
                Id: result.Id,
                GroupMember: result.GroupMember,
                IsGroup: true
            }));

            toast.success(`Redirecting to "${result.GroupName}" chat...`);
            router.push('/chats');
        } catch (error) {
            console.error(error);
        }
    };

    const router = useRouter()
    const renderProfileTypeIcon = (userProfileType) => {
        switch (userProfileType) {
            case 1:
                return (
                    <p className="flex items-center gap-1">
                        <BlackOwnedBusinessIcon className="fill-[#2357C6] text-[#2357C6] w-4" />
                        Business Member
                    </p>

                );
            case 2:
                return (
                    <p className="flex items-center gap-1">
                        <ConsultantIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Consultant
                    </p>
                );
            case 3:
                return (
                    <p className="flex items-center gap-1">
                        <ExpertsIcon className="fill-[#2357C6] text-[#2357C6] w-4" /> Expert
                    </p>
                );
            case 4:
                return (
                    <p className="flex items-center gap-1">
                        <AdvocatesIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Advocate
                    </p>
                );
            case 6:
                return (
                    <p className="flex items-center gap-1">
                        <ProfessionalsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Professional
                    </p>
                );
            case 7:
                return (
                    <p className="flex items-center gap-1">
                        <InvestorsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Investor
                    </p>
                );
            case 8:
                return (
                    <p className="flex items-center gap-1">
                        <MentorsIcon className="fill-[#2357C6] text-[#2357C6] w-4" /> Mentor
                    </p>
                );
            default:
                return (
                    <p className="flex items-center gap-1">
                        <ProfessionalsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Professional{' '}
                    </p>
                );
        }
    };
    const setReviewTab = () => {
        localStorage.setItem('review', 'review');
    }


    const handleFavorite = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Favourite/SetRemoveFavoriteTeam?userId=${(teamData && teamData?.isActive ? teamData.teamId : currentUser.Id)}&teamId=${team.TeamId}`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'XApiKey': process.env.NEXT_PUBLIC_API_KEY
                    }
                }
            );
            if (response.data.StatusCode == 200) {
                fetchTeamList();
                toast.success(!team.IsFavourite ? 'Added to favorites' : 'Removed from favorites');
            } else {
                throw new Error(response.data?.Message || 'Failed to update favorite status');
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            toast.error(error.message);
        }
    };
    
 
    return (
        <div className="p-4 shadow-filter-primary mb-4">
            <div className="space-y-4">
                <div className="w-full flex items-start md:items-center justify-between gap-4">
                    <div className="w-full flex items-start flex-1 gap-3">
                        <div className=" p-0.5 w-10 h-10 md:w-[5rem] md:h-16 rounded-full flex items-center justify-center relative">
                            <TeamProfile members={team.MemberDetails} count={team.MemberDetails.length} />
                        </div>
                        <div className="space-y-2">
                            <p
                                className="text-h8 md:text-[1.2rem] font-bold text-black-500 text-wrap cursor-pointer"
                                onClick={() => router.push(`/settings/teamprofile/${team.TeamId}`)}
                            >
                                {team.TeamName}
                            </p>
                            <div className="flex items-center gap-2">
                                {team.Slogan && (
                                    <p className="text-h7 md:text-[.9rem] font-medium text-blue-300">
                                        {team.Slogan}
                                    </p>
                                )}
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <div className="text-omblue-500 flex items-center gap-2">
                                    {team.AverageRatings}
                                    {/* Star ratings would go here */}
                                    <div className="hidden md:flex items-center gap-4">
                                        <div className="text-omblue-500 flex items-center gap-2">
                                            <div className="flex items-center flex-row">
                                                <StarRatings
                                                    starDimension="25px"
                                                    rating={team.AverageRatings}
                                                    starRatedColor="rgba(35, 87, 198, 1)"
                                                    numberOfStars={5}
                                                    name="rating"
                                                    starSpacing="0px"
                                                    starHoverColor="#01AFD7"
                                                    svgIconViewBox="0 0 25 25"
                                                    svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
                                                    style={{ margin: 'auto' }}
                                                />
                                            </div>
                                            <button onClick={() => {
                                                // Your extra method call
                                                setReviewTab();

                                                // Then navigate
                                                router.push(`/settings/teamprofile/${team.TeamId}`);
                                            }}>
                                                <div className="text-omblue-900 flex items-center">
                                                    <p className="text-h9 2xl:text-scaled-h9">
                                                        {team.TotalRatings} Reviews
                                                    </p>
                                                    <ChevronRight />
                                                </div></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div
                            className="p-2 w-8 h-8 border border-[#2357C6] flex items-center justify-center rounded-full cursor-pointer"
                            onClick={handleFavorite}
                        >
                            <Favourite
                                className="w-5 h-5 text-green-400"
                                fill={team?.IsFavourite ? 'omblue-400' : 'white'}
                            />
                        </div>
                        <button
                            className="hidden flex-1 px-5 py-3.5 md:flex items-center gap-2 text-white bg-omblue-500 rounded-md"
                            onClick={() => { router.push(`/settings/teamprofile/${team.TeamId}`); }}
                        >
                            <Eye className="w-4 h-4" />
                            <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                                View Profile
                            </p>
                        </button>
                    </div>
                </div>

                <hr className="border-b border-[#D2D4DA]" />
                <div className="grid grid-cols-12 gap-4">
                    <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-1">
                        <div className="grid grid-cols-2 md:grid-cols-1">
                            {team.IsVerified ? (
                                <div className="text-[#1A9E78] flex items-center gap-2 py-1">
                                    <StyledTick className="w-6 h-6" />
                                    <p className="text-h9 2xl:text-scaled-h9 font-medium">
                                        Verified
                                    </p>
                                </div>
                            ) : ((
                                <div className="text-[#E88206] flex items-center gap-2 py-1">
                                    <div className="p-0.5 flex items-center justify-center rounded-full bg-[#E88206] text-white">
                                        <Add className="rotate-45 w-4 h-4" />
                                    </div>
                                    <p className="text-h9 2xl:text-scaled-h9 font-medium">
                                        Not Verified
                                    </p>
                                </div>
                            ))}
                            <div className="text-omblue-500 flex items-center gap-2 py-2">
                                <p className=" text-h9 2xl:text-scaled-h9 font-medium flex gap-2 items-center">
                                    <Users className="w-6 h-6" />
                                    {team.MemberDetails?.length || 0}
                                    {team.MemberDetails?.length === 1 ? ' person' : ' members'}

                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-3">
                        <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold">
                            Team members
                        </p>
                        <div className="flex flex-col gap-3">
                            {team.MemberDetails?.map((member) => (
                                <div
                                    key={member.UserId}
                                    className="flex items-center gap-4 cursor-pointer"

                                >
                                    <div className="relative w-10 h-10">
                                        <Image
                                            src={member.ProfilePicture || '/default-profile.png'}
                                            alt={member.Name}
                                            width={38}
                                            height={38}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">{member.Name}</p>
                                </div>
                            ))}
                        </div>
                    </div> */}
                    <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-3">
                        <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold">
                            Team Type
                        </p>

                        {team.ProfileType1 && renderProfileTypeIcon(team.ProfileType1)}
                        {team.ProfileType2 && renderProfileTypeIcon(team.ProfileType2)}
                        {team.ProfileType3 && renderProfileTypeIcon(team.ProfileType3)}
                    </div>

                    <div className="col-span-12 md:col-span-3 space-y-2">

                    </div>

                    <div className="col-span-12 md:col-span-3">
                        <div className="flex flex-row md:flex-col gap-2 text-omblue-600">
                            {/* {team.YoutubeLink && (
                                <a
                                    className="flex items-center justify-center w-full ipad:w-auto sm:flex-1 border border-omblue-100 rounded-md gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9"
                                    href={team.YoutubeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Globe className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4" />
                                    <p className="hidden sm:flex">View Website</p>
                                </a>
                            )} */}
                            {
                                !team.MemberDetails.some(member => member.UserId == currentUser.Id) && <button
                                    className="flex items-center justify-center w-full ipad:w-auto sm:flex-1 border border-omblue-100 rounded-md gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9"
                                    onClick={handleTeamChat}
                                >
                                    <MessageIcon className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4" />
                                    <p className="hidden sm:flex">Chat</p>
                                </button>
                            }
                            <button
                                className="flex flex-1 px-5 py-3.5 md:hidden items-center justify-center gap-2 text-white bg-omblue-500 rounded-md"
                                onClick={() => router.push(`/team/${team.TeamId}`)}
                            >
                                <Eye className="w-4 h-4" />
                                <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                                    View Team
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;
