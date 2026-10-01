'use client';
import Favourite from '@/icons/favourite';
import Globe from '@/icons/globe';
import MessageIcon from '@/icons/message-icon';
import MessageWriting from '@/icons/message-writing';
import Hamburger from '@/icons/sidebar/hamburger';
import Tick from '@/icons/tick';
import Image from 'next/image';
import React from 'react';
import { contactDetails, businessDetails } from '../../../../../../data/dashboard/coFounder';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const CofounderMatchDetails = () => {
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  return (
    <div className="px-6 lg:px-28">
      <div className="md:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Co Founder And Board Matcher
        </p>
        <Image
          src={
            currentUser?.ProfilePicture || BASE_URL
          }
          alt="user"
          width={32}
          height={32}
          className="rounded-full h-8 w-8 me-2"
        />
      </div>
      <div className="py-8 flex flex-col md:h-screen">
        <div className="flex items-center gap-2">
          <Tick className="bg-omblue-500 p-1.5 rounded-full text-white h-7 w-7" />
          <p className="text-omblue-700 font-medium text-h7 2xl:text-scaled-h7">
            Your new business development post was published
          </p>
        </div>
        <div className="my-8 flex-grow">
          <div className="md:p-6 md:border border-grey-600 rounded-md">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-grow">
                <h6 className="text-olblue-900 font-bold text-h6 md:text-h2 2xl:text-scaled-h2">
                  Tech (CTO)
                </h6>
                <p className="py-2 text-h9 2xl:text-scaled-h9 font-medium">
                  Acquisition – Acquirer{' '}
                </p>
              </div>
              <button
                className="hidden md:flex items-center gap-2 border text-omblue-600 border-omblue-600 p-3 rounded-md"
                onClick={() => { }}
              >
                <MessageWriting className="w-4 h-4" /> Match
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
              <div className="col-span-1">
                <div className="pe-6 h-full lg:border-r border-grey-600">
                  <div className="space-y-6 pb-8 lg:border-b-0 border-b border-grey-600">
                    <div className="space-y-4">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Role Description
                      </p>
                      <p className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                        TechWave Innovations is a dynamic technology company
                        dedicated to creating cutting-edge solutions that
                        redefine industry standards.
                      </p>
                      <ul className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium list-disc pl-4 space-y-4">
                        <li>
                          We believe in the power of collaboration. Our team
                          works closely with clients to understand their unique
                          challenges and develop customized tech solutions that
                          drive success.
                        </li>
                        <li>
                          Stay ahead in the ever-evolving tech landscape with
                          our team of expert who are passionate about exploring
                          and mastering the latest technological trends.
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Preferred Experience
                      </p>
                      <p className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                        TechWave Innovations is a dynamic technology company
                        dedicated to creating cutting-edge solutions that
                        redefine industry standards.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Business description
                      </p>
                      <p className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                        TechWave Innovations is a dynamic technology company
                        dedicated to creating cutting-edge solutions that
                        redefine industry standards.
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block space-y-4">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Image
                          src={BASE_URL}
                          alt="profile"
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-h8 2xl:text-scaled-h8 font-bold text-black-500">
                            TechWave Innovations
                          </p>
                          <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                            Riding the Tech Wave
                          </p>
                        </div>
                      </div>
                      <div className="space-x-1 flex items-center">
                        <button className="bg-green-50 border border-green-400 text-green-400 p-2 rounded-full">
                          <Favourite />
                        </button>
                        <button className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full hidden md:block">
                          <MessageIcon />
                        </button>
                        <button className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full hidden md:block">
                          <Globe />
                        </button>
                      </div>
                    </div>
                    <p className="text-h10 2xl:text-scaled-h10 text-blue-400 font-medium">
                      Expiry: 05 Jan, 2024 07:39 pm
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 col-span-1 border-b lg:border-0 border-grey-600 pb-8">
                <div className="mb-2 space-y-4">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                    Business Details
                  </p>
                  {businessDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {detail.icon}
                      <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                        {detail.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mb-2 space-y-4">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                    Contact Details
                  </p>
                  {contactDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {detail.icon}
                      <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                        {detail.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:hidden block space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={BASE_URL}
                    alt="profile"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-h8 2xl:text-scaled-h8 font-bold text-black-500">
                      TechWave Innovations
                    </p>
                    <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                      Riding the Tech Wave
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="space-x-2 flex items-center">
                    <button className="bg-green-50 border border-green-400 text-green-400 p-2 rounded-full">
                      <Favourite />
                    </button>
                    <button className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full">
                      <MessageIcon />
                    </button>
                    <button className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full">
                      <Globe />
                    </button>
                  </div>
                  <button
                    className="flex items-center gap-2 border text-omblue-600 border-omblue-600 p-3 rounded-md"
                    onClick={() => { }}
                  >
                    <MessageWriting className="w-4 h-4" /> Match
                  </button>
                </div>

                <p className="text-h10 2xl:text-scaled-h10 text-blue-400 font-medium">
                  Expiry: 05 Jan, 2024 07:39 pm
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-auto py-4 w-full flex items-center justify-end">
          <button className="md:w-auto w-full border text-omblue-600 border-omblue-600 p-3 rounded-md">
            Back to BD
          </button>
        </div>
      </div>
    </div>
  );
};

export default CofounderMatchDetails;
