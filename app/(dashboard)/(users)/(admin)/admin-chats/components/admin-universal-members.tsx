'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { communityApi } from '@/app/api/dashboard/community';
import Image from 'next/image';

interface UniversalMember {
  Id: string;
  UserId: string;
  UserName: string;
  UserEmail: string;
  ProfilePicture: string;
  UserType: string;
  Country: string;
  Location: string;
  JoinedDate: string;
  IsAdmin: boolean;
  IsActive: boolean;
  IsOnline: boolean;
  LastActive: string;
  IsVerified: boolean;
}

interface AdminUniversalMembersProps {
  isMobile: boolean;
}

const AdminUniversalMembers: React.FC<AdminUniversalMembersProps> = ({ isMobile }) => {
  const [members, setMembers] = useState<UniversalMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [blockingUsers, setBlockingUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);

  // Universal Chat is a specific community with this ID
  const UNIVERSAL_CHAT_ID = '5c2be789-4a31-494a-910a-52b8e30ad435';

  // Fetch universal chat members
  const fetchMembers = async (page: number = 1, reset: boolean = true) => {
    if (page === 1) {
      setLoadingMembers(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await communityApi.getUniversalChatMembers(UNIVERSAL_CHAT_ID, page, 1000);
      if (result.success && result.data) {
        // Handle different possible response structures
        const membersData = Array.isArray(result.data) 
          ? result.data 
          : result.data.Members || result.data.members || [];
        
        if (reset) {
          setMembers(membersData);
        } else {
          setMembers(prev => [...prev, ...membersData]);
        }
        
        setCurrentPage(page);
        setHasMore(membersData.length === 1000);
        
        // Update total count if available
        if (result.data?.TotalCount || result.data?.totalCount) {
          setTotalMembers(result.data.TotalCount || result.data.totalCount);
        }
      } else {
        throw new Error(result.success ? 'Failed to fetch members' : 'failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching universal chat members:', error);
      toast.error('Failed to fetch members');
      if (reset) {
        setMembers([]);
      }
    } finally {
      setLoadingMembers(false);
      setLoadingMore(false);
    }
  };

  // Handle block user (removes user from universal chat)
  const handleBlockUser = async (userId: string) => {
    if (!confirm(`Are you sure you want to block this user? This will remove them from the universal chat.`)) {
      return;
    }

    // Add to blocking set
    setBlockingUsers(prev => new Set(prev).add(userId));

    try {
      //// [in universal chat if we add memeber it mean member is blocked]
      const response = await communityApi.addCommunityMember(UNIVERSAL_CHAT_ID, [userId], true);
      if (response.success) {
        toast.success('User blocked and removed successfully');
        // Remove the user from the local state
        setMembers(prev => (prev || []).filter(member => member.UserId !== userId));
      } else {
        throw new Error(response.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    } finally {
      // Remove from blocking set
      setBlockingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Load more members
  const loadMoreMembers = () => {
    if (!loadingMore && hasMore) {
      fetchMembers(currentPage + 1, false);
    }
  };

  // Filter members based on search term
  const filteredMembers = (members || []).filter(member =>
    member?.UserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member?.UserEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member?.UserType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member?.Location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initial load
  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden">
      {/* Members Header */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Members</h3>
        <p className="text-sm text-gray-500">
          {searchTerm 
            ? `${filteredMembers.length} of ${(members || []).length}${totalMembers > 0 ? ` (${totalMembers} total)` : ''}` 
            : `${(members || []).length}${totalMembers > 0 ? ` of ${totalMembers}` : ''} member${(members || []).length !== 1 ? 's' : ''}`
          }
        </p>
        
        {/* Search Input */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {loadingMembers ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : !members || members.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p className="text-sm">No members found</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <p className="text-sm">No members found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredMembers.map((member) => (
              <div key={member.Id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {member.ProfilePicture ? (
                      <Image
                        src={member.ProfilePicture}
                        alt={member.UserName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm"
                      style={{ display: member.ProfilePicture ? 'none' : 'flex' }}
                    >
                      {member.UserName ? member.UserName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{member.UserName}</h4>
                      {member.IsVerified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{member.UserType}</p>
                    {member.Location && (
                      <p className="text-xs text-gray-400 truncate">{member.Location}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {member.IsAdmin && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                  <button
                    onClick={() => handleBlockUser(member.UserId)}
                    disabled={blockingUsers.has(member.UserId)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {blockingUsers.has(member.UserId) ? (
                      <>
                        <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Blocking...</span>
                      </>
                    ) : (
                      'Block'
                    )}
                  </button>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {hasMore && !searchTerm && (
              <div className="p-4 text-center border-b border-gray-100">
                <button
                  onClick={loadMoreMembers}
                  disabled={loadingMore}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading more members...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Members</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUniversalMembers;
