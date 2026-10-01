'use client';

import ProfileType from '@/components/marketing/Footer/ProfileType';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import ArrowLeft from '@/icons/arrow-left';
import { HalfStar, HalfStarSm } from '@/icons/half-star';
import React, { useState } from 'react';

const Subscribe = () => {
  const [selectedProfileType, setSelectedProfileType] = useState('');

  const handleProfileTypeChange = (type) => {
    setSelectedProfileType(type);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSelectedProfileType('');
  };

  return (
    <div className="bg-[#F2F7FC] flex justify-between mobile:px-4 mobile:pt-8 xl:!py-14 rounded-xl relative mobile:h-[468px]">
      <HalfStar className="mobile:hidden block absolute right-0 top-1/2 -translate-y-1/2" />
      <HalfStarSm className="mobile:block hidden absolute bottom-0 left-1/2 -translate-x-1/2" />
      <div className="flex mobile:flex-col lg:justify-between mobile:gap-8 xl:max-w-[950px] mobile:pb-20 w-full mx-auto">
        <div className="flex flex-col gap-6 lg:py-6 mobile:text-center mobile:px-3">
          <h3 className="text-blue-strong mobile:text-2xl lg:text-[40px] font-semibold !leading-110">
            Subscribe to our newsletter
          </h3>
          <p className="text-blue-300 font-medium mobile:text-base lg:text-xl !leading-150">
            Enter your email to get the latest from Orisuun
          </p>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between w-full lg:max-w-[296px]">
          <form
            className="flex flex-col gap-3 w-full lg:max-w-[296px]"
            onSubmit={handleSubmit}
          >
            <ProfileType
              selectedProfileType={selectedProfileType}
              onProfileTypeChange={handleProfileTypeChange}
              popBtnClass={
                'bg-white h-11 px-4 py-3 !w-full !text-sm placeholder:text-grey-800 font-medium'
              }
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="!h-11 px-4 py-3 text-sm placeholder:text-grey-800 font-medium"
            />
            <Button
              type="submit"
              title="Subscribe"
              endIcon={<ArrowLeft className="rotate-180" />}
              className="rounded md:rounded-md h-11 justify-start"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
