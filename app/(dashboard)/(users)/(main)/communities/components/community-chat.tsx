'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CommunityChatCard } from './community-chat-card';
import EmojiPicker from '@/components/ui/emoji-picker';
import {
  AttachFileIcon,
  PhotoIcon,
  SendMessageIcon,
} from '@/icons/chats/textarea-icons';
import { chatApi } from '@/app/api/dashboard/chats';
import { showTimeStatus } from '@/utils/helper';
import { toast } from 'react-toastify';
import FileCard from '../../chats/components/file-card';
import { uploadFileToAzure } from '@/app/api/dashboard/azure-upload';
import MessageShimmer from '../../chats/components/messageShimmer';
import { signalRService } from '../../chats/components/signalRService';
import LeaveGroupModal from './leave-group-modal';
import { communityApi } from '@/app/api/dashboard/community';

interface Props {
  group?: {
    id?: string;
    name?: string;
    description?: string;
    avatar?: string | null;
    lastMessage?: string;
  };
  onViewMembers?: () => void;
  onLeaveGroup?: () => void;
  isMobile?: boolean;
  onBack?: () => void;
  userId?: string;
  userData?: any;
}

const CommunityChat: React.FC<Props> = ({
  group,
  onViewMembers,
  isMobile = false,
  onBack,
  userId,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  // const [fileUploading, setFileUploading] = useState(false);
  const [loaderImage, setLoaderImage] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [replyTo, setReplyTo] = useState<any | null>(null); // State to hold the message being replied to

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
    if (!loading && messages.length > 0) {
      scrollToBottom();
    }
  }, [loading]);

  
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMessages = async () => {
    if (!group?.id) return;
    setLoading(true);
    try {
      const response = await chatApi.getCommunityMessages(group.id);
      if (response.StatusCode === 200) {
        const sortedMessages = (response.Result || []).sort(
          (a: any, b: any) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        );
        setMessages(sortedMessages);
        scrollToBottom();
      }

    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const selectedFile = input.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploadingProgress(0);
      // clear input value so selecting the same file again triggers change
      try { input.value = ''; } catch (err) { /* noop */ }
    }
  };

  const handleRemoveAttachment = () => {
    setFile(null);
    setFileUploadingProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // helper: detect image urls by extension
  const isImageUrl = (url?: string | null) => {
    if (!url || typeof url !== 'string') return false;
    return /\.(jpe?g|png|gif|webp|bmp|svg|heic)(\?.*)?$/i.test(url);
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !file) return;
    if (!group?.id || !userId) return;

    const messageText = text.trim();

    try {
      // First upload file if exists
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
      setText('');
      setFile(null);
      setFileUploadingProgress(0);

      // clear the file input elements so user can re-select same file later
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';

      // Replace the existing messageData creation with this
      const messageData: any = {
        CommunityId: group.id,
        SenderId: userId,
        Message: messageText,
        AttachmentUrl: null,
        ChatDocument: undefined,
        ParentMessageId: replyTo ? (replyTo.Id || replyTo.id) : undefined,
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

      // Send message via API for persistence
      const response = await chatApi.sendCommunityMessage(messageData);
      if (response.StatusCode === 200) {
        setReplyTo(null); // Clear reply state on successful send
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');

      // Restore the message text if sending failed
      setText(messageText);
    } finally {
      setLoaderImage(false);
      // ensure inputs cleared on error/finish
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
      setFileUploadingProgress(0);
    }
  };

  const handleShareGroup = (communityId: string) => {
    const url = `${window.location.origin}/communities?id=${communityId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleReplyToMessage = (message: any) => {
    setReplyTo(message);
    // focus input
    setTimeout(() => inputRef.current?.focus(), 50);
    // You can implement setting a reply state here if needed
  };


  useEffect(() => {

    let isComponentMounted = true;

    const initializeChat = async () => {
      try {
        await signalRService.startConnection(userId);
        if (group?.id) {
          await signalRService.joinGroup(`Community_${group.id}`);
        }
        // Listen for new group messages
        signalRService.onReceiveCommunityMessage((message) => {
          
          const docs = Array.isArray(message.documents)
            ? message.documents
            : message.documents
              ? [message.documents] 
              : [];
          const formatted = {
            Id: message.id,
            CommunityId: message.communityId,
            SenderId: message.senderId,
            SenderName: message.senderName,
            SenderProfilePicture: message.senderProfilePicture,
            SenderUserType: message.senderUserType,
            SenderCountry: message.senderCountry,
            SenderCity: message.senderCity,
            Message: message.message,
            CreatedAt: message.createdAt,
            LastActive: message.lastActive,
            IsOnline: message.isOnline,
            IsVerified: message.isVerified,
            Reactions: {
              ChatId: message.id,
              TotalReactions: message.reactions?.TotalReactions || 0,
              LikesCount: message.reactions?.LikesCount || 0,
              EmojiReactions: message.reactions?.EmojiReactions || [],
              Reactions: message.reactions?.Reactions || []
            },
            AttachmentUrl: message.AttachmentUrl
              ?
              {
                type: message.AttachmentUrl.match(/\.(jpg|jpeg|png|gif)$/)
                  ? 'image'
                  : 'file',
                url: message.AttachmentUrl,
                name: message.AttachmentUrl.split('/').pop(),
                size: message.Size,
              }
              : undefined,
            Documents: docs.map((d: any) => ({
                Document: d.document,
                FileName: d.fileName,
                Size: d.size,
              }))
            ,
            // Array.isArray(message.documents) && message.documents.length > 0
            //   ? {
            //     Document: message.documents.document || message.documents[0].document,
            //     FileName: message.documents.fileName || message.documents[0].fileName,
            //     Size: message.documents.size || message.documents[0].size,
            //   }
            //   : undefined,

            LastActiveText: message.lastActiveText,
            Replies: message.replies,
            ParentMessageId: message.parentMessageId,
            TopicId: message.topicId,
          };

          

          if (!isComponentMounted) return;

          // ✅ Use formatted.CommunityId instead of message.CommunityId
          if (formatted.CommunityId === group?.id) {
            setMessages((prev) => {
              const messageExists = prev.some((m) => m.Id === formatted.Id);
              if (messageExists) {
                return prev;
              }

              const updated = [...prev, formatted];
              return updated;
            });

            scrollToBottom();
          } else {
            console.warn('Received message for different community:', formatted.CommunityId, 'Expected:', group?.id);
          }
        });

        // Fetch initial messages directly here 
        if (isComponentMounted) {
          setLoading(true);
          try {
            const response = await chatApi.getCommunityMessages(group.id!);
            if (response.StatusCode === 200 && isComponentMounted) {
              const sortedMessages = (response.Result || []).sort(
                (a: any, b: any) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
              );
              setMessages(sortedMessages);
              scrollToBottom();
            }
          } catch (error) {
            console.error('Failed to fetch messages:', error);
          } finally {
            if (isComponentMounted) {
              setLoading(false);
            }
          }
        }

        signalRService.onLikeToggled((data) => {
          
          const formatdata = {
            ChatId: data.chatId,
            UserId: data.userId,
            UserName: data.userName,
            IsLike: data.isLike
          };

          // Check if the message exists in the current messages
          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              if (msg.Id === formatdata.ChatId) {
                // Find existing reaction for this user
                const existingReaction = msg.Reactions.Reactions.find((r: any) => r.UserId === formatdata.UserId);
                let newReactions = [...msg.Reactions.Reactions];

                if (formatdata.IsLike) {
                  // Add like if not already present
                  if (!existingReaction) {
                    newReactions.push({ UserId: formatdata.UserId, IsLike: true });
                  }
                } else {
                  // Remove like if present
                  newReactions = newReactions.filter((r: any) => r.UserId !== formatdata.UserId);
                }

                return {
                  ...msg,
                  Reactions: {
                    ...msg.Reactions,
                    LikesCount: newReactions.length, // Update count based on array length
                    Reactions: newReactions // Update the reactions array
                  }
                };
              }
              return msg;
            })
          );
        });

        signalRService.onEmojiAdded((data) => {
          const formatdata = {
            ChatId: data.chatId,
            UserId: data.userId,
            UserName: data.userName,
            Emoji: data.emoji
          };

          // Check if the message exists in the current messages
          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              if (msg.Id === formatdata.ChatId) {
                // Find existing reaction for this user
                const existingReaction = msg.Reactions.Reactions.find((r: any) => r.UserId === formatdata.UserId);
                let newReactions = [...msg.Reactions.Reactions];
                let newEmojiReactions = [...(msg.Reactions.EmojiReactions || [])];
                let totalReactions = msg.Reactions.TotalReactions || 0;

                if (existingReaction) {
                  // User already has a reaction - change emoji
                  const oldEmoji = existingReaction.Emoji;
                  existingReaction.Emoji = formatdata.Emoji;

                  // Update aggregated counts: decrement old emoji, increment new
                  if (oldEmoji !== formatdata.Emoji) {
                    // Decrement old emoji count
                    const oldEmojiIndex = newEmojiReactions.findIndex((er: any) => er.Emoji === oldEmoji);
                    if (oldEmojiIndex >= 0) {
                      newEmojiReactions[oldEmojiIndex].Count -= 1;
                      if (newEmojiReactions[oldEmojiIndex].Count <= 0) {
                        newEmojiReactions.splice(oldEmojiIndex, 1); // Remove if count is 0
                      }
                    }

                    // Increment new emoji count
                    const newEmojiIndex = newEmojiReactions.findIndex((er: any) => er.Emoji === formatdata.Emoji);
                    if (newEmojiIndex >= 0) {
                      newEmojiReactions[newEmojiIndex].Count += 1;
                    } else {
                      newEmojiReactions.push({ Emoji: formatdata.Emoji, Count: 1 });
                    }
                  }
                  // Total reactions stay the same (just changed emoji)
                } else {
                  // Add new reaction
                  newReactions.push({ UserId: formatdata.UserId, Emoji: formatdata.Emoji });

                  // Update aggregated counts: increment new emoji
                  const emojiIndex = newEmojiReactions.findIndex((er: any) => er.Emoji === formatdata.Emoji);
                  if (emojiIndex >= 0) {
                    newEmojiReactions[emojiIndex].Count += 1;
                  } else {
                    newEmojiReactions.push({ Emoji: formatdata.Emoji, Count: 1 });
                  }
                  totalReactions += 1; // Increment total
                }

                return {
                  ...msg,
                  Reactions: {
                    ...msg.Reactions,
                    Reactions: newReactions, // Updated individual reactions
                    EmojiReactions: newEmojiReactions, // Updated aggregated emoji counts
                    TotalReactions: totalReactions // Updated total count
                  }
                };
              }
              return msg;
            })
          );
        });
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };



    initializeChat();

    // Cleanup on unmount
    return () => {
      isComponentMounted = false;
      // Clean up SignalR listeners
      signalRService.offReceiveCommunityMessage();
    };
  }, [group?.id, userId]);

  // determine admin status from community members
  useEffect(() => {
    let mounted = true;
    if (!group?.id || !userId) return;
    (async () => {
      try {
        const resp = await communityApi.getCommunityDetails(group.id);
        // adapt to API shape: try resp.Result else resp
        const members = Array.isArray(resp?.data?.Members) ? resp.data.Members : Array.isArray(resp) ? resp : [];

        if (!mounted) return;
        const amIAdmin = members.some((m: any) => (m.IsAdmin === true || m.isAdmin === true) && (m.UserId === userId || m.Id === userId || m.userId === userId));
        setIsCurrentUserAdmin(!!amIAdmin);
      } catch (err) {
        console.error('Failed to load community members to check admin:', err);
      }
    })();
    return () => { mounted = false; };
  }, [group?.id, userId]);

  // delete handler for a chat message
  const handleDeletePost = async (chatId: string) => {
    if (!chatId) return;
    try {
      // adjust API method name if different in chatApi
      const res = await communityApi.deleteCommunityMessage(chatId);
      // handle both shapes
      if (res?.success === true) {
        await fetchMessages();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error('Delete post failed', err);
      toast.error('Failed to delete post');
    }
  };

  const truncateWords = (s?: string, limit = 30) => {
    if (!s) return '';
    const words = s.trim().split(/\s+/);
    return words.length <= limit ? s : words.slice(0, limit).join(' ') + '…';
  };


  return (
    <div className="flex flex-col h-full rounded-md">
      <div className=" h-[85vh] flex flex-col bg-white shadow-xl rounded-md overflow-hidden">
        {/* Header */}

        <div className="px-6 py-4 border-b flex items-center rounded-t-lg  justify-between">
          <div className="flex items-center gap-3">
            {!isMobile && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">{group?.name}</h2>

              {group?.lastMessage && (
                <p className="text-sm text-gray-500">{truncateWords(group.lastMessage, 25)}</p>
              )}
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="4" cy="10" r="2" />
                <circle cx="10" cy="10" r="2" />
                <circle cx="16" cy="10" r="2" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    onViewMembers?.();
                    handleShareGroup(group?.id);
                  }}
                >
                  Share group
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLeaveModal(true);
                  }}
                >
                  Leave group
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1  overflow-y-auto p-4 space-y-4 rounded-b-lg shadow-xl">
          {loading ? (
            Array.from({ length: messages.length }).map((_, idx) => (
              <MessageShimmer key={idx} />
            ))
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (

              <CommunityChatCard
                key={message.Id}
                id={message.Id}
                name={message.SenderName}
                lastMessage={message.Message}
                avatarUrl={message.SenderProfilePicture}
                time={showTimeStatus(message.CreatedAt)}
                roleBadge={message.SenderUserType}
                locationBadge={message.SenderCountry}
                locationCity={message.SenderCity}
                LastActive={message.LastActive}
                reactions={message.Reactions}
                verified={message.IsVerified}
                isOnline={message.IsOnline}
                attachments={
                  message.AttachmentUrl
                    ? [
                      {
                        type: message.AttachmentUrl.match(/\.(jpg|jpeg|png|gif)$/)
                          ? 'image'
                          : 'file',
                        url: message.AttachmentUrl,
                        name: message.AttachmentUrl.split('/').pop(),
                        size: message.Size,
                      },
                    ]
                    : undefined
                }
                chatDocument={

                  Array.isArray(message.Documents) && message.Documents.length > 0
                    ? {
                      Document: message.Documents[0].Document ?? message.Documents[0].document,
                      FileName: message.Documents[0].FileName ?? message.Documents[0].fileName,
                      Size: message.Documents[0].Size ?? message.Documents[0].size,
                    }
                    : undefined
                }
                currentUserId={userId}
                isUserCommunityAdmin={isCurrentUserAdmin}          // <-- pass admin flag
                onDelete={(chatId: string) => handleDeletePost(chatId)} // <-- pass delete callback
                onReply={(message) => handleReplyToMessage(message)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>


      </div>
      {/* Input area */}
      <div className="bg-white shadow-xl p-3 rounded-lg  mt-6">
        {replyTo && (
          <div className="mb-2 flex items-center justify-between bg-gray-50 border rounded p-2">
            <div className="text-sm text-gray-700">
              Replying to <span className="font-semibold">{replyTo.name}</span>: <span className="text-gray-500 truncate" style={{ maxWidth: 400 }}>{replyTo.lastMessage}</span>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-700" onClick={() => setReplyTo(null)}>Cancel</button>
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

        <div className="relative flex items-center gap-2 bg-white rounded-lg p-2">
          <input
            type="file"
            onChange={handleAttachmentChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="p-1.5 text-gray-500 hover:text-gray-700 cursor-pointer">
            <AttachFileIcon />
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message |"
            className="flex-1 px-3 py-2 focus:outline-none text-gray-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <div className="flex items-center gap-3">


          <EmojiPicker
              handleEmojiSelector={(emoji) => {
                const actualEmoji = String.fromCodePoint(parseInt(emoji, 16));
                setText(prev => prev + actualEmoji);
              }}
            />

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleAttachmentChange}
              className="hidden"
              id="imageInput"
            />
            <label htmlFor="imageInput" className="p-1.5 text-gray-500 hover:text-gray-700 cursor-pointer">
              <PhotoIcon />
            </label>

            <button
              onClick={handleSendMessage}
              disabled={!text.trim() && !file}
              className="p-2 bg-omblue-600 text-white rounded-lg disabled:opacity-50 disabled:bg-blue-400"
            >
              <SendMessageIcon />
            </button>
          </div>
        </div>
      </div>
      <LeaveGroupModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        communityName={group?.name}
        onConfirm={async () => {
          await communityApi.leaveCommunity(group?.id, userId);
          setShowLeaveModal(false);
        }}
      />
    </div>
  );
};

export default CommunityChat;