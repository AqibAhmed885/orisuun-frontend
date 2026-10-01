'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import CommunityMembersModal from './community-members-modal';

type Member = {
  id: string;
  name: string;
  ProfilePicture: string;
  // Add other member properties if needed
};

type Props = {
  members: Member[];
  count?: number;
  onView?: () => void;
  loading?: boolean;
};

const MembersCard: React.FC<Props> = ({ members = [], count = 0, onView, loading = false }) => {

  const [showMembersModal, setShowMembersModal] = useState(false);
  // Removed unused state for members, since members are passed as string[] props
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false); // Check if current user is admin


  if (loading) {
    // Shimmer loading UI
    return (
      <div className="bg-white rounded-lg p-4 tracking-wide shadow-xl animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded mb-4" />
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"
              style={{
                marginLeft: i === 0 ? 0 : -20,
                zIndex: 10 - i,
              }}
            />
          ))}
          <div
            className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-400"
            style={{
              marginLeft: -20,
              zIndex: 0,
            }}
          />
        </div>
        <div className="h-8 w-28 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 tracking-wide  shadow-xl">
      <div className="text-lg space-x-2 font-semibold text-gray-800">{count?.toLocaleString()} members</div>
      <div className="text-base font-medium leading-relaxedr text-gray-500 mt-1 mb-3">Including You and {count - 1} other connections</div>

      <div className="flex items-center gap-2">
        <div className="flex items-center" style={{ marginLeft: '-10px' }}>
          {members.slice(0, 7).map((src, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative"
              style={{
                zIndex: members.length + i,
                marginLeft: i === 0 ? 0 : -20,
                background: '#fff',
              }}
            >
              <Image
                src={src.ProfilePicture}
                alt={`member-${i}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {members.length > 7 && (
            <div
              className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-500 bg-white"
              style={{
                marginLeft: -20,
                zIndex: 0,
              }}
            >
              +{members.length - 7}
            </div>
          )}
        </div>
      </div>

      <button onClick={
        () => {
          setShowMembersModal(true);
        }
      } className="mt-4 text-base px-3 py-1 border rounded-md bg-white hover:bg-gray-50">See members</button>
      <CommunityMembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={members}
        onChat={(member) => {
          // Handle chat with member
          
        }}
        onRemove={(member) => {
          // Handle removing member (only if admin)
          
        }}
        isCurrentUserAdmin={isCurrentUserAdmin}
      />
    </div>
  );
};

export default MembersCard;