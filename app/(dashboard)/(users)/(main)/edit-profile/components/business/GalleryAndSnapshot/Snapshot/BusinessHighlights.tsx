'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

const BusinessHighlights = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="w-full bg-white p-2">
      <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Business Highlights</h2>
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="flex flex-col w-full md:w-[50%]">
          <label className="text-[14px] font-semibold text-gray-700 mb-1">Business Growth</label>
          <input
            type="number"
            placeholder="Enter percentage of business growth"
            className="shadow-md rounded-lg border border-gray-300 px-4 py-2 text-[16px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('businessHighlights.growth', { valueAsNumber: true })}
          />
          {(errors.businessHighlights as any)?.growth?.message && (
            <p className="mt-1 text-[16px] text-red-600">{(errors.businessHighlights as any).growth.message}</p>
          )}
        </div>
        <div className="flex flex-col w-full md:w-[48%]">
          <label className="text-[14px] font-semibold text-gray-700 mb-1">Amount of investment</label>
          <input
            type="number"
            placeholder="Enter the amount needed for investment"
            className="shadow-md rounded-lg border border-gray-300 px-4 py-2 text-[16px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('businessHighlights.investment', { valueAsNumber: true })}
          />
          {(errors.businessHighlights as any)?.investment?.message && (
            <p className="mt-1 text-[16px] text-red-600">{(errors.businessHighlights as any).investment.message}</p>
          )}
        </div>
        <div className="flex flex-col w-full md:w-[48%]">
          <label className="text-[14px] font-semibold text-gray-700 mb-1">Regular Customers</label>
          <input
            type="number"
            placeholder="Enter number of regular customers"
            className="shadow-md rounded-lg border border-gray-300 px-4 py-2 text-[16px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('businessHighlights.RegularCustomers', { valueAsNumber: true })}
          />
          {(errors.businessHighlights as any)?.RegularCustomers?.message && (
            <p className="mt-1 text-[16px] text-red-600">{(errors.businessHighlights as any).RegularCustomers.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessHighlights;
