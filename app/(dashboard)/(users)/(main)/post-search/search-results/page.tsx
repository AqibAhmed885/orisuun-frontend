'use client';

import { searchService } from '@/app/api/dashboard/profile';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Handshake from '@/icons/handshake';
import UserSearch from '@/icons/sidebar/business-development-icon';
import Users from '@/icons/sidebar/cofounder-icon';
import { debounce } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CustomSelect from '@/components/ui/select';
import Input from '@/components/ui/input';
import SearchIcon from '@/icons/sidebar/search-icon';
import ArrowDown from '@/icons/arrow-down';
import { sortOptions } from '@/data/dashboard/post';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Location from '@/icons/location';
import SearchResultCard from '@/components/cards/post-search-result-card';
import NoResultsIcon from '@/icons/no-results';
import { cn } from '@/utils/utils';
import { reports } from '@/app/api/dashboard/reports';
import SearchResultList from '@/components/lists/post-search-result-list';
import PostMapView from '@/components/maps/post-search-map';
import Tooltip from '@/components/ui/tooltip';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { getLocationsList } from '@/app/api/dashboard/dashboard';
import Select from 'react-select';
import Shimmer from '@/components/ui/shimmer';
const profilesPost = [
  { icon: UserSearch, title: 'BD Opportunities', id: 1 },
  { icon: Users, title: 'Co-Founder Posts', id: 2 },
  { icon: Handshake, title: 'BoD Member Posts', id: 3 },
];

