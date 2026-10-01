import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';

const SessionInformation = () => {
    const { register, watch, setValue, control, formState: { errors } } = useFormContext();
    const prevServiceGeography = watch('ServiceGeography');
    const availableToMentor = watch('ConsultationAvailable');
    const [openGeographyDropdown, setOpenGeographyDropdown] = useState(false)
    const [selectedServiceGeography, setSelectedServiceGeography] = useState<string[]>([]);

    const handleSelect = (value: boolean) => {
        setValue('ConsultationAvailable', value);
    };

    useEffect(() => {
        if (!selectedServiceGeography.length && prevServiceGeography) {
            setSelectedServiceGeography(prevServiceGeography.split('|'));
        }
    }, [prevServiceGeography]);

    function handleAddServiceGeography(value: string) {
        if (!selectedServiceGeography.includes(value)) {
            setSelectedServiceGeography((prev) => [...prev, value]);
        }
    }

    function handleRemoveServiceGeography(value: string) {
        setSelectedServiceGeography((prev) => prev.filter((style) => style !== value));
    }

    useEffect(() => {
        const formattedStyles = selectedServiceGeography.join('|');
        setValue('ServiceGeography', formattedStyles);
    }, [selectedServiceGeography, setValue]);

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

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Geography of Service</h2>

                    <div className="grid grid-cols-2 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                        <div>Select service geography*</div>
                        <div>Virtual Consultation available?*</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <div className="relative">
                                <div onClick={() => { setOpenGeographyDropdown(!openGeographyDropdown) }} className={`w-full flex items-center text-[16px] font-normal text-gray-500 pr-3 pl-2 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                                    <div className="max-h-[7.5rem] overflow-y-auto">
                                        <div className="flex flex-wrap items-center gap-x-1">
                                            {selectedServiceGeography.map((val, index) => (
                                                <span
                                                    key={index}
                                                    className="flex items-center gap-x-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF]"
                                                >
                                                    {val}
                                                    <button
                                                        type="button"
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleRemoveServiceGeography(val)}
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {typeof errors.ServiceGeography?.message === 'string' && (
                                            <span className="text-red-500">
                                                {errors.ServiceGeography.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className='ml-2 flex-grow'>
                                        <div className=' flex justify-between items-center w-full'>
                                            <p>Select geography</p>
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 ${openGeographyDropdown ? 'rotate-180' : ''
                                                }`}>
                                                <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z" fill="#667085" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className='w-full flex justify-end'>
                                    {/* Dropdown options */}
                                    {(openGeographyDropdown && locations.length > 0) && (
                                        <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                            {locations.map((rate) => (
                                                <div
                                                    key={rate.value}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                    onClick={() => {
                                                        handleAddServiceGeography(rate.label);
                                                        setOpenGeographyDropdown(false);
                                                    }}
                                                >
                                                    {rate.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex gap-4 font-semibold">
                                <button
                                    type="button"
                                    onClick={() => handleSelect(true)}
                                    className={`px-5 py-2 rounded-lg shadow-md border 
                        ${availableToMentor === true ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]' : 'bg-white text-gray-900 border-gray-400'}`}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(false)}
                                    className={`px-5 py-3 rounded-lg shadow-md border 
                        ${availableToMentor === false ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]' : 'bg-white text-gray-900 border-gray-400'}`}
                                >
                                    No
                                </button>
                            </div>

                            <input type="hidden" {...register('ConsultationAvailable')} />

                            {typeof errors.ConsultationAvailable?.message === 'string' && (
                                <span className="text-red-500">
                                    {errors.ConsultationAvailable.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SessionInformation;
