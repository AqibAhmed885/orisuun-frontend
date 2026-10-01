'use client';

import Dropdown from '@/components/ui/dropdown';
import Input from '@/components/ui/input';
import SearchIcon from '@/icons/search-icon';
import { useState } from 'react';

export function BlogsHeader() {
  const filterOptions = ['All Categories', 'Technology', 'Health', 'Finance'];
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  return (
    <div className="flex flex-col gap-8 lg:!gap-4 lg:!flex-row lg:items-center lg:justify-between" id="go-top">
      <h1 className="text-4xl lg:!text-[64px] lg:leading-tight font-semibold text-blue-strong" >
        Popular Articles
      </h1>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search"
          className="py-2.5 lg:!w-[219px] text-sm lg:!text-base !border-2 border-gray-300-custom rounded-full leading-none relative placeholder:font-semibold placeholder:text-text-gray mobile:h-9 h-11"
          iconClasses="z-50 left-5"
          containerClass='w-1/2 lg:!w-[219px]'
          icon={<SearchIcon />}

        />
        <Dropdown
          items={filterOptions} // Array of options
          selected={selectedFilter} // Currently selected option
          onSelect={(item) => setSelectedFilter(item)} // Update selected option
          renderItem={(item) => <span>{item}</span>} // Render item as a span
          placeholder="Select a category"
          wrapperClass='!rounded-full !border-2 lg:w-[164px] !border-nav-blue !py-2.5 mobile:!px-2  !text-sm lg:!text-base font-semibold text-text-gray mobile:max-h-9 max-h-11'
          className='!w-1/2 lg:!w-max'
          iconSize='mobile:w-5 mobile:h-5'
        />
      </div>
    </div>
  );
}
