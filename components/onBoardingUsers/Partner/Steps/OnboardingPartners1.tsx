'use client';

import { useEffect, useState } from 'react';
import { Monitor, Handshake, Briefcase, BarChart3, Percent, Eye, Users, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import OnboardingCard from '../../OnboardingCard';
import ProgressIndicator from '../../ProgressIndicator';
import { set } from 'lodash';
import Image from 'next/image';

interface OnboardingScreenProps {
  userName?: string;
  setStep?: any;
  setSelectedAnswers?: any;
}

export default function OnboardingPartners1({ userName, setStep, setSelectedAnswers }: OnboardingScreenProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    {
      id: 'Access and Opportunities',
      icon: '/images/icons/folder.png',
      title: 'Access and Opportunities',
      description: 'Being part of an ecosystem where  real connections lead to real growth - for you and your business.'
    },
    {
      id: 'Fundraising',
      icon: '/images/icons/suitcase-line.png',
      title: 'Fundraising',
      description: 'Discover and support high-potential Black-owned businesses raising capital - and to be a part of a more inclusive funding system'
    },

    {
      id: 'Fiscounts',
      icon: '/images/icons/percent.png',
      title: 'Discounts',
      description: 'Offer real discounts with meaningful savings that help Black-owned businesses grow, while building authentic relationships '
    },
    {
      id: 'Find Black-Owned Businesses',
      icon: '/images/icons/search-refraction.svg',
      title: 'Find Black-Owned Businesses',
      description: 'Discover and partner with exceptional Black-owned businesses as vendors, collaborators, or suppliers '
    },
    {
      id: 'Community',
      icon: '/images/icons/peoples.png',
      title: 'Community',
      description: 'Engage directly with the Black business community, support meaningful connections, and be part of a growing ecosystem '
    },
    {
      id: 'Other',
      icon: '/images/icons/more.png',
      title: 'Other',
      description: 'Your reason might not fit in a box, and that’s ok. Feel free to send us a message to let us know what is important to you.'
    }
  ];

  const handleOptionClick = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else if (prev.length < 3) {
        return [...prev, optionId];
      }
      return prev;
    });
  };
  const canContinue = selectedOptions.length > 0;

  useEffect(() => {
    setSelectedAnswers(selectedOptions);
  }, [selectedOptions]);
  return (
    <div className="w-full  rounded-xl md:h-[95vh] overflow-hidden bg-white flex flex-col lg:flex-row" style={{ fontFamily: 'Neue Haas Grotesk Display Pro', }}>
      {/* Left Side - Form */}
      <div className="px-4 lg:ps-12 pt-2 lg:w-1/2 xl:w-1/2 relative flex flex-col h-full">
        <div className="flex-1 overflow-hidden flex flex-col lg:h-[calc(100vh-150px)]"> {/* Adjusted height */}
          <h1 className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[30px] font-bold text-[#101828] pt-2 mb-3 pb-1">
            Welcome {userName},
          </h1>
          <hr className='mb-8 mx-[-1rem] lg:ml-[-3rem] lg:mr-[-2.5rem] ' style={{ border: 'none', borderTop: "1px solid #ededed" }} />
          <div className="mb-7">
            <h2 className=" text-[18px] md:text-[25px] lg:text-[30px] xl:text-[30px] text-[#101828] mb-2 font-[400]">
              How can Orisuun support your goals?
            </h2>
            <p className="text-[14px] md:text-[16px] lg:text-[18px] xl:text-[18px]      text-[#475467]">
              Select up to 3 options
            </p>
            <div className='md:hidden lg:hidden flex justify-start mt-3'>
              <ProgressIndicator current={0} total={6} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {options.map((option) => (
              <OnboardingCard
                key={option.id}
                icon={option.icon}
                title={option.title}
                description={option.description}
                selected={selectedOptions.includes(option.id)}
                onClick={() => handleOptionClick(option.id)}
              />
            ))}
          </div>

          <div className="md:hidden lg:hidden  flex items-center justify-between pb-4">

            <button className="flex items-center gap-2 px-0 py-2 text-[14px] text-[#d0d5ddff] font-[200] transition-colors" disabled={true} >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => { if (canContinue) setStep(2); }}
              disabled={!canContinue}
              className={`flex items-center gap-2 px-4 py-2 text-[14px] font-[500] ${canContinue ? 'text-[#475467] hover:text-blue-700' : 'text-[#d0d5ddff]'} disabled:cursor-not-allowed disabled:opacity-60 transition-colors`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Bottom Section - Positioned absolutely at bottom */}
        <div className="hidden md:absolute lg:block px-4 lg:ps-12 bottom-0 left-0 right-0 bg-white pt-4 ">
          <div className="max-w-2xl mx-auto w-full">


            <div className="flex items-center justify-between pb-4">
              <ProgressIndicator current={0} total={6} />
              <div className='flex'>
                <button disabled={true} className="flex items-center gap-2 px-4 py-2 text-[14px]  text-[#d0d5ddff] font-[200] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => { if (canContinue) setStep(2); }}
                  disabled={!canContinue}
                  className={`flex items-center gap-2 px-4 py-2 text-[14px] font-[500] ${canContinue ? 'text-[#475467] hover:text-blue-700' : 'text-[#d0d5ddff]'} disabled:cursor-not-allowed disabled:opacity-60 transition-colors`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image and Gradient */}
      <div className="relative hidden md:hidden lg:flex lg:w-1/2 xl:w-1/2 ">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #2647AF 0%, #1BA3A8 78.96%)'
          }}
        />
        <div className="relative z-10 text-white w-full p-0">
          <div className="absolute top-10 left-10" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
            <h2 className="text-[62px] text-[#FFFFFF] font-[300]">
              You&apos;re going to
              <br />
              <span className="relative">
                love
                <img
                  src="/images/LoveVector.svg"
                  alt="Smiling woman with laptop"
                  className="h-[17px] w-[136px] object-cover absolute bottom-[-8px]"
                />
              </span>{' '}
              it here!
            </h2>
          </div>
          <img
            src="/images/Girl_1_onboarding.svg"
            alt="Smiling woman with laptop"
            className="h-[100%] w-full object-cover"
          />

          <div className="mb-12 absolute bottom-[-25px] left-10 right-5">
            <p className="text-[18px] text-[#FFFFFF] font-[300] max-w-2xl">
              You have signed up for the premium version of the Business account. You can
              change these selections in Settings at any time.
            </p>
          </div>
        </div>
      </div>


      <div className="relative hidden   md:block lg:hidden lg:flex min-h-[1000px]">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #2647AF 0%, #1BA3A8 100%)'
          }}
        />
        <div className="relative z-10 text-white w-full p-0">
          <div className="absolute top-10 left-10" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
            <h2 className="text-[62px] text-[#FFFFFF] font-[300]">
              You&apos;re going to
              <br />
              <span className="relative">
                love
                <img
                  src="/images/LoveVector.svg"
                  alt="Smiling woman with laptop"
                  className="h-[17px] w-[136px] object-cover absolute bottom-[-8px]"
                />
              </span>{' '}
              it here!
            </h2>
          </div>
          <img
            src="/images/Girl_1_onboarding.svg"
            alt="Smiling woman with laptop"
            className="h-[100%] w-full object-cover"
          />

          <div className="mb-12 absolute bottom-[-35px] left-10 right-5">
            <p className="text-[18px] text-[#FFFFFF] font-[300] max-w-2xl">
              You have signed up for a Partners account. You can change this selection in “Settings” at any time.
            </p>
          </div>
        </div>
      </div>



      <div className="relative block   md:hidden lg:hidden"> {/* Changed to hidden lg:block to match first example */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #2647AF 0%, #1BA3A8 100%)'
          }}
        />
        <div className="relative z-10 text-white w-full p-0">
          <div className="absolute top-10 left-10" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
            <h2 className="text-[36px] text-[#FFFFFF] font-[300]">
              You&apos;re going to
              <br />
              <span className="relative">
                love
                <img
                  src="/images/LoveVector.svg"
                  alt="Smiling woman with laptop"
                  className="h-[8px] w-[69px] object-cover absolute bottom-[-8px]"
                />
              </span>{' '}
              it here!


            </h2>
          </div>
          <img
            src="/images/Girl_1_onboarding.svg"
            alt="Smiling woman with laptop"
            className="h-[100%] w-full object-cover"
          />

          <div className="mb-12 absolute bottom-[-25px] left-6 right-3">
            <p className="text-[15px] text-[#FFFFFF]   max-w-2xl" style={{ lineHeight: '142%', letterSpacing: '1px' }}>
              You have signed up for the premium version of the Business account. You can
              change these selections in Settings at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
