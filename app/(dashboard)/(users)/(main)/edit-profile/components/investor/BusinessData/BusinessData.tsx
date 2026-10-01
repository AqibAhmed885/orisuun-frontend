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

    const [industryType, setIndustryType] = useState<'service' | 'goods'>('service');
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

    return (
        <div className='w-[95%] mx-auto min-h-[34rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-w-full mx-auto">
                <div className="w-full md:w-[95%] mx-auto bg-white rounded-t-2xl h-auto relative px-6 py-4">
                    <div className='pb-5'>
                        <h2 className='text-[16px] font-semibold'>Business Details</h2>
                    </div>

                    {/* Input Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Stage */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-gray-700">Stage</label>
                            <select {...register('Stage')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none">
                                <option value="" disabled>Select stage</option>
                                <option value="Not a startup">Not a startup</option>
                                <option value="Idea">Idea</option>
                                <option value="Research">Research</option>
                                <option value="MVP">MVP</option>
                                <option value="Post-MVP Feedback">Post-MVP Feedback</option>
                                <option value="Product-Market Fit">Product-Market Fit</option>
                                <option value="Early Growth">Early Growth</option>
                                <option value="Scaling">Scaling</option>
                            </select>
                            {typeof errors.Stage?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.Stage.message}
                                </p>
                            )}
                        </div>

                        {/* Number of Employees */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-gray-700">Number of Employees</label>
                            <select {...register('Employees')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none">
                                <option value="" disabled>Select range</option>
                                <option value="1-10">1 - 10</option>
                                <option value="11-50">11 - 50</option>
                                <option value="51-100">51-100</option>
                                <option value="101-500">101-500</option>
                                <option value="501-1000">501-1000</option>
                                <option value="1001-5000">1001-5000</option>
                                <option value="5001-10000">5001-10000</option>
                                <option value="10001+">10001+</option>
                            </select>
                            {typeof errors.Employees?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.Employees.message}
                                </p>
                            )}
                        </div>

                        {/* Year Founded */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold text-gray-700">Year Founded</label>
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
                    <div className="md:flex gap-6 mt-10 items-end">
                        {/* Type of Industry */}
                        <div className='md:w-[35%] w-full'>
                            <label className="block text-[16px] font-semibold text-gray-700 mb-2">What type of industry does your business fall under?<span className="text-red-500">*</span></label>
                            <div className="flex gap-3">
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    setIndustryType('service');
                                }}
                                    className={`${industryType === 'service'
                                        ? 'bg-[#EFF8FF] text-[#194185] font-semibold border-[#B2DDFF]'
                                        : 'border-gray-300 text-gray-700 hover:bg-white'
                                        } w-[50%] px-3 py-2 border border-gray-300 rounded-md text-[16px] hover:bg-gray-200`}>
                                    Service - Producing Industries
                                </button>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    setIndustryType('goods');
                                }}
                                    className={`${industryType === 'goods'
                                        ? 'bg-[#EFF8FF] text-[#194185] font-semibold border-[#B2DDFF]'
                                        : 'border-gray-300 text-gray-700 hover:bg-white'
                                        } w-[50%] px-3 py-2 border border-gray-300 rounded-md text-[16px] hover:bg-gray-200`}>
                                    Goods - Producing Industries
                                </button>
                            </div>
                        </div>

                        {/* Funding Stage */}
                        <div className='md:w-[20%] w-full mt-5'>
                            <label className="block text-[16px] font-semibold text-gray-700 mb-2">Funding Stage</label>
                            <select {...register('FundingStage')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-sm focus:outline-none">
                                <option value="" disabled>Select stage</option>
                                <option value="Friends and Family">Friends and Family</option>
                                <option value="Angel Stage">Angel Stage</option>
                                <option value="Seed Stage">Seed Stage</option>
                                <option value="Series A">Series A</option>
                                <option value="Series B">Series B</option>
                                <option value="Series C">Series C</option>
                            </select>
                            {typeof errors.FundingStage?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.FundingStage.message}
                                </p>
                            )}
                        </div>

                        {/* Open to Investments */}
                        <div className='md:w-[20%] w-full mt-5'>
                            <label className="block text-[16px] font-semibold text-gray-700 mb-2">Open to Investments</label>
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
                        <div className='md:w-[20%] w-full mt-5'>
                            <label className="block text-[16px] font-semibold text-gray-700 mb-2">Open to Mentorship</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setValue('OpenToMentorship', 'Yes');
                                        trigger('OpenToMentorship');
                                    }}
                                    className={`px-3 py-2 border rounded-md text-[16px] font-semibold
    ${openToMentorship === 'Yes'
                                            ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>Yes</button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setValue('OpenToMentorship', 'No');
                                        trigger('OpenToMentorship');
                                    }}
                                    className={`px-3 py-2 border rounded-md text-[16px] font-semibold
    ${openToMentorship === 'No'
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

                    {/* Industry Selection */}
                    <div className="mt-4">
                        <IndustrySelector industryType={industryType} onChange={handleIndustryChange} />
                        {typeof errors.Industries?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.Industries.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailsInfo;
