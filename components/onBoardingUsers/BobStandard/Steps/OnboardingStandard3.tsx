'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressIndicator from '../../ProgressIndicator';
import ImageSideBar from '../../image-side-bar/imageSideBar';

interface OnboardingScreenProps {
  userName?: string;
  setStep?: any;
}

export default function OnboardingStandard3({ userName, setStep }: OnboardingScreenProps) {

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
            <ProgressIndicator current={2} total={4} />

          </div>

          <div className="mb-8">
            <h2 className="text-[24px] md:text-[24px] lg:text-[36px] xl:text-[36px] font-[400] text-[#101828] mb-6">
              Crowdfund Your Way -<br /> With Your Community
            </h2>
            <p className="text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] font-[300] text-[#475467]" style={{ lineHeight: '140%' }}>

              Orisuun makes it easy to raise money from the people who already believe in you.<br /><br />
              With our built-in crowdfunding tools, you can launch campaigns, share your vision, and invite customers, friends, and supporters to invest directly in your business. <br /><br />
              Whether you&apos;re raising <span className="font-[600] text-black">
                <span className='font-[600]' >$</span>5K or
                <span className='font-[600]'> $</span>500K
              </span> —your community can help you get there.
            </p>



          </div>
        </div>

        {/* Bottom Section */}
        <div className="hidden md:absolute lg:block px-4 lg:ps-12 bottom-0 left-0 right-0 bg-white pt-4 ">
          <div className="max-w-2xl mx-auto w-full">


            <div className="flex items-center justify-between pb-4">
              <ProgressIndicator current={2} total={4} />
              <div className='flex'>
                <button onClick={() => { setStep(2) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button onClick={() => { setStep(4) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-blue-700 transition-colors">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden  flex items-center justify-between pb-6">

          <button onClick={() => { setStep(2) }} className="flex items-center gap-2 px-0 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button onClick={() => { setStep(4) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-blue-700 transition-colors">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Right Side - Image (wider section) */}
      <ImageSideBar imageUrl={'/images/new-power-plant-image.png'}
        mobile_text_image_size={" h-[40px] w-[200px]  "}
        desktop_text_image_size={'h-[50px] w-[300px]'}
        mobile_text_image_location={' bottom-10 left-[15px]'}
        desktop_text_image_location={' bottom-10 left-[-1px]'}
        text_image_url={'crowd-funding.png'}
        main_banner_image_size={'h-full w-[100%]'}
        main_banner_image_height={'h-full'}
        mobile_image_url={'/images/hyper-local-powerplant.png'}

      />
    </div>
  );
}