'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL; 
import Image from 'next/image';
const BoardMembe = staticUrl + "/what we offer/BoardMembe Matching.svg";
const founderMatching = staticUrl + "/what we offer/Co-founderMatching.svg";
const TransactionsandEscrow = staticUrl + "/what we offer/TransactionsandEscrow.svg";
const businessdevelopment = staticUrl + "/what we offer/business_development.svg";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  BoardmemberData,
  BusinessdevelopmentData,
  CofounderData,
TransactionsData} from './popups/constants';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';

// Dynamic import for popup component
const OfferPopup = dynamic(() => import('./popups/OfferPopup'), {
  ssr: false
});

export const Dobusiness = () => {
  const [activePopup, setActivePopup] = useState(null);

  const handleOpenPopup = (popupName) => {
    setActivePopup(popupName);
  };

  const handleClosePopup = () => {
    setActivePopup(null);
  };
  return (
    <>
      <OfferPopup
        isOpen={activePopup === 'BoardMemberMatching'}
        onClose={handleClosePopup}
        data={BoardmemberData}
      />
      <OfferPopup
        isOpen={activePopup === 'Businessdevelopment'}
        onClose={handleClosePopup}
        data={BusinessdevelopmentData}
      />
      <OfferPopup
        isOpen={activePopup === 'Cofounder'}
        onClose={handleClosePopup}
        data={CofounderData}
      />
      <OfferPopup
        isOpen={activePopup === 'Transactions'}
        onClose={handleClosePopup}
        data={TransactionsData}
      />
      <div className=" text-white relative z-10">
        {/* Section Header */}
        <h2 className="text-[72px] md:text-[64px] lg:text-[48px] font-black md:mb-14 mb-8 relative inline-block">
          Do Business
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => handleOpenPopup('Transactions')}
            className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex flex-col"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 h-[50%]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 md:mb-[-32px] mb-0 md:pt-20 pt-8 relative">
              <Image
                alt="Transactions and Escrow"
                className="mx-auto md:px-0 px-5"
                src={TransactionsandEscrow}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 md:p-8  p-6 md:pr-[31%] relative z-10 w-auto mt-auto">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.4261 8.26636L20.5804 3.4206L22.0889 1.91211L27.8127 7.63597C28.75 8.57323 28.75 10.0928 27.8127 11.0301L22.0889 16.7539L20.5804 15.2454L25.4261 10.3997H2.66797V8.26636H25.4261ZM4.18986 20.9693L9.91372 15.2454L11.4222 16.7539L6.57646 21.5997H29.3346V23.733H6.57646L11.4222 28.5788L9.91372 30.0873L4.18986 24.3634C3.25261 23.4262 3.2526 21.9066 4.18986 20.9693Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Transactions and Escrow
              </h3>
              <p className="text-[18px] font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
              In-platform peer-to-peer payment system, so you can do business. Orisuun acts as &quot;escrow agent&quot; to ensure payment is made only after goods or services are received
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div
              onClick={() => handleOpenPopup('Businessdevelopment')}
              className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex md:flex-row flex-col-reverse justify-between min-h-[280px]"
            >
              <div
                className="absolute inset-0 z-10 top-auto small-767:bottom-12 md:h-full h-[300px]
             bg-gradient-to-t from-[#B9D9EB] from-40% to-transparent 
             md:bg-gradient-to-r"
                // style={{
                //   background:
                //     'linear-gradient(90deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
                // }}
              ></div>
              <div className="flex flex-col gap-3 md:py-8 md:pl-8 py-6 pl-6 pt-0 relative z-10 md:w-[430px] w-full mt-auto">
                <div className="size-[32px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="30"
                    viewBox="0 0 26 30"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.6666 0.667154C15.7275 0.657607 16.7487 1.06988 17.5056 1.81327C18.2625 2.55667 18.6931 3.57029 18.7026 4.63115C18.7122 5.69202 18.2999 6.71323 17.5565 7.47013C16.8131 8.22702 15.7995 8.65761 14.7386 8.66715L14.448 9.53782C15.1355 9.95475 15.7323 10.5056 16.2027 11.1577C16.6732 11.8098 17.0078 12.5499 17.1866 13.3338H18.9453C19.2516 12.632 19.7903 12.057 20.4707 11.7055C21.1511 11.3541 21.9317 11.2477 22.6814 11.4041C23.431 11.5606 24.1039 11.9704 24.587 12.5647C25.07 13.1589 25.3337 13.9014 25.3337 14.6672C25.3337 15.433 25.07 16.1754 24.587 16.7697C24.1039 17.3639 23.431 17.7737 22.6814 17.9302C21.9317 18.0866 21.1511 17.9802 20.4707 17.6288C19.7903 17.2773 19.2516 16.7024 18.9453 16.0005H17.1853C16.9633 16.9731 16.5023 17.8749 15.844 18.6245L16.7826 19.5632C17.4955 19.2834 18.283 19.2577 19.0127 19.4903C19.7423 19.7228 20.3696 20.1996 20.7891 20.8403C21.2086 21.481 21.3946 22.2466 21.316 23.0084C21.2373 23.7702 20.8988 24.4816 20.3573 25.0232C19.8158 25.5647 19.1043 25.9032 18.3425 25.9818C17.5808 26.0605 16.8152 25.8744 16.1744 25.4549C15.5337 25.0355 15.057 24.4082 14.8244 23.6785C14.5918 22.9489 14.6175 22.1614 14.8973 21.4485L13.652 20.2032C12.9175 20.5101 12.1293 20.6678 11.3333 20.6672C10.4171 20.6672 9.51314 20.4573 8.69063 20.0538L7.5293 21.4485C7.97372 22.2807 8.10966 23.2433 7.9131 24.1661C7.71654 25.0888 7.20012 25.9124 6.4551 26.4913C5.71008 27.0702 4.78442 27.3671 3.84169 27.3295C2.89896 27.292 1.99985 26.9224 1.30323 26.2861C0.606607 25.6498 0.157322 24.7878 0.0347657 23.8523C-0.0877911 22.9168 0.124269 21.9681 0.633475 21.1739C1.14268 20.3796 1.91625 19.7909 2.81749 19.5118C3.71874 19.2326 4.68964 19.2811 5.55863 19.6485L6.6173 18.3765C5.78366 17.32 5.33122 16.0129 5.3333 14.6672C5.3333 13.6872 5.56796 12.7632 5.98396 11.9458L4.82663 10.9805C4.1419 11.3236 3.3599 11.4204 2.61215 11.2547C1.86441 11.089 1.19653 10.6709 0.720856 10.0706C0.245176 9.47038 -0.0092883 8.72463 0.000259204 7.9588C0.00980671 7.19298 0.282784 6.4538 0.77328 5.86559C1.26378 5.27738 1.94187 4.87602 2.69351 4.72901C3.44515 4.582 4.22449 4.69831 4.90046 5.05838C5.57642 5.41845 6.10778 6.00032 6.40515 6.70611C6.70252 7.41191 6.74777 8.19858 6.5333 8.93382L7.6933 9.89915C8.89783 8.97609 10.4085 8.54609 11.9186 8.69649L12.2093 7.82449C11.5513 7.31265 11.0696 6.60801 10.8316 5.80905C10.5936 5.01009 10.6112 4.15673 10.8819 3.36825C11.1526 2.57978 11.6629 1.89558 12.3415 1.4113C13.0201 0.927017 13.833 0.666847 14.6666 0.667154ZM3.99996 22.0005C3.64634 22.0005 3.3072 22.141 3.05715 22.391C2.8071 22.6411 2.66663 22.9802 2.66663 23.3338C2.66663 23.6874 2.8071 24.0266 3.05715 24.2766C3.3072 24.5267 3.64634 24.6672 3.99996 24.6672C4.35358 24.6672 4.69272 24.5267 4.94277 24.2766C5.19282 24.0266 5.3333 23.6874 5.3333 23.3338C5.3333 22.9802 5.19282 22.6411 4.94277 22.391C4.69272 22.141 4.35358 22.0005 3.99996 22.0005ZM18 22.0005C17.8232 22.0005 17.6536 22.0707 17.5286 22.1958C17.4035 22.3208 17.3333 22.4903 17.3333 22.6672C17.3333 22.844 17.4035 23.0135 17.5286 23.1386C17.6536 23.2636 17.8232 23.3338 18 23.3338C18.1768 23.3338 18.3463 23.2636 18.4714 23.1386C18.5964 23.0135 18.6666 22.844 18.6666 22.6672C18.6666 22.4903 18.5964 22.3208 18.4714 22.1958C18.3463 22.0707 18.1768 22.0005 18 22.0005ZM11.3333 11.3338C10.4492 11.3338 9.60139 11.685 8.97627 12.3101C8.35115 12.9353 7.99996 13.7831 7.99996 14.6672C7.99996 15.5512 8.35115 16.3991 8.97627 17.0242C9.60139 17.6493 10.4492 18.0005 11.3333 18.0005C12.2174 18.0005 13.0652 17.6493 13.6903 17.0242C14.3154 16.3991 14.6666 15.5512 14.6666 14.6672C14.6666 13.7831 14.3154 12.9353 13.6903 12.3101C13.0652 11.685 12.2174 11.3338 11.3333 11.3338ZM22 14.0005C21.8232 14.0005 21.6536 14.0707 21.5286 14.1958C21.4035 14.3208 21.3333 14.4903 21.3333 14.6672C21.3333 14.844 21.4035 15.0135 21.5286 15.1386C21.6536 15.2636 21.8232 15.3338 22 15.3338C22.1768 15.3338 22.3463 15.2636 22.4714 15.1386C22.5964 15.0135 22.6666 14.844 22.6666 14.6672C22.6666 14.4903 22.5964 14.3208 22.4714 14.1958C22.3463 14.0707 22.1768 14.0005 22 14.0005ZM3.3333 7.33382C3.15648 7.33382 2.98692 7.40406 2.86189 7.52908C2.73687 7.65411 2.66663 7.82368 2.66663 8.00049C2.66663 8.1773 2.73687 8.34687 2.86189 8.47189C2.98692 8.59692 3.15648 8.66715 3.3333 8.66715C3.51011 8.66715 3.67968 8.59692 3.8047 8.47189C3.92972 8.34687 3.99996 8.1773 3.99996 8.00049C3.99996 7.82368 3.92972 7.65411 3.8047 7.52908C3.67968 7.40406 3.51011 7.33382 3.3333 7.33382ZM14.6666 3.33382C14.313 3.33382 13.9739 3.4743 13.7238 3.72435C13.4738 3.97439 13.3333 4.31353 13.3333 4.66715C13.3333 5.02078 13.4738 5.35991 13.7238 5.60996C13.9739 5.86001 14.313 6.00049 14.6666 6.00049C15.0203 6.00049 15.3594 5.86001 15.6094 5.60996C15.8595 5.35991 16 5.02078 16 4.66715C16 4.31353 15.8595 3.97439 15.6094 3.72435C15.3594 3.4743 15.0203 3.33382 14.6666 3.33382Z"
                      fill="#001E5F"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                  Business Development Matching
                </h3>
                <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
                  Create searchable posts showcasing the business development
                  opportunities you can facilitate or are seeking
                </p>
              </div>

              <div className="text-center py-8 relative">
                <Image
                  alt="Business Development Matching"
                  className="mx-auto size-auto"
                  src={businessdevelopment}
                  width={400}
                  height={300}
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 400px"
                  placeholder="blur"
                  blurDataURL={getShimmerPlaceholder(400, 300)}
                />
              </div>
            </div>
            <div
              onClick={() => handleOpenPopup('Cofounder')}
              className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex md:flex-row flex-col-reverse justify-between min-h-[280px]"
            >
              <div
                className="absolute inset-0 z-10 top-auto small-767:bottom-12 md:h-full h-[300px]
             bg-gradient-to-t from-[#B9D9EB] from-40% to-transparent 
             md:bg-gradient-to-r"
                // style={{
                //   background:
                //     'linear-gradient(90deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
                // }}
              ></div>
              <div className="flex flex-col gap-3 md:p-8  p-6 relative z-10 md:w-[430px] w-full mt-auto">
                <div className="size-[32px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M14.3992 3.2002C12.7018 3.2002 11.074 3.87448 9.87373 5.07471C8.6735 6.27494 7.99922 7.90281 7.99922 9.60019C7.99922 11.2976 8.6735 12.9254 9.87373 14.1257C11.074 15.3259 12.7018 16.0002 14.3992 16.0002C16.0966 16.0002 17.7245 15.3259 18.9247 14.1257C20.1249 12.9254 20.7992 11.2976 20.7992 9.60019C20.7992 7.90281 20.1249 6.27494 18.9247 5.07471C17.7245 3.87448 16.0966 3.2002 14.3992 3.2002ZM6.41362 17.6002C5.99218 17.5983 5.57451 17.6797 5.18461 17.8396C4.7947 17.9996 4.44024 18.235 4.14156 18.5323C3.84289 18.8297 3.60589 19.1831 3.44417 19.5723C3.28246 19.9615 3.19921 20.3787 3.19922 20.8002C3.19922 23.5058 4.53202 25.5458 6.61522 26.8754C8.66642 28.1826 11.4312 28.8002 14.3992 28.8002C15.0574 28.8002 15.7027 28.7698 16.3352 28.709C15.0794 27.1479 14.3962 25.2037 14.3992 23.2002C14.3992 21.0722 15.1544 19.1202 16.4104 17.6002H6.41362ZM23.1992 30.4002C25.1088 30.4002 26.9401 29.6416 28.2904 28.2914C29.6406 26.9411 30.3992 25.1098 30.3992 23.2002C30.3992 21.2906 29.6406 19.4593 28.2904 18.109C26.9401 16.7588 25.1088 16.0002 23.1992 16.0002C21.2897 16.0002 19.4583 16.7588 18.108 18.109C16.7578 19.4593 15.9992 21.2906 15.9992 23.2002C15.9992 25.1098 16.7578 26.9411 18.108 28.2914C19.4583 29.6416 21.2897 30.4002 23.1992 30.4002ZM23.1992 19.2002C23.4114 19.2002 23.6149 19.2845 23.7649 19.4345C23.9149 19.5845 23.9992 19.788 23.9992 20.0002V22.4002H26.3992C26.6114 22.4002 26.8149 22.4845 26.9649 22.6345C27.1149 22.7845 27.1992 22.988 27.1992 23.2002C27.1992 23.4124 27.1149 23.6159 26.9649 23.7659C26.8149 23.9159 26.6114 24.0002 26.3992 24.0002H23.9992V26.4002C23.9992 26.6124 23.9149 26.8159 23.7649 26.9659C23.6149 27.1159 23.4114 27.2002 23.1992 27.2002C22.987 27.2002 22.7836 27.1159 22.6335 26.9659C22.4835 26.8159 22.3992 26.6124 22.3992 26.4002V24.0002H19.9992C19.787 24.0002 19.5836 23.9159 19.4335 23.7659C19.2835 23.6159 19.1992 23.4124 19.1992 23.2002C19.1992 22.988 19.2835 22.7845 19.4335 22.6345C19.5836 22.4845 19.787 22.4002 19.9992 22.4002H22.3992V20.0002C22.3992 19.788 22.4835 19.5845 22.6335 19.4345C22.7836 19.2845 22.987 19.2002 23.1992 19.2002Z"
                      fill="#001E5F"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                  Co-founder Matching
                </h3>
                <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
                  Create searchable posts showcasing the co-founder
                  opportunities you can facilitate or are seeking
                </p>
              </div>

              <div className="text-center px-11 pt-16 md:pb-14">
                <Image
                  alt="Co-founder Matching"
                  className="mx-auto size-auto md:absolute right-6 bottom-0"
                  src={founderMatching}
                  width={400}
                  height={300}
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 400px"
                  placeholder="blur"
                  blurDataURL={getShimmerPlaceholder(400, 300)}
                />
              </div>
            </div>
            <div
              onClick={() => handleOpenPopup('BoardMemberMatching')}
              className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex md:flex-row flex-col-reverse justify-between min-h-[280px]"
            >
              <div
                className="absolute inset-0 z-10 top-auto small-767:bottom-12 md:h-full h-[300px]
             bg-gradient-to-t from-[#B9D9EB] from-40% to-transparent 
             md:bg-gradient-to-r"
                // style={{
                //   background:
                //     'linear-gradient(90deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
                // }}
              ></div>
              <div className="flex flex-col gap-3 md:p-8  p-6 relative z-10 md:w-[430px] w-full mt-auto">
                <div className="size-[32px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M10.668 15.9997C12.0825 15.9997 13.439 15.4378 14.4392 14.4376C15.4394 13.4374 16.0013 12.0808 16.0013 10.6663C16.0013 9.25185 15.4394 7.8953 14.4392 6.8951C13.439 5.89491 12.0825 5.33301 10.668 5.33301C9.25348 5.33301 7.89693 5.89491 6.89673 6.8951C5.89654 7.8953 5.33464 9.25185 5.33464 10.6663C5.33464 12.0808 5.89654 13.4374 6.89673 14.4376C7.89693 15.4378 9.25348 15.9997 10.668 15.9997ZM22.668 15.9997C23.7288 15.9997 24.7463 15.5782 25.4964 14.8281C26.2465 14.078 26.668 13.0605 26.668 11.9997C26.668 10.9388 26.2465 9.92139 25.4964 9.17125C24.7463 8.4211 23.7288 7.99967 22.668 7.99967C21.6071 7.99967 20.5897 8.4211 19.8395 9.17125C19.0894 9.92139 18.668 10.9388 18.668 11.9997C18.668 13.0605 19.0894 14.078 19.8395 14.8281C20.5897 15.5782 21.6071 15.9997 22.668 15.9997ZM5.66797 18.6663C4.87232 18.6663 4.10926 18.9824 3.54665 19.545C2.98404 20.1076 2.66797 20.8707 2.66797 21.6663V21.9997C2.66797 21.9997 2.66797 27.9997 10.668 27.9997C18.668 27.9997 18.668 21.9997 18.668 21.9997V21.6663C18.668 20.8707 18.3519 20.1076 17.7893 19.545C17.2267 18.9824 16.4636 18.6663 15.668 18.6663H5.66797ZM22.668 25.9997C21.1066 25.9997 19.9106 25.7583 18.9946 25.389C19.5278 24.4893 19.8624 23.486 19.976 22.4463C19.9889 22.32 19.9974 22.1933 20.0013 22.0663V21.6663C20.003 20.5493 19.572 19.4751 18.7986 18.669L18.9346 18.6663H26.4013C27.1793 18.6663 27.9254 18.9754 28.4755 19.5255C29.0256 20.0756 29.3346 20.8217 29.3346 21.5997C29.3346 21.5997 29.3346 25.9997 22.668 25.9997Z"
                      fill="#001E5F"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                  Board Member Matching
                </h3>
                <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
                  Create searchable posts for your new board member to find and
                  match with. Take your business governance and stability up a
                  notch
                </p>
              </div>

              <div className="text-center md:px-11 px-5 pt-16 md:pb-14 pb-5">
                <Image
                  alt="Board Member Matching"
                  className="mx-auto size-auto md:absolute right-3 bottom-0"
                  src={BoardMembe}
                  width={400}
                  height={300}
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 400px"
                  placeholder="blur"
                  blurDataURL={getShimmerPlaceholder(400, 300)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
