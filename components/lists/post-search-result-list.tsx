import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronsRight, ChevronUp } from 'react-feather';
import ChatIcon from '@/public/postSearch/lets-icons_chat.png'
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import verifiedIcon from '@/public/postSearch/material-symbols_verified.png'
import notVerifiedIcon from '@/public/postSearch/cancel.png';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import ColumnHeader from '@/app/(dashboard)/(users)/(main)/post-search/components/ColumnHeader';
import Tooltip from '../ui/tooltip';
import './ListSearch.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const columnKeyMap: Record<string, string> = {
    memberName: 'MemberName',
    region: 'BusinessLocation',
    strategy: 'StrategyName',
    tactics: 'Tactics',
    industry: 'Industry',
    roleSought: 'RoleSought',
};

const SearchResultList = ({
    results, orderBy, setOrderBy
}: {
    results?: any,
    orderBy?: {
        memberName: 'asc' | 'desc';
        industry: 'asc' | 'desc';
        strategy: 'asc' | 'desc';
    };
    setOrderBy?: React.Dispatch<
        React.SetStateAction<{
            memberName: 'asc' | 'desc';
            industry: 'asc' | 'desc';
            strategy: 'asc' | 'desc';
        }>
    >;
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const profileType = searchParams.get("profileType");
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const [isScrollingRight, setIsScrollingRight] = useState(true);
    const [filterResult, setFilterResult] = useState(results);
    const [includedOptions, setIncludedOptions] = useState({
        memberName: [],
        strategy: [],
        tactics: [],
        roleSought: [],
        country: [],
        industry: []
    })
    const [sortConfig, setSortConfig] = useState<{ column: string; order: 'asc' | 'desc' }>({
        column: '',
        order: 'asc',
    });

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

        }
    };
    const handleScrollToggle = () => {
        const table = document.querySelector('.table-container');
        if (table) {
            const scrollAmount = 300;
            const newPosition = isScrollingRight
                ? scrollPosition + scrollAmount
                : Math.max(0, scrollPosition - scrollAmount);

            table.scrollLeft = newPosition;
            setScrollPosition(newPosition);
            setIsScrollingRight(!isScrollingRight); // Toggle direction
        }
    };

    // Check if table needs horizontal scrolling
    React.useEffect(() => {
        const table = document.querySelector('.table-container');
        if (table) {
            const hasOverflow = table.scrollWidth > table.clientWidth;
            setShowScrollButtons(hasOverflow);
        }
    }, [results]);

    useEffect(() => {
        let newData = [...results];
        if (includedOptions.memberName.length == 1) {
            const includeVerified = includedOptions.memberName.includes("verified");
            if (includeVerified) {
                newData = newData.filter(item => item.UserVerifiedStatus === true);
            } else if (!includeVerified) {
                newData = newData.filter(item => item.UserVerifiedStatus === false);
            }
        }
        if (includedOptions.country.length > 0) {
            newData = newData.filter(item =>
                item.BusinessLocation?.some(location =>
                    includedOptions.country.includes(location.id)
                )
            );
        }
        if (includedOptions.industry.length > 0) {
            newData = newData.filter(item =>
                item.ChildIndustries?.some(indusries =>
                    includedOptions.industry.includes(indusries.Id)
                )
            );
        }
        if (includedOptions.strategy.length > 0) {
            newData = newData.filter(item => includedOptions.strategy.includes(item.StrategyName));
        }
        if (includedOptions.tactics.length > 0) {
            newData = newData.filter(item =>
                item.Tactics?.some(tactic =>
                    includedOptions.tactics.includes(tactic)
                ));
        }
        if (includedOptions.roleSought.length > 0 && profileType == "2") {
            newData = newData.filter(item => includedOptions.roleSought.includes(item.RoleSought));
        }

        // Sorting logic
        const key = columnKeyMap[sortConfig.column];

        const getValue = (item) => {
            if (!key) return '';
            if (key === 'BusinessLocation') return item.BusinessLocation?.[0]?.name || '';
            if (key === 'Tactics') return item.Tactics?.[0] || '';
            if (key === 'Industry') {
                return item.Industry || item.ChildIndustries?.[0]?.IndustryName || '';
            }
            return item[key] || '';
        };

        newData.sort((a, b) => {
            const aVal = getValue(a).toString().toLowerCase();
            const bVal = getValue(b).toString().toLowerCase();

            if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
            return 0;
        });

        setFilterResult(newData);
    }, [results, includedOptions, sortConfig]);

    const renderTableHeader = (matchType: number) => {
        switch (matchType) {
            case 1:
                return (
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="min-w-[120px] px-4 py-4"></th>
                            <th className="min-w-[200px]">
                                <ColumnHeader title="Member Name" columnType="memberName" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions}
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                />
                            </th>
                            <th className="min-w-[150px]">
                                <ColumnHeader onFilterChange={(column, order) => {
                                    setSortConfig({ column, order });
                                }}
                                    title="Region" columnType="region" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions}
                                    results={results} />
                            </th>
                            <th className="min-w-[180px]">
                                <ColumnHeader
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    title="Strategy" columnType="strategy" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions}
                                    results={results} />
                            </th>
                            <th className="min-w-[180px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    title="Tactics" columnType="tactics" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions}
                                    results={results} />
                            </th>
                            <th className="min-w-[250px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    title="Industry" columnType="industry" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions}
                                    results={results} />
                            </th>
                            <th className="cursor-pointer transition-transform duration-300 ease-in-out" onClick={handleScrollToggle}>
                                <ChevronsRight
                                    className={`transform transition-transform duration-300 ease-in-out ${isScrollingRight ? 'rotate-0' : 'rotate-180'
                                        }`}
                                />
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                );
            case 2:
                return (
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="min-w-[120px] px-4 py-4"></th>
                            <th className="min-w-[200px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                    title="Member Name" columnType="memberName" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions} />
                            </th>
                            <th className="min-w-[180px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    title="Region" columnType="region" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions} results={results} />
                            </th>
                            <th className="min-w-[220px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    title="Role Sought" columnType="roleSought" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions} results={results} />
                            </th>
                            <th className="min-w-[180px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                    title="Industry" columnType="industry" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions}
                                />
                            </th>
                            <th className="cursor-pointer transition-transform duration-300 ease-in-out" onClick={handleScrollToggle}>
                                <ChevronsRight
                                    className={`transform transition-transform duration-300 ease-in-out ${isScrollingRight ? 'rotate-0' : 'rotate-180'
                                        }`}
                                />
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                );
            case 1002:
                return (
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="min-w-[120px] px-4 py-4"></th>
                            <th className="min-w-[200px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                    title="Member Name" columnType="memberName" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions} />
                            </th>
                            <th className="min-w-[180px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    title="Region" columnType="region" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions} results={results} />
                            </th>
                            <th className="min-w-[220px]">
                                <ColumnHeader
                                    onFilterChange={(column, order) => {
                                        setSortConfig({ column, order });
                                    }}
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                    title="Industry" columnType="industry" MatchType={matchType} includedOptions={includedOptions} setIncludedOptions={setIncludedOptions} />
                            </th>
                            <th className="cursor-pointer transition-transform duration-300 ease-in-out" onClick={handleScrollToggle}>
                                <ChevronsRight
                                    className={`transform transition-transform duration-300 ease-in-out ${isScrollingRight ? 'rotate-0' : 'rotate-180'
                                        }`}
                                />
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                );
            default:
                return null;
        }
    };

    // MatchType1Row.tsx
    const MatchType1Row = ({ data }) => {
        const [flagsArray, setFlagsArray] = useState([]);
        const [showAll, setShowAll] = useState(false);
        const [showAllTactics, setShowAllTactics] = useState(false);
        const [showAllIndustries, setShowAllIndustries] = useState(false);
        const router = useRouter();

        const fetchFlag = async (location) => {
            if (location?.value) {
                const url = await leaderboard.fetchCountryFlag(location.value);
                return url;
            }
        };

        useEffect(() => {
            setFlagsArray([]);
            const loadFlags = async () => {
                const allFlagsPromises = data.BusinessLocation?.map(async (i) => {
                    return await fetchFlag(i);
                }) || [];
                const resolvedFlags = await Promise.all(allFlagsPromises);
                setFlagsArray(resolvedFlags);
            };
            loadFlags();
        }, [data]);
        const currentUser =
            typeof window !== 'undefined' &&
            JSON.parse(localStorage.getItem('userData'));
        return (
            <tr className="border-b hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                            src={data?.ProfilePicture || BASE_URL}
                            alt={data?.Title || 'Profile'}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </td>
                <td className="px-4 py-4 text-black text-[15px] font-medium">
                    {data.UserVerifiedStatus ? (
                        <div className="flex items-center gap-1">
                            <a
                                href={data.IsTeam ? `/settings/teamprofile/${data?.UserId}` : `/profile/${add2040ToProfileDetailsId(data?.UserProfileId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:underline"
                            >
                                {data.MemberName?.trim() || 'Member Name'}
                            </a>
                            <Image
                                src={verifiedIcon}
                                alt="verified icon"
                                width={20}
                                height={20}
                                className="inline ml-1"
                            />
                        </div>
                    ) : (
                        <div>
                            <a
                                href={data.IsTeam ? `/settings/teamprofile/${data?.UserId}` : `/profile/${add2040ToProfileDetailsId(data?.UserProfileId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:underline"
                            >
                                {data.MemberName?.trim() || 'Member Name'}
                            </a>
                            <div className='flex items-center'>
                                <Image
                                    src={notVerifiedIcon}
                                    alt="not verified icon"
                                    width={19}
                                    height={19}
                                    className="inline"
                                />
                                <p className='text-[#E88206] ms-1 text-[14px]'>Not Verified</p>
                            </div>
                        </div>
                    )}
                </td>
                <td className="px-4 py-4 text-black">
                    <div className="flex flex-col items-start space-y-1">
                        {data.BusinessLocation?.[0] && (
                            <Tooltip content={data.BusinessLocation[0].name}>
                                <div className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                    <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                        <Image
                                            src={flagsArray[0] || BASE_URL}
                                            alt={data.BusinessLocation[0]?.value || 'Country Flag'}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-left text-[15px] truncate max-w-[100px]">
                                        {data.BusinessLocation[0].name}
                                    </div>
                                </div>
                            </Tooltip>
                        )}

                        {data.BusinessLocation?.[1] && (
                            <div className="flex items-center gap-2">
                                <Tooltip content={data.BusinessLocation[1].name}>
                                    <div className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                        <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                            <Image
                                                src={flagsArray[1] || BASE_URL}
                                                alt={data.BusinessLocation[1]?.value || 'Country Flag'}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="w-full h-full object-contain rounded"
                                            />
                                        </div>
                                        <div className="text-left text-[15px] truncate max-w-[100px]">
                                            {data.BusinessLocation[1].name}
                                        </div>
                                    </div>
                                </Tooltip>

                                {!showAll && data.BusinessLocation?.length > 2 && (
                                    <button
                                        onClick={() => setShowAll(true)}
                                        className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 min-w-[40px] flex items-center justify-center"
                                    >
                                        +{data.BusinessLocation.length - 2}
                                    </button>
                                )}
                            </div>
                        )}

                        {showAll && data.BusinessLocation?.slice(2).map((location, index) => (
                            <Tooltip key={index + 2} content={location.name}>
                                <div key={index + 2} className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                    <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                        <Image
                                            src={flagsArray[index + 2] || BASE_URL}
                                            alt={location?.value || 'Country Flag'}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-left text-[15px] truncate max-w-[100px]">
                                        {location.name}
                                    </div>
                                </div>
                            </Tooltip>
                        ))}

                        {showAll && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 flex items-center justify-center"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4 text-black">{data.StrategyName}</td>
                <td className="px-4 py-4 text-black">
                    <div className="flex flex-col items-start space-y-1">
                        {data.Tactics?.[0] && (
                            <Tooltip content={data.Tactics[0]}>
                                <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                                    {data.Tactics[0]}
                                </div>
                            </Tooltip>
                        )}

                        {data.Tactics?.[1] && (
                            <div className="flex items-center gap-2">
                                <Tooltip content={data.Tactics[1]}>
                                    <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                                        {data.Tactics[1].replace(/([a-z])([A-Z])/g, '$1 $2')}
                                    </div>
                                </Tooltip>

                                {!showAllTactics && data.Tactics?.length > 2 && (
                                    <button
                                        onClick={() => setShowAllTactics(true)}
                                        className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 min-w-[40px] flex items-center justify-center"
                                    >
                                        +{data.Tactics.length - 2}
                                    </button>
                                )}
                            </div>
                        )}

                        {showAllTactics && data.Tactics?.slice(2).map((tactic, index) => (
                            <Tooltip key={index + 1} content={tactic}>
                                <div key={index + 2} className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                                    {tactic.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                </div>
                            </Tooltip>
                        ))}

                        {showAllTactics && (
                            <button
                                onClick={() => setShowAllTactics(false)}
                                className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 flex items-center justify-center"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4 text-black">
                    <div className="flex flex-col items-start space-y-1">
                        {data.ChildIndustries?.[0] && (
                            <Tooltip content={data.ChildIndustries[0].IndustryName}>
                                <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                                    {data.ChildIndustries[0].IndustryName}
                                </div>
                            </Tooltip>
                        )}

                        {data.ChildIndustries?.[1] && (
                            <div className="flex items-center gap-2">
                                <Tooltip content={data.ChildIndustries[1].IndustryName}>
                                    <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                                        {data.ChildIndustries[1].IndustryName.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                    </div>
                                </Tooltip>

                                {!showAllIndustries && data.ChildIndustries?.length > 2 && (
                                    <button
                                        onClick={() => setShowAllIndustries(true)}
                                        className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 min-w-[40px] flex items-center justify-center"
                                    >
                                        +{data.ChildIndustries.length - 2}
                                    </button>
                                )}
                            </div>
                        )}

                        {showAllIndustries && data.ChildIndustries?.slice(2).map((industry, index) => (
                            <Tooltip key={index + 2} content={industry.IndustryName}>
                                <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                                    {industry.IndustryName.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                </div>
                            </Tooltip>
                        ))}

                        {showAllIndustries && (
                            <button
                                onClick={() => setShowAllIndustries(false)}
                                className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 flex items-center justify-center"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4 text-black !w-auto">
                    <button className="px-8 py-2 text-[15px] bg-[#0048BE] text-white rounded-lg hover:bg-blue-300 transition-colors duration-200 text-sm font-medium">
                        Match
                    </button>
                </td>
                <td className="px-4 py-4 bg-transparent">
                    <div className="gap-3 no-bg">
                        {
                            !data?.TeamDetails?.TeamMembers?.some(member => member.UserId == currentUser.Id) && (<button
                                className="flex items-center justify-center w-[80%] ipad:w-auto sm:flex-1 border border-[#0048BE] bg-[#0048BE] rounded-2xl gap-2 px-4 py-2.5 text-h9 2xl:text-scaled-h9 transition-colors duration-200"
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
                                <Image src={ChatIcon} alt='chat icon' className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4" />
                                <p className="hidden text-[15px] text-white sm:flex">Start Chat</p>
                            </button>)
                        }

                        <button
                            className="flex items-center justify-center w-[80%] ipad:w-auto sm:flex-1 gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => router.push(`/business-development/${data.Id}`)}
                        >
                            <p className="hidden text-[15px] sm:flex text-[#0048BE]">View Post</p>
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    // MatchType2Row
    const MatchType2Row = ({ data }) => {
        const [flagsArray, setFlagsArray] = useState([]);
        const [showAll, setShowAll] = useState(false);
        const router = useRouter();

        const fetchFlag = async (location) => {
            if (location?.value) {
                const url = await leaderboard.fetchCountryFlag(location.value);
                return url;
            }
        };

        useEffect(() => {
            setFlagsArray([]);
            const loadFlags = async () => {
                const allFlagsPromises = data.BusinessLocation?.map(async (i) => {
                    return await fetchFlag(i);
                }) || [];
                const resolvedFlags = await Promise.all(allFlagsPromises);
                setFlagsArray(resolvedFlags);
            };
            loadFlags();
        }, [data]);

        return (
            <tr className="border-b hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                            src={data?.ProfilePicture || BASE_URL}
                            alt={data?.Title || 'Profile'}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </td>
                <td className="px-4 py-4 text-black text-[15px] font-medium">
                    {data.UserVerifiedStatus ? (
                        <div className="flex items-center gap-1">
                            <a
                                href={data.IsTeam ? `/settings/teamprofile/${data?.UserId}` : `/profile/${add2040ToProfileDetailsId(data?.UserProfileId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:underline"
                            >
                                {data.MemberName?.trim() || 'Member Name'}
                            </a>
                            <Image
                                src={verifiedIcon}
                                alt="verified icon"
                                width={20}
                                height={20}
                                className="inline ml-1"
                            />
                        </div>
                    ) : (
                        <div>
                            <a
                                href={data.IsTeam ? `/settings/teamprofile/${data?.UserId}` : `/profile/${add2040ToProfileDetailsId(data?.UserProfileId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:underline"
                            >
                                {data.MemberName?.trim() || 'Member Name'}
                            </a>
                            <div className='flex items-center'>
                                <Image
                                    src={notVerifiedIcon}
                                    alt="not verified icon"
                                    width={19}
                                    height={19}
                                    className="inline ml-1"
                                />
                                <p className='text-[#E88206] ms-1 text-[14px]'>Not Verified</p>
                            </div>
                        </div>
                    )}
                </td>
                <td className="px-4 py-4 text-black">
                    <div className="flex flex-col items-start space-y-1">
                        {data.BusinessLocation?.[0] && (
                            <Tooltip content={data.BusinessLocation[0].name}>
                                <div className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                    <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                        <Image
                                            src={flagsArray[0] || BASE_URL}
                                            alt={data.BusinessLocation[0]?.value || 'Country Flag'}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-left text-[15px] truncate max-w-[100px]">
                                        {data.BusinessLocation[0].name}
                                    </div>
                                </div>
                            </Tooltip>
                        )}

                        {data.BusinessLocation?.[1] && (
                            <div className="flex items-center gap-2">
                                <Tooltip content={data.BusinessLocation[1].name}>
                                    <div className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                        <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                            <Image
                                                src={flagsArray[1] || BASE_URL}
                                                alt={data.BusinessLocation[1]?.value || 'Country Flag'}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="w-full h-full object-contain rounded"
                                            />
                                        </div>
                                        <div className="text-left text-[15px] truncate max-w-[100px]">
                                            {data.BusinessLocation[1].name}
                                        </div>
                                    </div>
                                </Tooltip>

                                {!showAll && data.BusinessLocation?.length > 2 && (
                                    <button
                                        onClick={() => setShowAll(true)}
                                        className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 min-w-[40px] flex items-center justify-center"
                                    >
                                        +{data.BusinessLocation.length - 2}
                                    </button>
                                )}
                            </div>
                        )}

                        {showAll && data.BusinessLocation?.slice(2).map((location, index) => (
                            <Tooltip key={index + 2} content={location.name}>
                                <div key={index + 2} className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                    <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                        <Image
                                            src={flagsArray[index + 2] || BASE_URL}
                                            alt={location?.value || 'Country Flag'}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-left text-[15px] truncate max-w-[100px]">
                                        {location.name}
                                    </div>
                                </div>
                            </Tooltip>
                        ))}

                        {showAll && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 flex items-center justify-center"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4 text-[15px] text-black">{data.RoleSought}</td>
                <td className="px-4 py-4 text-[15px] text-black max-w-[100px]">
                    <Tooltip content={data.Industry}>
                        <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                            {data.Industry}
                        </div>
                    </Tooltip>
                </td>
                <td className="px-4 py-4 text-black !w-auto">
                    <button className="px-8 text-[15px] py-2 bg-[#0048BE] text-white rounded-lg hover:bg-blue-300 transition-colors duration-200 text-sm font-medium">
                        Match
                    </button>
                </td>
                <td className="px-4 py-4">
                    <div className="gap-3 no-bg">
                        <button
                            className="flex items-center justify-center w-[80%] ipad:w-auto sm:flex-1 border border-[#0048BE] bg-[#0048BE] rounded-2xl gap-2 px-4 py-2.5 text-h9 2xl:text-scaled-h9 transition-colors duration-200"
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
                            <Image src={ChatIcon} alt='chat icon' className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4" />
                            <p className="hidden text-white text-[15px] sm:flex">Start Chat</p>
                        </button>
                        <button
                            className="flex items-center justify-center w-[80%] ipad:w-auto sm:flex-1 gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => router.push(`/cofounder-and-board-matcher/${data.Id}`)}
                        >
                            <p className="hidden sm:flex text-[15px] text-[#0048BE]">View Post</p>
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    // MatchType1002Row
    const MatchType1002Row = ({ data }) => {
        const [flagsArray, setFlagsArray] = useState([]);
        const [showAll, setShowAll] = useState(false);
        const router = useRouter();

        const fetchFlag = async (location) => {
            if (location?.value) {
                const url = await leaderboard.fetchCountryFlag(location.value);
                return url;
            }
        };

        useEffect(() => {
            setFlagsArray([]);
            const loadFlags = async () => {
                const allFlagsPromises = data.BusinessLocation?.map(async (i) => {
                    return await fetchFlag(i);
                }) || [];
                const resolvedFlags = await Promise.all(allFlagsPromises);
                setFlagsArray(resolvedFlags);
            };
            loadFlags();
        }, [data]);

        return (
            <tr className="border-b hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                            src={data?.ProfilePicture || BASE_URL}
                            alt={data?.Title || 'Profile'}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </td>
                <td className="px-4 py-4 text-black text-[15px] font-medium">
                    {data.UserVerifiedStatus ? (
                        <div className="flex items-center gap-1">
                            <a
                                href={data.IsTeam ? `/settings/teamprofile/${data?.UserId}` : `/profile/${add2040ToProfileDetailsId(data?.UserProfileId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:underline"
                            >
                                {data.MemberName?.trim() || 'Member Name'}
                            </a>
                            <Image
                                src={verifiedIcon}
                                alt="verified icon"
                                width={20}
                                height={20}
                                className="inline ml-1"
                            />
                        </div>
                    ) : (
                        <div>
                            <a
                                href={data.IsTeam ? `/settings/teamprofile/${data?.UserId}` : `/profile/${add2040ToProfileDetailsId(data?.UserProfileId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:underline"
                            >
                                {data.MemberName?.trim() || 'Member Name'}
                            </a>
                            <div className='flex items-center'>
                                <Image
                                    src={notVerifiedIcon}
                                    alt="not verified icon"
                                    width={19}
                                    height={19}
                                    className="inline ml-1"
                                />
                                <p className='text-[#E88206] ms-1 text-[14px]'>Not Verified</p>
                            </div>
                        </div>
                    )}
                </td>
                <td className="px-4 py-4 text-black">
                    <div className="flex flex-col items-start space-y-1">
                        {data.BusinessLocation?.[0] && (
                            <Tooltip content={data.BusinessLocation[0].name}>
                                <div className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                    <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                        <Image
                                            src={flagsArray[0] || BASE_URL}
                                            alt={data.BusinessLocation[0]?.value || 'Country Flag'}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-left text-[15px] truncate max-w-[100px]">
                                        {data.BusinessLocation[0].name}
                                    </div>
                                </div>
                            </Tooltip>
                        )}

                        {data.BusinessLocation?.[1] && (
                            <div className="flex items-center gap-2">
                                <Tooltip content={data.BusinessLocation[1].name}>
                                    <div className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                        <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                            <Image
                                                src={flagsArray[1] || BASE_URL}
                                                alt={data.BusinessLocation[1]?.value || 'Country Flag'}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="w-full h-full object-contain rounded"
                                            />
                                        </div>
                                        <div className="text-left text-[15px] truncate max-w-[100px]">
                                            {data.BusinessLocation[1].name}
                                        </div>
                                    </div>
                                </Tooltip>

                                {!showAll && data.BusinessLocation?.length > 2 && (
                                    <button
                                        onClick={() => setShowAll(true)}
                                        className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 min-w-[40px] flex items-center justify-center"
                                    >
                                        +{data.BusinessLocation.length - 2}
                                    </button>
                                )}
                            </div>
                        )}

                        {showAll && data.BusinessLocation?.slice(2).map((location, index) => (
                            <Tooltip key={index + 2} content={location.name}>
                                <div key={index + 2} className='flex rounded-full bg-[#E7F2FD] px-5 py-1'>
                                    <div className='w-[32px] h-[23.11px] mr-2 rounded'>
                                        <Image
                                            src={flagsArray[index + 2] || BASE_URL}
                                            alt={location?.value || 'Country Flag'}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-left text-[15px] truncate max-w-[100px]">
                                        {location.name}
                                    </div>
                                </div>
                            </Tooltip>
                        ))}

                        {showAll && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="text-blue-500 text-lg rounded-full bg-[#E7F2FD] px-3 py-1 flex items-center justify-center"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4 text-[15px] text-black max-w-[100px]">
                    <Tooltip content={data.Industry}>
                        <div className="text-left text-[15px] rounded-full bg-[#E7F2FD] px-5 py-1 truncate max-w-[150px]">
                            {data.Industry}
                        </div>
                    </Tooltip>
                </td>
                <td className="px-4 py-4 text-black !w-auto">
                    <button className="px-8 text-[15px] py-2 bg-[#0048BE] text-white rounded-lg hover:bg-blue-300 transition-colors duration-200 text-sm font-medium">
                        Match
                    </button>
                </td>
                <td className="px-4 py-4 ">
                    <div className="gap-3 no-bg">
                        <button
                            className="flex items-center justify-center w-[80%] ipad:w-auto sm:flex-1 border border-[#0048BE] bg-[#0048BE] rounded-2xl gap-2 px-4 py-2.5 text-h9 2xl:text-scaled-h9 transition-colors duration-200"
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
                            <Image src={ChatIcon} alt='chat icon' className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4" />
                            <p className="hidden text-[15px] text-white sm:flex">Start Chat</p>
                        </button>
                        <button
                            className="flex items-center justify-center w-[80%] ipad:w-auto sm:flex-1 gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => router.push(`/cofounder-and-board-matcher/${data.Id}`)}
                        >
                            <p className="hidden text-[15px] sm:flex text-[#0048BE]">View Post</p>
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    // In your SearchResultList component, update the renderTableRow function:
    const renderTableRow = (data: any) => {
        switch (data.MatchType) {
            case 1:
                return <MatchType1Row data={data} />;
            case 2:
                return <MatchType2Row data={data} />;
            case 1002:
                return <MatchType1002Row data={data} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="relative">
                {/* {showScrollButtons && (
                    <>
                        <button
                            onClick={() => handleScroll('left')}
                            disabled={scrollPosition <= 0}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition-colors ${scrollPosition <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeft size={20} className="text-black" />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight size={20} className="text-black" />
                        </button>
                    </>
                )} */}
                <div className="table-container min-h-screen overflow-x-auto scroll-smooth pb-2 w-full">
                    <div className="min-w-[800px] md:min-w-full">
                        <table className="w-full">
                            {renderTableHeader(parseInt(profileType) === 3 ? 1002 : parseInt(profileType))}
                            <tbody>
                                {filterResult.length > 0 && filterResult.map((data: any, index: number) => (
                                    <React.Fragment key={index}>
                                        {renderTableRow(data)}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultList;