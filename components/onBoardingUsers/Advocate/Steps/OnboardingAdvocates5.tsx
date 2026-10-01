'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressIndicator from '../../ProgressIndicator';
import ImageSideBar from '../../image-side-bar/imageSideBar';

interface OnboardingScreenProps {
  userName?: string;
  setStep?: any;
  handleSubmitOnBoarding?: any;
}

export default function OnboardingAdvocates5({ userName, setStep, handleSubmitOnBoarding }: OnboardingScreenProps) {
  return (
    <div className="w-full rounded-xl md:h-[95vh] overflow-hidden bg-white flex flex-col lg:flex-row" style={{ fontFamily: 'Neue Haas Grotesk Display Pro', }}>
      {/* Left Side - Form (narrower text area) */}
      <div className="px-4 lg:ps-12 lg:w-1/2 xl:w-1/2 lg:pe-10 pt-1 relative flex flex-col h-full">
        <div className="flex-1 overflow-hidden flex flex-col min-h-[500px]">
          <h1 className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[30px] font-bold text-[#101828] pt-2 mb-3 pb-1 ">
            Welcome {userName},
          </h1>
          <hr className='mb-8 mx-[-1rem] lg:ml-[-3rem] lg:mr-[-2.5rem] ' style={{ border: 'none', borderTop: "1px solid #ededed" }} />
          <div className='md:hidden lg:hidden flex justify-start mt-3 mb-3'>
            <ProgressIndicator current={4} total={5} />

          </div>

          <div className="mb-8">
            <h2 className="text-[24px] md:text-[24px] lg:text-[36px] xl:text-[36px] font-[400] text-[#101828] mb-6">
              Find Who (and What) You’re Looking For
            </h2>
            <p className="text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] font-[300] text-[#475467]" style={{ lineHeight: '140%' }}>

              Orisuun gives you powerful tools to connect with the right people—fast. Use advanced search and filters to explore the network by industry, expertise, funding stage, and more.<br /><br />
              Dive into rich profile pages to understand who someone is before reaching out.<br /><br />
              Whether you’re looking for founders, funders, experts, or collaborators—you’re in the right place.<br /><br />
              Complete your profile so you can start connecting with the <span className='font-[600] text-black'>right people, resources, and deals</span>

            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="hidden md:absolute lg:block px-4 lg:ps-12 bottom-0 left-0 right-0 bg-white pt-4 ">
          <div className="max-w-2xl mx-auto w-full">


            <div className="flex items-center justify-between pb-4 mb-3">
              <ProgressIndicator current={4} total={5} />
              <div className='flex'>
                <button onClick={() => { setStep(4) }} className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button disabled={true} className="flex items-center gap-2 px-4 py-2 text-[14px]  text-[#d0d5ddff] font-[200] transition-colors">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className='pe-4 pb-10'>
              <button onClick={handleSubmitOnBoarding} style={{ minWidth: '100%', backgroundColor: 'rgba(35, 87, 198, 1)', border: 'none', color: 'white', textAlign: 'center', height: '44px', alignItems: 'center', borderRadius: '5px', boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}>
                Get started
              </button>
            </div>
          </div>
        </div>

        <div className="  block   lg:hidden pb-4 mb-2">
          <div className=' flex items-center justify-between mb-5  '>


            <button onClick={() => { setStep(4) }} className="flex items-center gap-2 px-0 py-2 text-[14px] text-[#475467] font-[500] hover:text-gray-700 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button disabled={true} className="flex items-center gap-2   py-2 text-[14px]  text-[#d0d5ddff] font-[200] transition-colors">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>


          </div>
          <div className=' '>
            <button onClick={handleSubmitOnBoarding} style={{ minWidth: '100%', backgroundColor: 'rgba(35, 87, 198, 1)', border: 'none', color: 'white', textAlign: 'center', height: '44px', alignItems: 'center', borderRadius: '5px', boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}>
              Get started
            </button>
          </div>
        </div>

      </div>

      {/* Right Side - Image (wider section) */}
      <ImageSideBar imageUrl={'/images/map-search.png'}
        mobile_text_image_size={" h-[40px] w-[150px]  "}
        desktop_text_image_size={'h-[50px] w-[200px]'}
        mobile_text_image_location={' bottom-10 left-[40px]'}
        desktop_text_image_location={' bottom-10 left-[60px]'}
        text_image_url={'search.png'}
        main_banner_image_size={'h-full w-[100%]'}
        main_banner_image_height={'h-full'}
        mobile_image_url={'/images/new-filter-sort.png'}

      />
    </div >
  );
}