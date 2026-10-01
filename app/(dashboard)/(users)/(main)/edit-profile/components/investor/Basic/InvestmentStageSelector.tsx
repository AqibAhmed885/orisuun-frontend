'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const investmentStages = [
  "Idea",
  "Angel",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Private Equity"
];

const InvestmentStageSelector = () => {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useFormContext();

  const selectedStages: string[] = watch('InvestmentStage') || [];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    let updatedStages = [...selectedStages];
    if (value === 'All') {
      updatedStages = investmentStages;
    } else if (!selectedStages.includes(value)) {
      updatedStages = [...selectedStages, value];
    }

    setValue('InvestmentStage', updatedStages);
    setValue('InvestmentStageFormatted', updatedStages.join(' | '));
  };

  const removeStage = (stage: string) => {
    const updated = selectedStages.filter(s => s !== stage);
    setValue('InvestmentStage', updated);
    setValue('InvestmentStageFormatted', updated.join(' | '));
  };

  // Add this useEffect to handle initial values
  useEffect(() => {
    if (selectedStages.length > 0) {
      setValue('InvestmentStageFormatted', selectedStages.join(' | '));
    }
  }, []);

  // Modify the registration useEffect
  useEffect(() => {
    register('InvestmentStage');
    register('InvestmentStageFormatted');

    if (selectedStages.length > 0) {
      setValue('InvestmentStageFormatted', selectedStages.join(' | '));
    }
  }, [register, selectedStages]);

  return (
    <div className="space-y-2 col-span-1">
      <label className="block text-[16px] font-semibold text-black-500">Investment Stage*</label>

      <select
        onChange={handleSelectChange}
        className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-sm focus:outline-none"
        value=""
      >
        <option value="" disabled>Select option</option>
        <option value="All">All</option>
        {investmentStages.map((stage) => (
          <option key={stage} value={stage}>{stage}</option>
        ))}
      </select>

      {/* Tag display */}
      <div className="flex flex-wrap gap-1">
        {selectedStages.map((stage, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF] mt-2"
          >
            {stage}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => removeStage(stage)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {typeof errors.InvestmentStage?.message === 'string' && (
        <p className="text-[14px] text-red-600">{errors.InvestmentStage.message}</p>
      )}
    </div>
  );
};

export default InvestmentStageSelector;
