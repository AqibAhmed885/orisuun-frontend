'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { cn } from '@/utils/utils';
import CustomSelect from '@/components/ui/select';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import SearchIcon from '@/icons/sidebar/search-icon';
import Location from '@/icons/location';
import Hamburger from '@/icons/sidebar/hamburger';
import bgImage from '@/public/images/space.png';
import logo from '@/public/images/vector/logo.svg';
import { profiles } from '../../../../../data/dashboard/profile';
import { locationService } from '@/app/api/dashboard/profile';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const ProfileSearch = () => {
  const [selected, setSelected] = useState(profiles[0]);
  const [profileText, setProfileText] = useState('');
  const [city, setCity] = useState<any>('');
  const [cities, setCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const router = useRouter();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchList = async () => {
      const locations = await locationService.getLocationsList();
      if (locations) {
        setCities(locations);
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      searchQuery: profileText.trim(),
      city: city?.Id?.toString() || '',
      profileType: selected.value.toString() || '1',
    });
    router.push(`/profile-search/search-results?${searchParams.toString()}`);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCitySuggestions([]);
  };

  return (
    <div className="relative min-h-screen">
      <Image
        src={bgImage}
        alt="Space background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      {/* Header content */}
      <div className="absolute top-0 w-full justify-between px-4 hidden ipad:flex items-center z-50 h-20 bg-white">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Profile Search
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
      <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-4">
        <Image
          src={logo}
          alt="orisuun"
          width={260}
          height={80}
          quality={100}
          priority
          className="mx-auto mb-3 w-64 h-20 2xl:w-scaled-32 2xl:h-scaled-10 text-white"
        />
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-white mb-10 mx-auto text-center">
          The Orisuun world at your fingertips
        </h5>
        {/* Profile types */}
        <div className="hidden md:flex w-full items-center justify-between xl:px-20 mb-4">
          {profiles.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                onClick={() => setSelected(item)}
                key={index}
                className={cn(
                  'cursor-pointer flex items-center gap-2 justify-center border-b-2 py-2 px-4',
                  selected.value.toString() === item.value.toString()
                    ? 'font-semibold border-white'
                    : 'font-medium border-transparent'
                )}
              >
                <Icon className="w-6 h-6 text-white" />
                <p className="text-h9 2xl:text-scaled-h9 text-white">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
        <div className="block md:hidden rounded-xl w-full mb-4">
          <CustomSelect
            options={profiles}
            onChange={(value) => setSelected(value)}
            error={undefined}
            value={selected}
            controlClasses="bg-white w-80 mx-auto"
          />
        </div>
        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center gap-4 mx-auto w-full xl:px-20"
        >
          <div className="w-full md:w-auto relative md:flex-1">
            <Input
              icon={<SearchIcon className="w-4 h-4" />}
              placeholder="Search Keywords"
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto relative md:flex-0">
            <Input
              icon={<Location className="w-4 h-4" />}
              placeholder="All Cities"
              value={city?.CityName}
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
          <div className="md:w-auto w-full">
            <Button className="ms-0" type="submit" title="Search"></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSearch;
