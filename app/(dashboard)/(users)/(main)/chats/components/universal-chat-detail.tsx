import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';
import { AttachFileIcon, SendMessageIcon } from '@/icons/chats/textarea-icons';
import EmojiPicker from '@/components/ui/emoji-picker';
import { PhotoIcon } from '@heroicons/react/24/solid';
import MessageIcon from '@/icons/message-icon';
import axios from 'axios';
import MessageShimmer from './messageShimmer';
import { toast } from 'react-toastify';
import { result } from 'lodash';

// Minimal FileCard component definition
interface FileCardProps {
  isSent: boolean;
  isUploading: boolean;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  fileUploadingProgress: number;
  handleRemoveAttachment: () => void;
}

const FileCard: React.FC<FileCardProps> = ({
  isSent,
  isUploading,
  fileName,
  fileSize,
  fileType,
  fileUrl,
  fileUploadingProgress,
  handleRemoveAttachment,
}) => (
  <div className="flex items-center gap-3 mb-2 p-2 border rounded bg-white">
    <div className="flex-shrink-0 w-12 h-12">
      <Image src={fileUrl} alt={fileName} width={48} height={48} className="w-12 h-12 object-cover rounded" />
    </div>
    <div className="flex-1">
      <div className="font-medium text-sm">{fileName}</div>
      <div className="text-xs text-gray-500">{fileSize} • {fileType}</div>
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${fileUploadingProgress}%` }}
          />
        </div>
      )}
    </div>
    <button
      type="button"
      className="text-red-500 text-xs ml-2"
      onClick={handleRemoveAttachment}
    >
      Remove
    </button>
  </div>
);

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    badge?: string;
    location?: string;
    isVerified?: boolean;
    country?: string;
  };
  time: string; // ISO string
  content: string;
  reactions?: { emoji: string; count: number }[];
  replyTo?: Message;
  date: string; // e.g. "JUN 06"
  likeCount?: number; // Add likeCount property
}

// API Response interface for community messages
interface CommunityMessage {
  Id: string;
  CommunityId: string;
  TopicId: string | null;
  SenderId: string;
  SenderName: string;
  SenderUserType: string;
  SenderCountry: string;
  SenderProfilePicture: string;
  Message: string;
  AttachmentUrl: string | null;
  ParentMessageId: string | null;
  CreatedAt: string;
  Documents: any[];
  Reactions: {
    ChatId: string;
    TotalReactions: number;
    LikesCount: number;
    EmojiReactions: any[];
    Reactions: any[];
  };
  Replies: any[];
}

interface UniversalChatDetailProps {
  messages?: Message[]; // Make optional since we'll fetch from API
  onSend: (msg: Message) => void;
  onReply?: (msg: Message) => void;
  replyingTo?: Message;
  selectedPerson?: any; // Selected person to chat with
  communityId?: string; // Add community ID to fetch messages
  currentUserId?: string; // Add current user ID for sending messages
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
}

const UniversalChatDetail: React.FC<UniversalChatDetailProps> = ({
  onSend,
  replyingTo,
  onReply,
  selectedPerson,
  communityId,
  currentUserId = '',
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loaderImage, setLoaderImage] = useState(false);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<Record<string, boolean>>({});

  // Function to transform API response to Message interface
  const transformCommunityMessage = (apiMessage: CommunityMessage): Message => {
    // Country name to code mapping for flags
    const countryNameToCode: Record<string, string> = {
      'united states': 'us',
      'pakistan': 'pk',
      'canada': 'ca',
      'united kingdom': 'gb',
      'nigeria': 'ng',
      'germany': 'de',
      // Add more as needed
    };

    const countryCode = countryNameToCode[apiMessage.SenderCountry?.toLowerCase()] ||
      apiMessage.SenderCountry?.toLowerCase() || 'us';

    // Handle replies - if this message has replies, transform the first reply as replyTo
    const replyTo = apiMessage.Replies && apiMessage.Replies.length > 0 ? {
      id: apiMessage.Replies[0].Id,
      sender: {
        name: apiMessage.Replies[0].SenderName,
        avatar: apiMessage.Replies[0].SenderProfilePicture || '/chat/user-avatar.png',
        badge: apiMessage.Replies[0].SenderUserType,
        location: apiMessage.Replies[0].SenderCountry,
        isVerified: true,
        country: countryNameToCode[apiMessage.Replies[0].SenderCountry?.toLowerCase()] ||
          apiMessage.Replies[0].SenderCountry?.toLowerCase() || 'us',
      },
      time: apiMessage.Replies[0].CreatedAt,
      content: apiMessage.Replies[0].Message,
      reactions: apiMessage.Replies[0].Reactions?.EmojiReactions?.map(reaction => ({
        emoji: reaction.Emoji || '👍',
        count: reaction.Count || 0
      })) || [],
      likeCount: apiMessage.Reactions?.LikesCount || 0, // <-- Add this line
      replyTo: undefined,
      date: formatDate(apiMessage.Replies[0].CreatedAt),
    } : undefined;

    return {
      id: apiMessage.Id,
      sender: {
        name: apiMessage.SenderName,
        avatar: apiMessage.SenderProfilePicture || '/chat/user-avatar.png',
        badge: apiMessage.SenderUserType,
        location: apiMessage.SenderCountry,
        isVerified: true, // You can adjust this based on your logic
        country: countryCode,
      },
      time: apiMessage.CreatedAt,
      content: apiMessage.Message,
      reactions: apiMessage.Reactions?.EmojiReactions?.map(reaction => ({
        emoji: reaction.Emoji || '👍',
        count: reaction.Count || 0
      })) || [],
      likeCount: apiMessage.Reactions?.LikesCount || 0, // <-- Add this line
      replyTo: replyTo,
      date: formatDate(apiMessage.CreatedAt),
    };
  };

  // Fetch community messages from API
  const fetchCommunityMessages = useCallback(async () => {
    if (!communityId) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/GetCommunityMessages`,
        {
          params: {
            communityId: communityId,
            page: 1,
            pageSize: 50
          },
          headers: {
            'accept': '*/*',
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY,   
          }
        }
      );

      

      if (response.data.StatusCode === 200) {
        const apiMessages: CommunityMessage[] = response.data.Result || [];

        // Transform only the main messages (replies are nested inside them)
        const transformedMessages: Message[] = apiMessages.map(apiMessage =>
          transformCommunityMessage(apiMessage)
        );


        // Sort messages by creation time
        transformedMessages.sort((a, b) =>
          new Date(a.time).getTime() - new Date(b.time).getTime()
        );

        

        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error fetching community messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  

  // Fetch messages when component mounts or communityId changes
  useEffect(() => {
    if (communityId) {
      fetchCommunityMessages();
   }
  }, [communityId]);

  // Group messages by date
  const grouped: { [date: string]: Message[] } = {};
  messages.forEach(msg => {
    const date = formatDate(msg.time);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(msg);
  });

  const getFlagImgForCountry = (country?: string) => {
    if (!country) return null;
    const cc = country.toLowerCase();
    // use SVG for crisp rendering
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://flagcdn.com/${cc}.svg`}
        alt={country}
        className="w-4 h-3 object-cover rounded-sm"
      />
    );
  };

  // Emoji picker logic
  const handleEmojiSelector = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  // File attachment logic
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoaderImage(true);
      // Simulate upload progress
      setTimeout(() => {
        setLoaderImage(false);
        setFileUploadingProgress(100);
      }, 1000);
    }
  };

  const handleRemoveAttachment = () => {
    setFile(null);
    setFileUploadingProgress(0);
  };

  // Message input logic
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  // Send message logic
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    if (!currentUserId || !communityId) {
      console.error('Missing currentUserId or communityId');
      return;
    }

    try {
      const payload = {
        CommunityId: communityId,
        TopicId: null,
        SenderId: currentUserId,
        Message: newMessage.trim(),
        AttachmentUrl: null, // TODO: Handle file upload if needed
        ParentMessageId: replyingTo ? replyingTo.id : null, // Set parent if replying
        ChatDocument: null // TODO: Handle document upload if needed
      };


      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/SendCommunityMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY || '',
             
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();
      toast.success(result.Message || 'Message sent successfully');

      if (result.StatusCode === 200 || response.ok) {
        // Clear the input and reset states
        setNewMessage('');
        setFile(null);
        setFileUploadingProgress(0);
        setLoaderImage(false);
        onReply && onReply(undefined); // Clear reply state

        // Refresh messages by fetching again
        if (communityId) {
          fetchCommunityMessages();
        }
      } else {
        toast.error(result.Message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  // Helper function to convert emoji string to actual emoji
  const getEmojiDisplay = (emojiString: string) => {
    const emojiMap: Record<string, string> = {
      'smile': '😀',
      'heart': '❤️',
      'like': '👍',
      'laugh': '😂',
      'sad': '😢',
      'angry': '😠',
      'wow': '😮',
      'love': '🥰',
      'thumbsup': '👍',
      'thumbsdown': '👎',
      'fire': '🔥',
      'clap': '👏',
      'string': '😀' // fallback for "string" from API
    };

    // Return emoji if found, otherwise return the string as fallback
    return emojiMap[emojiString.toLowerCase()] || emojiString;
  };

  // Add emoji reaction handler
  const handleAddEmojiReaction = async (chatId: string, emoji: string) => {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/AddEmoji?userId=${currentUserId}`,
        {
          ChatId: chatId,
          Emoji: emoji
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY,
             
          }
        }
      );

      
      // Refresh messages to show updated reactions
      fetchCommunityMessages();
      // toast.success('');
    } catch (error) {
      console.error('Error adding emoji reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  // Toggle like handler
  const handleToggleLike = async (chatId: string) => {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/ToggleLike?userId=${currentUserId}`,
        {
          ChatId: chatId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY,
             
          }
        }
      );
      // Refresh messages to show updated likes
      fetchCommunityMessages();
      toast.success('Like toggled');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white">
      {/* Header showing selected person */}
      {/* {selectedPerson && (
        <div className="border-b px-8 py-4 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">
                {selectedPerson.FullName ? selectedPerson.FullName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedPerson.FullName || selectedPerson.Name || 'Universal Chat'}
              </h2>
              <p className="text-sm text-gray-500">Start a conversation</p>
            </div>
          </div>
        </div>
      )} */}
      
      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <MessageShimmer key={idx} />
          ))
        ) : (
          messages.map((message) => (
          <div
            key={message.id}
              className="flex space-x-3 hover:border border-omblue-50 hover:shadow p-2 rounded-lg  group relative"
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 relative">
              <Image
                src={message.sender.avatar}
                alt={message.sender.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>
            {/* Message Content */}
            <div className="flex-1">
              {/* Top right hover icons */}
              <div className="absolute right-4 -top-3 bg-white border border-gray-100 p-1 rounded-md flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {/* Reaction Picker Icon */}
                  <div className="relative">
                    <button
                      className="rounded-full hover:bg-gray-100 p-1"
                      title="Add Reaction"
                      onClick={() => setShowEmojiPicker(prev => ({ ...prev, [`hover-${message.id}`]: !prev[`hover-${message.id}`] }))}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.18679 8.64703C5.18679 8.64703 6.0206 9.75877 7.41028 9.75877C8.79996 9.75877 9.63377 8.64703 9.63377 8.64703M9.0779 5.86767H9.08346M5.74267 5.86767H5.74823M12.969 7.53528C12.969 10.6053 10.4803 13.094 7.41028 13.094C4.34029 13.094 1.85156 10.6053 1.85156 7.53528C1.85156 4.46529 4.34029 1.97656 7.41028 1.97656C10.4803 1.97656 12.969 4.46529 12.969 7.53528ZM9.35584 5.86767C9.35584 6.02117 9.2314 6.1456 9.0779 6.1456C8.9244 6.1456 8.79996 6.02117 8.79996 5.86767C8.79996 5.71417 8.9244 5.58973 9.0779 5.58973C9.2314 5.58973 9.35584 5.71417 9.35584 5.86767ZM6.0206 5.86767C6.0206 6.02117 5.89617 6.1456 5.74267 6.1456C5.58917 6.1456 5.46473 6.02117 5.46473 5.86767C5.46473 5.71417 5.58917 5.58973 5.74267 5.58973C5.89617 5.58973 6.0206 5.71417 6.0206 5.86767Z" stroke="#465472" strokeWidth="1.33409" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* Quick emoji picker for hover */}
                    {showEmojiPicker[`hover-${message.id}`] && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
                        <div className="flex gap-1">
                          {['like', 'heart', 'laugh', 'wow', 'sad', 'angry'].map(emoji => (
                            <button
                              key={emoji}
                              className="p-1 hover:bg-gray-100 rounded text-lg"
                              onClick={() => {
                                handleAddEmojiReaction(message.id, emoji);
                                setShowEmojiPicker(prev => ({ ...prev, [`hover-${message.id}`]: false }));
                              }}
                            >
                              {getEmojiDisplay(emoji)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                {/* Reply Icon */}
                <button
                    className="rounded-full hover:bg-gray-100 p-1"
                  title="Reply to post"
                  onClick={() => onReply?.(message)}
                >
                  <MessageIcon/>
                </button>
              </div>
              {/* Message header */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm text-gray-900">{message.sender.name}</h3>
                {message.sender.isVerified && (
                  <Image src="/chat/verified.svg" alt="Verified" width={18} height={18} />
                )}
                <span className="text-xs text-[#5B657B]">{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {message.sender.badge && (
                  <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs">
                    {getRolesIcon(message.sender.badge)}
                    <span>{message.sender.badge}</span>
                  </span>
                )}
                <span className="text-xs text-[#5B657B] bg-[#F5FAFF] rounded-md px-2 py-1 inline-flex items-center gap-2">
                  {message.sender.country
                    ? getFlagImgForCountry(message.sender.country)
                    : null}
                  <span>{message.sender.location}</span>
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-7 mb-1">{message.content}</p>
              {/* Reactions */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center  px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm">
                    {/* Display reactions from API */}
                    {message?.reactions && message.reactions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        onClick={() => handleAddEmojiReaction(message.id, reaction.emoji)}
                      >
                        <span>{getEmojiDisplay(reaction.emoji)}</span>
                        {/* <span className="text-gray-600 text-xs">{reaction.count}</span> */}
                      </button>
                    ))}
                    {message?.reactions && message.reactions.length > 0 && (
                      <span className="text-gray-600 text-xs">
                        {message.reactions.reduce((sum, r) => sum + r.count, 0)}
                      </span>
                    )}
                  </div>
                  
                  {/* Like button */}
                  {/* { message.reactions && ( */}
                    <button
                      className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm"
                      onClick={() => handleToggleLike(message.id)}
                    >
                      <Image src="/chat/heart.png" alt="Like" width={14} height={14} />
                      <span className="text-gray-600 text-xs">{message.likeCount || 0}</span>
                    </button>
                  {/* )} */}
              </div>
              {/* Reply card if exists */}
              {message.replyTo && (
                  <div className=" flex mt-2 w-full">

                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.83398 3.83594V5.1776C3.83398 8.39791 3.83398 10.0081 4.4607 11.238C5.01197 12.32 5.89161 13.1996 6.97354 13.7509C8.20353 14.3776 9.81368 14.3776 13.034 14.3776H19.1673M19.1673 14.3776L14.3757 9.58594M19.1673 14.3776L14.3757 19.1693" stroke="#1F293E" stroke-width="1.725" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <div className="flex items-start w-full ml-2 gap-3 bg-white border border-blue-50 rounded-lg p-3">
                    <div className="flex-shrink-0 w-10 h-10 relative">
                      <Image
                        src={message.replyTo.sender.avatar}
                        alt={message.replyTo.sender.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm text-gray-900">{message.replyTo.sender.name}</h3>
                        {message.replyTo.sender.isVerified && (
                          <Image src="/chat/verified.svg" alt="Verified" width={18} height={18} />
                        )}
                        <span className="text-xs text-[#5B657B]">{new Date(message.replyTo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {message.replyTo.sender.badge && (
                          <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs">
                            {getRolesIcon(message.replyTo.sender.badge)}
                            <span>{message.replyTo.sender.badge}</span>
                          </span>
                        )}
                        <span className="text-xs text-[#5B657B] bg-[#F5FAFF] rounded-md px-2 py-1 inline-flex items-center gap-2">
                          {message.replyTo.sender.country
                            ? getFlagImgForCountry(message.replyTo.sender.country)
                            : null}
                          <span>{message.replyTo.sender.location}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-7 mb-1">{message.replyTo.content}</p>
                        {/* Reactions for reply message */}
                        <div className="flex items-center gap-2 mt-2">
                          {/* {messageReactions[message.replyTo.id] && messageReactions[message.replyTo.id].reactions &&
                            messageReactions[message.replyTo.id].reactions.map(({ emoji, count }: { emoji: string, count: number }) => (
                              <button
                                key={emoji}
                                className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-xs"
                                onClick={() => handleAddEmojiReaction(message.replyTo.id, emoji)}
                              >
                                <span>{getEmojiDisplay(emoji)}</span>
                                <span className="text-gray-600 text-xs">{count}</span>
                              </button>
                            ))}
                          {messageReactions[message.replyTo.id] && messageReactions[message.replyTo.id].likeCount > 0 && (
                            <button
                              className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-xs"
                              onClick={() => handleToggleLike(message.replyTo.id)}
                            >
                              <span role="img" aria-label="like">👍</span>
                              <span className="text-gray-600 text-xs">{messageReactions[message.replyTo.id].likeCount}</span>
                            </button>
                          )} */}
                          {/* Add new reaction button for reply */}
                          {/* <button
                            className="flex items-center space-x-1 px-1 py-1 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded-full text-xs"
                            onClick={() => handleAddEmojiReaction(message.replyTo.id, 'like')}
                          >
                            <span role="img" aria-label="add reaction">➕</span>
                          </button> */}
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          ))
        )}
      </div>
      {/* Replying to */}
      {replyingTo && (
        <div className="px-8 py-2 mx-4 bg-omblue-50 rounded-t-lg flex items-center gap-2">
          <span className="text-sm text-blue-600">
            Replying to <b>{replyingTo.sender.name}</b>: <span className="text-gray-500">{replyingTo.content}</span>
          </span>
          <button className="ml-auto text-xs text-blue-400" onClick={() => onReply?.(undefined)}>X</button>
        </div>
      )}

      {/* Input field always at bottom */}
      <div className="w-full bg-gray-50 border border-gray-200 p-4 shadow-lg rounded-lg sticky bottom-0">
        {file && (
          <FileCard
            isSent={false}
            isUploading={loaderImage}
            fileName={file.name}
            fileSize={
              file.size
                ? `${(file.size / 1024).toFixed(2)} KB`
                : 'Unknown size'
            }
            fileType={file.type || 'Unknown type'}
            fileUrl={URL.createObjectURL(file)}
            fileUploadingProgress={fileUploadingProgress}
            handleRemoveAttachment={handleRemoveAttachment}
          />
        )}
        <div className="flex items-center gap-3">
          <div className="flex w-10 h-10 relative">
            <input
              type="file"
              onChange={handleAttachmentChange}
              className=" w-0 absolute top-0 left-0 opacity-0"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="p-2 text-blue-500 cursor-pointer"
            >
              <AttachFileIcon className="cursor-pointer 3xl:min-h-full 3xl:w-auto" />
            </label>
          </div>
          <div className="w-full flex flex-col gap-2 justify-start items-start">
            <textarea
              placeholder="Type your message"
              className={`flex-1 w-full bg-transparent text-gray-700 outline-none text-sm font-medium resize-none ${/^[\p{Emoji}]+$/u.test(newMessage) ? '!text-2xl' : 'text-sm'
                }`}
              rows={1}
              value={newMessage}
              onChange={handleMessageChange}
            />
          </div>
          <div className="flex gap-5 items-center divide-x">
            <div className="flex gap-5 items-center">
              <EmojiPicker handleEmojiSelector={handleEmojiSelector} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAttachmentChange}
                className="w-0 absolute top-0 left-0 opacity-0"
                id="photoInput"
              />
              <label
                htmlFor="photoInput"
                className="text-blue-500 cursor-pointer"
              >
                <PhotoIcon className="cursor-pointer 3xl:min-h-full 3xl:w-auto" />
              </label>
            </div>
            <span className="pl-5">
              <button
                className="p-2 w-10 h-10 bg-[#2357C6] text-white rounded"
                onClick={handleSendMessage}
              >
                <SendMessageIcon className=" 3xl:min-h-full 3xl:w-auto" />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalChatDetail;
