'use client';
import { useState } from 'react';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import FollowConnections from './components/follow-connections';
import Favourites from './components/favourites';

// export const metadata = {
//   title: 'Orisuun | Followers',
//   description: 'Manage your followings, followers, and favorites.',
// };

const MAIN_TABS = [
  { id: 'follow', label: 'Follow' },
  { id: 'favorites', label: 'Favorites' },
] as const;

type MainTabId = (typeof MAIN_TABS)[number]['id'];

const Page = () => {
  const [selectedMainTab, setSelectedMainTab] = useState<MainTabId>('follow');
  return (
    <div className="md:p-6 w-full">
      <div className="w-full flex items-center gap-1 bg-[#F9FAFB] border border-[#EAECF0] rounded-full p-1">
        {MAIN_TABS.map((tab) => {
          const isActive = selectedMainTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedMainTab(tab.id)}
              className={cn(
                'h-9 flex-1 rounded-full text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-[#101828] shadow-[0_1px_2px_0_rgba(16,24,40,0.08)]'
                  : 'text-[#667085] hover:text-[#101828]'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {selectedMainTab === 'follow' ? <FollowConnections /> : <Favourites />}

      {selectedMainTab === 'favorites' && (
        <div className="mt-6">
          <Link
            href="/favourites"
            className="text-sm text-omblue-600 hover:text-omblue-700 font-medium transition-colors"
          >
            View Saved
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
