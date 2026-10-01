import React from 'react';
import Image from 'next/image';
import useFollowStatus from '@/hooks/useFollowStatus';
import { toast } from 'react-toastify';

type Member = {
  Id: string;
  Name?: string;
  UserName?: string;
  ProfilePicture?: string;
  IsVerified?: boolean;
  UserType?: string;
  Location?: string;
  Country?: string;
  IsFollowed?: boolean;
  IsOnline?: boolean;
  UserId?: string; // for logging only
};

type Props = {
  member: Member;
  idx?: number;
  countryFlags: Record<string, string>;
  getRolesIcon?: (role?: string) => React.ReactNode;
  toggleFollow?: (memberId: string, currentlyFollowing: boolean) => void; // optional sync callback
};

const MemberCard: React.FC<Props> = ({ member, countryFlags, getRolesIcon, }) => {

  const { isFollowing, loading, follow, unfollow } = useFollowStatus(member.UserId);

  const handleToggle = async () => {
    const wasFollowing = Boolean(isFollowing);

    try {
      if (wasFollowing) {
        await unfollow();
        toast.success('Unfollowed');
      } else {
        await follow();
        toast.success('Following');
      }
      // notify parent to keep list state synced (optional)
    } catch (err) {
      console.error('MemberCard follow toggle error', err);
      toast.error('Could not update follow status');
    }
  };

  return (
    // removed key here — parent should set key when mapping
    <div className="flex gap-3 px-6">
      <div className="flex-shrink-0 w-12 h-12 relative">
        <Image
          src={member.ProfilePicture || '/chat/community.jpg'}
          alt={member.Name || member.UserName || 'Member'}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        {member.IsOnline ? (
          <div className="absolute right-0 bottom-0 bg-green-500 rounded-full w-2.5 h-2.5 ring-2 ring-white" />
        ) : (
          <div className="absolute right-0 bottom-0 bg-gray-500 rounded-full w-2.5 h-2.5 ring-2 ring-white" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-gray-900">{member.Name || member.UserName}</span>
          {member.IsVerified ? (
            <Image src="/chat/verified.svg" alt="Verified" width={22} height={22} />
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-400">Not Verified</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          {member.UserType && (
            <span className="inline-flex items-center gap-1 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {getRolesIcon?.(member.UserType)}
              {member.UserType}
            </span>
          )}
          {(member.Country || member.Location) && (
            <span className="inline-flex items-center gap-1 bg-[#F5FAFF] rounded-md px-2 py-1 text-xs text-[#5B657B] font-medium">
              {member.Country && countryFlags[member.Country] && (
                <Image
                  src={countryFlags[member.Country]}
                  alt={member.Country}
                  width={64}
                  height={64}
                  className="w-4 h-3 rounded-sm object-cover"
                />
              )}
              {member.Location && ` ${member.Location}`}
            </span>
          )}
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`mt-2 px-5 py-1 rounded-full border ${ isFollowing
            ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
            : 'border-[#85A9F6] text-[#2357C6] hover:bg-[#2357C6] hover:text-white'
            } font-semibold text-xs transition`}
        >
          { isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default MemberCard;