'use client';

import Image from 'next/image';
import { useState } from 'react';
import ProfileImage from '@/public/fundraising/Profile2.png';
import SearchIcon from '@/icons/sidebar/search-icon';
import LocationPin from '@/icons/location-pin';
import Input from '@/components/ui/input';
import { Contributor, useCampaignDetails } from './context/campaign-context';
import { useRouter } from 'next/navigation';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

const InfoRow = ({
  ProfilePicture,
  Name,
  Location,
  Amount,
  UserId,
  Id,
}: Contributor) => (
  <div className="flex justify-between gap-2 items-center">
    <div className="flex gap-3 items-center">
      <Image
        alt="Contributor Image"
        src={ProfilePicture || ProfileImage.src}
        width={40}
        height={40}
        className="rounded-full max-w-10 max-h-10"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold leading-5">{Name}</h3>
        <span className="flex gap-2 items-center">
          <LocationPin className="text-nav-blue h-4 w-4" />
          <p className="text-sm font-medium text-blue-300">{Location}</p>
        </span>
      </div>
    </div>
    <span className="text-nav-blue font-semibold text-xl">
      ${Amount.toLocaleString()}
    </span>
  </div>
);

const Contributors = () => {
  const { contributors, searchContributors } = useCampaignDetails();
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    searchContributors(searchValue);
  };

  const router = useRouter();
  return (
    <div className="shadow-custom overflow-hidden rounded">
      <div className="flex flex-col">
        <div className="bg-lightBlueBg p-4">
          <h2 className="text-xl font-semibold text-blue-500 leading-[100%]">
            Contributors
          </h2>
        </div>
        <div className="flex flex-col gap-6 p-4 border border-grey-600 rounded-b border-t-0">
          <Input
            icon={<SearchIcon className="text-black-900" />}
            placeholder="Search for Contributors"
            value={search}
            onChange={handleSearchChange}
            className="border-grey-600 leading-5 h-11 text-sm placeholder:text-sm placeholder:text-blue-300"
          />
          <div className="flex flex-col gap-2.5 max-h-[284px] overflow-auto hide-scrollbar">
            {contributors.length >= 0 ? (
              contributors.map((contributor, index) => (
                <div
                  key={index}
                  className="flex flex-col max-h-max cursor-pointer hover:bg-opacity-20"
                  onClick={() =>
                    router.push(
                      `/profile/${add2040ToProfileDetailsId(
                        contributor.UserId
                      )}`
                    )
                  }
                >
                  <InfoRow {...contributor} />
                  {index < contributors.length - 1 && <hr className="mt-2.5" />}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-lg font-bold text-gray-500">
                No contributors found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contributors;
