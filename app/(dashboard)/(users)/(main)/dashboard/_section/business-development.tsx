'use client';

import ProfileCard from '@/components/cards/profile-card';
import CustomSelect from '@/components/ui/select';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import handshake from '@/public/images/vector/handshake.svg';
import message from '@/public/images/vector/message.svg';
import cross from '@/public/images/vector/cross.svg';
import exhange from '@/public/images/vector/exhange.svg';
import Crown from '@/icons/crown';
import { apiEndpoint, cn } from '@/utils/utils';
import Consultant from '@/icons/consultant';
import { getBDMatchingList } from '@/server-actions/dashboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { rejectMatchedRequest, matchBdConnection } from '../../../../../api/dashboard/dashboard'
const icons = {
  consultant: <Consultant className="w-4 h-4 text-omblue-500" />,
  'digital-agency': <Crown className="w-4 h-4 text-omblue-500" />,
  'electrical-engineering': <Consultant className="w-4 h-4 text-omblue-500" />,
};

const sections = [
  { 1: 'Business Development Opportunity Matches' },
  { 2: 'Co-founder Matches' },
  { 1002: 'Board Member Matches' },
];

const Dummydata = [
  {
    name: 'Market Penetration',
    user: {
      image:
        'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png',
      name: 'Brooks Orozco',
      icon: 'consultant',
      company: 'Consultant',
    },
    status: 'Mutually Matched',
  },
  {
    name: 'Market Expansion',
    user: {
      image:
        'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png',
      name: 'Consultant Team',
      icon: 'digital-agency',
      company: 'Digital Agency',
    },
    status: 'Matched',
  },
  {
    name: 'Product Development',
    user: {
      image:
        'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png',
      name: 'Expert Team',
      icon: 'digital-agency',
      company: 'Business Development Expert',
    },
    status: 'Mutually Matched',
  },
  {
    name: 'Market Expansion',
    user: {
      image:
        'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png',
      name: 'Maya Finley',
      icon: 'electrical-engineering',
      company: 'Electrical Engineering',
    },
    status: 'Matched',
  },
];

const NoData = () => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          src={handshake}
          alt="handshake"
          width={32}
          height={32}
          className="mx-auto 2xl:w-scaled-4 2xl:h-scaled-4 xs:w-10 xs:h-10"
        />
        <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-400 mx-auto">
          No business development match found.
        </p>
      </div>
    </div>
  );
};

