import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import CountryCard from "./CountryCard";
import SearchIcon from "@/icons/search-icon";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getAllResources, getCitiesWithResourceCounts } from "@/app/api/marketing/resources";
import ResourceGridSection from "./ResourceGridSection";
import { toSlug } from "../utils/slug-utils";

const CitySkeleton = () => (
  <div className="bg-white py-2 flex flex-col justify-between">
    <hr className="pb-2 mx-2" />
    <div className="border-r space-y-5 p-6 flex flex-col justify-between h-full">
      <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
      </div>
    </div>
  </div>
);

const CitiesSection = ({ onBack = () => { }, countryId, stateId = null, countryName = null, onCitySelect = null, isExploreCities = false, regionSlug = null, countrySlug = null, stateSlug = null }) => {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [showAllCountryResources, setShowAllCountryResources] = useState(false);
  const [showAllBlackFocused, setShowAllBlackFocused] = useState(false);
  const [blackResources, setBlackResources] = useState<any[]>([]);
  const [loadingBlackResources, setLoadingBlackResources] = useState(false);
  const [countryResources, setCountryResources] = useState<any[]>([]);
  const [loadingCountryResources, setLoadingCountryResources] = useState(false);
  const [cityId, setCityId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCitiesWithResourceCounts(countryId || undefined, stateId || undefined)
      .then((data) => {
        const processed = (data || [])
          .map((c) => ({
            name: c.name,
            id: c.id,
            resources: c.resourceCount
          }))
          .filter((c) => c.resources > 0)
          .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));

        setCities(processed);

        if ((processed?.length || 0) === 0 && countryId) {
          setShowAllCountryResources(true);
        }

      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [countryId, stateId]);

  const filteredCities = cities.filter((city) => {
    const lowerQuery = query.toLowerCase();
    return city.name.toLowerCase().includes(lowerQuery) ||
      city.id.toString().toLowerCase().includes(lowerQuery);
  });

  // Fetch resources when a city is selected
  useEffect(() => {
    if (!selectedCity) return;

    setLoadingResources(true);


    getAllResources({ cityId, includeExpired: true })
      .then((cityRes) => {
        // Show only city-specific resources, not nationwide or statewide
        setResources(cityRes || []);
      })
      .catch(() => { })
      .finally(() => setLoadingResources(false));
  }, [selectedCity, cityId, countryId, stateId]);

  // Fetch all country resources when toggled on
  useEffect(() => {
    if (!showAllCountryResources || !countryId) {
      setCountryResources([]);
      return;
    }

    setLoadingCountryResources(true);
    getAllResources({ countryId, includeExpired: true, page: 1, pageSize: 100 })
      .then((res) => setCountryResources(res || []))
      .catch(() => { })
      .finally(() => setLoadingCountryResources(false));
  }, [showAllCountryResources, countryId]);

  // Fetch black-focused resources for the country when toggled on
  useEffect(() => {
    if (!showAllBlackFocused || !countryId) {
      setBlackResources([]);
      return;
    }

    setLoadingBlackResources(true);
    getAllResources({ countryId, includeExpired: true, page: 1, pageSize: 100 })
      .then((res) => {
        const filtered = (res || []).filter((r: any) => r.isBlackFocused === true || r.IsBlackFocused === true || r.IsBlackFocused === 'Yes');
        setBlackResources(filtered);
      })
      .catch(() => { })
      .finally(() => setLoadingBlackResources(false));
  }, [showAllBlackFocused, countryId]);

  const handleCitySelect = (city) => {
    // Navigate via URL for proper deep linking support
    if (regionSlug && countrySlug) {
      const citySlug = toSlug(city.name);
      if (stateSlug) {
        router.push(`/resources/${regionSlug}/${countrySlug}/${stateSlug}/${citySlug}`);
      } else {
        router.push(`/resources/${regionSlug}/${countrySlug}/${citySlug}`);
      }
    }

    setSelectedCity(city);
    setCityId(city.id);
    if (onCitySelect) {
      onCitySelect(city.name);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // if (selectedCity) {
  //   return (
  //     <div>
  //       {loadingResources ? (
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //           {Array.from({ length: 6 }).map((_, idx) => (
  //             <div key={idx} className="border rounded-lg p-4 shadow animate-pulse">
  //               <div className="h-6 bg-gray-200 rounded mb-4"></div>
  //               <div className="h-4 bg-gray-200 rounded mb-2"></div>
  //               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  //             </div>
  //           ))}
  //         </div>
  //       ) : resources.length === 0 ? (
  //         <p className="text-gray-400">No resources available for this city.</p>
  //       ) : (
  //             <ResourceGridSection
  //               resources={resources}
  //               selectedCity={selectedCity}
  //               showAllCountryResources={showAllCountryResources}
  //               showAllBlackFocused={showAllBlackFocused}
  //               onBack={() => setSelectedCity(null)}
  //               isCityFlow={true}
  //             />
  //       )}
  //     </div>
  //   );
  // }

  // Render toggle labels
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

  return (
    <div>
      {/* Breadcrumbs for Explore -> Explore resources by city */}
      {isExploreCities && (
        <div className="text-gray-500 flex space-x-1.5 items-center text-base font-medium mb-4">
          <span
            className="cursor-pointer hover:text-gray-800 transition"
            onClick={onBack}
          >
            Resource Types
          </span>
          <ChevronRight size={18} />
          <span className="text-gray-800" onClick={() => setSelectedCity(null)}>Explore resources by city</span>
          {selectedCity && (
            <>
              <ChevronRight size={18} />
              <h1 className="text-gray-800">{selectedCity?.name}</h1>
            </>
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="relative w-full md:w-1/2 mt-4 mb-4">
          <input
            type="search"
            placeholder="Search cities... >>>"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            <SearchIcon />
          </div>
        </div>
        {countryId && (
          <div className="flex items-center gap-4 mt-4 mb-4">
            {renderToggleSwitch(showAllBlackFocused, 'Show Black-Focused Resources', setShowAllBlackFocused)}
            {renderToggleSwitch(showAllCountryResources, `See all resources in ${countryName}`, setShowAllCountryResources)}
          </div>
        )}


      </div>

      {selectedCity && !showAllBlackFocused && !showAllCountryResources && (
        <>
          <div>
            {loadingResources ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-4 shadow animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <p className="text-gray-400">No resources available for this city.</p>
            ) : (
              <ResourceGridSection
                resources={resources}
                selectedCity={selectedCity}
                    cityId={cityId}
                    stateId={stateId}
                    countryId={countryId}
                showAllCountryResources={showAllCountryResources}
                showAllBlackFocused={showAllBlackFocused}
                onBack={() => setSelectedCity(null)}
                isCityFlow={true}
                searchQuery={query}
              />
            )}
          </div>
        </>
      )}

      {/* Show all country resources */}
        <>
          {/* Show black-focused resources */}
          {showAllBlackFocused && countryId && (
            <div>
              {loadingBlackResources ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <CitySkeleton key={idx} />
                  ))}
                </div>
              ) : blackResources.length === 0 ? (
                <div className="py-12 text-center text-gray-400">No Black-focused resources found for {countryName}.</div>
              ) : (
                <ResourceGridSection
                  resources={blackResources}
                  selectedCity={{ name: `${countryName}` }}
                    countryId={countryId}
                  onBack={() => setShowAllBlackFocused(false)}
                  isCityFlow={true}
                  searchQuery={query}
                />
              )}
            </div>
          )}

          {!showAllBlackFocused && showAllCountryResources && countryId && (
          <div>

              {loadingCountryResources ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <CitySkeleton key={idx} />
                  ))}
                </div>
              ) : countryResources.length === 0 ? (
                <div className="py-12 text-center text-gray-400">No resources found for {countryName}.</div>
              ) : (
                <ResourceGridSection
                  resources={countryResources}
                  selectedCity={{ name: `${countryName}` }}
                    countryId={countryId}
                  showAllCountryResources={showAllCountryResources}
                  showAllBlackFocused={showAllBlackFocused}
                  onBack={() => setShowAllCountryResources(false)}
                  isCityFlow={true}
                  searchQuery={query}
                />
              )}
            </div>
          )}

        {/* Show city grid - only when no city selected and no toggles active */}
        {(!selectedCity) && (!showAllBlackFocused && !showAllCountryResources) && (
          <>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <CitySkeleton key={idx} />
                  ))}
                </div>
              ) : filteredCities.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-lg">
                  No cities available
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
                  {filteredCities.map((city, idx) => (
                    <div key={city.id} onClick={() => handleCitySelect(city)}>
                      <CountryCard
                        name={city.name}
                        resources={city.resources}
                        showFlag={false}
                      />
                      {idx >= filteredCities.length - 3 && <hr className="pb-2 mx-2" />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
    </div>
  );
};

export default CitiesSection;
