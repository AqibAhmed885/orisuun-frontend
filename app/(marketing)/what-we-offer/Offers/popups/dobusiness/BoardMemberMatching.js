'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import React from 'react';
import Image from 'next/image';
const boardmemberimg = staticUrl + "/home/images/swiper/boardmemberimg.png";

export default function Boardmember({ isOpen, onClose }) {
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
                    Board Member Matching
                  </h2>
                  <p className="text-blu-ray-300 lg:text-[20px] font-medium leading-150 text-[16px]">
                    Take your company’s governance and stability up a notch.
                    Bringing on the right board member who is aligned and
                    properly motivated can greatly increase the longevity,
                    stability, and long-term prospects of a business.
                  </p>
                  <p>
                    Our board member matching system allows members to create
                    easily searchable posts designed to introduce your company
                    to a world of exceptionally talented potential board members
                    that your business would not otherwise have access to.
                  </p>
                </div>
              </div>
              <div className="relative small-500:order-2 flex items-start">
                <div className="relative z-10 md:w-full small-500:h-full">
                  <Image alt="platform" src={boardmemberimg} width={733} height={500}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
