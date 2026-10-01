'use client';

import MultiSectionCheckboxAccordion from '@/components/ui/checbox-dropdown';
import CustomSelect from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import { sections, sorts } from '@/data/dashboard/profile';
import { cn } from '@/utils/utils';
import React, { useState } from 'react';

const FiltersSection = ({ showFilters }: { showFilters: boolean }) => {
  const [blackOwnedOnly, setBlackOwnedOnly] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  return (
    <div
      className={cn(
        'block w-72 2xl:w-scaled-64 flex-none overflow-y-auto bg-white shadow-filter-primary p-4',
        showFilters ? 'block' : 'hidden'
      )}
    >
      <h6 className="text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold mb-4">
        Filter & Sort
      </h6>
      <div className="space-y-4">
        {sorts.map((sort, key) => (
          <div key={key} className="space-y-2">
            <label className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
              {sort.label}
            </label>
            <CustomSelect
              placeholder="Select One"
              options={sort.options}
              onChange={() => {}}
              error={undefined}
              value={undefined}
            />
          </div>
        ))}
      </div>
      <hr className="my-4 border-b-black-500" />
      <MultiSectionCheckboxAccordion
        sections={sections}
        selectedOptions={[]}
        onChange={() => {}}
      />
      <div className="mt-4">
        <Switch
          label="Majority Black Owned Companies Only"
          isOn={blackOwnedOnly}
          onToggle={() => setBlackOwnedOnly(!blackOwnedOnly)}
        />
        <Switch
          label="Verified Companies Only"
          isOn={verifiedOnly}
          onToggle={() => setVerifiedOnly(!verifiedOnly)}
        />
      </div>
    </div>
  );
};

export default FiltersSection;
