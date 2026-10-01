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

interface Props {
  index: number;
}

const InvestmentStageNotable = ({ index }: Props) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const stagePath = `NotableInvestments.${index}.InvestmentStage`;
  const stageFormattedPath = `NotableInvestments.${index}.InvestmentStageFormatted`;

  const selectedStages: string[] = watch(stagePath) || [];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    let updatedStages = [...selectedStages];
    if (value === 'All') {
      updatedStages = investmentStages;
    } else if (!selectedStages.includes(value)) {
      updatedStages.push(value);
    }

    setValue(stagePath, updatedStages);
    setValue(stageFormattedPath, updatedStages.join(' | '));
  };

  const removeStage = (stage: string) => {
    const updated = selectedStages.filter(s => s !== stage);
    setValue(stagePath, updated);
    setValue(stageFormattedPath, updated.join(' | '));
  };

  // Register dynamic field paths
  useEffect(() => {
    register(stagePath, { required: 'Investment stage is required' });
    register(stageFormattedPath);
  }, [register, stagePath, stageFormattedPath]);

  return (
    <div className="space-y-2 col-span-1">
      <label className="block text-[14px] font-semibold text-black-500">
        Investment Stage
      </label>

      <select
        onChange={handleSelectChange}
        className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-sm focus:outline-none"
        value=""
      >
        <option value="" disabled>Select option</option>
        <option value="All">All</option>
        {investmentStages.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>

      {/* Tag display */}
      <div className="flex flex-wrap gap-1">
        {selectedStages.map((stage, i) => (
          <span
            key={i}
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

      {typeof errors?.NotableInvestments?.[index]?.InvestmentStage?.message === 'string' && (
        <p className="text-[14px] text-red-600">
          {errors.NotableInvestments[index].InvestmentStage.message}
        </p>
      )}
    </div>
  );
};

export default InvestmentStageNotable;
