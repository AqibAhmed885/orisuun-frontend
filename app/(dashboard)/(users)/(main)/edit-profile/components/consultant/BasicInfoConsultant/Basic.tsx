'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { useFormContext } from 'react-hook-form';
import ImageUploadSection from './ProfileImage';
import GeographySelector from './GeographySelector';

interface ICities {
    label: string;
    value: string;
}

const BasicInformation = () => {
    const {
        register,
        formState: { errors },
        setValue,
        watch
    } = useFormContext();
    const [sliderValue, setSliderValue] = useState(1000000);
    const selectedCountry = watch('Country');
    const prevServiceAreas = watch('ServiceAreas');
    const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);

    const serviceAreas = [
        { label: "Strategic Planning", value: "Strategic Planning" },
        { label: "Organizational Design", value: "Organizational Design" },
        { label: "Process Improvement", value: "Process Improvement" },
        { label: "Financial Management", value: "Financial Management" },
        { label: "Technology Implementation", value: "Technology Implementation" },
        { label: "Mergers & Acquisitions", value: "Mergers & Acquisitions" },
        { label: "Risk Management", value: "Risk Management" },
        { label: "Talent Management", value: "Talent Management" },
        { label: "Sustainability", value: "Sustainability" },
        { label: "Supply Chain", value: "Supply Chain" },
        { label: "Data Analysis", value: "Data Analysis" },
        { label: "Government Affairs", value: "Government Affairs" },
        { label: "Growth Strategy", value: "Growth Strategy" },
        { label: "Startups", value: "Startups" },
    ];
    useEffect(() => {
        if (!selectedServiceAreas.length && prevServiceAreas) {
            setSelectedServiceAreas(prevServiceAreas.split('|'));
        }
    }, [prevServiceAreas]);

    function handleAddServiceAreas(value: string) {
        if (!selectedServiceAreas.includes(value)) {
            setSelectedServiceAreas((prev) => [...prev, value]);
        }
    }

    function handleRemoveServiceAreas(value: string) {
        setSelectedServiceAreas((prev) => prev.filter((style) => style !== value));
    }

    useEffect(() => {
        const formattedStyles = selectedServiceAreas.join('|');
        setValue('ServiceAreas', formattedStyles);
    }, [selectedServiceAreas, setValue]);

    const [locations, setLocations] = useState([]);
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

    const continents = [
        { label: "Global", value: "Global" },
        { label: "Africa", value: "Africa" },
        { label: "Antarctica", value: "Antarctica" },
        { label: "Asia", value: "Asia" },
        { label: "Europe", value: "Europe" },
        { label: "North America", value: "North America" },
        { label: "South America", value: "South America" },
        { label: "Australia", value: "Australia" },
    ];

    const [cities, setCities] = useState<Array<ICities>>();
    const [stateList, setStateList] = useState<Array<ICities>>();
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

    useEffect(() => {
        handleGetStatesOfCountry(selectedCountry);
    }, [selectedCountry])

    return (
        <div className='flex flex-col md:flex-row w-[95%] mx-auto justify-between gap-6'>
            <div className="w-full md:w-[20%] flex justify-center">
                <ImageUploadSection onImageSelect={(file) => { }} />
            </div>
            <div className="w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6 mt-[6%]">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">First Name*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter full name"
                            {...register('FirstName')}
                        />
                        {typeof errors.FirstName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.FirstName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Last Name*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter full name"
                            {...register('LastName')}
                        />
                        {typeof errors.LastName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.LastName.message}</p>
                        )}
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Website*</label>
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
                </div>

                <div className="w-full grid grid-cols-1 gap-6 md:col-span-2">
                    {/* Company Tagline */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Tagline/Slogan*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="A brief, memorable tagline"
                            {...register('Tagline')}
                        />
                        {typeof errors.Tagline?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Tagline.message}</p>
                        )}
                    </div>
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2'>
                    {/* Country */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            Country
                        </label>

                        <div className="relative">
                            {/* Styled native select */}
                            <select
                                value={watch('Country') ?? ''}
                                onChange={(e) => setValue('Country', e.target.value)}
                                {...register('Country')}
                                className="w-full px-4 py-3 text-[16px] border border-gray-300 text-black-500 rounded-lg shadow-md focus:outline-none"
                            >
                                <option className='text-gray-500' value="" disabled>
                                    Select country
                                </option>
                                {locations.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
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
                        <div className="relative">
                            {stateList ? (
                                <select {...register('State')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-black-500 rounded-lg shadow-md focus:outline-none" >
                                    {stateList && stateList?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none" >
                                    <option>
                                        Enter state/province
                                    </option>
                                    <option>
                                        Select Country first
                                    </option>
                                </select>
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
                            City
                        </label>
                        <div className="relative">
                            {cities ? (
                                <select {...register('City')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-black-500 rounded-lg shadow-md focus:outline-none" >
                                    {cities && cities?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none" >
                                    <option>
                                        Enter Your City
                                    </option>
                                    <option>
                                        Select Country first
                                    </option>
                                </select>
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
                <div className="w-full grid grid-cols-1 md:grid-cols-5 md:col-span-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Years of Experience*</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter years of experience"
                            {...register('YearsOfExperience', { valueAsNumber: true })}
                        />
                        {typeof errors.YearsOfExperience?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.YearsOfExperience.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Focus*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter area of focus"
                            {...register('Focus')}
                        />
                        {typeof errors.Focus?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Focus.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Clients Served*</label>
                        <input
                            type="number"
                            min={0}
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter clients served"
                            {...register('ClientsServed', { valueAsNumber: true })}
                        />
                        {typeof errors.ClientsServed?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.ClientsServed.message}</p>
                        )}
                    </div>
                    <GeographySelector locations={continents} />
                    <div className='space-y-2'>
                        <label className="block text-[16px] font-semibold text-black-500">Service Areas*</label>

                        <div className="relative">
                            <select
                                onChange={(e) => handleAddServiceAreas(e.target.value)}
                                className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none"
                                defaultValue=""
                            >
                                <option disabled value="">Select Service Areas</option>
                                {serviceAreas?.length > 0 &&
                                    serviceAreas.map((area) => (
                                        <option key={area.label} value={area.label}>
                                            {area.label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* ServiceAreas display */}
                        <div className="max-h-[7.5rem] overflow-y-auto pr-1">
                            <div className="flex flex-wrap gap-1">
                                {selectedServiceAreas.map((val, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF] mt-2"
                                    >
                                        {val}
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => handleRemoveServiceAreas(val)}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {typeof errors.ServiceAreas?.message === 'string' && (
                                <span className="text-red-500">
                                    {errors.ServiceAreas.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default BasicInformation;
