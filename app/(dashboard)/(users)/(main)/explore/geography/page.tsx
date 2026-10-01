'use client';

import Breadcrumbs from '@/components/ui/breadcrumbs';
import SearchResultCard from '@/components/cards/search-result-card';
import MultiSectionCheckboxAccordion from '@/components/ui/checbox-dropdown';
import CustomSelect from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import ArrowDown from '@/icons/arrow-down';
import Filters from '@/icons/filters';
import Hamburger from '@/icons/sidebar/hamburger';
import { filterTypes } from '@/utils/constants';
import { capitalizeWords, cn } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { sortOptions, validRegions } from '../../../../../../data/dashboard/explore';
import { geographyApi } from '@/app/api/dashboard/explore';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const GeographyExploreSection = () => {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [blackOwnedOnly, setBlackOwnedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { title: string; url?: string }[]
  >([
    {
      title: 'Home',
      url: '/explore',
    },
  ]);
  const [locations, setLocations] = useState([]);
  const [industriesData, setIndustriesData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [profileType, setProfileType] = useState([]);
  const [primarySort, SetPrimarySort] = useState<any>([]);
  const [secondarySort, SetSecondarySort] = useState<any>([]);
  const [tertiarySort, SetTertiarySort] = useState<any>([]);
  const [quaternarySort, SetQuaternarySort] = useState<any>([]);
  const [isFilter, setIsFilter] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const filterRef = useRef(null);
  const [paramsCountry, setCountCities] = useState<string>();
  const [locationData, setLocationsData] = useState([]);
  const [cityList, setCityList] = useState<
    { id: number; label: string }[]
  >([]);

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (searchParams.get('country') && locationData.length > 0) {
      (async () => {
        const formattedRegion = searchParams.get('country').replaceAll('-', ' ')
          .split(' ')
          .map(word => (word.toLowerCase() === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)))
          .join(' ');
        const selectedRegion = locationData.find(region => region.CountryName === formattedRegion);

        if (selectedRegion) {
          try {
            const result = await geographyApi.getCityStateList({
              CountryId: Number(selectedRegion.Id),
            });
            const formattedCityList = result?.CityData?.map((item) => ({
              id: item.Id.toString(),
              label: item.CityName,
            }));
            setCityList(formattedCityList);
          } catch (error) {
            console.error('Error fetching country list:', error);
          }
        }
      })();
    }
  }, [searchParams.get('country'), locationData]);

  const fetchLocations = async () => {
    try {
      const formattedRegion = searchParams.get('q').replaceAll('-', ' ')
        .split(' ')
        .map(word => (word.toLowerCase() === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(' ');
      const selectedRegion = validRegions.find(region => region.value === formattedRegion);
      if (!selectedRegion) {
        console.error('Region not found');
        return;
      }
      const result = await geographyApi.getCountryByRegion(selectedRegion.id);
      setLocationsData(result);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    if (searchParams.get('q')) {
      fetchLocations();
    }

  }, [searchParams])
  useEffect(() => {
    function handleClickOutside(event) {

      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isFilter) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }, [isFilter]);

  useEffect(() => {
    const newBreadcrumbs: { title: string; url?: string }[] = [
      {
        title: 'Home',
        url: '/explore',
      },
    ];

    const q = searchParams.get('q');
    setCountCities(capitalizeWords(q.replaceAll('-', ' ')));
    const country = searchParams.get('country');
    if (q) {
      newBreadcrumbs.push({
        title: capitalizeWords(q.replaceAll('-', ' ')),
        url: `geography?q=${encodeURIComponent(q)}`,
      });
    }
    if (country) {
      newBreadcrumbs.push({
        title: capitalizeWords(country.replaceAll('-', ' ')),
        url: `industry?q=${encodeURIComponent(q)}&country=${encodeURIComponent(country)}`,
      });
    }
    if (!country) {
      setCityList([])
      setSelectedCity([])
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const categorizedOptions = categorizeOptions(selectedOptions);
        const formattedRegion = searchParams.get('country')?.replaceAll('-', ' ')
          ?.split(' ')
          ?.map(word => (word?.toLowerCase() === 'and' ? 'and' : word?.charAt(0)?.toUpperCase() + word?.slice(1)))
          ?.join(' ');

        const userData = JSON.parse(localStorage.getItem('userData'));
        const mappedCities = selectedCity.map((city) => city.toString() || '');

        if (mappedCities?.length > 0 || Array.isArray(paramsCountry) ? paramsCountry?.length > 0 : paramsCountry) {
          const result = await geographyApi.getGeographyProfilesV1({
            UserId: userData?.Id,
            CountryCities: [...mappedCities],
            RegionName: paramsCountry,
            Locations: selectedLocations,
            boTypes: categorizedOptions?.OpportunityType,
            IsVerified: verifiedOnly,
            IsBlackedOwned: blackOwnedOnly,
            country: formattedRegion || '',
            ProfileTypes: selectedProfile,
            Industries: [],
            PageSize: 0,
            PageNo: 0,
            ParentId: 0,
            SortPrimary: primarySort?.value ? primarySort?.value : '',
            SortSecondary: secondarySort?.value ? secondarySort?.value : '',
            SortTertiary: tertiarySort?.value ? tertiarySort?.value : '',
            SortQuaternary: quaternarySort?.value ? quaternarySort?.value : '',
            MatchesType: categorizedOptions?.MatchType?.length > 0 ? categorizedOptions?.MatchType : [1],
          });
          setIndustriesData(result);
        }
      } catch (error) {
        console.error('Error fetching geography profiles:', error);
      }
    })();
  }, [
    selectedOptions,
    paramsCountry,
    selectedProfile,
    selectedCity,
    selectedLocations,
    blackOwnedOnly,
    verifiedOnly,
    secondarySort,
    primarySort,
    tertiarySort,
    quaternarySort,
    searchParams.get('country'),
  ]);

  const categorizeOptions = (selectedOptions) => {
    const categories = {
      OpportunityType: [],
      MatchType: [],
    };

    selectedOptions.forEach((option) => {
      filterTypes.forEach((section) => {
        const match = section.options.find((item) => item.id === option);
        if (match) {
          switch (section.title) {
            case 'Business Opportunity Type':
              categories.OpportunityType.push(option);
              break;
            case 'Matches Type':
              categories.MatchType.push(option);
              break;
            default:
              break;
          }
        }
      });
    });

    return categories;
  };

  const restructureData = (data: any) => {
    return data.map((region) => ({
      title: region.RegionName,
      options: region.CityList.map((city) => ({
        id: city.CityName,
        label: city.CityName,
      })),
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const locationsList = await geographyApi.getLocationsListV1();
        const updatedRecords = locationsList;
        const filterCities = restructureData(updatedRecords);
        setCities(filterCities);
        const filterLocations = [
          {
            title: 'Locations',
            options: updatedRecords?.map((location: any) => ({
              id: location.RegionName,
              label: location.RegionName,
            })),
          },
        ];
        setLocations(filterLocations);

        const profileTypes = await geographyApi.getUserProfileTypes();
        const profileType = [
          {
            title: 'Profile Type',
            options: profileTypes?.map((profile) => ({
              id: profile?.Id,
              label: profile?.UserProfileName,
            })),
          },
        ];
        setProfileType(profileType);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    })();
  }, []);

  return (
    <div className="px-6">
      <div className="py-6">
        <div className="lg:hidden flex items-center justify-between py-4">
          <Hamburger className="hamburger-top-icon" />
          <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
            Explore
          </p>
          <Image
            src={
              currentUser?.ProfilePicture || BASE_URL
            }
            alt="user"
            width={32}
            height={32}
            className="rounded-full h-8 w-8 me-2"
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <button
              type="button"
              onClick={() => setIsFilter(true)}
              className="hidden ipad:flex border bg-white text-h9 2xl:text-scaled-h9 font-medium py-3 rounded-md focus:outline-none focus:border-omblue-500 focus:bg-[#f3f7f9] transition-colors duration-200 border-black-200 w-[46px] flex align-center justify-center"
            >
              <Filters className="w-5 h-5" />
            </button>
          </div>
          {searchParams.get('q') && !searchParams.get('country') ? (
            <div className="grid grid-cols-12 gap-5 py-6">
              {locationData.map((item, index) => (
                <Link
                  href={`geography?q=${searchParams.get('q')}&country=${item?.CountryName
                    ?.split(' ')
                    ?.join('-')
                    ?.replaceAll(',', '')
                    ?.toLowerCase()}`}
                  key={index}
                  className={`${locationData?.length == index + 1 ? 'col-span-12' : 'col-span-6'
                    }  md:col-span-4`}
                >
                  <label
                    className={cn(
                      'border border-grey-600 w-full h-full inline-flex text-center justify-center items-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out text-h5 2xl:text-scaled-h5 font-semibold text-black-400 px-6 lg:px-14 py-3 lg:py-6'
                    )}
                  >
                    <h5>{item?.CountryName}</h5>
                  </label>
                </Link>
              ))}
            </div>) : null
          }
          <div className="flex-grow flex md:overflow-hidden">
            <div className="flex flex-col gap-4">
              <div>
                <div
                  className={cn(
                    'col-span-3 filter-container',
                    isFilter ? 'show-filter' : ''
                  )}
                  ref={filterRef}
                >
                  <div
                    className={cn(
                      'block flex-none hide-scrollbar bg-white shadow-filter-primary p-4 max-w-md transition-all',
                      !showFilters
                        ? 'max-h-16 overflow-hidden'
                        : 'max-h-[60rem] overflow-y-auto'
                    )}
                  >
                    <div
                      className="flex items-center gap-2 mb-4"
                    >
                      <div className="h-7 w-1 bg-blue-500 rounded-e-md ipad:hidden"></div>
                      <ArrowDown
                        className="rotate-90 w-10 h-10 hidden ipad:block cursor-pointer"
                        onClick={() => setIsFilter(false)}
                      />
                      <h6 className="text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold">
                        Filters & Sort
                      </h6>
                    </div>
                    <div className="space-y-4">
                      <div className="mt-2">
                        <MultiSectionCheckboxAccordion
                          sections={[{
                            title: 'Cities',
                            options: cityList
                          }]}
                          selectedOptions={selectedCity}
                          onChange={setSelectedCity}
                          defaultClosedSections={cities.map((c) => c.title)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                          Primary Sort
                        </label>
                        <CustomSelect
                          placeholder="Select One"
                          options={sortOptions}
                          onChange={SetPrimarySort}
                          error={undefined}
                          value={primarySort}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                          Secondary Sort
                        </label>
                        <CustomSelect
                          placeholder="Select One"
                          options={sortOptions}
                          onChange={SetSecondarySort}
                          error={undefined}
                          value={secondarySort}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                          Tertiary Sort
                        </label>
                        <CustomSelect
                          placeholder="Select One"
                          options={sortOptions}
                          onChange={SetTertiarySort}
                          error={undefined}
                          value={tertiarySort}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                          Quaternary Sort
                        </label>
                        <CustomSelect
                          placeholder="Select One"
                          options={sortOptions}
                          onChange={SetQuaternarySort}
                          error={undefined}
                          value={quaternarySort}
                        />
                      </div>
                    </div>
                    <hr className="my-4 border-b-black-500" />
                    <MultiSectionCheckboxAccordion
                      sections={profileType}
                      selectedOptions={selectedProfile}
                      onChange={setSelectedProfile}
                    />
                    <MultiSectionCheckboxAccordion
                      sections={filterTypes}
                      selectedOptions={selectedOptions}
                      onChange={setSelectedOptions}
                    />
                    <div className="mt-4">
                      <Switch
                        label="Majority Black Owned Companies Only"
                        isOn={blackOwnedOnly}
                        onToggle={() => setBlackOwnedOnly(!blackOwnedOnly)}
                      />
                      <Switch
                        label="Verified Companies Only"
                        isOn={verifiedOnly}
                        onToggle={() => setVerifiedOnly(!verifiedOnly)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow md:overflow-y-auto md:p-4 flex flex-col gap-4">
              {industriesData?.length > 0 ? (
                industriesData.map((industry, index) => (
                  <SearchResultCard
                    index={index}
                    key={index}
                    data={industry}
                    results={industriesData}
                    setResults={setIndustriesData}
                    isPostProfile={true}
                  />
                ))
              ) : (
                <>
                  <p>There is no data </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographyExploreSection;
