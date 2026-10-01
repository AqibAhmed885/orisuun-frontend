'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateCommunityModal from './create-community-modal';
import { toast } from 'react-toastify';

interface ChatNavigationProps {
  selectedView: 'chats' | 'community' | 'universal';
  onViewChange?: (view: 'chats' | 'community' | 'universal') => void;
  onNewChat?: () => void;
  chatsCount?: number;
}

export const ChatNavigation: React.FC<ChatNavigationProps> = ({
  selectedView,
  onViewChange,
  onNewChat,
  chatsCount = 0
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false);
  const router = useRouter();

  const handleViewChange = (view: 'chats' | 'community' | 'universal') => {
    setShowDropdown(false);
    if (onViewChange) {
      onViewChange(view);
    }

    // Navigate to appropriate route based on selection
    switch (view) {
      case 'universal':
        router.push('/universal');
        break;
      case 'community':
        router.push('/communities');
        break;
      case 'chats':
        router.push('/chats');
        break;
    }
  };

  return (
    <div className="items-center px-4 py-2 flex justify-between">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-gray-700 items-center h-9 text-sm p-2 font-medium border rounded-full bg-white sticky top-0 z-50 flex gap-2 hover:bg-gray-50 transition-colors"
        >
          {selectedView === 'chats'
            ? (chatsCount > 0 ? 'Recent Chats' : 'Start a Conversation')
            : selectedView === 'community'
              ? 'Communities'
              : 'Universal Chat'
          }
          <svg
            className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-50">
            <button
              onClick={() => handleViewChange('chats')}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 rounded-t-lg ${
                selectedView === 'chats' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Recent Chats
            </button>
            <button
              onClick={() => handleViewChange('community')}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                selectedView === 'community' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Communities
            </button>
            <button
              onClick={() => handleViewChange('universal')}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 rounded-b-lg ${
                selectedView === 'universal' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Universal Chat
            </button>
          </div>
        )}
      </div>

      {selectedView === 'chats' ? (
        <button
          onClick={onNewChat}
          className="rounded-full text-sm h-9 text-white font-semibold bg-[#192e8d] px-3 py-2 sticky transition-colors flex items-center gap-2"
          aria-label="Compose new message"
        >
          New Chat
        </button>
      ) : selectedView === 'community' ? (
        <>
          <button
            onClick={() => setShowCreateCommunityModal(true)}
              className="rounded-full text-sm text-white h-9 font-semibold bg-[#192e8d] px-3 py-2 sticky transition-colors flex items-center gap-2"
            aria-label="Create new community"
          >
            Create New Community
          </button>

          <CreateCommunityModal
            isOpen={showCreateCommunityModal}
            onClose={() => setShowCreateCommunityModal(false)}
            onCreate={async (data) => {
              try {
                toast.success('Community created Successfully');
                setShowCreateCommunityModal(false);
                router.refresh();
              } catch (e) {
                toast.error('Failed to create community');
              }
            }}
          />
        </>
      ) : null}
    </div>
  );
};
