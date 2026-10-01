'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';
import { leaderboard } from '@/app/api/dashboard/leaderboard';

interface StatsCardProps {
  stats: {
    interactions?: number;
    likes?: number;
    comments?: number
  };
  admin?: any;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats = {}, admin, loading = false }) => {
  const hasStats = stats.interactions || stats.likes || stats.comments;
  const [countryFlagUrl, setCountryFlagUrl] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    if (admin.locationBadge) {
      leaderboard.fetchCountryFlag(admin.locationBadge).then(url => {
        if (isMounted) setCountryFlagUrl(url);
      });
    } else {
      setCountryFlagUrl(null);
    }
    return () => { isMounted = false; };
  }, [admin.locationBadge]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="text-base font-semibold text-gray-800 mb-3">Your Stats</div>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasStats) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="text-base font-semibold text-gray-800 mb-3">Your Stats</div>
        <div className="flex flex-col items-center justify-center py-6">
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
            <path d="M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" fill="#F5F8FF" />
            <path d="M48 32C48 40.8366 40.8366 48 32 48C23.1634 48 16 40.8366 16 32C16 23.1634 23.1634 16 32 16C40.8366 16 48 23.1634 48 32Z" fill="#E4EBFF" />
            <path d="M32 42C37.5228 42 42 37.5228 42 32C42 26.4772 37.5228 22 32 22C26.4772 22 22 26.4772 22 32C22 37.5228 26.4772 42 32 42Z" fill="#2357C6" />
            <path d="M32 36C34.2091 36 36 34.2091 36 32C36 29.7909 34.2091 28 32 28C29.7909 28 28 29.7909 28 32C28 34.2091 29.7909 36 32 36Z" fill="white" />
            <path d="M40 24L24 40" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3 className="text-sm font-medium text-gray-700 mb-1">No Stats Available</h3>
          <p className="text-xs text-gray-500 text-center">
            Start interacting with the community to see your stats
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white tracking-wide rounded-lg p-4 shadow-lg">
      <div className="text-lg font-semibold text-gray-800 mb-3">Your Stats</div>
      <div className="flex items-center gap-3">
        <Image
          src={admin?.avatar || '/chat/user-avatar.png'}
          alt={admin?.name || 'admin'}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-sm text-gray-900">{admin.name}</div>

            <span className="text-xs flex items-center text-[#102A56] gap-2 bg-[#F5FAFF] px-2 py-1 rounded-full border border-[#D1E9FF]">
              {getRolesIcon(admin.badge)}
              {admin.badge}
            </span>
          </div>
          <div className='inline-flex flex-col'>
            {admin.locationBadge && (

              <div className="inline-flex text-xs items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-md mt-1">

                {countryFlagUrl && (
                  <Image
                    src={countryFlagUrl}
                    alt={admin.locationBadge}
                    width={80}
                    height={80}
                    className="rounded-[3px] w-5 h-4 object-cover"
                  />
                )}
                {admin.location ? <span>{admin.location}</span> : null}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="mt-1 text-sm text-gray-700 ">
        <span className='font-semibold text-sm'>Number of interactions</span>
        <div className="flex justify-between font-medium items-center py-1">
          <span className='w-1/2'>Number of Likes: </span>
          <span className="w-1/2 font-medium text-left">{stats.likes?.toLocaleString() || '0'} Likes</span>
        </div>
        <div className="flex justify-between font-medium items-center py-1">
          <span className='w-1/2'>Number of Comments: </span>
          <span className="w-1/2 font-medium text-left">{stats.comments?.toLocaleString() || '0'} Comments</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;