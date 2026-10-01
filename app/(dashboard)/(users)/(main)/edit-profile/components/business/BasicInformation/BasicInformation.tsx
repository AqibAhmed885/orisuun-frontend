'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { useFormContext } from 'react-hook-form';
import UserIcon from '../../../../../../../../icons/profile-creation/Icon.png';
import ImageUploadSection from './ProfileImage';

interface ICities {
    label: string;
    value: string;
}

const ownershipPercentageOptions = [
    { value: '0%', label: '0%' },
    { value: '1-10%', label: '1-10%' },
    { value: '11-30%', label: '11-30%' },
    { value: '31-50%', label: '31-50%' },
    { value: '51-70%', label: '51-70%' },
    { value: '91-99%', label: '91-99%' },
    { value: '100%', label: '100%' },
];

interface IBasicInformationProps {
    isverified?: boolean;
}
const BasicInformation = ({ isverified }: IBasicInformationProps) => {
    const {
        register,
        formState: { errors },
        setValue,
        watch
    } = useFormContext();

    const [cityList, setCityList] = useState<
        { id: number; value: string; label: string }[]
    >([]);

    const selectedCountry = watch('Country');
    const selectedState = watch('State');
    const selectedCity = watch('City');
    const selectedOwnership = watch('BlackOwnershipPercentage');
    const selectedEthnicity = watch('EthnicityOfBlackOwnership')

    const [locations, setLocations] = useState([]);
    const [cities, setCities] = useState<Array<ICities>>();
    const [stateList, setStateList] = useState<Array<ICities>>();
    const [openCountryDropdown, setOpenCountryDropdown] = useState(false)
    const [openStateDropdown, setOpenStateDropdown] = useState(false)
    const [openCityDropdown, setOpenCityDropdown] = useState(false)
    const [openEthnicityDropdown, setOpenEthnicityDropdown] = useState(false)
    const [openOwnershipDropdown, setOpenOwnershipDropdown] = useState(false)
    const [countryQuery, setCountryQuery] = useState('')
    const [stateQuery, setStateQuery] = useState('')
    const [cityQuery, setCityQuery] = useState('')
    const [creatingCustomCity, setCreatingCustomCity] = useState(false)
    const countryDropdownRef = useRef<HTMLDivElement | null>(null)
    const stateDropdownRef = useRef<HTMLDivElement | null>(null)
    const cityDropdownRef = useRef<HTMLDivElement | null>(null)
    const currentUser = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('userData') || 'null')
        : null

    const filteredLocations = locations.filter((location) =>
        location.label.toLowerCase().includes(countryQuery.toLowerCase())
    )

    const filteredStateList = stateList?.filter((state) =>
        state.label.toLowerCase().includes(stateQuery.toLowerCase())
    )

    const filteredCities = cities?.filter((city) =>
        city.label.toLowerCase().includes(cityQuery.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
                setOpenCountryDropdown(false);
            }

            if (stateDropdownRef.current && !stateDropdownRef.current.contains(target)) {
                setOpenStateDropdown(false);
            }

            if (cityDropdownRef.current && !cityDropdownRef.current.contains(target)) {
                setOpenCityDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setCountryQuery(
            locations.find((location) => location.value?.toString() === selectedCountry)?.label || ''
        );
    }, [selectedCountry, locations]);

    useEffect(() => {
        setStateQuery(
            stateList?.find((state) => state.value?.toString() === selectedState)?.label || ''
        );
    }, [selectedState, stateList]);

    useEffect(() => {
        setCityQuery(
            cities?.find((city) => city.value?.toString() === selectedCity)?.label || ''
        );
    }, [selectedCity, cities]);

    useEffect(() => {
        if (!selectedCountry) return;

        (async () => {
            try {
                const res = await axios.post(
                    `${apiEndpoint}/Profile/GetCityByRegion`,
                    {
                        CountryId: selectedCountry,
                        userId: currentUser?.Id,
                    },
                    {
                        headers: {
                            XApiKey:
                                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                        },
                    }
                );

                console.log('City by Region response:', res); // Debug log to check API response
                if (res.status === 200 && res.data.Result) {
                    const ethnicityList = res.data.Result.map((item) => ({
                        id: item.Id,
                        value: item.Id.toString(),
                        label: item.CityName,
                    }));
                    setCityList(ethnicityList);
                }
            } catch (error) {
                console.error('Error fetching ethnicity list:', error);
            }
        })();
    }, [selectedCountry]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                });
                if (res.status === 200) {
                    const locations = res.data.Result;
                    setLocations(
                        locations.map((location) => ({
                            label: location?.CountryName,
                            value: (location?.Id).toString(),
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching country list:', error);
            }
        })();
    }, []);


    const handleGetStatesOfCountry = async (Country: string) => {
        try {
            if (!Country) return;
            const res = await axios.post(
                `${apiEndpoint}/Profile/GetCityStateList`,
                {
                    CountryId: Country,
                },
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (res.status === 200) {
                const statesList = res.data.Result;
                const formattedStateList = statesList?.StateData.map((item) => ({
                    value: item.Id.toString(),
                    label: item.StateName,
                }));
                setStateList(formattedStateList);
                const formattedCityList = res.data.Result?.CityData?.map((item) => ({
                    value: item.Id.toString(),
                    label: item.CityName,
                }));
                setCities(formattedCityList);
            }
        } catch (error) {
            console.error('Error fetching country list:', error);
        }
    }

    const handleCountrySelect = (countryValue: string, countryLabel: string) => {
        setValue('Country', countryValue);
        setValue('State', '');
        setValue('City', '');
        setCountryQuery(countryLabel);
        setStateQuery('');
        setCityQuery('');
        setOpenCountryDropdown(false);
        setOpenStateDropdown(false);
        setOpenCityDropdown(false);
    };

    const handleStateSelect = (stateValue: string, stateLabel: string) => {
        setValue('State', stateValue);
        setValue('City', '');
        setStateQuery(stateLabel);
        setCityQuery('');
        setOpenStateDropdown(false);
        setOpenCityDropdown(false);
    };

    const handleCitySelect = (cityValue: string, cityLabel: string) => {
        setValue('City', cityValue);
        setCityQuery(cityLabel);
        setOpenCityDropdown(false);
    };

    const handleCustomCityCommit = async () => {
        const trimmedCity = cityQuery.trim();

        if (!trimmedCity || !selectedCountry || creatingCustomCity) {
            return;
        }

        const existingCity = cities?.find(
            (city) => city.label.toLowerCase() === trimmedCity.toLowerCase()
        );

        if (existingCity) {
            handleCitySelect(existingCity.value, existingCity.label);
            return;
        }

        try {
            setCreatingCustomCity(true);

            const response = await axios.post(
                `${apiEndpoint}/Profile/AddCity`,
                {
                    CityName: trimmedCity,
                    StateId: selectedState ? Number(selectedState) : 0,
                    CountryId: Number(selectedCountry),
                    UserId: currentUser?.Id?.toString() || '',
                },
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );

            if (response.status === 200) {
                const result = response.data?.Result;
                const createdCityId =
                    result?.Id?.toString() ||
                    result?.CityId?.toString() ||
                    result?.id?.toString() ||
                    result?.CityID?.toString();

                if (createdCityId) {
                    setCities((prev) => {
                        const nextCities = prev ? [...prev] : [];
                        const alreadyExists = nextCities.some((city) => city.value === createdCityId);

                        if (!alreadyExists) {
                            nextCities.push({ value: createdCityId, label: trimmedCity });
                        }

                        return nextCities;
                    });
                    setValue('City', createdCityId);
                } else {
                    setValue('City', trimmedCity);
                }

                setCityQuery(trimmedCity);
                setOpenCityDropdown(false);
            }
        } catch (error) {
            console.error('Error adding custom city:', error);
        } finally {
            setCreatingCustomCity(false);
        }
    };

    useEffect(() => {
        handleGetStatesOfCountry(selectedCountry);
    }, [selectedCountry])

    return (
        <div className='flex flex-col md:flex-row md:w-[95%] 3xl:pt-5 mx-auto justify-between gap-6'>
            <div className="w-full md:w-[20%] ml-2 -mt-20 md:mt-0 flex md:justify-center">
                <ImageUploadSection onImageSelect={(file) => { }} isverified={isverified} />
            </div>
            <div className="w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="space-y-2">
                    <label className="block text-[16px] font-semibold text-black-500">Business Name<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your business name"
                        {...register('BusinessName')}
                    />
                    {typeof errors.BusinessName?.message === 'string' && (
                        <p className="mt-1 text-[16px] text-red-600">{errors.BusinessName.message}</p>
                    )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                    <label className="block text-[16px] font-semibold text-black-500">Website</label>
                    <div className="flex items-center border border-gray-300 rounded-lg shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="px-3 py-2 text-[16px] text-black-500 bg-gray-100 border-r border-gray-300 select-none">
                            https://
                        </span>
                        <input
                            type="text"
                            placeholder="www.example.com"
                            className="flex-1 px-4 py-3 text-[16px] font-normal text-black-500 focus:outline-none"
                            {...register('Website')}
                        />
                    </div>
                    {typeof errors.Website?.message === 'string' && (
                        <p className="mt-1 text-[16px] text-red-600">{errors.Website.message}</p>
                    )}
                </div>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2'>
                    {/* Company Tagline */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Company Tagline/Bio
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="A brief, memorable tagline for your business"
                            {...register('CompanyTagline')}
                        />
                        {typeof errors.CompanyTagline?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.CompanyTagline.message}</p>
                        )}
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Street Address</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter street address"
                            {...register('StreetAddress')}
                        />
                        {typeof errors.StreetAddress?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.StreetAddress.message}</p>
                        )}
                    </div>
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2'>

                    {/* Country */}
                    <div className="space-y-2">

                        <label className="block text-[16px] font-semibold text-black-500">
                            Country<span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={countryDropdownRef}>
                            <input
                                type="text"
                                value={openCountryDropdown ? countryQuery : (locations.find((loc) => loc.value?.toString() === selectedCountry)?.label || countryQuery)}
                                onChange={(e) => {
                                    setCountryQuery(e.target.value);
                                    setOpenCountryDropdown(true);
                                }}
                                onFocus={() => setOpenCountryDropdown(true)}
                                placeholder="Select Country"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none text-[16px] font-normal ${selectedCountry == "" || selectedCountry == null ? "text-gray-500" : "text-black-500"}`}
                            />

                            {openCountryDropdown && locations.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full max-h-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                                    <div className="max-h-56 overflow-auto">
                                        {(filteredLocations.length > 0 ? filteredLocations : locations).map((rate) => (
                                            <div
                                                key={rate.value}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                onClick={() => handleCountrySelect(rate.value, rate.label)}
                                            >
                                                {rate.label}
                                            </div>
                                        ))}
                                        {filteredLocations.length === 0 && (
                                            <div className="px-4 py-2 text-[16px] text-gray-500">No countries found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {typeof errors.Country?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.Country.message}
                            </p>
                        )}

                    </div>

                    {/* State/Province */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            State/Province
                        </label>
                        {/* Custom State Dropdown */}
                        <div className="relative" ref={stateDropdownRef}>
                            <input
                                type="text"
                                value={openStateDropdown ? stateQuery : (stateList?.find((state) => state.value?.toString() === selectedState)?.label || stateQuery)}
                                onChange={(e) => {
                                    setStateQuery(e.target.value);
                                    setOpenStateDropdown(true);
                                }}
                                onFocus={() => setOpenStateDropdown(true)}
                                placeholder={selectedCountry == "" ? "Select Country First" : stateList?.length ? "Select State" : "No states found for this country"}
                                disabled={!selectedCountry}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none text-[16px] font-normal ${selectedState === "" || selectedState === null ? "text-gray-500" : "text-black-500"}`}
                            />

                            {/* Dropdown options */}
                            {openStateDropdown && stateList?.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full max-h-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                                    <div className="max-h-56 overflow-auto">
                                        {(filteredStateList?.length > 0 ? filteredStateList : stateList).map((state) => (
                                            <div
                                                key={state.value}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                onClick={() => handleStateSelect(state.value, state.label)}
                                            >
                                                {state.label}
                                            </div>
                                        ))}
                                        {filteredStateList?.length === 0 && (
                                            <div className="px-4 py-2 text-[16px] text-gray-500">No states found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {typeof errors.State?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.State.message}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            City<span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={cityDropdownRef}>
                            <input
                                type="text"
                                value={openCityDropdown ? cityQuery : (cities?.find((city) => city.value?.toString() === selectedCity)?.label || cityQuery)}
                                onChange={(e) => {
                                    setCityQuery(e.target.value);
                                    setValue('City', '');
                                    setOpenCityDropdown(true);
                                }}
                                onFocus={() => setOpenCityDropdown(true)}
                                onBlur={() => {
                                    void handleCustomCityCommit();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        void handleCustomCityCommit();
                                    }
                                }}
                                placeholder={cities?.length ? "Select City" : "Select Country First"}
                                disabled={!selectedCountry}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none text-[16px] font-normal ${selectedCity === "" || selectedCity === null ? "text-gray-500" : "text-black-500"}`}
                            />

                            {/* Dropdown options */}
                            {openCityDropdown && cities?.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full max-h-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                                    <div className="max-h-56 overflow-auto">
                                        {(filteredCities?.length > 0 ? filteredCities : cities).map((city) => (
                                            <div
                                                key={city.value}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    handleCitySelect(city.value, city.label);
                                                }}
                                            >
                                                {city.label}
                                            </div>
                                        ))}
                                        {filteredCities?.length === 0 && (
                                            <div className="px-4 py-2 text-[16px] text-gray-500">
                                                No cities found. Press Enter or leave the field to add it.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {typeof errors.City?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.City.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Grouped Section */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 md:col-span-2 gap-6">
                    {/* Business Type */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            Business Type <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="Eg, Nail Salon, Marketing Agency"
                                className="w-full appearance-none text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                {...register('BusinessType')}
                            />
                        </div>

                        {/* Error message */}
                        {typeof errors.BusinessType?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.BusinessType.message}
                            </p>
                        )}
                    </div>

                    {/* Black Ownership % */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            Black Ownership % <span className="text-red-500">*</span>
                        </label>
                        <div className="relative w-full">
                            {/* Left Icon */}
                            <img
                                src={UserIcon.src}
                                alt="User Icon"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                            />

                            {/* Custom Styled Dropdown Toggle */}
                            <div
                                onClick={() => setOpenOwnershipDropdown(!openOwnershipDropdown)}
                                className={`w-full appearance-none text-[16px] font-normal ${selectedOwnership === "" || selectedOwnership === null
                                    ? "text-gray-500"
                                    : "text-black-500"
                                    } pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-md bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            >
                                {
                                    ownershipPercentageOptions.find(
                                        (opt) => opt.value.toString() === selectedOwnership
                                    )?.label || "Select Ownership %"
                                }
                            </div>

                            {/* Right Chevron Icon */}
                           <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transform transition-transform duration-200 ${openOwnershipDropdown ? "rotate-180" : ""
                                        }`}
                                >
                                    <path
                                        d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                                        fill="#667085"
                                    />
                                </svg>
                            </div>

                            {/* Dropdown Options */}
                            {openOwnershipDropdown && ownershipPercentageOptions.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                    {ownershipPercentageOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                            onClick={() => {
                                                setValue('BlackOwnershipPercentage', option.value);
                                                setOpenOwnershipDropdown(false);
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {typeof errors.BlackOwnershipPercentage?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.BlackOwnershipPercentage.message}
                            </p>
                        )}
                    </div>

                    {/* Ethnicity */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            Ethnicity of Black Ownership <span className="text-red-500">*</span>
                        </label>

                        <div className="relative w-full">
                            {/* Dropdown Trigger */}
                            <div
                                onClick={() => setOpenEthnicityDropdown(!openEthnicityDropdown)}
                                className={`w-full text-[16px] font-normal ${selectedEthnicity === "" || selectedEthnicity === null
                                    ? "text-gray-500"
                                    : "text-black-500"
                                    } px-4 py-3 border border-gray-300 rounded-lg shadow-md bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            >
                                {
                                    cityList && cityList.length > 0
                                        ? cityList.find(opt => opt.value?.toString() === selectedEthnicity)?.label || "Select Type"
                                        : "Select Country First"
                                }
                            </div>

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transform transition-transform duration-200 ${openEthnicityDropdown ? "rotate-180" : ""
                                        }`}
                                >
                                    <path
                                        d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                                        fill="#667085"
                                    />
                                </svg>
                            </div>

                            {/* Dropdown Options */}
                            {openEthnicityDropdown && (
                                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                    {cityList && cityList.length > 0 ? (
                                        cityList.map((option) => (
                                            <div
                                                key={option.value}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                onClick={() => {
                                                    setValue('EthnicityOfBlackOwnership', option.value);
                                                    setOpenEthnicityDropdown(false);
                                                }}
                                            >
                                                {option.label}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-500 text-[16px]">Select Country First</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {typeof errors.EthnicityOfBlackOwnership?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.EthnicityOfBlackOwnership.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInformation;
