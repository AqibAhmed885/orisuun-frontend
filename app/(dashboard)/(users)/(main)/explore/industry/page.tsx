'use client';

import Breadcrumbs from '@/components/ui/breadcrumbs';
import SearchResultCard from '@/components/cards/search-result-card';
import MultiSectionCheckboxAccordion from '@/components/ui/checbox-dropdown';
import CustomSelect from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import ArrowDown from '@/icons/arrow-down';
import Filters from '@/icons/filters';
import Africa from '@/icons/region/africa';
import Asia from '@/icons/region/asia';
import CentralAmericaAndCaribbean from '@/icons/region/central-america-and-carribbean';
import Europe from '@/icons/region/europe';
import NorthAmerica from '@/icons/region/north-america';
import SouthAmerica from '@/icons/region/south-america';
import Hamburger from '@/icons/sidebar/hamburger';
import { getRegionListAction } from '@/server-actions/businessDevelopment';
import { filterTypes } from '@/utils/constants';
import { capitalizeWords, cn } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { industriesMap, sortOptions, tabs, validRegions } from '@/data/dashboard/explore';
import { industryApi } from '@/app/api/dashboard/explore';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const regionIcons: { [key: string]: React.ComponentType<any> } = {
  Africa,
  Asia,
  CentralAmericaAndCaribbean,
  Europe,
  NorthAmerica,
  SouthAmerica,
};

