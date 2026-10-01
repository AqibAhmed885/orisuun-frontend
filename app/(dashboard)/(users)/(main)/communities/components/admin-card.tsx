'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';
import { leaderboard } from '@/app/api/dashboard/leaderboard';

type Admin = {
  id?: string;
  name: string;
  avatar?: string;
  role?: string;
  badge?: string;
  location?: string;
  country?: string;
  online?: boolean;
  locationBadge?: string;
  createdByCity?: string;
};

const AdminCard: React.FC<{ admin: Admin; loading?: boolean }> = ({ admin, loading = false }) => {
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
    // Shimmer UI
    return (
      <div className="bg-white tracking-wide rounded-lg p-4 shadow-lg">
        <div className="text-lg font-semibold text-gray-800 mb-2">Admins</div>
        <div className="flex gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="flex gap-2 mt-2">
              <div className="w-10 h-4 bg-gray-100 rounded" />
              <div className="w-16 h-4 bg-gray-100 rounded" />
            </div>
            <div className="h-3 bg-gray-100 rounded w-1/4 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white tracking-wide  rounded-lg p-4 shadow-lg">
      <div className="text-lg font-semibold text-gray-800 mb-2">Admins</div>
      <div className="flex gap-3">
        <Image src={admin.avatar || '/chat/user-avatar.png'} alt={admin.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between ">
            <div className="font-semibold text-base  text-gray-900">{admin.name}</div>
            <span className="text-xs font-medium flex text-nowrap items-center text-[#102A56] gap-2 bg-[#F5FAFF] px-2 py-1 rounded-full border border-[#D1E9FF]">
              {getRolesIcon(admin.badge)}
              {admin.badge}
            </span>
          </div>
          <div className='inline-flex mt-1 flex-col'>
            {admin.locationBadge && (
              <div className="inline-flex text-sm font-medium items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-md">
                {countryFlagUrl && (
                  <Image
                    src={countryFlagUrl}
                    alt={admin.locationBadge}
                    width={80}
                    height={80}
                    className="rounded-[3px] w-5 h-4 object-cover"
                  />
                )}
                {admin.createdByCity}
              </div>
            )}
            <div>
              <div className="mt-2 text-sm text-gray-500 px-2 py-0.5 rounded border inline-flex">{admin.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;