const BusinessDevelopment = () => {
  const router = useRouter()
  // const { currentUser } = useSelector((state: RootState) => state.user);
  const userData = typeof window != "undefined" && JSON.parse(localStorage.getItem('userData'));
  const [selected, setSelected] = useState(1);
  const [data, setData] = useState<any>([]);

  const fetchBDMatch = useCallback(async () => {
    try {
      const response = await getBDMatchingList(userData.Id, selected);
      if (response.success) {
        setData(response.data?.MatchedList)
      }
    } catch (error) {
      console.error(error);
    }
  }, [selected]);

  useEffect(() => {
    // if (userData) {
    fetchBDMatch();
    // }
  }, [selected, fetchBDMatch]);

  const handleReject = async (id) => {
    try {
      const success = await rejectMatchedRequest(id);
      if (success) {
        toast.success("Rejection completed");
        fetchBDMatch();
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    }
  };

  const handleExcahnge = async (matchId, userProfileId) => {
    try {
      const success = await matchBdConnection(matchId, userProfileId);
      if (success) {
        fetchBDMatch();
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    }
  };


  return (
    <div className="shadow-custom-combined border border-[#E3E3E2] rounded-xl h-[332px] 2xl:h-[calc(332px*var(--scale-factor))] flex flex-col">
      <h6 className="text-h6 md:text-scaled-h6 text-blue-500 font-semibold mb-4 pt-4 px-4">
        Posts
      </h6>
      <div className="md:inline-flex mb-4 hidden px-4">
        {sections?.map((section, index) => {
          const [tabId, tabLabel]: any = Object.entries(section)[0];

          return (

            <p
              key={index}
              onClick={() => setSelected(tabId)}
              className={cn(
                'text-[14px] 2xl:text-scaled-h10 cursor-pointer font-[500] py-3 px-4 border-b-2 transition-all inline-block text-center',
                selected == tabId ? 'border-omblue-600 text-omblue-600' : 'border-transparent text-[#797B82]'
              )}
            >
              {tabLabel}
            </p>
          )
        })}
      </div>

      <div className="block md:hidden mb-4 px-4">
        <CustomSelect
          options={[
            {
              label: 'Business Development Opportunity Matches',
              value: 'Business Development Opportunity Matches',
            },
            {
              label: 'Co-founder Matches',
              value: 'Co-founder Matches',
            },
            {
              label: 'Board Member Matches',
              value: 'Board Member Matches',
            },
          ]}
          onChange={(e) => console.log(e)}
          error={undefined}
          value={undefined}
          placeholder="Business Development Opportunity Matches"
        />
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex flex-col flex-grow overflow-hidden pb-4">
        <div className="grid grid-cols-12 bg-omblue-25">
          <div className="col-span-3 p-3 text-blue-500 text-[14px] 2xl:text-scaled-h10 font-semibold">
            BD Opportunity
          </div>
          <div className="col-span-3 p-3 text-blue-500 text-[14px] 2xl:text-scaled-h10 font-semibold">
            Profile
          </div>
          <div className="col-span-3 p-3 text-blue-500 text-[14px] 2xl:text-scaled-h10 font-semibold">
            Status
          </div>
          <div className="col-span-3 p-3 text-blue-500 text-[14px] 2xl:text-scaled-h10 font-semibold">
            Actions
          </div>
        </div>

        {data?.length > 0 ? (
          <div className="flex flex-col overflow-y-scroll hide-scrollbar">
            {data?.map((item: any, index) => (
              <div
                key={index}
                className="grid grid-cols-12 border-b border-grey-600"
              >
                <div className="col-span-3 flex items-center">
                  <p className="p-3 text-[13px] 2xl:text-scaled-h10 font-semibold flex items-center text-black-500">
                    {item?.StrategyName}
                  </p>
                </div>
                <div className="col-span-3">
                  <div className="p-3 flex items-center">
                    <ProfileCard
                      variant="sm"
                      name={item?.CompanyName}
                      company={item.Tagline}
                      // @ts-ignore
                      // icon={"/consultant"}
                      // isImage={false}
                      image={!!item?.ProfilePicture ? item?.ProfilePicture : 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'}
                    />
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <p
                    className={cn(
                      'p-3 text-[13px] 2xl:text-scaled-h10 font-medium flex items-center',
                      item.status === 'Matched'
                        ? 'text-blue-500'
                        : 'text-green-500'
                    )}
                  >
                    {item?.MatchedUserProfileId == 1 ? "Mutually Matched" : "Matched"}
                  </p>
                </div>
                <div className="col-span-3 flex items-center">
                  <div className="p-3 text-[13px] 2xl:text-scaled-h9 font-semibold text-olblue-500">
                    <div className="flex items-center gap-2">
                      {item?.IsBDCreatedUserProfileMatched ? (
                        <button className="border border-blue-100 p-2 rounded-full" onClick={() => router.push('chats')}>
                          <Image
                            src={message}
                            alt="message"
                            width={16}
                            height={16}
                            className="w-4 h-4 2xl:w-scaled-2.5 2xl:h-scaled-2.5"
                          />
                        </button>
                      ) : (
                        <button className="border border-blue-100 p-2 rounded-full" onClick={() => handleExcahnge(item?.MatchedId, item?.UserProfileId)}>
                          <Image
                            src={exhange}
                            alt="exhange"
                            width={16}
                            height={16}
                            className="w-4 h-4 2xl:w-scaled-2.5 2xl:h-scaled-2.5"
                          />
                        </button>
                      )}
                      <button className="border border-danger-100 p-2 rounded-full" onClick={() => handleReject(item?.MatchedId)}>
                        <Image
                          src={cross}
                          alt="message"
                          width={16}
                          height={16}
                          className="w-4 h-4 2xl:w-scaled-2.5 2xl:h-scaled-2.5"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoData />
        )}
      </div>

      <div className="flex w-full md:hidden flex-col items-center px-4 py-2">
        <div className="w-full border border-grey-600 rounded-md px-4 py-3">
          <div className="w-full flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <p className="text-h10 2xl:text-scaled-h10 font-semibold flex items-center text-black-500">
                Market Penetration
              </p>
              <p className="text-h10 2xl:text-scaled-h10 font-medium flex items-center text-green-500">
                Mutually Matched
              </p>
            </div>
          </div>

          {/* Mobile view */}

          <div className="flex items-center justify-between gap-2">
            <ProfileCard
              variant="sm"
              name="Brooks Orozco"
              company="Consultant"
              image="https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"
            />
            <div className="flex items-center gap-2">
              <button className="border border-blue-100 p-2 rounded-full">
                <Image src={message} alt="message" width={16} height={16} />
              </button>
              <button className="border border-danger-100 p-2 rounded-full">
                <Image src={cross} alt="message" width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDevelopment;