import { leaderboard } from "@/app/api/dashboard/leaderboard";
import getRolesIcon from "@/icons/chats/role-icons";
import { SmileIcon, UserCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Smile } from "react-feather";
import FileCard from "../../chats/components/file-card";
import axios from "axios";
import { toast } from "react-toastify";
import MessageIcon from "@/icons/message-icon";
import { checkOnlineStatus } from "@/utils/helper";

type FileType = 'image' | 'pdf' | 'audio' | 'webp' | 'webm' | 'video' | 'zip' | 'heic' |
  'csv' | 'document' | 'excel' | 'powerpoint' | 'ics' | 'html' | 'figma' | 'other' |
  'adobe' | 'email' | 'gif';

// Helper function to determine file type
const getFileType = (fileName: string | undefined): FileType => {
  if (!fileName) return 'other';  // Handle null/undefined fileName

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
  return 'other';
};

interface CommunityChatCardProps {
  id: string;  // Add chat ID for like functionality
  name: string;
  lastMessage?: string;
  unreadCount?: number;
  avatarUrl?: string;
  selected?: boolean;
  onClick?: () => void;
  time?: string;
  verified?: boolean;
  roleBadge?: string;
  locationBadge?: string;
  locationCity?: string;
  isOnline?: boolean;
  LastActive?: string;
  replyPreview?: {
    author: string;
    text: string;
    avatarUrl?: string;
  } | null;
  reactions: {
    ChatId: string;
    TotalReactions: number;
    LikesCount: number;
    EmojiReactions: any[];
    Reactions: any[];
  };
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name?: string;
    size?: number;
  }[];
  chatDocument?: {
    Document?: string;
    FileName?: string;
    Size?: number | string;
  };
  onDelete?: (chatId: string) => void;  // Callback to delete a post
  onReply?: (message: any) => void;  // Callback when reply button is clicked
  isUserCommunityAdmin?: boolean;  // New prop to indicate if current user is admin
  currentUserId?: string;  // Add current user ID for like functionality
  onLikeToggle?: () => void;  // Callback to refresh messages after like
}

export const CommunityChatCard: React.FC<CommunityChatCardProps> = ({
  id,
  name,
  lastMessage,
  unreadCount,
  avatarUrl,
  selected,
  onClick,
  time,
  verified,
  roleBadge,
  locationBadge,
  locationCity,
  isOnline = true,
  LastActive,
  replyPreview,
  reactions = {
    ChatId: '',
    TotalReactions: 0,
    LikesCount: 0,
    EmojiReactions: [],
    Reactions: []
  },
  attachments,
  chatDocument,
  onLikeToggle,
  currentUserId,
  onDelete,
  isUserCommunityAdmin,
  onReply,
  ...props
}) => {
  const [countryFlagUrl, setCountryFlagUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<{ [key: string]: boolean }>({});
  const [showMoreOptions, setShowMoreOptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    let isMounted = true;
    if (locationBadge) {
      leaderboard.fetchCountryFlag(locationBadge).then(url => {
        if (isMounted) setCountryFlagUrl(url);
      });
    } else {
      setCountryFlagUrl(null);
    }
    return () => { isMounted = false; };
  }, [locationBadge]);

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

    // Check if emojiString is defined and is a string before calling toLowerCase
    return emojiMap[emojiString] || emojiString;
  };


  const handleAddEmojiReaction = async (chatId: string, emoji: string) => {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await axios.post(
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

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    if (!currentUserId) {
      toast.error('User not authenticated');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/ToggleLike?userId=${currentUserId}`,
        {
          ChatId: id
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

  return (
    <div
      className={`group w-full relative cursor-pointer transition-colors p-2 rounded-lg ${selected ? 'bg-slate-50' : 'hover:bg-[#F6F9FF]'} `}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200" />
          )}

          {checkOnlineStatus(LastActive) === 'online' ? (
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
          <div className="flex items-center justify-between">
            <div className="flex flex-col  gap-2">
              <div className="flex gap-2 items-center">
                <h2 className="font-semibold text-slate-800 text-base">{name}</h2>
                {verified && (
                  <Image src={'/chat/verified.svg'} alt="verified" width={16} height={16} />
                )}
                <div className="text-sm text-slate-400 ">{time}</div>
              </div>

              <div className="flex items-center gap-2">
                {roleBadge && (
                  <span className="text-sm font-medium flex items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-full border border-[#D1E9FF]">
                    {getRolesIcon(roleBadge)}
                    {roleBadge === "Black-owned Business" ? "Business" : roleBadge}
                  </span>
                )}
                {locationBadge && (

                  <span className="flex text-sm font-medium items-center text-slate-600 gap-2 bg-[#F5FAFF] px-2 py-1 rounded-md">

                    {countryFlagUrl && (
                      <Image
                        src={countryFlagUrl}
                        alt={locationBadge}
                        width={80}
                        height={80}
                        className="rounded-[3px] w-5 h-4 object-full"
                      />
                    )}
                    <span>{locationCity}</span></span>
                )}
              </div>
            </div>
          </div>

          {/* Message block */}
          <div className="mt-1 text-slate-700">
            {replyPreview && (
              <div className="mb-3 rounded-lg border border-slate-100 bg-white p-3">
                <div className="flex items-center gap-2">
                  {replyPreview.avatarUrl ? (
                    <Image src={replyPreview.avatarUrl} alt={replyPreview.author} width={32} height={32} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                  )}
                  <div className="text-base tracking-wide">
                    <div className="font-semibold  text-slate-800">{replyPreview.author}</div>
                    <div className="text-base font-medium text-slate-500">{replyPreview.text}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-base leading-relaxed font-medium text-[#5B657B] line-clamp-2 my-1.5 tracking-wide px-1">{lastMessage}</div>

            {attachments && attachments.map((attachment, index) => (
              <div key={index} className="mt-3">
                <FileCard
                  isSent={true}
                  fileName={attachment.name || 'File'}
                  fileSize={attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : 'Unknown size'}
                  fileType={getFileType(attachment.url)}
                  fileUrl={attachment.url}
                />
              </div>
            ))}

            {/* Handle both ChatDocument and AttachmentUrl */}
            { /* single chatDocument (if present) */}
            {chatDocument && chatDocument.Document  && (
              <div className="mt-3">
                <FileCard
                  isSent={true}
                  fileName={chatDocument.FileName }
                  fileSize={chatDocument.Size !== undefined ? String(chatDocument.Size) : undefined}
                  fileType={getFileType(chatDocument.FileName || chatDocument.Document)}
                  fileUrl={chatDocument.Document }
                />
              </div>
            )}

            
          </div>

          {/* Reactions / actions */}
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              className="flex items-center border rounded-full px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
              aria-label="like"
              onClick={handleLikeToggle}
            >
              <Image src="/chat/heart.png" alt="Like" width={12} height={12} className="w-3 h-3" />
              <span className="text-slate-700  text-xs">{reactions.LikesCount}</span>
            </button>

            <div className="flex items-center px-2 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-sm relative">
              {!reactions.Reactions || reactions.EmojiReactions.length === 0 ? (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setShowEmojiPicker(prev => ({ ...prev, [id]: !prev[id] }));
                  }}
                  className="hover:bg-gray-100 rounded-full px-1"
                  type="button"
                >
                  <SmileIcon className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center">
                  {reactions.EmojiReactions.map((reaction) => (
                    <button
                      key={reaction.Emoji}
                      onClick={e => {
                        e.stopPropagation();
                        setShowEmojiPicker(prev => ({ ...prev, [id]: !prev[id] }));
                      }}
                      className="flex items-center justify-center hover:bg-gray-100 rounded-full"
                      type="button"
                    >
                      {/* image icon for the emoji */}
                      <span className="">{getEmojiDisplay(reaction.Emoji)}</span>
                    </button>
                  ))}
                </div>
              )}

              {reactions.Reactions.length > 0 && (
                <span className="text-gray-600 text-xs ">
                  {reactions.EmojiReactions.length > 0 ? reactions.EmojiReactions.reduce((sum, r) => sum + (r.Count || 0), 0) : null}
                </span>
              )}

              {/* Emoji Picker Popup (unchanged) */}
              {showEmojiPicker[id] && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
                  <div className="flex gap-1">
                    {['like', 'heart', 'laugh', 'wow', 'sad', 'angry'].map(emoji => (
                      <button
                        key={emoji}
                        className="p-1 hover:bg-gray-100 rounded text-lg"
                        onClick={() => {
                          handleAddEmojiReaction(id, emoji);
                          setShowEmojiPicker(prev => ({ ...prev, [id]: false }));
                        }}
                        type="button"
                      >
                        <span>{getEmojiDisplay(emoji)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-4 -top-3 bg-white border border-gray-100 p-1 rounded-md flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {/* Reaction Picker Icon */}
        <div className="flex relative">
          <button
            className="rounded-full hover:bg-gray-100 p-1"
            title="Add Reaction"
            onClick={() => setShowEmojiPicker(prev => ({ ...prev, [`hover-${id}`]: !prev[`hover-${id}`] }))}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.18679 8.64703C5.18679 8.64703 6.0206 9.75877 7.41028 9.75877C8.79996 9.75877 9.63377 8.64703 9.63377 8.64703M9.0779 5.86767H9.08346M5.74267 5.86767H5.74823M12.969 7.53528C12.969 10.6053 10.4803 13.094 7.41028 13.094C4.34029 13.094 1.85156 10.6053 1.85156 7.53528C1.85156 4.46529 4.34029 1.97656 7.41028 1.97656C10.4803 1.97656 12.969 4.46529 12.969 7.53528ZM9.35584 5.86767C9.35584 6.02117 9.2314 6.1456 9.0779 6.1456C8.9244 6.1456 8.79996 6.02117 8.79996 5.86767C8.79996 5.71417 8.9244 5.58973 9.0779 5.58973C9.2314 5.58973 9.35584 5.71417 9.35584 5.86767ZM6.0206 5.86767C6.0206 6.02117 5.89617 6.1456 5.74267 6.1456C5.58917 6.1456 5.46473 6.02117 5.46473 5.86767C5.46473 5.71417 5.58917 5.58973 5.74267 5.58973C5.89617 5.58973 6.0206 5.71417 6.0206 5.86767Z" stroke="#465472" strokeWidth="1.33409" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* Quick emoji picker for hover */}
          {showEmojiPicker[`hover-${id}`] && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
              <div className="flex gap-1">
                {['like', 'heart', 'laugh', 'wow', 'sad', 'angry'].map(emoji => (
                  <button
                    key={emoji}
                    className="p-1 hover:bg-gray-100 rounded text-lg"
                    onClick={() => {
                      handleAddEmojiReaction(id, emoji);
                      setShowEmojiPicker(prev => ({ ...prev, [id]: false, [`hover-${id}`]: false }));
                    }}
                    type="button"
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
          onClick={() => onReply?.({ id, name, lastMessage, avatarUrl, time, verified, roleBadge, locationBadge, locationCity, isOnline, LastActive, replyPreview, reactions, attachments, chatDocument })}  // Pass the entire message object
        >
          <MessageIcon />
        </button>
        {/* three dots for the delete post */}
        {isUserCommunityAdmin ? (
        <div className="relative">
          <button
            className="rounded-full hover:bg-gray-100 p-1"
            title="More options"
            onClick={() => setShowMoreOptions(prev => ({ ...prev, [id]: !prev[id] }))}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 11.25C8.32843 11.25 9 10.5784 9 9.75C9 8.92157 8.32843 8.25 7.5 8.25C6.67157 8.25 6 8.92157 6 9.75C6 10.5784 6.67157 11.25 7.5 11.25Z" fill="#465472" />
              <path d="M7.5 6.75C8.32843 6.75 9 6.07843 9 5.25C9 4.42157 8.32843 3.75 7.5 3.75C6.67157 3.75 6 4.42157 6 5.25C6 6.07843 6.67157 6.75 7.5 6.75Z" fill="#465472" />
              <path d="M7.5 15C8.32843 15 9 14.3284 9 13.5C9 12.6716 8.32843 12 7.5 12C6.67157 12 6 12.6716 6 13.5C6 14.3284 6.67157 15 7.5 15Z" fill="#465472" />
            </svg>
          </button>
          {showMoreOptions[id] && (
            <div className="absolute top-full w-36 right-0 mt-1 bg-white rounded-lg shadow-lg  z-20">
              <div className="flex flex-col">
                
                <button
                  className="py-1 px-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    onDelete(id);
                    setShowMoreOptions(prev => ({ ...prev, [id]: false }));
                  }}
                >
                  Delete Post
                </button>
                
              </div>
            </div>
          )}
          </div>
        ) : null}
      </div>
    </div>
  );
};