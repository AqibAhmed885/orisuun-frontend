"use client";

import React, { useMemo, useState, useCallback, lazy, Suspense, memo, useEffect } from "react";
import SearchIcon from "@/icons/search-icon";
import Image from "next/image";
import CardViewIcon from "@/icons/card-view";
import ListViewIcon from "@/icons/list-view";
import Dropdown from "@/components/ui/dropdown";
import AddResource from "../add-resource";
import { getCitiesWithResourceCounts, searchResources } from '@/app/api/marketing/resources';
import ResourceCard from '../resourceCard';
import { toast } from "react-toastify";
import { downloadResourcesPDF } from '@/utils/pdfGenerator';
import { pluralizeResourceTypeName } from '@/utils/resourceType';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

// Lazy load heavy components
const ResourceTypes = lazy(() => import("./resource-types"));
const TabCity = lazy(() => import("./tab-city"));
const RecentResourceTab = lazy(() => import("./recent-resource"));
const DeadlineTab = lazy(() => import("./deadline"));
const ResourceModal = lazy(() => import("../ResourceModal"));
const AddResourceForm = lazy(() => import("../resource-form"));
const PDFDateRangeModal = lazy(() => import("../PDFDateRangeModal"));

// Tab content loader
const TabLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
    ))}
  </div>
);

const TABS = ["Resource Type", "City", "Recently Added", "Deadline"];

