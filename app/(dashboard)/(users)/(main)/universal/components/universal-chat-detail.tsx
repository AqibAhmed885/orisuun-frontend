import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';
import { AttachFileIcon, SendMessageIcon } from '@/icons/chats/textarea-icons';
import EmojiPicker from '@/components/ui/emoji-picker';
import { PhotoIcon } from '@heroicons/react/24/solid';
import MessageIcon from '@/icons/message-icon';
import axios from 'axios';
import MessageShimmer from '../../chats/components/messageShimmer';
import { toast } from 'react-toastify';

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
  attachment?: string | null;
  documents?: any[];
  lastActive?: string;
  time: string; // ISO string
  content: string;
  reactions?: { emoji: string; count: number }[];
  replyTo?: Message;
  date: string; // e.g. "JUN 06"
  likeCount?: number; // Add likeCount property
  Reactions?: {
    ChatId: string;
    TotalReactions: number;
    LikesCount: number;
    EmojiReactions: any[];
    Reactions: any[];
  };
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
  IsVerified: boolean;
  LastActive: string;
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
  SenderCity?: string;
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

function transformSocketMessage(socketMsg: any): Message {
  try {

    // Handle property variations (e.g., casing or missing fields)
    const id = socketMsg.id || socketMsg.Id || `temp-${Date.now()}`;
    const senderName = socketMsg.senderName || socketMsg.SenderName || 'Unknown';
    const senderProfilePicture = socketMsg.senderProfilePicture || socketMsg.SenderProfilePicture || '/chat/user-avatar.png';
    const senderUserType = socketMsg.senderUserType || socketMsg.SenderUserType || '';
    const senderCity = socketMsg.senderCity || socketMsg.SenderCity || '';
    const senderCountry = socketMsg.senderCountry || socketMsg.SenderCountry || '';
    const isVerified = socketMsg.isVerified !== undefined ? socketMsg.isVerified : socketMsg.IsVerified || false;
    const message = socketMsg.message || socketMsg.Message || '';
    const attachmentUrl = socketMsg.attachmentUrl || socketMsg.AttachmentUrl || null;
    const createdAt = socketMsg.createdAt || socketMsg.CreatedAt || new Date().toISOString();
    const documents = socketMsg.documents || socketMsg.Documents || [];
    const lastActive = socketMsg.lastActive || socketMsg.LastActive || '';

    // Handle reactions safely
    const reactions = socketMsg.reactions?.emojiReactions || socketMsg.Reactions?.EmojiReactions || [];
    const emojiReactions = reactions.map((reaction: any) => ({
      emoji: reaction.Emoji || reaction.emoji || '👍',
      count: reaction.Count || reaction.count || 0
    }));

    return {
      id,
      sender: {
        name: senderName,
        avatar: senderProfilePicture,
        badge: senderUserType,
        location: senderCity,
        isVerified,
        country: senderCountry,
      },
      time: createdAt,
      content: message,
      attachment: attachmentUrl,
      documents,
      lastActive,
      reactions: emojiReactions,
      likeCount: socketMsg.reactions?.likesCount || socketMsg.Reactions?.LikesCount || 0,
      replyTo: undefined,  // Handle replies if needed
      date: formatDate(createdAt),
    };
  } catch (error) {
    console.error('Error in transformSocketMessage:', error, socketMsg);
    // Return a fallback message to prevent crashes
    return {
      id: `error-${Date.now()}`,
      sender: { name: 'Error', avatar: '/chat/user-avatar.png', badge: '', location: '', isVerified: false, country: '' },
      time: new Date().toISOString(),
      content: 'Message could not be loaded.',
      attachment: null,
      documents: [],
      lastActive: '',
      reactions: [],
      likeCount: 0,
      replyTo: undefined,
      date: formatDate(new Date().toISOString()),
    };
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
}
type FileType =
  | 'image'
  | 'pdf'
  | 'audio'
  | 'webp'
  | 'webm'
  | 'video'
  | 'zip'
  | 'heic'
  | 'csv'
  | 'document'
  | 'excel'
  | 'powerpoint'
  | 'ics'
  | 'html'
  | 'figma'
  | 'gif'
  | 'email'
  | 'adobe'

const getFileType = (fileName: string | undefined): FileType => {

  if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) return 'image';
  if (fileName.endsWith('.pdf')) return 'pdf';
  if (fileName.endsWith('.mp3')) return 'audio';
  if (fileName.endsWith('.webp')) return 'webp';
  if (fileName.endsWith('.webm')) return 'webm';
  if (fileName.endsWith('.mp4')) return 'video';
  if (fileName.endsWith('.zip')) return 'zip';
  if (fileName.endsWith('.heic')) return 'heic';
  if (fileName.endsWith('.csv')) return 'csv';
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'document';
  if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return 'excel';
  if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return 'powerpoint';
  if (fileName.endsWith('.ics')) return 'ics';
  if (fileName.endsWith('.html')) return 'html';
  if (fileName.endsWith('.fig')) return 'figma';
  if (fileName.endsWith('.gif')) return 'gif';
  if (fileName.endsWith('.email')) return 'email';
  if (fileName.match(/\.(ai|psd|indd)$/)) return 'adobe';
};

