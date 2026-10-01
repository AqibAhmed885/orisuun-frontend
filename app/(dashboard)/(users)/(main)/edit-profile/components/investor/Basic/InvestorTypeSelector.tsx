'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const FirmInvestorTypes = ["Angel", "VC", "Private Equity"];
const IndividualInvestorTypes = ["Angel"];

const InvestorTypeSelector = ({ investorType }) => {
  const { setValue, watch, formState: { errors }, register } = useFormContext();
  const selectedTypes: string[] = watch('InvestorType') || [];

  const options = investorType === 'firm' ? FirmInvestorTypes : IndividualInvestorTypes;

  const updateFormatted = (types: string[]) => {
    setValue('InvestorTypeFormatted', types.join(' | '));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    let updated = [...selectedTypes];
    if (value === 'All') {
      updated = options;
    } else if (!selectedTypes.includes(value)) {
      updated.push(value);
    }

    setValue('InvestorType', updated);
    updateFormatted(updated);
  };

  const removeStage = (type: string) => {
    const updated = selectedTypes.filter(t => t !== type);
    setValue('InvestorType', updated);
    updateFormatted(updated);
  };

  useEffect(() => {
      if (selectedTypes.length > 0) {
        setValue('InvestorTypeFormatted', selectedTypes.join(' | '));
      }
    }, []);

  useEffect(() => {
    register('InvestorType');
    register('InvestorTypeFormatted');

    if(selectedTypes.length > 0){
      setValue('InvestorTypeFormatted', selectedTypes.join(' | '));
    }
  }, [register, selectedTypes]);

  return (
    <div className="space-y-2 col-span-1">
      <label className="block text-[16px] font-semibold text-black-500">Investor Type*</label>

      <select
        onChange={handleSelectChange}
        className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-sm focus:outline-none"
        value=""
      >
        <option value="" disabled>Select Type</option>
        {investorType === 'firm' && <option value="All">All</option>}
        {options.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {/* Tag display */}
      <div className="flex flex-wrap gap-1">
        {selectedTypes.map((type, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF] mt-2"
          >
            {type}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => removeStage(type)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {typeof errors.InvestorType?.message === 'string' && (
        <p className="text-[14px] text-red-600">{errors.InvestorType.message}</p>
      )}
    </div>
  );
};

export default InvestorTypeSelector;
