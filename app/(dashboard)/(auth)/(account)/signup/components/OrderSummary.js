'use client';

import {
  BadgeDollarSign,
  TrendingUp,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { cloneElement, createElement, isValidElement } from 'react';
import Image from 'next/image';

const memberBenefits = [
  {
    icon:
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.3751 13.1214C20.6251 16.8714 17.7978 20.4018 13.8291 21.1912C9.86042 21.9807 5.83311 20.1346 3.84055 16.6128C1.848 13.091 2.33991 8.68818 5.06059 5.69295C7.78128 2.6977 12.3751 1.87138 16.1251 3.37138" stroke="#2357C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.625 11.625L12.375 15.375L21.375 5.625" stroke="#2357C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,
    text: 'Cancel anytime'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.2832 6H23.1403V12.8571" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M23.1402 6L13.4545 15.6857C13.2943 15.8428 13.0789 15.9307 12.8545 15.9307C12.6301 15.9307 12.4147 15.8428 12.2545 15.6857L8.31163 11.7429C8.15141 11.5858 7.93599 11.4978 7.71164 11.4978C7.48728 11.4978 7.27186 11.5858 7.11164 11.7429L0.854492 18" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>,
    text: 'Instant access to $2M+ in partner discounts'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12H6.01M18 12H18.01M4 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>, text: 'Eligible for $1,000 weekly funding - immediately' },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M16 3.128C16.8578 3.35037 17.6174 3.85126 18.1597 4.55206C18.702 5.25286 18.9962 6.11389 18.9962 7C18.9962 7.88611 18.702 8.74714 18.1597 9.44794C17.6174 10.1487 16.8578 10.6496 16 10.872M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>,
    text: 'One-click book 1-on-1 time with elite investors & consultants'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.78027 17.25C3.83773 17.493 3.98252 17.7579 4.25098 18.04C4.61773 18.4253 5.18374 18.8062 5.94043 19.1426C7.40004 19.7913 9.44632 20.2181 11.75 20.2471V21.7471C9.28191 21.7182 7.01934 21.264 5.33105 20.5137C4.45965 20.1263 3.708 19.6458 3.16406 19.0742C2.67424 18.5596 2.33024 17.9436 2.2627 17.25H3.78027ZM21.7373 17.25C21.6698 17.9436 21.3258 18.5596 20.8359 19.0742C20.292 19.6458 19.5403 20.1263 18.6689 20.5137C16.9806 21.264 14.7181 21.7182 12.25 21.7471V20.2471C14.5537 20.2181 16.6 19.7913 18.0596 19.1426C18.8163 18.8062 19.3823 18.4254 19.749 18.04C20.0175 17.7579 20.1623 17.493 20.2197 17.25H21.7373ZM12.7041 16.25C12.6009 16.5408 12.3262 16.75 12 16.75C11.6738 16.75 11.3991 16.5408 11.2959 16.25H12.7041ZM16.4043 12.7412C17.8459 13.0832 19.1082 13.5949 20.042 14.251C20.9429 14.8839 21.6377 15.7275 21.7363 16.75H20.2158C20.1244 16.3686 19.8217 15.9295 19.1797 15.4785V15.4775C18.4512 14.9659 17.3894 14.5187 16.0811 14.2061L16.4043 12.7412ZM7.91797 14.2061C6.61008 14.5187 5.54867 14.9661 4.82031 15.4775V15.4785C4.17835 15.9295 3.87556 16.3686 3.78418 16.75H2.26367C2.36232 15.7275 3.05716 14.8839 3.95801 14.251C4.89162 13.5951 6.15349 13.0832 7.59473 12.7412L7.91797 14.2061ZM12.75 15.75H11.25V12.1953C11.4144 12.2188 11.5811 12.2352 11.75 12.2432V12.25H12.25V12.2432C12.4189 12.2352 12.5856 12.2188 12.75 12.1953V15.75ZM8.0918 12.6738C8.39818 12.7117 8.662 12.9353 8.73242 13.2539C8.80278 13.5725 8.65723 13.8853 8.39551 14.0488L8.0918 12.6738ZM15.6035 14.0488C15.3422 13.8852 15.1973 13.5722 15.2676 13.2539C15.3379 12.9356 15.6012 12.7121 15.9072 12.6738L15.6035 14.0488ZM11.75 11.25V11.7432C11.5808 11.7344 11.4141 11.7165 11.25 11.6904V11.25H11.75ZM12.75 11.25V11.6904C12.5859 11.7165 12.4192 11.7344 12.25 11.7432V11.25H12.75ZM8.76074 7.25C8.88216 8.84552 10.1544 10.1178 11.75 10.2393V10.75H10.75V11.582C8.8105 11.0542 7.3637 9.32989 7.25586 7.25H8.76074ZM16.7441 7.25C16.6363 9.32989 15.1895 11.0542 13.25 11.582V10.75H12.25V10.2393C13.8456 10.1178 15.1178 8.84552 15.2393 7.25H16.7441ZM12.25 2.25586C14.6744 2.38156 16.6184 4.32563 16.7441 6.75H15.2393C15.1178 5.15445 13.8456 3.88115 12.25 3.75977V2.25586ZM11.75 3.75977C10.1544 3.88115 8.88216 5.15445 8.76074 6.75H7.25586C7.38156 4.32563 9.32563 2.38155 11.75 2.25586V3.75977Z" fill="#2357C6" stroke="#2357C6" stroke-width="0.5" />
    </svg>, text: 'List your offers to get new customers instantly' },
];

