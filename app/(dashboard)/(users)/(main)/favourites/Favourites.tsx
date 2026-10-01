'use client';

import { cn } from '@/utils/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSectionCard from './sections/profile-section-card';
import BusinessDevelopmentPost from './sections/business-development-post';
import CofounderMatch from './sections/cofounder-match';
import BoardOfDirectorsMemberMatch from './sections/board-of-directors-member-match';
import { tabs } from '../../../../../data/dashboard/favourites';
import TeamSectionCard from './sections/team-section-card';

const Favourites = () => {
  const router = useRouter();
  const [selectedFavoriteTab, setSelectedFavoriteTab] = useState('');
  const [teamData, setTeamData] = useState<any>(null);

  useEffect(() => {
    const storedTeamData = JSON.parse(localStorage.getItem('teamData') || 'null');
    setTeamData(storedTeamData);
  }, []);

  const filteredTabs = useMemo(() => {
    if (!teamData) {
      return tabs;
    }

    return tabs.filter((tab) => {
      if (tab.id === 'board-of-directors-member-match' && teamData?.isActive) {
        return false;
      }

      return true;
    });
  }, [teamData]);

  useEffect(() => {
    if (filteredTabs.length > 0) {
      setSelectedFavoriteTab(filteredTabs[0].id);
    }
  }, [filteredTabs]);

  const renderFavoritesContent = () => {
    switch (selectedFavoriteTab) {
      case 'profiles':
        return <ProfileSectionCard />;
      case 'teams':
        return <TeamSectionCard />;
      case 'business-development-posts':
        return <BusinessDevelopmentPost />;
      case 'cofounder-match':
        return <CofounderMatch />;
      case 'board-of-directors-member-match':
        return <BoardOfDirectorsMemberMatch />;
      default:
        return null;
    }
  };

  return (
    <div className="md:p-6 w-full">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-lg  hover:bg-gray-50 transition-colors"
          title="Go back"
        >
          <svg className="w-5 h-5 text-[#344054]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-[#101828]">Back</h1>
      </div>

        <>
          <div className="w-full mt-6 flex items-center gap-6 overflow-x-auto">
            {filteredTabs.map((tab, index) => (
              <button
                key={index}
                className={cn(
                  'border-b-2 cursor-pointer whitespace-nowrap',
                  selectedFavoriteTab === tab.id ? 'border-omblue-600' : 'border-transparent'
                )}
                onClick={() => setSelectedFavoriteTab(tab.id)}
              >
                <p
                  className={cn(
                    'px-4 py-3 text-h8 2xl:text-scaled-h8',
                    selectedFavoriteTab === tab.id
                      ? 'text-omblue-600 font-semibold'
                      : 'text-[#797B82] font-medium'
                  )}
                >
                  {tab.name}
                </p>
              </button>
            ))}
            </div>
          {renderFavoritesContent()}
        </>
    </div>
  );
};

export default Favourites;
