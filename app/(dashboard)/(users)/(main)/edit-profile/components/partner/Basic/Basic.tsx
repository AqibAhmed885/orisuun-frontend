'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { useFormContext } from 'react-hook-form';

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
        <div className='md:flex-row w-[95%] mx-auto '>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Business Name*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter business name"
                            {...register('FirstName')}
                        />
                        {typeof errors.FirstName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.FirstName.message}</p>
                        )}
                    </div>

                    {/* Website for Individual */}
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

                {/* For Individual: Only Tagline */}
                <div className="w-full grid grid-cols-1 gap-6 md:col-span-2">
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
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2'>

                    {/* Country */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            Country*
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
                            City*
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
                <div className="w-full grid grid-cols-1 md:grid-cols-4 md:col-span-2 gap-6">

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Campaigns Sponsored*</label>
                        <input
                            type="number"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter # of campaigns sponsored"
                            {...register('CampaignsSponsored', { valueAsNumber: true })}
                        />
                        {typeof errors.CampaignsSponsored?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.CampaignsSponsored.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Businesses Supported*</label>
                        <input
                            type="number"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter # of businesses supported"
                            {...register('BusinessesSupported', { valueAsNumber: true })}
                        />
                        {typeof errors.BusinessesSupported?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.BusinessesSupported.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Total Invested*</label>
                        <input
                            type="number"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter total amount invested"
                            {...register('TotalInvested', { valueAsNumber: true })}
                        />
                        {typeof errors.TotalInvested?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.TotalInvested.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Years Active*</label>
                        <input
                            type="number"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter years active"
                            {...register('YearsActive', { valueAsNumber: true })}
                        />
                        {typeof errors.YearsActive?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.YearsActive.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default BasicInformation;
