'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const GeographySelector = ({ locations }) => {
  const {
    setValue,
    watch,
    formState: { errors },
    register
  } = useFormContext();

  const selectedGeographies: string[] = watch('Geography') || [];
  const selectedCountry = watch('Country');

  // 🧠 Format and set 'GeographyFormatted'
  const updateFormattedGeographies = (geos: string[]) => {
    setValue('GeographyFormatted', geos.join(' | '));
  };

  // Add this useEffect to handle initial values
  useEffect(() => {
    if (selectedGeographies.length > 0) {
      updateFormattedGeographies(selectedGeographies);
    }
  }, []);

  // Modify the registration useEffect to include initial values
  useEffect(() => {
    register('Geography');
    register('GeographyFormatted');

    // Set initial formatted value if selectedGeographies exists
    if (selectedGeographies.length > 0) {
      updateFormattedGeographies(selectedGeographies);
    }
  }, [register, selectedGeographies]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    let updated = [];

    if (!selectedGeographies.includes(value)) {
      updated.push(value);
    }

    setValue('Geography', updated);
    updateFormattedGeographies(updated);
  };

  const removeGeo = (val: string) => {
    const updated = selectedGeographies.filter((v) => v !== val);
    setValue('Geography', updated);
    updateFormattedGeographies(updated);
  };

  return (
    <div className="space-y-2 col-span-1">
      <label className="block text-[16px] font-semibold text-black-500">
        Geography*
      </label>

      <select
        onChange={handleSelectChange}
        className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none"
        value=""
      >
        <option value="" disabled>
          Select location
        </option>
        {locations.map((loc) => (
          <option key={loc.value} value={loc.value}>
            {loc.label}
          </option>
        ))}
      </select>

      {/* Geographies display */}
      <div className="max-h-[7.5rem] overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-1">
          {selectedGeographies.map((val) => {
            const label = locations.find((loc) => loc.value === val)?.label || val;
            return (
              <span
                key={val}
                className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF] mt-2"
              >
                {label}
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => removeGeo(val)}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {typeof errors.Geography?.message === 'string' && (
        <p className="text-[14px] text-red-600">
          {errors.Geography.message}
        </p>
      )}
    </div>
  );
};

export default GeographySelector;