const signupIconProfileIds = new Set([1, 2, 3, 4, 6, 7, 8]);

const getMemberTitle = (userType = '') => {
  const normalizedType = userType.trim();
  if (!normalizedType || normalizedType === 'Member') return 'Member';
  if (normalizedType.toLowerCase().includes('black-owned business')) {
    return 'Business Member';
  }

  const singularType = normalizedType.toLowerCase().endsWith('ies')
    ? `${normalizedType.slice(0, -3)}y`
    : normalizedType.toLowerCase().endsWith('s')
      ? normalizedType.slice(0, -1)
      : normalizedType;

  return `${singularType}`;
};

export const OrderSummary = ({
  billingPrice,
  estimatedTax,
  dueToday,
  formatCurrency,
  userType,
  userTypeId,
}) => {
  return (
    <aside className="relative w-full overflow-visible rounded-2xl border border-[#DCE4F2] bg-white px-6 py-5 shadow-lg">
      {signupIconProfileIds.has(Number(userTypeId)) ? (
        <Image
          src={`/icons/signup/${userTypeId}.svg`}
          alt=""
          aria-hidden="true"
          width={300}
          height={303}
          unoptimized
          className="pointer-events-none absolute -left-12 -top-14 h-auto w-48"
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rotate-12 rounded-[38px] bg-[#F3F7FD]"
        />
      )}

      <div className="relative">
        <h2 className="border-b text-center border-[#DCE4F2]  text-[42px] font-semibold leading-[1.3]  text-blue-strong sm:text-[54px]">
          {getMemberTitle(userType)}
        </h2>

        <ul className="space-y-4 border-b border-[#DCE4F2] py-5">
          {memberBenefits.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-base leading-6 text-[#526079] sm:text-lg">
              {isValidElement(Icon)
                ? cloneElement(Icon, {
                    className: 'mt-1 h-5 w-5 flex-none text-[#2357C6]',
                    'aria-hidden': true,
                  })
                : createElement(Icon, {
                    className: 'mt-1 h-5 w-5 flex-none text-[#2357C6]',
                    'aria-hidden': true,
                  })}
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div className="pt-5">
          <h3 className="text-2xl font-semibold tracking-[-0.025em] text-[#101828]">
            Order Summary
          </h3>

          <div className="mt-5 space-y-4 text-base text-[#526079] sm:text-lg">
            <div className="flex items-center justify-between gap-6">
              <span>One Year Full Access</span>
              <span>{formatCurrency(billingPrice)}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span>Estimated tax</span>
              <span>{formatCurrency(estimatedTax)}</span>
            </div>
            <div className="flex items-center justify-between gap-6 border-t border-[#DCE4F2] pt-5 font-semibold text-[#101828]">
              <span>Due today</span>
              <span>{formatCurrency(dueToday)}</span>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-[#526079] sm:text-base">
            By subscribing, you authorize Orisuun to charge according to the terms until
            you cancel. You also agree to the{' '}
            <a className="font-semibold text-[#2357C6] underline" href="/terms">
              Terms of Service
            </a>{' '}
            and{' '}
            <a className="font-semibold text-[#2357C6] underline" href="/privacy">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
