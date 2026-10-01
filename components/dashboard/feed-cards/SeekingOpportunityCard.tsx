import React from 'react';
import Image from 'next/image';
import { renderProfileTypeIcon } from '@/components/ui/profile-type';

export const SeekingOpportunityCard = ({ feed, onRedirect }) => {
  if (!feed?.Post) return null;

  const { Post, User } = feed;
  const industryList = Post.IndustryNames || [];

  return (
    <div className="p-4 bg-white mb-4  rounded-2xl shadow-blur overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="md:text-2xl text-nowrap font-semibold text-[#204FB4]">{Post.Bdtype === 'Seeking' ? 'Seeking an Opportunity' : 'Offering an Opportunity'}</h3>
        <span className="text-xs text-nowrap truncate md:text-base text-blue-600 bg-gray-100 px-3 py-1 rounded-full">
          Business Development
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <h4 className="text-lg font-semibold text-blue-600">{Post.Name}</h4>

        {/* Industry Tags */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium">Open to:</span>
          {industryList.slice(0, 3).map((industry, idx) => (
            <span
              key={idx}
              className="text-sm bg-olblue-50 text-blue-600 border border-gray-100 px-3 py-2 rounded-md font-semibold"
            >
              {industry.trim()}
            </span>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Industry:</p>
            <p className="text-gray-900 font-medium">{Post.IndustryType}</p>
          </div>
          <div>
            <p className="text-gray-500">Business type:</p>
            <p className="text-gray-900 font-medium">{Post.BdType}</p>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 ">
          <div className='flex items-center w-2/3 gap-3'>
            <div className="md:w-[48px] md:h-[48px] h-[30px] w-[30px] rounded-full bg-black flex items-center justify-center text-white text-lg font-bold overflow-hidden flex-shrink-0">
              {User.ProfileDetails?.ProfilePicture ? (
                <Image
                  src={User.ProfileDetails.ProfilePicture}
                  alt={User.Name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                User.Name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="md:text-lg text-[9px] font-bold text-gray-900">{User.Name}</h4>
                {User.IsVerified === 1 && (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_189_1266)">
                      <path d="M15.4442 3.54062C15.6342 4.00002 15.9988 4.36517 16.4579 4.55581L18.0678 5.22264C18.5272 5.41294 18.8922 5.77796 19.0825 6.23738C19.2728 6.69681 19.2728 7.21302 19.0825 7.67245L18.4162 9.28115C18.2258 9.74078 18.2255 10.2575 18.4168 10.7169L19.082 12.3251C19.1763 12.5527 19.2249 12.7966 19.2249 13.0429C19.225 13.2893 19.1765 13.5332 19.0822 13.7608C18.9879 13.9883 18.8497 14.1951 18.6755 14.3693C18.5013 14.5434 18.2945 14.6815 18.0669 14.7757L16.4582 15.4421C15.9988 15.632 15.6336 15.9966 15.443 16.4558L14.7762 18.0656C14.5859 18.525 14.2209 18.8901 13.7614 19.0804C13.302 19.2707 12.7858 19.2707 12.3264 19.0804L10.7177 18.414C10.2582 18.2242 9.7422 18.2246 9.28304 18.4151L7.67318 19.081C7.21401 19.2708 6.69825 19.2707 6.2392 19.0805C5.78014 18.8904 5.41533 18.5258 5.2249 18.0668L4.55788 16.4565C4.36793 15.9971 4.00332 15.632 3.54421 15.4413L1.93435 14.7745C1.47513 14.5843 1.11022 14.2195 0.919849 13.7603C0.729477 13.3012 0.729219 12.7852 0.919131 12.3258L1.58548 10.7171C1.77531 10.2577 1.77492 9.74167 1.5844 9.28252L0.91901 7.6715C0.824671 7.44395 0.776094 7.20005 0.776054 6.95372C0.776015 6.70739 0.824513 6.46346 0.91878 6.23588C1.01305 6.00831 1.15123 5.80153 1.32544 5.62738C1.49965 5.45322 1.70647 5.3151 1.93408 5.22091L3.54278 4.55456C4.00178 4.36478 4.36671 4.00063 4.55749 3.54205L5.22432 1.93219C5.41462 1.47277 5.77964 1.10775 6.23906 0.917451C6.69849 0.72715 7.2147 0.72715 7.67413 0.917451L9.28283 1.5838C9.74227 1.77363 10.2583 1.77324 10.7174 1.58272L12.328 0.918485C12.7874 0.72829 13.3034 0.728329 13.7628 0.918593C14.2221 1.10886 14.5871 1.47377 14.7774 1.93307L15.4444 3.54341L15.4442 3.54062Z" fill="url(#paint0_linear_189_1266)" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.9166 7.37925C14.0502 7.1694 14.0949 6.91507 14.041 6.67221C13.9871 6.42935 13.8389 6.21785 13.6291 6.08425C13.4192 5.95065 13.1649 5.90588 12.922 5.9598C12.6792 6.01372 12.4677 6.1619 12.3341 6.37175L8.66283 12.1405L6.98283 10.0405C6.82751 9.84623 6.60138 9.72162 6.35418 9.69407C6.10699 9.66653 5.85897 9.73831 5.6647 9.89363C5.47043 10.0489 5.34582 10.2751 5.31827 10.5223C5.29073 10.7695 5.36251 11.0175 5.51783 11.2118L8.01783 14.3368C8.111 14.4534 8.23066 14.546 8.36687 14.6071C8.50308 14.6681 8.65189 14.6957 8.80094 14.6877C8.94998 14.6796 9.09494 14.6361 9.22376 14.5607C9.35258 14.4853 9.46154 14.3802 9.54158 14.2543L13.9166 7.37925Z" fill="white" />
                    </g>
                    <defs>
                      <linearGradient id="paint0_linear_189_1266" x1="13.7616" y1="0.918114" x2="6.23862" y2="19.0803" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1594FF" />
                        <stop offset="1" stopColor="#0BC1A5" />
                      </linearGradient>
                      <clipPath id="clip0_189_1266">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>)}
              </div>
              <p className="md:text-sm text-[7px] text-gray-600 flex items-center gap-1">
                {renderProfileTypeIcon(
                  Number(User.ProfileType),
                  'default',
                  false,
                  'w-3.5 h-3.5 flex-shrink-0'
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-1/3 items-center text-base text-gray-400">
            <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#2357C6" />
            </svg>
            {Post.RegionName || 'City'}
          </div>
        </div>
      </div>
    </div>
  );
};
