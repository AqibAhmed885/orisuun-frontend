'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const RevenueSection = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selectedCurrency = watch('revenueCurrency');
  const [openCurrencyDropdown, setOpenCurrencyDropdown] = useState(false);

  const revenueCurrencyOptions = [
    { value: "$", label: "$ (USD)" },
    { value: "€", label: "€ (Euro)" },
    { value: "£", label: "£ (Pound)" },
  ];



  return (
    <div className="w-full bg-white">
      <div className="flex items-start gap-4">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
          Revenue for the last five years
        </h2>
        <div className="relative min-w-20">
          <div
            onClick={() => setOpenCurrencyDropdown(!openCurrencyDropdown)}
            className={`flex w-full justify-between items-center px-2 py-1 text-[15px] border border-gray-300 rounded-lg shadow-sm text-gray-800 cursor-pointer`}
          >
            <span>{revenueCurrencyOptions.find(i => {
              return i.value === selectedCurrency;
            })?.label || "Select Currency"}
            </span>
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform ml-1 transition-transform duration-200 ${openCurrencyDropdown ? "rotate-180" : ""
                }`}
            >
              <path
                d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                fill="#667085"
              />
            </svg>
          </div>

          {openCurrencyDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md">
              {revenueCurrencyOptions.map(option => (
                <div
                  key={option.value}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[15px] text-gray-800"
                  onClick={() => {
                    setValue('revenueCurrency', option.value);
                    setOpenCurrencyDropdown(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {typeof errors.revenueCurrency?.message === 'string' &&
          <p className='text-[16px] text-red-600'>{errors.revenueCurrency?.message}</p>
        }
      </div>
      <div className="grid grid-cols-2 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
        <div>Year</div>
        <div>Amount</div>
      </div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <input
              type="number"
              placeholder="Enter year"
              className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
              {...register(`revenue.${index}.year`)}
            />
            {errors.revenue?.[index]?.year?.message && (
              <p className="mt-1 text-[16px] text-red-600">{errors.revenue?.[index]?.year?.message}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
              {...register(`revenue.${index}.amount`)}
            />
            {errors.revenue?.[index]?.amount?.message && (
              <p className="mt-1 text-[16px] text-red-600">{errors.revenue?.[index]?.amount?.message}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueSection;
