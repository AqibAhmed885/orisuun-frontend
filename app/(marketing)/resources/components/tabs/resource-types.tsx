"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { leaderboard } from "@/app/api/dashboard/leaderboard";
import ResourceGridSection from "../ResourceGridSection";
import { ChevronRight } from "lucide-react";
import { getAllResources, getResourceTypes } from "@/app/api/marketing/resources";
import { toSlug } from "../../utils/slug-utils";
import { ResourceLoader } from "../resourceLoader";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type ResourceType = {
  id: number;
  title: string;
  count?: number;
  countries?: string[];
  featured?: boolean;
};

const RESOURCE_TYPES: ResourceType[] = [
  { id: 1, title: "Competitions" },
  { id: 2, title: "Accelerators" },
  { id: 3, title: "Grants" },
  { id: 5, title: "School Programs" },
  { id: 0, title: "Explore resources by city", featured: true, countries: [] },
  { id: 7, title: "NGO Programs" },
  { id: 4, title: "Government Programs" },
  { id: 8, title: "Specialty Financing" },
];

interface ResourceTypesProps {
  onResourceTypeSelect?: (type: string, id: number | null) => void;
  resources?: any;
  selectedType?: number | string;
  onBack?: () => void;
  countryId?: number | null;
}

export default function ResourceTypes({
  onResourceTypeSelect,
  selectedType,
  onBack,
  countryId = null,
}: ResourceTypesProps) {
  const router = useRouter();
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>(RESOURCE_TYPES);
  const [flagUrls, setFlagUrls] = useState<Record<string, string>>({});
  const [resourceTypeId, setResourceTypeId] = useState<number | null>(null);
  const [fetchedResources, setFetchedResources] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [totalCitiesResources, setTotalCitiesResources] = useState<number>(0);
  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(50);

  // Helper: randomly sample up to n items from an array
  const getRandomSample = (arr: string[] = [], n = 4) => {
    const items = (arr || []).filter(Boolean);
    if (items.length <= n) return items;
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  };


  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const apiTypes = await getResourceTypes();

        // Calculate total cities resources
        const totalCities = apiTypes[0].TotalCitiesResources ;
        setTotalCitiesResources(totalCities);

        // Update the hardcoded types with API data
        const updatedTypes = RESOURCE_TYPES.map(type => {
          if (type.id === 0) return type; // Keep explore as is
          const apiType = apiTypes.find(at => at.id === type.id);
          if (apiType) {
            // If a countryId is provided, compute the count specific to that country
            const countryCount = countryId
              ? apiType.CountryBreakdown?.find((c: any) => c.CountryId === countryId)?.ResourceCount || 0
              : apiType.TotalResourceCount || 0;

            return {
              ...type,
              count: countryCount,
              totalCitiesResources: apiType.TotalCitiesResources || 0,
              countries: getRandomSample(apiType.CountryBreakdown?.map((c: any) => c.CountryName) || [], 4)
            };
          }
          return type;
        });

        setResourceTypes(updatedTypes);
      } catch (error) {
        console.error("Failed to fetch resource types:", error);
      } finally {
        setTypesLoading(false);
      }
    };

    fetchTypes();
  }, [countryId]);

  useEffect(() => {
    const fetchFlags = async () => {
      const allCountries = resourceTypes.flatMap(rt => rt.countries || []);
      const uniqueCountries = [...new Set(allCountries)];
      const flagPromises = uniqueCountries.map(async (country) => {
        const url = await leaderboard.fetchCountryFlag(country);
        return { country, url };
      });

      const results = await Promise.all(flagPromises);
      const flagMap = results.reduce((acc, { country, url }) => {
        if (url) acc[country] = url;
        return acc;
      }, {} as Record<string, string>);

      setFlagUrls(flagMap);
    };

    if (resourceTypes.length > 0) {
      fetchFlags();
    }
  }, [resourceTypes]);

  useEffect(() => {
    if (selectedType && typeof selectedType === 'string') {

      // Find the resource type ID from the title
      const resourceType = RESOURCE_TYPES.find(rt => rt.title === selectedType);

      if (resourceType && resourceType.id !== 0) {
        setLoading(true);

        getAllResources({
          resourceTypeId: resourceType.id,
          countryId: countryId ?? undefined,
          includeExpired: true,
          page: page,
          pageSize: pageSize,
        })
          .then((res) => {
            const normalized = res || [];
            setFetchedResources(normalized);
            setResourceTypeId(resourceType.id);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    }
  }, [selectedType, countryId]);

  // 🔹 Handle when a resource type is clicked
  const handleResourceClick = async (resource: ResourceType) => {
    // Navigate via URL for proper deep linking support
    const typeSlug = resource.id === 0 ? 'explore-by-city' : toSlug(resource.title);
    router.push(`/resources/${typeSlug}`);

    // Also handle internal state for backward compatibility
    setLoading(true);

    try {
      const res = await getAllResources({
        resourceTypeId: resource.id,
        countryId: countryId ?? undefined,
        includeExpired: false,
        page: page,
        pageSize: pageSize,
      });
      // Extract the Resources array from the response object
      const normalized = res;

      setFetchedResources(normalized);
      setResourceTypeId(resource.id);

      // Notify parent
      if (onResourceTypeSelect) {
        onResourceTypeSelect(resource.title, resource.id);
      }

    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Back (returns to tabs)
  const handleBack = () => {
    // Navigate back to base resources page
    router.push('/resources');

    setFetchedResources(null);
    setResourceTypeId(null);
    if (onBack) onBack();
  };


  return (
    <>
      {/* 🔸 When a type is selected — show its resources */}
      {selectedType && (
        <div className="px-4">
          <h2 className="text-base space-x-1.5 text-gray-500 font-medium mb-4 flex items-center">
            <span
              className="cursor-pointer hover:text-gray-800 transition"
              onClick={handleBack}
            >
              Resource Types
            </span>
            <ChevronRight size={18} />
            <span className="text-gray-800">
              {selectedType}
            </span>
          </h2>

          {loading ? (
            <ResourceLoader/>
          ) : fetchedResources && Array.isArray(fetchedResources) && fetchedResources.length > 0 ? (
              
            <ResourceGridSection
              selectedCity={null}
              selectedResourceType={selectedType}
              resources={fetchedResources}
              resourceTypeId={resourceTypeId}
              loading={loading}
              onBack={handleBack}
                countryId={countryId}
                cityId={null}
                page={page}
                pageSize={pageSize}
            />
          ) : (
            <div className="text-center text-gray-400 py-12">
              No data found for {selectedType}.
            </div>
          )}
        </div>
      )}

      {/* 🔸 Default grid of all resource types */}
      {!selectedType && (
        <div className="">
          {typesLoading ? (
            <>
              {/* add shimmer effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-4 h-64 shadow animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {resourceTypes.slice(0, 6).map((resource, idx) => {
                  const isFeatured = resource.featured;

                  return (
                    <div
                      key={resource.id}
                      className="relative flex flex-col justify-between cursor-pointer min-h-[280px] sm:min-h-[220px] lg:min-h-[300px]"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleResourceClick(resource)}
                    >
                      {idx !== 4 && <hr className="pb-2 mx-2" />}

                      {!isFeatured ? (
                        <div className={`flex flex-col h-full justify-between border-l p-6 mb-2 border-r `}>
                          <h3 className="font-semibold text-[#052A64] text-2xl mb-0">{resource.title}</h3>
                          <div className="flex items-end justify-between ml-6 mt-auto">
                            <div className="flex items-center gap-1">
                              {resource.countries?.slice(0, 4).map((country, i) =>
                                flagUrls[country] ? (
                                  <div key={i} className={`relative group w-8 ${i === 0 ? '' : '-ml-4'} `} style={{ zIndex: i }} >
                                    <Image
                                      src={flagUrls[country]}
                                      alt={`${country} flag`}
                                      width={80}
                                      height={80}
                                      className={`rounded-full opacity-90 object-cover  z-20 w-8 h-8 `}
                                      loading="lazy"
                                      priority={false}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute left-0 top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                                      {country}
                                    </div>
                                  </div>
                                ) : (
                                  <div key={i} className="w-8 h-8 -ml-4 bg-gray-200 rounded-full animate-pulse" />
                                )
                              )}
                            </div>
                            <div className="text-xs text-gray-400">{resource.count || 0} resources</div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-r p-6 from-[#2458C7] via-[#5FAFDD] to-[#5FAFDD]">
                              <div className="absolute inset-0 z-10 rounded-full opacity-80"  >
                                <Image src={`${staticUrl}/resources/ellipse1.svg`} alt="Background Image" layout="fill" objectFit="cover" className="-ml-12 w-36 h-36 " />
                                <Image src={`${staticUrl}/resources/ellipse2.svg`} alt="Background Image" layout="fill" objectFit="cover" className="ml-12" />
                              </div>

                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="absolute top-1/3 right-24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 0L9.52568 5.47432L15 7.5L9.52568 9.52568L7.5 15L5.47432 9.52568L0 7.5L5.47432 5.47432L7.5 0Z" fill="#A0BCF9" />
                              </svg>

                              <svg width="15" height="15" className="absolute top-1/3 mt-4 ml-8 left-1/3" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 0L9.52568 5.47432L15 7.5L9.52568 9.52568L7.5 15L5.47432 9.52568L0 7.5L5.47432 5.47432L7.5 0Z" fill="#ABEFC6" />
                              </svg>

                              <svg width="15" height="15" className="absolute top-1/3 mt-2 left-12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 0L9.52568 5.47432L15 7.5L9.52568 9.52568L7.5 15L5.47432 9.52568L0 7.5L5.47432 5.47432L7.5 0Z" fill="#ABEFC6" />
                              </svg>

                              <svg width="15" height="15" className="absolute bottom-1/4 mt-2 left-1/3" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 0L9.52568 5.47432L15 7.5L9.52568 9.52568L7.5 15L5.47432 9.52568L0 7.5L5.47432 5.47432L7.5 0Z" fill="#ABEFC6" />
                              </svg>


                              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="absolute right-1/3 bottom-12" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 0L5.71541 3.28459L9 4.5L5.71541 5.71541L4.5 9L3.28459 5.71541L0 4.5L3.28459 3.28459L4.5 0Z" fill="#ABEFC6" />
                              </svg>

                              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="absolute right-1/4 bottom-1/2" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 0L5.71541 3.28459L9 4.5L5.71541 5.71541L4.5 9L3.28459 5.71541L0 4.5L3.28459 3.28459L4.5 0Z" fill="#ABEFC6" />
                              </svg>

                              <svg width="329" height="151" viewBox="0 0 329 151" fill="none" className="absolute bottom-0 left-0" xmlns="http://www.w3.org/2000/svg">
                                <g filter="url(#filter0_i_4235_7907)">
                                  <path d="M326.655 146.423C354.677 251.221 122.938 146.423 92.8803 146.423C62.8222 146.423 -26.476 223.701 -21.0337 118.876C-21.0337 82.6922 -45.6889 9.63772 47.1632 0.977261C163.947 -9.91535 138.138 73.6899 212.488 80.8853C263.911 85.8619 317.083 131.06 326.655 146.423Z" fill="#3E77CF" fill-opacity="0.18" />
                                </g>
                                <defs>
                                  <filter id="filter0_i_4235_7907" x="-24" y="0" width="353" height="197" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="4" />
                                    <feGaussianBlur stdDeviation="15" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.495686 0 0 0 0 0.614436 0 0 0 0 0.86792 0 0 0 1 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_4235_7907" />
                                  </filter>
                                </defs>
                              </svg>

                            <div className="absolute w-full h-full z-40">
                              <div className="text-white text-4xl font-medium z-50 mb-2">Explore <br />resources by city</div>
                              <div
                                className="bg-white/5 w-24 h-24 rounded-lg px-6 py-3 flex flex-col items-center justify-center absolute right-10 bottom-10 text-base text-white font-medium"
                                style={{
                                  boxShadow: `
                               0px 3.41px 9.09px 3.41px #3535350D,
                               0px 2.27px 11.36px 5.68px #3535350D inset,
                               0px 0px 15.91px 0px #FFFFFF0D inset,
                               1.14px 3.41px 5.68px 0px #FFFFFF59 inset,
                               0px -3.41px 3.41px 0px #FFFFFF0D inset
                              `
                                }}
                              >
                                  <span className="text-4xl">{totalCitiesResources}</span>
                                Cities
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {resourceTypes.slice(6).map((resource, idx) => (
                  <div
                    key={resource.id}
                    className={`relative  bg-white flex flex-col justify-between cursor-pointer border-gray-200 min-h-[280px] sm:min-h-[220px]  lg:min-h-[300px] `}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleResourceClick(resource)}
                  >
                    <hr className="pb-2 mx-2" />
                    <div className={`flex flex-col h-full justify-between p-6 mb-2 border-r ${idx === 0 ? 'border-l' : ''  }`}>
                      <h3 className="font-semibold text-[#052A64] text-2xl mb-0">{resource.title}</h3>
                      <div className="flex items-end justify-between ml-6 mt-auto">
                        <div className="flex items-center  gap-1">
                          {resource.countries?.slice(0, 4).map((country, i) =>
                            flagUrls[country] ? (
                              <div key={i} className={`relative group w-8 ${i === 0 ? '' : '-ml-4'} `} style={{ zIndex: i }} >
                                <Image
                                  src={flagUrls[country]}
                                  alt={`${country} flag`}
                                  width={80}
                                  height={80}
                                  className={`rounded-full opacity-90 object-cover  z-20 w-8 h-8 `}
                                  loading="lazy"
                                  priority={false}
                                />
                                {/* Tooltip */}
                                <div className="absolute left-0 top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                                  {country}
                                </div>
                              </div>
                            ) : (
                              <div key={i} className="w-8 h-8 -ml-4 bg-gray-200 rounded-full animate-pulse" />
                            )
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{resource.count || 0} resources</div>
                      </div>
                    </div>
                    <hr className="pb-2 mx-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
