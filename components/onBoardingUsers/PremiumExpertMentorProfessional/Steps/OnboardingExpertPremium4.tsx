'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressIndicator from '../../ProgressIndicator';
import ImageSideBar from '../../image-side-bar/imageSideBar';

interface OnboardingScreenProps {
  userName?: string;
  setStep?: any;
}

export default function OnboardingExpertPremium4({ userName, setStep }: OnboardingScreenProps) {

  return (
    <div className="w-full md:h-[95vh] rounded-xl overflow-hidden bg-white flex flex-col lg:flex-row" style={{ fontFamily: 'Neue Haas Grotesk Display Pro', }}>
      {/* Left Side - Form (narrower text area) */}
      <div className="px-4 lg:ps-12 lg:w-1/2 xl:w-1/2 lg:pe-10 pt-1 relative flex flex-col h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <h1 className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[30px] font-bold text-[#101828] pt-2 mb-3 pb-1 ">
            Welcome {userName},
          </h1>
          <hr className='mb-8 mx-[-1rem] lg:ml-[-3rem] lg:mr-[-2.5rem] ' style={{ border: 'none', borderTop: "1px solid #ededed" }} />

          <div className='md:hidden lg:hidden flex justify-start mt-3 mb-3'>
            <ProgressIndicator current={3} total={7} />

          </div>

          <div className="mb-10 lg:mt-12 xl:mt-12 md:mt-12">
            {/* Main Heading */}
            <h2 className="text-[24px] md:text-[24px] lg:text-[30px] xl:text-[30px] font-[400] text-[#101828] mb-6 leading-tight">
              Build Your Winning Circle
            </h2>

            {/* Description Paragraph */}
            <p className="text-[18px] md:text-[18px] lg:text-[20px] font-[300] text-[#475467] mb-8 leading-relaxed" style={{ lineHeight: '140%' }}>
              Orisuun&apos;s smart matching connects you with the people who matter most to your growth.
            </p>

            {/* Subheading */}
            <h3 className="text-[20px] md:text-[20px] lg:text-[22px] font-[300] text-[#475467] mb-4" style={{ lineHeight: '140%' }}>
              You&apos;ll find and create opportunities to match:
            </h3>

            {/* Bullet Points List */}
            <div className="space-y-4" style={{ letterSpacing: '1px' }}>
              {/* Business Development */}
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 mt-3"></span>
                <span>
                  <span className="font-[600] text-black">Business Development</span>
                  <span className="text-[#475467] font-[300]"  > – Find aligned partners and new opportunities</span>
                </span>
              </p>

              {/* Co-founders */}
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 mt-3"></span>
                <span>
                  <span className="font-[600] text-black">Co-founders</span>
                  <span className="text-[#475467] font-[300]"> – Connect with people complement your vision and skillset</span>
                </span>
              </p>

              {/* Board Members */}
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 mt-3"></span>
                <span>
                  <span className="font-[600] text-black">Board Members</span>
                  <span className="text-[#475467] font-[300]"> – Add strategic thinkers to help guide your next move.</span>
                </span>
              </p>
            </div>
            <br />

            {/* Closing Paragraph */}
            <p className="text-[18px] md:text-[18px] lg:text-[20px] font-[300] text-[#475467]">
              Matching is based on your goals, industry, and stage—so every connection counts.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="hidden md:absolute lg:block px-4 lg:ps-12 bottom-0 left-0 right-0 bg-white pt-4 ">
          <div className="max-w-2xl mx-auto w-full">


            <div className="flex items-center justify-between pb-4">
              <ProgressIndicator current={3} total={7} />
              <div className='flex'>
                <button onClick={() => { setStep(3) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button onClick={() => { setStep(5) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-blue-700 transition-colors">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between pb-6">

          <button onClick={() => { setStep(3) }} className="flex items-center gap-2 px-0 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button onClick={() => { setStep(5) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-blue-700 transition-colors">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Right Side - Image (wider section) */}
      <ImageSideBar imageUrl={'/images/new-cofounder-image.png'}

        mobile_text_image_size={" h-[40px] w-[250px]  "}
        desktop_text_image_size={'h-[50px] w-[350px]'}

        mobile_text_image_location={' bottom-10 left-[7px]'}
        desktop_text_image_location={' bottom-10 left-[-1px]'}
        text_image_url={'matching-system-image.png'}
        main_banner_image_size={'h-full w-[170%]'}
        main_banner_image_height={'h-full'}
        mobile_image_url={'/images/co-founder.png'}

      />
    </div>
  );
}