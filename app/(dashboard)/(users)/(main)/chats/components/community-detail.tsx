import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import FileCard from './file-card';
import EmojiPicker from '../../../../../../components/ui/emoji-picker';
import {
  AttachFileIcon,
  PhotoIcon,
  SendMessageIcon,
} from '@/icons/chats/textarea-icons';
import TrendingCommunities from './trending-communities';
import getRolesIcon from '@/icons/chats/role-icons';
import { chatApi } from '@/app/api/dashboard/chats';
import { showTimeStatus } from '@/utils/helper';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import Linkify from 'react-linkify';
import { Loader } from './loader';
import moment from 'moment-timezone';
import CommunityProfile from './community-profile';
import MessageShimmer from './messageShimmer';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Community {
  id: string;
  name: string;
  avatar: string;
  lastSender: string;
  lastMessage: string;
  time: string;
  isVerified: boolean;
}

interface CommunityMessage {
  Id: string;
  CommunityId: string;
  TopicId?: string;
  SenderId: string;
  SenderName: string;
  SenderProfilePicture?: string;
  SenderUserType?: string;
  SenderCountry?: string;
  SenderLocation?: string;
  Message: string;
  AttachmentUrl?: string;
  CreatedAt: string;
  Documents: any[];
}

interface CommunityDetailProps {
  community: Community | null;
  isMobile?: boolean;
  onBack?: () => void;
  newMessage?: string;
  handleMessageChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  file?: File | null;
  loaderImage?: boolean;
  handleRemoveAttachment?: () => void;
  handleAttachmentChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage?: () => void;
  handleKeyPress?: (e: React.KeyboardEvent) => void;
  fileUploadingProgress?: number;
  handleEmojiSelector?: (emojiCode: string) => void;
  currentUserId?: string;
}

