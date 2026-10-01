import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { VerifiedIcon } from 'lucide-react';
import { renderProfileTypeIcon } from '@/components/ui/profile-type';

export const BoardMemberOpportunityCard = ({ feed, onRedirect }) => {
  if (!feed?.Post) return null;


  const { Post, User } = feed;

  return (
    <div className="bg-white mb-4 rounded-2xl shadow-blur overflow-hidden border border-[#E4E9F5] p-4">
      {/* Header with Title and Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-[#204FB4]">Board Member Opportunity</h3>

      </div>

      {/* User Info Section */}
      <div className="flex justify-between w-full items-center gap-4 mb-6">
        <div className='flex items-center gap-3'>
          <div className="md:w-[56px] md:h-[56px] h-[30px] w-[30px] rounded-full bg-black flex items-center justify-center text-white text-xl font-bold overflow-hidden flex-shrink-0">
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
              <h4 className="md:text-xl text-[9px] font-bold text-gray-900">{User.Name}</h4>
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


        <Button
          title="Check Post"
          className="text-sm text-[#204FB4] md:w-36 w-24 border border-[#204FB4] hover:bg-blue-50 font-medium bg-white px-6 py-2 rounded-lg transition-colors"
          onClick={() => onRedirect(feed?.PostId as string, feed?.Type as string)}
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className='flex items-center gap-2'>
          <p className="text-gray-900 md:text-base text-[9px] font-medium mb-1">Industry:</p>
          <p className="text-[#0A193A]  md:text-sm text-[9px] ">{Post.IndustryType}</p>
        </div>
        <div className='flex items-center gap-2'>
          <p className="text-gray-900 md:text-base text-[9px] font-medium mb-1">Business type:</p>
          <p className="text-[#0A193A]  md:text-sm text-[9px]">{Post.CompanyName || Post.IndustryType}</p>
        </div>
        <div className='flex items-center gap-2'   >
          <p className="text-gray-900 md:text-base text-[9px] font-medium mb-1">Stage:</p>
          <p className="text-[#0A193A]  md:text-sm text-[9px]">{Post.IndustryType}</p>
        </div>
      </div>

      {/* Descriptions Section */}
      <div className="grid grid-cols-2 gap-6">
        {Post.Description && (
          <div className="bg-[#FFFFFF] shadow-lg border border-[#F7F7F7] shadow-[#F7F7F7] p-4 rounded-lg"
            style={{
              boxShadow: "0px 5px 8px 0px #7F7F7F33"
            }}>
            <h5 className="md:text-base text-[9px] font-semibold text-gray-900 mb-2">Business Description</h5>
            <p className="text-gray-700 md:text-sm text-[9px] leading-relaxed">{Post.Name}</p>
          </div>
        )}

        <div className="bg-[#FFFFFF] shadow-lg border border-[#F7F7F7] shadow-[#F7F7F7] p-4 rounded-lg"
          style={{
            boxShadow: "0px 5px 8px 0px #7F7F7F33"
          }}>
          <h5 className="md:text-base text-[9px] font-semibold text-gray-900 mb-2">Role Description</h5>
          <p className="text-gray-700 md:text-sm text-[9px] leading-relaxed">{Post.Description}</p>
        </div>
      </div>
    </div>
  );
};
