'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import Image from 'next/image';
const Discountclub = staticUrl + "/what we offer/discount-club.svg";
const Crowdfunding = staticUrl + "/what we offer/Crowdfunding.svg";
const B2B = staticUrl + "/what we offer/B2B.svg";
import BlackOwnedBusinesses from './popups/grow/Black-OwnedBusinesses';
import Fundraising from './popups/grow/fundraising';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  discountClubPartnersData
} from './popups/constants';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';

// Dynamic import for popup component
const OfferPopup = dynamic(() => import('./popups/OfferPopup'), {
  ssr: false
});

export const Grow = () => {
  const [activePopup, setActivePopup] = useState(null);
  
    const handleOpenPopup = (popupName) => {
      setActivePopup(popupName);
    };
  
    const handleClosePopup = () => {
      setActivePopup(null);
    };
  return (
    <>
      <BlackOwnedBusinesses
        isOpen={activePopup === 'Fundraising'}
        onClose={handleClosePopup}
      />
      <OfferPopup
        isOpen={activePopup === 'Discountclubpartners'}
        onClose={handleClosePopup}
        data={discountClubPartnersData}
      />
      <Fundraising
        isOpen={activePopup === 'BlackOwnedBusinesses'}
        onClose={handleClosePopup}
      />
      <div className=" text-white relative z-10">
        {/* Section Header */}
        <h2 className="text-[72px] md:text-[64px] lg:text-[48px] font-black md:mb-14 mb-8 relative inline-block">
          Grow
        </h2>
        <div className="flex md:flex-row flex-col gap-5 items-end">
          {/* Card 1 */}
          <div
            onClick={() => handleOpenPopup('Discountclubpartners')}
            className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex flex-col xl:w-[28%] md:w-[33%] w-full min-h-[610px]"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-8 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 md:pt-16 pt-10 md:mb-0 mb-[-32px] relative">
              <Image 
                alt="Discount Club Partners" 
                className="mx-auto" 
                src={Discountclub}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8  p-6 relative z-10 w-full mt-auto xl:min-h-[auto] md:min-h-[350px]">
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
                    d="M6.39844 6.68429V29.4398L10.7293 26.5954L13.6165 29.4398L16.5037 26.5954L19.3909 29.4398L22.2781 26.5954L26.609 29.4398V6.68429C26.609 5.92989 26.3048 5.2064 25.7633 4.67296C25.2219 4.13953 24.4875 3.83984 23.7217 3.83984H9.28566C8.51992 3.83984 7.78554 4.13953 7.24408 4.67296C6.70263 5.2064 6.39844 5.92989 6.39844 6.68429ZM21.167 9.8935C21.5429 10.2405 21.5664 10.8265 21.2194 11.2025L13.1352 19.9604C12.7882 20.3363 12.2021 20.3597 11.8262 20.0127C11.4503 19.6657 11.4269 19.0797 11.7739 18.7038L19.8581 9.94586C20.2051 9.56994 20.7911 9.5465 21.167 9.8935ZM11.521 11.9245C11.521 11.0408 12.2373 10.3245 13.121 10.3245C14.0046 10.3245 14.721 11.0408 14.721 11.9245C14.721 12.8081 14.0046 13.5245 13.121 13.5245C12.2373 13.5245 11.521 12.8081 11.521 11.9245ZM19.8657 17.0584C18.982 17.0584 18.2657 17.7747 18.2657 18.6584C18.2657 19.542 18.982 20.2584 19.8657 20.2584C20.7494 20.2584 21.4657 19.542 21.4657 18.6584C21.4657 17.7747 20.7494 17.0584 19.8657 17.0584Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Discount Club - Partners
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
                Lower your costs with exclusive disocunts from popular vendors
                across all industries
              </p>
            </div>
          </div>
          <div
            onClick={() => handleOpenPopup('BlackOwnedBusinesses')}
            className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex flex-col xl:w-[44%] md:w-[33%]"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-8 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 md:pt-16 relative">
              <Image 
                alt="Crowdfunding Platform" 
                className="mx-auto" 
                src={Crowdfunding}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8 md:pr-44 p-6 relative z-10 w-full mt-auto xl:min-h-[auto] md:min-h-[350px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="32"
                  viewBox="0 0 30 32"
                  fill="none"
                >
                  <path
                    d="M8.84584 23.4827C10.0422 23.4827 11.012 22.5129 11.012 21.3165C11.012 20.1202 10.0422 19.1504 8.84584 19.1504C7.64951 19.1504 6.67969 20.1202 6.67969 21.3165C6.67969 22.5129 7.64951 23.4827 8.84584 23.4827Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M8.84576 31.2616C11.6519 31.2616 13.8673 30.4739 13.8673 29.4893C13.8673 26.7324 11.6027 24.4678 8.84576 24.4678C6.08883 24.4678 3.82422 26.7324 3.82422 29.4893C3.82422 30.4739 6.0396 31.2616 8.84576 31.2616ZM10.7165 27.7662H11.7011V28.7508H10.7165V27.7662ZM8.35345 27.7662H9.33806V28.7508H8.35345V27.7662ZM5.99037 27.7662H6.97499V28.7508H5.99037V27.7662Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M3.33203 22.5966C3.33203 23.5813 4.26742 24.3689 5.44895 24.3689H5.74434C6.08895 24.1228 6.4828 23.9751 6.92588 23.8274C6.18742 23.2366 5.69511 22.3505 5.69511 21.3659C5.69511 21.1689 5.69511 21.0213 5.74434 20.8243C5.64588 20.8243 5.54742 20.8243 5.44895 20.8243C4.26742 20.7751 3.33203 21.612 3.33203 22.5966Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M12.2425 20.7754C12.1441 20.7754 12.0456 20.7754 11.9472 20.7754C11.9964 20.9231 11.9964 21.12 11.9964 21.2677C11.9964 22.2523 11.5041 23.1877 10.7656 23.7292C11.1595 23.8769 11.5533 24.0739 11.9472 24.2708H11.9964H12.2918C13.4733 24.2708 14.4087 23.4831 14.4087 22.4985C14.3595 21.6123 13.3749 20.7754 12.2425 20.7754Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M0.527344 29.6364C0.527344 29.6856 0.527344 29.8333 0.773498 30.0794C1.26581 30.5225 2.34888 30.8671 3.67811 31.0148C3.13657 30.621 2.84119 30.1287 2.84119 29.4887C2.84119 27.9625 3.43196 26.5348 4.36734 25.501C2.20119 25.8948 0.527344 27.5687 0.527344 29.6364Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M13.9666 31.0148C15.345 30.8671 16.4281 30.5225 16.9204 30.0794C17.1666 29.8825 17.1666 29.6856 17.1666 29.6364C17.1666 27.6179 15.4927 25.8948 13.2773 25.501C14.262 26.5841 14.8527 27.9625 14.8527 29.4887C14.8035 30.0794 14.5081 30.621 13.9666 31.0148Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M29.1794 6.25166H23.9609V1.0332L29.1794 6.25166Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M17.9062 14.5225H20.417V17.7225H17.9062V14.5225Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M14.4102 14.5225H16.9209V17.7225H14.4102V14.5225Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M17.9062 10.3877H20.417V13.5877H17.9062V10.3877Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M14.4102 10.3877H16.9209V13.5877H14.4102V10.3877Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M21.3984 14.5225H23.9092V17.7225H21.3984V14.5225Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M23.4676 7.23674C23.2215 7.23674 22.9753 6.99059 22.9753 6.74443V0.738281H10.2738C9.43688 0.738281 8.79688 1.42751 8.79688 2.2152V18.2152C9.97841 18.2152 11.0615 18.9044 11.5538 19.889H11.7507C13.8184 19.6921 15.2953 21.0706 15.2953 22.646C15.2953 23.4829 14.8523 24.2706 14.2123 24.7629C17.1169 25.6983 18.3969 28.4552 18.1015 29.8829H27.9969C28.8338 29.8829 29.4738 29.1937 29.4738 28.406V7.23674H23.4676ZM19.1353 3.4952H20.12V4.47982H19.1353V3.4952ZM15.6892 3.4952H16.6738V4.47982H15.6892V3.4952ZM12.243 3.4952H13.2276V4.47982H12.243V3.4952ZM11.8492 6.74443C11.8492 6.44905 12.0461 6.25213 12.3415 6.25213H20.4153C20.7107 6.25213 20.9076 6.44905 20.9076 6.74443C20.9076 7.03982 20.7107 7.23674 20.4153 7.23674H12.3415C12.0461 7.23674 11.8492 7.03982 11.8492 6.74443ZM24.3538 24.7137H17.4123C17.1169 24.7137 16.92 24.5167 16.92 24.2214C16.92 23.926 17.1169 23.729 17.4123 23.729H24.3538C24.6492 23.729 24.8461 23.926 24.8461 24.2214C24.8461 24.5167 24.6492 24.7137 24.3538 24.7137ZM24.3538 21.7598H17.4123C17.1169 21.7598 16.92 21.5629 16.92 21.2675C16.92 20.9721 17.1169 20.7752 17.4123 20.7752H24.3538C24.6492 20.7752 24.8461 20.9721 24.8461 21.2675C24.8461 21.5629 24.6492 21.7598 24.3538 21.7598ZM24.8461 14.0306V18.2152C24.8461 18.5106 24.6492 18.7075 24.3538 18.7075H20.8584H17.363H13.8676C13.5723 18.7075 13.3753 18.5106 13.3753 18.2152V14.0306V9.84597C13.3753 9.55059 13.5723 9.35366 13.8676 9.35366H17.363H20.8584H24.3538C24.6492 9.35366 24.8461 9.55059 24.8461 9.84597V14.0306Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M21.3984 10.3877H23.9092V13.5877H21.3984V10.3877Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Crowdfunding
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
                Launch a campaign to raise funds for new equipment, expansion,
                or new products (*requires verification: $99/lifetime)
              </p>
            </div>
          </div>
          <div
            onClick={() => handleOpenPopup('Fundraising')}
            className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex flex-col xl:w-[28%] md:w-[33%] w-full min-h-[610px]"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-8 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 md:pt-5 mb-[-32px] relative">
              <Image 
                alt="B2B Marketplace" 
                className="mx-auto" 
                src={B2B}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8  p-6 relative z-10 w-full mt-auto xl:min-h-[auto] md:min-h-[350px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M25.375 17.875C25.8919 17.875 26.3125 18.2956 26.3125 18.8125C26.3125 19.3294 25.8919 19.75 25.375 19.75C24.8581 19.75 24.4375 19.3294 24.4375 18.8125C24.4375 18.2956 24.8581 17.875 25.375 17.875ZM25.375 17.875C25.8919 17.875 26.3125 18.2956 26.3125 18.8125C26.3125 19.3294 25.8919 19.75 25.375 19.75C24.8581 19.75 24.4375 19.3294 24.4375 18.8125C24.4375 18.2956 24.8581 17.875 25.375 17.875ZM31 1C31.5523 1 32 1.44772 32 2V30C32 30.5523 31.5523 31 31 31H12.3125C11.7602 31 11.3125 30.5523 11.3125 30V2C11.3125 1.44772 11.7602 1 12.3125 1H31ZM20.6875 4.75H18.8125V6.625H20.6875V4.75ZM20.6875 8.5H18.8125V10.375H20.6875V8.5ZM20.6875 12.25H18.8125V14.125H20.6875V12.25ZM24.4375 4.75H22.5625V6.625H24.4375V4.75ZM24.4375 8.5H22.5625V10.375H24.4375V8.5ZM24.4375 12.25H22.5625V14.125H24.4375V12.25ZM28.1875 4.75H26.3125V6.625H28.1875V4.75ZM28.1875 8.5H26.3125V10.375H28.1875V8.5ZM28.1875 12.25H26.3125V14.125H28.1875V12.25ZM28.1875 18.8125C28.1875 17.2619 26.9256 16 25.375 16C23.8244 16 22.5625 17.2619 22.5625 18.8125C22.5625 20.3631 23.8244 21.625 25.375 21.625C26.9256 21.625 28.1875 20.3631 28.1875 18.8125ZM25.3751 26.3124C25.7792 25.989 25.8448 25.3992 25.5214 24.995L19.1925 17.0839C18.8691 16.6796 18.2792 16.6141 17.8749 16.9376C17.4707 17.261 17.4052 17.8508 17.7286 18.255L24.0575 26.1661C24.3809 26.5704 24.9708 26.6359 25.3751 26.3124ZM17.875 27.25C19.4256 27.25 20.6875 25.9881 20.6875 24.4375C20.6875 22.8869 19.4256 21.625 17.875 21.625C16.3244 21.625 15.0625 22.8869 15.0625 24.4375C15.0625 25.9881 16.3244 27.25 17.875 27.25ZM15.0625 14.125H16.9375V12.25H15.0625V14.125ZM15.0625 10.375H16.9375V8.5H15.0625V10.375ZM15.0625 6.625H16.9375V4.75H15.0625V6.625ZM17.875 23.5C18.3919 23.5 18.8125 23.9206 18.8125 24.4375C18.8125 24.9544 18.3919 25.375 17.875 25.375C17.3581 25.375 16.9375 24.9544 16.9375 24.4375C16.9375 23.9206 17.3581 23.5 17.875 23.5ZM24.4375 18.8125C24.4375 18.2956 24.8581 17.875 25.375 17.875C25.8919 17.875 26.3125 18.2956 26.3125 18.8125C26.3125 19.3294 25.8919 19.75 25.375 19.75C24.8581 19.75 24.4375 19.3294 24.4375 18.8125ZM25.375 17.875C25.8919 17.875 26.3125 18.2956 26.3125 18.8125C26.3125 19.3294 25.8919 19.75 25.375 19.75C24.8581 19.75 24.4375 19.3294 24.4375 18.8125C24.4375 18.2956 24.8581 17.875 25.375 17.875ZM25.375 17.875C25.8919 17.875 26.3125 18.2956 26.3125 18.8125C26.3125 19.3294 25.8919 19.75 25.375 19.75C24.8581 19.75 24.4375 19.3294 24.4375 18.8125C24.4375 18.2956 24.8581 17.875 25.375 17.875Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M8.12282 7.94268C8.77005 7.72811 9.4375 8.21001 9.4375 8.89188V30.8C9.4375 30.9104 9.34796 31 9.2375 31H7.7625C7.65204 31 7.5625 30.9104 7.5625 30.8V25.375H1.9375V30.8C1.9375 30.9104 1.84796 31 1.7375 31H0.2C0.0895433 31 0 30.9104 0 30.8V11.3576C0 10.9266 0.276186 10.544 0.685319 10.4084L8.12282 7.94268ZM5.6875 23.5H7.5625V21.625H5.6875V23.5ZM5.6875 19.75H7.5625V17.875H5.6875V19.75ZM5.6875 16H7.5625V14.125H5.6875V16ZM1.9375 23.5H3.8125V21.625H1.9375V23.5ZM1.9375 19.75H3.8125V17.875H1.9375V19.75ZM1.9375 16H3.8125V14.125H1.9375V16ZM5.6875 27.25V30.8C5.6875 30.9104 5.59796 31 5.4875 31H4.0125C3.90204 31 3.8125 30.9104 3.8125 30.8V27.25H5.6875Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Discount Club - B2B & B2C
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[100px]">
                Incentivize new or existing customers to buy from you with
                individualized discounts from your business (*requires
                verification: $99/lifetime)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
