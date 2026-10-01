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

interface UniversalMessage {
  Id: string;
  Message: string;
  CreatedAt: string;
  CreatedBy: string;
  SenderName: string;
  SenderProfilePicture?: string;
  SenderUserType?: string;
  SenderCountry?: string;
  SenderCity?: string;
  AttachmentUrl?: string;
  Documents?: Array<{
    FileName: string;
    Size: number;
    Document: string;
  }>;
  Reactions?: {
    LikesCount: number;
  };
}

interface AdminUniversalChatProps {
  isMobile: boolean;
}

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

const AdminUniversalChat: React.FC<AdminUniversalChatProps> = ({ isMobile }) => {
  const [messages, setMessages] = useState<UniversalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [flagCache, setFlagCache] = useState<Record<string, string>>({});
  const [deletingMessages, setDeletingMessages] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<UniversalMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
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

  // Universal Chat is a specific community with this ID
  const UNIVERSAL_CHAT_ID = '5c2be789-4a31-494a-910a-52b8e30ad435';

  // Fetch universal chat members
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const result = await communityApi.getUniversalChatMembers(UNIVERSAL_CHAT_ID, 1, 1000);
      if (result.success && result.data) {
        // Handle different possible response structures
        const membersData = Array.isArray(result.data) 
          ? result.data 
          : result.data.Members || result.data.members || [];
        setMembers(membersData);
      } else {
        throw new Error(result.success ? 'Failed to fetch members' : 'failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching universal chat members:', error);
      toast.error('Failed to fetch members');
      setMembers([]);
    } finally {
      setLoadingMembers(false);
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
      const response = await communityApi.removeCommunityMember(UNIVERSAL_CHAT_ID, userId, true);

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

  // Fetch universal chat messages
  const fetchMessages = async (pageNum: number = 1, reset: boolean = true) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await communityApi.getCommunityMessages(UNIVERSAL_CHAT_ID, pageNum, 50);
      
      if (result.success && result.data) {
        const newMessages = Array.isArray(result.data) ? result.data : result.data.Messages || [];
        
        if (reset) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...prev, ...newMessages]);
        }
        
        setPage(pageNum);
        setHasMore(newMessages.length === 50);
      } else {
        throw new Error(result.message || 'Failed to fetch universal chat messages');
      }
    } catch (error) {
      console.error('Error fetching universal chat messages:', error);
      toast.error('Failed to fetch universal chat messages');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more messages
  const loadMoreMessages = () => {
    if (!loadingMore && hasMore) {
      fetchMessages(page + 1, false);
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

  // Show time status
  const showTimeStatus = (dateString: string) => {
    const now = moment();
    const messageTime = moment(dateString);
    const diffInMinutes = now.diff(messageTime, 'minutes');
    const diffInHours = now.diff(messageTime, 'hours');
    const diffInDays = now.diff(messageTime, 'days');

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return messageTime.format('MMM DD');
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    // Add to deleting set
    setDeletingMessages(prev => new Set(prev).add(messageId));

    try {
      const result = await communityApi.deleteCommunityMessage(messageId);
      
      if (result.success) {
        toast.success('Universal chat message deleted successfully');
        // Remove the message from the local state
        setMessages(prev => prev.filter(msg => msg.Id !== messageId));
      } else {
        throw new Error(result.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting universal chat message:', error);
      toast.error('Failed to delete universal chat message');
    } finally {
      // Remove from deleting set
      setDeletingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // Preload flags for unique countries
  useEffect(() => {
    const uniqueCountries = [...new Set(messages.map(msg => msg.SenderCountry).filter(Boolean))];
    uniqueCountries.forEach(country => {
      if (country && !flagCache[country]) {
        loadFlagForCountry(country);
      }
    });
  }, [messages, flagCache]);

  // Initial load
  useEffect(() => {
    fetchMessages();
    fetchMembers();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Universal Chat</h2>
            <p className="text-sm text-gray-500">Global community chat</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-sm text-gray-500">Universal chat messages will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMore}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More Messages'}
                </button>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.Id} className="flex space-x-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="relative flex-shrink-0">
                  <Image
                    src={message.SenderProfilePicture || '/defaultProfile/default-avatar.png'}
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
                    {message.SenderUserType && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {message.SenderUserType}
                      </span>
                    )}
                    {message.SenderCity && (
                      <span className="inline-flex items-center gap-1.5 bg-[#F5FAFF] border border-[#D1E9FF] text-[#5B657B] px-2.5 py-1.5 rounded-full text-xs font-medium">
                        {getFlagImgForCountry(message.SenderCountry)}
                        <span>{message.SenderCity}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-800 text-sm leading-relaxed mb-3">
                    <Linkify
                      componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a target="blank" href={decoratedHref} key={key} className="text-blue-600 hover:underline">
                          {decoratedText}
                        </a>
                      )}
                    >
                      {message.Message}
                    </Linkify>
                  </div>

                  {/* Message Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-sm text-gray-600 transition-colors"
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
    </div>
  );
};

export default AdminUniversalChat;
