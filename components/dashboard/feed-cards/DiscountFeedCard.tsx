import React from 'react';
import Image from 'next/image';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import moment from 'moment';
import { feedTypes } from '@/utils/constants';
import { resolveUserProfileImageSrc } from '@/utils/image-url';

export const DiscountFeedCard = ({ feed, onRedirect }) => {
  if (!feed?.Content) return null;

  const discount = feed?.Discount ?? null;

  const logoSrc =
    resolveUserProfileImageSrc(discount?.CompanyLogo) ||
    resolveUserProfileImageSrc(feed?.User?.ProfileDetails?.ProfilePicture) ||
    BASE_URL;

  // derive badge text (prefer explicit percent/code when available)
  const _badgeSource =
    (discount?.DiscountDescription || '') ||
    (feed?.DiscountTitle || '') ||
    (discount?.ActiveDiscount || '') ||
    (discount?.DiscountType || '') ||
    (discount?.DiscountCodeString || '');
  const percentMatch = _badgeSource.match(/(\d+\s?%|\d+\s?percent)/i);
  const discountText = percentMatch ? percentMatch[0] : (_badgeSource || 'Discount');
  const isNumericBadge = /\d|%/.test(discountText);
  const showOff = isNumericBadge && !/off/i.test(discountText);

  const isNewDiscount = 
    feed?.Type === feedTypes.NewDiscountCreated ||
    feed?.Type === feedTypes.NewBusinessDiscountCreated ||
    feed?.Type === feedTypes.NewIndividualsDiscountCreated;

  const getEligibility = () => {
    // prefer explicit discount-level eligibility when provided
    if (discount?.ActiveDiscount) return discount.ActiveDiscount;
    if (discount?.DiscountFor) return discount.DiscountFor;

    if (feed?.Type === feedTypes.NewDiscountCreated) {
      return 'All Members';
    }
    if (feed?.Type === feedTypes.NewBusinessDiscountCreated) {
      return 'Business Members';
    }
    if (feed?.Type === feedTypes.NewIndividualsDiscountCreated) {
      return 'Business Members OR All Members';
    }
    return 'All Members';
  };

  const getAvailability = () => {
    return discount?.DiscountActivation ;
  };

  return (
    <div className="bg-white mb-4 rounded-2xl shadow-blur overflow-hidden p-4">
      {/* Header */}
      <h3 className="md:text-xl text-[10px] font-bold text-gray-900 mb-6">
        {isNewDiscount ? 'New Discount' : 'Discount Expiring Soon'}
      </h3>

      <div className="flex justify-between items-start md:gap-6 gap-3">
        {/* Left: Information */}
        <div className="flex-1 md:space-y-4 space-y-2">
          {/* Eligibility */}
          <div className='border p-2 rounded-lg'>
            <p className="md:text-sm text-[7px] text-gray-600 font-medium">Eligibility</p>
            <p className="md:text-base text-[8px] font-bold text-gray-900">{getEligibility()}</p>
          </div>

          {/* Expiration */}
          <div className='border p-2 rounded-lg'>
            <p className="md:text-sm text-[7px] text-gray-600 font-medium">Expiration</p>
            <p className="md:text-base text-[8px] font-bold text-gray-900">
              {feed?.Discount?.ProposalDuration} Months
            </p>
          </div>

          {/* Availability */}
          <div className='border p-2 rounded-lg'>
            <p className="md:text-sm text-[7px] text-gray-600 font-medium">Availability</p>
            <p className="md:text-base text-[8px] font-bold text-gray-900">{getAvailability()}</p>
          </div>
        </div>

        {/* Right: Discount Badge */}
        <button
          onClick={() =>
            onRedirect(feed?.DiscountId as string, feed?.Type as string)
          }
          className="flex-shrink-0 "
        >
          <svg
            width="236"
            height="236"
            viewBox="0 0 236 236"
            fill="none"
            className='w-[125px] md:w-[236px] h-auto'
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_189_1243)">
              <path
                d="M125.86 205.907L29.7224 110.398L29.7866 129.974C29.8036 135.162 31.8754 140.147 35.6067 143.756L112.104 219.753C119.763 227.363 132.194 227.322 139.803 219.662L200.387 158.681C207.996 151.021 207.955 138.59 200.296 130.981L125.86 205.907Z"
                fill="#2357C6"
              />
              <path
                d="M111.944 170.817C119.604 178.426 132.034 178.385 139.644 170.726L200.227 109.744C207.836 102.085 207.796 89.6541 200.136 82.0446L123.639 6.04751C119.909 2.43138 114.917 0.411305 109.722 0.416153L48.9392 0.615489C38.1726 0.650798 29.3924 9.48873 29.4277 20.2553L29.6271 81.0378C29.6441 86.2253 31.7159 91.2104 35.4471 94.8197L111.944 170.817ZM71.0581 29.9067C74.303 29.8961 77.4192 31.1749 79.7211 33.4619C82.0231 35.7488 83.3224 38.8565 83.333 42.1014C83.3437 45.3463 82.0648 48.4625 79.7779 50.7645C77.4909 53.0665 74.3832 54.3657 71.1383 54.3763C67.8935 54.387 64.7773 53.1081 62.4753 50.8212C60.1733 48.5343 58.8741 45.4265 58.8634 42.1817C58.8528 38.9368 60.1316 35.8206 62.4185 33.5186C64.7055 31.2166 67.8132 29.9174 71.0581 29.9067Z"
                fill="#2357C6"
              />
            </g>
            <g transform="rotate(-45 118 118)">
              <text
                x="140"
                y="80"
                textAnchor="middle"
                fill="#DDE8FF"
                fontSize="30"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                {/* {discountText.length > 12 ? `${discountText.slice(0, 12)}…` : discountText} */}
                {feed?.Discount?.DiscountPercentage}%
              </text>
              {/* {showOff && ( */}
                <text
                  x="140"
                  y="110"
                  textAnchor="middle"
                  fill="#DDE8FF"
                  fontSize="30"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  Off
                </text>
              {/* )} */}
              <text
                x="140"
                y="140"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                View Discount
              </text>
              <line
                x1="100"
                y1="145"
                x2="180"
                y2="145"
                stroke="#ffffff"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_189_1243">
                <rect
                  width="234.909"
                  height="234.909"
                  fill="white"
                  transform="translate(0 0.773438) rotate(-0.187901)"
                />
              </clipPath>
            </defs>
          </svg>

        </button>
      </div>

      {/* Footer: Company Name with Checkmark */}
      <div className="flex items-center justify-center gap-2 mt-4 ">
        <p className="font-bold md:text-lg text-[11px] text-gray-900">{feed?.User?.Name}</p>
        {feed?.User?.IsVerified === 1 && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_189_1266)">
                          <path d="M15.4442 3.54062C15.6342 4.00002 15.9988 4.36517 16.4579 4.55581L18.0678 5.22264C18.5272 5.41294 18.8922 5.77796 19.0825 6.23738C19.2728 6.69681 19.2728 7.21302 19.0825 7.67245L18.4162 9.28115C18.2258 9.74078 18.2255 10.2575 18.4168 10.7169L19.082 12.3251C19.1763 12.5527 19.2249 12.7966 19.2249 13.0429C19.225 13.2893 19.1765 13.5332 19.0822 13.7608C18.9879 13.9883 18.8497 14.1951 18.6755 14.3693C18.5013 14.5434 18.2945 14.6815 18.0669 14.7757L16.4582 15.4421C15.9988 15.632 15.6336 15.9966 15.443 16.4558L14.7762 18.0656C14.5859 18.525 14.2209 18.8901 13.7614 19.0804C13.302 19.2707 12.7858 19.2707 12.3264 19.0804L10.7177 18.414C10.2582 18.2242 9.7422 18.2246 9.28304 18.4151L7.67318 19.081C7.21401 19.2708 6.69825 19.2707 6.2392 19.0805C5.78014 18.8904 5.41533 18.5258 5.2249 18.0668L4.55788 16.4565C4.36793 15.9971 4.00332 15.632 3.54421 15.4413L1.93435 14.7745C1.47513 14.5843 1.11022 14.2195 0.919849 13.7603C0.729477 13.3012 0.729219 12.7852 0.919131 12.3258L1.58548 10.7171C1.77531 10.2577 1.77492 9.74167 1.5844 9.28252L0.91901 7.6715C0.824671 7.44395 0.776094 7.20005 0.776054 6.95372C0.776015 6.70739 0.824513 6.46346 0.91878 6.23588C1.01305 6.00831 1.15123 5.80153 1.32544 5.62738C1.49965 5.45322 1.70647 5.3151 1.93408 5.22091L3.54278 4.55456C4.00178 4.36478 4.36671 4.00063 4.55749 3.54205L5.22432 1.93219C5.41462 1.47277 5.77964 1.10775 6.23906 0.917451C6.69849 0.72715 7.2147 0.72715 7.67413 0.917451L9.28283 1.5838C9.74227 1.77363 10.2583 1.77324 10.7174 1.58272L12.328 0.918485C12.7874 0.72829 13.3034 0.728329 13.7628 0.918593C14.2221 1.10886 14.5871 1.47377 14.7774 1.93307L15.4444 3.54341L15.4442 3.54062Z" fill="url(#paint0_linear_189_1266)" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9166 7.37925C14.0502 7.1694 14.0949 6.91507 14.041 6.67221C13.9871 6.42935 13.8389 6.21785 13.6291 6.08425C13.4192 5.95065 13.1649 5.90588 12.922 5.9598C12.6792 6.01372 12.4677 6.1619 12.3341 6.37175L8.66283 12.1405L6.98283 10.0405C6.82751 9.84623 6.60138 9.72162 6.35418 9.69407C6.10699 9.66653 5.85897 9.73831 5.6647 9.89363C5.47043 10.0489 5.34582 10.2751 5.31827 10.5223C5.29073 10.7695 5.36251 11.0175 5.51783 11.2118L8.01783 14.3368C8.111 14.4534 8.23066 14.546 8.36687 14.6071C8.50308 14.6681 8.65189 14.6957 8.80094 14.6877C8.94998 14.6796 9.09494 14.6361 9.22376 14.5607C9.35258 14.4853 9.46154 14.3802 9.54158 14.2543L13.9166 7.37925Z" fill="white" />
                      </g>
                      <defs>
                          <linearGradient id="paint0_linear_189_1266" x1="13.7616" y1="0.918114" x2="6.23862" y2="19.0803" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#1594FF" />
                              <stop offset="1" stop-color="#0BC1A5" />
                          </linearGradient>
                          <clipPath id="clip0_189_1266">
                              <rect width="20" height="20" fill="white" />
                          </clipPath>
                      </defs>
                  </svg>
        )}
      </div>
    </div>
  );
};
