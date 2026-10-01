'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import React, { useState } from 'react';
import Image from 'next/image';
const Fundraisingforsponsorsimg = staticUrl + "/home/images/swiper/Fundraisingforsponsorsimg.png";
const fundraisingownedbusiness = staticUrl + "/home/images/swiper/fundraising-ownedbusiness.png";

export default function Fundraising({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('business');
  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target.id === 'popup-backdrop') {
      onClose();
    }
  };

  return (
    <>
      <div id="popup-backdrop" onClick={handleBackdropClick} className="backdrop-blur-md bg-white/80 fixed w-screen h-screen top-0 bottom-0 z-[999999] left-0 right-0 flex items-center justify-center bg-[#ffffffec]">
        <div className="xl:w-[1280px] md:w-[80%] w-[90%] bg-white rounded-2xl shadow-price2 mx-auto h-[80%]">
          <div className="md:p-0 p-3 relative overflow-y-auto h-full">
            <div className="header flex w-full justify-between md:py-3 md:px-7 lg:absolute z-[99] small-767:absolute p-0 top-0 left-0 right-0">
              <div className="xl:pl-[68px] sm:pl-1 pl-3 pb-5 sm:pt-8 pt-4 flex md:space-x-10 space-x-3">
                <button
                  className={`pb-2 sm:text-lg text-sm font-semibold ${
                    activeTab === 'business'
                      ? 'text-nav-blue border-b-2 border-nav-blue'
                      : 'text-gray'
                  }`}
                  onClick={() => setActiveTab('business')}
                >
                  Black-Owned Businesses
                </button>
                <button
                  className={`pb-2  sm:text-lg text-sm font-semibold ${
                    activeTab === 'sponsors'
                      ? 'text-nav-blue border-b-2 border-nav-blue'
                      : 'text-gray'
                  }`}
                  onClick={() => setActiveTab('sponsors')}
                >
                  Sponsors
                </button>
              </div>
              <button onClick={onClose} className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M30 10L10 30"
                    stroke="#6E6E6E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 10L30 30"
                    stroke="#6E6E6E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {activeTab === 'business' ? (
              <div className="w-full flex md:flex-row flex-col-reverse gap-5">
                <div className="xl:pl-24 sm:pl-5">
                  <div className="w-full pb-5 flex h-full flex-col items-start justify-center gap-3 lg:w-[480px] small-500:pt-0 small-500:mb-10">
                    <h2 className="text-blue-strong lg:text-[32px] font-semibold leading-110 text-[20px] mb-3 lg:pt-24">
                      Fundraising For Black-Owned Businesses
                    </h2>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      Looking for funding options that actually gets results?
                      Our platform puts your campaign in front of an audience
                      that’s passionate about supporting Black-owned businesses.
                      It’s exposure that helps you connect with people who are
                      ready to back your vision.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      We offer a sponsorship matching option, so your
                      supporters’ contributions can be matched 2X up to 5X. No
                      more waiting for approval or dealing with red tape – just
                      the funding you need to grow.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      <b>
                        Key and Exclusive Benefits of fundraising with Orisuun:
                      </b>
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      1. <b>Sponsorship Matching</b>– With our sponsorship
                      matching option, every dollar raised can be doubled,
                      tripled, or more.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      2. <b>Reward System</b> – Offer rewards to your backers to
                      keep them engaged and incentivize higher contributions.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      3.<b>Public Facing Campaigns </b> – In addition to
                      Orisuun’s membership, your campaign is made available to
                      the public, giving you access to a wider audience and more
                      opportunities to get funded.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      4. <b>No Target Requirement</b> – Unlike other platforms,
                      you don’t need to hit your target to get the funds. If you
                      raise even a small amount, it’s yours to keep.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      5. <b>Lowest Fees</b> – We keep our costs the lowest (just
                      1%) of any crowdfunding platform anywhere.
                    </p>
                  </div>
                </div>
                <div className="relative small-500:order-2 flex items-start">
                  <div className="relative z-10 md:w-full small-500:h-full">
                    <Image alt="platform" src={fundraisingownedbusiness} width={733} height={500}/>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex md:flex-row flex-col-reverse gap-5">
                <div className="xl:pl-24 sm:pl-5">
                  <div className="w-full pb-5 flex h-full flex-col items-start justify-center gap-3 lg:w-[480px] small-500:pt-0 small-500:mb-10">
                    <h2 className="text-blue-strong lg:text-[32px] font-semibold leading-110 text-[20px] mb-3 lg:pt-24">
                      For Sponsors
                    </h2>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      Supporting Black-owned businesses is more than just a good
                      cause – it’s a smart investment in the future. By
                      partnering with our crowdfunding platform and matching
                      donations, you can double or triple the impact of every
                      contribution and help elevate businesses that need your
                      support.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      Our matching donation program is designed to make your
                      support go further. Your contributions not only provide
                      crucial funding for entrepreneurs but also inspire others
                      to get involved.
                    </p>
                    <p className="text-[#6E6E6E] lg:text-[20px] font-medium leading-150 text-base">
                      Whether you’re a corporation, individual, or organization,
                      your matched donation creates a ripple effect that can
                      empower a business for years to come.
                    </p>
                  </div>
                </div>
                <div className="relative small-500:order-2 flex items-start">
                  <div className="relative z-10 md:w-full small-500:h-full">
                    <Image alt="platform" src={Fundraisingforsponsorsimg} width={733} height={500}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
