'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StyledTick from '@/icons/verification/styled-tick';
import { renderProfileShape } from '@/utils/profile-shapes';
import type { ProfileResult } from './profile-search-result-list';

type ColumnKey =
    | 'geography'
    | 'rating'
    | 'services'
    | 'industry'
    | 'tags';

type ColumnDefinition = {
    key: ColumnKey;
    label: string;
};

type ProfileTableDefinition = {
    firstColumnLabel: string;
    columns: ColumnDefinition[];
};

const commonProfileColumns: ColumnDefinition[] = [
    { key: 'geography', label: 'Geography' },
    { key: 'rating', label: 'Average Rating' },
    { key: 'services', label: 'Services' },
    { key: 'industry', label: 'Industry' },
    { key: 'tags', label: 'Tags' },
];

const profileTableDefinitions: Record<number, ProfileTableDefinition> = {
    2: {
        firstColumnLabel: 'Consultants',
        columns: commonProfileColumns,
    },
    3: {
        firstColumnLabel: 'Experts',
        columns: commonProfileColumns,
    },
    6: {
        firstColumnLabel: 'Professionals',
        columns: commonProfileColumns,
    },
    7: {
        firstColumnLabel: 'Investors',
        columns: commonProfileColumns,
    },
    8: {
        firstColumnLabel: 'Mentors',
        columns: commonProfileColumns,
    },
};

const defaultDefinition = profileTableDefinitions[6];

const tableGridClass =
    'grid min-w-[1450px] grid-cols-[minmax(260px,1.35fr)_minmax(170px,0.9fr)_minmax(210px,1fr)_minmax(190px,1fr)_minmax(190px,1fr)_minmax(170px,0.9fr)_minmax(190px,0.9fr)]';

