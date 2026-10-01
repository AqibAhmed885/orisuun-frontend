'use client';

import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import SearchIcon from '@/icons/sidebar/search-icon';
import Input from '@/components/ui/input';
import Location from '@/icons/location';
import SearchResultCard from '../../../../../../components/cards/search-result-card';
import Hamburger from '@/icons/sidebar/hamburger';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import { useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import CustomSelect from '@/components/ui/select';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { searchService } from '@/app/api/dashboard/profile'
import TagsInput from 'react-tagsinput';
// import 'react-tagsinput/react-tagsinput.css';
import Switch from '@/components/ui/switch';
import ArrowDown from '@/icons/arrow-down';
import NoResultsIcon from '@/icons/no-results';
import { profiles, sortOptions, sortOptionsNonBusiness } from '@/data/dashboard/viewProfile';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import ProfileSearchResultList from '@/components/lists/profile-search-result-list';
import ProfileMapView from '@/components/maps/profile-search-map';
import { getLocationsList } from '@/app/api/dashboard/dashboard';
import TeamCard from './TeamCard'
import { settings } from '@/app/api/dashboard/settings';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Shimmer from '@/components/ui/shimmer';
import CardViewIcon from '@/icons/card-view';
import { ListVideoIcon } from 'lucide-react';
import ListViewIcon from '@/icons/list-view';
export default function SearchResults({ profilesPost }: any) {
  const profilesComponent = profilesPost ? profilesPost : profiles;
  const [values, setValues]: any = useState({
    primary: '',
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchCityValue = searchParams.get('city');
  const searchValue = searchParams.get('searchQuery');
  const profileValue = searchParams.get('profileType') || 1;
  const isMobile = useMobileMediaQuery();
  const [Industries, setIndustries] = useState([]);
  const [Geography, setGeography] = useState([]);
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState(profileValue);
  const [profileText, setProfileText] = useState(searchValue);
  const [city, setCity] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [results, setResults] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedView, setSelectedView] = useState('card');
  const [filterData, setFilterData] = useState([]);
  const [filterBy, setFilterBy] = useState({ blackOwned: false, verified: false, industries: [], tags: [], geography: [], showTeams: false })
  const [citySuggestionFocused, setCitySuggestionFocused] = useState(false)
  const [teamResults, setTeamResults] = useState([]);
  const [showTeamResults, setShowTeamResults] = useState(false);

  const filterRef = useRef(null);
  const pathname = usePathname();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const teamData = JSON.parse(localStorage.getItem('teamData'));

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
    const fetchList = async () => {
      const res = await getLocationsList();
      setCities(res);
    }
    fetchList();
  }, []);

  const updateQueryParams = (params) => {
    const query = new URLSearchParams(window.location.search);
    Object.keys(params).forEach((param) => {
      query.set(param, params[param]);
    });
    router.push(`?${query.toString()}`);
  };

  useEffect(() => {
    const debouncedSearch = debounce((text: string) => {
      if (typeof text === 'string' && text.length > 0) {
        const suggestions = searchService.getCitySuggestions(cities, text);
        setCitySuggestions(suggestions);
      } else {
        setCitySuggestions([]);
      }
    }, 300);

    if (typeof city === 'string') {
      debouncedSearch(city);
    } else if (city?.CityName) {
      debouncedSearch(city.CityName);
    } else {
      setCitySuggestions([]);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [city, cities]);

  useEffect(() => {
    const findProfile = profilesComponent.find(
      (profile) => profile.id.toString() === profileValue
    );

    setSelected(findProfile ? findProfile.id : profileValue);
    setProfileText(searchValue);
    setCity(
      searchCityValue
        ? cities
          .flatMap((region) => region.CityList)
          .find((c) => c?.Id?.toString() === searchCityValue)
        : null
    );
  }, [searchParams, profilesComponent, cities]);

  useEffect(() => {
    if (!isMobile) {
      handleSearch();
    }
  }, [
    values.primary?.value
  ]);

  const handleCitySelect = (selectedCity: any) => {
    setCity(selectedCity);
    setCitySuggestions([]);
  };

  useEffect(() => {
    if (isFilter) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }, [isFilter]);

  const handleChangeProfileText = (value: string) => {
    setProfileText(value);
  };

  const fetchTeamList = async () => {
    try {
      setLoader(true);
      const teamResponse = await settings.searchTeamByName(
        profileText?.length >= 0 ? profileText : searchValue || '', Number(selected), (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id
      );
      setTeamResults(teamResponse.Result || []);
      setShowTeamResults(teamResponse.Result?.length > 0);
    } catch {
      toast.error('Failed to fetch teams');
    } finally {
      setLoader(false);
    }
  }

  const handleSearch = async () => {
    setLoader(true);
    try {
      const payload = {
        MainSearch: profileText?.length >= 0 ? profileText : searchValue || '',
        CityId: city?.Id ? city?.Id : 0,
        Locations: [],
        BoTypes: [],
        MatchesType: pathname.includes('/profile-search') ? 1 : selected,
        ProfileTypes: pathname.includes('/profile-search') ? selected : 0,
        SortPrimary: values.primary?.value || '',
        SortSecondary: '',
        SortTertiary: '',
        SortQuaternary: '',
        Tags: [],
        IsBlackedOwned: false,
        IsVerified: false,
        IsPostSearch: pathname.includes('/profile-search') ? false : true,
        RelevantIndustries: [],
        UserId: currentUser.Id,
        IsTeam: (teamData && teamData?.isActive) ? true : false,
        TeamId: (teamData && teamData?.isActive) ? teamData?.teamId : null,
        PageSize: 1000
      };
      const results = await searchService.getFilteredProfiles(payload);
      setResults(results);
      fetchTeamList();
      updateQueryParams({
        searchQuery: profileText?.length >= 0 ? profileText : searchValue,
        profileType: selected ? selected : profileValue,
        city: city?.Id ? city?.Id : '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFilterData(results);
    setFilterBy({ blackOwned: false, verified: false, industries: [], tags: [], geography: [], showTeams: false })
    var geographyOption = [], industriesOptions = []
    if (results && results?.length > 0) {
      geographyOption = [
        ...new Set(
          results
            .map(item => item.Country)
            .filter(country => country !== null) // filter out null values
        )
      ].sort((a, b) => a.localeCompare(b));

      industriesOptions = [
        ...new Set(
          results
            .flatMap(item => item.UserIndustries || [])
            .filter(industry => industry !== null) // exclude nulls
        )
      ].sort((a, b) => a.localeCompare(b));
    }
    setGeography(geographyOption)
    setIndustries(industriesOptions)
  }, [results])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSortChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (results && results?.length > 0) {
      var newData = results
      if (filterBy.blackOwned) {
        newData = newData.filter(item => ["51-70%", "91-99%", "100%"].includes(item.BlackOwnedPercent));
      }
      if (filterBy.verified) {
        newData = newData.filter(item => item.IsVerified == true);
      }
      if (filterBy.tags && filterBy.tags?.length > 0) {
        const lowerCaseFilterTags = filterBy.tags.map(tag => tag.toLowerCase());
        newData = newData.filter(item =>
          item.UserTags?.some(tag =>
            lowerCaseFilterTags.includes(tag.toLowerCase())
          )
        );
      }
      if (filterBy.industries && filterBy.industries?.length > 0) {
        newData = newData.filter(item =>
          item.UserIndustries?.some(industry =>
            filterBy.industries.includes(industry)
          )
        );
      }
      if (filterBy.geography && filterBy.geography?.length > 0) {
        newData = newData.filter(item =>
          filterBy.geography.includes(item.Country)
        );
      }
      setFilterData(newData)
    }
  }, [results, filterBy])

  const handleProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(e.target.value);

  return (
    <>
      <div className="px-2 md:px-6">
        {/* <div className="lg:hidden flex items-center justify-between py-4">
          <Hamburger className="hamburger-top-icon" />
          <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
            Profile Search
          </p>
          <Image
            src={currentUser?.ProfilePicture || BASE_URL}
            alt="user"
            width={32}
            height={32}
            className="rounded-full h-8 w-8 me-2"
          />
        </div> */}
        <div className="hidden md:hidden rounded-xl w-full mb-4">
          <CustomSelect
            options={profilesComponent?.map((profile) => ({
              label: profile.title,
              value: profile.id.toString(),
            }))}
            onChange={(value) => {
              setSelected(parseInt(value));
            }}
            error={undefined}
            value={selected?.toString()}
            controlClasses="bg-white w-80 mx-auto"
          />
        </div>
        <form
          className="flex flex-row items-center gap-4 mx-auto my-4 w-full"
          onSubmit={handleFormSubmit}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <span className="relative w-full">
              <Input
                icon={<SearchIcon className="w-4 h-4 stroke-black-200" />}
                iconClasses="left-4"
                placeholder="Search Keywords"
                className="text-[14px] font-[600] rounded-xl text-[#71808E] leading-5 border border-[#EBEBEB] shadow-[0px_1px_2px_0px_#1018280D]"
                value={profileText}
                onChange={(e) => handleChangeProfileText(e.target.value)}
              />

              <div className="absolute z-20 right-2 top-1/2 -translate-y-1/2">
                <Select
                  options={profilesComponent.map(p => ({ value: p.id.toString(), label: p.title }))}
                  defaultValue={{ value: selected.toString(), label: profilesComponent.find(p => p.id.toString() === selected.toString())?.title || '' }}
                  onChange={(selected) => setSelected(selected?.value || '1')}
                  className="text-sm font-semibold z-10 text-nav-blue"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: 'none',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      minHeight: 'auto',
                      width: '12.5rem',
                      color: '#2357C6',
                      textAlign: 'right',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#2357C6',
                      fontWeight: '600',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#2357C6',
                      padding: 4,
                    }),
                    menu: (base) => ({
                      ...base,
                      width: '12rem',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#2357C6' : '#ffffff',
                      color: state.isFocused ? '#ffffff' : '#2357C6',
                      fontWeight: 'normal',
                      cursor: 'pointer',
                      textAlign: 'right',
                    }),
                  }}
                  components={{
                    IndicatorSeparator: null,
                  }}
                />
              </div>
            </span>

            <div className="w-full md:w-[10%] relative md:flex-0">
              <Input
                icon={<Location className="w-4 h-4" />}
                placeholder="All Cities"
                value={city?.CityName}
                onFocus={() => setCitySuggestionFocused(true)}
                className="text-[14px] font-[600] md:rounded-[30px] rounded-lg text-[#71808E] leading-5 border border-[#EBEBEB]"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
              {(citySuggestions.length > 0 && citySuggestionFocused) && (
                <ul className="absolute  w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  {citySuggestions.map((suggestion: any, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleCitySelect(suggestion)
                        setCitySuggestionFocused(false)
                      }}
                    >
                      {suggestion?.CityName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#2357C6] font-[600] text-[#FFFFFF] text-[14px] leading-5 px-4 py-1 md:rounded-[30px] rounded-lg min-h-11 w-full md:w-56 min-w-44 "
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <p className="text-sm font-semibold text-[#193E8D]">View Options:</p>
          <div className="flex flex-wrap text-nowrap items-center gap-3">
            {/* Card View */}
            <button
              onClick={() => setSelectedView('card')}
              className={`flex items-center gap-2 rounded-[30px] px-4 py-2 border border-[#D0D5DD] shadow-sm ${selectedView === 'card'
                ? 'bg-[#2357C6] text-white font-semibold'
                : 'bg-white text-[#344054] font-medium'
                }`}
              style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
            >

              <CardViewIcon viewMode={selectedView} />
              <span className="text-[14px] font-[600]">Card View </span>
            </button>

            {/* Map View */}
            <button
              onClick={() => setSelectedView('map')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 border shadow-sm ${selectedView === 'map'
                ? 'bg-[#2357C6] text-white font-semibold'
                : 'bg-white text-[#344054] font-medium'
                }`}
              style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16927 14.9496C7.4882 14.7357 5.95165 13.8897 4.87193 12.5836C3.79221 11.2775 3.25034 9.60925 3.35645 7.91795C3.46257 6.22665 4.20871 4.63921 5.44322 3.47829C6.67774 2.31736 8.30798 1.67007 10.0026 1.66797C11.6993 1.66671 13.3326 2.31242 14.5698 3.47354C15.807 4.63465 16.5549 6.2238 16.6612 7.91717C16.7674 9.61054 16.224 11.2807 15.1417 12.5874C14.0593 13.894 12.5195 14.7388 10.8359 14.9496V16.678C14.1243 16.7546 16.6693 17.2805 16.6693 17.918C16.6693 18.608 13.6843 19.168 10.0026 19.168C6.32094 19.168 3.33594 18.608 3.33594 17.918C3.33594 17.2805 5.88094 16.7546 9.16927 16.678V14.9496ZM10.0026 13.3346C11.3287 13.3346 12.6005 12.8079 13.5381 11.8702C14.4758 10.9325 15.0026 9.66072 15.0026 8.33464C15.0026 7.00855 14.4758 5.73679 13.5381 4.7991C12.6005 3.86142 11.3287 3.33464 10.0026 3.33464C8.67652 3.33464 7.40475 3.86142 6.46707 4.7991C5.52939 5.73679 5.0026 7.00855 5.0026 8.33464C5.0026 9.66072 5.52939 10.9325 6.46707 11.8702C7.40475 12.8079 8.67652 13.3346 10.0026 13.3346ZM10.0026 10.0013C9.56058 10.0013 9.13665 9.82571 8.82409 9.51315C8.51153 9.20059 8.33594 8.77666 8.33594 8.33464C8.33594 7.89261 8.51153 7.46869 8.82409 7.15613C9.13665 6.84357 9.56058 6.66797 10.0026 6.66797C10.4446 6.66797 10.8686 6.84357 11.1811 7.15613C11.4937 7.46869 11.6693 7.89261 11.6693 8.33464C11.6693 8.77666 11.4937 9.20059 11.1811 9.51315C10.8686 9.82571 10.4446 10.0013 10.0026 10.0013Z" fill={selectedView == 'map' ? 'white' : '#344054'} />
              </svg>

              <span className="text-[14px] font-[600]">Map View</span>
            </button>

            {/* List View */}
            <button
              onClick={() => setSelectedView('list')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 border shadow-sm ${selectedView === 'list'
                ? 'bg-[#2357C6] text-white font-semibold'
                : 'bg-white text-[#344054] font-medium'
                }`}
              style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
            >
              <ListViewIcon viewMode={selectedView} />
              <span className="text-[14px] font-[600]">List View</span>
            </button>
          </div>
        </div>
        {(selectedView == 'card' || selectedView == 'map') && (
          <div className="py-8">
            <div className="grid grid-cols-12 gap-3">
              <div
                ref={filterRef}
                className={cn(
                  'col-span-3 filter-container',
                  isFilter ? 'show-filter' : ''
                )}
              >
                <div className="w-full max-w-md  mx-auto md:border border-grey-600 rounded-md shadow-md bg-white">
                  <div className="custom-alt h-screen overflow-auto pb-20">
                    {/* Filter header - show shimmer while loading */}
                    <div className="flex items-center gap-2 mb-4 space-y-2 px-4 my-4">
                      {loader ? <Shimmer className="h-8 w-48" /> : (
                        <>
                          <ArrowDown
                            className="rotate-90 w-10 h-10 hidden ipad:block cursor-pointer"
                            onClick={() => setIsFilter(false)}
                          />
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 15H11.6667V13.3333H8.33333V15ZM2.5 5V6.66667H17.5V5H2.5ZM5 10.8333H15V9.16667H5V10.8333Z" fill="#193E8D" />
                          </svg>
                        </>
                      )}
                      <h6 className="text-[15px] 2xl:text-scaled-h6 text-[#193E8D] font-[600] ipad:text-center ipad:w-full">
                        Filter {selectedView == 'card' && ' & Sort'}
                      </h6>
                    </div>
                    {/* filter body - keep original content, inner sections can still use loader checks as needed */}
                    <div className="px-2">
                      <Accordion
                        selectionMode="multiple"
                        defaultExpandedKeys={["industries", "3", "4"]}
                        className="accrodian-main mt-4"
                      >
                        {(Industries && Industries.length > 0) && (
                          <AccordionItem
                            key="industries"
                            aria-label="Relavant Industries"
                            title="Industry"
                            className="accordion_item 2xl:text-scaled-h10"
                          >
                            <div className="flex items-end space-x-2 mb-1 p-1"
                              onClick={() => {
                                setFilterBy((prev) => ({
                                  ...prev,
                                  industries:
                                    prev.industries.length !== Industries.length ? Industries : [],
                                }));
                              }}>
                              <input
                                type="checkbox"
                                className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border border-[#D0D5DD]"
                                checked={filterBy.industries?.length == Industries.length}
                                multiple />
                              <label
                                className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] text-[#475467] font-[450]">
                                Select All
                              </label>
                            </div>
                            {Industries?.map((industry, index) => (
                              <div
                                key={index}
                                className="flex items-end space-x-2 mb-1 p-1"
                                onClick={() => {
                                  setFilterBy((prev) => {
                                    const isChecked = prev.industries.includes(industry);
                                    return {
                                      ...prev,
                                      industries: isChecked
                                        ? prev.industries.filter((i) => i !== industry)
                                        : [...prev.industries, industry],
                                    };
                                  });
                                }}>
                                <input
                                  type="checkbox"
                                  id={index.toString()}
                                  className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border border-[#D0D5DD]"
                                  checked={filterBy.industries.includes(industry)}
                                  multiple />
                                <label
                                  className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] text-[#475467] font-[450]"
                                >
                                  {industry}
                                </label>
                              </div>
                            ))}
                          </AccordionItem>
                        )}
                        <AccordionItem key="3" aria-label="Tags" title="Tags">
                          <div>
                            <TagsInput
                              value={filterBy.tags}
                              onChange={(e) => {
                                const filteredTags = e
                                  .filter((tag) => tag.trim() !== '')
                                  .filter((value, index, self) => self.indexOf(value) === index);
                                setFilterBy({
                                  ...filterBy,
                                  tags: filteredTags,
                                });
                              }}
                            />
                            {filterBy.tags.map((keyword, indexValue) => (
                              <p className="similiar_keywork" key={indexValue}>
                                {keyword}{' '}
                                <button
                                  onClick={() => {
                                    const filteredTags = filterBy.tags.filter(
                                      (_, index) => index !== indexValue
                                    );
                                    setFilterBy({
                                      ...filterBy,
                                      tags: filteredTags,
                                    });
                                  }}
                                >
                                  X
                                </button>
                              </p>
                            ))}
                          </div>
                          <div className="mt-4">
                            {(results && results[0]?.MatchType == "1") && (
                              <Switch
                                label="Majority Black Owned Companies Only"
                                isOn={filterBy.blackOwned}
                                onToggle={() => setFilterBy(prev => ({
                                  ...prev,
                                  blackOwned: !prev.blackOwned
                                }))}
                              />
                            )}
                            <Switch
                              label="Verified Accounts Only"
                              isOn={filterBy.verified}
                              onToggle={() => setFilterBy(prev => ({
                                ...prev,
                                verified: !prev.verified
                              }))}
                            />
                          </div>
                          <Switch
                            label="Include Team Profiles"
                            isOn={filterBy.showTeams}
                            onToggle={() => setFilterBy(prev => ({
                              ...prev,
                              showTeams: !prev.showTeams
                            }))}
                          />
                        </AccordionItem>
                        {
                          (Geography && Geography.length > 0) && (
                            <AccordionItem key="4" aria-label="Geography" title="Geography" className='font-[600] text-[14px] text-[#080808]'>
                              <div className="flex items-end space-x-2 mb-1 p-1"
                                onClick={() => {
                                  setFilterBy((prev) => ({
                                    ...prev,
                                    geography:
                                      prev.geography.length !== Geography.length ? Geography : [],
                                  }));
                                }}>
                                <input
                                  type="checkbox"
                                  className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                  checked={filterBy.geography?.length == Geography.length}
                                  multiple
                                />
                                <label
                                  className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]"
                                >
                                  Select All
                                </label>
                              </div>
                              {Geography?.map((region, index) => (
                                <div key={index} className="flex items-end space-x-2 mb-1 p-1"
                                  onClick={() => {
                                    setFilterBy((prev) => {
                                      const isChecked = prev.geography.includes(region);
                                      return {
                                        ...prev,
                                        geography: isChecked
                                          ? prev.geography.filter((i) => i !== region)
                                          : [...prev.geography, region],
                                      };
                                    });
                                  }}>
                                  <input
                                    type="checkbox"
                                    id={index.toString()}
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border border-[#D0D5DD] rounded-[6px]"
                                    checked={filterBy.geography.includes(region)}
                                    multiple
                                  />
                                  <label className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#475467] font-[450]">
                                    {region}
                                  </label>
                                </div>
                              ))}
                            </AccordionItem>
                          )
                        }
                      </Accordion>
                    </div>
                    <div className="ipad:flex hidden gap-4 border-t border-[#D2D4DA] px-4 py-4 fixed bg-white bottom-0 left-0 w-full">
                      <button
                        className="flex items-center justify-center w-full border border-omblue-100 rounded-md gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 "
                        onClick={() =>
                          setValues({
                            primary: '',
                            secondary: '',
                            tertiary: '',
                            quaternary: '',
                            tags: [],
                            relevantIndustries: [] as string[],
                            blackedOwned: false as boolean,
                            verifiedCompanies: false as boolean,
                            geographic: [],
                          })
                        }
                      >
                        <p>Clear All</p>
                      </button>
                      <button
                        className="px-5 py-3.5 gap-2 w-full text-black bg-omblue-500 rounded-md"
                        onClick={handleSearch}
                      >
                        <p className="text-h1 2xl:text-scaled-h9 font-semibold">
                          Apply
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {selectedView == 'card' && (
                <div className="col-span-9 ipad:col-span-12 space-y-4">
                  {(showTeamResults && filterBy.showTeams) && (
                    <div className="mb-8">
                      {loader ? (
                        // team list shimmer
                        Array.from({ length: 2 }).map((_, i) => (
                          <div key={i} className="mb-4">
                            <Shimmer className="h-20 w-full rounded-md" />
                          </div>
                        ))
                      ) : (
                        teamResults.map((team, index) => (
                          <TeamCard key={`team-${index}`} team={team} fetchTeamList={fetchTeamList} />
                        ))
                      )}
                    </div>
                  )}

                  {loader ? (
                    // results shimmer grid
                    <div className="grid grid-cols-1 gap-4">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="p-4 bg-white border rounded-md h-48">
                          <div className="flex items-start gap-4">
                            <Shimmer className="h-14 w-14 rounded-full" />
                            <div className="flex-1">
                              <Shimmer className="h-5 w-3/4 mb-2" />
                              <Shimmer className="h-4 w-1/2 mb-3" />
                              <Shimmer className="h-10 w-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filterData && filterData?.length > 0 ? (
                    filterData.map((data, index) => (
                      <SearchResultCard
                        key={data.ProfileDetailId || data.UserId || index}
                        index={index}
                        data={data}
                        results={filterData}
                        setResults={setResults}
                        isPostProfile={!!profilesPost}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col gap-10 h-full justify-start pt-20 items-center">
                      <NoResultsIcon className="xs:w-4/5 sm:w-auto max-w-[394px]" />
                      <p className="font-semibold xs:text-xl sm:text-2xl text-center w-full lg:pl-3 leading-6 text-blue-500">
                        No results founds
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(selectedView == 'map') && (
                <div className="col-span-9 ipad:col-span-12 space-y-4">
                  {loader ? (
                    <Shimmer className="h-96 w-full rounded-md" />
                  ) : (
                    <ProfileMapView results={filterData} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {selectedView == 'list' && (
          <div className="col-span-12 ipad:col-span-12 space-y-4 py-8">
            {loader ? (
              Array.from({ length: 8 }).map((_, i) => <Shimmer key={i} className="h-20 w-full mb-4 rounded-md" />)
            ) : filterData && filterData?.length > 0 ? (
              <ProfileSearchResultList
                results={filterData}
                filterValues={values}
                profileTypeId={selected}
              />
            ) : (
              <div className="flex flex-col gap-10 h-full justify-start pt-20 items-center">
                <NoResultsIcon className="xs:w-4/5 sm:w-auto max-w-[394px]" />
                <p className="font-semibold xs:text-xl sm:text-2xl text-center w-full lg:pl-3 leading-6 text-blue-500">
                  No results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
