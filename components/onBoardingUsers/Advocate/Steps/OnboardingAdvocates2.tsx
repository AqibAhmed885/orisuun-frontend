'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressIndicator from '../../ProgressIndicator';
import ImageSideBar from '../../image-side-bar/imageSideBar';

interface OnboardingScreenProps {
  userName?: string;
  setStep?: any;
}

export default function OnboardingAdvocates2({ userName, setStep }: OnboardingScreenProps) {
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
            <ProgressIndicator current={1} total={5} />

          </div>

          <div className="mb-8">
            <h2 className="text-[24px] md:text-[24px] lg:text-[30px] xl:text-[30px] font-[400] text-[#101828] mb-6">
              Discover Deals, Support Black-Owned
            </h2>
            <p className="text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-[#475467]" style={{ lineHeight: '140%' }}>
              Orisuun’s Discount Portal gives you exclusive access to deals from Black-owned businesses across categories—from wellness to tech to fashion. Save money while circulating dollars in the community.<br /><br />
              Every purchase supports growth, ownership, and impact.<br /><br />
              <span className='font-[500] text-black'>Great deals. Greater purpose.</span>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="hidden md:absolute lg:block px-4 lg:ps-12 bottom-0 left-0 right-0 bg-white pt-4 ">
          <div className="max-w-2xl mx-auto w-full">


            <div className="flex items-center justify-between pb-4">
              <ProgressIndicator current={1} total={5} />
              <div className='flex'>
                <button onClick={() => { setStep(1) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button onClick={() => { setStep(3) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-blue-700 transition-colors">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between pb-6">

          <button className="flex items-center gap-2 px-0 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors" onClick={() => { setStep(1) }} >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button onClick={() => { setStep(3) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-blue-700 transition-colors">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Right Side - Image (wider section) */}
      <ImageSideBar
        imageUrl={'/images/new-favourited-image.png'}
        mobile_text_image_size={" h-[40px] w-[200px]  "}
        desktop_text_image_size={'h-[50px] w-[300px]'}
        mobile_text_image_location={' bottom-10 left-[20px]'}
        desktop_text_image_location={' bottom-10 left-[20px]'}
        text_image_url={'discount-image.png'}
        main_banner_image_size={'h-full w-[185%]'}
        main_banner_image_height={'h-full'}
        mobile_image_url={'/images/favourated_onboarding.png'}
      />
    </div>
  );
}