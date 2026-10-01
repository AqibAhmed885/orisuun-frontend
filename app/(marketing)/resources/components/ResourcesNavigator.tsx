'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense, memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import HeroSection from './hero-section';
import Stats from './stats';
import TabSection from './tabs/tabSection';
import SearchIcon from '@/icons/search-icon';
import CountryCard from './CountryCard';
import StateSection from './StateSection';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import {
  parseResourcesSlugs,
  toSlug,
  generateResourcesPath,
  matchSlugToItem,
  RESOURCE_TYPE_SLUGS,
  RESOURCE_TYPE_NAMES,
  ResourcesNavigationState,
} from '../utils/slug-utils';
import {
  getRegionsWithResourceCounts,
  getCountriesWithResourceCounts,
  getStatesWithResourceCounts,
  getCitiesWithResourceCounts,
  getAllResources,
} from '@/app/api/marketing/resources';

// Lazy load heavy section components
const ResourceTypes = lazy(() => import('./tabs/resource-types'));
const CitiesSection = lazy(() => import('./CitiesSection'));
const ResourceGridSection = lazy(() => import('./ResourceGridSection'));

// Loading fallback
const SectionLoader = () => (
  <div className="w-full ">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1440px] mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100  animate-pulse flex flex-col justify-between min-h-[280px]">
          <div className="h-full bg-gray-200 rounded-md " />

        </div>
      ))}
    </div>
  </div>
);

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

interface ResolvedData {
  region?: { id: number; name: string };
  country?: { id: number; name: string };
  state?: { id: number; name: string };
  city?: { id: number; name: string };
  resourceType?: { id: number; name: string };
}

interface ResourcesNavigatorProps {
  initialSlugs: string[];
}

