'use client';
import React, { useState, useEffect, useCallback, lazy, Suspense, memo } from 'react';
import HeroSection from './hero-section';
import Stats from './stats';
import TabSection from './tabs/tabSection';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

// Lazy load heavy section components
const ResourceTypes = lazy(() => import('./tabs/resource-types'));
const CountrySection = lazy(() => import('./CountrySection'));
const CitiesSection = lazy(() => import('./CitiesSection'));

// Loading fallback
const SectionLoader = () => (
  <div className="w-full py-12 flex justify-center">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-8 bg-gray-200 rounded w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

const Resources = () => {
  // Track what is selected
  const [step, setStep] = useState<"tabs" | "continent" | "resourceType" | "exploreCity">("tabs");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<string | null>(null);
  const [flagUrls, setFlagUrls] = useState<Record<string, string>>({});
  const [selectedContinentId, setSelectedContinentId] = useState<number | null>(null);
  const [resourceTypeId, setResourceTypeId] = useState<number | null>(null);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.resourceStep) {
        setStep(event.state.resourceStep);
        if (event.state.selectedContinent) setSelectedContinent(event.state.selectedContinent);
        if (event.state.selectedResourceType) setSelectedResourceType(event.state.selectedResourceType);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    // Push initial state
    window.history.replaceState({ resourceStep: 'tabs' }, '');
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update history when step changes
  useEffect(() => {
    window.history.pushState({
      resourceStep: step,
      selectedContinent,
      selectedResourceType
    }, '');
  }, [step, selectedContinent, selectedResourceType]);

  // Memoize handlers
  const handleContinentSelect = useCallback((continent: string, id: string) => {
    setSelectedContinent(continent);
    setStep("continent");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResourceTypeSelect = useCallback((type: string, id: number) => {
    if (type === "Explore resources by city") {
      setStep("exploreCity");
    } else {
      setSelectedResourceType(type);
      setResourceTypeId(id);
      setStep("resourceType");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToTabs = useCallback(() => {
    setStep("tabs");
  }, []);



  return (
    <div className='max-w-[1440px] mx-auto px-4'>
     
      {/* Only show TabSection if step is "tabs" */}
      {step === "tabs" && (
        <>
          <HeroSection />
          <Stats />
          <TabSection
            setContinentId={setSelectedContinentId}
            onContinentSelect={handleContinentSelect}
            onResourceTypeSelect={handleResourceTypeSelect}
          />
        </>

      )}
      {/* Show countries if continent selected */}
      {step === "continent" && selectedContinent && (
        <Suspense fallback={<SectionLoader />}>
          <CountrySection
            continentId={selectedContinentId}
            selectedContinent={selectedContinent}
            flagUrls={flagUrls}
            onBack={handleBackToTabs}
          />
        </Suspense>
      )}
      {/* Show resources if resource type selected */}
      {step === "resourceType" && selectedResourceType && (
        <Suspense fallback={<SectionLoader />}>
          <ResourceTypes
            onResourceTypeSelect={handleResourceTypeSelect}
            resources={null}
            selectedType={selectedResourceType}
            onBack={handleBackToTabs}
          />
        </Suspense>
      )}

      {step === "exploreCity" && (
        <Suspense fallback={<SectionLoader />}>
          <CitiesSection
            onBack={handleBackToTabs}
            countryId={null}
            isExploreCities={true}
          />
        </Suspense>
      )}
      {/* Add more steps as needed */}
    </div>
  );
};

export default memo(Resources);
