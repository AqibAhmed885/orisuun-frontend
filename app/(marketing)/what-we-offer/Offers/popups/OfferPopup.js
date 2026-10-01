'use client';
import React from 'react';
import Image from 'next/image';

export default function OfferPopup(props) {
  const { isOpen, onClose, data } = props;
  const {
    title,
    title2,
    desc1,
    desc2,
    desc3,
    imgSrc,
    linkHref,
    linkText,
    padding,
    justifyStart,
    row
  } = data;
  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target.id === 'popup-backdrop') {
      onClose();
    }
  };

  return (
    <>
      <div id="popup-backdrop" onClick={handleBackdropClick} className="backdrop-blur-md bg-white/80 fixed w-screen h-screen top-0 bottom-0 z-[999999] left-0 right-0 bg-[#ffffffec] flex items-center justify-center">
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center xl:w-[1280px] md:w-[80%] w-[90%] bg-white rounded-2xl shadow-price2 mx-auto md:h-auto h-[80%]">
          <div className="lg:flex lg:items-center lg:justify-center md:p-0 p-3 relative overflow-y-auto h-full">
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
            <div
              className={`w-full flex ${row ? 'md:flex-row-reverse flex-col-reverse' : 'md:flex-row flex-col-reverse'
                } lg:gap-10 gap-5 justify-between`}
            >
              <div className={`${row ? 'pr-8' : 'xl:pl-24 sm:pl-5'
                } lg:flex-grow lg:w-auto md:w-[50%]`} >
                <div
                  className={`w-full pb-5 flex h-full flex-col items-start ${justifyStart ? 'justify-start xl:pt-24 sm:pt-10' : 'justify-center'
                    } lg:gap-1 gap-1 lg:w-[480px] small-500:pt-0 small-500:mb-10`}
                >
                  <h2 className="text-blue-strong lg:text-[32px] font-semibold leading-110 text-[20px] mb-3">
                    {title}
                  </h2>
                  <p className="text-blu-ray-300 lg:text-[20px] font-medium leading-150 text-[16px]">
                    {desc1}
                  </p>
                  {data.innerData2 && (
                    <div className="flex flex-col items-start justify-center bg-[#F8F8F8] rounded-[5px] gap-3 px-3 py-2">
                      {data.innerData2.map((text) => (
                        <div key={text.id}>
                          <p className="text-[#6E6E6E] text-[14px] font-medium leading-[18.2px] pb-6">
                            {text.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <h2 className="text-blue-strong lg:text-[20px] font-semibold leading-110 text-[20px] mb-3 pb-4 pt-4">
                    {title2}
                  </h2>
                  {desc2 && (
                    <p className="text-blu-ray-300 lg:text-[20px] font-medium leading-150 text-[16px]">
                      {desc2}
                    </p>
                  )}
                  {linkText && (
                    <a
                      href={linkHref}
                      className="text-[#5EA8FF] lg:text-[20px] font-medium leading-150 text-base"
                    >
                      {linkText}
                    </a>
                  )}
                  {desc3 && (
                    <p className="text-blu-ray-300 lg:text-[20px] font-medium leading-150 text-[16px]">
                      {desc3}
                    </p>
                  )}
                  {data.innerData && (
                    <div className="flex lg:gap-5 gap-3 flex-col w-full">
                      {data.innerData.map((text) => (
                        <div key={text.id} className="flex gap-5 w-full">
                          <div className="border-l border-blu-ray-300"></div>
                          <p className="h-full lg:text-[20px] font-medium text-blu-ray-300 leading-150 text-[16px]">
                            {text.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`${row ? 'md:p-10' : ''
                  } relative small-500:order-2 flex items-start lg:w-auto md:w-[50%] `}
              >
                <div className="relative z-10 md:w-full small-500:h-full">
                  <Image alt={title} src={imgSrc} className={padding} width={733} height={500}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