const CommunityDetail: React.FC<CommunityDetailProps> = ({
  community,
  isMobile = false,
  onBack,
  newMessage = '',
  handleMessageChange,
  file,
  loaderImage = false,
  handleRemoveAttachment,
  handleAttachmentChange,
  handleSendMessage: originalHandleSendMessage,
  handleKeyPress: originalHandleKeyPress,
  fileUploadingProgress = 0,
  handleEmojiSelector,
  currentUserId = '',
}) => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [internalMessage, setInternalMessage] = useState(newMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch community messages
  const fetchCommunityMessages = async (pageNumber = 1, reset = false) => {
    if (isLoading || !community?.id) return;
    setIsLoading(true);
    try {
      const response = await chatApi.getCommunityMessages(community.id, pageNumber, 50);
      if (response.StatusCode === 200) {
        const newMessages = response.Result || [];
        if (reset) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...prev, ...newMessages]);
        }
        setHasMoreMessages(newMessages.length === 50);
      }
    } catch (error) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Send community message
  const handleSendMessage = async () => {
    if (!internalMessage.trim() && !file) return;
    if (!currentUserId || !community?.id) return;

    try {
      const messageData = {
        CommunityId: community.id,
        SenderId: currentUserId,
        Message: internalMessage.trim(),
        AttachmentUrl: file ? 'pending_upload' : undefined,
        ChatDocument: file ? {
          Document: await convertFileToBase64(file),
          FileName: file.name,
          Size: file.size,
          CreatedDate: new Date().toISOString(),
        } : undefined,
      };

      const response = await chatApi.sendCommunityMessage(messageData);

      if (response.StatusCode === 200 || response.StatusCode === 201) {
        setInternalMessage('');
        if (handleRemoveAttachment) handleRemoveAttachment();
        // Refresh messages to show the new one
        fetchCommunityMessages(1, true);
      }
    } catch (error) {
      console.error('Failed to send community message:', error);
    }

    // Also call original handler if provided
    if (originalHandleSendMessage) {
      originalHandleSendMessage();
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    if (originalHandleKeyPress) {
      originalHandleKeyPress(e);
    }
  };

  // Handle message change
  const handleInternalMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalMessage(e.target.value);
    if (handleMessageChange) {
      handleMessageChange(e);
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:type;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    if (community?.id) {
      fetchCommunityMessages(1, true);
    }
  }, [community?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync external message with internal state
  useEffect(() => {
    setInternalMessage(newMessage);
  }, [newMessage]);


  const getFlagEmojiFromLocation = (location?: string) => {
    if (!location) return '';
    const l = location.toLowerCase();
    // common US cities / states
    if (/(atlanta|new york|los angeles|san francisco|miami|chicago|houston|phoenix|philadelphia|usa|us|\bga\b|\bny\b|ca\b)/i.test(l)) return '🇺🇸';
    if (/(london|manchester|uk|england|gb)/i.test(l)) return '🇬🇧';
    if (/(toronto|vancouver|canada|ca)/i.test(l)) return '🇨🇦';
    if (/(lagos|abuja|nigeria)/i.test(l)) return '🇳🇬';
    if (/(kenya|nairobi)/i.test(l)) return '🇰🇪';
    // fallback globe
    return '🌍';
  };
  const countryNameToCode: Record<string, string> = {
    'united states': 'us',
    'pakistan': 'pk',
    'canada': 'ca',
    'united kingdom': 'gb',
    'nigeria': 'ng',
    'kenya': 'ke',
    'ghana': 'gh',
    // Add more as needed
  };
  const getFlagImgForCountry = (country?: string) => {
    if (!country) return null;
    const cc = countryNameToCode[country.trim().toLowerCase()] || country.trim().toLowerCase();
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

  const selectedCommunity = community;


  return (
    <>
      {community ? (
        <>
          <div className={`flex flex-col  w-full lg:w-[54vw]     border-l border-gray-200`}>
            <div className='bg-white h-[100vh] shadow-lg rounded-lg'>
              {/* Header */}
              <div className="flex items-center justify-between p-4 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <button
                      onClick={onBack}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <div className={`w-12 h-12  rounded-xl flex items-center justify-center`}>
                    <Image
                      src={community?.avatar || '/default-community.png'}
                      alt={community?.name || 'Community'}
                      width={80}
                      height={80}
                      className="w-12 h-12 rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = BASE_URL; // Fallback to default image
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold capitalize text-gray-800">{community?.name || 'Community'}</h2>
                    </div>
                    <p className="text-sm text-[#5B657B]">
                      {community?.lastSender}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center space-x-2" ref={dropdownRef}>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="10" r="2" />
                      <circle cx="10" cy="10" r="2" />
                      <circle cx="16" cy="10" r="2" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-10 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          setDropdownOpen(false);
                          // Implement your share logic here
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Community link copied!');
                        }}
                      >
                        Share
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => {
                          setDropdownOpen(false);
                          // Call your leave community modal or handler here

                          // if (typeof openLeaveModal === 'function') openLeaveModal();
                        }}
                      >
                        Leave Community
                      </button>
                    </div>
                  )}
                </div>
              </div>


              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 max-h-[720px] space-y-4">
                {isLoading ? (
                  // Show shimmer while loading
                  <>
                    <MessageShimmer />
                    <MessageShimmer />
                    <MessageShimmer />
                    <MessageShimmer />
                    <MessageShimmer />
                  </>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-2">Be the first to start the conversation!</p>
                  </div>
                ) : ([...messages]
                  .sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime())
                  .map((message) => (
                    <div key={message.Id} className="flex space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 relative">
                        <Image
                          src={message.SenderProfilePicture || BASE_URL} // You can add profile pictures later
                          alt={message.SenderName || 'User'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* online indicator */}
                        <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
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
                          <span className="text-xs text-[#5B657B] bg-[#F5FAFF] rounded-md px-2 py-1 inline-flex items-center gap-2">
                            {message.SenderCountry
                              ? getFlagImgForCountry(message.SenderCountry)
                              : null}
                            <span>{message.SenderCountry}</span>
                          </span>
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
                              className={`break-words text-blue-300 font-medium mb-2 ${/^[\p{Emoji}]+$/u.test(message.Message)
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
                              <FileCard
                                key={index}
                                isSent={true}
                                fileName={doc.FileName || 'Document'}
                                fileSize={doc.Size || 0}
                                fileType="document"
                                fileUrl={doc.Document}
                              />
                            ))}
                          </div>
                        )}

                        {/* reactions placeholder - you can implement this later */}
                        <div className="flex items-center mt-2">
                          <button
                            className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm"
                            onClick={() => handleToggleLike(message.Id)}
                          >
                            <Image src="/chat/heart.png" alt="Like" width={14} height={14} />
                            {/* <span className="text-gray-600 text-xs">{message.Reactions?.LikesCount ?? 0}</span> */}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="w-full mt-6 bg-gray-50 p-4 shadow-lg rounded-lg " onKeyDown={handleKeyPress}>
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
                  fileType={
                    file?.name
                      ? file.name.endsWith('.pdf')
                        ? 'pdf'
                        : file.name.match(/\.(jpg|jpeg|png|gif)$/i)
                          ? 'image'
                          : file.name.endsWith('.mp3')
                            ? 'audio'
                            : file.name.endsWith('.webp')
                              ? 'webp'
                              : file.name.endsWith('.webm')
                                ? 'webm'
                                : file.name.endsWith('.mp4')
                                  ? 'video'
                                  : file.name.endsWith('.zip')
                                    ? 'zip'
                                    : file.name.endsWith('.heic')
                                      ? 'heic'
                                      : file.name.endsWith('.csv')
                                        ? 'csv'
                                        : file.name.endsWith('.doc') ||
                                          file.name.endsWith('.docx')
                                          ? 'document'
                                          : file.name.endsWith('.xls') ||
                                            file.name.endsWith('.xlsx')
                                            ? 'excel'
                                            : file.name.endsWith('.ppt') ||
                                              file.name.endsWith('.pptx')
                                              ? 'powerpoint'
                                              : file.name.endsWith('.ics')
                                                ? 'ics'
                                                : 'other'
                      : 'other'
                  }
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
                    className={`flex-1 w-full bg-transparent text-gray-700 outline-none text-sm font-medium resize-none ${/^[\p{Emoji}]+$/u.test(internalMessage) ? '!text-2xl' : 'text-sm'
                      }`}
                    rows={1}
                    value={internalMessage}
                    onChange={handleInternalMessageChange}
                  />
                </div>
                <div className="flex gap-5 items-center divide-x">
                  <div className="flex gap-5 items-center">
                    <EmojiPicker handleEmojiSelector={(emoji) => {
                      setInternalMessage(prev => prev + emoji);
                      if (handleEmojiSelector) handleEmojiSelector(emoji);
                    }} />
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
                      className="p-2 w-10 h-10 bg-[#2357C6] text-white rounded "
                      onClick={handleSendMessage}
                      disabled={isLoading || (!internalMessage.trim() && !file)}
                    >
                      <SendMessageIcon className=" 3xl:min-h-full 3xl:w-auto" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <CommunityProfile
            community={selectedCommunity}
            isMobile={isMobile}
            onBack={() => { }}
          />
        </>
      ) : (
        <TrendingCommunities />
      )}
    </>
  );
};

export default CommunityDetail;
