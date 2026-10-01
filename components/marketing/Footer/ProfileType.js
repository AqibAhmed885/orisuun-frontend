'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';

import { profileTypes } from '../../../data/marketing';

const ProfileType = ({
  popBtnClass,
  selectedProfileType,
  onProfileTypeChange,
}) => {
  return (
    <Popover className="relative">
      <PopoverButton
        className={clsx(
          'flex justify-between border-[#8D8D8D] text-[#B1B1B0] border outline-none w-full md:w-[180px] px-4 py-3 bg-transparent rounded-md',
          popBtnClass
        )}
      >
        {selectedProfileType ? (
          <span>{selectedProfileType}</span>
        ) : (
          <span>Profile Type</span>
        )}
        <Image
          src="/icons/dropdown.svg"
          width={24}
          height={25}
          className="h-auto w-5 shrink-0"
          loading="lazy"
          alt=""
        />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="flex flex-col gap-2 shadow-md py-3 px-2.5 bg-white"
      >
        <p className="text-sm text-text-gray">Profile Type</p>
        {profileTypes.map((type) => (
          <div key={type} className="flex gap-1 !items-center">
            <input
              id={type}
              type="checkbox"
              name="profileType"
              checked={selectedProfileType === type}
              onChange={() => onProfileTypeChange(type)}
            />
            <label className="font-semibold" htmlFor={type}>
              {type}
            </label>
          </div>
        ))}
      </PopoverPanel>
    </Popover>
  );
};

export default ProfileType;
