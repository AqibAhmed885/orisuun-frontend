'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { toast } from 'react-toastify';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Hamburger from '@/icons/sidebar/hamburger';
import { CommunityApprovalRequests } from './components/community-approval-requests';
import { CommunityDetails } from './components/community-details';
import { AdminCommunitiesList } from './components/admin-communities-list';
import { AdminCommunityMessages } from './components/admin-community-messages';
import AdminUniversalChat from './components/admin-universal-chat';
import AdminUniversalMembers from './components/admin-universal-members';
import { cn } from '@/utils/utils';

const AdminChats = () => {
  const { profileData } = useSelector((state: RootState) => state.user);
  const [selectedView, setSelectedView] = useState<'universal-chat' | 'community' | 'approval-requests'>('approval-requests');
  const [pendingCommunities, setPendingCommunities] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [selectedCommunityForMessages, setSelectedCommunityForMessages] = useState<any>(null);
  const [approvingCommunities, setApprovingCommunities] = useState<Set<string>>(new Set());

  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
  const isMobile = useMobileMediaQuery();

  // Fetch pending community approval requests
  const fetchPendingCommunities = async (page = 1, pageSize = 10) => {
    setLoadingApprovals(true);
    try {
      const base = process.env.NEXT_PUBLIC_APP_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      
      const response = await fetch(`${base}/api/Admin/community/pending?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'Content-Type': 'application/json',
          'XApiKey': apiKey,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending communities');
      }

      const data = await response.json();
      setPendingCommunities(data.Result?.Communities || []);
    } catch (error) {
      console.error('Error fetching pending communities:', error);
      toast.error('Failed to fetch pending communities');
      setPendingCommunities([]);
    } finally {
      setLoadingApprovals(false);
    }
  };

  // Approve or reject community
  const handleCommunityApproval = async (communityId: string, isApproved: boolean) => {
    // Add to loading set
    setApprovingCommunities(prev => new Set(prev).add(communityId));
    
    try {
      const base = process.env.NEXT_PUBLIC_APP_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const response = await fetch(`${base}/api/Admin/community/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'XApiKey': apiKey,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          CommunityId: communityId,
          AdminUserId: currentUser?.Id || currentUser?.UserId,
          IsApproved: isApproved
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update community approval status');
      }

      const data = await response.json();
      if (data.StatusCode === 200) {
        toast.success(data.Message || `Community ${isApproved ? 'approved' : 'rejected'} successfully`);
        // Remove the community from pending list
        setPendingCommunities(prev => prev.filter(community => community.Id !== communityId));
        // Refresh the list
        fetchPendingCommunities();
      } else {
        throw new Error(data.Message || 'Failed to update community status');
      }
    } catch (error) {
      console.error('Error updating community approval:', error);
      toast.error(`Failed to ${isApproved ? 'approve' : 'reject'} community`);
    } finally {
      // Remove from loading set
      setApprovingCommunities(prev => {
        const newSet = new Set(prev);
        newSet.delete(communityId);
        return newSet;
      });
    }
  };

  // Handle view change
  const handleViewChange = (view: 'universal-chat' | 'community' | 'approval-requests') => {
    setSelectedView(view);
    setSelectedCommunity(null); // Clear selected community when changing views
    setSelectedCommunityForMessages(null); // Clear selected community for messages
    if (view === 'approval-requests') {
      fetchPendingCommunities();
    }
  };

  // Handle community selection for approval details
  const handleCommunitySelect = (community: any) => {
    setSelectedCommunity(community);
  };

  // Handle back from community details
  const handleBackFromCommunity = () => {
    setSelectedCommunity(null);
  };

  // Handle community selection for messages
  const handleCommunitySelectForMessages = (community: any) => {
    setSelectedCommunityForMessages(community);
  };

  // Handle back from community messages
  const handleBackFromCommunityMessages = () => {
    setSelectedCommunityForMessages(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchPendingCommunities();
  }, []);

  return (
    <>
      {/* <div className="lg:hidden overflow-hidden flex items-center justify-center p-4 !pb-0 bg-white">
        <Hamburger className="hidden" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Admin Chatsss
        </p>
      </div> */}
      <div className="w-full flex flex-row h-[calc(100vh-40px)] lg:h-[100vh] shadow-lg gap-6 md:p-6 relative overflow-hidden max-w-full">
        {/* Navigation Sidebar */}
        <div className={cn(
          'w-full md:w-80 lg:w-96 bg-white rounded-2xl shadow-sm flex flex-col min-w-0 flex-shrink-0',
          isMobile ? 'h-full' : 'h-full'
        )}>
          {/* Navigation Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Admin Chats</h2>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange('universal-chat')}
                className={cn(
                  'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  selectedView === 'universal-chat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Universal Chat
              </button>
              <button
                onClick={() => handleViewChange('community')}
                className={cn(
                  'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  selectedView === 'community'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Communities
              </button>
              <button
                onClick={() => handleViewChange('approval-requests')}
                className={cn(
                  'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                  selectedView === 'approval-requests'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Approvals
                {pendingCommunities && pendingCommunities.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingCommunities.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {selectedView === 'approval-requests' && (
              <CommunityApprovalRequests
                pendingCommunities={pendingCommunities}
                loading={loadingApprovals}
                onApproval={handleCommunityApproval}
                onCommunitySelect={handleCommunitySelect}
                isMobile={isMobile}
                approvingCommunities={approvingCommunities}
              />
            )}
            {selectedView === 'universal-chat' && (
              <AdminUniversalMembers isMobile={isMobile} />
            )}
            {selectedView === 'community' && (
              <AdminCommunitiesList
                onCommunitySelect={handleCommunitySelectForMessages}
                selectedCommunityId={selectedCommunityForMessages?.Id}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm min-w-0 overflow-hidden flex-shrink">
          {selectedView === 'universal-chat' ? (
            <AdminUniversalChat isMobile={isMobile} />
          ) : selectedCommunity ? (
            <CommunityDetails
              community={selectedCommunity}
              onBack={handleBackFromCommunity}
              onApproval={handleCommunityApproval}
              isMobile={isMobile}
            />
          ) : selectedCommunityForMessages ? (
            <AdminCommunityMessages
              community={selectedCommunityForMessages}
              onBack={handleBackFromCommunityMessages}
              isMobile={isMobile}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Chat Management</h3>
                <p className="text-sm text-gray-500">
                  {selectedView === 'community' 
                    ? 'Select a community from the sidebar to view messages'
                    : 'Select a community from the sidebar to view details'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminChats;
