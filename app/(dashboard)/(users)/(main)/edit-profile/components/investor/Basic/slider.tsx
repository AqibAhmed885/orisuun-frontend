'use client';

import { Range } from 'react-range';
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const MIN = 1000;         // $1,000
const MAX = 10000000;     // $10M
const STEP = 100;        // $1,00 increments
const DEFAULT_MIN = 100000;    // $100K
const DEFAULT_MAX = 5000000;   // $5M

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const CheckSizeRange = () => {
  const { setValue, watch } = useFormContext();
  const watchedMin = watch('minCheckSize');
  const watchedMax = watch('maxCheckSize');

  const [values, setValues] = useState<[number, number]>([DEFAULT_MIN, DEFAULT_MAX]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize with API values when available, otherwise use defaults
  useEffect(() => {
    const min = watchedMin ? clamp(Number(watchedMin), MIN, MAX) : DEFAULT_MIN;
    const max = watchedMax ? clamp(Number(watchedMax), MIN, MAX) : DEFAULT_MAX;

    if (min !== values[0] || max !== values[1]) {
      setValues([min, max]);
    }

    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [watchedMin, watchedMax]);


  // Update form values when slider stops moving
  const handleFinalChange = (vals: number[]) => {
    setValues([vals[0], vals[1]]);
    setIsDragging(false);
    setValue('minCheckSize', vals[0], { shouldDirty: true });
    setValue('maxCheckSize', vals[1], { shouldDirty: true });

  };

  // While dragging, only update local state
  const handleChange = (vals: number[]) => {
    if (!isDragging) setIsDragging(true);
    setValues([vals[0], vals[1]]);
  };

  // Loading state until initialized
  if (!isInitialized) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <label className="block text-[16px] font-semibold text-[#1F2937] mb-5">
          Check Size*
        </label>
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="block text-[16px] font-semibold text-[#1F2937] mb-5">
        Check Size*
      </label>

      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={handleChange}
        onFinalChange={handleFinalChange}
        renderTrack={({ props, children }) => (
          <div {...props} className="h-2 w-full rounded-full bg-gray-200 relative">
            <div
              className="absolute h-2 rounded-full bg-[#2D65DD]"
              style={{
                left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="w-6 h-6 rounded-full bg-white border-2 border-[#2D65DD] shadow-md flex items-center justify-center relative focus:outline-none"
          >
            <div className="absolute -top-7 w-[70px] text-center">
              <div className="bg-white shadow text-[#344054] text-[10px] font-semibold rounded-xl px-1 py-0.5">
                ${values[index].toLocaleString()}
              </div>
            </div>
          </div>
        )}
      />

      <div className="flex justify-between text-[12px] text-[#4D5C7A] mt-2 px-1">
        <span>Minimum value - $1,000</span>
        <span>Maximum value of $10M</span>
      </div>
    </div>
  );
};

export default CheckSizeRange;