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

const BasicInformation = ({ ProfessionalType }) => {
    const {
        register,
        formState: { errors },
        setValue,
        watch
    } = useFormContext();
    const [openSuccessDropdown, setOpenSuccessDropdown] = useState(false)
    const successWatch = watch('SuccessRate')
    const selectedCountry = watch('Country');
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
                <div className={`w-full grid grid-cols-1 ${ProfessionalType == 'firm' ? "md:grid-cols-2" : "md:grid-cols-3"}  gap-6 md:col-span-2`}>
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">{ProfessionalType == 'firm' ? "Business Name*" : "First Name*"}</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder={ProfessionalType == 'firm' ? "Enter business name" : "Enter first name"}
                            {...register('FirstName')}
                        />
                        {typeof errors.FirstName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.FirstName.message}</p>
                        )}
                    </div>

                    {ProfessionalType != 'firm' && (<div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Last Name*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter last name"
                            {...register('LastName')}
                        />
                        {typeof errors.LastName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.LastName.message}</p>
                        )}
                    </div>)}

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

                <div className="w-full grid grid-cols-2 gap-6 md:col-span-2">
                    {/* Company Tagline */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Tagline/Slogan*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="A brief tagline"
                            {...register('Tagline')}
                        />
                        {typeof errors.Tagline?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Tagline.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Street Address</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter street address"
                            {...register('AddressLine1')}
                        />
                        {typeof errors.AddressLine1?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.AddressLine1.message}</p>
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
                        <label className="block text-[16px] font-semibold text-black-500">Clients Served*</label>
                        <input
                            type="number"
                            min={0}
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter # of clients served"
                            {...register('ClientsServed', { valueAsNumber: true })}
                        />
                        {typeof errors.ClientsServed?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.ClientsServed.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Status*</label>
                        <select
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            {...register('Status')}
                        >
                            <option value="" disabled>Select status</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                        {typeof errors.Status?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Status.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Success Rate*</label>
                        <div onClick={() => { setOpenSuccessDropdown(!openSuccessDropdown) }} className={`w-full flex justify-between items-center text-[16px] font-normal ${(successWatch == "" || successWatch == null) ? "text-gray-500" : "text-black-500"}  px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                            <p>
                                {(successWatch == "" || successWatch == null) ? "Select success rate" : successWatch}
                            </p>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 ${openSuccessDropdown ? 'rotate-180' : ''
                                }`}>
                                <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z" fill="#667085" />
                            </svg>
                        </div>

                        <div className='w-full flex justify-end'>
                            {/* Dropdown options */}
                            {openSuccessDropdown && (
                                <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                    {Array.from({ length: 100 }, (_, i) => `${i + 1} %`).map((rate) => (
                                        <div
                                            key={rate}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                            onClick={() => {
                                                setValue('SuccessRate', rate);
                                                setOpenSuccessDropdown(false);
                                            }}
                                        >
                                            {rate}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {typeof errors.SuccessRate?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.SuccessRate.message}</p>
                        )}
                    </div>
                    <GeographySelector locations={continents} />
                </div>
            </div>
        </div >
    );
};

export default BasicInformation;