export default function SearchResults() {
  const profilesComponent = profilesPost;
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchCityValue = searchParams.get('city');
  const searchValue = searchParams.get('searchQuery');
  const profileValue = searchParams.get('profileType') || 1;
  const isMobile = useMobileMediaQuery();
  const [selected, setSelected] = useState(profileValue);
  const [profileText, setProfileText] = useState(searchValue);
  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [results, setResults] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedView, setSelectedView] = useState('card');
  const [filterData, setFilterData] = useState([]);
  const [filterBy, setFilterBy] = useState({ opportunityType: [], strategy: [], tactics: [], industries: [], tags: [], geography: [], roleSought: [] })
  const [dropDownValues, setDropDownValues] = useState({ strategy: [], tactics: [], industries: [], geography: [], roleSought: [] })
  const [sortBy, setSortBy] = useState({ item: 'CreatedOn', order: 'asc' })
  const [citySuggestionFocused, setCitySuggestionFocused] = useState(false)
  const [orderBy, setOrderBy] = useState<{
    memberName: 'asc' | 'desc';
    industry: 'asc' | 'desc';
    strategy: 'asc' | 'desc';
  }>({
    memberName: 'asc',
    industry: 'asc',
    strategy: 'asc'
  });

  const filterRef = useRef(null); // Step 1: Create a ref
  const pathname = usePathname();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

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

  useEffect(() => {
    setFilterData(results);
    setFilterBy({ opportunityType: [], strategy: [], tactics: [], industries: [], tags: [], geography: [], roleSought: [] })
    setSortBy({ item: 'CreatedOn', order: 'asc' })
    var geography = [], industries = [], strategy = [], tactics = [], roleSought = []
    if (results && results?.length > 0) {
      // Geography
      geography = results
        .flatMap(i => i.BusinessLocation?.map(j => j.value?.trim()).filter(Boolean) || [])
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a.localeCompare(b));

      if (results && results[0].MatchType == 1) {
        // Industries
        industries = results
          .flatMap(i => i.ChildIndustries?.map(j => j.IndustryName?.trim()).filter(Boolean) || [])
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a.localeCompare(b));

        // Strategy
        strategy = results
          .map(i => i.StrategyName?.trim())
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a.localeCompare(b));

        // Tactics
        tactics = results
          .flatMap(i => i.Tactics?.map(t => t?.trim()).filter(Boolean) || [])
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a.localeCompare(b));
      }
      else if (results && results[0].MatchType == 2) {
        // Role Sought
        roleSought = results
          .map(i => i.RoleSought?.trim())
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a.localeCompare(b));
      }
    }
    setDropDownValues({ strategy: strategy, tactics: tactics, industries: industries, geography: geography, roleSought: roleSought })
  }, [results])

  function splitCamelCase(word) {
    if (!word) return "";
    return word.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

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
  }, [selected]);

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

  const handleSearch = async () => {
    setLoader(true);
    try {
      const payload = {
        CityId: city?.Id ? city?.Id : 0,
        MainSearch: profileText?.length >= 0 ? profileText : searchValue || '',
        UserId: currentUser.Id,
        MatchesType: pathname.includes('/post-search') ? (selected == 3 ? 1002 : selected) : 1,
      };
      const results = await reports.getFilteredPosts(payload);
      setResults(results);
      updateQueryParams({
        // searchQuery: profileText?.length >= 0 ? profileText : searchValue,
        profileType: selected ? selected : profileValue,
        city: city?.Id ? city?.Id : '',
      });
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(e.target.value);

  useEffect(() => {
    //Handle Filter and Sorting
    if (results && results?.length > 0) {
      var newData = results
      //Geography Filter
      if (filterBy.geography && filterBy.geography.length > 0) {
        newData = newData.filter(item =>
          item.BusinessLocation?.some(location =>
            filterBy.geography.includes(location.value)
          )
        );
      }
      if (results[0].MatchType == 1) {
        // Opportunity Type Filter
        if (filterBy.opportunityType && filterBy.opportunityType.length > 0) {
          newData = newData.filter(item =>
            filterBy.opportunityType.includes(item.BDType)
          );
        }
        // Industry Filter
        if (filterBy.industries && filterBy.industries.length > 0) {
          newData = newData.filter(item =>
            item.ChildIndustries?.some(industry =>
              filterBy.industries.includes(industry.IndustryName)
            )
          );
        }
        // Strategy Filter
        if (filterBy.strategy && filterBy.strategy.length > 0) {
          newData = newData.filter(item =>
            filterBy.strategy.includes(item.StrategyName)
          );
        }
        // Tactics Filter
        if (filterBy.tactics && filterBy.tactics.length > 0) {
          newData = newData.filter(item =>
            item.Tactics?.some(tactic =>
              filterBy.tactics.includes(tactic)
            )
          );
        }
        // TagFilter
        if (filterBy.tags && filterBy.tags.length > 0) {
          const lowerCaseTags = filterBy.tags.map(tag => tag.toLowerCase());
          newData = newData.filter(item =>
            item.BdTags?.some(tag =>
              lowerCaseTags.includes(tag.toLowerCase())
            )
          );
        }
      }
      if (results[0].MatchType == 2) {
        // Role Sought Filter
        if (filterBy.roleSought && filterBy.roleSought.length > 0) {
          newData = newData.filter(item =>
            filterBy.roleSought.includes(item.RoleSought)
          );
        }
      }

      // Sort data after filtering
      newData = [...newData].sort((a, b) => {
        const isCreatedOn = sortBy.item === 'CreatedOn';
        const dateA = new Date(isCreatedOn ? a.CreatedDateTime : a.ExpirationDate).getTime();
        const dateB = new Date(isCreatedOn ? b.CreatedDateTime : b.ExpirationDate).getTime();

        return sortBy.order === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setFilterData(newData)
    }
  }, [results, filterBy, sortBy])

  return loader ? (
    <div className="px-2 md:px-6">
      <div className="lg:hidden flex items-center justify-between py-4">
        <Shimmer className="h-8 w-28 rounded" />
        <Shimmer className="h-8 w-28 rounded" />
        <Shimmer className="h-8 w-8 rounded-full" />
      </div>
      <form className="flex flex-row items-center gap-4 mx-auto my-4 w-full">
        <div className="flex items-center gap-4 w-full">
          <span className="relative w-full">
            <Shimmer className="h-12 w-full rounded-xl" />
          </span>
          <div className="w-full md:w-auto relative md:flex-0">
            <Shimmer className="h-12 w-64 rounded-xl" />
          </div>
          <Shimmer className="h-12 w-24 rounded-full" />
        </div>
      </form>

      <div className="py-8">
        <div className="grid grid-cols-12 gap-3">
          {/* left filter shimmer */}
          <div className="col-span-3">
            <div className="w-full max-w-md mx-auto md:border border-grey-600 rounded-md shadow-md bg-white p-4">
              <Shimmer className="h-8 w-3/4 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Shimmer key={i} className="h-6 w-full rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* results shimmer */}
          <div className="col-span-9 ipad:col-span-12 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-4 bg-white border rounded-md">
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
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="px-2 md:px-6">
        {/* <div className="flex items-center mb-3 mt-7 justify-between w-[70%] mx-auto">
          {profilesComponent?.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className={`px-4 py-2 text-sm font-semibold transition-colors relative flex items-center gap-2 ${selected == profile.id
                ? 'text-nav-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-nav-blue'
                : 'text-black-200 hover:text-nav-blue'
                }`}
              onClick={() => setSelected(profile.id)}
            >
              <profile.icon className="w-4 h-4" />
              {profile.title}
            </button>
          ))}
        </div> */}
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
                  className="text-sm font-semibold text-nav-blue"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: 'none',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      minHeight: 'auto',
                      width: '12rem',
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
            <div className="w-full md:w-auto relative md:flex-0">
              <Input
                icon={<Location className="w-4 h-4" />}
                placeholder="All Cities"
                value={city?.CityName}
                onFocus={() => setCitySuggestionFocused(true)}
                className="text-[14px] font-[600] rounded-[30px] text-[#71808E] leading-5 border border-[#EBEBEB]"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
              {(citySuggestions.length > 0 && citySuggestionFocused) && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
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
              className="bg-[#2357C6] font-[600] text-[#FFFFFF] text-[14px] leading-5 px-4 py-1 rounded-[30px] min-h-11 min-w-44"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <p className="text-[15px] font-semibold text-[#193E8D]">View Options:</p>
          <div className="flex flex-wrap items-center gap-3">
            {/* Card View */}
            <button
              onClick={() => setSelectedView('card')}
              className={`flex items-center gap-2 rounded-[30px] px-4 py-2 border border-[#D0D5DD] shadow-sm ${selectedView === 'card'
                ? 'bg-[#2357C6] text-white font-semibold'
                : 'bg-white text-[#344054] font-medium'
                }`}
              style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0026 4.9987C10.4628 4.9987 10.8359 4.6256 10.8359 4.16536C10.8359 3.70513 10.4628 3.33203 10.0026 3.33203C9.54237 3.33203 9.16927 3.70513 9.16927 4.16536C9.16927 4.6256 9.54237 4.9987 10.0026 4.9987Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.0026 10.832C10.4628 10.832 10.8359 10.4589 10.8359 9.9987C10.8359 9.53846 10.4628 9.16536 10.0026 9.16536C9.54237 9.16536 9.16927 9.53846 9.16927 9.9987C9.16927 10.4589 9.54237 10.832 10.0026 10.832Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.0026 16.6654C10.4628 16.6654 10.8359 16.2923 10.8359 15.832C10.8359 15.3718 10.4628 14.9987 10.0026 14.9987C9.54237 14.9987 9.16927 15.3718 9.16927 15.832C9.16927 16.2923 9.54237 16.6654 10.0026 16.6654Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8359 4.9987C16.2962 4.9987 16.6693 4.6256 16.6693 4.16536C16.6693 3.70513 16.2962 3.33203 15.8359 3.33203C15.3757 3.33203 15.0026 3.70513 15.0026 4.16536C15.0026 4.6256 15.3757 4.9987 15.8359 4.9987Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8359 10.832C16.2962 10.832 16.6693 10.4589 16.6693 9.9987C16.6693 9.53846 16.2962 9.16536 15.8359 9.16536C15.3757 9.16536 15.0026 9.53846 15.0026 9.9987C15.0026 10.4589 15.3757 10.832 15.8359 10.832Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8359 16.6654C16.2962 16.6654 16.6693 16.2923 16.6693 15.832C16.6693 15.3718 16.2962 14.9987 15.8359 14.9987C15.3757 14.9987 15.0026 15.3718 15.0026 15.832C15.0026 16.2923 15.3757 16.6654 15.8359 16.6654Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.16927 4.9987C4.62951 4.9987 5.0026 4.6256 5.0026 4.16536C5.0026 3.70513 4.62951 3.33203 4.16927 3.33203C3.70903 3.33203 3.33594 3.70513 3.33594 4.16536C3.33594 4.6256 3.70903 4.9987 4.16927 4.9987Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.16927 10.832C4.62951 10.832 5.0026 10.4589 5.0026 9.9987C5.0026 9.53846 4.62951 9.16536 4.16927 9.16536C3.70903 9.16536 3.33594 9.53846 3.33594 9.9987C3.33594 10.4589 3.70903 10.832 4.16927 10.832Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.16927 16.6654C4.62951 16.6654 5.0026 16.2923 5.0026 15.832C5.0026 15.3718 4.62951 14.9987 4.16927 14.9987C3.70903 14.9987 3.33594 15.3718 3.33594 15.832C3.33594 16.2923 3.70903 16.6654 4.16927 16.6654Z" stroke={selectedView == 'card' ? 'white' : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 10.0013L7.5 10.0013M17.5 5.0013L7.5 5.0013M17.5 15.0013L7.5 15.0013M4.16667 10.0013C4.16667 10.4615 3.79357 10.8346 3.33333 10.8346C2.8731 10.8346 2.5 10.4615 2.5 10.0013C2.5 9.54106 2.8731 9.16797 3.33333 9.16797C3.79357 9.16797 4.16667 9.54106 4.16667 10.0013ZM4.16667 5.0013C4.16667 5.46154 3.79357 5.83464 3.33333 5.83464C2.8731 5.83464 2.5 5.46154 2.5 5.0013C2.5 4.54106 2.8731 4.16797 3.33333 4.16797C3.79357 4.16797 4.16667 4.54106 4.16667 5.0013ZM4.16667 15.0013C4.16667 15.4615 3.79357 15.8346 3.33333 15.8346C2.8731 15.8346 2.5 15.4615 2.5 15.0013C2.5 14.5411 2.8731 14.168 3.33333 14.168C3.79357 14.168 4.16667 14.5411 4.16667 15.0013Z" stroke={selectedView == 'list' ? "white" : '#344054'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span className="text-[14px] font-[600]">List View</span>
            </button>
          </div>
        </div>
        <div className="py-8">
          <div className="grid grid-cols-12 gap-3">
            {
              (selectedView == 'card' || selectedView == 'map') && (
                <div
                  ref={filterRef}
                  className={cn(
                    'col-span-3 filter-container',
                    isFilter ? 'show-filter' : ''
                  )}
                >
                  <div className="w-full max-w-md  mx-auto md:border border-grey-600 rounded-md shadow-md bg-white">
                    <div className="custom-alt h-screen overflow-auto pb-20">
                      <div className="flex items-center gap-2 mb-4 space-y-2 px-4 my-4">
                        {/* <div className="h-7 w-1 bg-blue-500 rounded-e-md ipad:hidden"></div> */}
                        <ArrowDown
                          className="rotate-90 w-10 h-10 hidden ipad:block cursor-pointer"
                          onClick={() => setIsFilter(false)}
                        />
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.33333 15H11.6667V13.3333H8.33333V15ZM2.5 5V6.66667H17.5V5H2.5ZM5 10.8333H15V9.16667H5V10.8333Z" fill="#193E8D" />
                        </svg>

                        <h6 className="text-[15px] 2xl:text-scaled-h6 text-[#193E8D] font-[600] ipad:text-center ipad:w-full">
                          Filter {selectedView == 'card' && ' & Sort'}
                        </h6>
                      </div>
                      {selectedView == 'card' && (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2 px-4">
                            <label className="text-h8 2xl:text-scaled-h10 tracking-[1px] font-semibold text-black-500">
                              Sort
                            </label>
                            <div className="grid grid-cols-5 gap-2 items-center">
                              {/* 80% -> 4/5 columns */}
                              <div className="col-span-4">
                                <CustomSelect
                                  options={sortOptions}
                                  value={sortOptions.find(option => option.value === sortBy.item)}
                                  onChange={(e) => {
                                    setSortBy((prev) => ({
                                      ...prev,
                                      item: e?.value,
                                    }));
                                  }}
                                  placeholder="Select"
                                  error={undefined}
                                />
                              </div>

                              {/* 20% -> 1/5 columns */}
                              <Tooltip content={sortBy.order === 'asc' ? 'Ascending' : 'Descending'}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSortBy((prev) => ({
                                      ...prev,
                                      order: prev.order === 'asc' ? 'desc' : 'asc',
                                    }));
                                  }}
                                  className="col-span-1 h-[100%] p-2 rounded-md border border-grey-900 bg-white hover:bg-gray-100 flex items-center justify-center"
                                  aria-label="Toggle sort direction"
                                >
                                  {sortBy.order === 'asc' ? (
                                    <svg width="22" height="22" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_5788_32896)">
                                        <path d="M25 39L33 29.8065L28.2 29.8065L28.2 20L21.8 20L21.8 29.8065L17 29.8065L25 39Z" fill="#2357C6" />
                                        <path d="M14.584 24.753H9.628L8.893 27H4L9.439 12.132H14.815L20.233 27H15.319L14.584 24.753ZM13.45 21.246L12.106 17.109L10.762 21.246H13.45Z" fill="black" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_5788_32896">
                                          <rect width="34" height="39" fill="white" transform="translate(34 39) rotate(-180)" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  ) : (
                                    <svg width="22" height="22" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_5788_32902)">
                                        <path d="M25 25L33 15.8065L28.2 15.8065L28.2 6L21.8 6L21.8 15.8065L17 15.8065L25 25Z" fill="#2357C6" />
                                        <path d="M14.584 31.753H9.628L8.893 34H4L9.439 19.132H14.815L20.233 34H15.319L14.584 31.753ZM13.45 28.246L12.106 24.109L10.762 28.246H13.45Z" fill="black" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_5788_32902">
                                          <rect width="34" height="39" fill="white" transform="translate(34 39) rotate(-180)" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  )}
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="px-2">
                        <Accordion
                          selectionMode="multiple"
                          defaultExpandedKeys={["4"]}
                          className="accrodian-main mt-4"
                        >
                          <AccordionItem key="4" aria-label="Geography" title="Geography">
                            <div className="max-h-64 overflow-y-auto pr-2">
                              <div className="flex items-end space-x-2 mb-1 p-1"
                                onClick={() => {
                                  setFilterBy((prev) => ({
                                    ...prev,
                                    geography:
                                      prev.geography.length !== dropDownValues.geography.length ? dropDownValues.geography : [],
                                  }));
                                }}>
                                <input
                                  type="checkbox"
                                  className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                  checked={filterBy.geography.length == dropDownValues.geography.length}
                                  multiple />
                                <label
                                  className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]">
                                  Select All
                                </label>
                              </div>
                              {dropDownValues.geography?.map((region, index) => (
                                <div key={index} className="flex items-end space-x-2 mb-1 p-1" onClick={() => {
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
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.geography?.includes(region)}
                                  />
                                  <label
                                    className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]"
                                  >
                                    {region}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionItem>
                        </Accordion>
                        {(results && results[0]?.MatchType == 1) && (
                          <Accordion
                            selectionMode="multiple"
                            defaultExpandedKeys={["1", "2", "3", "5", "6"]}
                            className="accrodian-main mt-0"
                          >
                            <AccordionItem key="1" aria-label="OpportunityType" title="Opportunity Type">
                              <div className='flex justify-start gap-x-5'>
                                <div className='flex items-end gap-x-2' onClick={() => {
                                  setFilterBy((prev) => {
                                    const isChecked = prev.opportunityType.includes('Seeking');
                                    return {
                                      ...prev,
                                      opportunityType: isChecked
                                        ? prev.opportunityType.filter((i) => i !== 'Seeking')
                                        : [...prev.opportunityType, 'Seeking'],
                                    };
                                  });
                                }}>
                                  <input
                                    type="checkbox"
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.opportunityType?.includes('Seeking')}
                                    multiple
                                  />
                                  <label
                                    className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]"
                                  >
                                    Seeking
                                  </label>
                                </div>
                                <div className='flex items-end gap-x-2' onClick={() => {
                                  setFilterBy((prev) => {
                                    const isChecked = prev.opportunityType.includes('Facilitate');
                                    return {
                                      ...prev,
                                      opportunityType: isChecked
                                        ? prev.opportunityType.filter((i) => i !== 'Facilitate')
                                        : [...prev.opportunityType, 'Facilitate'],
                                    };
                                  });
                                }}>
                                  <input
                                    type="checkbox"
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.opportunityType?.includes('Facilitate')}
                                    multiple
                                  />
                                  <label
                                    className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]"
                                  >
                                    Can Facilitate
                                  </label>
                                </div>
                              </div>
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="Tags" title="Tags">
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
                            </AccordionItem>
                            <AccordionItem
                              key="3"
                              aria-label="Relavant Industries"
                              title="Industries"
                              className="accordion_item 2xl:text-scaled-h10"
                            >
                              <div className="flex items-end space-x-2 mb-1 p-1"
                                onClick={() => {
                                  setFilterBy((prev) => ({
                                    ...prev,
                                    industries:
                                      prev.industries.length !== dropDownValues.industries.length ? dropDownValues.industries : [],
                                  }));
                                }}>
                                <input
                                  type="checkbox"
                                  className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                  checked={filterBy.industries?.length == dropDownValues.industries.length}
                                  multiple />
                                <label
                                  className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] text-[#475467] font-[450]">
                                  Select All
                                </label>
                              </div>
                              {dropDownValues.industries?.map((industry, index) => (
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
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    id={index.toString()}
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.industries?.includes(industry)}
                                    multiple
                                  />
                                  <label
                                    className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] text-[#475467] font-[450]"
                                  >
                                    {industry}
                                  </label>
                                </div>
                              ))}
                            </AccordionItem>
                            <AccordionItem
                              key="5"
                              aria-label="Strategy"
                              title="Strategy"
                              className="accordion_item 2xl:text-scaled-h10"
                            >
                              <div className="flex items-end space-x-2 mb-1 p-1"
                                onClick={() => {
                                  setFilterBy((prev) => ({
                                    ...prev,
                                    strategy:
                                      prev.strategy.length !== dropDownValues.strategy.length ? dropDownValues.strategy : [],
                                  }));
                                }}>
                                <input
                                  type="checkbox"
                                  className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                  checked={filterBy.strategy?.length == dropDownValues.strategy.length}
                                  multiple />
                                <label
                                  className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] text-[#475467] font-[450]">
                                  Select All
                                </label>
                              </div>
                              {dropDownValues.strategy?.map((strategy, index) => (
                                <div
                                  key={index}
                                  className="flex items-end space-x-2 mb-1 p-1"
                                  onClick={() => {
                                    setFilterBy((prev) => {
                                      const isChecked = prev.strategy.includes(strategy);
                                      return {
                                        ...prev,
                                        strategy: isChecked
                                          ? prev.strategy.filter((i) => i !== strategy)
                                          : [...prev.strategy, strategy],
                                      };
                                    });
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    id={index.toString()}
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.strategy?.includes(strategy)}
                                    multiple
                                  />
                                  <label className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] text-[#475467] font-[450]"
                                  >
                                    {strategy}
                                  </label>
                                </div>
                              ))}
                            </AccordionItem>
                            <AccordionItem key="6" aria-label="Tactics" title="Tactics">
                              <div className="max-h-64 overflow-y-auto pr-2">
                                <div className="flex items-end space-x-2 mb-1 p-1"
                                  onClick={() => {
                                    setFilterBy((prev) => ({
                                      ...prev,
                                      tactics:
                                        prev.tactics.length !== dropDownValues.tactics.length ? dropDownValues.tactics : [],
                                    }));
                                  }}>
                                  <input
                                    type="checkbox"
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.tactics?.length == dropDownValues.tactics.length}
                                    multiple />
                                  <label
                                    className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]">
                                    Select All
                                  </label>
                                </div>
                                {dropDownValues.tactics?.map((tactic, index) => (
                                  <div key={index} className="flex items-end space-x-2 mb-1 p-1"
                                    onClick={() => {
                                      setFilterBy((prev) => {
                                        const isChecked = prev.tactics.includes(tactic);
                                        return {
                                          ...prev,
                                          tactics: isChecked
                                            ? prev.tactics.filter((i) => i !== tactic)
                                            : [...prev.tactics, tactic],
                                        };
                                      });
                                    }}>
                                    <input
                                      type="checkbox"
                                      id={index.toString()}
                                      className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                      checked={filterBy.tactics?.includes(tactic)}
                                    />
                                    <label
                                      className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]"
                                    >
                                      {splitCamelCase(tactic)}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </AccordionItem>
                          </Accordion>
                        )}

                        {(results && results[0]?.MatchType == 2) && (
                          <Accordion
                            selectionMode="multiple"
                            defaultExpandedKeys={["7"]}
                            className="accrodian-main mt-0"
                          >
                            <AccordionItem key="7" aria-label="RoleSought" title="Role Sought">
                              <div className="max-h-64 overflow-y-auto pr-2">
                                <div className="flex items-end space-x-2 mb-1 p-1"
                                  onClick={() => {
                                    setFilterBy((prev) => ({
                                      ...prev,
                                      roleSought:
                                        prev.roleSought.length !== dropDownValues.roleSought.length ? dropDownValues.roleSought : [],
                                    }));
                                  }}>
                                  <input
                                    type="checkbox"
                                    className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                    checked={filterBy.roleSought?.length == dropDownValues.roleSought.length}
                                    multiple />
                                  <label
                                    className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]">
                                    Select All
                                  </label>
                                </div>
                                {dropDownValues.roleSought?.map((role, index) => (
                                  <div key={index} className="flex items-end space-x-2 mb-1 p-1" onClick={() => {
                                    setFilterBy((prev) => {
                                      const isChecked = prev.roleSought.includes(role);
                                      return {
                                        ...prev,
                                        roleSought: isChecked
                                          ? prev.roleSought.filter((i) => i !== role)
                                          : [...prev.roleSought, role],
                                      };
                                    });
                                  }}>
                                    <input
                                      type="checkbox"
                                      id={index.toString()}
                                      className="mt-[4px] w-[17px] h-[17px] 2xl:w-scaled-4.5 2xl:h-scaled-4.5 border-solid border-1 border-[#B1B1B0]"
                                      checked={filterBy.roleSought?.includes(role)}
                                    />
                                    <label
                                      className="text-[14px] 2xl:text-scaled-h10 tracking-[1px] color-[#080808]"
                                    >
                                      {role}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {selectedView == 'card' && (
              <div className="col-span-9 ipad:col-span-12 space-y-4">
                {filterData && filterData.length > 0 ? (
                  filterData.map((data, index) => (
                    <SearchResultCard
                      key={index}
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
            {(selectedView == 'list' && results && results?.length > 0) && (
              <div className="col-span-12 ipad:col-span-12 space-y-4">
                <SearchResultList
                  results={results}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                />
              </div>
            )}
            {selectedView == 'map' && (
              <div className="col-span-9 ipad:col-span-12 space-y-4">
                <PostMapView
                  results={filterData}
                />
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
}