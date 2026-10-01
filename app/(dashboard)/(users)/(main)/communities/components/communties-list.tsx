'use client';
import Image from "next/image";
import { ChatNavigation } from '@/app/(dashboard)/(users)/(main)/communities/components/chat-navigation';
import { useState, useEffect } from "react";
import { CommunityChatCard } from "./community-chat-card";
import { CommunityCard } from "./community.card";
import { useSelector } from "react-redux";
import EmptyIcon from "@/icons/community/empty";
import { communityApi } from "@/app/api/dashboard/community";
import CreateCommunityModal from "@/app/(dashboard)/(users)/(main)/communities/components/create-community-modal";

interface DummyCommunity {
  id: string;
  name: string;
  avatar?: string | null;
  lastSender?: string;
  lastMessage?: string;
  time?: string;
  isVerified?: boolean;
  role?: string;
  location?: string;
  isOnline?: boolean;
  replyPreview?: { author: string; text: string; avatarUrl?: string | null } | null;
  reactions?: { emoji: string; count: number }[];
  unreadCount?: number;
  members?: any[];
  createdByVerified?: boolean;
}

type Props = {
  onSelect?: (community: DummyCommunity) => void;
  isCommunitySelected?: boolean;
  refreshTrigger?: number; // New prop

  };

const CommunitiesList: React.FC<Props> = ({ onSelect, isCommunitySelected, refreshTrigger }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const userId = useSelector((state: any) => state.user?.currentUser?.UserId || state.auth?.user?.id || '');

  // use API-backed communities; start with dummy while loading
  const [communitiesState, setCommunitiesState] = useState<DummyCommunity[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      
      if (!userId) {
        setCommunitiesState([]);
        return;
      }

      setLoading(true);
      try {
        const remote = await communityApi.getUserCommunities(userId);
        // map remote Community to DummyCommunity shape
        
        const mapped = remote.map((c) => ({
          id: c.id,
          name: c.name,
          avatar: c.avatar,
          lastSender: c.lastSender,
          lastMessage: c.lastMessage,
          time: c.time,
          isVerified: !!c.isVerified,
          role: undefined,
          location: undefined,
          isOnline: false,
          replyPreview: null,
          reactions: [],
          unreadCount: 0,
          members: Array.isArray(c.members) ? c.members : [],
          createdByVerified: c.createdByVerified,
        }));

        if (!cancelled) {
          setCommunitiesState(mapped.length ? mapped : []);
        }
      } catch (err) {
        console.error('Load communities failed', err);
        if (!cancelled) setCommunitiesState([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [userId, refreshTrigger]);

  const communities = communitiesState.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (community: DummyCommunity) => {
    setSelectedId(community.id);
    if (onSelect) onSelect(community);
  };

  const handleCreateSuccess = (created: any) => {
    // Map backend response to DummyCommunity shape (adjust fields as needed)
    const mapped: DummyCommunity = {
      id: created?.Id ?? created?.id ?? String(Date.now()),
      name: created?.Name ?? created?.name ?? 'New community',
      avatar: created?.ProfilePhotoUrl ?? created?.avatar ?? '/chat/user-avatar.png',
      lastSender: '',
      lastMessage: created?.Description ?? '',
      time: created?.CreatedAt ? new Date(created.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      isVerified: false,
      role: undefined,
      location: undefined,
      isOnline: false,
      replyPreview: null,
      reactions: [],
      unreadCount: 0,
    };
    // prepend to list and select
    setCommunitiesState(prev => [mapped, ...prev]);
    setSelectedId(mapped.id);
    if (onSelect) onSelect(mapped);
    setIsCreateOpen(false);
  };
  

  return (
    <>
      <div className={`bg-white shadow-xl rounded-md overflow-hidden h-full
        w-full 
       `}>
        {/* Header */}
        <ChatNavigation
          selectedView="community"
          chatsCount={0}
        />
        <div className="pt-4 pb-2 px-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search your communities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Communities List */}
        <div className="flex overflow-y-auto h-full">
          <div className="w-full">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-base font-semibold text-gray-800">Your Communities</h3>
            </div>

            <div className="space-y-2 px-4 pb-6">
              {loading ? (
                // Loading skeleton
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3 py-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : communities.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-20">
                  <EmptyIcon />
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">No Community Yet</h2>
                  <p className="text-base text-gray-400 mb-6 text-center max-w-xs">
                    Set the tone for what matters. Create a space where others can connect, share, and grow.
                  </p>
                  <button
                    className="px-4 py-2 border border-[#85A9F6] rounded-lg bg-[#F6F9FF] text-[#2357C6] font-medium shadow hover:bg-[#85A9F6] transition"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    Create New Community
                  </button>
                </div>
              ) : (
                communities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    id={community.id}
                    name={community.name}
                    avatarUrl={community.avatar}
                    sender={community.lastSender || ''}
                    verified={!!community.createdByVerified}
                    description={community.lastMessage || ''}
                    createdByVerified={community.createdByVerified}
                    members={Array.isArray(community?.members) ? community.members : []}
                    onClick={() => handleSelect(community)}
                    userId={userId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <CreateCommunityModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </>
  );
}

export default CommunitiesList;