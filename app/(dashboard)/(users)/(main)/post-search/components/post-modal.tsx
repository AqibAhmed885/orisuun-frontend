'use client';

import CustomModal from '@/components/ui/modal/custom-modal';
import Input from '@/components/ui/input';
import SearchIcon from '@/icons/sidebar/search-icon';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import TelescopeIcon from '@/public/search/images/Telescope-Icon.svg';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import Location from '@/icons/location';
import { postSearchService } from '@/app/api/dashboard/post';
import Select from 'react-select';

export interface PostSearchModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

export interface IProfiles {
  label: string;
  value: string;
}

export const profiles: Array<IProfiles> = [
  { label: 'Business Development', value: '1' },
  { label: 'Co-Founder', value: '2' },
  { label: 'Board of Directors', value: '3' },
];

const PostSearchModal: React.FC<PostSearchModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [selected, setSelected] = useState<string>(profiles[0].value);
  const [profileText, setProfileText] = useState('');
  const [city, setCity] = useState<any>('');
  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const router = useRouter();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      const locations = await postSearchService.getLocationsList();
      if (locations) {
        setCities(locations);
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce((text: string) => {
      const suggestions = postSearchService.getCitySuggestions(cities, text);
      setCitySuggestions(suggestions);
    }, 300);

    if (city) {
      debouncedSearch(city);
    } else {
      setCitySuggestions([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [city, cities]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      searchQuery: profileText.trim(),
      city: city?.Id?.toString() || '',
      profileType: selected.toString() || '1',
    });
    router.push(`/post-search/search-results?${searchParams.toString()}`);
    setShowModal(false);
  };

  const handlePostText = (profile: string) => {
    setProfileText(profile);
    setProfileSuggestions([]);
  };

  const handleCityChange = (cityValue: string) => setCity(cityValue);

  const handleCitySelect = (selectedCity: string) => {
    handleCityChange(selectedCity);
    setCitySuggestions([]);
  };

  const handleProfileSelect = (selectedOption: any) => {
    setSelected(selectedOption.value);
  };

  return (
    <CustomModal
      title="Opportunities Search"
      showModal={showModal}
      setShowModal={setShowModal}
      modalSize="lg"
      className="w-screen h-screen"
      titleAlignment="center"
    >
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-blue-300 font-medium max-w-lg">
          Search for co-founder, board member, or business development
          <br />
          opportunities. Start building!
        </p>
        <div className="flex flex-col items-center mt-8 gap-4 w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <span className="relative w-full">
              <Input
                icon={<SearchIcon className="w-4 h-4 stroke-black-200" />}
                iconClasses="left-4"
                placeholder="Search Keywords"
                className="md:pl-12 text-sm font-medium rounded h-11 text-black-200 leading-5"
                onChange={(e) => handlePostText(e.target.value)}
              />
              <div className="absolute z-20 right-2 top-1/2 -translate-y-1/2 w-52">
                <Select
                  options={profiles.map((p) => ({
                    value: p.value,
                    label: p.label,
                  }))}
                  defaultValue={{
                    value: profiles[0].value,
                    label: profiles[0].label,
                  }}
                  onChange={handleProfileSelect}
                  className="text-sm font-semibold text-nav-blue"
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: '100%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      minHeight: 'auto',
                      textAlign: 'right',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: '0 0.5rem',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#2357C6',
                      fontWeight: '600',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#2357C6',
                      padding: 0,
                      svg: {
                        width: '1.25rem',
                        height: '1.25rem',
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      width: '100%',
                      maxWidth: '100%',
                      maxHeight: 'none',
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: 'none',
                      paddingTop: 0,
                      paddingBottom: 0,
                      overflowY: 'visible',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#2357C6' : '#ffffff',
                      color: state.isFocused ? '#ffffff' : '#2357C6',
                      fontWeight: 'normal',
                      cursor: 'pointer',
                      textAlign: 'right',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      fontSize: '1rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
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
                className='h-11'
                onChange={(e) => handleCityChange(e.target.value)}
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
            <form onSubmit={handleSearch}>
              <button
                type="submit"
                className="bg-nav-blue font-semibold text-white text-sm leading-5 px-4 py-1 rounded min-h-11 min-w-44"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-[30px] mt-8">
          <Image
            alt="Search Results"
            src={TelescopeIcon.src}
            width={301}
            height={253}
            className='md:w-full h-full'
          />
          <h4 className="text-2xl font-semibold text-blue-strong">
            Get Started With Search
          </h4>
        </div>
      </div>
    </CustomModal>
  );
};

export default PostSearchModal;