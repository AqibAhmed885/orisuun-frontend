'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/utils';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader';
import { communityApi } from '@/app/api/dashboard/community';

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

interface CommunityDetailsProps {
  community: CommunityApprovalRequest;
  onBack: () => void;
  onApproval: (communityId: string, isApproved: boolean) => void;
  isMobile: boolean;
}

const CommunityDetails: React.FC<CommunityDetailsProps> = ({
  community,
  onBack,
  onApproval,
  isMobile
}) => {
  const [communityDetails, setCommunityDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    fetchCommunityDetails();
    fetchCommunityMembers();
  }, [community.Id]);

  const fetchCommunityDetails = async () => {
    setLoading(true);
    try {
      const result = await communityApi.getCommunityDetails(community.Id);
      if (result.success) {
        setCommunityDetails(result.data);
      }
    } catch (error) {
      console.error('Error fetching community details:', error);
      toast.error('Failed to fetch community details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityMembers = async () => {
    setLoadingMembers(true);
    try {
      const result = await communityApi.getCommunityDetails(community.Id);
      if (result.success) {
        setMembers(result.data.Members);
      }
    } catch (error) {
      console.error('Error fetching community members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleApproval = async (isApproved: boolean) => {
    try {
      await onApproval(community.Id, isApproved);
      onBack(); // Go back to the list after approval
    } catch (error) {
      console.error('Error handling approval:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getFlagImgForCountry = (country?: string) => {
    if (!country) return null;
    const cc = country.toLowerCase();
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://flagcdn.com/${cc}.svg`}
        alt={country}
        className="w-4 h-3 object-cover rounded-sm"
      />
    );
  };

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Community Details</h2>
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Community Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {community.CreatedByProfilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={community.CreatedByProfilePicture}
                      alt={community.Name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
                      {community.Name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {community.Name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Created by {community.CreatedByName}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {community.City && <span>{community.City}</span>}
                    {community.Country && (
                      <div className="flex items-center space-x-1">
                        {getFlagImgForCountry(community.Country)}
                        <span>{community.Country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {community.Description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {community.Description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">{formatDate(community.CreatedAt)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Members:</span>
                  <p className="font-medium">{members.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Members</h4>
              {loadingMembers ? (
                <div className="flex items-center justify-center h-20">
                  <Loader />
                </div>
              ) : members.length > 0 ? (
                <div className="space-y-2">
                  {members.slice(0, 5).map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {member.UserName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.UserName || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.UserType || 'Member'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {members.length > 5 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{members.length - 5} more members
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No members found
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleApproval(true)}
                className="flex-1 bg-green-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Approve Community
              </button>
              <button
                onClick={() => handleApproval(false)}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reject Community
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { CommunityDetails };
