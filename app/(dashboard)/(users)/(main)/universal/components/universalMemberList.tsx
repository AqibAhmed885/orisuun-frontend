import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';
import { communityApi } from '@/app/api/dashboard/community';
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import { chatApi } from '@/app/api/dashboard/chats';
import axios from 'axios';
import { toast } from 'react-toastify';
import MemberCard from './memberCard';

const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL
  ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
  : 'https://api.orisuun.com/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5';

interface Member {
  Id: string;
  Name: string;
  UserName: string;
  ProfilePicture: string;
  IsVerified: boolean;
  UserType: string;
  Location: string;
  Country: string;
  IsFollowed?: boolean;
  IsOnline?: boolean; // Added to fix the error
}

interface CommunityMembersResponse {
  TotalMembers: number;
  Members: Member[];
}

interface UniversalChatsProps {
  communityId: string;
}

const UniversalMemberList: React.FC<UniversalChatsProps> = ({ communityId }) => {
  const [loading, setLoading] = useState(true);
  const [membersData, setMembersData] = useState<CommunityMembersResponse>({ TotalMembers: 0, Members: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 50;
  const [countryFlags, setCountryFlags] = useState<Record<string, string>>({});  // Add this state for flags


  const fetchMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await communityApi.getUniversalChatMembers(communityId, page, pageSize);
      if (response.success) {
        setMembersData({
          TotalMembers: response.data.TotalMembers || 0,
          Members: response.data.Members || []
        });
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, [communityId, page, pageSize]);


  useEffect(() => {
    if (communityId) {
      fetchMembers();
    }
  }, [communityId, page, fetchMembers]);


  useEffect(() => {
    const uniqueCountries = [...new Set(membersData.Members.map(member => member.Country).filter(Boolean))];
    uniqueCountries.forEach(country => {
      if (!countryFlags[country]) {  // Only fetch if not already fetched
        let isMounted = true;
        leaderboard.fetchCountryFlag(country).then(url => {
          if (isMounted) {
            setCountryFlags(prev => ({ ...prev, [country]: url }));
          }
        }).catch(err => {
          console.error(`Failed to fetch flag for ${country}:`, err);
        });
        return () => { isMounted = false; };
      }
    });
  }, [membersData.Members, countryFlags]);


  return (
    <div className="bg-white rounded-lg tracking-wide shadow-lg  max-w-md mx-auto  overflow-hidden h-full">
      <div className='p-6'>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Details</h3>
          <span className="text-base text-gray-400 font-semibold">
            {membersData.TotalMembers} <span className="text-blue-600">members</span>
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Welcome to the Universal Chat – your space to connect, share, and be heard by the entire community
          </p>
        <div className="font-bold text-xs text-gray-700 tracking-widest">MEMBERS</div>
      </div>

      <div className='overflow-y-auto' style={{ maxHeight: '76vh' }}>
        <div className="space-y-6 min-h-[200px] flex flex-col  justify-center">
          {loading ? (
            // Show 6 shimmer loaders
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex gap-3 animate-pulse px-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : membersData.Members.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-8 ">
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="32" fill="#F5F8FF" />
                <path d="M20 44c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#2357C6" strokeWidth="2" />
                <circle cx="32" cy="28" r="6" stroke="#2357C6" strokeWidth="2" />
              </svg>
              <div className="mt-3 text-gray-500 text-sm">No members found</div>
            </div>
          ) : (
            membersData.Members.map((member, idx) => (
              <MemberCard
                key={member.Id || idx}
                member={member}
                countryFlags={countryFlags}
                getRolesIcon={getRolesIcon} // pass your icon helper if available
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default UniversalMemberList;