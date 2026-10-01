'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import React from 'react';
import Image from 'next/image';
const businesdevelopment = staticUrl + "/home/images/swiper/co-founderimg.png";

export default function Businessdevelopment({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed w-screen h-screen top-0 bottom-0 z-[999999] left-0 right-0 flex items-center justify-center bg-[#ffffffec]">
        <div className="sm:w-[80%] w-[90%]  bg-white rounded-2xl shadow-price2 mx-auto md:h-auto h-[80%]">
          <div className="md:p-0 p-3 relative overflow-y-auto h-full">
            <div className="header flex w-full justify-end md:py-3 md:px-7 p-0 xl:absolute z-[99] top-0 left-0 right-0">
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
            <div className="w-full flex md:flex-row flex-col-reverse gap-5">
              <div className="xl:pl-24 sm:pl-5">
                <div className="w-full pb-5 flex h-full flex-col items-start justify-center gap-3 lg:w-[480px] small-500:pt-0 small-500:mb-10">
                  <h2 className="text-blue-strong lg:text-[32px] font-semibold leading-110 text-[20px] mb-3">
                    Business Development Opportunity Matching
                  </h2>
                  <p className="text-blu-ray-300 lg:text-[20px] font-medium leading-150 text-[16px]">
                    Members can create searchable posts showcasing the business
                    development opportunities that they can facilitate for
                    others and the business development opportunities they are
                    seeking themselves.
                  </p>
                  <p>
                    Other interested members can find these posts through search
                    or on the posting member’s profile and match with it –
                    indicating that they are a viable counterparty. This means
                    they can facilitate the business development opportunity the
                    posting member is seeking, or they are seeking a business
                    development opportunity that the posting member can
                    facilitate.
                  </p>
                </div>
              </div>
              <div className="relative small-500:order-2 flex items-start">
                <div className="relative z-10 md:w-full small-500:h-full">
                  <Image alt="platform" src={businesdevelopment} width={733} height={500}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
