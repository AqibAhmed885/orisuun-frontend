'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const ServiceArea = () => {
    const {
        formState: { errors },
        setValue,
        watch
    } = useFormContext();

    const prevServiceAreas = watch('ServiceAreas');
    const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);
    const [openServiceAreaDropdown, setOpenServiceAreaDropdown] = useState(false)
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

    return (
        <div className="max-w-[97%] mx-auto">
            <div className="pt-5">

                <h2 className="text-[16px] font-semibold text-gray-900 mb-2">Service Area*</h2>
                <h2 className="font-semibold text-gray-700 mb-1">Select all that applies</h2>

                <div className={`w-full flex gap-2 md:gap-4 justify-between items-center text-[16px] font-normal text-gray-500 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                    <div className="flex gap-1">
                        {selectedServiceAreas.map((val, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-x-1 bg-[#EFF8FF] text-[#194185] px-2 rounded-md text-md border border-[#B2DDFF]"
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
                    <div onClick={() => { setOpenServiceAreaDropdown(!openServiceAreaDropdown) }} className='flex-grow'>
                        <div className='w-full flex justify-between items-center'>
                            <p>Select areas</p>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 ${openServiceAreaDropdown ? 'rotate-180' : ''
                                }`}>
                                <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z" fill="#667085" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='w-full flex justify-end'>
                    {/* Dropdown options */}
                    {openServiceAreaDropdown && (
                        <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                            {serviceAreas.map((area) => (
                                <div
                                    key={area.value}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                    onClick={() => {
                                        handleAddServiceAreas(area.value);
                                        setOpenServiceAreaDropdown(false);
                                    }}
                                >
                                    {area.value}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {typeof errors.ServiceAreas?.message === 'string' && (
                    <span className="text-red-500">
                        {errors.ServiceAreas.message}
                    </span>
                )}
            </div>
        </div >
    );
};

export default ServiceArea;
