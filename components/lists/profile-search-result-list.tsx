'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import { renderProfileShape } from '@/utils/profile-shapes';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { apiEndpoint } from '@/utils/utils';
import NonBusinessProfileSearchResultList from './non-business-profile-search-result-list';

export interface ProfileResult {
    ProfileDetailId?: number;
    UserId?: string;
    ProfilePicture?: string;
    Tagline?: string | null;
    CompanyName?: string | null;
    PersonalProfileName?: string | null;
    Name?: string | null;
    CompanyWebsite?: string | null;
    City?: string | null;
    State?: string | null;
    Country?: string | null;
    IsVerified?: boolean;
    ProfileType?: string;
    ServiceModels?: Array<{
        UserProfileDetailId?: number;
        ServiceName?: string;
        ServicePercentage?: string;
    }>;
    Review?: number;
    Rating?: number;
    TotalCount?: number;
    Description?: string;
    BlackOwnedPercent?: string;
    IsBDOppurtunity?: boolean;
    Size?: string;
    Year?: string;

    MatchType?: string; // 1, 2, or 3
    BusinessType?: string | null;
    LatestReview?: string;
    ChatUserName?: string;
    IsFavouriteProfile?: boolean;
    UserAddress?: string | null;
    UserTags?: string[] | null;
    UserIndustries?: string[] | null;
    YearsOfExperience?: number | string;
    Profession?: string | string[];
    WorkTitle?: string;
    TitlePosition?: string;
    InvestmentStage?: string | string[];
    InvestmentStageFormatted?: string;
    InvestorType?: string | string[];
    InvestorTypeFormatted?: string;
    Stage?: string | string[];
    Industry?: string | string[];
    SessionStyle?: string | string[];
    SessionStyles?: string | string[];
    BusinessTypes?: string | string[];
    Focus?: string | string[];
    Expertise?: string | string[];
    ConsultingFocus?: string | string[];
    Geography?: string;
    GeographyFormatted?: string;
    GeographyOfService?: string | string[];
    GeographyOfServiceFormatted?: string;
    GeographyService?: string | string[];
    GeographyServiceFormatted?: string;
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const ProfileSearchResultList = ({
    results = [],
    filterValues,
    profileTypeId = 1,
    // handleGeographyChange,
    // handleIndustryChange
}: {
        results?: ProfileResult[];
        filterValues?: any;
        profileTypeId?: number | string;
        // handleGeographyChange?: (value: string) => void;
        // handleIndustryChange?: (value: string) => void;
}) => {

    const router = useRouter();
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [flagUrls, setFlagUrls] = useState<Record<string, string>>({});

    const handleSort = useCallback((columnName: string) => {
        if (sortColumn === columnName) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnName);
            setSortDirection('asc');
        }
    }, [sortColumn, sortDirection]);

    const SortIcon = ({ columnName }: { columnName: string }) => {
        if (sortColumn !== columnName) {
            return <ChevronUp className="w-4 h-4 text-gray-400" />;
        }
        return sortDirection === 'asc'
            ? <ChevronUp className="w-4 h-4 text-blue-600" />
            : <ChevronDown className="w-4 h-4 text-blue-600" />;
    };

    const HeaderCell = ({
        children,
        columnName,
        sortable = true,
        sticky = false
    }: {
        children: React.ReactNode;
        columnName?: string;
        sortable?: boolean;
        sticky?: boolean;
    }) => (
        <th
            onClick={() => sortable && columnName && handleSort(columnName)}
            className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${sortable && columnName ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                } ${sticky ? 'sticky right-0 bg-gray-50 z-10' : ''}`}
        >
            <div className="flex items-center gap-2">
                {children}
                {sortable && columnName && <SortIcon columnName={columnName} />}
            </div>
        </th>
    );

    const handleViewProfile = useCallback((id?: number) => {
        if (!id) return;
        router.push(`/profile/${add2040ToProfileDetailsId(id)}`);
    }, [router]);

    const handleChat = useCallback(async (userId?: string) => {
        if (!userId) return;

        try {
            const response = await axios.post(
                `${apiEndpoint}/chat/GetSpecificUserDetails`,
                { UserId: userId },
                {
                    headers: {
                        XApiKey: apiKey,
                    },
                }
            );

            if (response.status === 200) {
                localStorage.setItem(
                    'chatDetails',
                    JSON.stringify(response?.data?.Result)
                );
                router.push('/chats');
            }
        } catch (error) {
            toast.error('Failed to route to chat page');
        }
    }, [router]);

    const handleVisitWebsite = useCallback((url?: string) => {
        if (!url) return;
        const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }, []);

    // Load country flags for all results
    useEffect(() => {
        const fetchFlags = async () => {
            const uniqueCountries = [...new Set(results.map(r => r.Country).filter(Boolean))];
            const flagPromises = uniqueCountries.map(async (country) => {
                const url = await leaderboard.fetchCountryFlag(country as string);
                return { country, url };
            });

            const flagResults = await Promise.all(flagPromises);
            const flagMap = flagResults.reduce((acc, { country, url }) => {
                if (url) acc[country as string] = url;
                return acc;
            }, {} as Record<string, string>);

            setFlagUrls(flagMap);
        };

        if (results && results.length > 0) {
            fetchFlags();
        }
    }, [results]);

    const StarIcon = ({ filled = true }: { filled?: boolean }) => (
        <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block"
        >
            <path
                d="M14.1899 5.11289C14.1117 4.872 13.9028 4.696 13.6522 4.65956L9.5455 4.06311L7.70906 0.341333C7.48506 -0.113778 6.7375 -0.113778 6.5135 0.341333L4.67706 4.06222L0.570391 4.65867C0.319724 4.69511 0.110835 4.87111 0.0326129 5.112C-0.0456094 5.35289 0.0192795 5.61867 0.201502 5.79556L3.17306 8.69156L2.47084 12.7813C2.42817 13.032 2.53039 13.2844 2.73572 13.4338C2.94106 13.5822 3.21395 13.6018 3.43795 13.4844L7.11084 11.5529L10.7837 13.4844C10.8815 13.536 10.9873 13.5609 11.0939 13.5609C11.2317 13.5609 11.3695 13.5182 11.4859 13.4338C11.6913 13.2844 11.7944 13.032 11.7508 12.7813L11.0486 8.69156L14.0202 5.79556C14.2024 5.61867 14.2673 5.35289 14.1891 5.112L14.1899 5.11289Z"
                fill={filled ? "#2357C6" : "#D1D5DB"}
            />
        </svg>
    );

    const getSortValue = (result: ProfileResult, column: string): string | number => {
        switch (column) {
            case 'company':
                return result.CompanyName || '';
            case 'geography':
                return result.Country || '';
            case 'rating':
                return result.Rating ?? 0;
            case 'size':
                return result.Size || '';
            case 'ownership': {
                const value = result.BlackOwnedPercent || '';
                const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
                return Number.isNaN(parsed) ? 0 : parsed;
            }
            case 'industries':
                return result.UserIndustries?.join(', ') || '';
            case 'type':
                return result.BusinessType || '';
            case 'fundraising':
                return result.Review ? 1 : 0;
            case 'investments':
                return result.Review ? 1 : 0;
            case 'bd':
                return result.IsBDOppurtunity ? 1 : 0;
            case 'pitch':
                return result.IsVerified ? 1 : 0;
            case 'discount':
                return result.IsFavouriteProfile ? 1 : 0;
            default:
                return '';
        }
    };

    const sortedResults = useMemo(() => {
        if (!sortColumn) return results;

        const direction = sortDirection === 'asc' ? 1 : -1;
        return [...results].sort((a, b) => {
            const valueA = getSortValue(a, sortColumn);
            const valueB = getSortValue(b, sortColumn);

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return (valueA - valueB) * direction;
            }

            return String(valueA)
                .localeCompare(String(valueB), undefined, { numeric: true, sensitivity: 'base' }) * direction;
        });
    }, [results, sortColumn, sortDirection]);

    if (!results || results.length === 0) {
        return (
            <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 p-8 text-center text-gray-500">
                No results found
            </div>
        );
    }

    if (Number(profileTypeId) !== 1) {
        return (
            <NonBusinessProfileSearchResultList
                results={results}
                profileTypeId={Number(profileTypeId)}
                flagUrls={flagUrls}
                onViewProfile={handleViewProfile}
                onChat={handleChat}
            />
        );
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 profile-search-list">
            <style jsx>{`
                .profile-search-list table tr td:nth-last-child(-n+2) > div {
                    background: transparent !important;
                    padding: 0 !important;
                    height: auto !important;
                    margin-left: 0 !important;
                    width: auto !important;
                    border-radius: 0 !important;

                }
            `}</style>
            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <HeaderCell columnName="company">Company</HeaderCell>
                            <HeaderCell columnName="geography">Geography</HeaderCell>
                            <HeaderCell columnName="rating">Average Rating</HeaderCell>
                            <HeaderCell columnName="size">Size</HeaderCell>
                            <HeaderCell columnName="ownership">Black Ownership %</HeaderCell>
                            <HeaderCell columnName="industries">Industry</HeaderCell>
                            <HeaderCell columnName="type">Type of Company</HeaderCell>
                            <HeaderCell columnName="fundraising">Fundraising</HeaderCell>
                            <HeaderCell columnName="investments">Open to Investments</HeaderCell>
                            <HeaderCell columnName="bd">BD Opportunities</HeaderCell>
                            <HeaderCell columnName="pitch">Pitch Deck</HeaderCell>
                            <HeaderCell columnName="discount">Discount Available</HeaderCell>
                            <HeaderCell columnName="action" sortable={false} sticky={true}>Action</HeaderCell>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedResults.map((result, index) => {
                            const rowKey = result.ProfileDetailId?.toString() || `row-${index}`;
                            return (
                                <tr
                                    key={rowKey}
                                    onMouseEnter={() => setSelectedRow(rowKey)}
                                    onMouseLeave={() => setSelectedRow(null)}
                                    className={`border-b border-gray-200 hover:bg-olblue-50 transition-colors ${selectedRow === rowKey ? 'bg-olblue-50' : ''
                                        }`}
                                >
                                    {/* Company */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 max-w-16" >
                                                {renderProfileShape(
                                                    result.MatchType || '1',
                                                    result.ProfilePicture || '',
                                                     '',
                                                    64
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 max-w-64 truncate">
                                                    {result.CompanyName}
                                                </span>
                                                <span
                                                    className="text-sm flex text-omblue-600 underline font-semibold cursor-pointer"
                                                    onClick={() => handleVisitWebsite(result.CompanyWebsite)}
                                                >
                                                    Visit Website
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.83594 14.1693L14.1693 5.83594M14.1693 5.83594H5.83594M14.1693 5.83594V14.1693" stroke="#2357C6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Geography */}
                                    <td className="py-4 whitespace-nowrap">
                                        <div className="inline-flex bg-[#EAF0FE] px-2 py-1.5 rounded-full items-center gap-2">
                                            {result.Country && flagUrls[result.Country] && (
                                                <Image
                                                    src={flagUrls[result.Country]}
                                                    alt={`${result.Country} flag`}
                                                    width={24}
                                                    height={24}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                />
                                            )}
                                            <span className="text-xs text-gray-900">{result.Country}</span>
                                        </div>
                                    </td>

                                    {/* Average Rating */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                {result.Rating ?? 4.9}
                                            </span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        filled={i < Math.round(result.Rating ?? 4.9)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Size */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{result.Size || '100-150'}</span>
                                    </td>

                                    {/* Black Ownership % */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_861_36377)">
                                                    <path d="M10.0009 8.05642C11.6884 8.05642 13.0564 6.68841 13.0564 5.00087C13.0564 3.31333 11.6884 1.94531 10.0009 1.94531C8.31333 1.94531 6.94531 3.31333 6.94531 5.00087C6.94531 6.68841 8.31333 8.05642 10.0009 8.05642Z" stroke="#2357C6" stroke-width="0.765074" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M10.5804 10.8715C10.3871 10.8548 10.1971 10.8281 10.0004 10.8281C7.16595 10.8281 4.73484 12.5281 3.65706 14.9615C3.2515 15.8781 3.75372 16.9326 4.70928 17.2337C6.07039 17.6626 7.8715 18.0492 10.0004 18.0492C10.2071 18.0492 10.3948 18.0303 10.5948 18.0237" stroke="#2357C6" stroke-width="0.765074" stroke-linecap="round" stroke-linejoin="round" />
                                                    <g mask="url(#mask0_861_36377)">
                                                        <path d="M15.5568 18.4511C15.0018 18.4511 14.4804 18.3462 13.9928 18.1363C13.5051 17.9264 13.0792 17.6394 12.715 17.2752C12.3508 16.911 12.0638 16.4848 11.8539 15.9967C11.644 15.5084 11.5391 14.9868 11.5391 14.4318C11.5391 13.8768 11.644 13.3554 11.8539 12.8678C12.0638 12.3801 12.3508 11.9542 12.715 11.59C13.0792 11.2258 13.5054 10.9388 13.9935 10.7289C14.4817 10.519 15.0033 10.4141 15.5583 10.4141C16.1134 10.4141 16.6347 10.519 17.1224 10.7289C17.61 10.9388 18.036 11.2258 18.4002 11.59C18.7644 11.9542 19.0514 12.3804 19.2613 12.8685C19.4712 13.3567 19.5761 13.8783 19.5761 14.4333C19.5761 14.9884 19.4712 15.5097 19.2613 15.9974C19.0514 16.485 18.7644 16.911 18.4002 17.2752C18.036 17.6394 17.6098 17.9264 17.1217 18.1363C16.6334 18.3462 16.1118 18.4511 15.5568 18.4511ZM15.5621 17.2844C15.9409 17.2844 16.3049 17.2134 16.6542 17.0715C17.0034 16.9295 17.3138 16.7227 17.5854 16.4511L15.5576 14.4299V11.5807C14.7675 11.5807 14.0946 11.8585 13.5391 12.4141C12.9835 12.9696 12.7057 13.6425 12.7057 14.4326C12.7057 15.2227 12.9835 15.8955 13.5391 16.4511C14.0946 17.0067 14.769 17.2844 15.5621 17.2844Z" fill="#2357C6" />
                                                    </g>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_861_36377">
                                                        <rect width="20" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                            <span className="text-sm text-gray-900">
                                                {result.BlackOwnedPercent}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Industry */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {result.UserIndustries && result.UserIndustries.length > 0 ? (
                                                <>
                                                    {result.UserIndustries.slice(0, 3).map((industry, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs text-[#1B3D86] bg-[#EAF0FE] px-2 py-1 rounded-full"
                                                        >
                                                            {industry}
                                                        </span>
                                                    ))}

                                                    {result.UserIndustries.length > 3 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{result.UserIndustries.length - 3} more
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs text-[#1B3D86] bg-[#EAF0FE] px-2 py-1 rounded-full">
                                                    Technology
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Type of Company */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{result.BusinessType || 'Private'}</span>
                                    </td>

                                    {/* Fundraising */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {result.Review ? 'Yes' : 'No'}
                                        </span>
                                    </td>

                                    {/* Open to Investments */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-xs text-[#1B3D86] bg-[#EAF0FE] px-3 py-1 rounded-full">
                                            {'Equity'}
                                        </span>
                                    </td>

                                    {/* BD Opportunities */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {result.IsBDOppurtunity ? 'Yes' : 'No'}
                                        </span>
                                    </td>

                                    {/* Pitch Deck */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {result.IsVerified ? 'Yes' : 'No'}
                                        </span>
                                    </td>

                                    {/* Discount Available */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {result.IsFavouriteProfile ? 'Yes' : 'No'}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-4 whitespace-nowrap sticky  right-0 bg-white z-10 border-b border-gray-200 w-64">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleViewProfile(result.ProfileDetailId)}
                                                className="px-4 py-2 bg-omblue-600 text-white text-xs font-medium rounded hover:bg-omblue-700 transition-colors"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => handleChat(result.UserId)}
                                                className="px-3 py-1 text-gray-700 text-xs font-medium flex items-center justify-center bg-white  border border-[#F2F4F7] rounded-md gap-1 hover:text-omblue-600 transition-colors"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5ZM6.66667 10C6.66667 10.2301 6.48012 10.4167 6.25 10.4167C6.01988 10.4167 5.83333 10.2301 5.83333 10C5.83333 9.76988 6.01988 9.58333 6.25 9.58333C6.48012 9.58333 6.66667 9.76988 6.66667 10ZM10.4167 10C10.4167 10.2301 10.2301 10.4167 10 10.4167C9.76988 10.4167 9.58333 10.2301 9.58333 10C9.58333 9.76988 9.76988 9.58333 10 9.58333C10.2301 9.58333 10.4167 9.76988 10.4167 10ZM14.1667 10C14.1667 10.2301 13.9801 10.4167 13.75 10.4167C13.5199 10.4167 13.3333 10.2301 13.3333 10C13.3333 9.76988 13.5199 9.58333 13.75 9.58333C13.9801 9.58333 14.1667 9.76988 14.1667 10Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>

                                                Chat
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfileSearchResultList;
