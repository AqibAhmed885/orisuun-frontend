// Example: BrowseDropdown.tsx
import React, { useState } from 'react';

// This will be populated from the data prop



// Define TrendingCommunity type (matches the main component)
type TrendingCommunity = {
  id: string;
  title: string;
  description: string;
  image: string;
  members: number;
  isJoined?: boolean;
  city?: string;
  country?: string;
};

type BrowseDropdownProps = {
  open: boolean;
  onClose: () => void;
  data: TrendingCommunity[];
  onSelectLocation: (loc: string) => void;
  onSelectSubject: (sub: string) => void;
};

const BrowseDropdown: React.FC<BrowseDropdownProps> = ({
  open, onClose, data, onSelectLocation, onSelectSubject
}) => {
  const [activeTab, setActiveTab] = useState<'Location' | 'Subject'>('Location');
  const [search, setSearch] = useState('');

  // Extract unique locations (combining city and country) from the communities data
  const locations = data ? Array.from(new Set(
    data
      .map(community => {
        const cityAndCountry = [community.city, community.country]
          .filter(Boolean)
          .join(', ');
        return cityAndCountry || null;
      })
      .filter(Boolean)
  )) : [];

  // Extract unique subjects (using titles for now)
  const subjects = data ? Array.from(new Set(data.map(community => community.title))) : [];

  const items =
    activeTab === 'Location'
      ? locations.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()))
      : subjects.filter((sub) => sub.toLowerCase().includes(search.toLowerCase()));

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-[700px] h-[400px] md:h-[550px] bg-white shadow-lg rounded-lg z-50 flex">
      {/* Sidebar Tabs */}
      <div className="w-32 md:w-48 border-r flex flex-col py-4 md:py-6 px-3 md:px-4">
        <span className="text-sm font-semibold mb-3 md:mb-4">Browse by</span>
        <button
          className={`text-left px-2 md:px-3 py-2 rounded mb-2 font-medium text-sm ${
            activeTab === 'Location' ? 'bg-white text-[#2357C6]' : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('Location')}
        >
          Location
        </button>
        <button
          className={`text-left px-2 md:px-3 py-2 rounded font-medium text-sm ${
            activeTab === 'Subject' ? 'bg-white text-[#2357C6]' : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('Subject')}
        >
          Subject
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-6">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={activeTab === 'Location' ? 'Search city' : 'Search subject'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul className="overflow-y-auto flex-1">
          {items.length === 0 ? (
            <li className="text-gray-400 py-2 px-2">No results found</li>
          ) : (
            items.map((item, idx) => (
              <li
                key={idx}
                className="py-2 px-2 cursor-pointer hover:bg-blue-50 rounded text-gray-800"
                onClick={() => {
                  if (activeTab === 'Location') onSelectLocation(item);
                  else onSelectSubject(item);
                  onClose();
                }}
              >
                {item}
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Close area (optional) */}
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default BrowseDropdown;