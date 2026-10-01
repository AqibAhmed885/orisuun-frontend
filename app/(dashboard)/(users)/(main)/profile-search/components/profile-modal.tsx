import CustomModal from '@/components/ui/modal/custom-modal';
import Input from '@/components/ui/input';
import SearchIcon from '@/icons/sidebar/search-icon';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import TelescopeIcon from '@/public/search/images/Telescope-Icon.svg';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import Location from '@/icons/location';
import { profiles } from '@/data/dashboard/profile';
import { searchService } from '@/app/api/dashboard/profile';
import Select from 'react-select';

interface ProfileSearchModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const ProfileSearchModal: React.FC<ProfileSearchModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [selected, setSelected] = useState('1');
  const [profileText, setProfileText] = useState('');
  const [city, setCity] = useState<any>('');
  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);
  const [cities, setCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchList = async () => {
      const locations = await searchService.getLocationsList();
      if (locations) {
        setCities(locations);
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce((text: string) => {
      const suggestions = searchService.getCitySuggestions(cities, text);
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
      profileType: selected || '1',
    });
    router.push(`/profile-search/search-results?${searchParams.toString()}`);
    setShowModal(false);
  };

  const handleProfileText = (profile: string) => {
    setProfileText(profile);
    setProfileSuggestions([]);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCitySuggestions([]);
  };

  const setSelectProfile = (value: string) => setSelected(value);

  return (
    <CustomModal
      title="Profiles Search"
      showModal={showModal}
      setShowModal={setShowModal}
      modalSize="lg"
      className="w-screen h-screen"
      titleAlignment="center"
    >
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-blue-300 font-medium max-w-lg">
          Search our whole database for businesses, experts, mentors, investors,
          <br />
          strategists, or professionals. Start building!
        </p>

        <div className="flex flex-col items-center mt-8 gap-4 w-full">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <span className="relative w-full">
              <Input
                icon={<SearchIcon className="w-4 h-4 stroke-black-200" />}
                iconClasses="left-4"
                placeholder="Search Keywords"
                className="pl-12 text-sm font-medium rounded h-11 text-black-200 leading-5"
                onChange={(e) => handleProfileText(e.target.value)}
              />
              {/* Replace default select with custom <Select /> */}
              <div className="absolute z-20 right-2 top-1/2 -translate-y-1/2 w-52">
                <Select
                  options={profiles.map((p) => ({
                    value: p.value,
                    label: p.value === '2' ? 'Strategists' : p.label,
                  }))}
                  defaultValue={{
                    value: '1',
                    label: 'Businesses',
                  }}
                  onChange={(selected) => setSelectProfile(selected?.value || '1')}
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
                        width: '1.25rem', // larger arrow
                        height: '1.25rem',
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      width: '100%', // match parent container
                      maxWidth: '100%',
                      maxHeight: 'none', // full height
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
                className="h-11"
                onChange={(e) => setCity(e.target.value)}
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
                className="bg-nav-blue font-semibold text-white text-sm leading-5 px-4 py-1 rounded min-h-11 min-w-44"
                type="submit"
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
            className="md:w-full h-full"
          />
          <h4 className="text-2xl font-semibold text-blue-strong">
            Get Started With Search
          </h4>
        </div>
      </div>
    </CustomModal>
  );
};

export default ProfileSearchModal;
