import Image from 'next/image'
import React, { useState } from 'react'
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const AddResource = ({onClick}) => {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="relative w-72 h-[calc(45vh-40px)] md:w-[270px] p-4 md:h-[720px] cursor-pointer">
      {/* Main AddResource card (always visible) */}
      <div
        className="relative w-full h-full inset-0 rounded-2xl p-4 bg-[radial-gradient(circle_at_center,#2357C6_0%,#2357C6_50%,_#5FAFDD_100%)] transform lg:rotate-0 md:rotate-0 -rotate-90"
        onClick={onClick}
      >
        <div className="border w-full h-full border-white/20 rounded-xl overflow-hidden ">
          <div className="w-full h-full p-6 flex flex-col justify-between">
            <div className="text-white text-2xl md:text-4xl flex items-center gap-4 tracking-wide font-light rotate-90 absolute md:top-40 top-32 -right-[45px] md:-right-[90px]">
              <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="55" height="55" rx="27.5" fill="white" />
                <path d="M27.8359 11L27.8618 11.6456C28.2012 20.1314 35.1792 26.8359 43.6719 26.8359L43.2682 26.8501C34.7216 27.1505 27.9232 34.1205 27.8359 42.6719C27.9236 34.0769 21.0711 27.0156 12.4773 26.8454L12 26.8359C20.7459 26.8359 27.8359 19.7459 27.8359 11Z" fill="#2357C6" />
              </svg>
              <span className='font-ligth'>Add a resource</span>
            </div>
            <div className="text-white text-xs text-right flex items-start gap-4 rotate-90 absolute top-28 -left-12">
              <button className="bg-white px-4 py-2.5 font-semibold rounded-full text-omblue-600 text-sm">It&apos;s free</button>
              <button
                className="border flex px-2 gap-2 py-2 font-medium rounded-full text-white text-sm"
                onClick={e => { e.stopPropagation(); setShowLearnMore(true); }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="-rotate-90">
                  <path d="M6.66634 9.99935H9.99967M13.333 9.99935V10.0077M9.99967 18.3327C5.3973 18.3327 1.66634 14.6017 1.66634 9.99935C1.66634 5.39698 5.3973 1.66602 9.99967 1.66602C14.602 1.66602 18.333 5.39698 18.333 9.99935C18.333 14.6017 14.602 18.3327 9.99967 18.3327Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Learn More
              </button>
            </div>
            <div className="md:mt-6 mt-0 flex-1 flex items-end justify-center">
              <Image
                src={`${staticUrl}/resources/plus-circle.svg`}
                alt="Add Resource"
                width={600}
                height={600}
                className="md:w-full w-24 h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal overlay and modal */}
      {showLearnMore && (
        <>
          {/* Optional: overlay to dim the background */}
          <div className="fixed inset-0 bg-black bg-opacity-20 z-40"></div>
          <div className="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-2xl p-6 w-[350px] max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold tracking-wide">Learn more</h2>
              <button
                className="text-gray-500 text-2xl"
                onClick={() => setShowLearnMore(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-sm tracking-wider">
              <div>
                <h1 className="font-medium text-sm">COMPETITIONS</h1>
                <div className='text-gray-500'>Pitch events, business challenges, or contests with prizes or funding.</div>
              </div>
              <div>
                <h1 className="font-medium text-sm">ACCELERATOR</h1>
                <div className='text-gray-500'>Programs offering mentorship, training, and capital to help startups grow.</div>
              </div>
              <div>
                <h1 className="font-medium text-sm">SPECIALTY FINANCING</h1>
                <div className='text-gray-500'>Alternative funding sources such as microloans, credit programs, or investor funds.</div>
              </div>
              <div>
                <h1 className="font-medium text-sm">GOVERNMENT PROGRAMS</h1>
                <div className='text-gray-500'>Local or national initiatives supporting small and Black-owned businesses.</div>
              </div>
              <div>
                <h1 className="font-medium text-sm">NGO PROGRAMS</h1>
                <div className='text-gray-500'>Nonprofit or community-led initiatives providing business resources or training.</div>
              </div>
              <div>
                <h1 className="font-medium text-sm">SCHOOL PROGRAMS</h1>
                <div className='text-gray-500'>University or college initiatives that support student entrepreneurs.</div>
              </div>
              <div>
                <h1 className="font-medium text-sm">GRANTS</h1>
                <div className='text-gray-500'>Non-repayable funding support for Black-owned businesses and founders.</div>
              </div>
            </div>
            <button
              className="mt-6  bg-[#2357C6] text-white font-semibold py-2 px-4 rounded-full"
              onClick={() => setShowLearnMore(false)}
            >
              Got It!
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddResource;
