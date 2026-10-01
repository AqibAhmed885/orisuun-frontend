'use client';

import React from 'react';
import { cn } from '@/utils/utils';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader';
import Image from 'next/image';
import { leaderboard } from '@/app/api/dashboard/leaderboard';

interface CommunityApprovalRequest {
  Id: string;
  Name: string;
  Description: string;
  CreatedBy: string;
  CreatedByName: string;
  CreatedByProfilePicture?: string;
  CreatedAt: string;
  City?: string;
  Country?: string;
  MemberCount?: number;
}

interface CommunityApprovalRequestsProps {
  pendingCommunities: CommunityApprovalRequest[];
  loading: boolean;
  onApproval: (communityId: string, isApproved: boolean) => void;
  onCommunitySelect: (community: CommunityApprovalRequest) => void;
  isMobile: boolean;
  approvingCommunities?: Set<string>; // Track which communities are being approved/rejected
}

const CommunityApprovalRequests: React.FC<CommunityApprovalRequestsProps> = ({
  pendingCommunities,
  loading,
  onApproval,
  onCommunitySelect,
  isMobile,
  approvingCommunities = new Set()
}) => {
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: string]: 'approving' | 'rejecting' | null;
  }>({});
  
  const [flagCache, setFlagCache] = React.useState<{ [key: string]: string }>({});

  // Preload flags for unique countries
  React.useEffect(() => {
    if (pendingCommunities && pendingCommunities.length > 0) {
      const uniqueCountries = [...new Set(
        pendingCommunities
          .map(community => community.Country)
          .filter(Boolean)
      )];
      
      uniqueCountries.forEach(country => {
        loadFlagForCountry(country);
      });
    }
  }, [pendingCommunities]);

  const handleApproval = async (communityId: string, isApproved: boolean) => {
    try {
      // Set loading state for specific action
      setLoadingStates(prev => ({
        ...prev,
        [communityId]: isApproved ? 'approving' : 'rejecting'
      }));
      
      await onApproval(communityId, isApproved);
    } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        [communityId]: null
      }));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  // Load flag for country
  const loadFlagForCountry = async (country: string) => {
    if (!country || flagCache[country]) return;
    
    try {
      const flagUrl = await leaderboard.fetchCountryFlag(country);
      if (flagUrl) {
        setFlagCache(prev => ({ ...prev, [country]: flagUrl }));
      }
    } catch (error) {
      console.error('Error loading flag:', error);
    }
  };

  // Get flag image for country
  const getFlagImgForCountry = (country?: string) => {
    if (!country) return null;
    
    const flagUrl = flagCache[country];
    if (!flagUrl) {
      loadFlagForCountry(country);
      return null;
    }
    
    return (
      <Image
        src={flagUrl}
        alt={`${country} flag`}
        width={16}
        height={12}
        className="w-4 h-3 object-cover rounded-sm"
      />
    );
  };

  // Skeleton component for loading state
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full max-w-full animate-pulse">
      <div className="flex items-start space-x-3 mb-3 w-full max-w-full">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={cn(
        'flex flex-col min-h-0 w-full max-w-full',
        isMobile ? 'w-full' : 'w-full'
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Community Approval Requests</h2>
          <p className="text-sm text-gray-500 mt-1">Loading requests...</p>
        </div>

        {/* Skeleton List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-4 space-y-4 pb-6 max-w-full">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pendingCommunities || pendingCommunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
        <p className="text-sm text-gray-500 text-center">
          All community requests have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col min-h-0 w-full max-w-full',
      isMobile ? 'w-full' : 'w-full'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Community Approval Requests</h2>
        <p className="text-sm text-gray-500 mt-1">
          {pendingCommunities.length} request{pendingCommunities.length !== 1 ? 's' : ''} pending review
        </p>
      </div>

      {/* Requests List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-4 space-y-4 pb-6 max-w-full">
          {pendingCommunities?.map((community) => (
            <div
              key={community.Id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full max-w-full"
              onClick={() => onCommunitySelect(community)}
            >
              {/* Community Header */}
              <div className="flex items-start space-x-3 mb-3 w-full max-w-full">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {community.CreatedByProfilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={community.CreatedByProfilePicture}
                      alt={community.Name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {community.Name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {community.Name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Created by {community.CreatedByName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1 min-w-0">
                    {community.City && (
                      <span className="text-xs text-gray-500 truncate">{community.City}</span>
                    )}
                    {community.Country && (
                      <div className="flex items-center space-x-1 min-w-0">
                        {getFlagImgForCountry(community.Country)}
                        <span className="text-xs text-gray-500 truncate">{community.Country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {community.Description && (
                <div className="mb-3 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-3 break-words overflow-hidden">
                    {community.Description}
                  </p>
                </div>
              )}

              {/* Community Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Created {formatDate(community.CreatedAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproval(community.Id, true);
                  }}
                  disabled={loadingStates[community.Id] !== null}
                  className="flex-1 bg-green-600 text-white text-xs font-medium py-2 px-3 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center min-w-0"
                >
                  {loadingStates[community.Id] === 'approving' ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Approve'
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproval(community.Id, false);
                  }}
                  disabled={loadingStates[community.Id] !== null}
                  className="flex-1 bg-red-600 text-white text-xs font-medium py-2 px-3 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center min-w-0"
                >
                  {loadingStates[community.Id] === 'rejecting' ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Reject'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { CommunityApprovalRequests };