const ResourcesNavigator: React.FC<ResourcesNavigatorProps> = ({ initialSlugs }) => {
  const router = useRouter();
  
  // Navigation state derived from URL
  const [navState, setNavState] = useState<ResourcesNavigationState>(() => 
    parseResourcesSlugs(initialSlugs)
  );
  
  // Resolved data from API (IDs and names)
  const [resolvedData, setResolvedData] = useState<ResolvedData>({});
  
  // Lists for current view
  const [regions, setRegions] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  
  // Search query for filtering
  const [query, setQuery] = useState('');
  
  // Track if states exist for the country
  const [hasStates, setHasStates] = useState<boolean | null>(null);

  // Load regions on mount (needed for matching region slugs)
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionData = await getRegionsWithResourceCounts();
        const filtered = regionData.filter(r => r.resourceCount > 0);
        setRegions(filtered);
      } catch (error) {
        console.error('Failed to load regions:', error);
        setRegions([]);
      }
    };
    loadRegions();
  }, []);

  // Resolve slugs to actual data when URL changes
  useEffect(() => {
    const resolveNavigation = async () => {
      if (navState.type === 'base') {
        setLoading(false);
        return;
      }

      setLoadingData(true);
      const newResolvedData: ResolvedData = {};

      try {
        // Handle resource type navigation
        if (navState.type === 'resource-type' && navState.resourceTypeId !== undefined) {
          newResolvedData.resourceType = {
            id: navState.resourceTypeId,
            name: RESOURCE_TYPE_NAMES[navState.resourceTypeId] || '',
          };
          setResolvedData(newResolvedData);
          setLoadingData(false);
          setLoading(false);
          return;
        }

        // Handle geographic navigation
        if (navState.regionSlug && regions.length > 0) {
          const matchedRegion = matchSlugToItem(navState.regionSlug, regions);
          if (matchedRegion) {
            newResolvedData.region = { id: matchedRegion.id, name: matchedRegion.name };
            
            // Load countries for this region
            const countryData = await getCountriesWithResourceCounts(matchedRegion.id);
            const filteredCountries = countryData.filter(c => c.resourceCount > 0);
            setCountries(filteredCountries);

            if (navState.countrySlug) {
              const matchedCountry = matchSlugToItem(navState.countrySlug, filteredCountries);
              if (matchedCountry) {
                newResolvedData.country = { id: matchedCountry.id, name: matchedCountry.name };
                
                // Check if country has states
                const stateData = await getStatesWithResourceCounts(matchedCountry.id);
                const filteredStates = stateData.filter(s => s.resourceCount > 0);
                setStates(filteredStates);
                setHasStates(filteredStates.length > 0);

                if (navState.stateSlug) {
                  const matchedState = matchSlugToItem(navState.stateSlug, filteredStates);
                  if (matchedState) {
                    newResolvedData.state = { id: matchedState.id, name: matchedState.name };
                    
                    // Load cities for this state
                    const cityData = await getCitiesWithResourceCounts(matchedCountry.id, matchedState.id);
                    const filteredCities = cityData.filter(c => c.resourceCount > 0);
                    setCities(filteredCities);

                    if (navState.citySlug) {
                      const matchedCity = matchSlugToItem(navState.citySlug, filteredCities);
                      if (matchedCity) {
                        newResolvedData.city = { id: matchedCity.id, name: matchedCity.name };
                        
                        // Load resources for this city
                        const resourceData = await getAllResources({
                          cityId: matchedCity.id,
                          includeExpired: true,
                        });
                        setResources(resourceData);
                      }
                    }
                  } else {
                    // State slug didn't match any state - check if it's actually a city
                    // This handles URLs like /region/country/city when country has states but user navigated to city directly
                    const allCityData = await getCitiesWithResourceCounts(matchedCountry.id);
                    const allFilteredCities = allCityData.filter(c => c.resourceCount > 0);
                    const matchedCityAsThirdSlug = matchSlugToItem(navState.stateSlug, allFilteredCities);
                    
                    if (matchedCityAsThirdSlug) {
                      // It's actually a city, not a state
                      newResolvedData.city = { id: matchedCityAsThirdSlug.id, name: matchedCityAsThirdSlug.name };
                      setCities(allFilteredCities);
                      setHasStates(false); // Treat as if no states for this navigation path
                      
                      // Load resources for this city
                      const resourceData = await getAllResources({
                        cityId: matchedCityAsThirdSlug.id,
                        includeExpired: true,
                      });
                      setResources(resourceData);
                    }
                  }
                } else if (filteredStates.length === 0) {
                  // No states, load cities directly
                  const cityData = await getCitiesWithResourceCounts(matchedCountry.id);
                  const filteredCities = cityData.filter(c => c.resourceCount > 0);
                  setCities(filteredCities);
                }
              }
            }
          }
        }

        setResolvedData(newResolvedData);
      } catch (error) {
        console.error('Failed to resolve navigation:', error);
      } finally {
        setLoadingData(false);
        setLoading(false);
      }
    };

    // Wait for regions to load before resolving geographic navigation
    if (navState.type === 'base' || navState.type === 'resource-type' || regions.length > 0) {
      resolveNavigation();
    }
  }, [navState, regions]);

  // Navigate to a new path and update state
  const navigateTo = useCallback((segments: string[], newNavState?: ResourcesNavigationState) => {
    // Clear previous data to prevent stale content
    if (newNavState) {
      // Clear lists that are no longer relevant
      if (newNavState.type === 'base') {
        setCountries([]);
        setStates([]);
        setCities([]);
        setResources([]);
        setResolvedData({});
        setHasStates(null);
      } else if (newNavState.type === 'region') {
        setStates([]);
        setCities([]);
        setResources([]);
        setHasStates(null);
      } else if (newNavState.type === 'country') {
        setCities([]);
        setResources([]);
      } else if (newNavState.type === 'state') {
        setResources([]);
      }
    }
    
    const path = generateResourcesPath(segments);
    router.push(path);
    
    if (newNavState) {
      setNavState(newNavState);
    } else {
      setNavState(parseResourcesSlugs(segments));
    }
    
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  // Handler for region selection
  const handleRegionSelect = useCallback((regionName: string, regionId: number) => {
    const regionSlug = toSlug(regionName);
    navigateTo([regionSlug], {
      type: 'region',
      regionSlug,
      slugs: [regionSlug],
    });
  }, [navigateTo]);

  // Handler for country selection
  const handleCountrySelect = useCallback(async (countryName: string, countryId: number) => {
    if (!resolvedData.region) return;
    
    const countrySlug = toSlug(countryName);
    navigateTo([navState.regionSlug!, countrySlug], {
      type: 'country',
      regionSlug: navState.regionSlug,
      countrySlug,
      slugs: [navState.regionSlug!, countrySlug],
    });
  }, [navigateTo, navState.regionSlug, resolvedData.region]);

  // Handler for state selection
  const handleStateSelect = useCallback((stateId: number, stateName: string) => {
    if (!resolvedData.region || !resolvedData.country) return;
    
    const stateSlug = toSlug(stateName);
    navigateTo([navState.regionSlug!, navState.countrySlug!, stateSlug], {
      type: 'state',
      regionSlug: navState.regionSlug,
      countrySlug: navState.countrySlug,
      stateSlug,
      slugs: [navState.regionSlug!, navState.countrySlug!, stateSlug],
    });
  }, [navigateTo, navState.regionSlug, navState.countrySlug, resolvedData]);

  // Handler for city selection
  const handleCitySelect = useCallback((city: { id: number; name: string }) => {
    if (!resolvedData.region || !resolvedData.country) return;
    
    const citySlug = toSlug(city.name);
    const segments = navState.stateSlug
      ? [navState.regionSlug!, navState.countrySlug!, navState.stateSlug, citySlug]
      : [navState.regionSlug!, navState.countrySlug!, citySlug];
    
    navigateTo(segments, parseResourcesSlugs(segments));
  }, [navigateTo, navState, resolvedData]);

  // Handler for resource type selection
  const handleResourceTypeSelect = useCallback((typeName: string, typeId: number) => {
    if (typeName === 'Explore resources by city') {
      navigateTo(['explore-by-city'], {
        type: 'resource-type',
        resourceTypeSlug: 'explore-by-city',
        resourceTypeId: 0,
        slugs: ['explore-by-city'],
      });
    } else {
      const typeSlug = toSlug(typeName);
      navigateTo([typeSlug], {
        type: 'resource-type',
        resourceTypeSlug: typeSlug,
        resourceTypeId: typeId,
        slugs: [typeSlug],
      });
    }
  }, [navigateTo]);

  // Go back to previous level
  const goBack = useCallback(() => {
    switch (navState.type) {
      case 'city':
        if (navState.stateSlug) {
          navigateTo([navState.regionSlug!, navState.countrySlug!, navState.stateSlug], {
            type: 'state',
            regionSlug: navState.regionSlug,
            countrySlug: navState.countrySlug,
            stateSlug: navState.stateSlug,
            slugs: [navState.regionSlug!, navState.countrySlug!, navState.stateSlug],
          });
        } else {
          navigateTo([navState.regionSlug!, navState.countrySlug!], {
            type: 'country',
            regionSlug: navState.regionSlug,
            countrySlug: navState.countrySlug,
            slugs: [navState.regionSlug!, navState.countrySlug!],
          });
        }
        break;
      case 'state':
        navigateTo([navState.regionSlug!, navState.countrySlug!], {
          type: 'country',
          regionSlug: navState.regionSlug,
          countrySlug: navState.countrySlug,
          slugs: [navState.regionSlug!, navState.countrySlug!],
        });
        break;
      case 'country':
        navigateTo([navState.regionSlug!], {
          type: 'region',
          regionSlug: navState.regionSlug,
          slugs: [navState.regionSlug!],
        });
        break;
      case 'region':
      case 'resource-type':
      default:
        navigateTo([], { type: 'base', slugs: [] });
        break;
    }
  }, [navState, navigateTo]);

  // Go to base (tabs view)
  const goToBase = useCallback(() => {
    navigateTo([], { type: 'base', slugs: [] });
  }, [navigateTo]);

  // Filtered lists based on search query
  const filteredCountries = useMemo(() => {
    if (!query.trim()) return countries;
    return countries.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [countries, query]);

  const filteredCities = useMemo(() => {
    if (!query.trim()) return cities;
    return cities.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [cities, query]);

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    const items: { label: string; onClick?: () => void }[] = [];
    
    if (navState.type === 'resource-type') {
      items.push({ label: 'Resource Types', onClick: goToBase });
      items.push({ label: resolvedData.resourceType?.name || '' });
    } else if (navState.regionSlug) {
      items.push({ label: 'Regions', onClick: goToBase });
      
      if (navState.type === 'region') {
        items.push({ label: resolvedData.region?.name || '' });
      } else {
        items.push({ label: resolvedData.region?.name || '', onClick: () => navigateTo([navState.regionSlug!]) });
        
        if (navState.type === 'country') {
          items.push({ label: resolvedData.country?.name || '' });
        } else {
          items.push({ 
            label: resolvedData.country?.name || '', 
            onClick: () => navigateTo([navState.regionSlug!, navState.countrySlug!]) 
          });
          
          if (navState.type === 'state' && resolvedData.state) {
            // Normal state view
            items.push({ label: resolvedData.state?.name || '' });
          } else if (navState.type === 'state' && !resolvedData.state && resolvedData.city) {
            // Third segment resolved as city (not state)
            items.push({ label: resolvedData.city?.name || '' });
          } else if (navState.stateSlug && resolvedData.state) {
            items.push({ 
              label: resolvedData.state?.name || '', 
              onClick: () => navigateTo([navState.regionSlug!, navState.countrySlug!, navState.stateSlug!]) 
            });
            items.push({ label: resolvedData.city?.name || '' });
          } else if (navState.type === 'city') {
            items.push({ label: resolvedData.city?.name || '' });
          }
        }
      }
    }
    
    if (items.length === 0) return null;
    
    return (
      <h2 className="text-base space-x-1.5 text-gray-500 font-medium mb-4 flex flex-wrap items-center">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={18} />}
            <span
              className={item.onClick ? 'cursor-pointer hover:text-gray-800 transition' : 'text-gray-800'}
              onClick={item.onClick}
            >
              {item.label}
            </span>
          </React.Fragment>
        ))}
      </h2>
    );
  };

  // Render search input
  const renderSearch = (placeholder: string) => (
    <div className="relative md:w-1/2 w-full mb-4">
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        <SearchIcon />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4">
        <SectionLoader />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4">
      {/* BASE VIEW - Tabs */}
      {navState.type === 'base' && (
        <>
          <HeroSection />
          <Stats />
          <TabSection
            setContinentId={() => {}}
            onContinentSelect={handleRegionSelect}
            onResourceTypeSelect={handleResourceTypeSelect}
          />
        </>
      )}

      {/* RESOURCE TYPE VIEW */}
      {navState.type === 'resource-type' && resolvedData.resourceType && (
        <Suspense fallback={<SectionLoader />}>
          {resolvedData.resourceType.id === 0 ? (
            <CitiesSection
              onBack={goToBase}
              countryId={null}
              isExploreCities={true}
            />
          ) : (
            <ResourceTypes
              onResourceTypeSelect={handleResourceTypeSelect}
              resources={null}
              selectedType={resolvedData.resourceType.name}
              onBack={goToBase}
            />
          )}
        </Suspense>
      )}

      {/* REGION VIEW - Country List */}
      {navState.type === 'region' && resolvedData.region && (
        <div>
          {renderBreadcrumbs()}
          {renderSearch('Search Countries...')}

          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <CountrySkeleton key={idx} />
              ))}
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-lg">
              No countries available for this region.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
              {filteredCountries.map((country, idx) => (
                <div
                  key={country.id}
                  onClick={() => handleCountrySelect(country.name, country.id)}
                  className="cursor-pointer"
                >
                  <CountryCard
                    name={country.name}
                    resources={country.resourceCount}
                  />
                  {idx >= filteredCountries.length - 3 && <hr className="pb-2 mx-2" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COUNTRY VIEW - States or Cities */}
      {navState.type === 'country' && resolvedData.country && (
        <div>
          {renderBreadcrumbs()}

          {loadingData ? (
            <div className="py-16 text-center text-gray-400">Loading...</div>
          ) : hasStates ? (
            <StateSection
              countryId={resolvedData.country.id}
              onStateSelect={handleStateSelect}
            />
          ) : (
            <Suspense fallback={<SectionLoader />}>
              <CitiesSection
                countryId={resolvedData.country.id}
                stateId={null}
                countryName={resolvedData.country.name}
                onBack={goBack}
                regionSlug={navState.regionSlug}
                countrySlug={navState.countrySlug}
                onCitySelect={(cityName: string) => {
                  const city = cities.find(c => c.name === cityName);
                  if (city) handleCitySelect(city);
                }}
              />
            </Suspense>
          )}
        </div>
      )}

      {/* STATE VIEW - Cities */}
      {navState.type === 'state' && resolvedData.state && resolvedData.country && (
        <div>
          {renderBreadcrumbs()}

          <Suspense fallback={<SectionLoader />}>
            <CitiesSection
              countryId={resolvedData.country.id}
              stateId={resolvedData.state.id}
              countryName={resolvedData.country.name}
              onBack={goBack}
              regionSlug={navState.regionSlug}
              countrySlug={navState.countrySlug}
              stateSlug={navState.stateSlug}
              onCitySelect={(cityName: string) => {
                const city = cities.find(c => c.name === cityName);
                if (city) handleCitySelect(city);
              }}
            />
          </Suspense>
        </div>
      )}

      {/* CITY VIEW - Resources (when 3rd segment is a city, not a state) */}
      {navState.type === 'state' && !resolvedData.state && resolvedData.city && resolvedData.country && (
        <div>
          {renderBreadcrumbs()}

          <Suspense fallback={<SectionLoader />}>
            {loadingData ? (
              <SectionLoader />
            ) : resources.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-lg">
                No resources available for this city.
              </div>
            ) : (
              <ResourceGridSection
                resources={resources}
                selectedCity={resolvedData.city}
                cityId={resolvedData.city.id}
                countryId={resolvedData.country?.id}
                onBack={goBack}
                isCityFlow={true}
              />
            )}
          </Suspense>
        </div>
      )}

      {/* CITY VIEW - Resources */}
      {navState.type === 'city' && resolvedData.city && (
        <div>
          {renderBreadcrumbs()}

          <Suspense fallback={<SectionLoader />}>
            {loadingData ? (
              <SectionLoader />
            ) : resources.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-lg">
                No resources available for this city.
              </div>
            ) : (
              <ResourceGridSection
                resources={resources}
                selectedCity={resolvedData.city}
                cityId={resolvedData.city.id}
                stateId={resolvedData.state?.id}
                countryId={resolvedData.country?.id}
                onBack={goBack}
                isCityFlow={true}
              />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default memo(ResourcesNavigator);
