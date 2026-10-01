import UserSearch from '@/components/tabs-section/icons/user-search';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Add from '@/icons/add';
import ChevronRight from '@/icons/chevron-right';
import Eye from '@/icons/eye';
import Favourite from '@/icons/favourite';
import Feather from '@/icons/feather';
import Globe from '@/icons/globe';
import LocationPin from '@/icons/location-pin';
import MessageIcon from '@/icons/message-icon';
import Star from '@/icons/star';
import Users from '@/icons/users';
import StyledTick from '@/icons/verification/styled-tick';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import StarRatings from 'react-star-ratings';
import { toast } from 'react-toastify';

const SearchResultCard = ({
    index,
    data,
    setResults,
    results,
    isPostProfile,
}: {
    index: number;
    data: any;
    setResults?: any;
    results?: any;
    isPostProfile?: boolean;
}) => {
    const router = useRouter();
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));

    const teamData = JSON.parse(localStorage.getItem('teamData'));

    const isMobile = useMobileMediaQuery();
    const setFavourite = async (profile, isFavourite) => {
        const payloadProfile = {
            [!isFavourite ? 'UserProfileDetailId' : 'Id']: isFavourite
                ? profile?.FavouriteProfilePostId
                : profile.ProfileDetailId,
            UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
        };
        const payloadPost = {
            BDOpportunityId: isFavourite
                ? profile?.FavouriteProfilePostId
                : profile.BDOpportunityId,
            UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
        };

        try {
            const response = await axios.post(
                !isFavourite
                    ? `${apiEndpoint}/Profile/${isPostProfile ? 'SetFavouritePost' : 'SetFavouriteProfile'
                    }`
                    : isPostProfile
                        ? `${apiEndpoint}/Profile/UnFavouritePost`
                        : `${apiEndpoint}/Favourite/UnFavouriteProfile`,
                isPostProfile ? { ...payloadPost } : { ...payloadProfile },
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                const filterData = results.map((detail) =>
                    detail.BDOpportunityId === profile.BDOpportunityId
                        ? {
                            ...detail,
                            IsFavouriteProfile: !detail.IsFavouriteProfile,
                            FavouriteProfilePostId: response.data.Result,
                        }
                        : detail
                );
                setResults(filterData);
            }
        } catch (error) {
            console.error('Error updating favourite status:', error);
        }
    };
    const [isExpanded, setIsExpanded] = useState(false);

    const handleTeamChat = async (team) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('userData'));
            const groupName = `${team.TeamDetails.TeamName} - ${currentUser?.UserName}`;
            const userIds = team.TeamDetails.TeamMembers.map(member => member.UserId);
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
                GroupImage: result.GroupImage || team.ProfilePicture || null,
                Id: result.Id,
                GroupMember: result.GroupMember,
                IsGroup: true
            }));

            toast.success(`Redirecting to "${result.GroupName}" chat...`);
            router.push('/chats');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create group chat');
        }
    };
    return (
        <div className="p-4  md:border border-grey-600 rounded-md shadow-md bg-white">
            <div className="space-y-4">
                <div className="w-full flex items-start md:items-center justify-between gap-4">
                    <div className="w-full flex items-start flex-1 gap-3">
                        {/* <div className="bg-profile-frame p-0.5 w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center relative">
              <Image
                src={
                  data?.ProfilePicture
                    ? data?.ProfilePicture
                    : BASE_URL
                }
                alt="techwave"
                width={isMobile ? 40 : 64}
                height={isMobile ? 40 : 64}
                className="w-full h-full rounded-full"
              />
            </div> */}
                        <div className="space-y-2">
                            {data.MatchType == 1 && (
                                <p
                                    className="text-h8 md:text-h8 2xl:text-scaled-h8 font-bold text-black-500 text-wrap cursor-pointer"
                                    onClick={() => router.push(`/business-development/${add2040ToProfileDetailsId(data?.ProfileDetailId)}`)}
                                >
                                    {data.Title || 'N/A'}
                                </p>
                            )}
                            {data.MatchType != 1 && data.MatchType != 2 && (
                                <p
                                    className="text-h8 md:text-h8 2xl:text-scaled-h8 font-bold text-black-500 text-wrap cursor-pointer"
                                    onClick={() => router.push(`/cofounder-and-board-matcher/${add2040ToProfileDetailsId(data?.ProfileDetailId)}`)}
                                >
                                    {data.Title || 'N/A'}
                                </p>
                            )}
                            {
                                data.MatchType == 2 && (
                                    <p
                                        className="text-h8 md:text-h8 2xl:text-scaled-h8 font-bold text-black-500 text-wrap cursor-pointer"
                                        onClick={() => router.push(`/cofounder-and-board-matcher/${add2040ToProfileDetailsId(data?.ProfileDetailId)}`)}
                                    >
                                        {data.RoleSought || data.Title}
                                    </p>
                                )
                            }

                            {data.tagline && (
                                <div className="flex items-center gap-2">
                                    <Users className="text-omblue-500 w-4 h-4 2xl:w-scaled-4 2xl:h-scaled-4" />
                                    <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-500">
                                        {data.tagline}
                                    </p>
                                </div>
                            )}
                            <div className="hidden md:flex items-center gap-4">
                                <div className="text-omblue-500 flex items-center gap-2">
                                    <div className="text-omblue-900 flex items-center">
                                        <p className="text-h9 2xl:text-scaled-h9">
                                            {data.Description || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {data.MatchType == 1 && (
                            <button
                                className="hidden lg:flex text-white items-center justify-center w-full ipad:w-auto sm:flex-1 border border-[#BBCBED] rounded-[30px] bg-[#2357C6] gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9"
                                onClick={() =>
                                    router.push(
                                        `/business-development/${data?.Id}`
                                    )
                                }
                            >
                                <Eye className="w-4 h-4" />
                                <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                                    View Post
                                </p>
                            </button>
                        )}
                        {data.MatchType != 1 && (
                            <button
                                className="hidden flex-1 px-5 py-3.5 md:flex items-center gap-2 text-white bg-omblue-500 rounded-md"
                                onClick={() =>
                                    router.push(
                                        `/cofounder-and-board-matcher/${data?.Id}`
                                    )
                                }
                            >
                                <Eye className="w-4 h-4" />
                                <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                                    View Post
                                </p>
                            </button>
                        )}
                    </div>
                </div>
                {/* <div
                    className="text-omblue-500 md:hidden flex items-center gap-2 ml-[54px] mobile:flex-wrap"
                    style={{ marginTop: 0 }}
                >
                    <h6 className="text-h6 2xl:text-scaled-h6">{data.Rating}</h6>
                    <div className="flex items-center"> */}
                {/* {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} />
            ))} */}
                {/* <StarRatings
                            starDimension="25px"
                            rating={data.Rating}
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
                    <div className="text-omblue-900 flex items-center mobile:w-full">
                        <p className="text-h9 2xl:text-scaled-h9">{data.Review} Reviews</p>
                        <ChevronRight />
                    </div>
                </div> */}
                <hr className="border-b border-[#D2D4DA]" />
                <div className="grid grid-cols-12 gap-4">
                    <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-1">
                        <div className="grid grid-cols-2 md:grid-cols-1">
                            <div className="text-[#1A9E78] flex items-center gap-2 py-1">
                                <StyledTick className="w-6 h-6" />
                                <p className="text-h9 2xl:text-scaled-h9 font-medium">
                                    {data.BDType}
                                </p>
                            </div>
                            <div className="text-omblue-500 flex items-center gap-2 py-1">
                                <Users className="w-6 h-6" />
                                <p className="text-blue-500 text-h9 2xl:text-scaled-h9 font-medium">
                                    {data?.NoOfMatches || 0}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-1">
                            <div className="text-omblue-500 flex items-center gap-2 py-1">
                                <LocationPin className="w-6 h-6" />
                                <p className="text-blue-500 text-h9 2xl:text-scaled-h9 font-medium">
                                    {data.RegionName}
                                </p>
                            </div>
                            <div className="text-omblue-500 flex items-center gap-2 py-1">
                                <UserSearch className="w-6 h-6" />
                                <p className="text-blue-500 text-h9 2xl:text-scaled-h9 font-medium">
                                    {data.Timeline}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-3">
                        <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold">
                            Tactics
                        </p>
                        {data?.Tactics && data.Tactics.length > 0 ? (
                            <>
                                {isExpanded
                                    ? data.Tactics.map((tactic, index) => (
                                        <div className="flex items-center gap-2" key={index}>
                                            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                                                {typeof tactic === 'string' ? tactic : tactic.TacticName}
                                            </p>
                                        </div>
                                    ))
                                    : data.Tactics.slice(0, 4).map((tactic, index) => (
                                        <div className="flex items-center gap-2" key={index}>
                                            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                                                {typeof tactic === 'string' ? tactic : tactic.TacticName}
                                            </p>
                                        </div>
                                    ))}
                                {data.Tactics.length > 4 && (
                                    <button
                                        className="text-omblue-600 text-h9 2xl:text-scaled-h9 font-medium"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        {isExpanded ? 'Show Less' : '...Show More'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                                    No Tactics Found
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="col-span-12 md:col-span-3 space-y-2">
                        <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold">
                            Business Locations
                        </p>
                        {data?.BusinessLocation?.length ? (
                            data.BusinessLocation.map((location, index) => (
                                <div className="flex items-center gap-2" key={index}>
                                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                                        {location.value || location}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-2">
                                No Locations Found!
                            </div>
                        )}
                    </div>
                    <div className="col-span-12 md:col-span-3">
                        <div className="flex flex-row md:flex-col gap-2 text-omblue-600 ">
                            <a
                                className="flex items-center justify-center w-full ipad:w-auto sm:flex-1 border border-[#BBCBED] rounded-[30px] gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 "
                                href={data.Website || 'https://google.com'}
                                target="_blank"
                            >
                                <Globe className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4" />
                                <p className="hidden sm:flex">View Website</p>
                            </a>
                            {!data?.TeamDetails?.TeamMembers?.some(member => member.UserId == currentUser.Id) && (<button
                                className="flex items-center justify-center w-full ipad:w-auto sm:flex-1 border border-[#BBCBED] rounded-[30px] bg-[#2357C6] gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 "
                                onClick={() => {
                                    if (data.IsTeam) {
                                        handleTeamChat(data);
                                    } else {
                                        const payload = {
                                            UserId: data?.UserId,
                                            ProfilePicture: data?.ProfilePicture,
                                            FullName: data?.MemberName,
                                            LastActive: data?.LastActive,
                                            UserProfileId: data?.UserProfileId,
                                        };
                                        localStorage.setItem('chatDetails', JSON.stringify(payload));
                                        router.push('/chats');
                                    }
                                }}

                            >
                                <MessageIcon className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4 " />
                                <p className="hidden sm:flex text-white">Chat</p>
                            </button>)}

                            {/* <button
                                className="flex flex-1 px-5 py-3.5 md:hidden items-center justify-center gap-2 text-white bg-omblue-500 rounded-md"
                                onClick={() =>
                                    router.push(
                                        `/profile/${add2040ToProfileDetailsId(
                                            data?.ProfileDetailId
                                        )}`
                                    )
                                }
                            >
                                <Eye className="w-4 h-4" />
                                <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                                    View Profile
                                </p>
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard;
