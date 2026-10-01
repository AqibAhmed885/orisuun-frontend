import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import CountryCard from "./CountryCard";
import CitiesSection from "./CitiesSection";
import StateSection from "./StateSection";
import { ChevronRight } from "lucide-react";
import SearchIcon from "@/icons/search-icon";
import { getCountriesWithResourceCounts, getStatesWithResourceCounts } from "@/app/api/marketing/resources";
import { toSlug } from "../utils/slug-utils";

const CountrySkeleton = () => (
  <div className="bg-white py-2 flex flex-col justify-between">
    <hr className="pb-2 mx-2" />
    <div className="border-r space-y-5 p-6 flex flex-col justify-between h-full">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-4"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
      </div>
    </div>
  </div>
);

type CountrySectionProps = {
  selectedContinent: string;
  continentId?: number | null;
  flagUrls: Record<string, string>;
  onBack: () => void;
  continentSlug?: string;
};

const CountrySection: React.FC<CountrySectionProps> = ({
  selectedContinent,
  continentId ,
  onBack,
  continentSlug,
}) => {
  const router = useRouter();


  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'types'>('types');
  const [hasStates, setHasStates] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [checkingStates, setCheckingStates] = useState(false);
  const [query, setQuery] = useState("");
  const [showAllCountryResources, setShowAllCountryResources] = useState(false);
  const [showAllBlackFocused, setShowAllBlackFocused] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCountriesWithResourceCounts(continentId)
      .then((countries) => {
        const filtered = countries.filter(c => c.resourceCount > 0);
        // Sort alphabetically by country name (case-insensitive)
        const sorted = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
        setCountriesList(sorted);
      })
      .catch(() => setCountriesList([]))
      .finally(() => setLoading(false));
  }, [continentId]);

  const handleCountrySelect = async (countryName: string, countryId: number) => {
    // Navigate via URL for proper deep linking support
    const regionSlug = continentSlug || toSlug(selectedContinent);
    const countrySlug = toSlug(countryName);
    router.push(`/resources/${regionSlug}/${countrySlug}`);

    setSelectedCountry(countryName);
    setCountryId(countryId);
    setCheckingStates(true);

    // Check if country has states
    try {
      const states = await getStatesWithResourceCounts(countryId);
      const statesWithResources = states.filter(s => s.resourceCount > 0);
      if (statesWithResources.length > 0) {
        setHasStates(true);
      } else {
        setHasStates(false);
      }
    } catch (error) {
      setHasStates(false);
    } finally {
      setCheckingStates(false);
    }

    setViewMode('types');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    // Navigate via URL for proper state management
    if (continentSlug) {
      router.push(`/resources/${continentSlug}`);
    } else {
      const regionSlug = toSlug(selectedContinent);
      router.push(`/resources/${regionSlug}`);
    }

    setSelectedCountry(null);
    setCountryId(null);
    setSelectedCityName(null);
    setSelectedState(null);
    setStateId(null);
    setHasStates(false);
    setViewMode('types');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCitySelection = (cityName: string) => {
    // Navigate via URL for proper deep linking support
    const regionSlug = continentSlug || toSlug(selectedContinent);
    const countrySlug = toSlug(selectedCountry || '');
    const citySlug = toSlug(cityName);

    if (selectedState) {
      const stateSlug = toSlug(selectedState);
      router.push(`/resources/${regionSlug}/${countrySlug}/${stateSlug}/${citySlug}`);
    } else {
      router.push(`/resources/${regionSlug}/${countrySlug}/${citySlug}`);
    }

    setSelectedCityName(cityName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCountry = () => {
    const regionSlug = continentSlug || toSlug(selectedContinent);
    const countrySlug = toSlug(selectedCountry || '');
    router.push(`/resources/${regionSlug}/${countrySlug}`);

    setSelectedCityName(null);
    setSelectedState(null);
    setStateId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStateSelect = (stateId: number, stateName: string) => {
    // Navigate via URL for proper deep linking support
    const regionSlug = continentSlug || toSlug(selectedContinent);
    const countrySlug = toSlug(selectedCountry || '');
    const stateSlug = toSlug(stateName);
    router.push(`/resources/${regionSlug}/${countrySlug}/${stateSlug}`);

    setSelectedState(stateName);
    setStateId(stateId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStates = () => {
    const regionSlug = continentSlug || toSlug(selectedContinent);
    const countrySlug = toSlug(selectedCountry || '');
    router.push(`/resources/${regionSlug}/${countrySlug}`);

    setSelectedState(null);
    setStateId(null);
    setSelectedCityName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* COUNTRY SELECTION VIEW */}
      {!selectedCountry && (
        <div>
          <h2 className="text-base space-x-1.5 text-gray-500 font-medium mb-4 flex items-center">
            <span
              className="cursor-pointer hover:text-gray-800 transition"
              onClick={onBack}
            >
              Countries
            </span>
            <ChevronRight size={18} />
            <span className="text-gray-800">
              {selectedContinent}
            </span>
          </h2>

          {/* Search */}
          <div className="relative md:w-1/2 w-full">
            <input
              type="search"
              placeholder="Search Countries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              <SearchIcon />
            </div>
          </div>

          {/* Country Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <CountrySkeleton key={idx} />
              ))}
            </div>
          ) : countriesList.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-lg">
              No countries available for this continent.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
                  {countriesList
                    .filter(country => 
                      country.name.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((country, idx) => (
                    <div
                      key={country.id}
                      onClick={() => handleCountrySelect(country.name, country.id)}
                      className="cursor-pointer"
                    >
                      <CountryCard
                        name={country.name}
                        resources={country.resourceCount}
                      />
                      {idx >= countriesList.length - 3 && <hr className="pb-2 mx-2" />}
                    </div>
                  ))}
            </div>
          )}
        </div>
      )}

      {/* STATE VIEW */}
      {selectedCountry && viewMode === 'types' && hasStates && !selectedState && (
        <div className="mb-4">
          <div className="text-gray-500 flex space-x-1.5 items-center text-base font-medium">
            <span
              className="cursor-pointer hover:text-gray-800 transition"
              onClick={onBack}
            >
              Countries
            </span>
            <ChevronRight size={18} />
            <span
              className="cursor-pointer hover:text-gray-800 transition"
              onClick={handleBack}
            >
              {selectedContinent}
            </span>
            <ChevronRight size={18} />
            <span className="text-gray-800">
              {selectedCountry}
            </span>
          </div>

          {checkingStates ? (
            <div className="py-16 text-center text-gray-400">Loading...</div>
          ) : (
            <StateSection
              countryId={countryId!}
              onStateSelect={handleStateSelect}
            />
          )}
        </div>
      )}

      {/* CITIES VIEW */}
      {selectedCountry && viewMode === 'types' && ((!hasStates && !checkingStates) || selectedState) && (
        <div className="mb-4">
          <div className="text-gray-500 flex space-x-1.5 items-center text-base font-medium">
            <span
              className="cursor-pointer hover:text-gray-800 transition"
              onClick={onBack}
            >
              Countries
            </span>
            <ChevronRight size={18} />
            <span
              className="cursor-pointer hover:text-gray-800 transition"
              onClick={handleBack}
            >
              {selectedContinent}
            </span>
            <ChevronRight size={18} />
            <span
              className={selectedState || selectedCityName ? "cursor-pointer hover:text-gray-800 transition" : "text-gray-800"}
              onClick={(selectedState || selectedCityName) ? handleBackToCountry : undefined}
            >
              {selectedCountry}
            </span>
            {selectedState && (
              <>
                <ChevronRight size={18} />
                <span
                  className={selectedCityName ? "cursor-pointer hover:text-gray-800 transition" : "text-gray-800"}
                  onClick={selectedCityName ? handleBackToStates : undefined}
                >
                  {selectedState}
                </span>
              </>
            )}
            {selectedCityName && (
              <>
                <ChevronRight size={18} />
                <span className="text-gray-800">{selectedCityName}</span>
              </>
            )}
          </div>

          <CitiesSection
            countryId={countryId} 
            stateId={stateId}
            countryName={selectedCountry}
            onCitySelect={handleCitySelection}
          />
        </div>
      )}

    </div>
  );
};

export default CountrySection;
