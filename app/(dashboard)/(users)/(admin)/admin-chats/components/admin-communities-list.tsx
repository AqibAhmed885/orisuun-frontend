'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/utils';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader';
import { communityApi } from '@/app/api/dashboard/community';
import { leaderboard } from '@/app/api/dashboard/leaderboard';

interface Community {
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
  ProfilePhotoUrl?: string;
  Status?: string;
}

interface AdminCommunitiesListProps {
  onCommunitySelect: (community: Community) => void;
  selectedCommunityId?: string;
  isMobile: boolean;
}

const AdminCommunitiesList: React.FC<AdminCommunitiesListProps> = ({
  onCommunitySelect,
  selectedCommunityId,
  isMobile
}) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [flagCache, setFlagCache] = useState<Record<string, string>>({});

  // Fetch all communities
  const fetchCommunities = async () => {
    setLoading(true);
    try {
      // Fetch all communities using trending communities API
      const result = await communityApi.getTrendingCommunities(1, 100);
      
      if (result.success && result.data) {
        // Handle different possible response structures
        const communitiesData = Array.isArray(result.data) 
          ? result.data 
          : result.data.Communities || result.data.communities || [];
        setCommunities(communitiesData);
      } else {
        throw new Error(result.message || 'Failed to fetch communities');
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to fetch communities');
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Preload flags for all unique countries in communities
  useEffect(() => {
    const uniqueCountries = [...new Set(communities.map(community => community.Country).filter(Boolean))];
    uniqueCountries.forEach(country => {
      if (!flagCache[country]) {
        loadFlagForCountry(country);
      }
    });
  }, [communities]);

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

  // Load flag for a country and cache it
  const loadFlagForCountry = async (country: string) => {
    if (flagCache[country]) return flagCache[country];
    
    try {
      const flagUrl = await leaderboard.fetchCountryFlag(country);
      if (flagUrl) {
        setFlagCache(prev => ({ ...prev, [country]: flagUrl }));
        return flagUrl;
      }
    } catch (error) {
      console.error('Error fetching flag for country:', country, error);
    }
    return null;
  };

  const getFlagImgForCountry = (country?: string) => {
    if (!country) return null;
    
    const flagUrl = flagCache[country];
    if (!flagUrl) {
      // Load flag asynchronously
      loadFlagForCountry(country);
      return null;
    }
    
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={flagUrl}
        alt={`${country} flag`}
        className="w-4 h-3 object-cover rounded-sm"
      />
    );
  };

  const filteredCommunities = (communities || []).filter(community =>
    community?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community?.CreatedByName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton component for loading state
  const CommunitySkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-full animate-pulse">
      <div className="flex items-start space-x-3 mb-3 w-full max-w-full">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
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
          <h2 className="text-lg font-semibold text-gray-900">All Communities</h2>
          <p className="text-sm text-gray-500 mt-1">Loading communities...</p>
        </div>

        {/* Skeleton List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-4 space-y-4 pb-6 max-w-full">
            {[...Array(5)].map((_, index) => (
              <CommunitySkeleton key={index} />
            ))}
          </div>
        </div>
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
        <h2 className="text-lg font-semibold text-gray-900">All Communities</h2>
        <p className="text-sm text-gray-500 mt-1">
          {communities.length} communit{communities.length !== 1 ? 'ies' : 'y'} total
        </p>
        
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Communities List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-4 space-y-4 pb-6 max-w-full">
          {filteredCommunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Communities Found</h3>
              <p className="text-sm text-gray-500 text-center">
                {searchTerm ? 'Try adjusting your search terms.' : 'No communities available.'}
              </p>
            </div>
          ) : (
            filteredCommunities.map((community) => (
              <div
                key={community.Id}
                className={cn(
                  "bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full max-w-full",
                  selectedCommunityId === community.Id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200"
                )}
                onClick={() => onCommunitySelect(community)}
              >
                {/* Community Header */}
                <div className="flex items-start space-x-3 mb-3 w-full max-w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {community.ProfilePhotoUrl || community.CreatedByProfilePicture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={community.ProfilePhotoUrl || community.CreatedByProfilePicture}
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
                    <p className="text-xs font-semibold text-gray-700 mt-1 truncate">
                      Created by {community.CreatedByName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {community.City && (
                        <span className="inline-flex items-center gap-1.5 bg-[#F5FAFF] border border-[#D1E9FF] text-[#5B657B] px-2.5 py-1.5 rounded-full text-xs font-medium">
                          {getFlagImgForCountry(community.Country)}
                          <span>{community.City}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {community.Description && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {community.Description}
                    </p>
                  </div>
                )}

                {/* Community Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold">Created {formatDate(community.CreatedAt)}</span>
                  <div className="flex items-center space-x-3">
                    
                    {community.Status && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        community.Status === 'Approved' 
                          ? "bg-green-100 text-green-800"
                          : community.Status === 'Pending'
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      )}>
                        {community.Status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { AdminCommunitiesList };
