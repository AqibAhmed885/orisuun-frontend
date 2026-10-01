"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import ResourceCard from "./resourceCard";
import { ArrowDownToLine, ChevronRight, Share2 } from "lucide-react";
import SearchIcon from "@/icons/search-icon";
import CardViewIcon from "@/icons/card-view";
import ListViewIcon from "@/icons/list-view";
import ResourceModal from "./ResourceModal";
import { getAllResources } from "@/app/api/marketing/resources";
import Banner from "./banner";
import { downloadResourcesPDFFromAPI } from "@/utils/pdfGenerator";
import { toast } from "react-toastify";
import Image from "next/image";
import { pluralizeResourceTypeName } from "@/utils/resourceType";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const FILTERS = [
    { label: "By Deadline", value: "deadline" },
    { label: "By Investment", value: "investment" },
    { label: "By City", value: "city" },
    { label: "By Amount", value: "amount" },
];

// Accelerator resources support investment sorting (id === 2)
const INVESTMENT_RESOURCE_TYPE_IDS = new Set<number>([2]);

const ResourceGridSection = ({
    selectedCity,
    selectedResourceType,
    onBack,
    resources,
    resourceTypeId,
    loading,
    page,
    pageSize,
    countryId,
    cityId,
    stateId,
    isCityFlow = false,
    showAllCountryResources,
    showAllBlackFocused,
    searchQuery = "",
}: {
    selectedCity?: any;
    selectedResourceType?: any;
    onBack: () => void;
    resources?: any[];
    resourceTypeId?: any;
        page?: number;
        pageSize?: number;
    loading?: boolean;
    countryId?: any;
        cityId?: any;
        stateId?: any;
    showAllCountryResources?: boolean;
    showAllBlackFocused?: boolean;
    isCityFlow?: boolean;
    searchQuery?: string;
    }) => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);
    const [viewMode, setViewMode] = useState<"card" | "list">("card");
    const [query, setQuery] = useState<string>("");
    // Default to alphabetical order (A → Z)
    const [selectedFilter, setSelectedFilter] = useState<string>("alphabetical");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [fetchedResources, setFetchedResources] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(page ?? 1);
    const [internalPageSize] = useState<number>(pageSize ?? 50);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [showOnlyBlackFocused, setShowOnlyBlackFocused] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Helper — render a compact toggle switch (provided by user)
    const renderToggleSwitch = (checked: boolean, label: string, onChange: (checked: boolean) => void) => (
        <label className="flex items-center cursor-pointer">
            <div className="mr-3 text-base text-gray-700">{label}</div>
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                <p className={`absolute top-1/2 -translate-y-1/2 text-sm text-gray-800 ${checked ? 'left-[8px]' : 'right-[8px]'}`}>
                    {checked ? 'Yes' : 'No'}
                </p>
            </div>
        </label>
    );

    // Debt/Equity detection helpers (handle different casing and 'Yes' strings)
    const isDebtResource = (r: any) => {
        const v = r?.DebtAvailable ?? r?.debtAvailable ?? r?.debtavailable ?? r?.Debtavailable;
        return v === true || String(v).toLowerCase() === 'yes';
    };

    const isEquityResource = (r: any) => {
        const v = r?.EquityAvailable ?? r?.equityAvailable ?? r?.equityavailable ?? r?.Equityavailable;
        return v === true || String(v).toLowerCase() === 'yes';
    };

    const renderCardShimmer = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={`shimmer-${idx}`} className="rounded-2xl border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
            ))}
        </div>
    );

    const handleDownloadPDF = async () => {
        setDownloadingPDF(true);
        try {
            let filename = '';

            // Build filename based on context
            if (resourceTypeId && selectedResourceType) {
                // Resource type view: use resource type name
                filename = selectedResourceType.replace(/\s+/g, '-');
            } else if (isCityFlow && selectedCity) {
                // City view: use city name
                filename = selectedCity?.name?.replace(/\s+/g, '-') || 'resources';
            } else {
                filename = 'resources';
            }

            // Call the API to download PDF and include selected filters (city/country/state/resourceType)
            await downloadResourcesPDFFromAPI(
                filename,
                resourceTypeId || undefined,
                cityId?.toString() || undefined,
                countryId?.toString() || undefined,
                stateId?.toString() || undefined,
                // include black-focused filter when either page-level or local toggle is active
                (showAllBlackFocused === true) || (showOnlyBlackFocused === true)
            );

            toast.success('Your resources have been downloaded successfully.');
        } catch (error) {
            console.error('PDF download error:', error);
            toast.error('Failed to download PDF. Please try again.');
        } finally {
            setDownloadingPDF(false);
        }
    };

    const activeResources = useMemo(() => {
        return Array.isArray(fetchedResources) ? fetchedResources : (Array.isArray(resources) ? resources : []);
    }, [resources, fetchedResources]);

    useEffect(() => {
        const initPage = page ?? 1;
        const ps = pageSize ?? 50;
        setCurrentPage(initPage);
        if (resources && Array.isArray(resources)) {
            setFetchedResources(resources);
            setHasMore(resources.length >= ps);
            return;
        }

        // Otherwise, fetch the first page based on query context
        const doInitFetch = async () => {
            setFetchLoading(true);
            try {
                const data = await getAllResources({
                    cityId: cityId ?? undefined,
                    countryId: countryId ?? undefined,
                    resourceTypeId: resourceTypeId ?? undefined,
                    includeExpired: true,
                    page: initPage,
                    pageSize: ps,
                });
                setFetchedResources(data || []);
                setHasMore((data?.length || 0) >= ps);
            } catch (err) {
                setFetchedResources([]);
                setHasMore(false);
            } finally {
                setFetchLoading(false);
            }
        };

        doInitFetch();
    }, [resources, resourceTypeId, cityId, countryId, page, pageSize]);

    // Fetch next page
    const fetchMoreResources = async () => {
        if (!hasMore) return;
        // Only fetch more if we have context to ask the API for more pages
        if (!resourceTypeId && !cityId && !countryId) {
            console.warn('No resourceTypeId/cityId/countryId present — cannot fetch more pages.');
            setHasMore(false);
            return;
        }
        if (fetchLoading) return;
        setFetchLoading(true);
        const nextPage = (currentPage || 1) + 1;
        try {
            const data = await getAllResources({
                cityId: cityId ?? undefined,
                countryId: countryId ?? undefined,
                resourceTypeId: resourceTypeId ?? undefined,
                includeExpired: true,
                page: nextPage,
                pageSize: internalPageSize,
            });
            setFetchedResources(prev => [...prev, ...(data || [])]);
            setCurrentPage(nextPage);
            setHasMore((data?.length || 0) >= internalPageSize);
        } catch (err) {
            setHasMore(false);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore && !fetchLoading) {
                    fetchMoreResources();
                }
            },
            { root: null, rootMargin: '200px', threshold: 0 }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, fetchLoading, resourceTypeId, cityId, countryId, currentPage]);

    // Compute available filters depending on the selected resource type
    const availableFilters = useMemo(() => {
        if (!resourceTypeId) return FILTERS;
        const id = Number(resourceTypeId);
        const filters: any[] = [];

        // Deadline is always present
        filters.push({ label: "By Deadline", value: "deadline" });

        // Type-specific filters
        if (id === 1) { // Competitions
            filters.push({ label: "By Prize Amount", value: "amount" });
            filters.push({ label: "By City", value: "city" });

        } else if (id === 2) { // Accelerators
            filters.push({ label: "By Investment", value: "investment" });
            filters.push({ label: "By City", value: "city" });

        } else if (id === 3) { // Grants
            filters.push({ label: "By Grant Amount", value: "amount" });
            filters.push({ label: "By City", value: "city" });

        } else if ([4, 5, 7].includes(id)) { // Government / School / NGO Programs
            filters.push({ label: "By City", value: "city" });
            // For School Programs specifically, offer a 'By School' grouping
            if (id === 5) {
                filters.push({ label: "By School", value: "school" });
            }

        } else if (id === 8) { // Specialty Financing
            // Provide debt/equity quick filters for specialty financing
            filters.push({ label: "Debt", value: "debt" });
            filters.push({ label: "Equity", value: "equity" });
            filters.push({ label: "By City", value: "city" });

        } else {
            // Fallback to defaults
            filters.push(...FILTERS.filter(f => f.value !== 'investment'));
        }

        return filters;
    }, [resourceTypeId]);

    // Ensure selected filter is valid — default to deadline for resource-type views
    useEffect(() => {
        if (!availableFilters.some((filter) => filter.value === selectedFilter)) {
            if (resourceTypeId) setSelectedFilter("deadline");
            else setSelectedFilter("alphabetical");
        }
    }, [availableFilters, selectedFilter, resourceTypeId]);

    // When entering a resource-type view, make deadline the default
    useEffect(() => {
        if (resourceTypeId) setSelectedFilter("deadline");
    }, [resourceTypeId]);

    const isGroupedView = selectedFilter === 'alphabetical' || selectedFilter === 'city' || selectedFilter === 'school';
    const isLocationAgnosticSort = Boolean(resourceTypeId) && !isGroupedView;

    const filteredFetchedResources = useMemo(() => {
        const effectiveQuery = searchQuery || query;
        let filtered = Array.isArray(activeResources) ? activeResources.filter((res) => {
            // Filter by Black-focused if toggle is on
            if (showOnlyBlackFocused) {
                const isBlack = res.isBlackFocused === true || res.isBlackFocused === 'Yes' || res.isBlackOwned === true || res.isBlackOwned === 'Yes';
                if (!isBlack) return false;
            }

            const searchText = [res.Name, res.Sponsor, res.Address].join(" ").toLowerCase();
            const lowerQuery = effectiveQuery.toLowerCase();

            const dateMatch = effectiveQuery.match(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|[A-Za-z]{3,}\s+\d{1,2}\s+\d{4}/);
            if (dateMatch) {
                const searchDate = new Date(effectiveQuery);
                if (!isNaN(searchDate.getTime())) {
                    const dates = [
                        res.ApplicationDeadline,
                        res.StartDate,
                        res.EndDate,
                        res.CompetitionDetails?.CompetitionDate
                    ].filter(Boolean);

                    if (dates.some(date => {
                        const resDate = new Date(date);
                        return resDate.toDateString() === searchDate.toDateString();
                    })) {
                        return true;
                    }
                }
            }

            return searchText.includes(lowerQuery);
        }) : [];

        // Apply debt/equity filters when selected. Detect multiple possible field namings (DebtAvailable / debtAvailable)
        const hasDebt = (r: any) => {
            const v = r.DebtAvailable ?? r.debtAvailable ?? r.debtAvailable;
            return v === true || String(v).toLowerCase() === 'yes';
        };
        const hasEquity = (r: any) => {
            const v = r.EquityAvailable ?? r.equityAvailable ?? r.equityAvailable;
            return v === true || String(v).toLowerCase() === 'yes';
        };

        if (selectedFilter === 'debt') {
            filtered = filtered.filter(hasDebt);
        }
        if (selectedFilter === 'equity') {
            filtered = filtered.filter(hasEquity);
        }

        // Apply sorting based on selectedFilter
        switch (selectedFilter) {
            case "deadline":
                filtered = filtered.sort((a, b) => {
                    const dateA = a.ApplicationDeadline ? new Date(a.ApplicationDeadline).getTime() : Infinity;
                    const dateB = b.ApplicationDeadline ? new Date(b.ApplicationDeadline).getTime() : Infinity;
                    return dateA - dateB; 
                });
                break;
            case "investment":
                filtered = filtered.sort((a, b) => {
                    const amountA = a.AcceleratorDetails?.InvestmentAmount || 0;
                    const amountB = b.AcceleratorDetails?.InvestmentAmount || 0;
                    return amountB - amountA; // Highest investment first
                });
                break;
            case "startDate":
                filtered = filtered.sort((a, b) => {
                    const dateA = a.StartDate ? new Date(a.StartDate).getTime() : Infinity;
                    const dateB = b.StartDate ? new Date(b.StartDate).getTime() : Infinity;
                    return dateA - dateB; // Earliest start date first
                });
                break;
            case "amount":
                filtered = filtered.sort((a, b) => {
                    // Handle different amount fields based on resource type
                    const amountA = a.GrantDetails?.GrantAmount || a.CompetitionDetails?.PrizeAmount || a.AcceleratorDetails?.InvestmentAmount || 0;
                    const amountB = b.GrantDetails?.GrantAmount || b.CompetitionDetails?.PrizeAmount || b.AcceleratorDetails?.InvestmentAmount || 0;
                    return amountB - amountA; // Highest amount first
                });
                break;
            case "city":
                filtered = filtered.sort((a, b) => (a.CityName || "").toString().localeCompare((b.CityName || ""), undefined, { sensitivity: 'base' }));
                break;
            case "school":
                filtered = filtered.sort((a, b) => ((a.SchoolName || a.School || a.Sponsor || "").toString()).localeCompare((b.SchoolName || b.School || b.Sponsor || ""), undefined, { sensitivity: 'base' }));
                break;
            case "alphabetical":
                filtered = filtered.sort((a, b) => (a.Name || "").localeCompare(b.Name || "", undefined, { sensitivity: 'base' }));
                break;
            default:
                break;
        }

        return filtered;
    }, [activeResources, query, selectedFilter, searchQuery, showOnlyBlackFocused, resourceTypeId]);

    const groupedFetchedResources = useMemo(() => {
        if (!Array.isArray(filteredFetchedResources)) return [];
        const groups: { [key: string]: any[] } = {};

        filteredFetchedResources.forEach((res) => {
            let key: string;

            // Location determination
            const hasCity = Boolean(res.CityId || res.CityName);
            const hasState = Boolean(res.StateId || res.StateName);
            const hasCountry = Boolean(res.CountryId || res.CountryName);

            // Only treat as Virtual when explicitly marked
            if (res.IsLocationVirtual === true) {
                key = "Virtual";
            }
            // Respect explicit flags first
            else if (res.IsNationWide === true) {
                key = "Nationwide";
            }
            else if (res.IsStateWide === true) {
                key = "Statewide";
            }
            else {
                // When we're in a resource-type view we want to group by city (or fallbacks)
                if (resourceTypeId) {
                    if (hasCity) {
                        key = res.CityName || "Unknown City";
                    } else if (hasState) {
                        // No city but we have a state — group under state name
                        key = "Statewide";
                    } else if (hasCountry) {
                        // No city/state but have a country — treat as nationwide for that country
                        key = "Nationwide";
                    } else {
                        // No location info at all — treat as worldwide (not virtual)
                        key = "Worldwide";
                    }
                } else {
                    // Group by resource type name in non resource-type views
                    key = (res.ResourceTypeName && typeof res.ResourceTypeName === 'string') ? pluralizeResourceTypeName(res.ResourceTypeName) : "Other";
                }
            }

            if (!groups[key]) groups[key] = [];
            groups[key].push(res);
        });

        const grouped = Object.entries(groups).map(([groupName, resources]) => ({
            groupName,
            resources,
        }));

        if (selectedFilter === 'alphabetical' || selectedFilter === 'city') {
        // sort groups alphabetically by their groupName (city or resource type)
            return grouped.sort((a, b) => (a.groupName || '').toString().localeCompare((b.groupName || '').toString(), undefined, { sensitivity: 'base' }));
        }

        return grouped;
        // If alphabetical filter is active, also sort groups alphabetically by groupName
    }, [filteredFetchedResources, resourceTypeId, selectedFilter]);



    return (
        <div>
            {showBanner &&
                <Banner 
                    show={showBanner}
                    setShow={setShowBanner}
                />
            }

            {(loading || fetchLoading) &&
                <div className="text-center py-8">
                    {/* shimmer effect */}
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            }

            {isCityFlow && selectedCity && (
                <>

                    <div className="flex flex-col md:flex-row items-center md:justify-between mb-6">
                        <div className="flex items-center w-full  md:justify-none gap-2">
                            <button
                                className={`flex items-center text-nowrap font-medium gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${viewMode === "card" ? "bg-omblue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
                                onClick={() => setViewMode("card")}
                            >
                                <CardViewIcon viewMode={viewMode} />
                                Card View
                            </button>
                            <button
                                className={`flex items-center text-nowrap font-medium gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${viewMode === "list" ? "bg-omblue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
                                onClick={() => setViewMode("list")}
                            >
                                <ListViewIcon viewMode={viewMode} />
                                List View
                            </button>
                        </div>
                        <div className="flex items-center justify-end w-full  md:justify-none gap-4">
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                onClick={() => {
                                    // Share functionality
                                    const shareUrl = window.location.href;
                                    if (navigator.share) {
                                        navigator.share({
                                            title: selectedResourceType || selectedCity?.name || 'Resources',
                                            url: shareUrl,
                                        }).catch(() => { });
                                    } else {
                                        navigator.clipboard.writeText(shareUrl);
                                        toast.success('Link copied to clipboard.');
                                    }
                                }}
                            >
                                <Share2 size={16} /> Share
                            </button>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-omblue-600 text-white font-semibold hover:bg-omblue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleDownloadPDF}
                                disabled={downloadingPDF}
                            >
                                <ArrowDownToLine size={16} /> {downloadingPDF ? 'Downloading...' : 'Download PDF'}
                            </button>
                        </div>

                    </div>
                    {/* <div>
                        <h1 className="font-semibold text-3xl">{selectedCity?.name}</h1>
                    </div> */}
                </>
            )}

            {isCityFlow === false ? (
                <>
                    <div className="flex flex-col mt-4 md:flex-row items-center sm:justify-between gap-3 mb-6">
                        <div className="relative w-full md:w-1/3">
                            <input
                                type="search"
                                placeholder={`Search resources... `}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full border rounded-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                <SearchIcon />
                            </div>
                        </div>
                        {renderToggleSwitch(showOnlyBlackFocused, 'Only Show Black-Focused Resources', (val) => setShowOnlyBlackFocused(val))}
                        <div className="flex items-center justify-between w-full md:w-72 md:justify-none gap-4">

                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                onClick={() => {
                                    // Share functionality
                                    const shareUrl = window.location.href;
                                    if (navigator.share) {
                                        navigator.share({
                                            title: selectedResourceType || selectedCity?.name || 'Resources',
                                            url: shareUrl,
                                        }).catch(() => { });
                                    } else {
                                        navigator.clipboard.writeText(shareUrl);
                                        toast.success('Link copied to clipboard.');
                                    }
                                }}
                            >
                                <Share2 size={16} /> Share
                            </button>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-omblue-600 text-white font-semibold hover:bg-omblue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleDownloadPDF}
                                disabled={downloadingPDF}
                            >
                                <ArrowDownToLine size={16} /> {downloadingPDF ? 'Downloading...' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <div className="md:flex gap-4 hidden  mb-2">
                            {availableFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    className={`px-6 py-2 rounded-full border text-base font-medium transition
                                             ${selectedFilter === filter.value
                                            ? "bg-[#F5F8FF] border-[#B6C3E6] text-[#1A253C]"
                                            : "bg-white border-[#D1D5DB] text-[#374151] hover:bg-[#F5F8FF]"}
                                            `}
                                    onClick={() => setSelectedFilter(filter.value)}
                                >
                                    {filter.label}
                                </button>
                            ))}


                        </div>
                        <div className="flex items-center justify-between w-full md:w-1/5 md:justify-none gap-2 mb-6">

                            <button
                                className={`flex items-center text-nowrap font-medium gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${viewMode === "card" ? "bg-omblue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
                                onClick={() => setViewMode("card")}
                            >
                                <CardViewIcon viewMode={viewMode} />
                                Card View
                            </button>
                            <button
                                className={`flex items-center text-nowrap font-medium gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${viewMode === "list" ? "bg-omblue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
                                onClick={() => setViewMode("list")}
                            >
                                <ListViewIcon viewMode={viewMode} />
                                List View
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 md:hidden  mb-6">
                            {availableFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    className={`px-6 py-2 rounded-full border text-base font-medium transition
                                            ${selectedFilter === filter.value
                                            ? "bg-[#F5F8FF] border-[#B6C3E6] text-[#1A253C]"
                                            : "bg-white border-[#D1D5DB] text-[#374151] hover:bg-[#F5F8FF]"}
                                            `}
                                    onClick={() => setSelectedFilter(filter.value)}
                                >
                                    {filter.label}
                                </button>
                            ))}
                            {renderToggleSwitch(showOnlyBlackFocused, 'Black Owned Only', (val) => setShowOnlyBlackFocused(val))}


                        </div>
                    </div>
                </>
            ) : null}
            {viewMode === "card" ? (
                (isLocationAgnosticSort ? filteredFetchedResources.length === 0 : groupedFetchedResources.length === 0) ? (
                    <div className="py-4 text-gray-400 text-lg">
                        {(loading || fetchLoading) ? "Loading..." : "No resources found."}
                    </div>
                ) : (
                        <div>
                            {isLocationAgnosticSort ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredFetchedResources.map((res, rIdx) => {
                                        let amount = null;
                                        if (res.GrantDetails?.GrantAmount) {
                                            amount = res.GrantDetails.GrantAmount.toLocaleString();
                                        } else if (res.CompetitionDetails?.PrizeAmount) {
                                            amount = res.CompetitionDetails.PrizeAmount.toLocaleString();
                                        } else if (res.AcceleratorDetails?.InvestmentAmount) {
                                            amount = res.AcceleratorDetails.InvestmentAmount.toLocaleString();
                                        }

                                        return (
                                            <ResourceCard
                                                key={`${res?.id || res?.ResourceId || res?.Name || "resource"}-${rIdx}`}
                                                title={res.Name}
                                                org={res.Sponsor}
                                                location={`${res.Address}`.trim()}
                                                country={`${res.CityName}, ${res.CountryName}`}
                                                amount={amount}
                                                currency={res.CurrencySymbol}
                                                deadline={res.ApplicationDeadline}
                                                deadlineType={res.DeadlineType}
                                                description={res.Description || ""}
                                                isBlackFocused={res.isBlackFocused === true || res.isBlackFocused === 'Yes'}
                                                eventDate={res.CompetitionDetails?.CompetitionDate || null}
                                                eligibility={res.Eligibility || "Not specified"}
                                                locationScope={res.IsNationWide ? "Nationwide" : res.IsStateWide ? "Statewide" : "Specific"}
                                                isVirtual={res.IsLocationVirtual}
                                                debtAvailable={isDebtResource(res)}
                                                equityAvailable={isEquityResource(res)}
                                                onClick={() => {
                                                    setSelectedResource(res);
                                                    setModalOpen(true);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <>
                                        {/* City flow card view: show all groups expanded */}
                                        {isCityFlow && viewMode === "card" ? (
                                            <div className="space-y-8">
                                                {groupedFetchedResources.map((group, idx) => (
                                                    <div key={group.groupName}>
                                                        <div className="flex items-center gap-1 py-4">
                                                            <h3 className="font-semibold text-gray-800 text-2xl">
                                                                {(selectedFilter === 'city' || selectedFilter === 'school' || resourceTypeId) ? group.groupName : pluralizeResourceTypeName(group.groupName)}
                                                            </h3>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {group.resources.map((res, rIdx) => {
                                                                let amount = null;
                                                                if (res.GrantDetails?.GrantAmount) {
                                                                    amount = res.GrantDetails.GrantAmount.toLocaleString();
                                                                } else if (res.CompetitionDetails?.PrizeAmount) {
                                                                    amount = res.CompetitionDetails.PrizeAmount.toLocaleString();
                                                                } else if (res.AcceleratorDetails?.InvestmentAmount) {
                                                                    amount = res.AcceleratorDetails.InvestmentAmount.toLocaleString();
                                                                }

                                                                return (
                                                                    <ResourceCard
                                                                        key={`${group.groupName}-${rIdx}`}
                                                                        title={res.Name}
                                                                        org={res.Sponsor}
                                                                        location={`${res.Address}`.trim()}
                                                                        country={`${res.CityName}, ${res.CountryName}`}
                                                                        amount={amount}
                                                                        currency={res.CurrencySymbol}
                                                                        deadline={res.ApplicationDeadline}
                                                                        deadlineType={res.DeadlineType}
                                                                        description={res.Description || ""}
                                                                        isBlackFocused={res.isBlackFocused === true || res.isBlackFocused === 'Yes'}
                                                                        eventDate={res.CompetitionDetails?.CompetitionDate || null}
                                                                        eligibility={res.Eligibility || "Not specified"}
                                                                        locationScope={res.IsNationWide ? "Nationwide" : res.IsStateWide ? "Statewide" : "Specific"}
                                                                        isVirtual={res.IsLocationVirtual}
                                                                        debtAvailable={isDebtResource(res)}
                                                                        equityAvailable={isEquityResource(res)}
                                                                        onClick={() => {
                                                                            setSelectedResource(res);
                                                                            setModalOpen(true);
                                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                    {/* Show opened group first in single column */}
                                                    {openIdx !== null && groupedFetchedResources[openIdx] && (

                                                        <div className="">

                                                            <div key={groupedFetchedResources[openIdx].groupName}>
                                                                <button
                                                                    className="w-full text-left flex items-center gap-1 py-4 focus:outline-none"
                                                                    onClick={() => setOpenIdx(null)}
                                                                >
                                                                    <span className="transition-transform rotate-90">
                                                                        <ChevronRight size={20} />
                                                                    </span>
                                                                    <h3 className="font-semibold text-gray-800 text-2xl">
                                                                        {(selectedFilter === 'city' || selectedFilter === 'school' || resourceTypeId) ? groupedFetchedResources[openIdx].groupName : pluralizeResourceTypeName(groupedFetchedResources[openIdx].groupName)}
                                                                    </h3>
                                                                </button>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {groupedFetchedResources[openIdx].resources.map((res, rIdx) => {
                                                                        let amount = null;
                                                                        if (res.GrantDetails?.GrantAmount) {
                                                                            amount = res.GrantDetails.GrantAmount.toLocaleString();
                                                                        } else if (res.CompetitionDetails?.PrizeAmount) {
                                                                            amount = res.CompetitionDetails.PrizeAmount.toLocaleString();
                                                                        } else if (res.AcceleratorDetails?.InvestmentAmount) {
                                                                            amount = res.AcceleratorDetails.InvestmentAmount.toLocaleString();
                                                                        }

                                                                return (
                                                                    <ResourceCard
                                                                        key={`${groupedFetchedResources[openIdx].groupName}-${rIdx}`}
                                                                        title={res.Name}
                                                                        org={res.Sponsor}
                                                                        location={`${res.Address}`.trim()}
                                                                        country={`${res.CityName}, ${res.CountryName}`}
                                                                        amount={amount}
                                                                        currency={res.CurrencySymbol}
                                                                        deadline={res.ApplicationDeadline}
                                                                        deadlineType={res.DeadlineType}
                                                                        description={res.Description || ""}
                                                                        isBlackFocused={res.isBlackFocused === true || res.isBlackFocused === 'Yes'}
                                                                        eventDate={res.CompetitionDetails?.CompetitionDate || null}
                                                                        eligibility={res.Eligibility || "Not specified"}
                                                                        locationScope={res.IsNationWide ? "Nationwide" : res.IsStateWide ? "Statewide" : "Specific"}
                                                                        isVirtual={res.IsLocationVirtual}
                                                                        debtAvailable={isDebtResource(res)}
                                                                        equityAvailable={isEquityResource(res)}
                                                                        onClick={() => {
                                                                            setSelectedResource(res);
                                                                            setModalOpen(true);
                                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Show all other closed groups in 2-3 columns */}
                                                    <div className={` grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                                                        {groupedFetchedResources.map((group, idx) => (
                                                            openIdx === null || openIdx !== idx ? (
                                                                <div key={group.groupName} className={``}>
                                                                    <button
                                                                        className="w-full text-left flex items-center gap-1 py-4 focus:outline-none"
                                                                        onClick={() => setOpenIdx(idx)}
                                                                    >
                                                                        <span
                                                                            className={`transition-transform`}
                                                                        >
                                                                            <ChevronRight size={20} />
                                                                        </span>
                                                                        <h3 className="font-semibold text-gray-800 text-2xl">
                                                                            {(selectedFilter === 'city' || selectedFilter === 'school' || resourceTypeId) ? group.groupName : pluralizeResourceTypeName(group.groupName)}
                                                                        </h3>
                                                                    </button>
                                                                </div>
                                                            ) : null
                                                        ))}
                                                    </div>
                                            </>
                                        )}
                                </>
                            )}
                        </div>
                )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLocationAgnosticSort ? (
                            <div className="md:col-span-2 lg:col-span-3">
                                <ul className="space-y-2">
                                    {filteredFetchedResources.map((res, rIdx) => (
                                        <li key={`${res?.id || res?.ResourceId || res?.Name || "resource"}-${rIdx}`}>
                                            <div className="flex items-center text-left gap-2 min-w-0">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedResource(res);
                                                        setModalOpen(true);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="text-[#4B5563] text-lg underline underline-offset-2 hover:text-[#357CF6] transition truncate whitespace-nowrap max-w-full text-left"
                                                    title={res.Name}
                                                >
                                                    {res.Name}

                                                </button>
                                                {isCityFlow ? (
                                                    <span>({res.CityName || "Virtual"})</span>
                                                ) : null}
                                                {res.isBlackFocused && (
                                                    <span className="inline-flex items-center ml-2 w-4 h-4 relative group flex-shrink-0" aria-hidden={false}>
                                                        <Image
                                                            src={`${staticUrl}/resources/black-focused.svg`}
                                                            alt="Black Focused"
                                                            title="A resource for Black people"
                                                            width={16}
                                                            height={16}
                                                            className="object-contain"
                                                        />

                                                        {/* Visible tooltip on hover + accessible text for screen readers */}
                                                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-omblue-900 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                            A resource for Black people
                                                        </span>
                                                        <span className="sr-only">A resource for Black people</span>
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            groupedFetchedResources.map((group, gIdx) => (
                                <div key={group.groupName}>
                                    <h3 className="font-medium text-4xl mb-4 text-[#1A253C]">
                                        {(selectedFilter === 'city' || selectedFilter === 'school' || resourceTypeId) ? group.groupName : pluralizeResourceTypeName(group.groupName)}
                                </h3>
                                <ul className="space-y-2">
                                    {group.resources.map((res, rIdx) => (
                                        <li key={rIdx}>
                                            <div className="flex items-center text-left gap-2 min-w-0">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedResource(res);
                                                        setModalOpen(true);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="text-[#4B5563] text-lg underline underline-offset-2 hover:text-[#357CF6] transition truncate whitespace-nowrap max-w-full text-left"
                                                    title={res.Name}
                                                >
                                                    {res.Name}

                                                </button>
                                                {isCityFlow ? (
                                                    <span>({res.CityName || "Virtual"})</span>
                                                ) : null}
                                                {res.isBlackFocused && (
                                                    <span className="inline-flex items-center ml-2 w-4 h-4 relative group flex-shrink-0" aria-hidden={false}>
                                                        <Image
                                                            src={`${staticUrl}/resources/black-focused.svg`}
                                                            alt="Black Focused"
                                                            title="A resource for Black people"
                                                            width={16}
                                                            height={16}
                                                            className="object-contain"
                                                        />

                                                        {/* Visible tooltip on hover + accessible text for screen readers */}
                                                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-omblue-900 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                            A resource for Black people
                                                        </span>
                                                        <span className="sr-only">A resource for Black people</span>
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                        )}
                </div>
            )}

            {fetchLoading && activeResources.length > 0 && renderCardShimmer()}

            <ResourceModal
                open={modalOpen}
                resource={selectedResource}
                setBanner={setShowBanner}
                onClose={() => setModalOpen(false)}
            />

            {/* Infinite scroll trigger */}
            {hasMore && fetchedResources.length > 0 && (
                <div className="flex justify-center mt-8 mb-8">
                    <div ref={loadMoreRef} className="h-1 w-full" />
                </div>
            )}
        </div>
    );
};

export default ResourceGridSection;
