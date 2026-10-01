'use client';

import React, { useEffect, useState } from 'react';
import IndustrySelector from './IndustrySelector';
import { useFormContext } from 'react-hook-form';

const BusinessDetailsInfo = () => {
    const {
        register,
        setValue,
        trigger,
        watch,
        formState: { errors }
    } = useFormContext();

    const handleIndustryChange = (selected: number[]) => {
        setValue('Industries', selected);
        trigger('Industries');
    };

    const openToInvestmentRaw = watch('OpenToInvestment') || '';
    const openToInvestment = openToInvestmentRaw.split(' ').filter(Boolean);

    const handleInvestmentClick = (value: string) => {
        const currentRaw = watch('OpenToInvestment') || '';
        let selected: string[] = currentRaw.split(' ').filter(Boolean);

        if (value === 'No') {
            selected = selected.includes('No') ? [] : ['No'];
        } else {
            selected = selected.filter((v) => v !== 'No');
            if (selected.includes(value)) {
                selected = selected.filter((v) => v !== value);
            } else {
                selected.push(value);
            }
        }

        const finalValue = selected.length === 0 ? '' : selected.join(' ');
        setValue('OpenToInvestment', finalValue);
        trigger('OpenToInvestment');
    };

    const openToMentorship = watch('OpenToMentorship');
    const openToProfessionalServices = watch('OpenToProfessionalServices');
    const openToStrategyAdvisors = watch('OpenToStrategyAdvisors');
    const selectedStage = watch('Stage');
    const selectedEmployees = watch("Employees");
    const fundingStage = watch("FundingStage");
    const [openStageDropdown, setOpenStageDropdown] = useState(false);
    const [openEmployeeDropdown, setOpenEmployeeDropdown] = useState(false);
    const [openFundingStageDropdown, setOpenFundingStageDropdown] = useState(false);



    const stageOptions = [
        "Bootstrapped",
        "Small Business",
        "Mid-Size",
        "Large Business",
        "Franchisee – Single Unit",
        "Franchisee – Multi-Unit",
        "Conglomerate / Holding Company",
        "Exit Ready",
    ];
    const employeeRangeOptions = [
        "1-10",
        "11-50",
        "51-100",
        "101-500",
        "501-1000",
        "1001-5000",
        "5001-10000",
        "10001+"
    ];
    const fundingStageOptions = [
        "Not Fundraising",
        "Friends and Family",
        "Angel Stage",
        "Seed Stage",
        "Series A",
        "Series B",
        "Series C"
    ];



    return (
        <div className='w-[95%] mx-auto bg-white border border-gray-300 rounded-2xl shadow-[#1018280F] shadow-md mt-3 md:mt-5'>
            <div className="max-w-full mx-auto">
                <div className="w-full md:w-[95%] mx-auto bg-white rounded-t-2xl h-auto relative p-2 md:px-6 py-4">
                    <div className='pb-5'>
                        <h2 className='text-[16px] font-semibold'>Business Details</h2>
                    </div>

                    {/* Input Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Stage */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-gray-700">Stage<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div
                                    onClick={() => setOpenStageDropdown(!openStageDropdown)}
                                    className={`w-full flex justify-between items-center text-[16px] font-normal ${!selectedStage ? "text-gray-500" : "text-black-500"
                                        } px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none cursor-pointer`}
                                >
                                    <p>
                                        <span className="text-gray-700">
                                            {selectedStage || "Select stage"}
                                        </span>
                                    </p>
                                    <svg
                                        width="12"
                                        height="8"
                                        viewBox="0 0 12 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transform transition-transform duration-200 ${openStageDropdown ? "rotate-180" : ""
                                            }`}
                                    >
                                        <path
                                            d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                                            fill="#667085"
                                        />
                                    </svg>
                                </div>

                                {openStageDropdown && (
                                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                        {stageOptions.map((stage) => (
                                            <div
                                                key={stage}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                onClick={() => {
                                                    setValue("Stage", stage);
                                                    setOpenStageDropdown(false);
                                                }}
                                            >
                                                {stage}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {typeof errors.Stage?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.Stage.message}
                                </p>
                            )}
                        </div>

                        {/* Number of Employees */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-gray-700">Number of Employees<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div
                                    onClick={() => setOpenEmployeeDropdown(!openEmployeeDropdown)}
                                    className={`w-full flex justify-between items-center text-[16px] font-normal ${!selectedEmployees ? "text-gray-500" : "text-black-500"
                                        } px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none cursor-pointer`}
                                >
                                    <p>
                                        <span className="text-gray-700">
                                            {selectedEmployees || "Select range"}
                                        </span>
                                    </p>
                                    <svg
                                        width="12"
                                        height="8"
                                        viewBox="0 0 12 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transform transition-transform duration-200 ${openEmployeeDropdown ? "rotate-180" : ""
                                            }`}
                                    >
                                        <path
                                            d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                                            fill="#667085"
                                        />
                                    </svg>
                                </div>

                                {openEmployeeDropdown && (
                                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                        {employeeRangeOptions.map((range) => (
                                            <div
                                                key={range}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                onClick={() => {
                                                    setValue("Employees", range);
                                                    setOpenEmployeeDropdown(false);
                                                }}
                                            >
                                                {range}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {typeof errors.Employees?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.Employees.message}
                                </p>
                            )}
                        </div>

                        {/* Year Founded */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-gray-700">Year Founded <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                placeholder="eg., 2019"
                                {...register('Founded')}
                                className="w-full px-4 py-2 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none"
                            />
                            {typeof errors.Founded?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.Founded.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Business Type */}
                    {/* Industry, Funding, Investment, Mentorship Row */}
                    <div className="md:flex gap-6 mt-4 items-">
                        {/* Type of Industry */}
                        <div className='md:w-1/2 w-full'>
                            <label className="block text-[16px] font-semibold text-gray-700 mb-2">In what industry is your business?<span className="text-red-500">*</span></label>
                            <IndustrySelector onChange={handleIndustryChange} />
                        </div>

                        <div className='flex flex-col md:gap-8  md:w-1/2 w-full'>
                            {/* Funding Stage */}
                            <div className=' w-full '>
                                <label className="block text-[16px] font-semibold text-gray-700 mt-2 mb-2">Funding Stage<span className="text-red-500">*</span></label>
                                <div className="relative py-2">
                                    <div
                                        onClick={() => setOpenFundingStageDropdown(!openFundingStageDropdown)}
                                        className={`w-full flex justify-between items-center text-[16px] font-normal ${!fundingStage ? "text-gray-500" : "text-black-500"
                                            } px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none cursor-pointer`}
                                    >
                                        <p>
                                            <span className="text-gray-700">
                                                {fundingStage || "Select stage"}
                                            </span>
                                        </p>
                                        <svg
                                            width="12"
                                            height="8"
                                            viewBox="0 0 12 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`transform transition-transform duration-200 ${openFundingStageDropdown ? "rotate-180" : ""
                                                }`}
                                        >
                                            <path
                                                d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                                                fill="#667085"
                                            />
                                        </svg>
                                    </div>

                                    {openFundingStageDropdown && (
                                        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                            {fundingStageOptions.map((stage) => (
                                                <div
                                                    key={stage}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                    onClick={() => {
                                                        setValue("FundingStage", stage);
                                                        setOpenFundingStageDropdown(false);
                                                    }}
                                                >
                                                    {stage}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {typeof errors.FundingStage?.message === 'string' && (
                                    <p className="mt-1 text-[16px] text-red-600">
                                        {errors.FundingStage.message}
                                    </p>
                                )}
                            </div>

                            <div className='flex flex-col md:flex-row w-full'>
                                {/* Open to Investments */}
                                <div className=' w-full mt-5'>
                                    <label className="block text-[16px] font-semibold text-gray-700 mb-2">Open to Investments<span className="text-red-500">*</span></label>
                                    <div className="flex gap-4">
                                        <div className="flex gap-4 flex-wrap">
                                            {['Debt', 'Equity', 'No'].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleInvestmentClick(option);
                                                    }}
                                                    className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToInvestment.includes(option)
                                                        ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {typeof errors.OpenToInvestment?.message === 'string' && (
                                        <p className="mt-1 text-[16px] text-red-600">
                                            {errors.OpenToInvestment.message}
                                        </p>
                                    )}
                                </div>

                                {/* Open to Mentorship */}
                                <div className=' w-full mt-5'>
                                    <label className="block text-[16px] font-semibold text-gray-700 mb-2">
                                        Open to Mentorship
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setValue('OpenToMentorship', 'Yes');
                                                trigger('OpenToMentorship');
                                            }}
                                            className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToMentorship === 'Yes'
                                                ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>Yes</button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setValue('OpenToMentorship', 'No');
                                                trigger('OpenToMentorship');
                                            }}
                                            className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToMentorship === 'No'
                                                ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>No</button>
                                    </div>
                                    {typeof errors.OpenToMentorship?.message === 'string' && (
                                        <p className="mt-1 text-[16px] text-red-600">
                                            {errors.OpenToMentorship.message}
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="block text-[16px] font-semibold text-gray-700">
                                        Open to Professional Services
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('OpenToProfessionalServices', true);
                                                trigger('OpenToProfessionalServices');
                                            }}
                                            className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToProfessionalServices === true
                                                ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('OpenToProfessionalServices', false);
                                                trigger('OpenToProfessionalServices');
                                            }}
                                            className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToProfessionalServices === false
                                                ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            No
                                        </button>
                                    </div>
                                    {typeof errors.OpenToProfessionalServices?.message === 'string' && (
                                        <p className="mt-1 text-[16px] text-red-600">
                                            {errors.OpenToProfessionalServices.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[16px] font-semibold text-gray-700">Open to Strategy Advisors<span className="text-red-500">*</span></label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('OpenToStrategyAdvisors', true);
                                                trigger('OpenToStrategyAdvisors');
                                            }}
                                            className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToStrategyAdvisors === true
                                                ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('OpenToStrategyAdvisors', false);
                                                trigger('OpenToStrategyAdvisors');
                                            }}
                                            className={`px-3 py-2 border rounded-md text-[16px] font-semibold ${openToStrategyAdvisors === false
                                                ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            No
                                        </button>
                                    </div>
                                    {typeof errors.OpenToStrategyAdvisors?.message === 'string' && (
                                        <p className="mt-1 text-[16px] text-red-600">
                                            {errors.OpenToStrategyAdvisors.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {typeof errors.Industries?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.Industries.message}
                                </p>
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailsInfo;