const toDisplayList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value
            .flatMap((item) => {
                if (typeof item === 'string' || typeof item === 'number') {
                    return String(item);
                }

                if (item && typeof item === 'object') {
                    const record = item as Record<string, unknown>;
                    const objectValue =
                        record.ServiceName ??
                        record.Name ??
                        record.Title ??
                        record.Value;
                    return objectValue === undefined ? [] : String(objectValue);
                }

                return [];
            })
            .flatMap((item) => item.split(/[|,]/))
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return String(value)
            .split(/[|,]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const getFirstList = (
    result: ProfileResult,
    fields: Array<keyof ProfileResult>
): string[] => {
    for (const field of fields) {
        const values = toDisplayList(result[field]);
        if (values.length > 0) return values;
    }

    return [];
};

const getServices = (result: ProfileResult) =>
    toDisplayList(result.ServiceModels);

const getColumnValues = (
    result: ProfileResult,
    column: ColumnKey
): string[] => {
    switch (column) {
        case 'services':
            return getServices(result);
        case 'tags':
            return toDisplayList(result.UserTags);
        case 'industry':
            return getFirstList(result, ['UserIndustries', 'Industry']);
        default:
            return [];
    }
};

const formatLocation = (result: ProfileResult) =>
    result.UserAddress ||
    [result.City, result.State].filter(Boolean).join(', ') ||
    result.Country ||
    '—';

const getProfileName = (result: ProfileResult) =>
    result.PersonalProfileName ||
    result.CompanyName ||
    result.Name ||
    '—';

const StarIcon = ({ filled }: { filled: boolean }) => (
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
            fill={filled ? '#2357C6' : '#D1D5DB'}
        />
    </svg>
);

const ValuesCell = ({ values }: { values: string[] }) => {
    if (values.length === 0) {
        return <span className="text-sm text-gray-500">—</span>;
    }

    return (
        <div className="flex max-w-56 flex-wrap gap-1.5">
            {values.slice(0, 2).map((value) => (
                <span
                    key={value}
                    className="rounded-full bg-[#EAF0FE] px-2 py-1 text-xs text-[#1B3D86]"
                >
                    {value}
                </span>
            ))}
            {values.length > 2 && (
                <span className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600">
                    +{values.length - 2}
                </span>
            )}
        </div>
    );
};

interface NonBusinessProfileListProps {
    results: ProfileResult[];
    profileTypeId: number;
    flagUrls: Record<string, string>;
    onViewProfile: (id?: number) => void;
    onChat: (userId?: string) => void;
}

const NonBusinessProfileSearchResultList = ({
    results,
    profileTypeId,
    flagUrls,
    onViewProfile,
    onChat,
}: NonBusinessProfileListProps) => {
    const definition = profileTableDefinitions[profileTypeId] || defaultDefinition;
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = useCallback((column: string) => {
        setSortColumn((currentColumn) => {
            if (currentColumn === column) {
                setSortDirection((direction) =>
                    direction === 'asc' ? 'desc' : 'asc'
                );
                return currentColumn;
            }

            setSortDirection('asc');
            return column;
        });
    }, []);

    const getSortValue = useCallback((result: ProfileResult, column: string) => {
        if (column === 'profile') return getProfileName(result);
        if (column === 'geography') return result.Country || '';
        if (column === 'rating') return result.Rating ?? 0;
        return getColumnValues(result, column as ColumnKey).join(', ');
    }, []);

    const sortedResults = useMemo(() => {
        if (!sortColumn) return results;

        const direction = sortDirection === 'asc' ? 1 : -1;
        return [...results].sort((a, b) => {
            const valueA = getSortValue(a, sortColumn);
            const valueB = getSortValue(b, sortColumn);

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return (valueA - valueB) * direction;
            }

            return (
                String(valueA).localeCompare(String(valueB), undefined, {
                    numeric: true,
                    sensitivity: 'base',
                }) * direction
            );
        });
    }, [getSortValue, results, sortColumn, sortDirection]);

    const SortIcon = ({ column }: { column: string }) =>
        sortColumn === column && sortDirection === 'desc' ? (
            <ChevronDown className="h-4 w-4 text-blue-600" />
        ) : (
            <ChevronUp
                className={`h-4 w-4 ${
                    sortColumn === column ? 'text-blue-600' : 'text-gray-400'
                }`}
            />
        );

    const HeaderCell = ({
        label,
        column,
        sticky = false,
    }: {
        label: string;
        column: string;
        sticky?: boolean;
    }) => (
        <div
            role="columnheader"
            className={`flex min-w-0 items-center whitespace-nowrap px-6 py-4 text-left text-xs font-semibold text-gray-700 ${
                sticky ? 'sticky right-0 z-20 bg-gray-50' : ''
            }`}
        >
            {sticky ? (
                <span>{label}</span>
            ) : (
                <button
                    type="button"
                    onClick={() => handleSort(column)}
                    className="flex items-center gap-2 transition-colors hover:text-blue-600"
                >
                    {label}
                    <SortIcon column={column} />
                </button>
            )}
        </div>
    );

    const renderColumnCell = (result: ProfileResult, column: ColumnKey) => {
        if (column === 'geography') {
            const geographies = getFirstList(result, [
                'Geography',
                'GeographyFormatted',
                'GeographyOfService',
                'GeographyOfServiceFormatted',
                'GeographyService',
                'GeographyServiceFormatted',
                'Country',
            ]);

            return (
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF0FE] px-2 py-1.5">
                    {result.Country && flagUrls[result.Country] && (
                        <Image
                            src={flagUrls[result.Country]}
                            alt={`${result.Country} flag`}
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded-full object-cover"
                        />
                    )}
                    <span className="text-xs text-gray-900">
                        {geographies[0] || '—'}
                    </span>
                    {geographies.length > 1 && (
                        <span className="text-xs text-gray-600">
                            +{geographies.length - 1}
                        </span>
                    )}
                </div>
            );
        }

        if (column === 'rating') {
            const parsedRating = Number(result.Rating);
            const rating = Number.isFinite(parsedRating) ? parsedRating : 0;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                        {rating.toFixed(1)}
                    </span>
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon key={index} filled={index < Math.round(rating)} />
                        ))}
                    </div>
                </div>
            );
        }

        return <ValuesCell values={getColumnValues(result, column)} />;
    };

    return (
        <div className="profile-search-list w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <div role="table" aria-label={`${definition.firstColumnLabel} search results`}>
                    <div role="rowgroup">
                        <div
                            role="row"
                            className={`${tableGridClass} border-b border-gray-200 bg-gray-50`}
                        >
                            <HeaderCell
                                label={definition.firstColumnLabel}
                                column="profile"
                            />
                            {definition.columns.map((column) => (
                                <HeaderCell
                                    key={column.key}
                                    label={column.label}
                                    column={column.key}
                                />
                            ))}
                            <HeaderCell label="Action" column="action" sticky />
                        </div>
                    </div>
                    <div role="rowgroup">
                        {sortedResults.map((result, index) => (
                            <div
                                role="row"
                                key={result.ProfileDetailId ?? result.UserId ?? index}
                                className={`${tableGridClass} group border-b border-gray-200 transition-colors last:border-b-0 hover:bg-olblue-50`}
                            >
                                <div
                                    role="cell"
                                    className="flex min-w-0 items-center whitespace-nowrap px-6 py-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-16 w-16 flex-shrink-0">
                                            {renderProfileShape(
                                                result.MatchType || '1',
                                                result.ProfilePicture || '',
                                                '',
                                                64
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="max-w-44 truncate text-sm font-semibold text-gray-900">
                                                    {getProfileName(result)}
                                                </span>
                                                {result.IsVerified && (
                                                    <StyledTick className="h-5 w-5 flex-shrink-0 text-[#12B3C7]" />
                                                )}
                                            </div>
                                            <p className="mt-1 max-w-44 truncate text-sm text-gray-500">
                                                {formatLocation(result)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {definition.columns.map((column) => (
                                    <div
                                        role="cell"
                                        key={column.key}
                                        className="flex min-w-0 items-center whitespace-nowrap px-6 py-4"
                                    >
                                        {renderColumnCell(result, column.key)}
                                    </div>
                                ))}
                                <div
                                    role="cell"
                                    className="sticky right-0 z-10 flex min-w-0 items-center whitespace-nowrap bg-white px-6 py-4 group-hover:bg-olblue-50"
                                >
                                    <div className="flex w-full flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onViewProfile(result.ProfileDetailId)
                                            }
                                            className="rounded bg-omblue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-omblue-700"
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onChat(result.UserId)}
                                            className="flex items-center justify-center gap-1 rounded-md border border-[#F2F4F7] bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:text-omblue-600"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5Z"
                                                    stroke="#344054"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NonBusinessProfileSearchResultList;
