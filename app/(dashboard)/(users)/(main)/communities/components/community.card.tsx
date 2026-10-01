'use client';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import CommunityMembersModal from './community-members-modal';
import LeaveGroupModal from './leave-group-modal';
import { communityApi } from '@/app/api/dashboard/community';
import { useRouter } from 'next/navigation';

interface CommunityCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  sender: string;
  verified?: boolean;
  description?: string;
  members?: any[];
  onClick?: () => void;
  createdByVerified?: boolean;
  userId: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  name,
  avatarUrl = '/chat/user-avatar.png',
  sender,
  verified = false,
  description,
  members = [],
  onClick,
  createdByVerified,
  userId
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const communityId = id;
  const router = useRouter();


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  function truncateWords(text = '', maxWords = 20) {
    const words = text.split(' ');
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '...'
      : text;
  }

  const handleChat = (member: any) => {
    setShowMembersModal(false);
    router.push(`/dashboard/chats?id=${member.Id}`);
  };




  return (
    <>
      <div className="flex items-start gap-2 py-2 border-b border-gray-100 relative hover:bg-gray-50 cursor-pointer"
        onClick={onClick}>
        <Image
          src={avatarUrl || '/chat/user-avatar.png'}
          alt={name}
          width={200}
          height={200}
          className="w-14 h-14 rounded-md object-cover mt-1 border"
        />
        <div className="flex-1 min-w-0">
          <div className="relative flex justify-between">
            <h1 className="font-semibold text-base tracking-wide text-gray-900">{name}</h1>
            <div ref={menuRef} className="absolute top-2 right-2">
              <button
                className="px-1 rounded-full hover:bg-gray-100"
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(prev => !prev);
                }}
                aria-label="Open menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-500">
                  <circle cx="5" cy="12" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="19" cy="12" r="1.7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-0 w-36 bg-white border border-gray-100 rounded-md shadow-lg z-30">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setShowMembersModal(true);
                    }}
                  >
                    View members
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setShowLeaveModal(true);
                    }}
                  >
                    Leave group
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide text-gray-800">{sender}</span>
            {createdByVerified && (
              <Image
                src="/chat/verified.svg"
                alt="Verified"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            )}
          </div>
          <div
            className="text-base text-gray-600 tracking-wide overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineClamp: 2, // for future compatibility
              wordSpacing: '0.12em',
            }}
          >
            {truncateWords(description, 20)}
          </div>
        </div>
      </div>

      {/* Members modal rendered inside CommunityList */}
      <CommunityMembersModal
        isOpen={showMembersModal}
        onClose={() => {
          setShowMembersModal(false);
        }}
        members={members || []}
        onChat={(member) => {
          handleChat(member);
        }}
        communityId={communityId}
        userId={userId}
      />

      <LeaveGroupModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        communityName={name}
        onConfirm={async () => {
          await communityApi.leaveCommunity(communityId, userId);
          setShowLeaveModal(false);
          // Optionally, refresh the community list or update UI here
        }}
      />
    </>
  );
};