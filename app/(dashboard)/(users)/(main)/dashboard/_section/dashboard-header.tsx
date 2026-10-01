// DashboardHeader.tsx
import Input from '@/components/ui/input';
import SearchIcon from '@/icons/sidebar/search-icon';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';
import { debounce } from 'lodash';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Location from '@/icons/location';
import { useRouter } from 'next/navigation';
import { getLocationsList } from '../../../../../api/dashboard/dashboard'
import Select from 'react-select';
import { url } from 'inspector';
import Image from 'next/image';
interface Profile {
  value: string;
  label: string;
}

const profiles = [
  { label: 'Businesses', value: '1' },
  { label: 'Experts', value: '3' },
  { label: 'Consultants', value: '2' },
  { label: 'Professionals', value: '6' },
  { label: 'Mentors', value: '8' },
  { label: 'Investors', value: '7' },
  { label: 'Business Development', value: '9' },
  { label: 'Co-Founder', value: '10' },
  { label: 'Board of Directors', value: '11' },
];

export const DashboardHeader: React.FC = () => {
  const router = useRouter();

  const [cities, setCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [city, setCity] = useState<any>('');
  const [showCityInput, setShowCityInput] = useState(false);
  const [profileText, setProfileText] = useState('');
  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);
  const [selectedProfile, setSelectProfile] = useState(profiles[0].value);

  const currentUser = (() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser && typeof parsedUser === 'object' ? parsedUser : null;
    } catch (error) {
      return null;
    }
  })();

  const profileImageSrc =
    typeof currentUser?.ProfilePicture === 'string' && currentUser.ProfilePicture.trim()
      ? currentUser.ProfilePicture
      : 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png';

  const handleProfileText = (profile: string) => {
    setProfileText(profile);
    setProfileSuggestions([]);
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const result = await getLocationsList();
        setCities(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
  }, []);
  useEffect(() => {
    const findCities = cities.flatMap((region) => region.CityList);

    const debouncedSearch = debounce((text: string) => {
      const filteredCities =
        text.length > 0 &&
        findCities.filter(
          (city) =>
            typeof city.CityName === 'string' &&
            city.CityName.toLowerCase().includes(text.toLowerCase())
        );
      setCitySuggestions(filteredCities);
    }, 300);

    if (city) {
      debouncedSearch(city);
    } else {
      setCitySuggestions([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [city]);

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCitySuggestions([]);
  };

  const handleSearch = () => {
    if (!profileText.trim()) return;
    let redirectionPath = '/profile-search/search-results';
    let profileType = Number(selectedProfile)?.toString() || '1';
    if (Number(selectedProfile) > 8) {
      profileType = `${Number(profileType) - 8}`;
      redirectionPath = '/post-search/search-results';
    }
    const searchParams = new URLSearchParams({
      searchQuery: profileText.trim(),
      city: city?.Id?.toString() || '',
      profileType: profileType,
    });
    router.push(`${redirectionPath}?${searchParams.toString()}`);
  };

  const wrapperRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef?.current?.contains(event.target)) {
        setShowCityInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const profileOptions = profiles.map((profile) => ({
    value: profile.value,
    label: profile.label,
  }));

  return (
    <div className="relative flex justify-between gap-4 md:rounded-b-[35px] md:items-end flex-wrap w-full h-full min-h-72 "
      style={{
        background: `linear-gradient(87.17deg, #2357C6 -14.17%, #69B3E7 5.18%, #B9D9EB 24.54%)`,
      }}>
      <div className="flex flex-col md:flex-row align-middle text-omblue-700 h-full px-6 py-10 ">
        <Image src={profileImageSrc} alt={currentUser?.UserName || 'Profile Picture'} width={120} height={120} className="md:rounded-3xl rounded-lg w-[72px] md:w-[140px] bg-profile-frame h-[72px] md:h-[140px]  mr-4 object-cover" />
        <span className='flex flex-col gap-3'>
          <h1 className="text-[30px] md:text-[48px]  font-bold md:w-max">
            Welcome Back, {currentUser?.UserName}
          </h1>
          <h2 className="text-lg  w-max ">
            what are you going to build today?
          </h2>
        </span>
        
      </div>

      <div
        className="md:absolute relative right-0 top-0 z-10 flex xs:flex-wrap md:!flex-nowrap gap-4 items-center p-4 md:mt-4 md:mr-4"
        ref={wrapperRef}
      >
        <span className="relative flex justify-between items-center !bg-lightBlueBg rounded-[10px] pr-2 xs:w-full md:!w-max">
          
          <Input
            icon={<SearchIcon className="w-4 h-4 text-blue-500 !stroke-blue-500" />}
            iconClasses="xs:left-9 md:!left-4"
            placeholder="Search Keywords"
            className="border-none !bg-lightBlueBg text-sm font-medium placeholder:text-blue-300 leading-5"
            onChange={(e) => handleProfileText(e.target.value)}
            onFocus={() => setShowCityInput(true)}
          />

          {/* Replace native select with react-select */}
          <div className="w-32 z-50">
            <Select
              options={profiles.map(p => ({ value: p.value, label: p.label }))}
              defaultValue={{ value: '1', label: 'Businesses' }}
              onChange={(selected) => setSelectProfile(selected?.value || '1')}
              className="text-sm font-semibold text-nav-blue"
              styles={{
                control: (base) => ({
                  ...base,
                  border: 'none',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  minHeight: 'auto',
                  color: '#2357C6',
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
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#2357C6' : '#ffffff',
                  color: state.isFocused ? '#ffffff' : '#2357C6',
                  fontWeight: 'normal', // font should not be bold
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
        {showCityInput && (
          <div className="w-full md:w-auto relative md:flex-0">
            <Input
              icon={<Location className="w-4 h-4 text-black-900" />}
              placeholder="All Cities"
              value={city?.CityName}
              onChange={(e) => setCity(e.target.value)}
              iconClasses="xs:left-9 md:!left-5 "
              className="py-3 pr-4 xs:pl-[60px] lg:!pl-10  border-none !bg-lightBlueBg text-sm min-w-32 lg:max-w-32 font-medium placeholder:!text-left rounded-[10px] text-black-900 placeholder:text-blue-300 leading-5"
            />
            {citySuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {citySuggestions.map((suggestion: any, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect(suggestion)}
                  >
                    {suggestion?.CityName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="xs:w-full md:!w-max">
          <button
            className="bg-nav-blue font-semibold text-white text-sm leading-5 px-4 py-1 rounded-[10px] min-h-11 xs:min-w-full md:!min-w-32"
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