import { ChatNavigation } from '@/app/(dashboard)/(users)/(main)/communities/components/chat-navigation';
import { useRouter } from 'next/navigation';
import { checkOnlineStatus, showTimeStatus } from '@/utils/helper';
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import FileCard from '../../chats/components/file-card';
import { Smile } from 'react-feather';
import { uploadFileToAzure } from '@/app/api/dashboard/azure-upload';
import { chatApi } from '@/app/api/dashboard/chats';
import { signalRService } from '../../chats/components/signalRService';

const isImageUrl = (url?: string | null) => {
  if (!url || typeof url !== 'string') return false;
  return /\.(jpe?g|png|gif|webp|bmp|svg|heic)(\?.*)?$/i.test(url);
};

const UniversalChatDetail: React.FC<UniversalChatDetailProps> = ({
  onSend,
  replyingTo,
  onReply,
  communityId,
  currentUserId,
}) => {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const handleViewChange = (view: 'chats' | 'community' | 'universal') => {
    switch (view) {
      case 'community':
        router.push('/communities');
        break;
      case 'chats':
        router.push('/chats');
        break;
      case 'universal':
        router.push('/universal');
        break;
    }
  };
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loaderImage, setLoaderImage] = useState(false);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<Record<string, boolean>>({});
  const [countryFlags, setCountryFlags] = useState<Record<string, string>>({});

  // Function to transform API response to Message interface
  const transformCommunityMessage = (apiMessage: CommunityMessage): Message => {

    // Handle replies - if this message has replies, transform the first reply as replyTo
    const replyTo = apiMessage.Replies && apiMessage.Replies.length > 0 ? {
      id: apiMessage.Replies[0].Id,
      sender: {
        name: apiMessage.Replies[0].SenderName,
        avatar: apiMessage.Replies[0].SenderProfilePicture || '/chat/user-avatar.png',
        badge: apiMessage.Replies[0].SenderUserType,
        location: apiMessage.Replies[0].SenderCity,
        isVerified: false,
        country: apiMessage.Replies[0].SenderCountry,
      },
      time: apiMessage.Replies[0].CreatedAt,
      content: apiMessage.Replies[0].Message,
      lastActive: apiMessage.Replies[0].LastActive,
      attachment: apiMessage.Replies[0].AttachmentUrl,
      documents: apiMessage.Replies[0].Documents,
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
        location: apiMessage.SenderCity,
        isVerified: true, // You can adjust this based on your logic
        country: apiMessage.SenderCountry,
      },
      time: apiMessage.CreatedAt,
      content: apiMessage.Message,
      attachment: apiMessage.AttachmentUrl,
      documents: apiMessage.Documents,
      lastActive: apiMessage.LastActive,
      reactions: apiMessage.Reactions?.EmojiReactions?.map(reaction => ({
        emoji: reaction.Emoji || '👍',
        count: reaction.Count || 0
      })) || [],
      likeCount: apiMessage.Reactions?.LikesCount || 0, // <-- Add this line
      replyTo: replyTo,
      date: formatDate(apiMessage.CreatedAt),
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll bottom jab messages load ya update ho
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Scroll bottom jab initial loading khatam ho jaye
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [isLoading]);

  // Fetch community messages from API
  const fetchCommunityMessages = useCallback(async () => {
    if (!communityId) return;

    setIsLoading(true);
    try {
      const response = await chatApi.getCommunityMessages(communityId);

      

      if (response.StatusCode === 200) {
        const apiMessages: CommunityMessage[] = response.Result || [];

        
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

  // Emoji picker logic
  const handleEmojiSelector = (emoji: string) => {
    const actualEmoji = String.fromCodePoint(parseInt(emoji, 16));
    setNewMessage(prev => prev + actualEmoji);
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

      let uploadResult;
      if (file) {
        setLoaderImage(true);
        // pass progress callback to uploader so setFileUploadingProgress updates during upload
        uploadResult = await uploadFileToAzure(file, 'chat-documents', (percent: number) => {
          setFileUploadingProgress(percent); // 0 - 100
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file');
        }
      }

      // Clear form immediately for better UX
      setNewMessage('');  // <-- Add this to clear the textarea
      setFile(null);
      setFileUploadingProgress(0);

      // clear the file input elements so user can re-select same file later
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';

      // Replace the existing messageData creation with this
      const messageData: any = {
        CommunityId: communityId,
        SenderId: currentUserId,
        Message: newMessage.trim(),
        AttachmentUrl: null,
        ChatDocument: undefined,
        ParentMessageId: replyingTo ? replyingTo.id : null,
      };

      if (uploadResult && uploadResult.url) {
        const uploadedUrl = uploadResult.url;
        if (isImageUrl(uploadedUrl)) {
          // store images in AttachmentUrl for inline preview
          messageData.AttachmentUrl = uploadedUrl;
        } else {
          // store non-images in ChatDocument
          messageData.ChatDocument = {
            Document: uploadedUrl,
            FileName: uploadResult.fileName || file?.name || uploadedUrl.split('/').pop(),
            Size: uploadResult.size ?? file?.size,
            CreatedDate: new Date().toISOString(),
          };
        }
      }

      
      // const payload = {
      //   CommunityId: communityId,
      //   TopicId: null,
      //   SenderId: currentUserId,
      //   Message: newMessage.trim(),
      //   AttachmentUrl: null, // TODO: Handle file upload if needed
      //   ParentMessageId: replyingTo ? replyingTo.id : null, // Set parent if replying
      //   ChatDocument: null // TODO: Handle document upload if needed
      // };


      const response = await chatApi.sendCommunityMessage(messageData);
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
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

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
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };


  useEffect(() => {
    const uniqueCountries = [...new Set(messages.map(msg => msg.sender.country).filter(Boolean))];
    uniqueCountries.forEach(country => {
      if (!countryFlags[country]) {  // Only fetch if not already fetched
        let isMounted = true;
        leaderboard.fetchCountryFlag(country).then(url => {
          if (isMounted) {
            setCountryFlags(prev => ({ ...prev, [country]: url }));
          }
        }).catch(err => {
          console.error(`Failed to fetch flag for ${country}:`, err);
        });
        return () => { isMounted = false; };
      }
    });
  }, [messages, countryFlags]);

  // SignalR integration
  useEffect(() => {
    let isMounted = true;

    const initSignalR = async () => {
      try {
        await signalRService.startConnection(currentUserId);
        if (communityId) {
          await signalRService.joinGroup(`Community_${communityId}`);
        }

        // Listen for new messages
        signalRService.onReceiveCommunityMessage((socketMsg) => {
          const newMsg = transformSocketMessage(socketMsg);
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        });

        // Like toggled event (update only the affected message)
        signalRService.onLikeToggled((eventData) => {
          

          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              

              if (msg.id === eventData.chatId) {
                let updatedLikeCount = msg.likeCount || 0;

                if (eventData.isLike) {
                  updatedLikeCount += 1;
                } else {
                  updatedLikeCount = Math.max(0, updatedLikeCount - 1);
                }

                return {
                  ...msg,
                  likeCount: updatedLikeCount,
                };
              }

              return msg;
            })
          );
        });



        // Emoji added event (update only the affected message)
        signalRService.onEmojiAdded((data) => {
          

          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              if (msg.id === data.chatId) {
                let newReactions = [...(msg.Reactions?.Reactions || [])];
                let newEmojiReactions = [...(msg.Reactions?.EmojiReactions || [])];
                let totalReactions = msg.Reactions?.TotalReactions || 0;

                // Normalize casing (important if backend sends UserId vs userId)
                const normalizeId = (id: string) => id.toLowerCase();
                const existingReaction = newReactions.find(
                  (r: any) => normalizeId(r.UserId) === normalizeId(data.userId)
                );

                if (existingReaction) {
                  // User changes emoji
                  const oldEmoji = existingReaction.Emoji;
                  existingReaction.Emoji = data.emoji;

                  // Decrement old emoji count
                  const oldEmojiIndex = newEmojiReactions.findIndex(
                    (er: any) => er.Emoji === oldEmoji
                  );
                  if (oldEmojiIndex >= 0) {
                    newEmojiReactions[oldEmojiIndex].Count -= 1;
                    if (newEmojiReactions[oldEmojiIndex].Count <= 0) {
                      newEmojiReactions.splice(oldEmojiIndex, 1);
                    }
                  }

                  // Increment new emoji count
                  const newEmojiIndex = newEmojiReactions.findIndex(
                    (er: any) => er.Emoji === data.emoji
                  );
                  if (newEmojiIndex >= 0) {
                    newEmojiReactions[newEmojiIndex].Count += 1;
                  } else {
                    newEmojiReactions.push({ Emoji: data.emoji, Count: 1 });
                  }

                  // Total reactions unchanged
                } else {
                  // Add new reaction
                  newReactions.push({ UserId: data.userId, Emoji: data.emoji });

                  // Increment emoji count safely
                  const emojiIndex = newEmojiReactions.findIndex(
                    (er: any) => er.Emoji === data.emoji
                  );
                  if (emojiIndex >= 0) {
                    newEmojiReactions[emojiIndex].Count += 1;
                  } else {
                    newEmojiReactions.push({ Emoji: data.emoji, Count: 1 });
                  }

                  totalReactions += 1;
                }

                return {
                  ...msg,
                  Reactions: {
                    ...msg.Reactions,
                    EmojiReactions: newEmojiReactions,
                    Reactions: newReactions,
                    TotalReactions: totalReactions,
                  },
                  // Keep UI-friendly reactions array in sync
                  reactions: newEmojiReactions.map((er) => ({
                    emoji: er.Emoji,
                    count: er.Count,
                  })),
                };
              }
              return msg;
            })
          );
        });


      } catch (err) {
        console.error('SignalR error:', err);
      }
    };

    initSignalR();

    return () => {
      isMounted = false;

      signalRService.offReceiveCommunityMessage();
      signalRService.offLikeToggled();
      signalRService.offEmojiAdded();
    };
  }, [communityId, currentUserId]);

  return (
    <div className="flex flex-col h-full tracking-wide rounded-md">
      {/* Message area */}
      <div className="flex-1 relative   bg-white shadow-xl  rounded-lg">
        <div className=' w-full p-2 border-b border-gray-200 rounded-lg bg-white z-10 items-center flex '>
          <ChatNavigation
            selectedView="universal"
            chatsCount={0}
            onViewChange={handleViewChange}
          />
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-240px)]">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <MessageShimmer key={idx} />
            ))
          ) : (
              (() => {
                let lastDate = '';
                return messages.map((message, idx) => {
                  const currentDate = formatDate(message.time);
                  const showDivider = currentDate !== lastDate;
                  lastDate = currentDate;
                  return (
                    <React.Fragment key={message.id}>
                      {showDivider && (
                        <div className="flex items-center justify-center my-6">
                          <div className='border-b border-gray-200 w-full' />
                          <span className="px-6 py-1  text-gray-400 text-nowrap rounded-full text-xs font-semibold tracking-wide">
                            {currentDate}
                          </span>
                          <div className='border-b border-gray-200 w-full' />

                        </div>
                      )}
                      <div
                        className="flex space-x-3 hover:bg-[#F6F9FF] tracking-wide p-2 rounded-lg group relative"
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
                          {checkOnlineStatus(message.lastActive) === 'online' ? (
                            <div className="absolute right-0 bottom-0 bg-green-500 rounded-full w-2.5 h-2.5 text-green-600 ring-2 ring-white inline-block font-semibold">
                              {/* <p>Active</p> */}
                            </div>
                          ) : (
                            <div className="absolute right-0 ring-2 ring-white bottom-0 bg-gray-500 rounded-full w-2.5 h-2.5 text-white inline-block font-semibold">
                              {/* <p>{checkOnlineStatus(message.lastActive)}</p> */}
                            </div>
                          )}
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
                              <MessageIcon />
                            </button>
                          </div>
                          {/* Message header */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-sm text-gray-900">{message.sender.name}</h3>
                            {message.sender.isVerified && (
                              <Image src="/chat/verified.svg" alt="Verified" width={18} height={18} />
                            )}
                            <span className="text-xs text-[#5B657B]">{showTimeStatus(message.time)}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {message.sender.badge && (
                              <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                                {getRolesIcon(message.sender.badge)}
                                <span>{message.sender.badge}</span>
                              </span>
                            )}
                            {message.sender.country && (
                              <span className="flex text-sm font-medium items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-md">
                                {countryFlags[message.sender.country] && (  // Use the fetched flag URL
                                  <Image
                                    src={countryFlags[message.sender.country]}
                                    alt={message.sender.country}
                                    width={80}
                                    height={80}
                                    className="rounded-[3px] w-5 h-4 object-full"
                                  />
                                )}
                                {message.sender.location}
                              </span>
                            )}
                          </div>

                          {message.attachment && (
                            <div className="mt-3">
                              <FileCard
                                isSent={true}
                                fileName={'File'}
                                fileSize={'Unknown size'}
                                fileType={getFileType(message.attachment)}
                                fileUrl={message.attachment}
                              />
                            </div>
                          )}

                          {message.documents && message.documents.length > 0 && (
                            <div className="mt-3">
                              {message.documents.map((doc, index) => (
                                <FileCard
                                  key={index}
                                  isSent={true}
                                  fileName={doc.FileName}
                                  fileSize={doc.Size !== undefined ? String(doc.Size) : undefined}
                                  fileType={getFileType(doc.FileName || doc.Document)}
                                  fileUrl={doc.Document}
                                />
                              ))}
                            </div>
                          )}
                          {/* Message text */}
                          <p className="text-base font-medium text-gray-800 leading-7 mb-1">{message.content}</p>
                          {/* Reactions */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center  px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm">
                              {/* Display reactions from API */}
                              {message?.reactions && message.reactions.length > 0 ? (
                                <>
                                  {message.reactions.map((reaction) => (
                                    <button
                                      key={reaction.emoji}
                                      onClick={() => handleAddEmojiReaction(message.id, reaction.emoji)}
                                    >
                                      <span>{getEmojiDisplay(reaction.emoji)}</span>
                                    </button>
                                  ))}
                                  <span className="text-gray-600 text-xs">
                                    {message.reactions.reduce((sum, r) => sum + r.count, 0)}
                                  </span>
                                </>
                              ) : (

                                <Smile size={16} className="text-gray-400 hover:text-gray-600" />
                              )}
                            </div>

                            {/* Like button */}
                            {message.reactions && (
                              <button
                                className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm"
                                onClick={() => handleToggleLike(message.id)}
                              >
                                <Image src="/chat/heart.png" alt="Like" width={12} height={12} />
                                <span className="text-gray-600 text-xs">{message.likeCount || 0}</span>
                              </button>
                            )}
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
                                  {checkOnlineStatus(message.replyTo.lastActive) === 'online' ? (
                                    <div className="absolute right-0 bottom-0 bg-green-500 rounded-full w-2.5 h-2.5 text-green-600 ring-2 ring-white inline-block font-semibold">
                                      {/* <p>Active</p> */}
                                    </div>
                                  ) : (
                                    <div className="absolute right-0 ring-2 ring-white bottom-0 bg-gray-500 rounded-full w-2.5 h-2.5 text-white inline-block font-semibold">
                                      {/* <p>{checkOnlineStatus(profileData.LastActive)}</p> */}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-base text-gray-900">{message.replyTo.sender.name}</h3>
                                    {message.replyTo.sender.isVerified && (
                                      <Image src="/chat/verified.svg" alt="Verified" width={18} height={18} />
                                    )}
                                    <span className="text-xs text-[#5B657B]">{new Date(message.replyTo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    {message.replyTo.sender.badge && (
                                      <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                                        {getRolesIcon(message.replyTo.sender.badge)}
                                        <span>{message.replyTo.sender.badge}</span>
                                      </span>
                                    )}

                                    {message.replyTo.sender.country && (
                                      <span className="flex text-sm font-medium items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-md">
                                        {countryFlags[message.replyTo.sender.country] && (
                                          <Image
                                            src={countryFlags[message.replyTo.sender.country]}
                                            alt={message.replyTo.sender.country}
                                            width={80}
                                            height={80}
                                            className="rounded-[3px] w-5 h-4 object-full"
                                          />
                                        )}
                                        {message.replyTo.sender.location}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-base font-medium text-gray-800 leading-7 mb-1">{message.replyTo.content}</p>
                                  {/* Reactions for reply message */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center  px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm">
                                      {/* Display reactions from API */}
                                      {message?.replyTo.reactions && message.replyTo.reactions.length > 0 ? (
                                        <>
                                          {message.replyTo.reactions.map((reaction) => (
                                            <button
                                              key={reaction.emoji}
                                              onClick={() => handleAddEmojiReaction(message.id, reaction.emoji)}
                                            >
                                              <span>{getEmojiDisplay(reaction.emoji)}</span>
                                            </button>
                                          ))}
                                          <span className="text-gray-600 text-xs">
                                            {message.reactions.reduce((sum, r) => sum + r.count, 0)}
                                          </span>
                                        </>
                                      ) : (

                                        <Smile size={14} className="text-gray-400 hover:text-gray-600" />
                                      )}
                                    </div>
                                    {message.replyTo.reactions && (
                                      <button
                                        className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm"
                                        onClick={() => handleToggleLike(message.replyTo.id)}
                                      >
                                        <Image src="/chat/heart.png" alt="Like" width={14} height={14} />
                                        <span className="text-gray-600 text-xs">{message.replyTo.likeCount || 0}</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                });
              })()
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>


      {/* Input field always at bottom */}
      <div className="w-full bg-white mt-6 p-4 shadow-xl rounded-lg sticky bottom-0">
        {/* Replying to */}
        {replyingTo && (
          <div className="px-4 py-2 rounded-t-lg flex items-center gap-2">
            <span className="text-sm text-blue-600">
              Replying to <b>{replyingTo.sender.name}</b>: <span className="text-gray-500">{replyingTo.content}</span>
            </span>
            <button className="ml-auto text-xs text-blue-400" onClick={() => onReply?.(undefined)}>X</button>
          </div>
        )}
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
            fileType={getFileType(file.name)}
            fileUrl={URL.createObjectURL(file)}
            fileUploadingProgress={fileUploadingProgress}
            handleRemoveAttachment={handleRemoveAttachment}
          />
        )}
        <div className="flex items-center gap-3">
          <div className="flex w-10 h-10 relative">
            <input
              type="file"
              ref={fileInputRef}
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
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <div className="flex gap-5 items-center divide-x">
            <div className="flex gap-5 items-center">
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
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