function TabSection({ setContinentId, onContinentSelect, onResourceTypeSelect }) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [query, setQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = query.trim();

      // Reset search if query is empty
      if (!q) {
        setCitySuggestions([]);
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      // City tab - show city suggestions
      if (activeTab === 'City') {
        setCitiesLoading(true);
        try {
          const cities = await getCitiesWithResourceCounts();
          const filtered = cities
            .map((c) => c.name)
            .filter((n) => n.toLowerCase().includes(q.toLowerCase()));
          setCitySuggestions(filtered.slice(0, 8));
        } catch (e) {
          console.error(e);
          setCitySuggestions([]);
        } finally {
          setCitiesLoading(false);
        }
        return;
      }

      // Other tabs - perform resource search
      setSearchLoading(true);
      setIsSearching(true);
      try {
        const results = await searchResources(q, 1, 50);
        setSearchResults(results);
      } catch (e) {
        console.error(e);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [selectedType, setSelectedType] = useState<string | number | null>(null);
  const [resourceTypeId, setResourceTypeId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Memoize handlers
  const handleSelect = useCallback((type: string, id: number) => {
    if (onResourceTypeSelect) onResourceTypeSelect(type, id);
    setSelectedType(type);
    setResourceTypeId(id);
  }, [onResourceTypeSelect]);

  const handleDownloadSearchPDF = useCallback(() => {
    setShowDateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setResourceModalOpen(false);
  }, []);

  const handleOpenResourceModal = useCallback((resource: any) => {
    setSelectedResource(resource);
    setResourceModalOpen(true);
  }, []);

  const handlePDFGeneration = useCallback(async (startDate: Date, endDate: Date) => {
    setDownloadingPDF(true);
    try {
      // Filter search results by date range
      const filteredByDate = searchResults.filter((res: any) => {
        if (!res.CreatedDate && !res.ApplicationDeadline) return true;
        const resourceDate = new Date(res.CreatedDate || res.ApplicationDeadline);
        return resourceDate >= startDate && resourceDate <= endDate;
      });

      const filename = `Search-${query.trim().replace(/\s+/g, '-')}-${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/,/g, '').replace(/\s+/g, '-')}.pdf`;
      const title = `Search Results: "${query.trim()}"`;

      await downloadResourcesPDF(filteredByDate, filename, title, startDate, endDate);

      toast.success('Your search results have been downloaded successfully.');
      setShowDateModal(false);
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('Failed to download PDF. Please try again.'); 
    } finally {
      setDownloadingPDF(false);
    }
  }, [searchResults, query]);


  return (
    <section className="py-8 md:py-12 ">
      <div className="px-4 md:px-2 lg:px-0">
        {/* Controls */}
        <div className="flex md:flex-col justify-between gap-4 mb-2">
          <span className="text-sm font-semibold text-gray-500 md:-mb-8 uppercase">Explore by</span>
          <div className="flex items-center mt-4 justify-between">
            <div className="flex gap-3 flex-wrap">
              <div className="hidden md:flex gap-3">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTab(t);
                      setQuery("");
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${activeTab === t ? "bg-[#2357C6] text-white" : "bg-white border border-gray-200 text-gray-700"
                      }`}
                    aria-pressed={activeTab === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* Dropdown for small screens */}
              <div className="block md:hidden w-full">
                <Dropdown
                  items={TABS}
                  selected={activeTab}
                  onSelect={(tab) => {
                    setActiveTab(tab);
                    setQuery("");
                  }}
                  renderItem={(tab) => <span>{tab}</span>}
                  placeholder="Select Tab"
                  className="w-full"
                  wrapperClass="bg-white  py-1.5 rounded-full w-40"
                  border={true}
                />
              </div>
            </div>

            <div className={`w-full  ${activeTab === "Recently Added" || activeTab === "Deadline" ? "md:w-1/2" : "md:w-1/3"}  items-center gap-2 hidden md:flex`}>
              <Image
                src={`${staticUrl}/resources/tree-icon.svg`}
                alt="info"
                width={48}
                height={48}
                className=" h-16 mb-8 mr-4 "                 
              />
              {/* View mode controls for Recently Added and Deadline tabs */}
              {(activeTab === "Recently Added" || activeTab === "Deadline") && (
                <div className="flex items-center gap-3 justify-end ">
                  <button
                    className={`px-4 py-1.5 rounded-full text-nowrap text-sm font-semibold flex items-center gap-2 transition ${viewMode === "card" ? "bg-[#2357C6] text-white" : "bg-white border border-gray-200 text-gray-700"
                      }`}
                    onClick={() => setViewMode("card")}
                  >
                    <CardViewIcon viewMode={viewMode} />
                    Card View
                  </button>
                  <button
                    className={`px-4 py-1.5 rounded-full text-nowrap text-sm font-semibold flex items-center  gap-2 transition ${viewMode === "list" ? "bg-[#2357C6] text-white" : "bg-white border border-gray-200 text-gray-700"
                      }`}
                    onClick={() => setViewMode("list")}
                  >
                    <ListViewIcon viewMode={viewMode} />
                    List View
                  </button>
                </div>
              )}

              <div className="relative w-full hidden md:block">
                <input
                  type="search"
                  placeholder={`search by resource, city, date…`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                /> 
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  <SearchIcon />
                </div>
                {/* City suggestions */}
                {activeTab === 'City' && query.trim().length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white border rounded-md shadow-md">
                    {citiesLoading ? (
                      <div className="p-2 text-sm text-gray-500">Loading cities…</div>
                    ) : citySuggestions.length > 0 ? (
                      citySuggestions.map((c) => (
                        <button
                          key={c}
                          onClick={() => setQuery(c)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {c}
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No cities found</div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Tab Content */}
        {isSearching && query.trim() ? (
          <div className="mt-6">
            {searchLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ) : !Array.isArray(searchResults) || searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-lg">
                No resources found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <>
                {/* Download PDF button for search results */}
                {/* <div className="flex justify-end mb-4">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-omblue-600 text-white font-semibold hover:bg-omblue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDownloadSearchPDF}
                    disabled={downloadingPDF}
                  >
                    <ArrowDownToLine size={16} /> {downloadingPDF ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div> */}
                    {/* Respect selected view mode: list or card */}
                    {viewMode === 'list' ? (
                      // List view: group by ResourceTypeName and render titles
                      (() => {
                        const grouped = (Array.isArray(searchResults) ? searchResults : []).reduce((acc: any, res: any) => {
                          const rawType = res.ResourceTypeName || res.type || 'General';
                          const type = pluralizeResourceTypeName(rawType);
                          const cityLabel = res.CountryName ? (res.CityName || res.CountryName.split(',')[0]) : 'Virtual';
                          acc[type].push({ title: res.Name, city: cityLabel, resource: res });
                          return acc;
                        }, {} as Record<string, { title: string; city: string; resource: any }[]>);

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Object.entries(grouped).map(([type, items]: [string, { title: string; city: string; resource: any }[]]) => (
                              <div key={type}>
                                <h3 className="font-bold text-2xl mb-2 text-[#1A253C]">{type}</h3>
                                <ul className="space-y-1">
                                  {items.map((item, idx) => (
                                    <li key={idx} className="text-[#4B5563] text-base">
                                      <span
                                        className="border-b border-[#4B5563] cursor-pointer hover:text-[#357CF6]"
                                        onClick={() => handleOpenResourceModal(item.resource)}
                                      >
                                        {item.title}
                                      </span>
                                      {item.city && (
                                        <span className="text-gray-500 ml-2">
                                          ({item.city})
                                          {item.resource?.isBlackFocused && (
                                            <span className="inline-block align-middle ml-2 relative group" aria-hidden={false}>
                                              <Image
                                                src={`${staticUrl}/resources/black-focused.svg`}
                                                alt="Black Focused"
                                                title="A resource for Black people"
                                                width={20}
                                                height={20}
                                                loading="lazy"
                                              />
                                              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-omblue-900 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">A resource for Black people</span>
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Array.isArray(searchResults) && searchResults.map((resource, idx) => {
                    let amount = undefined;
                    let currency = 'USD';
                    if (resource.GrantDetails?.GrantAmount) {
                      amount = resource.GrantDetails.GrantAmount.toLocaleString();
                      currency = resource.GrantDetails.GrantCurrency || 'USD';
                    } else if (resource.CompetitionDetails?.PrizeAmount) {
                      amount = resource.CompetitionDetails.PrizeAmount.toLocaleString();
                      currency = resource.CompetitionDetails.PrizeCurrency || 'USD';
                    } else if (resource.AcceleratorDetails?.InvestmentAmount) {
                      amount = resource.AcceleratorDetails.InvestmentAmount.toLocaleString();
                      currency = resource.AcceleratorDetails.InvestmentCurrency || 'USD';
                    }
                    
                      return (
                      <ResourceCard
                        key={idx}
                        title={resource.Name || "Untitled"}
                        org={resource.Sponsor || "Unknown"}
                        location={resource.Address || ""}
                        country={`${resource.CityName || ""}, ${resource.CountryName || ""}`}
                        deadline={resource.ApplicationDeadline || "N/A"}
                        deadlineType={resource.DeadlineType}
                        description={resource.Description || ""}
                        isBlackFocused={resource.isBlackFocused === true || resource.IsBlackFocused === true || resource.IsBlackFocused === 'Yes'}
                        eventDate={resource.CompetitionDetails?.CompetitionDate || null}
                        eligibility={resource.Eligibility || "Not specified"}
                        amount={amount}
                        currency={currency}
                        locationScope={resource.IsNationWide ? "Nationwide" : resource.IsStateWide ? "Statewide" : "Specific"}
                        isVirtual={resource.IsLocationVirtual}
                          onClick={() => handleOpenResourceModal(resource)}
                      />
                    );
                    })}
                        </div>
                    )}
              </>
            )}
          </div>
        ) : (
            <Suspense fallback={<TabLoader />}>
              {activeTab === "Resource Type" && (
                <div className="">
                  <ResourceTypes
                    onResourceTypeSelect={handleSelect}
                    selectedType={selectedType}
                    resources={[]}
                    onBack={() => { }}
                  />
                </div>
              )}

              {activeTab === "City" && (
                <TabCity onContinentSelect={onContinentSelect} setContinentId={setContinentId} />
              )}

              {activeTab === "Recently Added" && (
                <RecentResourceTab viewMode={viewMode} />
              )}

              {activeTab === "Deadline" && (
                <DeadlineTab viewMode={viewMode} />
              )}
            </Suspense>
        )}
        
      </div>
      <div className="w-full md:hidden flex justify-center">
        <AddResource onClick={() => setOpenModal(true)} />
      </div>
      {openModal && (
        <Suspense fallback={null}>
          <AddResourceForm showModal={openModal} setShowModal={setOpenModal} />
        </Suspense>
      )}
      {resourceModalOpen && (
        <Suspense fallback={null}>
          <ResourceModal
            open={resourceModalOpen}
            resource={selectedResource}
            setBanner={setShowBanner}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}
      {showDateModal && (
        <Suspense fallback={null}>
          <PDFDateRangeModal
            isOpen={showDateModal}
            onClose={() => setShowDateModal(false)}
            onDownload={handlePDFGeneration}
            downloading={downloadingPDF}
          />
        </Suspense>
      )}
    </section>
  );
}

export default memo(TabSection);