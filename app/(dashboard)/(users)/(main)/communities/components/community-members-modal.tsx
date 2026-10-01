"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import { checkOnlineStatus } from '@/utils/helper';
import { useCommunityAdmin } from '@/hooks/useCommunityAdmin';

type Member = {
  id: string;
  name: string;
  ProfilePicture?: string;
  UserName?: string;
  IsActive?: boolean;
  ApprovedBy?: string | null;
  UserType?: string | 'Business' | 'Strategy Consultant' | 'Professional' | 'Expert' | 'Partner' | 'Advocate';
  Location?: string;
  Country?: string;
  IsAdmin?: boolean;
  IsVerified?: boolean;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  members?: Member[];
  onChat?: (member: Member) => void;
  onRemove?: (member: Member) => void;
  isCurrentUserAdmin?: boolean; // <-- add this
  communityId?: string | null;
  userId?: string | null;
}


const CommunityMembersModal: React.FC<Props> = ({ isOpen, onClose, members = [], onChat, onRemove, isCurrentUserAdmin, communityId, userId }) => {
  const [countryFlagUrl, setCountryFlagUrl] = useState<string | null>(null);
  const locationBadge = members.length > 0 ? members[0].Country : null; // Example: use first member's country for
  const { isAdmin, refresh } = useCommunityAdmin(communityId, userId);

  useEffect(() => {
    let isMounted = true;
    if (locationBadge) {
      leaderboard.fetchCountryFlag(locationBadge).then(url => {
        if (isMounted) setCountryFlagUrl(url);
      });
    } else {
      setCountryFlagUrl(null);
    }
    return () => { isMounted = false; };
  }, [locationBadge]);

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />

      <div className="relative bg-white w-full md:w-[700px] max-w-full h-[70vh] md:h-[80vh] rounded-t-2xl md:rounded-lg overflow-hidden shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1)]">
        <div className="flex items-center justify-between px-6 py-2">
          <h3 className="text-lg font-semibold">Community Members</h3>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-2">
          <h1 className='text-xs font-semibold leading-relaxed  uppercase'>Members</h1>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span className='text-sm text-gray-500 font-semibold'>
              {members.length.toLocaleString()}
            </span>
            
            members
          </div>
        </div>

        <div className="flex h-full">
          <div className="w-full overflow-y-auto">
            <div className="p-6 space-y-4">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="  relative overflow-hidden flex-shrink-0">
                      {m.ProfilePicture ? (
                        <Image src={m.ProfilePicture} alt={m.UserName} width={48} height={48} className="object-cover rounded-full" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      )}
                      {checkOnlineStatus(m.IsActive) ? (
                        <div className="absolute right-0 bottom-0 bg-green-500 rounded-full w-2.5 h-2.5 text-green-600 ring-2 ring-white inline-block font-semibold">
                          {/* <p>Active</p> */}
                        </div>
                      ) : (
                        <div className="absolute right-0 ring-2 ring-white bottom-0 bg-gray-500 rounded-full w-2.5 h-2.5 text-white inline-block font-semibold">
                          {/* <p>{checkOnlineStatus(profileData.LastActive)}</p> */}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-gray-900">{m.UserName}</div>
                        {m.IsVerified  ? (
                          <Image src={'/chat/verified.svg'} alt="verified" width={20} height={20} />
                        ) : (
                            <span className="flex items-center font-meduim gap-2 text-xs text-orange-500">

                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1831_209773)">
                                  <path d="M15.4442 3.54062C15.6342 4.00002 15.9988 4.36517 16.4579 4.55581L18.0678 5.22264C18.5272 5.41294 18.8922 5.77796 19.0825 6.23738C19.2728 6.69681 19.2728 7.21302 19.0825 7.67245L18.4162 9.28115C18.2258 9.74078 18.2255 10.2575 18.4168 10.7169L19.082 12.3251C19.1763 12.5527 19.2249 12.7966 19.2249 13.0429C19.225 13.2893 19.1765 13.5332 19.0822 13.7608C18.9879 13.9883 18.8497 14.1951 18.6755 14.3693C18.5013 14.5434 18.2945 14.6815 18.0669 14.7757L16.4582 15.4421C15.9988 15.632 15.6336 15.9966 15.443 16.4558L14.7762 18.0656C14.5859 18.525 14.2209 18.8901 13.7614 19.0804C13.302 19.2707 12.7858 19.2707 12.3264 19.0804L10.7177 18.414C10.2582 18.2242 9.7422 18.2246 9.28304 18.4151L7.67318 19.081C7.21401 19.2708 6.69825 19.2707 6.2392 19.0805C5.78014 18.8904 5.41533 18.5258 5.2249 18.0668L4.55788 16.4565C4.36793 15.9971 4.00332 15.632 3.54421 15.4413L1.93435 14.7745C1.47513 14.5843 1.11022 14.2195 0.919849 13.7603C0.729477 13.3012 0.729219 12.7852 0.919131 12.3258L1.58548 10.7171C1.77531 10.2577 1.77492 9.74167 1.5844 9.28252L0.91901 7.6715C0.824671 7.44395 0.776094 7.20005 0.776054 6.95372C0.776015 6.70739 0.824513 6.46346 0.91878 6.23588C1.01305 6.00831 1.15123 5.80153 1.32544 5.62738C1.49965 5.45322 1.70647 5.3151 1.93408 5.22091L3.54278 4.55456C4.00178 4.36478 4.36671 4.00063 4.55749 3.54205L5.22432 1.93219C5.41462 1.47277 5.77964 1.10775 6.23906 0.917451C6.69849 0.72715 7.2147 0.72715 7.67413 0.917451L9.28283 1.5838C9.74227 1.77363 10.2583 1.77324 10.7174 1.58272L12.328 0.918485C12.7874 0.72829 13.3034 0.728329 13.7628 0.918593C14.2221 1.10886 14.5871 1.47377 14.7774 1.93307L15.4444 3.54341L15.4442 3.54062Z" fill="#CF4010" />
                                  <path d="M12.5625 4.89062L7.78125 14.4531" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1831_209773">
                                    <rect width="20" height="20" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            Not Verified
                          </span>
                        )}
                        
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        {(
                          m.UserType || "Business"
                        ) && (
                            <span
                              key={m.UserType || "Business"}
                              className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              {getRolesIcon(m.UserType || "Business")}
                              <span>{m.UserType || "Business"}</span>
                            </span>
                          )}

                        <span className="flex text-xs items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-md">
                          {m.Country  && (
                            <Image
                              src={countryFlagUrl}
                              alt={m.Country || 'Country Flag'}
                              width={80}
                              height={80}
                              className="rounded-[3px] w-5 h-4 object-full"
                            />
                          )}
                        {m.Location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center font-semibold gap-3">
                    <button
                      onClick={() => onChat?.(m)}
                      className="px-4 py-1 text-xs bg-[#F6F9FF] border border-[#2357C6] text-[#2357C6] hover:text-white rounded-full hover:bg-[#2357C6]/90"
                    >
                      Chat
                    </button>
                    {/* Show Remove button only if current user is admin and member is not admin */}
                    {isAdmin && (
                      <button
                        onClick={() => onRemove?.(m)}
                        className="px-4 py-1 text-sm font-medium text-[#656D75] rounded-full hover:bg-gray-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default CommunityMembersModal;
