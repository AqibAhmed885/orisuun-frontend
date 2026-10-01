'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { communityApi } from '@/app/api/dashboard/community';
import { CommunityChatCard } from './community-chat-card';
import { showTimeStatus } from '@/utils/helper';

type Comment = {
  id: string;
  SenderName: string;
  SenderProfilePicture?: string;
  SenderUserType?: string;
  SenderCountry?: string;
  SenderCity?: string;
  Message: string;
  AttachmentUrl?: string;
  Size?: number;
  ChatDocument?: {
    Document: string;
    FileName: string;
    Size: number;
  };
  Reactions?: {
    ChatId: string;
    TotalReactions: number;
    LikesCount: number;
    EmojiReactions: string[];
    Reactions: string[];
  };
  time?: string |null;
  location?: string;
  role?: string;
  avatarUrl?: string;
  IsOnline?: boolean;
  LastActive?: string | null;
};

type ReactionType = 'like' | 'love' | 'approved' | 'funny';

const TopComments: React.FC<{ communityId: string }> = ({ communityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<ReactionType>('like');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await communityApi.getTopComments(communityId, filter);
        
        
        

        const data = response.data || [];
        
        
        // Map API response to component expected format
        const mappedComments = data.map((comment: any) => ({
          id: comment.Id,
          SenderName: comment.SenderName,
          SenderProfilePicture: comment.SenderProfilePicture,
          SenderUserType: comment.SenderUserType,
          SenderCountry: comment.SenderCountry,
          SenderCity: comment.SenderCity,
          Message: comment.Message,
          AttachmentUrl: comment.AttachmentUrl,
          Size: comment.Size,
          ChatDocument: comment.Documents && comment.Documents.length > 0 ? {
            Document: comment.Documents[0].Document,
            FileName: comment.Documents[0].FileName,
            Size: comment.Documents[0].Size,
          } : undefined,
          Reactions: comment.Reactions,
          time: comment.CreatedAt,
          location: comment.SenderCity ? `${comment.SenderCity}, ${comment.SenderCountry}` : comment.SenderCountry,
          role: comment.SenderUserType,
          avatarUrl: comment.SenderProfilePicture,
          IsOnline: comment.IsOnline,
          LastActive: comment.LastActiveText || comment.LastActive,
        }));

        // Frontend filtering based on reaction type
        const filteredComments = mappedComments.filter((comment: any) => {
          if (!comment.Reactions || !comment.Reactions.Reactions || comment.Reactions.Reactions.length === 0) {
            return false; // No reactions, don't show
          }

          const reactions = comment.Reactions.Reactions;
          
          switch (filter) {
            case 'like':
              return reactions.some((reaction: any) => reaction.IsLike === true);
            case 'love':
              return reactions.some((reaction: any) => reaction.Emoji?.toLowerCase() === 'heart');
            case 'approved':
              // Improved check for 'approved' (handles variations)
              return reactions.some((reaction: any) => {
                const emoji = reaction.Emoji?.toLowerCase()?.trim();
                return emoji === 'thumbsup' || emoji === 'like' || emoji === '👍' || emoji === 'thumb up';
              });
            case 'funny':
              return reactions.some((reaction: any) => reaction.Emoji?.toLowerCase() === 'laugh');
            default:
              return true;
          }
        });

        // Sort by reaction count for the selected filter type
        const sortedComments = filteredComments.sort((a: any, b: any) => {
          const aReactions = a.Reactions?.Reactions || [];
          const bReactions = b.Reactions?.Reactions || [];
          
          let aCount = 0;
          let bCount = 0;
          
          switch (filter) {
            case 'like':
              aCount = aReactions.filter((r: any) => r.IsLike === true).length;
              bCount = bReactions.filter((r: any) => r.IsLike === true).length;
              break;
            case 'love':
              aCount = aReactions.filter((r: any) => r.Emoji === 'heart').length;
              bCount = bReactions.filter((r: any) => r.Emoji === 'heart').length;
              break;
            case 'approved':
              aCount = aReactions.filter((r: any) => r.Emoji === 'like').length;
              bCount = bReactions.filter((r: any) => r.Emoji === 'like').length;
              break;
            case 'funny':
              aCount = aReactions.filter((r: any) => r.Emoji === 'laugh').length;
              bCount = bReactions.filter((r: any) => r.Emoji === 'laugh').length;
              break;
          }
          
          return bCount - aCount; // Sort descending (highest first)
        });
        
        setComments(sortedComments);

      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [communityId, filter]);


  return (
      <div className="bg-white tracking-wide rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-gray-800">Top Comments</div>
          <select 
            className="text-sm text-gray-500 border rounded px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value as ReactionType)}
          >
            <option value="like">Most Liked</option>
            <option value="love">Most Loved</option>
            <option value="approved">Most Approved</option>
            <option value="funny">Most Funny</option>
          </select>
        </div>

        {loading ? (
          // Loading skeleton with shimmer effect
          <div className="space-y-4">
            {Array.from({ length: 1 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex gap-3 p-3 rounded-lg bg-white">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2 items-center">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-2 px-4">
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" fill="#F5F8FF"/>
              <path d="M32 48C40.8366 48 48 40.8366 48 32C48 23.1634 40.8366 16 32 16C23.1634 16 16 23.1634 16 32C16 40.8366 23.1634 48 32 48Z" fill="#E4EBFF"/>
              <path d="M32 44C38.6274 44 44 38.6274 44 32C44 25.3726 38.6274 20 32 20C25.3726 20 20 25.3726 20 32C20 38.6274 25.3726 44 32 44Z" fill="#2357C6"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M35 30C35 31.6569 33.6569 33 32 33C30.3431 33 29 31.6569 29 30C29 28.3431 30.3431 27 32 27C33.6569 27 35 28.3431 35 30ZM32 39C34.2091 39 36 37.2091 36 35H28C28 37.2091 29.7909 39 32 39Z" fill="white"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Comments Yet</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Be the first to share your thoughts on this community!
            </p>
          </div>
        ) : (
          // Comments list with "Load More" button...
              <div className="space-y-1 h-40 overflow-y-auto">
            {comments.map(comment => (
              <div key={comment.id} className="w-full cursor-pointer transition-colors rounded-lg hover:bg-gray-50 ">
                <CommunityChatCard
                  key={comment.id}
                  id={comment.id}
                  // CommunityId={communityId}
                  name={comment.SenderName}
                  attachments={
                   comment.AttachmentUrl
                      ? [
                        {
                          type:comment.AttachmentUrl.match(/\.(jpg|jpeg|png|gif)$/)
                            ? 'image'
                            : 'file',
                          url:comment.AttachmentUrl,
                          name:comment.AttachmentUrl.split('/').pop(),
                          size:comment.Size,
                        },
                      ]
                      : undefined
                  }
                  chatDocument={
                   comment.ChatDocument
                      ? {
                        Document:comment.ChatDocument.Document,
                        FileName:comment.ChatDocument.FileName,
                        Size: comment.ChatDocument.Size,
                      }
                      : undefined
                  }
                  lastMessage={comment.Message}
                  avatarUrl={comment.SenderProfilePicture}
                  time={showTimeStatus(comment.time)}
                  roleBadge={comment.SenderUserType}
                  locationBadge={comment.SenderCountry}
                  locationCity={comment.SenderCity}
                  LastActive={comment.LastActive}
                  isOnline={comment.IsOnline}
                  reactions={comment.Reactions}
                />
              </div>
            ))}
            
          </div>
        )}
      </div>
  );
};

export default TopComments;