interface Region {
  Id: number;
  RegionName: string;
  IconName: React.ComponentType<any>;
}
const IndustryExploreSection = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [showFiltersIndustry, setShowFiltersIndustry] = useState(true);
  const [blackOwnedOnly, setBlackOwnedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
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
  const [industries, SetIndustries] = useState<any>([]);
  const [selectIndustry, SetSelectIndustry] = useState<any>([]);
  const [isFilter, setIsFilter] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [locationData, setLocationsData] = useState([]);
  const filterRef = useRef(null);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const industrySearch = searchParams.get('industry');
  const fetchRegions = useCallback(async () => {
    try {
      const response = await getRegionListAction();
      setRegions(
        response?.data.map((region: any) => ({
          ...region,
          IconName:
            regionIcons[region.RegionName.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('')] || (() => null),
        }))
      );
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);
  const fetchLocations = async () => {
    try {
      const formattedRegion = searchParams.get('region').replaceAll('-', ' ')
        .split(' ')
        .map(word => (word.toLowerCase() === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(' ');
      const selectedRegion = validRegions.find(region => region.value === formattedRegion);
      if (!selectedRegion) {
        return;
      }
      const result = await industryApi.getCountryByRegion(selectedRegion.id);
      setLocationsData(result);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (searchParams.get('region')) {
      fetchLocations();
    }

  }, [searchParams])
  const [breadcrumbs, setBreadcrumbs] = useState<
    { title: string; url?: string }[]
  >([
    {
      title: 'Home',
      url: '/explore',
    },
  ]);
  const q = searchParams.get('q');
  useEffect(() => {
    const newBreadcrumbs: { title: string; url?: string }[] = [
      {
        title: 'Home',
        url: '/explore',
      },
    ];
    const region = searchParams.get('region');
    const country = searchParams.get('country');

    const industry = searchParams.get('industry');

    if (q) {
      newBreadcrumbs.push({
        title: capitalizeWords(q.replaceAll('-', ' ')),
        url: `industry?q=${encodeURIComponent(q)}`,
      });
    }
    if (region) {
      newBreadcrumbs.push({
        title: capitalizeWords(region.replaceAll('-', ' ')),
        url: `industry?q=${encodeURIComponent(q)}&region=${encodeURIComponent(region)}`,
      });
    }
    if (country) {
      newBreadcrumbs.push({
        title: capitalizeWords(country.replaceAll('-', ' ')),
        url: `industry?q=${encodeURIComponent(q)}&region=${encodeURIComponent(region)}&country=${encodeURIComponent(country)}`,
      });
    }

    if (industry) {
      newBreadcrumbs.push({
        title: capitalizeWords(industry.replaceAll('-', ' ')),
        url: `industry?q=${encodeURIComponent(q)}&region=${encodeURIComponent(region)}&country=${encodeURIComponent(country)}&industry=${encodeURIComponent(industry)}`,
      });
    }
    if (!industry) {
      SetSelectIndustry([])
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event) {

      if (filterRef.current) {
        setIsFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterRef]);

  useEffect(() => {
    if (isFilter) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }, [isFilter]);

  useEffect(() => {
    if (!!searchParams.get('country') && !!searchParams.get('region')) {
      (async () => {
        try {
          const categorizedOptions = categorizeOptions(selectedOptions);
          const formattedRegion = searchParams.get('country').replaceAll('-', ' ')
            .split(' ')
            .map(word => (word.toLowerCase() === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)))
            .join(' ');

          const userData = JSON.parse(localStorage.getItem('userData'));
          const payload = {
            UserId: userData?.Id,
            CountryCities: searchParams.get('country') ? [formattedRegion] : [],
            Locations: selectedLocations,
            boTypes: categorizedOptions?.OpportunityType,
            IsVerified: verifiedOnly,
            IsBlackedOwned: blackOwnedOnly,
            ProfileTypes: selectedProfile,
            Industries: selectIndustry,
            PageSize: 0,
            PageNo: 0,
            ParentId: q == 'goods-producing-industries' ? 1 : 155,
            SortPrimary: primarySort?.value ? primarySort?.value : '',
            SortSecondary: secondarySort?.value ? secondarySort?.value : '',
            SortTertiary: tertiarySort?.value ? tertiarySort?.value : '',
            SortQuaternary: quaternarySort?.value ? quaternarySort?.value : '',
            MatchesType: categorizedOptions?.MatchType?.length > 0 ? categorizedOptions?.MatchType : [1],
          };

          const result = await industryApi.getIndustryProfiles(payload);
          setIndustriesData(result);
        } catch (error) {
          console.error('Error fetching industry profiles:', error);
        }
      })();
    }
  }, [
    selectedOptions,
    selectedProfile,
    selectIndustry,
    selectedLocations,
    blackOwnedOnly,
    verifiedOnly,
    secondarySort,
    primarySort,
    tertiarySort,
    quaternarySort,
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

  useEffect(() => {
    (async () => {
      try {
        const locationsList = await industryApi.getLocationsListV1();
        const filterLocations = [
          {
            title: 'Locations',
            options: locationsList?.map((location: any) => ({
              id: location.RegionName,
              label: location.RegionName,
            })),
          },
        ];
        setLocations(filterLocations);

        const profiles = await industryApi.getUserProfileTypes();
        const profileType = [
          {
            title: 'Profile Type',
            options: profiles?.map((profile) => ({
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

  const findIdByIndustry = (industryName) => {
    const entry = Object.entries(industriesMap).find(
      ([key, value]) => value === industryName
    );
    return entry ? entry[0] : null;
  };

  useEffect(() => {
    (async () => {
      if (industrySearch) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const id = findIdByIndustry(industrySearch);

        const industries = await industryApi.getIndustriesIdWise(id, userData?.Id);
        const industryTabs = [
          {
            title: capitalizeWords(industrySearch?.replaceAll('-', ' ')),
            options: industries?.map((industry) => ({
              id: industry?.Id,
              label: industry?.IndustryName,
            })),
          },
        ];

        SetIndustries(industryTabs);
      }
    })();
  }, [industrySearch, pathname]);

  useEffect(() => {
    if (searchParams.get('region')) {
      const formattedRegion = searchParams.get('region').replaceAll('-', ' ')
        .split(' ')
        .map(word => (word.toLowerCase() === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(' ')
      const selectedRegion = validRegions.find(region => region.value === formattedRegion);

      if (selectedRegion) {
        setSelectedLocations([selectedRegion.value]);
      }
    }
  }, [searchParams])

  return (
    <div className="px-6">
      <div className="py-6">
        <div>
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
          {searchParams.get('region') && !searchParams.get('country') && !searchParams.get('industry') ? (
            <div className="grid grid-cols-12 gap-5 py-6">
              {locationData.map((item, index) => (
                <Link
                  href={`industry?q=${searchParams.get('q')}&region=${searchParams.get('region')}&country=${item?.CountryName
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
            </div>
          ) : null}
          {searchParams.get('region') && searchParams.get('country') && !searchParams.get('industry') ? (
            <div className="grid grid-cols-12 gap-5 py-6">
              {tabs.map((item, index) => (
                <Link
                  href={`industry?q=${searchParams.get('q')}&region=${searchParams.get('region')}&country=${searchParams.get('country')}&industry=${item
                    .split(' ')
                    .join('-')
                    .replaceAll(',', '')
                    .toLowerCase()}`}
                  key={index}
                  className={`${tabs?.length == index + 1 ? 'col-span-12' : 'col-span-6'
                    }  md:col-span-4`}
                >
                  <label
                    className={cn(
                      'border border-grey-600 w-full h-full inline-flex text-center justify-center items-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out text-h5 2xl:text-scaled-h5 font-semibold text-black-400 px-6 lg:px-14 py-3 lg:py-6'
                    )}
                  >
                    <h5>{item}</h5>
                  </label>
                </Link>
              ))}
            </div>
          ) : null}
          {!searchParams.get('region') && !searchParams.get('country') && !searchParams.get('industry') ? (
            <div className="grid grid-cols-12 gap-5 py-6">
              {regions.map((item, index) => {
                const Icon = item.IconName;
                return (
                  <Link
                    href={`industry?q=${searchParams.get('q')}&region=${item.RegionName
                      .split(' ')
                      .join('-')
                      .replaceAll(',', '')
                      .toLowerCase()}`}
                    key={index}
                    className={`${regions?.length == index + 1 ? 'col-span-12' : 'col-span-6'
                      }  md:col-span-4 w-full border rounded-lg p-6 space-y-4 border-[#D2D4DA]`}

                  >
                    <Icon className={'text-omblue-300'} />
                    <h5 className="text-h5 2xl:text-scaled-h5 text-left font-semibold text-black-400">
                      {item.RegionName}
                    </h5>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {searchParams.get('region') && searchParams.get('country') && (
            <div className="flex-grow flex md:overflow-hidden py-10">
              <div className="flex flex-col gap-4">
                <div>
                  <div
                    className={cn(
                      'col-span-3 filter-container',
                      isFilter ? 'show-filter' : ''
                    )}
                  >
                    <div
                      ref={filterRef}
                      className={cn(
                        'block flex-none hide-scrollbar bg-white shadow-filter-primary p-4 max-w-md transition-all',
                        !showFilters
                          ? 'max-h-16 overflow-hidden'
                          : 'max-h-[60rem] overflow-y-auto'
                      )}
                    >
                      {searchParams.get('industry') ? (
                        <div
                          className={cn(
                            'block flex-none hide-scrollbar bg-white max-w-md transition-all pb-3',
                            !showFilters
                              ? 'max-h-16 overflow-hidden'
                              : 'max-h-[60rem] overflow-y-auto'
                          )}
                        >
                          <div
                            className="flex items-center gap-2 mb-4"
                            onClick={() =>
                              setShowFiltersIndustry(!showFiltersIndustry)
                            }
                          >
                            <div className="h-7 w-1 bg-blue-500 rounded-e-md ipad:hidden"></div>
                            <ArrowDown
                              className="rotate-90 w-10 h-10 hidden ipad:block cursor-pointer"
                              onClick={() => setIsFilter(false)}
                            />
                            <h6 className="text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold">
                              Industry
                            </h6>
                          </div>
                          {industries?.length > 0 && (
                            <MultiSectionCheckboxAccordion
                              sections={industries}
                              selectedOptions={selectIndustry}
                              onChange={SetSelectIndustry}
                            />
                          )}
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2 mb-4">
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
                      <MultiSectionCheckboxAccordion
                        sections={locations}
                        selectedOptions={selectedLocations}
                        onChange={setSelectedLocations}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-grow md:overflow-y-auto md:p-4 flex flex-col gap-4">
                {industriesData?.length > 0 ? (
                  industriesData.map((industriesData, index) => (
                    <SearchResultCard
                      index={index}
                      key={index}
                      data={industriesData}
                    />
                  ))
                ) : (
                  <>
                    <p className="font-semibold text-2xl text-center text-gray-800">
                      There is no data{' '}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryExploreSection;
