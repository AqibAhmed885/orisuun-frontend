'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/utils';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader';
import { communityApi } from '@/app/api/dashboard/community';
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import Image from 'next/image';
import Linkify from 'react-linkify';
import moment from 'moment';

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

interface CommunityMessage {
  Id: string;
  Message: string;
  CreatedAt: string;
  CreatedBy: string;
  SenderName: string;
  SenderProfilePicture?: string;
  SenderUserType?: string;
  SenderCountry?: string;
  AttachmentUrl?: string;
  Documents?: Array<{
    FileName: string;
    Size: number;
    Document: string;
  }>;
  Reactions?: {
    LikesCount: number;
  };
  SenderCity?: string;
}

interface AdminCommunityMessagesProps {
  community: Community;
  onBack: () => void;
  isMobile: boolean;
}

const AdminCommunityMessages: React.FC<AdminCommunityMessagesProps> = ({
  community,
  onBack,
  isMobile
}) => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [communityDetails, setCommunityDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [flagCache, setFlagCache] = useState<Record<string, string>>({});
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [deletingMessages, setDeletingMessages] = useState<Set<string>>(new Set());
  const [blockingUsers, setBlockingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Skeleton components for loading states
  const MessageSkeleton = () => (
    <div className="flex space-x-3 p-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex items-center space-x-4">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const MemberSkeleton = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  );

  // Fetch community messages
  const fetchMessages = async (pageNum: number = 1, reset: boolean = true) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await communityApi.getCommunityMessages(community.Id, pageNum, 50);
      const communityDetails = await communityApi.getCommunityDetails(community.Id);
      if (result.success && result.data) {
        const newMessages = result.data.Messages || result.data || [];
        
        if (reset) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...prev, ...newMessages]);
        }
        
        setHasMore(newMessages.length === 50);
        setPage(pageNum);
      }
      if (communityDetails.success && communityDetails.data) {
        setCommunityDetails(communityDetails.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (community.Id) {
      fetchMessages(1, true);
    }
  }, [community.Id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Preload flags for all unique countries in messages
  useEffect(() => {
    const uniqueCountries = [...new Set(messages.map(msg => msg.SenderCountry).filter(Boolean))];
    uniqueCountries.forEach(country => {
      if (!flagCache[country]) {
        loadFlagForCountry(country);
      }
    });
  }, [messages]);

  // Fetch members when modal opens
  useEffect(() => {
    if (showMembersModal) {
      fetchMembers();
    }
  }, [showMembersModal]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMoreMessages = () => {
    if (!loadingMore && hasMore) {
      fetchMessages(page + 1, false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      return 'Unknown time';
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

  const BASE_URL = '/defaultProfile/defaultProfile.png';

  const showTimeStatus = (date: string) => {
    const now = moment();
    const messageTime = moment(date);
    const diffInMinutes = now.diff(messageTime, 'minutes');
    const diffInHours = now.diff(messageTime, 'hours');
    const diffInDays = now.diff(messageTime, 'days');

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return messageTime.format('MMM DD');
  };

  const getRolesIcon = (userType: string) => {
    // You can add specific icons for different user types here
    return <span className="text-xs">👤</span>;
  };

  const handleToggleLike = (messageId: string) => {
    // Implement like functionality here
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    // Add to deleting set
    setDeletingMessages(prev => new Set(prev).add(messageId));

    try {
      const result = await communityApi.deleteCommunityMessage(messageId);
      
      if (result.success) {
        toast.success('Message deleted successfully');
        // Remove the message from the local state
        setMessages(prev => prev.filter(msg => msg.Id !== messageId));
      } else {
        throw new Error(result.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      // Remove from deleting set
      setDeletingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // Fetch community members
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const result = await communityApi.getCommunityDetails(community.Id);
      if (result.success && result.data) {
        setMembers(result.data.Members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
    } finally {
      setLoadingMembers(false);
    }
  };

  // Handle block user (removes user from community)
  const handleBlockUser = async (userId: string, communityId: string) => {
    if (!confirm(`Are you sure you want to block this user? This will remove them from the community.`)) {
      return;
    }

    // Add to blocking set
    setBlockingUsers(prev => new Set(prev).add(userId));

    try {
      const response = await communityApi.removeCommunityMember(communityId, userId, true);

      if (response.success) {
        toast.success('User blocked and removed successfully');
        // Remove the user from the local state
        setMembers(prev => prev.filter(member => member.UserId !== userId));
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


  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => setShowMembersModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Members</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {community.ProfilePhotoUrl || community.CreatedByProfilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={community.ProfilePhotoUrl || community.CreatedByProfilePicture}
                    alt={community.Name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {community.Name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{community.Name}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <MessageSkeleton key={index} />
            ))}
          </div>
        ) : messages.length === 0 ? (
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages</h3>
            <p className="text-sm text-gray-500 text-center">
              This community doesn't have any messages yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMore}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More Messages'}
                </button>
              </div>
            )}

            {/* Messages List */}
            {messages.map((message) => (
              <div key={message.Id} className="flex space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 relative">
                  <Image
                    src={message.SenderProfilePicture || BASE_URL}
                    alt={message.SenderName || 'User'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-gray-900">{message.SenderName || 'Unknown User'}</h3>
                    <span className="text-xs text-[#5B657B]">
                      {showTimeStatus(moment(message.CreatedAt).toISOString())}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 mb-2'>
                    {message.SenderUserType && (
                      <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs">
                        {getRolesIcon(message.SenderUserType)}
                        <span>{message.SenderUserType}</span>
                      </span>
                    )}
                    {message.SenderCity && (
                      <span className="inline-flex items-center gap-1.5 bg-[#F5FAFF] border border-[#D1E9FF] text-[#5B657B] px-2.5 py-1.5 rounded-full text-xs font-medium">
                        {getFlagImgForCountry(message.SenderCountry)}
                        <span>{message.SenderCity}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* message text */}
                  {message.Message && (
                    <Linkify
                      componentDecorator={(href, text, key) => (
                        <a
                          key={key}
                          href={href}
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {text}
                        </a>
                      )}
                    >
                      <p
                        className={`break-words text-gray-900 font-medium mb-2 ${/^[\p{Emoji}]+$/u.test(message.Message)
                            ? 'text-4xl'
                            : 'text-sm'
                          }`}
                      >
                        {message.Message}
                      </p>
                    </Linkify>
                  )}

                  {/* Attachment handling */}
                  {message.AttachmentUrl && (
                    <div className="mt-2">
                      <a
                        href={message.AttachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}

                  {/* Documents */}
                  {message.Documents && message.Documents.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.Documents.map((doc, index) => (
                        <div key={index} className="bg-gray-100 p-2 rounded-lg">
                          <a
                            href={doc.Document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm"
                          >
                            📄 {doc.FileName || 'Document'} ({(doc.Size / 1024).toFixed(1)} KB)
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* reactions and admin actions */}
                  <div className="flex items-center justify-between mt-2">
                    <button
                      className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm"
                      onClick={() => handleToggleLike(message.Id)}
                    >
                      <span className="text-red-500">❤️</span>
                      <span className="text-gray-600 text-xs">{message.Reactions?.LikesCount ?? 0}</span>
                    </button>
                    
                    {/* Admin Delete Button */}
                    <button
                      className="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 hover:bg-red-100 rounded-full text-sm text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteMessage(message.Id)}
                      disabled={deletingMessages.has(message.Id)}
                      title="Delete message (Admin only)"
                    >
                      {deletingMessages.has(message.Id) ? (
                        <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      <span className="text-xs">{deletingMessages.has(message.Id) ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Community Members</h3>
              <button
                onClick={() => setShowMembersModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingMembers ? (
                <div className="space-y-0">
                  {[...Array(3)].map((_, index) => (
                    <MemberSkeleton key={index} />
                  ))}
                </div>
              ) : members.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No members found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.UserId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {member.ProfilePicture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={member.ProfilePicture}
                              alt={member.UserName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                              {member.UserName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.UserName}</h4>
                          <p className="text-sm text-gray-500">{member.UserType}</p>
                          {member.Location && (
                            <p className="text-xs text-gray-400">{member.Location}</p>
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
                          onClick={() => handleBlockUser(member.UserId, community.Id)}
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
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminCommunityMessages };
