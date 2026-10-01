import React from 'react';
import Image from 'next/image';

interface UniversalChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isOnline: boolean;
  unreadCount?: number;
  location: string;
  type: 'public' | 'open' | 'global';
}

interface UniversalChatProfileProps {
  universalChat: UniversalChat;
  isMobile?: boolean;
  onBack?: () => void;
}

const UniversalChatProfile: React.FC<UniversalChatProfileProps> = ({
  universalChat,
  isMobile = false,
  onBack
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'global':
        return '🌍';
      case 'open':
        return '🔓';
      case 'public':
        return '👥';
      default:
        return '💬';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'global':
        return 'bg-blue-100 text-blue-600';
      case 'open':
        return 'bg-green-100 text-green-600';
      case 'public':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Mock data for universal chat info
  const chatInfo = {
    description: "A global platform for entrepreneurs, investors, and innovators to connect, collaborate, and share insights across borders.",
    members: Math.floor(Math.random() * 50000) + 10000,
    activeUsers: Math.floor(Math.random() * 5000) + 1000,
    created: "January 2024",
    rules: [
      "Be respectful and professional in all interactions",
      "No spam or promotional content without permission",
      "Share meaningful insights and value with the community",
      "Use appropriate channels for different types of discussions"
    ]
  };

  const moderators = [
    { id: '1', name: 'Global Admin', avatar: '/api/placeholder/40/40', isVerified: true, role: 'System Admin', location: 'Global' },
    { id: '2', name: 'Sarah Chen', avatar: '/api/placeholder/40/40', isVerified: true, role: 'Community Manager', location: 'Singapore' },
    { id: '3', name: 'Mike Johnson', avatar: '/api/placeholder/40/40', isVerified: true, role: 'Technical Moderator', location: 'USA' },
  ];

  const topContributors = [
    { id: '1', name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', isVerified: true, contributions: 1247, location: 'Spain' },
    { id: '2', name: 'James Wilson', avatar: '/api/placeholder/32/32', isVerified: false, contributions: 1156, location: 'Canada' },
    { id: '3', name: 'Priya Patel', avatar: '/api/placeholder/32/32', isVerified: true, contributions: 1089, location: 'India' },
  ];

  const recentTopics = [
    { id: '1', title: 'AI in Healthcare: Future Opportunities', replies: 45, lastActivity: '2 hours ago' },
    { id: '2', title: 'Sustainable Tech Startups Discussion', replies: 32, lastActivity: '4 hours ago' },
    { id: '3', title: 'Global Investment Trends 2024', replies: 58, lastActivity: '6 hours ago' },
  ];

  return (
    <div className="bg-white h-full w-full md:w-80 flex flex-col">
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <h2 className="text-lg font-semibold">Chat Info</h2>
          <div></div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Chat Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="relative inline-block mb-4">
            <Image
              src={universalChat.avatar}
              alt={universalChat.name}
              width={80}
              height={80}
              className="rounded-xl object-cover mx-auto"
            />
            {universalChat.isOnline && (
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{universalChat.name}</h2>
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(universalChat.type)}`}>
              {getTypeIcon(universalChat.type)} {universalChat.type.charAt(0).toUpperCase() + universalChat.type.slice(1)} Chat
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{chatInfo.description}</p>
        </div>

        {/* Stats Section */}
        <div className="p-4 bg-gray-50 mx-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Chat Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{chatInfo.members.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{chatInfo.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <div className="text-sm text-gray-600">Created: {chatInfo.created}</div>
          </div>
        </div>

        {/* Moderators Section */}
        <div className="shadow-lg rounded-lg p-4 border border-gray-200 mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Moderators</h3>
          <div className="space-y-3">
            {moderators.map((mod) => (
              <div key={mod.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-gray-800">{mod.name}</span>
                    {mod.isVerified && (
                      <Image
                        src="/chat/verified.svg"
                        alt="Verified"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{mod.role} • {mod.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors Section */}
        <div className="shadow-lg rounded-lg p-4 border border-gray-200 mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Contributors</h3>
          <div className="space-y-4">
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 ? 'bg-gray-400 text-gray-900' : 
                    'bg-orange-400 text-orange-900'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-800">{contributor.name}</span>
                    {contributor.isVerified && (
                      <Image
                        src="/chat/verified.svg"
                        alt="Verified"
                        width={14}
                        height={14}
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-600 font-medium">{contributor.contributions} contributions</span>
                    <span className="text-xs text-gray-500">• {contributor.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Topics Section */}
        <div className="shadow-lg rounded-lg p-4 border border-gray-200 mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Hot Topics</h3>
          <div className="space-y-3">
            {recentTopics.map((topic) => (
              <div key={topic.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-800 mb-2">{topic.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{topic.replies} replies</span>
                  <span>{topic.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Section */}
        <div className="shadow-lg rounded-lg p-4 border border-gray-200 mx-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Rules</h3>
          <div className="space-y-2">
            {chatInfo.rules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalChatProfile;
